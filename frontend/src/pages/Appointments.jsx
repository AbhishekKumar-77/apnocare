import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  Building2, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  HeartHandshake,
  QrCode,
  Printer,
  CalendarCheck,
  Search,
  Filter,
  X,
  FileText,
  Phone,
  ArrowRight
} from 'lucide-react';

export default function Appointments({ onBookDoctorClick }) {
  const [appointments, setAppointments] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter tabs
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'
  const [selectedMember, setSelectedMember] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [passAppointment, setPassAppointment] = useState(null);
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [rescheduleSlot, setRescheduleSlot] = useState('11:00 AM');

  const [cancelModalAppt, setCancelModalAppt] = useState(null);
  const [cancelReason, setCancelReason] = useState('Patient schedule conflict');

  const [completedSummaryAppt, setCompletedSummaryAppt] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apptData, famData] = await Promise.all([
        api.getAppointments(),
        api.getFamily()
      ]);
      setAppointments(apptData || []);
      setFamilyMembers(famData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleAppt) return;
    try {
      await api.rescheduleAppointment(rescheduleAppt.id, rescheduleDate, rescheduleSlot);
      setRescheduleAppt(null);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to reschedule');
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModalAppt) return;
    try {
      await api.cancelAppointment(cancelModalAppt.id, cancelReason);
      setCancelModalAppt(null);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  const handleAttachCompanion = async (apptId) => {
    try {
      await api.attachCareAssociateToAppointment(apptId);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to attach companion');
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(a => {
    const isUpcoming = a.status === 'confirmed' || a.status === 'scheduled';
    const isCompleted = a.status === 'completed';
    const isCancelled = a.status === 'cancelled';

    let matchesTab = false;
    if (activeTab === 'upcoming') matchesTab = isUpcoming;
    else if (activeTab === 'completed') matchesTab = isCompleted;
    else if (activeTab === 'cancelled') matchesTab = isCancelled;

    const matchesMember = selectedMember === 'all' || a.patient_id === selectedMember || a.family_member_id === selectedMember;
    const matchesSearch = !searchQuery || 
      a.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.hospital_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patient_name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesMember && matchesSearch;
  });

  const slots = ['09:30 AM', '10:30 AM', '11:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 mb-3 border border-white/15">
              <CalendarCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>OPD Consultation Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">Doctor Appointments</h1>
            <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-xl leading-relaxed">
              Track confirmed hospital consultations, download digital OPD passes, reschedule slots, and attach Care Associates for physical accompaniment.
            </p>
          </div>

          <button
            onClick={onBookDoctorClick}
            className="flex items-center space-x-2 px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Doctor</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'upcoming' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming ({appointments.filter(a => a.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'completed' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past / Completed ({appointments.filter(a => a.status === 'completed').length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'cancelled' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
            </button>
          </div>

          {/* Family Member Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold">Patient:</span>
            <select
              value={selectedMember}
              onChange={e => setSelectedMember(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold"
            >
              <option value="all">All Family Members</option>
              {familyMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, hospital, or reason..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Appointments List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-2 glass-card rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700 text-sm">No {activeTab} appointments found</p>
            <p className="text-xs text-slate-500 mt-1">Book an accredited specialist in Jalandhar anytime.</p>
            <button
              onClick={onBookDoctorClick}
              className="mt-4 px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          filteredAppointments.map(appt => {
            const isConfirmed = appt.status === 'confirmed' || appt.status === 'scheduled';
            const isCompleted = appt.status === 'completed';
            const isCancelled = appt.status === 'cancelled';

            return (
              <div 
                key={appt.id} 
                className="glass-card rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wider">
                          Token: {appt.token_number || 'OPD-18'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({appt.appointment_code || 'APPT-4421'})
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-0.5 font-heading">
                        {appt.doctor_name}
                      </h3>
                      <p className="text-xs text-teal-700 font-semibold">{appt.doctor_specialty}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isConfirmed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      isCompleted ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {appt.status?.toUpperCase()}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <p className="flex items-center font-medium text-slate-800">
                      <User className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                      <span>Patient: <strong>{appt.patient_name}</strong> {appt.patient_relation ? `(${appt.patient_relation})` : ''}</span>
                    </p>

                    <p className="flex items-center text-slate-600">
                      <Building2 className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                      <span>{appt.hospital_name}</span>
                    </p>

                    <p className="flex items-center text-slate-800 font-semibold">
                      <Clock className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                      <span>{appt.appointment_date} at {appt.appointment_time}</span>
                    </p>

                    {appt.reason_for_visit && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        Reason: "{appt.reason_for_visit}"
                      </p>
                    )}

                    {/* Companion Status Badge */}
                    {appt.accompanied_by_rep ? (
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-2">
                          <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>Care Companion Assigned: <strong>{appt.representative_name || 'Rajesh Kumar'}</strong></span>
                        </div>
                        <a href={`tel:${appt.representative_phone || '+919872234567'}`} className="text-amber-800 font-bold hover:underline">
                          Call
                        </a>
                      </div>
                    ) : isConfirmed ? (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">No companion assigned</span>
                        <button
                          type="button"
                          onClick={() => handleAttachCompanion(appt.id)}
                          className="font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                        >
                          + Add Companion (₹1,200)
                        </button>
                      </div>
                    ) : null}

                    {isCancelled && appt.cancellation_reason && (
                      <p className="text-[11px] text-rose-600 font-medium">
                        Cancelled: "{appt.cancellation_reason}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Consultation Fee</span>
                    <span className="text-sm font-bold text-slate-900">₹{appt.consultation_fee || 800}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* View Digital Pass */}
                    <button
                      type="button"
                      onClick={() => setPassAppointment(appt)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center space-x-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>

                    {isConfirmed && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setRescheduleAppt(appt);
                            setRescheduleDate(appt.appointment_date || new Date().toISOString().split('T')[0]);
                          }}
                          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelModalAppt(appt)}
                          className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Digital OPD Pass Modal ── */}
      {passAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setPassAppointment(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full">
                VERIFIED HOSPITAL OPD PASS
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2 font-heading">Consultation Token</h2>
              <p className="text-xs text-slate-500">Show this slip at the hospital registration counter</p>
            </div>

            {/* Pass Card */}
            <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 border border-teal-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-300">OPD Queue Token</span>
                  <p className="text-3xl font-black text-white">{passAppointment.token_number || 'OPD-28'}</p>
                </div>
                <div className="p-2 bg-white rounded-xl">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p><strong>Booking Ref:</strong> <span className="font-mono text-teal-200">{passAppointment.appointment_code || 'APPT-8821'}</span></p>
                <p><strong>Patient:</strong> {passAppointment.patient_name} {passAppointment.patient_relation ? `(${passAppointment.patient_relation})` : ''}</p>
                <p><strong>Doctor:</strong> {passAppointment.doctor_name} ({passAppointment.doctor_specialty})</p>
                <p><strong>Hospital:</strong> {passAppointment.hospital_name}</p>
                <p><strong>Slot:</strong> {passAppointment.appointment_date} at {passAppointment.appointment_time}</p>
              </div>

              {passAppointment.accompanied_by_rep && (
                <div className="pt-3 border-t border-white/10 text-xs text-amber-300 flex items-center space-x-2">
                  <HeartHandshake className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Accompanied by Care Associate: <strong>{passAppointment.representative_name || 'Rajesh Kumar'}</strong></span>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setPassAppointment(null)}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reschedule Appointment Modal ── */}
      {rescheduleAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setRescheduleAppt(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 font-heading">Reschedule Appointment</h2>
            <p className="text-xs text-slate-500 mt-1">
              Pick a new convenient date and time slot for {rescheduleAppt.patient_name} with {rescheduleAppt.doctor_name}.
            </p>

            <form onSubmit={handleRescheduleSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select New Date:</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-2">Select New Time Slot:</label>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRescheduleSlot(s)}
                      className={`p-2.5 rounded-xl border-2 font-bold text-center cursor-pointer transition ${
                        rescheduleSlot === s ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-200 text-slate-700 hover:border-teal-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setRescheduleAppt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Confirm Reschedule ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Cancel Reason Modal ── */}
      {cancelModalAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setCancelModalAppt(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 font-heading">Cancel Appointment</h2>
            <p className="text-xs text-slate-500 mt-1">
              Please let the clinic and hospital know the reason for cancellation.
            </p>

            <form onSubmit={handleCancelSubmit} className="mt-5 space-y-4 text-xs">
              <div className="space-y-2">
                {[
                  'Patient not feeling well to travel today',
                  'Doctor unavailable / Clinic advised reschedule',
                  'Family schedule conflict / Out of city',
                  'Consultation no longer required'
                ].map((r, i) => (
                  <label key={i} className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="cancel_reason"
                      value={r}
                      checked={cancelReason === r}
                      onChange={() => setCancelReason(r)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-semibold text-slate-800">{r}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCancelModalAppt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Keep Appointment
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
