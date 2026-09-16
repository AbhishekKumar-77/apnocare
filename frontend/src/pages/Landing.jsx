import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Stethoscope, 
  Bot, 
  Clock, 
  MapPin, 
  Users, 
  Pill, 
  Activity, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

export default function Landing({ onGetStarted, onLoginClick }) {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-teal-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Pill badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>AI-Powered Remote Family Healthcare & Physical Assistance</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              You may be far away.<br />
              <span className="text-teal-700">ApnoCare is there.</span>
            </h1>

            {/* Subhead */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Living in Canada, Delhi, Bangalore, or Dubai while your parents or family live elsewhere? 
              When they need medical care, ApnoCare provides a <strong>verified local care representative</strong> to physically accompany them, manage hospital queues, coordinate medicines, and keep you live-updated.
            </p>

            {/* Call to actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-teal-600/25 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Explore Live Platform</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl font-semibold text-sm border border-slate-200 shadow-xs transition"
              >
                Sign In to Family Dashboard
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Background Verified Care Associates</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Real-Time Milestone Updates</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Bot className="w-4 h-4 text-teal-600" />
                <span>Ask ApnoCare AI Navigator</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Flagship Workflow Walkthrough */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">How It Works</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Physical Care Assistance, Coordinated Remotely
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Experience total peace of mind in 5 seamless steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Request Help',
                desc: 'Select your family member (Mom, Dad) and doctor visit or hospital requirements.',
                icon: Users
              },
              {
                step: '02',
                title: 'Verified Matching',
                desc: 'System matches a local verified Care Representative speaking their preferred language.',
                icon: UserCheck
              },
              {
                step: '03',
                title: 'Physical Assistance',
                desc: 'Associate reaches their home, accompanies them to clinic, and helps navigate hospital queues.',
                icon: HeartHandshake
              },
              {
                step: '04',
                title: 'Live Timeline',
                desc: 'Receive live updates as milestones occur: Doctor consultation done, prescription uploaded.',
                icon: Clock
              },
              {
                step: '05',
                title: 'Safe Return & Meds',
                desc: 'Patient safely accompanied back home and prescribed medicines coordinated with pharmacies.',
                icon: CheckCircle2
              }
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-all group">
                  <span className="text-2xl font-extrabold text-teal-700/30 group-hover:text-teal-600 transition">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center my-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Connected Platform Pillars */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Complete Healthcare Ecosystem</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Everything Your Family Needs In One Platform
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Verified Doctor Discovery',
                desc: 'Find accredited specialists with authentic patient ratings, consultation fees, and available morning/evening slots in their city.',
                icon: Stethoscope
              },
              {
                title: 'Hospital & Emergency Directory',
                desc: 'Instant access to accredited hospitals with 24/7 emergency trauma centers, ambulance hotlines, and ICU availability.',
                icon: Building2
              },
              {
                title: 'Medicine Coordination',
                desc: 'Upload doctor prescriptions or medicine slips. Verified local licensed pharmacies deliver genuine sealed medications.',
                icon: Pill
              },
              {
                title: 'Diagnostic Lab Tests',
                desc: 'Book routine or specialized blood tests (CBC, Lipid, HbA1c, Thyroid) with home sample collection and digital report storage.',
                icon: Activity
              },
              {
                title: 'Family Health Vault',
                desc: 'Secure digital vault storing prescriptions, lab results, and discharge summaries in a unified chronological family timeline.',
                icon: ShieldCheck
              },
              {
                title: 'Ask ApnoCare AI Navigator',
                desc: 'Multilingual conversational assistant supporting voice queries, medical terminology explanation, and platform actions with emergency triage.',
                icon: Bot
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white">ApnoCare</span>
              <p className="text-[11px] text-slate-400">"You may be far away. ApnoCare is there."</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            © 2026 ApnoCare Technologies Inc. All rights reserved. Not an emergency ambulance service.
          </p>
        </div>
      </footer>

    </div>
  );
}
