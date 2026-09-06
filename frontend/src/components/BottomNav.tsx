import React from 'react';
import { Home, List, PlayCircle, Bell, PlusCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: Language;
  unreadCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
  unreadCount
}) => {
  const t = translations[language] || translations.en;

  const items = [
    { id: 'dashboard', label: t.nav_dashboard, icon: Home },
    { id: 'animals', label: t.nav_animals, icon: List },
    { id: 'milking', label: 'Milking', icon: PlayCircle },
    { id: 'alerts', label: t.nav_alerts, icon: Bell, badge: unreadCount },
    { id: 'data_entry', label: 'Entry', icon: PlusCircle }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all relative ${
                isActive ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-rose-600 text-white rounded-full text-[8px] font-black">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
