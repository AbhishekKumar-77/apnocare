import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  Home,
  Building2,
  Activity,
  Pill,
  FileText,
  Ambulance,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { createServiceRequest } from '../services/api';

const SERVICES_LIST = [
  { id: 'Doctor Appointment', icon: Stethoscope, title: 'Doctor Appointment', priceINR: 950, desc: 'Find, schedule, and accompany to physician consultation.' },
  { id: 'Home Visit', icon: Home, title: 'Home Visit & Attendant', priceINR: 1200, desc: 'Verified care rep visits home to assist with daily living or vitals.' },
  { id: 'Hospital Assistance', icon: Building2, title: 'Hospital Accompaniment', priceINR: 1800, desc: 'Non-clinical assistance with registration, wheelchair, and navigation.' },
  { id: 'Diagnostic Tests', icon: Activity, title: 'Diagnostic Tests & Scans', priceINR: 1100, desc: 'Escort to lab, assistance with fasting protocols, and report pickup.' },
  { id: 'Medicine Assistance', icon: Pill, title: 'Prescription Medicine Pickup', priceINR: 650, desc: 'Fulfillment through licensed pharmacies and delivery with invoice.' },
  { id: 'Report Collection', icon: FileText, title: 'Report Collection & Upload', priceINR: 500, desc: 'Collect physical hospital reports and securely upload to family vault.' },
  { id: 'Medical Transportation', icon: Ambulance, title: 'Medical Transportation', priceINR: 1400, desc: 'Safe assisted cab / non-emergency ambulance coordination.' },
  { id: 'Follow-up Care', icon: Calendar, title: 'Post-Consultation Follow-up', priceINR: 900, desc: 'Schedule follow-up appointments and track medication adherence.' },
];

export default function RequestAssistanceModal({
  isOpen,
  onClose,
  patients,
  onRequestCreated,
  currency,
}) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?._id || 'pat_1');
  const [selectedService, setSelectedService] = useState(SERVICES_LIST[0]);
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [prescriptionAttached, setPrescriptionAttached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdRequest, setCreatedRequest] = useState(null);

  if (!isOpen) return null;

  const currentPatient = patients.find((p) => p._id === selectedPatientId) || patients[0];

  // Currency converter multiplier
  const currencyRates = { INR: 1, USD: 0.012, CAD: 0.016, GBP: 0.0094 };
  const currencySymbols = { INR: '₹', USD: '$', CAD: 'C$', GBP: '£' };
  const rate = currencyRates[currency] || 1;
  const symbol = currencySymbols[currency] || '₹';
  const convertedPrice = Math.round(selectedService.priceINR * rate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        patientId: currentPatient?._id || 'pat_1',
        serviceType: selectedService.id,
        category: selectedService.title,
        description: description || `Requested ${selectedService.title} for ${currentPatient?.name}.`,
        scheduledDate,
        scheduledTime,
        documents: prescriptionAttached
          ? [
              {
                name: 'Prescription_Document.pdf',
                url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
                type: 'Prescription',
                uploadedAt: new Date().toISOString(),
              },
            ]
          : [],
      };

      const res = await createServiceRequest(payload);
      setCreatedRequest(res.data);
      if (onRequestCreated) onRequestCreated(res.data);
    } catch (err) {
      console.error('Error creating request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-sky-600 tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assistance Coordinator</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">Request Healthcare Assistance</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdRequest ? (
          <div className="py-6 space-y-5">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3.5 text-emerald-900">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base">Request Successfully Dispatched!</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Assigned Care Representative: <strong>{createdRequest.representativeName}</strong>
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Scheduled for {createdRequest.scheduledDate} at {createdRequest.scheduledTime} in {createdRequest.city}.
                </p>
                <p className="font-mono text-xs text-emerald-800 mt-2 font-semibold">
                  Tracking ID: #{createdRequest._id}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold">{createdRequest.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold">{createdRequest.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Cost:</span>
                <span className="font-bold text-emerald-700">₹{createdRequest.estimatedPriceINR} (Paid)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm cursor-pointer"
            >
              View Live Timeline on Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* 1. Patient Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Family Member
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {patients.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => setSelectedPatientId(p._id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedPatientId === p._id
                        ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold ring-2 ring-sky-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.relationship} • {p.city}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Service Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Select Required Service
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {SERVICES_LIST.map((svc) => {
                  const Icon = svc.icon;
                  const isSelected = selectedService.id === svc.id;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedService(svc)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                      <div className="text-xs font-semibold leading-snug">{svc.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        ₹{svc.priceINR} / {symbol}{Math.round(svc.priceINR * rate)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Description & Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Instructions / Doctor or Clinic Name
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Appointment with Dr. Harvinder at Patel Hospital, requires wheelchair assistance from car to OPD."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              ></textarea>
            </div>

            {/* 4. Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Time Slot
                </label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="e.g. 10:30 AM"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* 5. Prescription Attachment Mock */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>Attach Doctor Prescription / Referral (Optional)</span>
              </div>
              <button
                type="button"
                onClick={() => setPrescriptionAttached(!prescriptionAttached)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  prescriptionAttached ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {prescriptionAttached ? 'Attached ✓' : 'Upload Mock PDF'}
              </button>
            </div>

            {/* Price Summary & Submit CTA */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Estimated Service Fee</div>
                <div className="text-xl font-black text-slate-900 flex items-baseline gap-1">
                  <span>{symbol}{convertedPrice}</span>
                  <span className="text-xs font-normal text-slate-500">(₹{selectedService.priceINR} INR)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-semibold text-sm shadow-md shadow-sky-600/25 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Request...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Book Assistance</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
