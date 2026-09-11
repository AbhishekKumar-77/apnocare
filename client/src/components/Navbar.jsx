import React from 'react';
import { Heart, Activity, Database, CheckCircle2, AlertCircle, PhoneCall } from 'lucide-react';

export default function Navbar({ health, onOpenInquiries, inquiryCount }) {
  const isDbConnected = health?.database?.isConnected;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Heart className="h-6 w-6 fill-white" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Apno<span className="text-sky-600">Care</span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium -mt-1 tracking-wide uppercase">
                Home Health & Nursing
              </p>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-sky-600 transition-colors">Our Services</a>
            <a href="#about" className="hover:text-sky-600 transition-colors">Why ApnoCare</a>
            <a href="#book" className="hover:text-sky-600 transition-colors">Request Caregiver</a>
            <button
              onClick={onOpenInquiries}
              className="hover:text-sky-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Recent Inquiries</span>
              {inquiryCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-sky-600 rounded-full">
                  {inquiryCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Status & Contact CTA */}
          <div className="flex items-center gap-4">
            {/* MongoDB Atlas Status indicator */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isDbConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={
                isDbConnected
                  ? `MongoDB Atlas: Connected (${health?.database?.name || 'apnocare'})`
                  : 'MongoDB Atlas: Pending credentials in server/.env'
              }
            >
              <Database className="w-3.5 h-3.5" />
              <span>Atlas: {isDbConnected ? 'Connected' : 'Setup Required'}</span>
              {isDbConnected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              )}
            </div>

            <a
              href="#book"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-sm font-semibold shadow-md shadow-sky-600/20 hover:shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Book a Caregiver</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
