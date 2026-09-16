import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import CareStatusTimeline from '../components/CareStatusTimeline';
import { 
  HeartHandshake, 
  Plus, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  User, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';

export default function CareAssistance({ initialPatient, openWizardByDefault = false }) {
  const { user } = useAuth();
  const [careRequests, setCareRequests] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(openWizardByDefault);

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState({
    family_member_id: initialPatient ? initialPatient.id : '',
    service_type: 'Doctor Visit Assistance',
    pickup_address: initialPatient ? initialPatient.location : '',
    preferred_provider_mode: 'selected_provider',
    preferred_hospital_doctor: initialPatient ? initialPatient.preferred_hospital : 'Tagore Hospital & Heart Care, Jalandhar',
    gender_pref: 'Any',
    language_pref: initialPatient ? initialPatient.preferred_language : 'Punjabi',
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: '10:00 AM',
    special_instructions: ''
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqs, fam] = await Promise.all([
        api.getCareRequests(),
        api.getFamily()
      ]);
      setCareRequests(reqs || []);
      setFamilyMembers(fam || []);

      if (reqs && reqs.length > 0 && !selectedRequest) {
        setSelectedRequest(reqs[0]);
      }

      if (fam && fam.length > 0 && !formData.family_member_id) {
        setFormData(prev => ({
          ...prev,
          family_member_id: fam[0].id,
          pickup_address: fam[0].location,
          language_pref: fam[0].preferred_language || 'Punjabi',
          preferred_hospital_doctor: fam[0].preferred_hospital || 'Tagore Hospital & Heart Care'
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (memberId) => {
    const member = familyMembers.find(f => f.id === memberId);
    setFormData(prev => ({
      ...prev,
      family_member_id: memberId,
      pickup_address: member ? member.location : prev.pickup_address,
      language_pref: member?.preferred_language || 'Punjabi',
      preferred_hospital_doctor: member?.preferred_hospital || prev.preferred_hospital_doctor
    }));
  };

  const handleCreateRequest = async () => {
    try {
      const newReq = await api.createCareRequest(formData);
      setShowWizard(false);
      setWizardStep(1);
      await loadData();
      setSelectedRequest(newReq);
    } catch (err) {
      alert(err.message || 'Failed to submit care request');
    }
  };

  const activeRequests = careRequests.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
  const pastRequests = careRequests.filter(r => r.status === 'completed' || r.status === 'cancelled');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 to-teal-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>ApnoCare Verified Human Care Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Care Assistance</h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 leading-relaxed">
            When you cannot be there in person, our verified local Care Representatives accompany your loved ones, manage registration queues, stay during consultations, coordinate medications, and keep you live-updated.
          </p>
        </div>

        <button
          onClick={() => {
            setWizardStep(1);
            setShowWizard(true);
          }}
          className="flex items-center space-x-2 px-5 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-2xl shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 self-start sm:self-auto shrink-0"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Get Care Assistance</span>
        </button>
      </div>

      {/* Main Content Layout: Active Visit Stepper + Requests List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Care Requests */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Your Care Visits ({careRequests.length})
          </h3>

          <div className="space-y-3">
            {careRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                No care assistance visits requested yet.
              </div>
            ) : (
              careRequests.map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                const isOngoing = req.status !== 'completed' && req.status !== 'cancelled';
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-4 rounded-2xl cursor-pointer transition border text-xs ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{req.patient_name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOngoing ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-teal-700 font-medium mt-1">{req.service_type}</p>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {req.scheduled_date} at {req.scheduled_time}
                    </p>
                    {req.representative_name && (
                      <p className="text-[11px] text-slate-600 mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <span>Associate: <strong>{req.representative_name}</strong></span>
                        <span className="text-teal-700 font-semibold">★ {req.representative_rating}</span>
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Care Request Live Stepper & Timeline (2 cols) */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <CareStatusTimeline careRequest={selectedRequest} />
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
              <HeartHandshake className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">No Care Visit Selected</p>
              <p className="text-xs mt-1">Click a visit on the left or create a new care assistance request.</p>
            </div>
          )}
        </div>

      </div>

      {/* Multi-Step "Get Care Assistance" Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            
            {/* Wizard Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Step {wizardStep} of 3</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {wizardStep === 1 && "Who needs healthcare assistance?"}
                  {wizardStep === 2 && "Healthcare Service & Location"}
                  {wizardStep === 3 && "Care Representative Preferences"}
                </h3>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              
              {/* Step 1: Select Patient */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <p className="text-slate-600 text-xs">Select which family member requires physical care assistance:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => handlePatientSelect(member.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition ${
                          formData.family_member_id === member.id
                            ? 'bg-teal-50 border-teal-600 shadow-xs ring-2 ring-teal-500/20'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                          <span className="px-2 py-0.5 bg-white text-slate-600 text-[10px] font-semibold rounded-md border border-slate-200">
                            {member.relation}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 truncate">{member.location}</p>
                        <p className="text-[10px] text-teal-700 mt-1">Lang: {member.preferred_language}</p>
                      </div>
                    ))}
                  </div>

                  {familyMembers.length === 0 && (
                    <p className="text-rose-600">Please add a family member first in My Family.</p>
                  )}
                </div>
              )}

              {/* Step 2: Requirement & Provider */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Requirement / Service Type *</label>
                    <select
                      value={formData.service_type}
                      onChange={e => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Doctor Visit Assistance">Doctor Visit Assistance</option>
                      <option value="Hospital Visit & Registration">Hospital Visit & Registration</option>
                      <option value="Diagnostic Test Accompaniment">Diagnostic Test Accompaniment</option>
                      <option value="Medicine Coordination">Medicine Coordination</option>
                      <option value="General Healthcare Assistance">General Healthcare Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Patient Home / Pickup Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.pickup_address}
                      onChange={e => setFormData({ ...formData, pickup_address: e.target.value })}
                      placeholder="e.g. Model Town, Jalandhar, Punjab"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Healthcare Provider</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="provider_mode"
                          checked={formData.preferred_provider_mode === 'selected_provider'}
                          onChange={() => setFormData({ ...formData, preferred_provider_mode: 'selected_provider' })}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>Use my selected doctor / hospital:</span>
                      </label>
                      {formData.preferred_provider_mode === 'selected_provider' && (
                        <input
                          type="text"
                          value={formData.preferred_hospital_doctor}
                          onChange={e => setFormData({ ...formData, preferred_hospital_doctor: e.target.value })}
                          placeholder="e.g. Dr. Rajiv Sharma at Tagore Hospital"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl ml-6 max-w-[90%]"
                        />
                      )}

                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="provider_mode"
                          checked={formData.preferred_provider_mode === 'find_nearby'}
                          onChange={() => setFormData({ ...formData, preferred_provider_mode: 'find_nearby' })}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>Help me find a suitable nearby provider</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences & Schedule */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.scheduled_date}
                        onChange={e => setFormData({ ...formData, scheduled_date: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Time *</label>
                      <input
                        type="text"
                        required
                        value={formData.scheduled_time}
                        onChange={e => setFormData({ ...formData, scheduled_time: e.target.value })}
                        placeholder="e.g. 10:00 AM"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Associate Gender Preference</label>
                      <select
                        value={formData.gender_pref}
                        onChange={e => setFormData({ ...formData, gender_pref: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Any">Any Verified Associate</option>
                        <option value="Female">Female Preference</option>
                        <option value="Male">Male Preference</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Language Preference</label>
                      <select
                        value={formData.language_pref}
                        onChange={e => setFormData({ ...formData, language_pref: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Punjabi">Punjabi</option>
                        <option value="Hindi">Hindi</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Special Instructions for Representative</label>
                    <textarea
                      rows="3"
                      value={formData.special_instructions}
                      onChange={e => setFormData({ ...formData, special_instructions: e.target.value })}
                      placeholder="e.g. Patient walks slowly due to knee pain. Please assist with cab boarding and collect physical prescription copy."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  {/* Summary & Guarantee Box */}
                  <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-[11px] text-teal-800 space-y-1">
                    <p className="font-bold">ApnoCare Care Representative Guarantee:</p>
                    <p>• Verified background checks & emergency training</p>
                    <p>• Never makes medical decisions or alters prescriptions</p>
                    <p>• Live milestone status updates on your remote dashboard</p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Controls */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold text-xs"
                >
                  Back
                </button>
              ) : <div></div>}

              {wizardStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(prev => prev + 1)}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateRequest}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20"
                >
                  Confirm & Request Care Assistance
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
