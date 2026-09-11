import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Globe,
  ArrowRight,
  PhoneCall,
  Activity,
  Stethoscope,
  Building2,
  Home,
  Pill,
  FileText,
  Ambulance,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  MapPin,
  Clock,
  Lock,
} from 'lucide-react';
import { joinWaitlist } from '../services/api';

const SERVICES_CATALOG = [
  { icon: Stethoscope, title: 'Doctor Appointment', desc: 'Find appropriate specialists, schedule appointments, and provide physical accompaniment.' },
  { icon: Home, title: 'Home Visit Assistance', desc: 'Verified care rep visits home to assist with daily living, monitor recovery, and check vitals.' },
  { icon: Building2, title: 'Hospital Assistance', desc: 'Non-clinical accompaniment for OPD consultations, admissions, and wheelchair navigation.' },
  { icon: Activity, title: 'Diagnostic Tests & Scans', desc: 'Help coordinate blood tests, ultrasounds, MRI/CT scans prescribed by licensed physicians.' },
  { icon: Pill, title: 'Medicine Assistance', desc: 'Prescription-based fulfillment through licensed pharmacies with itemized receipts.' },
  { icon: FileText, title: 'Report Collection', desc: 'Collect physical hospital reports and securely upload to authorized family members.' },
  { icon: Ambulance, title: 'Medical Transportation', desc: 'Coordinate assisted cab services or non-emergency ambulance support.' },
  { icon: Calendar, title: 'Follow-up Coordination', desc: 'Manage future consultations and medication review reminders.' },
  { icon: ShieldCheck, title: 'Recovery Assistance', desc: 'Non-clinical transitional support at home following hospital procedures.' },
  { icon: PhoneCall, title: 'Emergency Coordination', desc: 'Rapid local escort liaison and instant alerting of designated family members.' },
];

const FAQS = [
  { q: 'Who can use ApnoCare?', a: 'Any family member living in another city or abroad (USA, Canada, UK, UAE, etc.) who wants trusted local healthcare assistance for elderly parents or family members in India.' },
  { q: 'Can I book help for my parents in India while living abroad?', a: 'Yes! That is our primary mission. You book, pay, and receive milestone updates and reports directly on your dashboard in real-time from anywhere in the world.' },
  { q: 'Do you provide doctors or prescribe medicine?', a: 'No. ApnoCare is a non-clinical healthcare coordination and accompaniment service. We work alongside licensed doctors, hospitals, diagnostic labs, and pharmacies. Our representatives do not diagnose or prescribe.' },
  { q: 'Can a representative accompany my parent to a hospital?', a: 'Yes. Our verified representative will arrive at your parents home, accompany them in a cab to the hospital, assist with registration, wheelchair navigation, OPD queues, and accompany them safely back.' },
  { q: 'How do I receive medical reports and prescriptions?', a: 'Your care representative photographs or uploads the physical report directly from the clinic into your secure, encrypted Family Health Records vault on your dashboard.' },
  { q: 'Can multiple siblings access the same parent account?', a: 'Yes! You can invite your brothers or sisters via Family Sharing with either Full Access or View Only permissions.' },
  { q: 'How does emergency assistance work?', a: 'Triggering our SOS notifies our local coordinator and family contacts. For immediate life-threatening events, emergency services (108/112) must be called first.' },
  { q: 'How are payments handled for international users?', a: 'We accept international cards (Visa, MasterCard, Amex) in USD, CAD, GBP, and INR through our secure payment gateway.' },
];

export default function PublicHome({
  onGetStarted,
  onOpenSOS,
  currency,
}) {
  const [waitlistData, setWaitlistData] = useState({
    name: '',
    email: '',
    phone: '',
    patientCity: '',
    neededService: 'Doctor & Hospital Escort',
  });
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const currencyRates = { INR: 1, USD: 0.012, CAD: 0.016, GBP: 0.0094 };
  const currencySymbols = { INR: '₹', USD: '$', CAD: 'C$', GBP: '£' };
  const rate = currencyRates[currency] || 1;
  const symbol = currencySymbols[currency] || '₹';

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setWaitlistLoading(true);
    try {
      await joinWaitlist(waitlistData);
      setWaitlistSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setWaitlistLoading(false);
    }
  };

  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/70 border border-sky-200 text-sky-800 text-xs font-semibold tracking-wide">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>Trusted by NRIs in Canada, USA, UK, UAE & Interstate Families</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Healthcare support for your family,{' '}
                <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">
                  even when you're miles away.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                From doctor appointments and medicines to hospital assistance and follow-ups, our trusted local team helps care for your family when you can't be there.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-sky-600/25 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#how-it-works"
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-base shadow-xs transition-colors inline-flex items-center justify-center"
                >
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Core Emotional Proposition */}
              <div className="pt-6 border-t border-slate-200 flex items-center gap-3 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  <strong>Local Human Assistance + Remote Family Visibility.</strong> Non-clinical coordination and physical accompaniment.
                </span>
              </div>
            </div>

            {/* Right: Emotional Connection Chain Graphic */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-tr from-sky-500 to-teal-400 rounded-3xl blur-xl opacity-25"></div>

                <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xl space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    The ApnoCare Connection Chain
                  </div>

                  {/* Step 1 */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      🍁
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">Arjun Mehta (Son in Toronto)</div>
                      <div className="text-[11px] text-sky-800">Requests ultrasound escort for his mother</div>
                    </div>
                  </div>

                  <div className="text-center text-slate-400 text-xs font-bold font-mono">↓ Live Dispatch</div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      🛡️
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">Rahul Sharma (Care Rep in Jalandhar)</div>
                      <div className="text-[11px] text-teal-800">Verified coordinator arrives at home with ID badge</div>
                    </div>
                  </div>

                  <div className="text-center text-slate-400 text-xs font-bold font-mono">↓ Accompaniment</div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      👵
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">Sunita Mehta (Mother in Punjab)</div>
                      <div className="text-[11px] text-amber-800">Safely accompanied to Apex Diagnostic Clinic</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                    <span>Report Uploaded to Vault</span>
                    <span>Family Notified in Toronto ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & EMOTIONAL PROBLEM SECTION */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-8 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Our Core Purpose</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            "Distance shouldn't decide who takes care of your family."
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Your parents may be thousands of kilometres away in Punjab, Delhi, or Karnataka. When something happens, you want to be there. But flights, time zones, jobs, and borders make that impossible. ApnoCare is your family's trusted physical presence on the ground.
          </p>
        </div>
      </section>

      {/* 3. HOW IT WORKS (5 STEPS) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Simple 5-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            How ApnoCare Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { num: '1', title: 'Add Family Member', desc: 'Add parent details, Indian city, and medical context.' },
            { num: '2', title: 'Request Assistance', desc: 'Choose service (doctor, tests, medicine, hospital visit).' },
            { num: '3', title: 'Representative Assigned', desc: 'Verified local employee is dispatched with ID badge.' },
            { num: '4', title: 'Assistance Delivered', desc: 'Parent gets warm, compassionate, non-clinical support.' },
            { num: '5', title: 'Live Family Updates', desc: 'Track live milestones and view uploaded medical reports.' },
          ].map((s) => (
            <div key={s.num} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white font-black text-base flex items-center justify-center mx-auto">
                {s.num}
              </div>
              <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SERVICES CATALOG (10 SERVICES) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Complete Coordination Scope</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Our Healthcare Coordination Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Providing empathetic, physical assistance without replacing doctors or medical specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_CATALOG.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{svc.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{svc.desc}</p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">Non-Clinical Support</span>
                  <button
                    onClick={onGetStarted}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                  >
                    Request →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. PRICING & SUBSCRIPTION PLANS */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Transparent & Configurable</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Subscription & Pay-Per-Service Plans
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Displaying in <strong>{currency} ({symbol})</strong> for remote international families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1: BASIC */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Occasional Support</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Basic Family Care</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-black text-slate-900">{symbol}{Math.round(2499 * rate)}</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> 1 Doctor Appointment Assistance / month</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Medicine pickup & verification</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Secure digital health vault access</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Basic milestone notifications</li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Choose Basic
            </button>
          </div>

          {/* Plan 2: CARE (POPULAR) */}
          <div className="p-8 rounded-3xl bg-white border-2 border-sky-500 shadow-lg ring-2 ring-sky-500/20 relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-teal-500 text-white font-bold text-xs shadow-md">
              Most Popular
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Regular Family Support</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Care Plan</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-black text-slate-900">{symbol}{Math.round(4999 * rate)}</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2 font-semibold text-slate-900"><CheckCircle2 className="w-4 h-4 text-sky-600" /> Dedicated local Care Manager</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-600" /> 3 Assisted Doctor or Hospital visits</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-600" /> Unlimited medicine & report collections</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-600" /> Weekly wellness home check-in</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-600" /> Priority Emergency SOS escalation</li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              Subscribe to Care Plan
            </button>
          </div>

          {/* Plan 3: PREMIUM FAMILY CARE */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Comprehensive Peace of Mind</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Premium Family Care</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-black text-slate-900">{symbol}{Math.round(8999 * rate)}</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Everything in Care Plan</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Unlimited home visits & hospital escorts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Post-operative recovery coordinator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Full Family Sharing (Unlimited siblings)</li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Choose Premium
            </button>
          </div>
        </div>
      </section>

      {/* 6. TRUST & SAFETY SECTION */}
      <section id="trust" className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Safety Above All</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Trust & Safety Framework
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Because nothing is more precious than your parents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            <h4 className="text-sm font-bold text-slate-900">Police & ID Verified</h4>
            <p className="text-xs text-slate-500">All representatives undergo strict government ID and background screening.</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <Lock className="w-6 h-6 text-sky-600" />
            <h4 className="text-sm font-bold text-slate-900">Consent-Based Records</h4>
            <p className="text-xs text-slate-500">Medical reports and details are shared strictly with authorized family members.</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">Non-Clinical Scope</h4>
            <p className="text-xs text-slate-500">We never diagnose or prescribe. Licensed doctors remain in full clinical control.</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <PhoneCall className="w-6 h-6 text-rose-600" />
            <h4 className="text-sm font-bold text-slate-900">Emergency Protocol</h4>
            <p className="text-xs text-slate-500">Rapid family alerting and direct coordination with emergency services (108/112).</p>
          </div>
        </div>
      </section>

      {/* 7. EXPANSION WAITLIST SECTION */}
      <section id="waitlist" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-sky-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Expansion Roadmap</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
              Is Your Parents' City Covered?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              We currently operate in Jalandhar, Ludhiana, Amritsar, Chandigarh, Delhi NCR, and Bengaluru. If your parents live elsewhere, join our launch priority waitlist!
            </p>
          </div>

          {waitlistSubmitted ? (
            <div className="p-6 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">You're on the priority waitlist!</h4>
              <p className="text-xs text-emerald-200">
                We'll notify you as soon as our verified care representative network launches in {waitlistData.patientCity}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="space-y-4 max-w-lg mx-auto">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={waitlistData.name}
                  onChange={(e) => setWaitlistData({ ...waitlistData, name: e.target.value })}
                  className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={waitlistData.email}
                  onChange={(e) => setWaitlistData({ ...waitlistData, email: e.target.value })}
                  className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Parents' City (e.g. Pune, Jaipur)"
                  value={waitlistData.patientCity}
                  onChange={(e) => setWaitlistData({ ...waitlistData, patientCity: e.target.value })}
                  className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  type="tel"
                  placeholder="Phone (WhatsApp)"
                  value={waitlistData.phone}
                  onChange={(e) => setWaitlistData({ ...waitlistData, phone: e.target.value })}
                  className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <button
                type="submit"
                disabled={waitlistLoading}
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                {waitlistLoading ? 'Submitting...' : 'Join City Waitlist'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
