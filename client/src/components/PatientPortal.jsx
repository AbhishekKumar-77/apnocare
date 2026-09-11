import React, { useState } from 'react';
import {
  Stethoscope,
  Pill,
  Activity,
  HeartHandshake,
  ShieldAlert,
  PhoneCall,
  User,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Loader2,
} from 'lucide-react';
import { createServiceRequest } from '../services/api';

export default function PatientPortal({
  currentUser,
  patients,
  requests,
  onTriggerSOS,
  onRequestCreated,
}) {
  const patient = patients.find((p) => p.name === currentUser.name || p._id === 'pat_1') || patients[0];
  const activeRequests = requests.filter((r) => r.patientId === patient?._id && !['COMPLETED', 'CANCELLED'].includes(r.status));
  const latestRequest = activeRequests[0];

  const [oneTouchLoading, setOneTouchLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleQuickRequest = async (serviceName, iconName) => {
    setOneTouchLoading(serviceName);
    setSuccessMessage('');
    try {
      const res = await createServiceRequest({
        patientId: patient?._id || 'pat_1',
        serviceType: serviceName,
        category: `One-Touch Elderly Assistance: ${serviceName}`,
        description: `Requested directly by ${patient?.name} via Big-Button Parent Portal.`,
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: 'Immediate Coordination',
      });
      if (onRequestCreated) onRequestCreated(res.data);
      setSuccessMessage(`Help is on the way! We assigned your care representative for "${serviceName}".`);
    } catch (err) {
      console.error(err);
    } finally {
      setOneTouchLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Warm Elderly Greeting */}
      <div className="bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-800 mb-1">
          <Heart className="w-8 h-8 fill-amber-600 text-amber-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Namaste, {patient?.name || 'Mata Ji'}
        </h1>
        <p className="text-base sm:text-lg text-slate-700 font-medium max-w-xl mx-auto">
          Your family (Arjun) has connected you with your trusted local care team in {patient?.city || 'Jalandhar'}.
        </p>
      </div>

      {successMessage && (
        <div className="p-5 bg-emerald-100 border-2 border-emerald-400 rounded-3xl text-emerald-950 flex items-center gap-4 text-base font-bold animate-in fade-in">
          <CheckCircle2 className="w-8 h-8 text-emerald-700 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Active Assistance Status Card if currently in progress */}
      {latestRequest && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-300 shadow-md space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                Current Scheduled Assistance
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                {latestRequest.serviceType}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                {latestRequest.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg">
                R
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Your Care Representative</p>
                <p className="text-lg font-black text-slate-900">{latestRequest.representativeName}</p>
                <p className="text-xs text-slate-600">Badge ID: AC-JAL-042 • Contact: +91 98140 55432</p>
              </div>
            </div>

            <a
              href="tel:+919814055432"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call Rahul Sharma</span>
            </a>
          </div>
        </div>
      )}

      {/* BIG ACCESSIBLE TOUCH BUTTONS */}
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-4 text-center sm:text-left">
          Tap Below What You Need:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Button 1: Doctor */}
          <button
            onClick={() => handleQuickRequest('Doctor Appointment', 'Stethoscope')}
            disabled={!!oneTouchLoading}
            className="p-6 rounded-3xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-left cursor-pointer transition-all flex items-center gap-5 hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Stethoscope className="w-9 h-9" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">Need a Doctor</div>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                Book clinic visit or doctor appointment
              </p>
            </div>
          </button>

          {/* Button 2: Medicine */}
          <button
            onClick={() => handleQuickRequest('Medicine Assistance', 'Pill')}
            disabled={!!oneTouchLoading}
            className="p-6 rounded-3xl bg-teal-50 hover:bg-teal-100 border-2 border-teal-300 text-left cursor-pointer transition-all flex items-center gap-5 hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Pill className="w-9 h-9" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">Need Medicine</div>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                Pick up monthly prescription refill
              </p>
            </div>
          </button>

          {/* Button 3: Lab Test */}
          <button
            onClick={() => handleQuickRequest('Diagnostic Tests', 'Activity')}
            disabled={!!oneTouchLoading}
            className="p-6 rounded-3xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-300 text-left cursor-pointer transition-all flex items-center gap-5 hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Activity className="w-9 h-9" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">Need a Lab Test</div>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                Blood test or scan accompaniment
              </p>
            </div>
          </button>

          {/* Button 4: Home Help */}
          <button
            onClick={() => handleQuickRequest('Home Visit', 'HeartHandshake')}
            disabled={!!oneTouchLoading}
            className="p-6 rounded-3xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-left cursor-pointer transition-all flex items-center gap-5 hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <HeartHandshake className="w-9 h-9" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">Need Home Help</div>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                Care representative visit for assistance
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Emergency & Family Contact Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {/* BIG EMERGENCY SOS BUTTON */}
        <button
          onClick={onTriggerSOS}
          className="p-6 rounded-3xl bg-rose-600 hover:bg-rose-700 text-white text-left cursor-pointer transition-all flex items-center gap-5 shadow-lg shadow-rose-600/30"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-700 border-2 border-white text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="w-10 h-10 animate-bounce" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-wide">EMERGENCY SOS</div>
            <p className="text-sm text-rose-100 mt-0.5 font-medium">
              Tap for immediate local emergency coordination
            </p>
          </div>
        </button>

        {/* CALL FAMILY BUTTON */}
        <a
          href="tel:+14165550192"
          className="p-6 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white text-left cursor-pointer transition-all flex items-center gap-5 shadow-lg"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-sky-400 flex items-center justify-center shrink-0">
            <PhoneCall className="w-9 h-9" />
          </div>
          <div>
            <div className="text-2xl font-black">Call Family</div>
            <p className="text-sm text-slate-300 mt-0.5 font-medium">
              Direct call to Arjun (Son in Canada)
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
