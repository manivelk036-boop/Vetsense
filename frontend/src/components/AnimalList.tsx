import React, { useState, useMemo } from 'react';
import {
  Search, Filter, ArrowUpDown, ChevronRight, AlertCircle, ShieldCheck,
  TrendingUp, AlertTriangle
} from 'lucide-react';
import { Animal, RiskCategory } from '../types';

interface AnimalListProps {
  animals: Animal[];
  onSelectAnimal: (id: string) => void;
}

export const AnimalList: React.FC<AnimalListProps> = ({ animals, onSelectAnimal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedBreed, setSelectedBreed] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'risk_desc' | 'risk_asc' | 'yield_desc' | 'id'>('risk_desc');

  const breeds = useMemo(() => {
    const set = new Set<string>();
    animals.forEach(a => set.add(a.breed));
    return Array.from(set);
  }, [animals]);

  const filteredAnimals = useMemo(() => {
    return animals
      .filter(a => {
        const matchesSearch =
          a.animal_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.breed.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRisk = selectedRisk === 'ALL' || a.risk_category === selectedRisk;
        const matchesBreed = selectedBreed === 'ALL' || a.breed === selectedBreed;
        return matchesSearch && matchesRisk && matchesBreed;
      })
      .sort((a, b) => {
        if (sortBy === 'risk_desc') return b.risk_score - a.risk_score;
        if (sortBy === 'risk_asc') return a.risk_score - b.risk_score;
        if (sortBy === 'yield_desc') return b.current_milk_yield - a.current_milk_yield;
        return a.animal_id.localeCompare(b.animal_id);
      });
  }, [animals, searchQuery, selectedRisk, selectedBreed, sortBy]);

  const getRiskBadge = (cat: RiskCategory) => {
    switch (cat) {
      case 'HIGH RISK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            HIGH
          </span>
        );
      case 'MODERATE RISK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3" />
            MODERATE
          </span>
        );
      case 'LOW RISK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <TrendingUp className="w-3 h-3" />
            LOW
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            NO RISK
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 m-0">
            Animal Herd Registry (50 Animals)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time physiological indicators, individual baselines, and AI risk forecasts.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID (e.g. COW001) or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        {/* Risk Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-semibold px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Risk:
          </span>
          {['ALL', 'HIGH RISK', 'MODERATE RISK', 'LOW RISK', 'NO RISK'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedRisk(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                selectedRisk === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Breed & Sort dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Breeds</option>
            {breeds.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none"
            >
              <option value="risk_desc">Highest Risk First</option>
              <option value="risk_asc">Lowest Risk First</option>
              <option value="yield_desc">Highest Milk Yield</option>
              <option value="id">Animal ID</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table View (Desktop) & Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Animal ID</th>
                <th className="py-3 px-4">Breed</th>
                <th className="py-3 px-4">Age / Lact.</th>
                <th className="py-3 px-4">Milk Yield</th>
                <th className="py-3 px-4">EC (mS/cm)</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">SCC (cells/mL)</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Risk Category</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnimals.map((cow) => {
                const isHigh = cow.risk_category === 'HIGH RISK';
                const isCow001 = cow.animal_id === 'COW001';

                return (
                  <tr
                    key={cow.animal_id}
                    onClick={() => onSelectAnimal(cow.animal_id)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isCow001 ? 'bg-rose-50/30 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-black text-slate-900 flex items-center gap-1.5">
                      <span>{cow.animal_id}</span>
                      {isCow001 && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black tracking-wider">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{cow.breed}</td>
                    <td className="py-3 px-4 text-slate-600">{cow.age}y / L{cow.lactation}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{cow.current_milk_yield} L</span>
                      <span className="text-[10px] text-slate-400 block">Base: {cow.baseline.milk_yield} L</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${cow.current_ec > 6.0 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {cow.current_ec}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Base: {cow.baseline.conductivity}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{cow.current_activity}</span>
                      <span className="text-[10px] text-slate-400 block">Base: {cow.baseline.activity}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${cow.current_scc > 200000 ? 'text-amber-600' : 'text-slate-800'}`}>
                        {cow.current_scc.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isHigh ? 'bg-rose-600' : cow.risk_category === 'MODERATE RISK' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${cow.risk_score}%` }}
                          />
                        </div>
                        <span className="font-black text-slate-900">{cow.risk_score}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getRiskBadge(cow.risk_category)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAnimal(cow.animal_id);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="View Profile"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
