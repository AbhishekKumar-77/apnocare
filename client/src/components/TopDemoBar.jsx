import React from 'react';
import { UserCheck, ShieldAlert, Heart, Globe, Bell } from 'lucide-react';

export default function TopDemoBar({
  currentUser,
  onSwitchPersona,
  personas,
  onTriggerSOS,
  currency,
  onCurrencyChange,
  unreadCount,
  onOpenNotifications,
}) {
  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-semibold tracking-wide flex items-center gap-1.5 uppercase text-[10px]">
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            Switch Role:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {personas.map((p) => {
              const isActive = currentUser?.role === p.role;
              return (
                <button
                  key={p.role}
                  onClick={() => onSwitchPersona(p)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                  title={`Switch to ${p.subtitle}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({p.role})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Currency & SOS & Notifications */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Currency selector for NRIs */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-md text-[11px]">
            <Globe className="w-3 h-3 text-slate-400" />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="INR" className="bg-slate-800 text-white">INR (₹)</option>
              <option value="USD" className="bg-slate-800 text-white">USD ($)</option>
              <option value="CAD" className="bg-slate-800 text-white">CAD (C$)</option>
              <option value="GBP" className="bg-slate-800 text-white">GBP (£)</option>
            </select>
          </div>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Red SOS Button */}
          <button
            onClick={onTriggerSOS}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-rose-600/30 transition-all cursor-pointer animate-pulse"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
