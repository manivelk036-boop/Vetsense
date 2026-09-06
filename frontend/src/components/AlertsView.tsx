import React from 'react';
import {
  Bell, AlertCircle, AlertTriangle, CheckCircle2,
  Stethoscope, Eye, ShieldAlert, Sparkles, Droplet, Wind, ShieldCheck
} from 'lucide-react';
import { AlertItem, Language } from '../types';
import { translations } from '../i18n/translations';

interface AlertsViewProps {
  alerts: AlertItem[];
  language: Language;
  onAcknowledge: (id: string) => void;
  onViewAnimal: (animalId: string) => void;
  onAssignVet: (animalId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  language,
  onAcknowledge,
  onViewAnimal,
  onAssignVet
}) => {
  const t = translations[language] || translations.en;

  const recommendations = [
    {
      title: "Elevated Conductivity & Yield Deficit Protocol",
      trigger: "EC > +10% deviation and Milk Yield < -8% baseline",
      action: "Isolate cow in milking sequence (milk last). Perform physical palpation of all four quarters. Request veterinary evaluation.",
      icon: Droplet,
      tag: "High Priority"
    },
    {
      title: "Teat & Parlor Hygiene Guidelines",
      trigger: "Multiple animals exhibiting moderate EC/SCC variance",
      action: "Inspect teat-cup liners for micro-cracks. Ensure 30-second contact time for pre-milking iodine teat dip. Sanitize cluster between cows.",
      icon: ShieldCheck,
      tag: "Biosecurity"
    },
    {
      title: "Environmental Heat Stress Mitigation",
      trigger: "Ambient Temperature > 30°C and Humidity > 75% (THI > 78)",
      action: "Activate barn misting fans and ensure unrestricted access to clean, cool water to lower heat-induced immunosuppression.",
      icon: Wind,
      tag: "Environmental"
    },
    {
      title: "Subclinical SCC Elevated Management",
      trigger: "SCC > 200,000 cells/mL with stable physical milk",
      action: "Conduct California Mastitis Test (CMT) paddle score. Avoid unprescribed antibiotic administration.",
      icon: AlertTriangle,
      tag: "Diagnostics"
    }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-black text-slate-900 m-0">
              Active Alerts & Clinical Decision Support
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time notifications generated when multivariate deviation trends exceed individualized safety thresholds.
          </p>
        </div>
      </div>

      {/* Safety Alert Banner */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-emerald-900 text-sm mb-0.5">
            Non-Prescriptive AI Decision-Support Policy
          </h4>
          <p className="leading-relaxed">
            MASTI-GUARD AI forecasts mastitis risk 7–14 days in advance to allow prompt hygienic interventions. 
            The system strictly avoids automated antibiotic prescriptions. All therapeutic treatments require on-site veterinary diagnosis.
          </p>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          Active Animal Alerts ({alerts.length})
        </h3>

        {alerts.map((alert) => {
          const isHigh = alert.risk_category === 'HIGH RISK';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                alert.acknowledged
                  ? 'bg-slate-50/70 border-slate-200 opacity-80'
                  : isHigh
                  ? 'bg-white border-rose-300 shadow-sm ring-1 ring-rose-400/20'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isHigh ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {isHigh ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-sm">{alert.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                        {alert.animal_id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {alert.risk_score}% {alert.risk_category}
                      </span>
                      <span className="text-[11px] text-slate-400">• {alert.timestamp}</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 mt-1.5 leading-relaxed">
                      {alert.reason}
                    </p>

                    <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-slate-800">
                      <span className="font-bold text-emerald-800 block mb-0.5">Recommended Action:</span>
                      {alert.action}
                    </div>

                    {alert.assigned_vet && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-700 font-bold">
                        <Stethoscope className="w-3.5 h-3.5" />
                        Assigned to: {alert.assigned_vet}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                  {alert.animal_id !== 'HERD' && (
                    <button
                      onClick={() => onViewAnimal(alert.animal_id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Animal
                    </button>
                  )}

                  {!alert.assigned_vet && alert.animal_id !== 'HERD' && (
                    <button
                      onClick={() => onAssignVet(alert.animal_id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Assign Vet
                    </button>
                  )}

                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      {t.acknowledge}
                    </button>
                  )}

                  {alert.acknowledged && (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation Engine Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-black text-slate-900 m-0">
            Intelligent Dairy Management Recommendation Protocols
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div key={rec.title} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {rec.tag}
                    </span>
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mb-2">
                    <strong className="text-slate-700">Trigger:</strong> {rec.trigger}
                  </p>
                </div>
                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  {rec.action}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
