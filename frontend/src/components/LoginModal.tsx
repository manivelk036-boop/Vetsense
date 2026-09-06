import React, { useState } from 'react';
import { ShieldAlert, User, Stethoscope, Activity, ArrowRight, Lock, Mail } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (role: UserRole) => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLogin,
  onClose
}) => {
  const [email, setEmail] = useState('farmer.ramesh@amuldairy.in');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<UserRole>('FARMER');

  if (!isOpen) return null;

  const handleRegularLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Branding Banner */}
        <div className="p-7 bg-gradient-to-br from-emerald-800 to-teal-950 text-white text-center relative overflow-hidden">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center mb-3 shadow-lg">
            <ShieldAlert className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white m-0">MASTI-GUARD AI</h2>
          <p className="text-emerald-200 text-xs font-semibold mt-1">
            Predict Early. Protect Better.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* 1-Click Demo Accounts */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Instant 1-Click Prototype Demo Logins
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onLogin('FARMER')}
                className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold hover:bg-emerald-100 transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <User className="w-4 h-4 text-emerald-700" />
                <span>Demo Farmer</span>
              </button>

              <button
                type="button"
                onClick={() => onLogin('VETERINARIAN')}
                className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-300 text-indigo-900 font-bold hover:bg-indigo-100 transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-indigo-700" />
                <span>Demo Vet</span>
              </button>

              <button
                type="button"
                onClick={() => onLogin('ADMIN')}
                className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 font-bold hover:bg-slate-200 transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-slate-700" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-[10px] font-bold uppercase">or sign in</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleRegularLogin} className="space-y-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile or Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Role Designation</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              >
                <option value="FARMER">Dairy Farmer (Farm View & Milk Sessions)</option>
                <option value="VETERINARIAN">Veterinarian (Clinical Reviews & Outcomes)</option>
                <option value="ADMIN">Admin / Health Authority (GIS & Surveillance)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
