import React from 'react';
import { Heart, ShieldCheck, User, LogOut, LayoutDashboard, Bell, PhoneCall } from 'lucide-react';

export default function Navbar({
  currentUser,
  onOpenAuth,
  onLogout,
  currentView,
  onViewChange,
  unreadCount,
  onOpenNotifications,
  onOpenSOS,
}) {
  return (
    <header className="sticky top-8 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => onViewChange('public')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Heart className="h-6 w-6 fill-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Apno<span className="text-sky-600">Care</span>
              </span>
              <p className="text-[11px] text-slate-500 font-semibold -mt-1 tracking-wider uppercase">
                Remote Family Healthcare
              </p>
            </div>
          </div>

          {/* Center Links (Only on public view) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onViewChange('public')}
              className={`hover:text-sky-600 transition-colors cursor-pointer ${currentView === 'public' ? 'text-sky-600' : ''}`}
            >
              Overview
            </button>
            <a href="#how-it-works" className="hover:text-sky-600 transition-colors">
              How It Works
            </a>
            <a href="#services" className="hover:text-sky-600 transition-colors">
              Services
            </a>
            <a href="#pricing" className="hover:text-sky-600 transition-colors">
              Pricing
            </a>
            <a href="#trust" className="hover:text-sky-600 transition-colors">
              Trust & Safety
            </a>
            <a href="#waitlist" className="hover:text-sky-600 transition-colors">
              Cities Covered
            </a>
            <a href="#faq" className="hover:text-sky-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Portal & Auth Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onViewChange('dashboard')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>
                    {currentUser.role === 'CUSTOMER' && 'Family Dashboard'}
                    {currentUser.role === 'PATIENT' && 'Parent Home'}
                    {currentUser.role === 'REPRESENTATIVE' && 'Rep Tasks'}
                    {currentUser.role === 'ADMIN' && 'Admin Console'}
                  </span>
                </button>

                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <span className="font-bold text-slate-800 hidden md:inline">{currentUser.name.split(' ')[0]}</span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Demo Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
