import React, { useState } from 'react';
import {
  ArrowLeft, AlertTriangle, AlertCircle, CheckCircle2, TrendingDown,
  TrendingUp, Thermometer, Droplet, Activity as ActivityIcon,
  ShieldAlert, Stethoscope, ChevronRight, Info, Eye
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, AreaChart, Area
} from 'recharts';
import { Animal, HistoricalRecord, Language } from '../types';
import { translations } from '../i18n/translations';

interface AnimalProfileProps {
  animal: Animal;
  history: HistoricalRecord[];
  language: Language;
  onBack: () => void;
  onAssignVet: (animalId: string) => void;
}

export const AnimalProfile: React.FC<AnimalProfileProps> = ({
  animal,
  history,
  language,
  onBack,
  onAssignVet
}) => {
  const t = translations[language] || translations.en;
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '14d' | '30d'>('7d');
  const [activeChartTab, setActiveChartTab] = useState<'risk' | 'milk' | 'ec' | 'scc' | 'activity' | 'temp'>('risk');
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  // Slice historical data based on timeRange
  const displayedHistory = React.useMemo(() => {
    if (timeRange === '24h') return history.slice(-2);
    if (timeRange === '7d') return history.slice(-7);
    if (timeRange === '14d') return history.slice(-14);
    return history.slice(-30);
  }, [history, timeRange]);

  // Personalized Baseline Deviations
  const yieldDev = (((animal.current_milk_yield - animal.baseline.milk_yield) / animal.baseline.milk_yield) * 100).toFixed(1);
  const ecDev = (((animal.current_ec - animal.baseline.conductivity) / animal.baseline.conductivity) * 100).toFixed(1);
  const actDev = (((animal.current_activity - animal.baseline.activity) / animal.baseline.activity) * 100).toFixed(1);
  const tempDev = (animal.current_body_temp - animal.baseline.body_temperature).toFixed(2);

  // SHAP-style Explainability Weights for COW001
  const explainabilityFactors = [
    { name: 'Conductivity Increased', contribution: 30, color: '#e11d48', desc: `+${ecDev}% deviation above personal baseline (6.8 vs 5.9 mS/cm)` },
    { name: 'Milk Yield Decreased', contribution: 25, color: '#f43f5e', desc: `${yieldDev}% decline compared to personal baseline (5.2 vs 5.8 L)` },
    { name: 'Activity Decreased', contribution: 18, color: '#ea580c', desc: `${actDev}% drop in wearable rumination/steps index (68 vs 85)` },
    { name: 'Body Temp Elevation', contribution: 12, color: '#f59e0b', desc: `+${tempDev}°C deviation above animal's physiological norm (38.7°C)` },
    { name: 'Previous Mastitis History', contribution: 10, color: '#8b5cf6', desc: 'Prior clinical episode recorded during 2nd lactation' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Animal Registry
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAcknowledged(true)}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              isAcknowledged
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isAcknowledged ? '✓ Alert Acknowledged' : t.acknowledge}
          </button>
          <button
            onClick={() => onAssignVet(animal.animal_id)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            {t.assign_vet}
          </button>
        </div>
      </div>

      {/* Hero Animal Card with Risk Score & 7-14 Day Forecast */}
      <div className="bg-white rounded-2xl border border-rose-200 shadow-md p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-rose-500/10 via-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Left: Identity Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-rose-500/20">
                {animal.animal_id.slice(-3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900 m-0">{animal.animal_id}</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    {animal.risk_category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{animal.breed}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Age / Lactation</span>
                <span className="font-bold text-slate-800">{animal.age} Years • Lactation {animal.lactation}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Previous Mastitis</span>
                <span className="font-bold text-rose-700">Yes (2nd Lactation)</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Vaccination</span>
                <span className="font-bold text-emerald-700">{animal.vaccination_status}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Barn Environment</span>
                <span className="font-bold text-slate-800">32°C / 76% RH</span>
              </div>
            </div>
          </div>

          {/* Center: AI Predictive Risk Score Gauge */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-rose-50 to-orange-50/40 border border-rose-100 text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              AI Risk Forecast Score
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-6xl font-black text-rose-600 tracking-tight">{animal.risk_score}</span>
              <span className="text-2xl font-black text-rose-500">%</span>
            </div>
            <div className="mt-1 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wide shadow-xs">
              {animal.risk_category} RISK
            </div>
            <div className="mt-3 text-xs font-semibold text-rose-950 flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-rose-200/60">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              {t.elevated_forecast}
            </div>
          </div>

          {/* Right: Subclinical Mastitis Module Badge */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                {t.subclinical_title}
              </div>
              <p className="text-xs text-amber-950/80 mt-1 leading-relaxed">
                {t.subclinical_desc}
              </p>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-medium text-amber-900">
                <span>Somatic Cell Count (SCC):</span>
                <span className="font-black text-amber-950">250,000 cells/mL</span>
              </div>
              <div className="flex justify-between font-medium text-amber-900">
                <span>Electrical Conductivity:</span>
                <span className="font-black text-rose-600">6.8 mS/cm (Increasing)</span>
              </div>
              <div className="flex justify-between font-medium text-amber-900">
                <span>Milk Yield Trajectory:</span>
                <span className="font-black text-rose-600">5.2 L (Decreasing)</span>
              </div>
            </div>
            <div className="pt-2 border-t border-amber-200 text-[11px] font-bold text-amber-800 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              Requires monitoring & veterinary confirmation.
            </div>
          </div>

        </div>
      </div>

      {/* Section 8: Personalized Baseline Comparison Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ActivityIcon className="w-4 h-4 text-emerald-600" />
            Personalized Animal Baseline Telemetry
          </h3>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ★ {t.baseline_compare}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Milk Yield */}
          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs bg-rose-50/10">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>{t.milk_yield}</span>
              <Droplet className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{animal.current_milk_yield} L</span>
              <span className="flex items-center text-xs font-extrabold text-rose-600">
                <TrendingDown className="w-3.5 h-3.5" />
                {yieldDev}%
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              Baseline: <span className="font-bold text-slate-700">{animal.baseline.milk_yield} L</span>
            </div>
          </div>

          {/* Conductivity */}
          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs bg-rose-50/10">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>{t.conductivity}</span>
              <ActivityIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-600">{animal.current_ec} mS/cm</span>
              <span className="flex items-center text-xs font-extrabold text-rose-600">
                <TrendingUp className="w-3.5 h-3.5" />
                +{ecDev}%
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              Baseline: <span className="font-bold text-slate-700">{animal.baseline.conductivity} mS/cm</span>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-xs bg-orange-50/10">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>{t.activity} (Collar)</span>
              <ActivityIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{animal.current_activity}</span>
              <span className="flex items-center text-xs font-extrabold text-orange-600">
                <TrendingDown className="w-3.5 h-3.5" />
                {actDev}%
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              Baseline: <span className="font-bold text-slate-700">{animal.baseline.activity}</span> (Reduced)
            </div>
          </div>

          {/* Body Temperature */}
          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs bg-amber-50/10">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>{t.body_temp}</span>
              <Thermometer className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{animal.current_body_temp} °C</span>
              <span className="flex items-center text-xs font-extrabold text-amber-600">
                <TrendingUp className="w-3.5 h-3.5" />
                +{tempDev}°C
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              Baseline: <span className="font-bold text-slate-700">{animal.baseline.body_temperature} °C</span>
            </div>
          </div>

          {/* Milk Temperature */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block mb-1">{t.milk_temp}</span>
            <span className="text-xl font-black text-slate-800">{animal.current_milk_temp} °C</span>
            <span className="text-[11px] text-slate-500 block mt-1">Inline flow thermistor</span>
          </div>

          {/* Somatic Cell Count (SCC) */}
          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block mb-1">SCC (Lab Optical)</span>
            <span className="text-xl font-black text-rose-600">{animal.current_scc.toLocaleString()} cells/mL</span>
            <span className="text-[11px] text-slate-500 block mt-1">Normal &lt; 200,000</span>
          </div>

          {/* Milk pH */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Milk pH</span>
            <span className="text-xl font-black text-slate-800">{animal.current_ph}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Normal: 6.50 – 6.60</span>
          </div>

          {/* Environment */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block mb-1">Environment</span>
            <span className="text-xl font-black text-slate-800">32°C / 76%</span>
            <span className="text-[11px] text-amber-600 font-bold block mt-1">Mild Heat Stress (THI 82)</span>
          </div>

        </div>
      </div>

      {/* Section 10: AI Explainability (SHAP-style Feature Importance) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              {t.why_high_risk}
            </h3>
            <p className="text-xs text-slate-500">
              SHAP-style multivariate contributing factor decomposition for COW001 decision support.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full w-fit">
            {t.ai_contributing_factors}
          </span>
        </div>

        <div className="space-y-3.5">
          {explainabilityFactors.map((factor) => (
            <div key={factor.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">{factor.name}</span>
                <span className="font-bold text-rose-600">+{factor.contribution} pts contribution</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${factor.contribution * 3}%`, backgroundColor: factor.color }}
                />
              </div>
              <p className="text-[11px] text-slate-500">{factor.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Interpretability Note: </strong>
            These values represent machine learning feature attribution weights toward the 78% risk score and are intended for veterinarian decision support. They do not replace microbiological laboratory culture or clinical confirmation.
          </span>
        </div>
      </div>

      {/* Section 7: Interactive Time-Series Graphs (Recharts) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Interactive Physiological Time-Series Trends
            </h3>
            <p className="text-xs text-slate-500">
              Observe how COW001's electrical conductivity and risk escalated from Day -7 (25%) to Today (78%).
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold w-fit">
            {(['24h', '7d', '14d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === range ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Chart metric selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveChartTab('risk')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeChartTab === 'risk' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Graph 7: Mastitis Risk Score (Day -7 → 78%)
          </button>
          <button
            onClick={() => setActiveChartTab('milk')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeChartTab === 'milk' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Graph 1: Milk Yield Trend
          </button>
          <button
            onClick={() => setActiveChartTab('ec')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeChartTab === 'ec' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Graph 2: Conductivity Trend
          </button>
          <button
            onClick={() => setActiveChartTab('scc')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeChartTab === 'scc' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Graph 6: SCC Trend
          </button>
          <button
            onClick={() => setActiveChartTab('activity')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeChartTab === 'activity' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Graph 4: Activity Trend
          </button>
          <button
            onClick={() => setActiveChartTab('temp')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeChartTab === 'temp' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Graph 3 & 5: Body & Milk Temp
          </button>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'risk' ? (
              <AreaChart data={displayedHistory}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day_label" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Mastitis Risk Score']}
                  contentStyle={{ borderRadius: '0.75rem', borderColor: '#e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="risk_score" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#riskGrad)" />
              </AreaChart>
            ) : activeChartTab === 'milk' ? (
              <LineChart data={displayedHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day_label" tick={{ fontSize: 11 }} />
                <YAxis domain={[4.5, 6.5]} unit=" L" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`${val} L`, 'Milk Yield']} />
                <Line type="monotone" dataKey="milk_yield" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : activeChartTab === 'ec' ? (
              <LineChart data={displayedHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day_label" tick={{ fontSize: 11 }} />
                <YAxis domain={[5.5, 7.2]} unit=" mS" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`${val} mS/cm`, 'Conductivity']} />
                <Line type="monotone" dataKey="conductivity" stroke="#d97706" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : activeChartTab === 'scc' ? (
              <AreaChart data={displayedHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day_label" tick={{ fontSize: 11 }} />
                <YAxis domain={[80000, 300000]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()} cells/mL`, 'SCC']} />
                <Area type="monotone" dataKey="scc" stroke="#9333ea" fill="#f3e8ff" strokeWidth={3} />
              </AreaChart>
            ) : activeChartTab === 'activity' ? (
              <LineChart data={displayedHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day_label" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 95]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [val, 'Activity Index']} />
                <Line type="monotone" dataKey="activity" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <LineChart data={displayedHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day_label" tick={{ fontSize: 11 }} />
                <YAxis domain={[38.0, 39.0]} unit=" °C" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any, name: any) => [`${val} °C`, name === 'body_temp' ? 'Body Temp' : 'Milk Temp']} />
                <Line type="monotone" dataKey="body_temp" stroke="#ea580c" strokeWidth={2.5} name="Body Temp" />
                <Line type="monotone" dataKey="milk_temp" stroke="#0284c7" strokeWidth={2} strokeDasharray="4 4" name="Milk Temp" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Section 7 Trajectory Explanatory Callout */}
        <div className="mt-4 p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-xs text-rose-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>
              <strong>Progression Pattern: </strong>
              Day -7 (25%) → Day -6 (29%) → Day -5 (34%) → Day -4 (43%) → Day -3 (52%) → Day -2 (64%) → Day -1 (71%) → Today (78%)
            </span>
          </div>
          <span className="text-[11px] font-bold text-rose-700 uppercase">Clear Upward Drift</span>
        </div>
      </div>

    </div>
  );
};
