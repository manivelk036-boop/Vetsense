import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { Animal, Language } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../api';

interface ManualDataEntryProps {
  animals: Animal[];
  language: Language;
  onSaved: (animalId: string) => void;
}

export const ManualDataEntry: React.FC<ManualDataEntryProps> = ({
  animals,
  language,
  onSaved
}) => {
  const t = translations[language] || translations.en;
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('COW001');
  const [scc, setScc] = useState<string>('250000');
  const [ph, setPh] = useState<string>('6.65');
  const [feedChange, setFeedChange] = useState<boolean>(false);
  const [housingCondition, setHousingCondition] = useState<string>('Moderate');
  const [hygieneCondition, setHygieneCondition] = useState<string>('Moderate');
  const [milkingHygiene, setMilkingHygiene] = useState<string>('Moderate');
  const [udderObservation, setUdderObservation] = useState<string>('Abnormal');
  const [milkAppearance, setMilkAppearance] = useState<string>('Normal');
  const [recentTreatment, setRecentTreatment] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('Slight warmth in right hind quarter upon teat disinfection.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.recordManualObservation({
        animal_id: selectedAnimalId,
        scc: scc ? parseInt(scc) : undefined,
        ph: ph ? parseFloat(ph) : undefined,
        feed_change: feedChange,
        housing_condition: housingCondition,
        hygiene_condition: hygieneCondition,
        milking_hygiene: milkingHygiene,
        udder_observation: udderObservation,
        milk_appearance: milkAppearance,
        recent_treatment: recentTreatment,
        notes
      });
      setSaveSuccessMessage(`Observation recorded for ${selectedAnimalId}. AI risk recalculated!`);
      setTimeout(() => {
        setSaveSuccessMessage(null);
        onSaved(selectedAnimalId);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        
        {/* Title */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 m-0">
              Farmer Manual Observation & Lab Results Entry
            </h2>
            <p className="text-xs text-slate-500">
              Integrates on-farm visual inspections, bedding hygiene, and lab SCC/pH with sensor streams.
            </p>
          </div>
        </div>

        {saveSuccessMessage && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {saveSuccessMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6 text-xs">
          
          {/* Animal ID Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Select Animal ID</label>
            <select
              value={selectedAnimalId}
              onChange={(e) => setSelectedAnimalId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {animals.map((a) => (
                <option key={a.animal_id} value={a.animal_id}>
                  {a.animal_id} - {a.breed} (Current Risk: {a.risk_score}% {a.risk_category})
                </option>
              ))}
            </select>
          </div>

          {/* Laboratory Records: SCC & pH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Somatic Cell Count (SCC cells/mL)</label>
              <input
                type="number"
                value={scc}
                onChange={(e) => setScc(e.target.value)}
                placeholder="e.g. 250000"
                className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">Threshold: &gt; 200,000 indicates subclinical risk</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Milk pH (Laboratory Meter)</label>
              <input
                type="number"
                step="0.01"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                placeholder="e.g. 6.65"
                className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">Normal baseline range: 6.50 – 6.60</span>
            </div>
          </div>

          {/* Management & Hygiene Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Housing Condition</label>
              <div className="flex gap-1">
                {['Good', 'Moderate', 'Poor'].map((cond) => (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => setHousingCondition(cond)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      housingCondition === cond
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Hygiene Condition</label>
              <div className="flex gap-1">
                {['Good', 'Moderate', 'Poor'].map((cond) => (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => setHygieneCondition(cond)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      hygieneCondition === cond
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Milking Hygiene</label>
              <div className="flex gap-1">
                {['Good', 'Moderate', 'Poor'].map((cond) => (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => setMilkingHygiene(cond)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      milkingHygiene === cond
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Observations: Udder & Milk Appearance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Udder Palpation Observation</label>
              <div className="flex gap-2">
                {['Normal', 'Abnormal'].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setUdderObservation(val)}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      udderObservation === val
                        ? val === 'Abnormal' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {val === 'Abnormal' ? 'Abnormal (Warm/Hard)' : 'Normal (Soft)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Milk Appearance (Fore-stripping)</label>
              <div className="flex gap-2">
                {['Normal', 'Abnormal'].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setMilkAppearance(val)}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      milkAppearance === val
                        ? val === 'Abnormal' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {val === 'Abnormal' ? 'Abnormal (Clots/Watery)' : 'Normal (Uniform)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feed Change & Recent Treatment Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={feedChange}
                onChange={(e) => setFeedChange(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="font-bold text-slate-700">Recent Feed / Concentrate Change</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={recentTreatment}
                onChange={(e) => setRecentTreatment(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="font-bold text-slate-700">Recent Medical / Antibiotic Treatment</span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Farmer / Milker Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add specific observations regarding teats, cow demeanor, appetite..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Processing & Recalculating AI...' : 'Save Record & Update AI Risk Model'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
