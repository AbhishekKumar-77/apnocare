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
  Plus
} from 'lucide-react';

export default function Appointments({ onBookDoctorClick }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await api.getAppointments();
      setAppointments(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await api.cancelAppointment(id, 'Patient schedule change');
        await loadAppointments();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Family Doctor Consultations
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Doctor Appointments</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Track confirmed specialist appointments across all family members, review appointment codes, and coordinate with clinic reception.
          </p>
        </div>

        <button
          onClick={onBookDoctorClick}
          className="flex items-center space-x-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Doctor</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600 text-sm">No appointments scheduled</p>
            <p className="text-xs mt-1">Search for verified doctors in Jalandhar and select convenient time slots.</p>
          </div>
        ) : (
          appointments.map(appt => {
            const isConfirmed = appt.status === 'confirmed';
            return (
              <div 
                key={appt.id} 
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                        Booking ID: {appt.appointment_code}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-0.5">
                        {appt.doctor_name}
                      </h3>
                      <p className="text-xs text-teal-700 font-semibold">{appt.doctor_specialty}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isConfirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {appt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <p className="flex items-center font-medium text-slate-800">
                      <User className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                      <span>Patient: <strong>{appt.patient_name}</strong> ({appt.patient_relation})</span>
                    </p>

                    <p className="flex items-center text-slate-600">
                      <Building2 className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                      <span>{appt.hospital_name}</span>
                    </p>

                    <p className="flex items-center text-slate-700 font-semibold">
                      <Clock className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                      <span>{appt.appointment_date} at {appt.appointment_time}</span>
                    </p>

                    {appt.reason_for_visit && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl">
                        Reason: "{appt.reason_for_visit}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Consultation Fee</span>
                    <span className="text-sm font-bold text-slate-900">₹{appt.consultation_fee || 800}</span>
                  </div>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
