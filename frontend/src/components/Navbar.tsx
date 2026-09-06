import React from 'react';
import { ShieldAlert, Activity, Stethoscope, User, Globe, GitBranch, Bell } from 'lucide-react';
import { UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenWorkflow: () => void;
  unreadAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  onOpenWorkflow,
  unreadAlertsCount
}) => {
  const t = translations[language] || translations.en;

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Banner with branding, live telemetry indicator & role switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 m-0">
                {t.brand_name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                {t.live} IoT
              </span>
            </div>
            <p className="text-xs font-medium text-emerald-700 m-0">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Center/Right Controls: Role Switcher, Language & Workflow */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* 1-Click Demo Role Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onRoleChange('FARMER')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                currentRole === 'FARMER'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Farmer Dashboard"
            >
              <User className="w-3.5 h-3.5" />
              {t.role_farmer}
            </button>
            <button
              onClick={() => onRoleChange('VETERINARIAN')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                currentRole === 'VETERINARIAN'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Veterinarian Clinical Portal"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              {t.role_vet}
            </button>
            <button
              onClick={() => onRoleChange('ADMIN')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                currentRole === 'ADMIN'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Admin & GIS Authority Portal"
            >
              <Activity className="w-3.5 h-3.5" />
              {t.role_admin}
            </button>
          </div>

          {/* Interactive Workflow Architecture Trigger */}
          <button
            onClick={onOpenWorkflow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-semibold transition-all shadow-xs"
            title="View end-to-end hardware, IoT, and AI pipeline"
          >
            <GitBranch className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">{t.nav_workflow}</span>
            <span className="sm:hidden">Flow</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="pl-8 pr-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-label="Language Selector"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <nav className="flex items-center gap-1 overflow-x-auto py-1 text-sm font-medium scrollbar-none">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {t.nav_dashboard}
          </button>

          <button
            onClick={() => onTabChange('animals')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'animals' || activeTab === 'profile'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {t.nav_animals} (50)
          </button>

          <button
            onClick={() => onTabChange('milking')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'milking'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t.nav_milking}
          </button>

          <button
            onClick={() => onTabChange('alerts')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            {t.nav_alerts}
            {unreadAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('data_entry')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'data_entry'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {t.nav_data_entry}
          </button>

          {/* Role specific tabs */}
          {(currentRole === 'ADMIN' || currentRole === 'VETERINARIAN') && (
            <button
              onClick={() => onTabChange('herd')}
              className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'herd'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav_herd}
            </button>
          )}

          {currentRole === 'ADMIN' && (
            <>
              <button
                onClick={() => onTabChange('gis')}
                className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'gis'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t.nav_gis}
              </button>

              <button
                onClick={() => onTabChange('model')}
                className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'model'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t.nav_model}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
