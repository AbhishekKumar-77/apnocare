import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  HeartHandshake, 
  Stethoscope, 
  Calendar, 
  Pill, 
  Activity, 
  Users, 
  Plus, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ChevronRight, 
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Building2,
  Zap,
  TrendingUp,
  Bell,
  Phone
} from 'lucide-react';

export default function Dashboard({ setActiveTab, onOpenCareWizard, onSelectPatientForDoctor }) {
  const { user } = useAuth();
  const [family, setFamily] = useState([]);
  const [activeCareRequest, setActiveCareRequest] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [famData, careData, apptData, tlData] = await Promise.all([
        api.getFamily(),
        api.getCareRequests(),
        api.getAppointments(),
        api.getHealthTimeline()
      ]);
      setFamily(famData || []);
      const active = (careData || []).find(c => c.status !== 'completed' && c.status !== 'cancelled');
      setActiveCareRequest(active || (careData && careData[0]) || null);
      setUpcomingAppointments((apptData || []).filter(a => a.status === 'confirmed').slice(0, 3));
      setTimelineEvents((tlData || []).slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Abhishek';

  const quickServices = [
    { id: 'care', label: 'Care Assistance', icon: HeartHandshake, color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-400/30', textColor: 'text-slate-950', featured: true },
    { id: 'doctors', label: 'Find Doctor', icon: Stethoscope, color: 'from-teal-500 to-emerald-600', shadow: 'shadow-teal-500/30', textColor: 'text-white' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, color: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/30', textColor: 'text-white' },
    { id: 'medicines', label: 'Medicines', icon: Pill, color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30', textColor: 'text-white' },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/30', textColor: 'text-white' },
    { id: 'hospitals', label: 'Find Hospital', icon: Building2, color: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-500/30', textColor: 'text-white' },
  ];

  const stats = [
    { label: 'Family Members', value: family.length || '3', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50', trend: 'Active' },
    { label: 'Upcoming Visits', value: upcomingAppointments.length || '2', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Confirmed' },
    { label: 'Care Requests', value: activeCareRequest ? '1' : '0', icon: HeartHandshake, color: 'text-amber-600', bg: 'bg-amber-50', trend: activeCareRequest ? 'Live' : 'None' },
    { label: 'Health Records', value: timelineEvents.length || '4', icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50', trend: 'Updated' },
  ];

  return (
    <div className="space-y-6 pb-16">

      {/* ── Hero Greeting Card ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

        <div className="relative z-10 p-7 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            {/* Left: Greeting */}
            <div className="flex-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-100 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>📍 Family in Jalandhar, Punjab • Remote Care Active</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
                Good day, <span className="text-amber-400">{userName}</span> 👋
              </h1>
              <p className="text-teal-100/80 text-sm sm:text-base mt-2 leading-relaxed max-w-lg">
                Your family's health is our priority. Here's a live overview of everything important.
              </p>

              {/* Primary CTA */}
              <button
                onClick={() => onOpenCareWizard ? onOpenCareWizard() : setActiveTab('care')}
                className="mt-6 inline-flex items-center space-x-2.5 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-bold text-sm shadow-xl shadow-amber-400/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Request Care Assistance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Live Status Pill */}
            <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 min-w-[200px]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-3">Live Platform</p>
              {activeCareRequest ? (
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-300">Visit In Progress</span>
                  </div>
                  <p className="text-xs text-white font-semibold">{activeCareRequest.patient_name}</p>
                  <p className="text-[11px] text-teal-200/70">{activeCareRequest.status?.replace(/_/g, ' ')}</p>
                  <button
                    onClick={() => setActiveTab('care')}
                    className="w-full py-1.5 px-3 bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold rounded-xl transition cursor-pointer text-center"
                  >
                    View Live →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span className="text-xs font-medium text-slate-300">No active visit</span>
                  </div>
                  <p className="text-[11px] text-teal-200/60 leading-snug">Dispatch a Care Representative for your family when needed</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick-stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white font-heading">{s.value}</p>
                  <p className="text-[10px] text-teal-200/70 font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Services Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">Quick Access</h2>
            <p className="text-xs text-slate-500">Tap any service to jump directly</p>
          </div>
          <span className="flex items-center space-x-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
            <Zap className="w-3 h-3" />
            <span>All Services</span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.id}
                onClick={() => svc.id === 'care' ? (onOpenCareWizard ? onOpenCareWizard() : setActiveTab('care')) : setActiveTab(svc.id)}
                className={`relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-gradient-to-br ${svc.color} shadow-lg ${svc.shadow} hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 overflow-hidden`}
              >
                {svc.featured && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-white/30 text-[8px] font-extrabold uppercase tracking-wider text-white rounded-full">
                    ★ KEY
                  </span>
                )}
                <Icon className={`w-6 h-6 ${svc.textColor}`} />
                <span className={`text-[11px] font-bold ${svc.textColor} text-center leading-tight`}>{svc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Live Care Tracker Banner (if active) ── */}
      {activeCareRequest && (
        <div className="relative overflow-hidden rounded-3xl border-2 border-teal-400/50 bg-gradient-to-r from-teal-50 to-emerald-50 shadow-lg">
          <div className="absolute right-0 top-0 w-48 h-48 bg-teal-200/30 rounded-full blur-3xl" />
          <div className="relative z-10 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                    <HeartHandshake className="w-7 h-7 text-teal-600" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-600"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700">Live Visit Tracker</span>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-full border border-teal-200">
                      {activeCareRequest.status?.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    {activeCareRequest.patient_name} ({activeCareRequest.patient_relation})
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Care Associate: <span className="font-semibold text-slate-800">{activeCareRequest.representative_name || 'Rajesh Kumar'}</span>
                    {' '}·{' '}
                    <a href={`tel:${activeCareRequest.representative_phone || '+919872234567'}`} className="text-teal-700 font-semibold">
                      {activeCareRequest.representative_phone || '+91 98722 34567'}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                {activeCareRequest.scheduled_date && (
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{activeCareRequest.scheduled_date} · {activeCareRequest.scheduled_time}</span>
                  </div>
                )}
                <button
                  onClick={() => setActiveTab('care')}
                  className="flex items-center space-x-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 cursor-pointer transition-all"
                >
                  <span>View Timeline</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {activeCareRequest.timeline?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-teal-200/60 text-xs text-slate-600 italic">
                💬 Latest: "{activeCareRequest.timeline[activeCareRequest.timeline.length - 1]?.notes || 'Visit in progress'}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main 2-Column Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Family Profiles (2/3) ── */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">Family Profiles</h2>
              <p className="text-xs text-slate-500">Select a member to book services or request care</p>
            </div>
            <button
              onClick={() => setActiveTab('family')}
              className="flex items-center space-x-1 text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer group"
            >
              <span>Manage All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {family.map(member => (
              <div
                key={member.id}
                className="glass-card glass-card-hover rounded-3xl p-5 relative group cursor-default"
              >
                {/* Member Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-800 font-extrabold flex items-center justify-center text-base shadow-sm">
                      {member.name?.[0] || 'F'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 font-heading">{member.name}</h4>
                      <p className="text-xs text-teal-700 font-medium">{member.relation} · {member.age} yrs</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200/60 text-[10px] font-bold rounded-lg">
                      {member.blood_group}
                    </span>
                  </div>
                </div>

                {/* Location & Conditions */}
                <div className="mt-3.5 space-y-2">
                  <p className="flex items-center text-xs text-slate-500 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                    <span className="truncate">{member.location}</span>
                  </p>
                  {member.chronic_conditions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {member.chronic_conditions.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] rounded-lg font-semibold border border-amber-200/70">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3.5 border-t border-slate-100/80 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (onSelectPatientForDoctor) onSelectPatientForDoctor(member);
                      setActiveTab('doctors');
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer border border-teal-200/60 hover:border-transparent"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Find Doctor</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenCareWizard) onOpenCareWizard(member);
                      else setActiveTab('care');
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2 bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer border border-amber-200/60 hover:border-transparent"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Care Request</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add Member Card */}
            <div
              onClick={() => setActiveTab('family')}
              className="relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 border-dashed border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 cursor-pointer transition-all group min-h-[160px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-teal-600 text-slate-400 group-hover:text-white flex items-center justify-center shadow-sm transition-all duration-200">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-700 group-hover:text-teal-700">Add Family Member</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Parent, Grandparent, Spouse, Child</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar: Appointments & Activity ── */}
        <div className="space-y-5">

          {/* Upcoming Consultations */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Upcoming Visits</span>
              </div>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-[11px] font-bold text-blue-100 hover:text-white cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="p-4 space-y-3">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">No upcoming appointments</p>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="mt-2.5 inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    <span>Book a Doctor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                upcomingAppointments.map((a, i) => (
                  <div key={a.id || i} className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-cyan-50/60 border border-blue-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{a.doctor_name}</p>
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">✓ Confirmed</span>
                    </div>
                    <p className="text-[11px] text-blue-700 font-medium">{a.doctor_specialty} · For {a.patient_name}</p>
                    <div className="flex items-center text-[11px] text-slate-400 space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{a.appointment_date} at {a.appointment_time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Health Activity */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Health Activity</span>
              </div>
              <button
                onClick={() => setActiveTab('records')}
                className="text-[11px] font-bold text-violet-100 hover:text-white cursor-pointer"
              >
                Vault →
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              {timelineEvents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No health activity recorded.</p>
              ) : (
                timelineEvents.map((t, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-violet-500 shrink-0 ring-2 ring-violet-200"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 leading-snug">{t.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{t.description}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{t.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Emergency Quick Panel */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-600 to-red-700 p-5 shadow-xl shadow-rose-600/20 border border-rose-400/30">
            <div className="absolute right-0 top-0 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="w-4 h-4 text-rose-200" />
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-rose-200">Emergency</p>
              </div>
              <p className="text-sm font-bold text-white mb-1">Medical Emergency?</p>
              <p className="text-[11px] text-rose-100 mb-4 leading-relaxed">
                Dispatch an emergency care associate immediately or call national helplines.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenCareWizard ? onOpenCareWizard() : setActiveTab('care')}
                  className="flex items-center justify-center space-x-1 py-2 bg-white text-rose-700 text-[11px] font-bold rounded-xl cursor-pointer hover:bg-rose-50 transition"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Dispatch</span>
                </button>
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="flex items-center justify-center space-x-1 py-2 bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold rounded-xl cursor-pointer border border-white/25 transition"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hospital</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
