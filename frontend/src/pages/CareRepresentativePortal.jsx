import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CARE_STAGES } from '../components/CareStatusTimeline';
import { 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Camera, 
  Upload, 
  ShieldCheck, 
  AlertTriangle,
  User,
  ArrowRight,
  FileText,
  DollarSign
} from 'lucide-react';

export default function CareRepresentativePortal() {
  const { user } = useAuth();
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusNotes, setStatusNotes] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAssigned();
  }, [user]);

  const loadAssigned = async () => {
    setLoading(true);
    try {
      const data = await api.getRepAssigned();
      setAssignedRequests(data || []);
      if (data && data.length > 0 && !selectedRequest) {
        setSelectedRequest(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStatus = async (nextStageKey) => {
    if (!selectedRequest) return;
    setUpdating(true);
    try {
      let uploadedDocInfo = null;

      // If document attached, upload first
      if (docFile) {
        const formData = new FormData();
        formData.append('file', docFile);
        formData.append('doc_type', 'Prescription');
        formData.append('doc_title', `Prescription for ${selectedRequest.patient_name}`);
        uploadedDocInfo = await api.uploadCareDocument(selectedRequest.id, formData);
        setDocFile(null);
      }

      const updated = await api.updateCareStatus(selectedRequest.id, {
        stage: nextStageKey,
        notes: statusNotes || `Milestone reached: ${nextStageKey.replace(/_/g, ' ')}`,
        uploaded_doc: uploadedDocInfo
      });

      setStatusNotes('');
      setSelectedRequest(updated);
      await loadAssigned();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const currentStageIndex = selectedRequest 
    ? CARE_STAGES.findIndex(s => s.key === selectedRequest.status)
    : -1;
  const nextStage = CARE_STAGES[currentStageIndex + 1] || null;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Representative Header Card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={user?.representative_profile?.photo_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px]">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">{user?.name || 'Rajesh Kumar'}</h1>
              <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] font-semibold rounded-full border border-teal-500/30">
                Verified Care Associate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Service Area: {user?.representative_profile?.service_area || 'Jalandhar City & Cantt'} • {user?.representative_profile?.completed_visits || 52} Completed Visits
            </p>
            <p className="text-[11px] text-teal-300 font-medium mt-0.5">
              Languages: {(user?.representative_profile?.languages || ['Punjabi', 'Hindi', 'English']).join(', ')}
            </p>
          </div>
        </div>

        {/* Earnings & Rating Stats */}
        <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 self-start md:self-auto">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Associate Rating</span>
            <span className="text-lg font-bold text-amber-400">★ {user?.representative_profile?.rating || '4.95'}</span>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Active Duty</span>
            <span className="text-xs font-bold text-emerald-400">On Duty (Available)</span>
          </div>
        </div>
      </div>

      {/* Safety & Medical Boundary Banner */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Important Representative Principle:</p>
          <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
            Your role is physical accompaniment and logistics coordination. Representatives must <strong>never</strong> diagnose conditions, modify prescriptions, or make medical decisions. Always assist the family member in consulting qualified medical professionals.
          </p>
        </div>
      </div>

      {/* Layout: Assigned Visits & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Assigned Care Requests */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Assigned Care Requests ({assignedRequests.length})
          </h3>

          <div className="space-y-3">
            {assignedRequests.map(req => {
              const isSelected = selectedRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-4 rounded-2xl border cursor-pointer transition text-xs ${
                    isSelected ? 'bg-teal-50 border-teal-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{req.patient_name}</span>
                    <span className="px-2 py-0.5 bg-teal-600 text-white rounded-md text-[10px] font-semibold">
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">{req.service_type}</p>
                  <p className="text-slate-400 text-[11px] mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {req.pickup_address}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Visit Manager & One-Click Milestones */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* Visit Overview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    {selectedRequest.service_type}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    Patient: {selectedRequest.patient_name} ({selectedRequest.patient_relation})
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Pickup: {selectedRequest.pickup_address}
                  </p>
                  <p className="text-xs text-slate-500">
                    Patient Phone: <strong>{selectedRequest.patient_phone || 'Available on file'}</strong>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Remote Sponsor</p>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedRequest.user_name}</p>
                  <p className="text-[11px] text-slate-500">{selectedRequest.user_phone}</p>
                </div>
              </div>

              {/* Special Instructions from remote family */}
              {selectedRequest.special_instructions && (
                <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 text-xs text-teal-900">
                  <span className="font-bold block mb-0.5">Family Instructions:</span>
                  <p className="italic">"{selectedRequest.special_instructions}"</p>
                </div>
              )}

              {/* One-Click Milestone Advancement */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Update Real-Time Milestone
                </h4>

                <div className="text-xs text-slate-600">
                  Current Status: <strong className="text-teal-700 uppercase">{selectedRequest.status.replace(/_/g, ' ')}</strong>
                </div>

                {nextStage ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 font-medium">
                      Next Step in Care Protocol: <strong className="text-slate-900 font-bold">{nextStage.label}</strong>
                    </p>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Representative Visit Notes (visible to family):
                      </label>
                      <input
                        type="text"
                        value={statusNotes}
                        onChange={e => setStatusNotes(e.target.value)}
                        placeholder={`e.g. ${nextStage.label} completed smoothly`}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Upload document during visit (prescription, bill) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Attach Doctor's Prescription / Document Photo (Optional):
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={e => setDocFile(e.target.files[0])}
                        className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                      />
                      {docFile && (
                        <p className="text-[11px] text-teal-700 mt-1">✓ Ready to upload: {docFile.name}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdvanceStatus(nextStage.key)}
                      disabled={updating}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-2"
                    >
                      <span>{updating ? 'Updating Milestone...' : `Confirm: Mark "${nextStage.label}"`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center">
                    ✓ This Care Assistance visit has been completed successfully!
                  </div>
                )}
              </div>

              {/* Real-time Timeline Record */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Visit Activity Log
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedRequest.timeline?.map((t, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{t.title}</span>
                        {t.notes && <p className="text-[11px] text-slate-600 mt-0.5">"{t.notes}"</p>}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              Select a care request on the left.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
