import React from 'react';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle,
  TrendingUp, Wifi, CheckCircle2, ChevronRight, Activity, ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import { Animal, AlertItem, Language } from '../types';
import { translations } from '../i18n/translations';

interface FarmerDashboardProps {
  animals: Animal[];
  alerts: AlertItem[];
  language: Language;
  onSelectAnimal: (id: string) => void;
  onStartMilking: () => void;
  onViewAlerts: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  animals,
  alerts,
  language,
  onSelectAnimal,
  onStartMilking,
  onViewAlerts
}) => {
  const t = translations[language] || translations.en;

  // Compute breakdown
  const total = animals.length || 50;
  const noRisk = animals.filter(a => a.risk_category === 'NO RISK').length;
  const lowRisk = animals.filter(a => a.risk_category === 'LOW RISK').length;
  const modRisk = animals.filter(a => a.risk_category === 'MODERATE RISK').length;
  const highRisk = animals.filter(a => a.risk_category === 'HIGH RISK').length;

  // Filter high & moderate risk animals for attention card
  const attentionAnimals = animals.filter(a => a.risk_category === 'HIGH RISK' || a.risk_category === 'MODERATE RISK');

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ESP32 Telemetry Gateway Active
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              Dairy Farm Overview
            </h2>
            <p className="text-emerald-100/90 text-sm max-w-xl">
              AI continuous monitoring across 50 animals. Early risk alerts predict changes 7–14 days ahead of clinical symptoms.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onStartMilking}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-emerald-500/20 cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
              {t.milking_start} (COW001)
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Risk Distribution Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Animals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.kpi_total_animals}</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{total}</span>
            <span className="text-xs text-slate-500">cows</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Active Herd Profile
          </div>
        </div>

        {/* No Risk */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex flex-col justify-between bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>{t.kpi_no_risk}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{noRisk}</span>
            <span className="text-xs text-emerald-600">60%</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Healthy & Normal
          </div>
        </div>

        {/* Low Risk */}
        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-col justify-between bg-blue-50/20">
          <div className="flex items-center justify-between text-blue-800 text-xs font-semibold">
            <span>{t.kpi_low_risk}</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700">{lowRisk}</span>
            <span className="text-xs text-blue-600">20%</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Minor baseline variance
          </div>
        </div>

        {/* Moderate Risk */}
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
            <span>{t.kpi_moderate_risk}</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{modRisk}</span>
            <span className="text-xs text-amber-600">12%</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Requires Observation
          </div>
        </div>

        {/* High Risk */}
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs flex flex-col justify-between bg-rose-50/20 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-rose-800 text-xs font-semibold">
            <span>{t.kpi_high_risk}</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-700">{highRisk}</span>
            <span className="text-xs text-rose-600">8%</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Action Required
          </div>
        </div>

      </div>

      {/* Secondary Metrics: Production, Herd Trend & Sensor Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Today's Milk Production */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Today's Milk Production</h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Morning + Evening
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">342.6 L</span>
            <span className="flex items-center text-xs font-semibold text-rose-600">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -3.8% from herd norm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Average per animal: <span className="font-semibold text-slate-700">6.85 L/session</span>. Mild drop observed in 4 high-risk animals.
          </p>
        </div>

        {/* Herd Risk Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Herd Risk Trend</h3>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Elevated Alert
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-amber-600">64%</span>
            <span className="flex items-center text-xs font-semibold text-amber-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +13% over 2 wks
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Subclinical trajectory detected. Reviewing milking line disinfection and cluster hygiene is recommended.
          </p>
        </div>

        {/* Sensor Connectivity Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Sensor Connectivity</h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <Wifi className="w-3 h-3" />
              Connected
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">ESP32 Gateway:</span>
              <span className="font-bold text-emerald-700">ONLINE</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">Inline EC:</span>
              <span className="font-bold text-emerald-700">ONLINE</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">Neck Collars:</span>
              <span className="font-bold text-emerald-700">50/50</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">Temp / RH:</span>
              <span className="font-bold text-emerald-700">32°C / 76%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Urgent Attention Animals Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              {t.attention_required}
            </h3>
            <p className="text-xs text-slate-500">
              Animals identified by AI with elevated 7–14 day mastitis risk compared to their personalized baseline.
            </p>
          </div>
          <button
            onClick={onViewAlerts}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View all alerts ({alerts.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {attentionAnimals.slice(0, 4).map((cow) => {
            const isCow001 = cow.animal_id === 'COW001';
            return (
              <div
                key={cow.animal_id}
                onClick={() => onSelectAnimal(cow.animal_id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  isCow001
                    ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{cow.animal_id}</span>
                      {isCow001 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase">
                          Demo Focus
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{cow.breed}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-rose-600">{cow.risk_score}%</span>
                    <p className="text-[10px] font-bold text-rose-700 uppercase">{cow.risk_category}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Yield:</span>
                    <p className="font-bold text-slate-800">{cow.current_milk_yield} L <span className="text-rose-600 text-[10px]">(-10%)</span></p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">EC:</span>
                    <p className="font-bold text-slate-800">{cow.current_ec} mS <span className="text-rose-600 text-[10px]">(+15%)</span></p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>{t.view_profile}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Notice Footer */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Safety & Decision-Support Notice: </span>
          {t.disclaimer} Always verify with physical palpation, California Mastitis Test (CMT), or veterinary clinical diagnosis.
        </div>
      </div>

    </div>
  );
};
