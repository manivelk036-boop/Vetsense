import React from 'react';
import {
  X, Radio, Droplet, Cpu, Database, Brain, AlertCircle,
  Stethoscope, RefreshCw, CheckCircle2, ArrowRight
} from 'lucide-react';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToAnimal: (id: string) => void;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({
  isOpen,
  onClose,
  onJumpToAnimal
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: "01",
      title: "Cow Arrival & Identification",
      desc: "RFID ear tag reader automatically identifies COW001 as it enters the milking parlor stall.",
      icon: Radio,
      badge: "Edge Hardware"
    },
    {
      num: "02",
      title: "Milking & Inline Sensing",
      desc: "Milking cluster engages. Inline sensors measure flow rate (1.2 L/min), milk temperature (38.4°C), and conductivity (6.8 mS/cm).",
      icon: Droplet,
      badge: "Sensors"
    },
    {
      num: "03",
      title: "Multivariate Telemetry Ingestion",
      desc: "Wearable collar transmits activity (68) & body temp (38.7°C); ambient station logs barn temperature & humidity (THI 82).",
      icon: Cpu,
      badge: "IoT Gateway"
    },
    {
      num: "04",
      title: "Data Validation & Feature Engineering",
      desc: "Calculates deviations against COW001's personal baseline: Yield (-10.3%), EC (+15.2%), Activity (-20.0%), Temp (+0.3°C).",
      icon: Database,
      badge: "Cloud / DB"
    },
    {
      num: "05",
      title: "AI Risk Prediction Engine",
      desc: "Random Forest model combines multi-stream features & historical episode weights to predict 78% High Risk with 7–14 day horizon.",
      icon: Brain,
      badge: "AI Service"
    },
    {
      num: "06",
      title: "Farmer Alert & Recommendations",
      desc: "Push alert generated on farmer mobile app with non-prescriptive hygiene instructions (teat dipping, sanitize cluster, isolate cow).",
      icon: AlertCircle,
      badge: "Decision Support"
    },
    {
      num: "07",
      title: "Veterinary Clinical Confirmation",
      desc: "Assigned veterinarian examines udder, conducts CMT paddle test, and records clinical outcome (Confirmed Mastitis in Right Hind).",
      icon: Stethoscope,
      badge: "Clinical Action"
    },
    {
      num: "08",
      title: "Continuous Feedback & Retraining",
      desc: "Veterinarian outcome is saved to database ground-truth registry, updating model evaluation metrics and training datasets.",
      icon: RefreshCw,
      badge: "AI Feedback Loop"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              System Architecture & User Journey
            </span>
            <h3 className="text-xl font-black text-white m-0">
              End-to-End MASTI-GUARD AI Operational Pipeline
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Workflow Pipeline */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            This interactive map illustrates the complete closed-loop lifecycle from physical cow milking to AI inference and veterinary ground-truth feedback.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all flex items-start gap-3.5 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    {step.num}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-extrabold text-slate-900 text-xs">{step.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Demonstration Callout */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-emerald-950 block">
                Flagship Case: COW001 High Risk Scenario
              </span>
              <p className="text-xs text-emerald-800 mt-0.5">
                Inspect how COW001 exhibits +15.2% EC surge and -10.3% yield deficit triggering 78% risk.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onJumpToAnimal('COW001');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              Examine COW001
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            Close Flow
          </button>
        </div>

      </div>
    </div>
  );
};
