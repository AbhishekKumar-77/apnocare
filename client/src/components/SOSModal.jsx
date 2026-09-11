import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, X, CheckCircle2, MapPin, User, Loader2 } from 'lucide-react';
import { createServiceRequest } from '../services/api';

export default function SOSModal({ isOpen, onClose, patients, onEmergencyCreated }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?._id || 'pat_1');
  const [emergencyDetails, setEmergencyDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [triggeredSuccess, setTriggeredSuccess] = useState(null);

  if (!isOpen) return null;

  const currentPatient = patients.find((p) => p._id === selectedPatientId) || patients[0];

  const handleTriggerSOS = async () => {
    setLoading(true);
    try {
      const payload = {
        patientId: currentPatient?._id || 'pat_1',
        serviceType: 'Emergency Coordination',
        category: 'Critical SOS Escalation',
        description: emergencyDetails || 'Immediate non-clinical family escort and emergency hospital liaison required.',
        isEmergency: true,
      };
      const res = await createServiceRequest(payload);
      setTriggeredSuccess(res.data);
      if (onEmergencyCreated) onEmergencyCreated(res.data);
    } catch (err) {
      console.error('Error triggering SOS:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-rose-500 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-rose-600 tracking-tight">
                Emergency Healthcare Assistance
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                ApnoCare Rapid Local Care Coordination
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Life-threatening Warning Disclaimer */}
        <div className="mt-5 p-4 bg-rose-50 border-l-4 border-rose-600 rounded-xl text-xs sm:text-sm text-rose-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>CRITICAL MEDICAL ADVISORY</span>
          </div>
          <p className="leading-relaxed">
            For immediate, life-threatening clinical emergencies (heart attack, severe trauma, stroke, unconsciousness), <strong>dial 108 or 112 in India immediately</strong>.
          </p>
          <p className="text-[11px] text-rose-800/80">
            ApnoCare provides immediate local human assistance, hospital navigation, family communication, and emergency service coordination. Representatives do not administer clinical treatment.
          </p>
        </div>

        {triggeredSuccess ? (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-900 text-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">SOS Protocol Successfully Dispatched!</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Local emergency coordinator in <strong>{triggeredSuccess.city}</strong> has been assigned. All configured family emergency contacts have received SMS & in-app alerts.
                </p>
                <p className="font-mono text-xs text-emerald-800 mt-2 font-semibold">
                  Ticket ID: #{triggeredSuccess._id}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>Assigned Representative:</span>
                <span className="font-bold text-slate-900">{triggeredSuccess.representativeName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Patient:</span>
                <span className="font-bold text-slate-900">{triggeredSuccess.patientName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Location:</span>
                <span className="font-bold text-slate-900">{triggeredSuccess.city}, Punjab</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm cursor-pointer"
            >
              Return to Tracking Dashboard
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {/* Patient selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Who needs emergency assistance?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {patients.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => setSelectedPatientId(p._id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedPatientId === p._id
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.relationship} • {p.city}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick emergency details */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Brief Situation / Symptoms (Optional)
              </label>
              <textarea
                rows={2}
                value={emergencyDetails}
                onChange={(e) => setEmergencyDetails(e.target.value)}
                placeholder="e.g. High fever with dizziness, need someone to accompany to Patel Hospital immediately..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white resize-none"
              ></textarea>
            </div>

            {/* Direct hotline numbers */}
            <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span className="font-semibold">ApnoCare 24/7 Helpline:</span>
              </div>
              <span className="font-bold font-mono text-slate-900">+91 1800 2766 227</span>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleTriggerSOS}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base tracking-wide shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Dispatching Emergency Protocol...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  <span>CONFIRM & DISPATCH EMERGENCY TEAM</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
