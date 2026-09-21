import React, { useState } from 'react';
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
  CheckCircle2, 
  UserCheck, 
  Building2, 
  FileText,
  Star,
  Compass,
  Heart,
  Calendar
} from 'lucide-react';
import heroVideo from '../assets/115458-704757070.mp4';

export default function Landing({ onGetStarted, onLoginClick }) {
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  const features = [
    {
      title: 'Physical Care Companion',
      subtitle: 'Doorstep Escort & Queue Navigation',
      desc: 'A background-verified, compassionate local care associate arrives at your parents\' home, escorts them safely to the doctor, manages OPD queues, and stays beside them.',
      icon: HeartHandshake,
      badge: 'Flagship Care',
      highlights: ['Door-to-door physical escort', 'OPD queue management & token handling', 'Real-time GPS & milestone updates']
    },
    {
      title: 'Doctor & Hospital Navigation',
      subtitle: 'Top Specialists & Emergency Centers',
      desc: 'Direct access to verified cardiologists, orthopedics, oncologists, and 24/7 accredited hospital emergency trauma centers with instant bed availability.',
      icon: Stethoscope,
      badge: 'Verified Network',
      highlights: ['Accredited specialist discovery', '24/7 Hospital emergency directories', 'Confirmed morning/evening slot booking']
    },
    {
      title: 'Doorstep Medicines & Labs',
      subtitle: 'Prescriptions Delivered & Home Samples',
      desc: 'Upload doctor prescription slips. Licensed local partner pharmacies deliver genuine sealed medications while certified phlebotomists collect blood samples from home.',
      icon: Pill,
      badge: 'Home Logistics',
      highlights: ['Sealed prescription deliveries', 'CBC, HbA1c & Thyroid home collection', 'Digital lab results synced directly']
    },
    {
      title: 'Family Health Vault',
      subtitle: 'One Unified Digital History',
      desc: 'All medical prescriptions, lab reports, doctor notes, and past visit summaries safely stored and accessible to all family members worldwide.',
      icon: FileText,
      badge: 'Private & Secure',
      highlights: ['Chronological family timeline', 'Zero missing papers during emergency', 'Encrypted cloud health vault']
    }
  ];

  return (
    <div className="relative text-slate-900 min-h-screen">
      
      {/* Full-Page Fixed Cinematic Video Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-105 contrast-105 opacity-60"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Frosted Glass & Gradient Overlay across entire scrollable page */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/80 to-[#f8fafc]/90 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-teal-900/5 mix-blend-multiply" />
      </div>

      {/* Main Scrollable Content that rolls smoothly over the fixed background video */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              
              {/* Top Pill Announcement */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 border border-teal-200/80 text-teal-800 text-xs font-bold mb-6 shadow-xs backdrop-blur-md animate-float-subtle">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Next-Gen Remote Family Healthcare & Physical Companionship</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] font-heading">
              You may be far away.<br />
              <span className="gradient-text">ApnoCare is physically there.</span>
            </h1>

            {/* Subhead */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Living in Toronto, London, Delhi, or Bangalore while your parents are back home?
              When they need medical visits, ApnoCare dispatches a <strong>verified local Care Representative</strong> to physically accompany them, handle hospital queues, coordinate medicines, and provide live updates.
            </p>

            {/* Call to Actions */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-teal-700/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 group cursor-pointer"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto px-7 py-4 glass-card hover:bg-white text-slate-800 rounded-2xl font-bold text-sm border border-slate-200 shadow-xs transition-all cursor-pointer"
              >
                Sign In to Family Dashboard
              </button>
            </div>

            {/* Trust & Live Stats Bar */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              {[
                { label: 'Physical Assistance', value: '100% Verified', sub: 'Police & background verified reps' },
                { label: 'Family Coverage', value: '15+ Cities', sub: 'Punjab, NCR, Tier 2 hubs' },
                { label: 'Care Satisfaction', value: '4.9 / 5.0', sub: 'Over 2,400 completed visits' },
                { label: 'Live Transparency', value: 'Real-Time', sub: 'GPS, doctor notes & photos' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-4 rounded-2xl border border-slate-200/80">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">{stat.label}</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-1 font-heading">{stat.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Flagship 5-Step Physical Care Journey */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              The Flagship Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
              Physical Care Assistance, Coordinated Remotely
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              How we ensure your parents get compassionate, attentive support every step of their medical appointment.
            </p>
          </div>

          {/* 5-Step Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              {
                step: '01',
                title: 'Request Support',
                desc: 'Select your family member (Mom, Dad) and specify their doctor or hospital appointment.',
                icon: Users
              },
              {
                step: '02',
                title: 'Verified Matching',
                desc: 'System assigns a nearby verified Care Associate fluent in their native language.',
                icon: UserCheck
              },
              {
                step: '03',
                title: 'Doorstep Escort',
                desc: 'The associate arrives at home, accompanies them to the clinic, and navigates queues.',
                icon: HeartHandshake
              },
              {
                step: '04',
                title: 'Live Milestones',
                desc: 'Receive live updates as doctor consultation concludes and prescriptions are uploaded.',
                icon: Clock
              },
              {
                step: '05',
                title: 'Safe Return & Meds',
                desc: 'Accompanied safely back inside their home. Prescribed medicines coordinated directly.',
                icon: CheckCircle2
              }
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div 
                  key={i} 
                  className="glass-card glass-card-hover p-6 rounded-3xl relative flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-teal-700/30 group-hover:text-teal-600 transition font-heading">
                        {s.step}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-4">{s.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-teal-700">
                    <span>Stage {s.step} Complete</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Ecosystem Explorer */}
      <section className="py-20 lg:py-28 relative border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              Healthcare Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
              Everything Your Family Needs in One Place
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Explore the interconnected services designed to protect your loved ones.
            </p>
          </div>

          {/* Interactive Feature Explorer Box */}
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-lg">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200/80">
              {features.map((f, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeatureTab(index)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeFeatureTab === index
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  <f.icon className="w-4 h-4" />
                  <span>{f.title}</span>
                </button>
              ))}
            </div>

            {/* Active Tab Showcase */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold mb-3">
                  {features[activeFeatureTab].badge}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-heading">
                  {features[activeFeatureTab].subtitle}
                </h3>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  {features[activeFeatureTab].desc}
                </p>

                <div className="mt-6 space-y-2.5">
                  {features[activeFeatureTab].highlights.map((h, i) => (
                    <div key={i} className="flex items-center space-x-2.5 text-xs text-slate-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    onClick={onGetStarted}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 flex items-center space-x-2 cursor-pointer transition"
                  >
                    <span>Experience in Live Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Visual Card Preview */}
              <div className="bg-gradient-to-br from-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-teal-700/50">
                    <span className="text-xs font-semibold text-teal-200">ApnoCare Real-Time Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Active Live
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                    <p className="text-xs text-teal-200 font-medium">Assigned Care Representative</p>
                    <p className="text-base font-bold text-white mt-0.5">Simranjit Kaur</p>
                    <p className="text-[11px] text-teal-100/80 mt-1">
                      Accompanied Gurpreet Singh (Father) at Fortis Hospital OPD
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-teal-200 pt-2">
                    <span>Milestone 4 of 5 reached</span>
                    <span className="font-bold text-white">Prescription Uploaded</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Real Family Stories */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              Trusted Worldwide
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
              Loved by Children Living Abroad & Cities Away
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Real families who found peace of mind when medical emergencies or routine visits arose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I live in Vancouver while my mother lives in Jalandhar. When she needed regular orthopedic checkups, having an ApnoCare associate physically there was life-changing.",
                author: "Amanpreet S.",
                location: "Vancouver, Canada",
                detail: "Mother's Knee Care Assistance"
              },
              {
                quote: "Working in Bangalore tech, I couldn't fly to Lucknow every time dad had a cardiology appointment. ApnoCare's live milestone photos and doctor notes gave me complete calm.",
                author: "Rohit V.",
                location: "Bangalore, India",
                detail: "Father's Cardiology Routine"
              },
              {
                quote: "The medicine delivery and lab test at home saved us so much distress. Everything synced directly into the family health vault for my sister in London to see.",
                author: "Pooja M.",
                location: "Dubai, UAE",
                detail: "Elderly Parents' Diabetes Care"
              }
            ].map((card, i) => (
              <div key={i} className="glass-card glass-card-hover p-7 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{card.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{card.author}</p>
                  <p className="text-[11px] text-teal-700 font-semibold">{card.location}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{card.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden text-center">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
                Never Let Your Parents Feel Alone in a Hospital
              </h2>
              <p className="text-teal-100 text-sm sm:text-base mt-3 leading-relaxed">
                Connect your family today. Verified local care companions, specialist doctors, and digital health history in minutes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-2xl text-sm shadow-xl shadow-amber-400/20 transition cursor-pointer"
                >
                  Get Started Now
                </button>
                <button
                  onClick={onLoginClick}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-sm border border-white/20 transition cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-card mt-16 py-12 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 font-heading">ApnoCare</span>
              <p className="text-[11px] text-slate-500">"You may be far away. ApnoCare is there."</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center sm:text-right">
            © 2026 ApnoCare Technologies Inc. All rights reserved.<br />
            <span className="text-[10px] text-slate-400">Not an emergency 911/112 ambulance service. For life-threatening emergencies, call national hotlines.</span>
          </p>
        </div>
      </footer>

      </div>
    </div>
  );
}
