import React, { useState } from 'react';
import {
  Stethoscope, CheckCircle2, XCircle, Clock, Save,
  AlertCircle, ChevronRight, FileCheck, ArrowRight, Activity
} from 'lucide-react';
import { Animal, Language, VeterinaryOutcome } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../api';

interface VeterinarianDashboardProps {
  animals: Animal[];
  language: Language;
  onSelectAnimal: (id: string) => void;
  onOutcomeSaved: () => void;
}

export const VeterinarianDashboard: React.FC<VeterinarianDashboardProps> = ({
  animals,
  language,
  onSelectAnimal,
  onOutcomeSaved
}) => {
  const t = translations[language] || translations.en;
  const highRiskAnimals = animals.filter(a => a.risk_category === 'HIGH RISK' || a.risk_category === 'MODERATE RISK');

  const [selectedCowId, setSelectedCowId] = useState<string>('COW001');
  const [outcome, setOutcome] = useState<'Confirmed' | 'Not Confirmed' | 'Requires Follow-up'>('Confirmed');
  const [quarters, setQuarters] = useState<string[]>(['RH']); // Right Hind
  const [hasClinicalSigns, setHasClinicalSigns] = useState<boolean>(true);
  const [vetNotes, setVetNotes] = useState<string>('CMT positive (score 2) in Right Hind quarter. Udder tissue warm with mild swelling. Confirmed subclinical-to-early-clinical mastitis.');
  const [recommendation, setRecommendation] = useState<string>('Frequent milking, intra-mammary non-steroidal anti-inflammatory support, and teat dipping. Recheck in 48 hours.');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleQuarter = (q: string) => {
    setQuarters(prev =>
      prev.includes(q) ? prev.filter(item => item !== q) : [...prev, q]
    );
  };

  const handleSaveOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.saveVeterinaryOutcome({
        animal_id: selectedCowId,
        clinical_outcome: outcome,
        affected_quarters: quarters,
        clinical_signs_present: hasClinicalSigns,
        vet_notes: vetNotes,
        treatment_recommendation: recommendation,
        vet_id: "Dr. Ramesh Sharma (B.V.Sc & A.H)"
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onOutcomeSaved();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedAnimal = animals.find(a => a.animal_id === selectedCowId) || animals[0];

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Vet Portal Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Stethoscope className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Clinical Veterinary Portal & Validation Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-white m-0">
            Veterinary Case Review & Outcome Loop
          </h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl">
            Examine animals flagged by AI. Record clinical confirmation or false-positive outcomes to refine the retraining dataset.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
          <div>
            <span className="text-indigo-200 block text-[10px]">Assigned Cases</span>
            <span className="font-black text-white text-lg">{highRiskAnimals.length} Priority Cows</span>
          </div>
        </div>
      </div>

      {/* Section 22: AI Feedback Loop Visual Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          Continuous AI Closed-Loop Learning Cycle
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Step 1</span>
            <span className="font-black text-slate-800">IoT Telemetry</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Step 2</span>
            <span className="font-black text-rose-600">AI Risk (78%)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Step 3</span>
            <span className="font-black text-slate-800">Farmer Alert</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
            <span className="text-[10px] text-indigo-600 block font-bold">Step 4</span>
            <span className="font-black text-indigo-900">Vet Exam</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
            <span className="text-[10px] text-indigo-600 block font-bold">Step 5</span>
            <span className="font-black text-indigo-900">Clinical Outcome</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-600 block font-bold">Step 6</span>
            <span className="font-black text-emerald-800">Model Feedback</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Assigned Animals Queue */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Assigned High-Risk Queue ({highRiskAnimals.length})
          </h3>

          <div className="space-y-2">
            {highRiskAnimals.map((cow) => {
              const isSelected = cow.animal_id === selectedCowId;
              const isHigh = cow.risk_category === 'HIGH RISK';

              return (
                <div
                  key={cow.animal_id}
                  onClick={() => setSelectedCowId(cow.animal_id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-400/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{cow.animal_id}</span>
                        {cow.animal_id === 'COW001' && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black">
                            DEMO
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{cow.breed}</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-base font-black ${isHigh ? 'text-rose-600' : 'text-amber-600'}`}>
                        {cow.risk_score}%
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {cow.risk_category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>EC: <strong>{cow.current_ec} mS</strong></span>
                    <span>Yield: <strong>{cow.current_milk_yield} L</strong></span>
                    <span>SCC: <strong>{cow.current_scc.toLocaleString()}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Clinical Evaluation Form & History Review */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Selected Animal Telemetry Snippet */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 m-0">
                  Case Review: {selectedAnimal.animal_id} ({selectedAnimal.breed})
                </h3>
                <span className="text-xs text-slate-500">
                  Age: {selectedAnimal.age}y • Lactation: {selectedAnimal.lactation} • Prior Mastitis: Yes
                </span>
              </div>
              <button
                onClick={() => onSelectAnimal(selectedAnimal.animal_id)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                Inspect 7 Full Trend Graphs
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Conductivity (EC)</span>
                <span className="font-black text-rose-600 text-sm">{selectedAnimal.current_ec} mS/cm</span>
                <span className="text-[10px] text-slate-400 block">Baseline: {selectedAnimal.baseline.conductivity}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Milk Yield</span>
                <span className="font-black text-slate-800 text-sm">{selectedAnimal.current_milk_yield} L</span>
                <span className="text-[10px] text-slate-400 block">Baseline: {selectedAnimal.baseline.milk_yield}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Collar Activity</span>
                <span className="font-black text-slate-800 text-sm">{selectedAnimal.current_activity}</span>
                <span className="text-[10px] text-slate-400 block">Baseline: {selectedAnimal.baseline.activity}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Body Temperature</span>
                <span className="font-black text-slate-800 text-sm">{selectedAnimal.current_body_temp} °C</span>
                <span className="text-[10px] text-slate-400 block">Baseline: {selectedAnimal.baseline.body_temperature}</span>
              </div>
            </div>
          </div>

          {/* Clinical Outcome Entry Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              Veterinary Clinical Examination Record
            </h3>

            {saveSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Outcome stored successfully. Ground-truth fed into AI model evaluation dataset!
              </div>
            )}

            <form onSubmit={handleSaveOutcome} className="space-y-4 text-xs">
              
              {/* Clinical Outcome Choice */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Clinical Diagnosis Outcome:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOutcome('Confirmed')}
                    className={`p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      outcome === 'Confirmed'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t.outcome_confirmed}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutcome('Not Confirmed')}
                    className={`p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      outcome === 'Not Confirmed'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    {t.outcome_not_confirmed}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutcome('Requires Follow-up')}
                    className={`p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      outcome === 'Requires Follow-up'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {t.outcome_followup}
                  </button>
                </div>
              </div>

              {/* Udder Quadrants Inspection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Affected Udder Quadrants (Select all observed):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'LF', label: 'Left Fore (LF)' },
                    { key: 'RF', label: 'Right Fore (RF)' },
                    { key: 'LH', label: 'Left Hind (LH)' },
                    { key: 'RH', label: 'Right Hind (RH)' }
                  ].map((q) => (
                    <button
                      type="button"
                      key={q.key}
                      onClick={() => toggleQuarter(q.key)}
                      className={`p-2.5 rounded-xl font-bold border transition-all ${
                        quarters.includes(q.key)
                          ? 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Veterinarian Diagnostic Notes & CMT Results:
                </label>
                <textarea
                  rows={3}
                  value={vetNotes}
                  onChange={(e) => setVetNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Treatment Protocol */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Prescribed Clinical Management / Treatment:
                </label>
                <textarea
                  rows={2}
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Storing Outcome...' : t.save_outcome}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
