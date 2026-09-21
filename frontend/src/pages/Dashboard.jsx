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
  ShieldCheck
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

      // Check for active care request
      const active = (careData || []).find(c => c.status !== 'completed' && c.status !== 'cancelled');
      setActiveCareRequest(active || (careData && careData[0]) || null);

      setUpcomingAppointments((apptData || []).filter(a => a.status === 'confirmed').slice(0, 3));
      setTimelineEvents((tlData || []).slice(0, 4));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Abhishek';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Personalized Greeting Header */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-9 text-white shadow-xl relative overflow-hidden border border-teal-700/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-semibold backdrop-blur-md border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>📍 Family location: Jalandhar, Punjab • Remote Care Connected</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-3.5 font-heading tracking-tight">
            Good day, {userName}
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 mt-1.5 font-normal leading-relaxed">
            How can we support your family's health and medical visits today?
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-7 flex flex-wrap gap-2.5">
            <button
              onClick={() => onOpenCareWizard ? onOpenCareWizard() : setActiveTab('care')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-400/20 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-slate-950" />
              <span>Get Care Assistance</span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 backdrop-blur-md transition cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-teal-200" />
              <span>Find Doctor</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 backdrop-blur-md transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-200" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={() => setActiveTab('medicines')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 backdrop-blur-md transition cursor-pointer"
            >
              <Pill className="w-4 h-4 text-teal-200" />
              <span>Medicines</span>
            </button>

            <button
              onClick={() => setActiveTab('diagnostics')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 backdrop-blur-md transition cursor-pointer"
            >
              <Activity className="w-4 h-4 text-teal-200" />
              <span>Diagnostic Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flagship Active Care Assistance Live Tracker Widget */}
      {activeCareRequest && (
        <div className="glass-card rounded-3xl p-6 border-2 border-teal-500/40 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-600"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Live Care Assistance Visit
                  </span>
                  <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-full">
                    {activeCareRequest.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 font-heading">
                  Accompanying {activeCareRequest.patient_name} ({activeCareRequest.patient_relation})
                </h3>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('care')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition self-start sm:self-auto cursor-pointer"
            >
              <span>View Live Stepper Timeline</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-slate-500">
                <strong>Assigned Associate:</strong> {activeCareRequest.representative_name || 'Rajesh Kumar'} ({activeCareRequest.representative_phone || '+91 98722 34567'})
              </p>
              <p className="text-slate-600 italic">
                Latest Update: "{activeCareRequest.timeline?.[activeCareRequest.timeline.length - 1]?.notes || 'Visit in progress'}"
              </p>
            </div>
            <div className="text-slate-500 flex items-center space-x-1.5 shrink-0">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Scheduled: {activeCareRequest.scheduled_date} at {activeCareRequest.scheduled_time}</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid: My Family Profiles & Health Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* My Family Members (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">My Family Profiles</h2>
              <p className="text-xs text-slate-500">Book any healthcare service with their saved locations</p>
            </div>
            <button
              onClick={() => setActiveTab('family')}
              className="flex items-center space-x-1 text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
            >
              <span>Manage Family</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {family.map(member => (
              <div 
                key={member.id} 
                className="glass-card glass-card-hover rounded-3xl p-5 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 font-bold flex items-center justify-center text-sm">
                      {member.name ? member.name[0] : 'F'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 font-heading">{member.name}</h4>
                      <p className="text-xs text-teal-700 font-medium">{member.relation} • {member.age} yrs</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                    {member.blood_group}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center text-slate-500 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                    <span className="truncate">{member.location}</span>
                  </p>
                  {member.chronic_conditions?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.chronic_conditions.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] rounded-md font-medium border border-amber-200/60">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Action for this member */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (onSelectPatientForDoctor) onSelectPatientForDoctor(member);
                      setActiveTab('doctors');
                    }}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
                  >
                    Find Doctor →
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenCareWizard) onOpenCareWizard(member);
                      else setActiveTab('care');
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    Request Care →
                  </button>
                </div>
              </div>
            ))}

            {/* Add Member Card */}
            <div 
              onClick={() => setActiveTab('family')}
              className="glass-card hover:border-teal-400 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[160px] border-dashed border-2 border-slate-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center shadow-xs mb-2 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-teal-700">Add Another Family Member</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Grandmother, Father, Spouse, Child</p>
            </div>
          </div>
        </div>

        {/* Upcoming Consultations & Health Activity */}
        <div className="space-y-6">
          
          {/* Upcoming Consultations */}
          <div className="glass-card rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 font-heading">Upcoming Consultations</h3>
              <button 
                onClick={() => setActiveTab('appointments')} 
                className="text-[11px] font-bold text-teal-700 cursor-pointer hover:underline"
              >
                View All
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p>No upcoming appointments scheduled.</p>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="mt-2 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    Book Doctor Now
                  </button>
                </div>
              ) : (
                upcomingAppointments.map(a => (
                  <div key={a.id} className="p-3.5 bg-slate-50/80 rounded-2xl text-xs space-y-1 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{a.doctor_name}</span>
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-full">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-700 font-medium">{a.doctor_specialty} • For {a.patient_name}</p>
                    <p className="text-[11px] text-slate-400 flex items-center mt-1">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {a.appointment_date} at {a.appointment_time}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Family Health Activity */}
          <div className="glass-card rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 font-heading">Recent Health Activity</h3>
              <button 
                onClick={() => setActiveTab('records')} 
                className="text-[11px] font-bold text-teal-700 cursor-pointer hover:underline"
              >
                Health Vault
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {timelineEvents.map((t, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                  <div>
                    <h5 className="font-semibold text-slate-900">{t.title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{t.description}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
