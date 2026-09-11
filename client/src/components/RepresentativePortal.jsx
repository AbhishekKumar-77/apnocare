import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Upload,
  AlertTriangle,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Send,
  Loader2,
} from 'lucide-react';
import { updateTaskStep } from '../services/api';

export default function RepresentativePortal({
  currentUser,
  tasks,
  onTaskUpdated,
}) {
  const [selectedTask, setSelectedTask] = useState(tasks[0] || null);
  const [noteInput, setNoteInput] = useState('');
  const [uploadDocName, setUploadDocName] = useState('');
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const repTasks = tasks.filter((t) => t.representativeName?.includes('Rahul') || t.representativeId === 'rep_1');
  const currentTask = selectedTask || repTasks[0];

  const handleStepAction = async (actionKey, docDetails = null) => {
    if (!currentTask) return;
    setLoadingAction(true);

    try {
      const payload = {
        action: actionKey,
        note: noteInput || undefined,
        ...(docDetails || {}),
      };
      const res = await updateTaskStep(currentTask._id, payload);
      onTaskUpdated(res.data);
      setSelectedTask(res.data);
      setNoteInput('');
      setShowDocUpload(false);
    } catch (err) {
      console.error('Error advancing task step:', err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Representative Header & Verification Badge */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Rep (AC-JAL-042)</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Field Operations: <strong>Jalandhar, Punjab</strong> • 148 Completed Assists • 4.9⭐ Rating
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            Status: Active On Duty
          </span>
        </div>
      </div>

      {/* Non-clinical Scope Limitation Alert */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Representative Protocol Reminder:</span> Representatives provide physical accompaniment, non-clinical coordination, and family communication. <strong>Never</strong> give clinical advice, interpret medical reports, or alter patient medications.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Assigned Tasks List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Assigned Tasks & Visits ({repTasks.length})
          </h2>

          {repTasks.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
              No tasks assigned at this moment.
            </div>
          ) : (
            repTasks.map((t) => {
              const isSelected = currentTask?._id === t._id;
              return (
                <button
                  key={t._id}
                  onClick={() => setSelectedTask(t)}
                  className={`w-full p-5 rounded-3xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/70 shadow-sm ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-md">
                      {t.serviceType}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{t.scheduledTime}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{t.patientName}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.city} • {t.scheduledDate}</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">#{t._id}</span>
                    <span className="font-bold text-sky-600">{t.status}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Active Task Execution Console */}
        <div className="lg:col-span-7">
          {currentTask ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Active Mission Controller
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {currentTask.serviceType} for {currentTask.patientName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Location: <strong>{currentTask.city}</strong> • Slot: {currentTask.scheduledDate} at {currentTask.scheduledTime}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                  {currentTask.status}
                </span>
              </div>

              {/* Patient Details Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Address:</span>
                  <span className="font-bold text-slate-900">House 42, Model Town, Jalandhar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number:</span>
                  <span className="font-bold text-slate-900">+91 98721 00123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Instructions:</span>
                  <span className="font-bold text-slate-900">{currentTask.description}</span>
                </div>
              </div>

              {/* STEP ACTION CONTROLLERS */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Tap to Broadcast Live Milestone to Family:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleStepAction('ACCEPT')}
                    disabled={loadingAction}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-xs font-bold text-slate-800 cursor-pointer transition-colors"
                  >
                    1. Accept Task
                  </button>
                  <button
                    onClick={() => handleStepAction('CONTACT')}
                    disabled={loadingAction}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-xs font-bold text-slate-800 cursor-pointer transition-colors"
                  >
                    2. Patient Contacted
                  </button>
                  <button
                    onClick={() => handleStepAction('ON_THE_WAY')}
                    disabled={loadingAction}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-xs font-bold text-slate-800 cursor-pointer transition-colors"
                  >
                    3. On The Way
                  </button>
                  <button
                    onClick={() => handleStepAction('ARRIVED')}
                    disabled={loadingAction}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-xs font-bold text-slate-800 cursor-pointer transition-colors"
                  >
                    4. Arrived at Home
                  </button>
                  <button
                    onClick={() => handleStepAction('AT_CLINIC')}
                    disabled={loadingAction}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-xs font-bold text-slate-800 cursor-pointer transition-colors"
                  >
                    5. Reached Clinic
                  </button>
                  <button
                    onClick={() => setShowDocUpload(true)}
                    disabled={loadingAction}
                    className="p-3 rounded-2xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-xs font-bold text-teal-800 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Report</span>
                  </button>
                </div>

                {/* Final Complete Button */}
                <button
                  onClick={() => handleStepAction('COMPLETE')}
                  disabled={loadingAction}
                  className="w-full mt-3 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Assistance Completed</span>
                </button>
              </div>

              {/* Upload Document Drawer */}
              {showDocUpload && (
                <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-200 space-y-3">
                  <span className="text-xs font-bold text-sky-950 uppercase block">
                    Upload Doctor Prescription / Test Report to Family Vault
                  </span>
                  <input
                    type="text"
                    value={uploadDocName}
                    onChange={(e) => setUploadDocName(e.target.value)}
                    placeholder="Document Title (e.g. Ultrasound_Report_Apex.pdf)"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleStepAction('UPLOAD_DOC', {
                          documentName: uploadDocName || 'Medical_Prescription.pdf',
                          documentUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
                          documentType: 'Prescription & Report',
                        })
                      }
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Confirm Upload & Notify Family
                    </button>
                    <button
                      onClick={() => setShowDocUpload(false)}
                      className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
              Select a task on the left to view instructions and update milestones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
