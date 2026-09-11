import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  FileText,
  Users,
  Shield,
  Phone,
  MapPin,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowRight,
  User,
  Pill,
  Share2,
} from 'lucide-react';

export default function CustomerDashboard({
  currentUser,
  patients,
  requests,
  healthRecords,
  familyShares,
  onOpenNewRequest,
  onOpenOnboarding,
  onOpenInviteShare,
  currency,
}) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?._id || 'pat_1');
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'health-records' | 'family-sharing' | 'subscription'

  const activePatient = patients.find((p) => p._id === selectedPatientId) || patients[0];
  const patientRequests = requests.filter((r) => r.patientId === activePatient?._id);
  const patientRecords = healthRecords.filter((h) => h.patientId === activePatient?._id);

  const activeRequests = patientRequests.filter((r) => !['COMPLETED', 'CANCELLED'].includes(r.status));
  const completedRequests = patientRequests.filter((r) => r.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      {/* Top Welcome & Family Member Switcher Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Family Care Command Center • Monitoring from {currentUser.country || 'Abroad'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live updates and healthcare coordination for your parents in India.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenNewRequest}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-semibold text-sm shadow-md shadow-sky-600/20 inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Request Assistance</span>
            </button>
          </div>
        </div>

        {/* Family Member Tabs */}
        <div className="pt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Cared Family Members
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {patients.map((p) => {
              const isSelected = p._id === selectedPatientId;
              const hasActive = requests.some((r) => r.patientId === p._id && !['COMPLETED', 'CANCELLED'].includes(r.status));
              return (
                <button
                  key={p._id}
                  onClick={() => setSelectedPatientId(p._id)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl border text-left cursor-pointer transition-all shrink-0 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/70 shadow-sm ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{p.name}</span>
                      {hasActive && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" title="Active request"></span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {p.relationship} • {p.city}, Punjab
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Add Family Member Button */}
            <button
              onClick={onOpenOnboarding}
              className="px-4 py-3 rounded-2xl border border-dashed border-slate-300 hover:border-sky-500 bg-white hover:bg-sky-50/40 text-slate-600 hover:text-sky-700 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Parent / Relative</span>
            </button>
          </div>
        </div>
      </div>

      {/* Patient Profile Summary Card */}
      {activePatient && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
                <Heart className="w-6 h-6 fill-sky-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{activePatient.name}</h3>
                <p className="text-xs text-slate-400">
                  {activePatient.relationship} • Age {activePatient.age} • Blood Group {activePatient.bloodGroup} • {activePatient.city}, {activePatient.state}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                Mobility: {activePatient.mobility}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                Physician: {activePatient.primaryDoctor}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{activePatient.address || 'Address registered in system'}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Emergency Contact: {activePatient.emergencyContactName} ({activePatient.emergencyContactPhone})</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <Pill className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {activePatient.currentMedications?.length || 0} active daily prescriptions logged
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-3 cursor-pointer transition-colors relative ${
            activeTab === 'requests'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Service Requests ({patientRequests.length})</span>
          {activeTab === 'requests' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('health-records')}
          className={`pb-3 px-3 cursor-pointer transition-colors relative ${
            activeTab === 'health-records'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Health Vault & Documents ({patientRecords.length})</span>
          {activeTab === 'health-records' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('family-sharing')}
          className={`pb-3 px-3 cursor-pointer transition-colors relative ${
            activeTab === 'family-sharing'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Family Sharing ({familyShares.length})</span>
          {activeTab === 'family-sharing' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>
          )}
        </button>
      </div>

      {/* TAB 1: SERVICE REQUESTS & LIVE TRACKING */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Active Requests List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Active Care Coordination</h3>
              <span className="text-xs text-slate-500 font-medium">Real-time representative status</span>
            </div>

            {activeRequests.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">No Active Assistance Requests</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  When you request a doctor appointment, home visit, medicine collection, or hospital escort, your live progress will appear here.
                </p>
                <button
                  onClick={onOpenNewRequest}
                  className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold cursor-pointer"
                >
                  Request Assistance Now
                </button>
              </div>
            ) : (
              activeRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">{req.serviceType}</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                          {req.status}
                        </span>
                        {req.priority === 'EMERGENCY' && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                            🚨 EMERGENCY PRIORITY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Patient: <strong>{req.patientName}</strong> • City: <strong>{req.city}</strong> • Slot: {req.scheduledDate} ({req.scheduledTime})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400">Assigned Care Representative</span>
                      <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5 sm:justify-end">
                        <User className="w-4 h-4 text-sky-600" />
                        <span>{req.representativeName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Milestone Timeline */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Live Journey Milestones
                    </h4>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                      {req.timeline?.map((step, idx) => (
                        <div key={idx} className="relative flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 z-10 shadow-xs">
                            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div className="flex-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{step.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {step.note && (
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {step.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attached Documents if uploaded */}
                  {req.documents?.length > 0 && (
                    <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200/80">
                      <span className="text-xs font-bold text-sky-900 block mb-2">
                        Attached Documents & Reports:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {req.documents.map((doc, idx) => (
                          <a
                            key={idx}
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-xs font-semibold text-sky-700 hover:bg-sky-50 shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{doc.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Past Completed History */}
          {completedRequests.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Past Assistance History</h3>
              <div className="space-y-3">
                {completedRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800">{req.serviceType}</div>
                      <div className="text-xs text-slate-500">
                        {req.patientName} • Completed on {req.scheduledDate} by {req.representativeName}
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Completed ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HEALTH VAULT & DOCUMENTS */}
      {activeTab === 'health-records' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Secure Health Records Vault</h3>
              <p className="text-xs text-slate-500">
                Encrypted prescriptions, lab tests, ultrasound scans, and hospital discharge reports for {activePatient?.name}.
              </p>
            </div>
          </div>

          {patientRecords.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No medical records uploaded yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Your care representative will automatically upload doctor prescriptions and test reports here after each visit.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {patientRecords.map((rec) => (
                <div
                  key={rec._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-50 text-sky-700">
                        {rec.documentType}
                      </span>
                      <span className="text-xs text-slate-400">{rec.date}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">{rec.title}</h4>
                    <p className="text-xs text-slate-500 mb-2">
                      Doctor: <strong>{rec.doctorName}</strong> ({rec.facility})
                    </p>
                    {rec.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{rec.notes}"
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">By {rec.uploadedBy}</span>
                    <a
                      href={rec.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                    >
                      <span>View PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FAMILY SHARING */}
      {activeTab === 'family-sharing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Family Member Access Sharing</h3>
              <p className="text-xs text-slate-500">
                Grant your siblings or spouse permission to monitor parent health updates, view uploaded reports, or book assistance.
              </p>
            </div>
            <button
              onClick={onOpenInviteShare}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Invite Family Member</span>
            </button>
          </div>

          <div className="space-y-3">
            {familyShares.map((share) => (
              <div
                key={share._id}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                    {share.invitedName?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{share.invitedName}</div>
                    <div className="text-xs text-slate-500">{share.invitedEmail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {share.permission === 'FULL_ACCESS' ? 'Full Access' : 'View Only'}
                  </span>
                  <span className="text-xs text-slate-400">Status: {share.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
