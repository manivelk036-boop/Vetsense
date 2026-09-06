import React, { useState, useEffect } from 'react';
import {
  Play, Square, CheckCircle2, Droplet, Thermometer,
  Activity, Radio, ArrowRight, ShieldAlert, RotateCcw
} from 'lucide-react';
import { MilkingSession, Language } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../api';

interface MilkingSessionViewProps {
  language: Language;
  onViewAnimalProfile: (id: string) => void;
}

export const MilkingSessionView: React.FC<MilkingSessionViewProps> = ({
  language,
  onViewAnimalProfile
}) => {
  const t = translations[language] || translations.en;
  const [session, setSession] = useState<MilkingSession>({
    session_id: "SESS-20260906-01",
    animal_id: "COW001",
    status: "IN_PROGRESS",
    flow_rate: 1.2,
    milk_temperature: 38.4,
    conductivity: 6.8,
    yield_accumulated: 5.2,
    started_at: "18:42:10",
    elapsed_sec: 245
  });

  const [isLiveRunning, setIsLiveRunning] = useState(true);
  const [sessionSummary, setSessionSummary] = useState<any>(null);

  // Live simulation ticker
  useEffect(() => {
    if (!isLiveRunning || session.status === 'COMPLETED') return;

    const interval = setInterval(async () => {
      const updated = await api.tickMilking();
      setSession(prev => ({
        ...prev,
        flow_rate: updated.flow_rate,
        yield_accumulated: Number((prev.yield_accumulated + 0.05).toFixed(2)),
        milk_temperature: Number((38.4 + (Math.random() * 0.2 - 0.1)).toFixed(1)),
        conductivity: Number((6.8 + (Math.random() * 0.1 - 0.05)).toFixed(2)),
        elapsed_sec: prev.elapsed_sec + 3
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveRunning, session.status]);

  const handleCompleteSession = async () => {
    setIsLiveRunning(false);
    setSession(prev => ({ ...prev, status: 'COMPLETED' }));
    const summary = {
      sessionId: session.session_id,
      animalId: session.animal_id,
      startTime: session.started_at,
      endTime: "18:47:15",
      totalYield: session.yield_accumulated,
      avgTemp: 38.4,
      avgConductivity: 6.8,
      riskLevel: "HIGH (78%)",
      flaggedReason: "Conductivity elevated by +15.2% against 5.9 mS baseline"
    };
    setSessionSummary(summary);
  };

  const handleRestart = () => {
    setSession({
      session_id: `SESS-${Date.now().toString().slice(-6)}`,
      animal_id: "COW001",
      status: "IN_PROGRESS",
      flow_rate: 1.2,
      milk_temperature: 38.4,
      conductivity: 6.8,
      yield_accumulated: 0.4,
      started_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      elapsed_sec: 20
    });
    setSessionSummary(null);
    setIsLiveRunning(true);
  };

  const minutes = Math.floor(session.elapsed_sec / 60);
  const seconds = session.elapsed_sec % 60;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Session Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-black text-slate-900 m-0">
              Parlor Inline Milking Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Automated RFID cow identification linked to inline milk flow, temperature & electrical conductivity sensors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {session.status === 'IN_PROGRESS' ? (
            <button
              onClick={handleCompleteSession}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Complete Session
            </button>
          ) : (
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start New Session
            </button>
          )}
        </div>
      </div>

      {/* RFID Detection Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.rfid_detected}
            </span>
            <div className="flex items-center gap-3 mt-0.5">
              <h3 className="text-2xl font-black text-white">{session.animal_id}</h3>
              <span className="text-xs bg-slate-700 px-2.5 py-0.5 rounded-full text-slate-200">
                Holstein Cross • Stall #03
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Session Elapsed</span>
            <span className="font-mono text-xl font-bold text-emerald-300">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <button
            onClick={() => onViewAnimalProfile(session.animal_id)}
            className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            View Baseline
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Gauges / Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Milk Flow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>{t.flow_rate}</span>
            <Droplet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{session.flow_rate}</span>
            <span className="text-xs font-bold text-slate-500">L/min</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(session.flow_rate / 2.5) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Inline hall-effect flow sensor</span>
        </div>

        {/* Milk Temperature */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>{t.milk_temp}</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{session.milk_temperature}</span>
            <span className="text-xs font-bold text-slate-500">°C</span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Normal range (38.0 - 38.6°C)
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">NTC inline thermistor probe</span>
        </div>

        {/* Electrical Conductivity */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-rose-800 font-bold mb-2">
            <span>{t.conductivity}</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-rose-600">{session.conductivity}</span>
            <span className="text-xs font-bold text-rose-600">mS/cm</span>
          </div>
          <div className="mt-3 text-[11px] text-rose-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            ↑ +15.2% above baseline (5.9)
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Toroidal conductivity cell</span>
        </div>

        {/* Accumulated Yield */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>{t.accumulated_yield}</span>
            <Droplet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-700">{session.yield_accumulated}</span>
            <span className="text-xs font-bold text-emerald-800">L</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-medium">
            Expected: <span className="font-bold text-slate-700">5.8 L</span> (-10.3% deficit)
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Continuous volume integration</span>
        </div>

      </div>

      {/* Completed Session Summary Card */}
      {sessionSummary && (
        <div className="bg-white rounded-2xl border border-emerald-300 shadow-lg p-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 text-emerald-800 font-black text-lg mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            {t.milking_completed}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
            <div>
              <span className="text-slate-400 block">Session ID:</span>
              <span className="font-bold text-slate-800">{sessionSummary.sessionId}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Total Yield:</span>
              <span className="font-black text-slate-900 text-sm">{sessionSummary.totalYield} L</span>
            </div>
            <div>
              <span className="text-slate-400 block">Avg Conductivity:</span>
              <span className="font-black text-rose-600 text-sm">{sessionSummary.avgConductivity} mS/cm</span>
            </div>
            <div>
              <span className="text-slate-400 block">AI Forecast:</span>
              <span className="font-black text-rose-600 text-sm">{sessionSummary.riskLevel}</span>
            </div>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong>Automated Alert Triggered: </strong>
              {sessionSummary.flaggedReason}. A notification has been dispatched to the Farmer Alerts queue and assigned to the herd veterinarian.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
