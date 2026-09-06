import React, { useState } from 'react';
import {
  MapPin, Activity, Database, Cpu, ShieldAlert,
  CheckCircle2, RefreshCw, BarChart2, Layers, AlertCircle, TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  GISFarm, HerdRiskData, ModelInfo, SensorStatus,
  DataQuality, Language
} from '../types';
import { translations } from '../i18n/translations';
import { api } from '../api';

// Configure Leaflet custom risk marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

interface AdminDashboardProps {
  gisFarms: GISFarm[];
  herdRisk: HerdRiskData;
  modelInfo: ModelInfo;
  sensorStatus: SensorStatus;
  dataQuality: DataQuality;
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  gisFarms,
  herdRisk,
  modelInfo,
  sensorStatus,
  dataQuality,
  language
}) => {
  const t = translations[language] || translations.en;
  const [selectedFarm, setSelectedFarm] = useState<GISFarm | null>(gisFarms[0] || null);
  const [modelState, setModelState] = useState<ModelInfo>(modelInfo);
  const [isRetraining, setIsRetraining] = useState(false);
  const [activeTab, setActiveTab] = useState<'gis' | 'herd' | 'models' | 'ingestion'>('gis');

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      const res = await api.retrainModel();
      if (res && res.updated_model_info) {
        setModelState(res.updated_model_info);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsRetraining(false), 1200);
    }
  };

  const pieData = [
    { name: 'No Risk', value: 62, color: '#10b981' },
    { name: 'Low Risk', value: 18, color: '#3b82f6' },
    { name: 'Moderate Risk', value: 12, color: '#f59e0b' },
    { name: 'High Risk', value: 8, color: '#e11d48' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Central Animal Health Authority & Regional GIS Surveillance
            </span>
          </div>
          <h2 className="text-2xl font-black text-white m-0">
            Multi-Farm Herd Intelligence & Model Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial epidemiological surveillance across Indian dairy cooperatives & districts.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700 text-xs font-bold">
          <button
            onClick={() => setActiveTab('gis')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'gis' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            GIS Surveillance Map
          </button>
          <button
            onClick={() => setActiveTab('herd')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'herd' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Herd Intelligence
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'models' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Model Governance
          </button>
          <button
            onClick={() => setActiveTab('ingestion')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ingestion' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Ingestion & Sensors
          </button>
        </div>
      </div>

      {/* TAB 1: GIS SURVEILLANCE MAP */}
      {activeTab === 'gis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Interactive Leaflet Map */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[460px] flex flex-col">
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Regional Farm Disease Risk Geolocation
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Click a pin to view farm details</span>
              </div>

              <div className="flex-1 relative">
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {gisFarms.map((farm) => {
                    const color =
                      farm.risk_status === 'HIGH RISK'
                        ? '#e11d48'
                        : farm.risk_status === 'MODERATE RISK'
                        ? '#f59e0b'
                        : farm.risk_status === 'LOW RISK'
                        ? '#3b82f6'
                        : '#10b981';

                    return (
                      <Marker
                        key={farm.id}
                        position={[farm.lat, farm.lng]}
                        icon={createCustomIcon(color)}
                        eventHandlers={{
                          click: () => setSelectedFarm(farm)
                        }}
                      >
                        <Popup>
                          <div className="text-xs space-y-1 p-1">
                            <strong className="block text-slate-900">{farm.name}</strong>
                            <span className="text-slate-500">{farm.district}, {farm.state}</span>
                            <div className="font-bold text-rose-600 pt-1">
                              Risk: {farm.herd_risk_pct}% ({farm.risk_status})
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>

            {/* Farm Detail Side Panel */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Selected Farm Telemetry
                </h3>

                {selectedFarm ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <h4 className="text-base font-black text-slate-900">{selectedFarm.name}</h4>
                      <p className="text-slate-500 font-medium">{selectedFarm.district}, {selectedFarm.state}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Total Herd</span>
                        <span className="text-xl font-black text-slate-900">{selectedFarm.total_animals} cows</span>
                      </div>
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                        <span className="text-rose-700 block text-[10px] font-bold">High Risk Animals</span>
                        <span className="text-xl font-black text-rose-600">{selectedFarm.high_risk_count}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-amber-900">Herd Risk Score</span>
                        <span className="font-black text-amber-950 text-sm">{selectedFarm.herd_risk_pct}%</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-600 h-full rounded-full"
                          style={{ width: `${selectedFarm.herd_risk_pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase block mt-1.5">
                        Status: {selectedFarm.risk_status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-0.5">Recent Geospatial Alert:</span>
                      <p className="text-slate-600">{selectedFarm.recent_alert}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Select a farm on the map</p>
                )}
              </div>

              {/* Disease Cluster Indicator */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-950">
                <div className="flex items-center gap-2 font-black text-rose-900 mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Regional Risk Cluster Notice
                </div>
                <p className="leading-relaxed">
                  Elevated high-risk clusters detected in Northern Punjab (Ludhiana) and Central Gujarat (Anand) correlates with seasonal monsoon humidity peaks.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 2: HERD INTELLIGENCE */}
      {activeTab === 'herd' && (
        <div className="space-y-6">
          
          {/* Section 12 & 13: Herd Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Total Monitored Animals</span>
              <span className="text-4xl font-black text-slate-900">100</span>
              <span className="text-xs text-slate-400 block mt-1">Multi-barn cooperative cohort</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
              <span className="text-xs font-bold text-amber-800 uppercase block mb-1">Aggregate Herd Risk</span>
              <span className="text-4xl font-black text-amber-600">64%</span>
              <span className="text-xs font-bold text-amber-700 block mt-1">MODERATE / ELEVATED</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Average Conductivity</span>
              <span className="text-4xl font-black text-slate-800">5.75</span>
              <span className="text-xs text-slate-400 block mt-1">mS/cm (Herd baseline: 5.5 mS)</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Average Somatic Cells</span>
              <span className="text-4xl font-black text-slate-800">142K</span>
              <span className="text-xs text-slate-400 block mt-1">cells/mL (Subclinical &lt; 200K)</span>
            </div>
          </div>

          {/* Section 13: 4-Week Increasing Herd Risk Trajectory Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Section 13: Herd Risk Trajectory (Week 1 → Week 4 Forecast)
                </h3>
                <p className="text-xs text-slate-500">
                  AI identifies an escalating herd-level risk trend: high-risk animals increasing from 4 to 14.
                </p>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                "Increasing herd-level risk trend."
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={herdRisk.weekly_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="high_risk_count" name="High Risk Cows" fill="#e11d48" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="herd_risk_pct" name="Herd Risk %" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-black text-slate-900 mb-3">Herd Risk Category Distribution (100 Animals)</h4>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-center space-y-3 text-xs">
              <h4 className="text-sm font-black text-slate-900">Epidemiological Guidelines</h4>
              <p className="text-slate-600 leading-relaxed">
                When herd-level risk crosses 50%, subclinical transmission within milking clusters becomes probable. 
                Veterinary health authorities recommend cluster disinfection between cows and teat dip immersion checks.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                <strong>Scientific Safeguard: </strong>
                Do not claim an actual disease outbreak unless confirmed bacteriological culture data supports it.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: AI MODEL GOVERNANCE & PERFORMANCE */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          
          {/* Section 23 & 24: Model Performance Metrics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">
                    AI Predictive Model Performance & Validation
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                    PROTOTYPE / SIMULATED RESULTS
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluated using time-based longitudinal cross-validation against 7–14 day forecast horizons.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetrain}
                  disabled={isRetraining}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
                  {isRetraining ? 'Retraining Baseline...' : 'Train / Retrain Model'}
                </button>
              </div>
            </div>

            {/* Performance KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">Accuracy</span>
                <span className="text-2xl font-black text-slate-900">{(modelState.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">Precision</span>
                <span className="text-2xl font-black text-emerald-700">{(modelState.precision * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">Recall (Sensitivity)</span>
                <span className="text-2xl font-black text-emerald-700">{(modelState.recall * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">F1 Score</span>
                <span className="text-2xl font-black text-indigo-700">{(modelState.f1_score * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] font-bold">ROC-AUC</span>
                <span className="text-2xl font-black text-slate-900">{modelState.roc_auc.toFixed(3)}</span>
              </div>
            </div>

            {/* 7-Day vs 14-Day Horizon Accuracy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-emerald-900 block text-sm">7-Day Forecast Horizon Accuracy</span>
                  <span className="text-emerald-700">Early physiological deviations captured</span>
                </div>
                <span className="text-2xl font-black text-emerald-800">
                  {(modelState.forecast_7d_accuracy * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-blue-900 block text-sm">14-Day Forecast Horizon Accuracy</span>
                  <span className="text-blue-700">Subclinical trend forecasting</span>
                </div>
                <span className="text-2xl font-black text-blue-800">
                  {(modelState.forecast_14d_accuracy * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Confusion Matrix Table */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3">
                Confusion Matrix (Longitudinal Validation Cohort)
              </h4>
              <div className="max-w-md mx-auto grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-700 block">True Positives (TP)</span>
                  <span className="text-xl font-black text-emerald-900">{modelState.confusion_matrix.true_positive}</span>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[10px] font-bold text-rose-700 block">False Positives (FP)</span>
                  <span className="text-xl font-black text-rose-900">{modelState.confusion_matrix.false_positive}</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-700 block">False Negatives (FN)</span>
                  <span className="text-xl font-black text-amber-900">{modelState.confusion_matrix.false_negative}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-700 block">True Negatives (TN)</span>
                  <span className="text-xl font-black text-slate-900">{modelState.confusion_matrix.true_negative}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 24: Model Version Registry */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase block">Active Primary Engine</span>
              <h4 className="text-base font-black text-slate-900">{modelState.current_model}</h4>
              <span className="text-xs text-slate-500">
                Version: {modelState.model_version} • Dataset Size: {modelState.training_dataset_size.toLocaleString()} records • Last Retrained: {modelState.last_training_date}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">Future Pipeline:</span>
              <span>{modelState.future_model}</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: DATA INGESTION, SENSORS & DATA QUALITY */}
      {activeTab === 'ingestion' && (
        <div className="space-y-6">
          
          {/* Section 15 & 16: Sensor Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              Hardware Telemetry & Inline Sensor Monitor
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {Object.entries(sensorStatus).map(([name, s]) => (
                <div key={name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 capitalize block">
                      {name.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      Last: {s.last_reading}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {s.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{s.battery}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 25: Data Quality Health */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              Sensor Stream Data Quality & Integrity Validation
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">Milk Flow/EC Validity</span>
                <span className="text-2xl font-black text-emerald-700">{dataQuality.milk_sensor_validity}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">Wearable Collar Validity</span>
                <span className="text-2xl font-black text-emerald-700">{dataQuality.wearable_validity}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">SCC Lab Record Validity</span>
                <span className="text-2xl font-black text-emerald-700">{dataQuality.scc_validity}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">Ambient Environment Validity</span>
                <span className="text-2xl font-black text-emerald-700">{dataQuality.environment_validity}%</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
              <span>Missing Record Rate: <strong className="text-slate-800">{dataQuality.missing_records_pct}%</strong></span>
              <span>Outlier Rate: <strong className="text-slate-800">{dataQuality.outlier_rate_pct}%</strong></span>
              <span>ESP32 Sync Latency: <strong className="text-slate-800">{dataQuality.sync_latency_ms} ms</strong></span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
