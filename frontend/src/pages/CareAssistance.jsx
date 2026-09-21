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
  FileText,
  Phone,
  MessageCircle,
  Send,
  Printer,
  Activity,
  Car
} from 'lucide-react';

export default function CareAssistance({ initialPatient, openWizardByDefault = false }) {
  const { user } = useAuth();
  const [careRequests, setCareRequests] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(openWizardByDefault);

  // Associate Live Chat Modal
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'associate', text: 'Sat Sri Akal Abhishek Ji! I have picked up Jaswant Mata Ji safely from Model Town home.', time: '10:05 AM' },
    { sender: 'associate', text: 'We have reached Tagore Hospital OPD. Wheelchair arranged comfortably.', time: '10:32 AM' },
    { sender: 'associate', text: 'Token #28 collected. Sitting in OPD waiting lounge with Mata Ji.', time: '10:45 AM' },
    { sender: 'associate', text: 'Dr. Rajiv Sharma has examined Mata Ji. BP recorded at 132/84 mmHg, prescription renewed. I am at the hospital pharmacy counter now getting the medicines.', time: '11:15 AM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Clinical Handover Summary Modal
  const [showHandoverModal, setShowHandoverModal] = useState(false);

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
      language_pref: member ? member.preferred_language : prev.language_pref,
      preferred_hospital_doctor: member?.preferred_hospital || prev.preferred_hospital_doctor
    }));
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    const patient = familyMembers.find(f => f.id === formData.family_member_id) || familyMembers[0];

    const newReq = {
      family_member_id: formData.family_member_id,
      patient_name: patient?.name,
      patient_relation: patient?.relation,
      patient_age: patient?.age,
      patient_gender: patient?.gender,
      patient_phone: patient?.phone,
      pickup_address: formData.pickup_address,
      service_type: formData.service_type,
      preferred_hospital_doctor: formData.preferred_hospital_doctor,
      gender_pref: formData.gender_pref,
      language_pref: formData.language_pref,
      scheduled_date: formData.scheduled_date,
      scheduled_time: formData.scheduled_time,
      special_instructions: formData.special_instructions
    };

    try {
      const created = await api.createCareRequest(newReq);
      setShowWizard(false);
      await loadData();
      setSelectedRequest(created);
    } catch (err) {
      alert(err.message || 'Failed to create care request');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulate automated associate response after 1 second
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'associate',
          text: 'Ji bilkul, I am taking full care of Mata Ji. Will make sure she drinks water and rests comfortably while we travel back.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-slate-950 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black/10 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 mb-3 border border-black/10">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
              <span>Flagship Physical Care Companionship • Punjab</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-950">Care Assistance</h1>
            <p className="text-xs sm:text-sm text-slate-900/90 mt-1 max-w-xl leading-relaxed font-medium">
              Verified local Care Associates physically pick up your elderly parents from home, navigate crowded hospital queues, take consultation notes, collect medicines, and ensure a safe return home.
            </p>
          </div>

          <button
            onClick={() => {
              setWizardStep(1);
              setShowWizard(true);
            }}
            className="flex items-center space-x-2 px-5 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-lg transition self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Request Care Associate</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Care Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-heading">Family Care Visits</h2>
            <span className="text-xs text-slate-400">{careRequests.length} Scheduled</span>
          </div>

          <div className="space-y-3">
            {careRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 text-slate-400 text-xs">
                No care requests yet. Click above to arrange physical care companionship for your loved one.
              </div>
            ) : (
              careRequests.map(req => {
                const isSelected = selectedRequest && (selectedRequest.id === req.id || selectedRequest._id === req._id);
                return (
                  <div
                    key={req.id || req._id}
                    onClick={() => setSelectedRequest(req)}
                    className={`glass-card p-5 rounded-3xl border-2 transition cursor-pointer ${
                      isSelected 
                        ? 'border-amber-400 bg-amber-50/40 shadow-sm' 
                        : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
                        {req.request_code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {req.status?.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 mt-1 font-heading">{req.patient_name}</h3>
                    <p className="text-xs text-slate-600 truncate mt-0.5">{req.preferred_hospital_doctor}</p>

                    <p className="text-[11px] text-slate-500 mt-2 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {req.scheduled_date} at {req.scheduled_time}
                    </p>

                    {req.representative_name && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600">Associate: <strong>{req.representative_name}</strong></span>
                        <span className="text-amber-800 font-bold">★ {req.representative_rating || 4.95}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Live Stepper & Interactive Action Bar (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {selectedRequest ? (
            <>
              {/* Quick Associate Action Bar */}
              <div className="glass-card rounded-3xl p-4 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedRequest.representative_photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"}
                      alt="Care Associate"
                      className="w-10 h-10 rounded-xl object-cover border border-amber-300"
                    />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white"></span>
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">
                      {selectedRequest.representative_name || 'Rajesh Kumar'} (Active on Duty)
                    </p>
                    <p className="text-[11px] text-teal-700 font-medium">Physically accompanying {selectedRequest.patient_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowChatModal(true)}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Live Chat</span>
                  </button>

                  <a
                    href={`tel:${selectedRequest.representative_phone || '+919872234567'}`}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center space-x-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  <button
                    onClick={() => setShowHandoverModal(true)}
                    className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center space-x-1 border border-teal-200"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Handover Report</span>
                  </button>
                </div>
              </div>

              {/* Status Timeline */}
              <CareStatusTimeline careRequest={selectedRequest} />
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
              <HeartHandshake className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">No Care Visit Selected</p>
              <p className="text-xs mt-1">Click a visit on the left or create a new care assistance request.</p>
            </div>
          )}
        </div>

      </div>

      {/* ── LIVE ASSOCIATE CHAT MODAL ── */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full h-[520px] flex flex-col justify-between p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={selectedRequest?.representative_photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"}
                    alt="Associate"
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-heading">
                    {selectedRequest?.representative_name || 'Rajesh Kumar'}
                  </h3>
                  <p className="text-[11px] text-teal-700 font-medium">Care Associate on Site • Punjabi & Hindi</p>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-xs' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask associate an update (e.g. How is Mata Ji feeling?)..."
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="p-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl cursor-pointer transition shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── CLINICAL HANDOVER REPORT MODAL ── */}
      {showHandoverModal && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-xs space-y-4">
            <button onClick={() => setShowHandoverModal(false)} className="absolute top-5 right-5 p-2 text-slate-400 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-teal-700 font-bold uppercase tracking-wider text-[10px]">
              <FileText className="w-4 h-4" />
              <span>Digital Clinical Handover Summary</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Visit Summary for {selectedRequest.patient_name}
            </h2>
            <p className="text-slate-500">Prepared by Care Associate Rajesh Kumar • Tagore Hospital OPD</p>

            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">On-Site BP</span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedRequest.clinical_summary?.bp || '132/84 mmHg'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Pulse Rate</span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedRequest.clinical_summary?.pulse || '74 bpm'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Weight</span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedRequest.clinical_summary?.weight || '66 kg'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 space-y-1">
                <p className="font-bold text-teal-900">Doctor Diagnosis & Examination:</p>
                <p className="text-teal-800 leading-relaxed">
                  {selectedRequest.clinical_summary?.diagnosis || 'Essential Hypertension (Controlled), Mild Knee Arthralgia'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">Prescription Refill Obtained:</p>
                <p className="text-slate-700">
                  {selectedRequest.clinical_summary?.rx_medicines || 'Tab Telmisartan 40mg (1-0-0), Tab Shelcal 500mg (0-1-0)'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">Care Associate Clinical Handover Notes:</p>
                <p className="text-slate-600 italic leading-relaxed">
                  "Mata Ji walked comfortably with wheelchair support at hospital entrance. Dr. Rajiv Sharma expressed satisfaction with current BP levels. Prescription was purchased from hospital pharmacy and handed to Mata Ji with clear Punjabi dosage instructions. Returning safely home."
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Handover Report</span>
              </button>
              <button
                type="button"
                onClick={() => setShowHandoverModal(false)}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MULTI-STEP "GET CARE ASSISTANCE" WIZARD MODAL ── */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            
            {/* Wizard Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Step {wizardStep} of 3</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {wizardStep === 1 && "Who needs physical healthcare assistance?"}
                  {wizardStep === 2 && "Healthcare Service & Location"}
                  {wizardStep === 3 && "Care Representative Preferences"}
                </h3>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
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
                            ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-400/20'
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
                        <p className="text-[10px] text-amber-800 mt-1">Lang: {member.preferred_language}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pickup Address in Jalandhar / Punjab:</label>
                    <input
                      type="text"
                      value={formData.pickup_address}
                      onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      required
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl cursor-pointer"
                    >
                      Next: Service Details →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Service Type & Scheduling */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Assistance Type Needed:</label>
                    <select
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="Doctor Visit Assistance">Doctor Visit Assistance (Pickup + OPD Escort + Safe Return)</option>
                      <option value="Hospital Admission / Discharge Support">Hospital Admission / Discharge Support</option>
                      <option value="Diagnostic Lab Test Escort">Diagnostic Lab Test Escort</option>
                      <option value="Post-Operative Home Check-in">Post-Operative Home Check-in & Vitals</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Destination Medical Center / Doctor:</label>
                    <input
                      type="text"
                      value={formData.preferred_hospital_doctor}
                      onChange={(e) => setFormData({ ...formData, preferred_hospital_doctor: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Date:</label>
                      <input
                        type="date"
                        value={formData.scheduled_date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Time:</label>
                      <input
                        type="text"
                        value={formData.scheduled_time}
                        onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl cursor-pointer"
                    >
                      Next: Representative & Instructions →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Instructions & Confirmation */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Representative Gender:</label>
                      <select
                        value={formData.gender_pref}
                        onChange={(e) => setFormData({ ...formData, gender_pref: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Any">Any Gender</option>
                        <option value="Female Only">Female Associate Preferred</option>
                        <option value="Male Only">Male Associate Preferred</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Language Preference:</label>
                      <select
                        value={formData.language_pref}
                        onChange={(e) => setFormData({ ...formData, language_pref: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Punjabi">Punjabi (Fluent)</option>
                        <option value="Hindi">Hindi</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Special Instructions for Associate:</label>
                    <textarea
                      rows={3}
                      value={formData.special_instructions}
                      onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                      placeholder="E.g. Mother walks slowly due to arthritis. Please arrange wheelchair at hospital entrance and note doctor instructions in Punjabi."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Care Service Fee:</span>
                      <span>₹1,200</span>
                    </div>
                    <p className="text-[10px] text-amber-800">
                      Includes local transport coordination, full physical accompaniment, and live progress updates.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateRequest}
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg cursor-pointer"
                    >
                      Confirm & Dispatch Care Associate ✓
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
