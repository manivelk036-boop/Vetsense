import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AnimalList } from './components/AnimalList';
import { AnimalProfile } from './components/AnimalProfile';
import { MilkingSessionView } from './components/MilkingSessionView';
import { AlertsView } from './components/AlertsView';
import { ManualDataEntry } from './components/ManualDataEntry';
import { VeterinarianDashboard } from './components/VeterinarianDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { WorkflowModal } from './components/WorkflowModal';
import { LoginModal } from './components/LoginModal';
import { BottomNav } from './components/BottomNav';

import {
  UserRole, Language, Animal, AlertItem, HistoricalRecord,
  HerdRiskData, GISFarm, ModelInfo, SensorStatus, DataQuality
} from './types';
import {
  MOCK_ANIMALS, COW001_HISTORY_30D, MOCK_ALERTS, MOCK_HERD_RISK,
  MOCK_GIS_FARMS, MOCK_MODEL_INFO, MOCK_SENSOR_STATUS, MOCK_DATA_QUALITY
} from './mockData';
import { api } from './api';

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('FARMER');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('COW001');

  // Core Data States
  const [animals, setAnimals] = useState<Animal[]>(MOCK_ANIMALS);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [history, setHistory] = useState<HistoricalRecord[]>(COW001_HISTORY_30D);
  const [herdRisk, setHerdRisk] = useState<HerdRiskData>(MOCK_HERD_RISK);
  const [gisFarms, setGisFarms] = useState<GISFarm[]>(MOCK_GIS_FARMS);
  const [modelInfo, setModelInfo] = useState<ModelInfo>(MOCK_MODEL_INFO);
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>(MOCK_SENSOR_STATUS);
  const [dataQuality, setDataQuality] = useState<DataQuality>(MOCK_DATA_QUALITY);

  // Modals
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initial fetch from backend if running, or gracefully use mock
  useEffect(() => {
    async function loadData() {
      try {
        const [a, al, hr, gf, mi, ss, dq] = await Promise.all([
          api.getAnimals(),
          api.getAlerts(),
          api.getHerdRisk(),
          api.getGisFarms(),
          api.getModelInfo(),
          api.getSensorsStatus(),
          api.getDataQuality()
        ]);
        if (a) setAnimals(a);
        if (al) setAlerts(al);
        if (hr) setHerdRisk(hr);
        if (gf) setGisFarms(gf);
        if (mi) setModelInfo(mi);
        if (ss) setSensorStatus(ss);
        if (dq) setDataQuality(dq);
      } catch (err) {
        console.log("Using built-in simulation fallback", err);
      }
    }
    loadData();
  }, []);

  // Fetch animal history when selected animal changes
  useEffect(() => {
    async function loadAnimalHistory() {
      const hist = await api.getAnimalHistory(selectedAnimalId, 30);
      if (hist && hist.length > 0) {
        setHistory(hist);
      }
    }
    loadAnimalHistory();
  }, [selectedAnimalId]);

  const handleSelectAnimal = (id: string) => {
    setSelectedAnimalId(id);
    setActiveTab('profile');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'FARMER') {
      setActiveTab('dashboard');
    } else if (role === 'VETERINARIAN') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('gis');
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    await api.acknowledgeAlert(id);
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleAssignVet = (animalId: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.animal_id === animalId
          ? { ...a, assigned_vet: "Dr. Ramesh Sharma (B.V.Sc)" }
          : a
      )
    );
    // Switch to Vet view to simulate handoff
    setCurrentRole('VETERINARIAN');
    setActiveTab('dashboard');
  };

  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;
  const currentAnimal = animals.find(a => a.animal_id === selectedAnimalId) || animals[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenWorkflow={() => setIsWorkflowOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        
        {/* Role: VETERINARIAN (when on dashboard) */}
        {currentRole === 'VETERINARIAN' && activeTab === 'dashboard' ? (
          <VeterinarianDashboard
            animals={animals}
            language={language}
            onSelectAnimal={handleSelectAnimal}
            onOutcomeSaved={async () => {
              const mi = await api.getModelInfo();
              setModelInfo(mi);
            }}
          />
        ) : (
          <>
            {/* View Switcher */}
            {activeTab === 'dashboard' && (
              <FarmerDashboard
                animals={animals}
                alerts={alerts}
                language={language}
                onSelectAnimal={handleSelectAnimal}
                onStartMilking={() => {
                  setSelectedAnimalId('COW001');
                  setActiveTab('milking');
                }}
                onViewAlerts={() => setActiveTab('alerts')}
              />
            )}

            {activeTab === 'animals' && (
              <AnimalList
                animals={animals}
                onSelectAnimal={handleSelectAnimal}
              />
            )}

            {activeTab === 'profile' && (
              <AnimalProfile
                animal={currentAnimal}
                history={history}
                language={language}
                onBack={() => setActiveTab('animals')}
                onAssignVet={handleAssignVet}
              />
            )}

            {activeTab === 'milking' && (
              <MilkingSessionView
                language={language}
                onViewAnimalProfile={handleSelectAnimal}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsView
                alerts={alerts}
                language={language}
                onAcknowledge={handleAcknowledgeAlert}
                onViewAnimal={handleSelectAnimal}
                onAssignVet={handleAssignVet}
              />
            )}

            {activeTab === 'data_entry' && (
              <ManualDataEntry
                animals={animals}
                language={language}
                onSaved={handleSelectAnimal}
              />
            )}

            {(activeTab === 'herd' || activeTab === 'gis' || activeTab === 'model') && (
              <AdminDashboard
                gisFarms={gisFarms}
                herdRisk={herdRisk}
                modelInfo={modelInfo}
                sensorStatus={sensorStatus}
                dataQuality={dataQuality}
                language={language}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Farmer Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        unreadCount={unreadAlertsCount}
      />

      {/* Interactive System Workflow Modal */}
      <WorkflowModal
        isOpen={isWorkflowOpen}
        onClose={() => setIsWorkflowOpen(false)}
        onJumpToAnimal={handleSelectAnimal}
      />

      {/* Login / Demo Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLogin={(role) => {
          handleRoleChange(role);
          setIsLoginModalOpen(false);
        }}
        onClose={() => setIsLoginModalOpen(false)}
      />

    </div>
  );
}

export default App;
