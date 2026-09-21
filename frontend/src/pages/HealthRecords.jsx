import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  FileText, 
  Upload, 
  Clock, 
  Calendar, 
  Download, 
  ExternalLink, 
  Trash2, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Building2, 
  User, 
  X,
  Activity,
  Heart,
  Share2,
  Printer,
  Copy,
  TrendingUp,
  AlertCircle,
  Eye,
  ShieldCheck
} from 'lucide-react';

export default function HealthRecords() {
  const [activeTab, setActiveTab] = useState('vault'); // 'vault', 'vitals', 'timeline'
  const [records, setRecords] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  // Document Lightbox Preview Modal
  const [previewRecord, setPreviewRecord] = useState(null);

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    family_member_id: '',
    title: '',
    record_type: 'Prescription',
    doctor_name: '',
    hospital_name: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    notes: ''
  });

  // Log Vitals Modal
  const [showVitalModal, setShowVitalModal] = useState(false);
  const [vitalForm, setVitalForm] = useState({
    family_member_id: '',
    type: 'BP',
    systolic: '128',
    diastolic: '82',
    pulse: '72',
    sugarValue: '110',
    sugarType: 'Fasting',
    notes: 'Morning reading taken before breakfast'
  });

  // Share Modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedMemberFilter, selectedTypeFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const fam = await api.getFamily();
      setFamilyMembers(fam || []);

      const params = new URLSearchParams();
      if (selectedMemberFilter !== 'all') params.append('family_member_id', selectedMemberFilter);
      if (selectedTypeFilter !== 'all') params.append('type', selectedTypeFilter);

      const [recData, tlData, vitData] = await Promise.all([
        api.getHealthRecords(params.toString()),
        api.getHealthTimeline(selectedMemberFilter !== 'all' ? `family_member_id=${selectedMemberFilter}` : ''),
        api.getVitals(selectedMemberFilter)
      ]);

      setRecords(recData || []);
      setTimeline(tlData || []);
      setVitals(vitData || []);

      if (fam && fam.length > 0 && !formData.family_member_id) {
        setFormData(prev => ({ ...prev, family_member_id: fam[0].id }));
        setVitalForm(prev => ({ ...prev, family_member_id: fam[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const patient = familyMembers.find(f => f.id === formData.family_member_id) || familyMembers[0];
    const newRecord = {
      _id: 'hr_' + Date.now(),
      id: 'hr_' + Date.now(),
      family_member_id: formData.family_member_id,
      patient_name: patient?.name,
      title: formData.title || `${formData.record_type} Document`,
      record_type: formData.record_type,
      doctor_name: formData.doctor_name || 'Consulting Specialist',
      hospital_name: formData.hospital_name || 'Tagore Hospital & Heart Care',
      date: formData.date,
      file_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      notes: formData.notes,
      diagnosis: formData.diagnosis || 'Clinical Consultation',
      medicines: [],
      created_at: new Date().toISOString()
    };

    try {
      const saved = JSON.parse(localStorage.getItem('apnocare_health_records') || '[]');
      saved.unshift(newRecord);
      localStorage.setItem('apnocare_health_records', JSON.stringify(saved));

      setRecords(saved);
      setShowUploadModal(false);
      setFormData({
        family_member_id: familyMembers[0]?.id || '',
        title: '',
        record_type: 'Prescription',
        doctor_name: '',
        hospital_name: '',
        date: new Date().toISOString().split('T')[0],
        diagnosis: '',
        notes: ''
      });
    } catch (err) {
      alert("Failed to save health record");
    }
  };

  const handleLogVitalSubmit = async (e) => {
    e.preventDefault();
    const patient = familyMembers.find(f => f.id === vitalForm.family_member_id) || familyMembers[0];

    let vitalPayload = {};
    if (vitalForm.type === 'BP') {
      const sys = parseInt(vitalForm.systolic);
      const dia = parseInt(vitalForm.diastolic);
      let status = 'Normal';
      if (sys >= 140 || dia >= 90) status = 'Hypertension Stage 1';
      else if (sys >= 130 || dia >= 85) status = 'Pre-Hypertension';

      vitalPayload = {
        family_member_id: vitalForm.family_member_id,
        patient_name: patient?.name,
        type: 'BP',
        value: `${vitalForm.systolic}/${vitalForm.diastolic}`,
        pulse: vitalForm.pulse,
        status,
        notes: vitalForm.notes
      };
    } else {
      const val = parseInt(vitalForm.sugarValue);
      let status = 'Normal';
      if (vitalForm.sugarType === 'Fasting' && val > 125) status = 'Elevated';
      else if (vitalForm.sugarType === 'Post-Meal (PP)' && val > 140) status = 'Elevated';

      vitalPayload = {
        family_member_id: vitalForm.family_member_id,
        patient_name: patient?.name,
        type: 'Blood Sugar',
        value: `${vitalForm.sugarValue} mg/dL`,
        subType: vitalForm.sugarType,
        status,
        notes: vitalForm.notes
      };
    }

    await api.addVitalLog(vitalPayload);
    setShowVitalModal(false);
    await loadData();
  };

  const shareUrl = `https://apnocare.com/vault/share?token=CARE-SECURE-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 mb-3 border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>Encrypted Family Health Vault • 100% Private</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">Health Vault & Vitals Tracker</h1>
            <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-xl leading-relaxed">
              Consolidated medical history for your parents in Punjab. Access prescriptions, blood reports, interactive blood pressure logs, and share records with treating doctors.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share with Doctor</span>
            </button>
            <button
              onClick={() => setShowVitalModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Log Vitals</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Patient Selector */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'vault' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Medical Vault ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'vitals' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vitals Tracker ({vitals.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'timeline' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Care Timeline ({timeline.length})
          </button>
        </div>

        {/* Filter by Member */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-semibold">Filter Patient:</span>
          <select
            value={selectedMemberFilter}
            onChange={e => setSelectedMemberFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
          >
            <option value="all">All Family Members</option>
            {familyMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── TAB 1: MEDICAL VAULT ── */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map(rec => (
              <div 
                key={rec.id} 
                className="glass-card rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="h-40 relative bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setPreviewRecord(rec)}>
                    <img 
                      src={rec.file_url} 
                      alt={rec.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-[10px] rounded-full shadow-md">
                        {rec.record_type}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{rec.title}</h3>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">For {rec.patient_name}</p>

                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <p className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        <span>{rec.doctor_name}</span>
                      </p>
                      <p className="flex items-center">
                        <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        <span className="truncate">{rec.hospital_name}</span>
                      </p>
                      <p className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        <span>Date: {rec.date}</span>
                      </p>
                    </div>

                    {rec.notes && (
                      <p className="mt-3 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2 italic">
                        "{rec.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setPreviewRecord(rec)}
                    className="w-full py-2 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Document & Notes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: VITALS TRACKER ── */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          {/* Vitals Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Latest Blood Pressure</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2 font-heading">132/84 <span className="text-xs font-normal text-slate-400">mmHg</span></p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                ✓ Normal Range (Jaswant Kaur)
              </span>
            </div>

            <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Fasting Blood Sugar</span>
                <Activity className="w-4 h-4 text-teal-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2 font-heading">114 <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                ✓ Controlled Glycemic (Harbhajan Singh)
              </span>
            </div>

            <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">HbA1c Quarterly</span>
                <TrendingUp className="w-4 h-4 text-violet-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2 font-heading">6.4 <span className="text-xs font-normal text-slate-400">%</span></p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-bold rounded-md border border-violet-200">
                Target Achieved &lt; 7.0%
              </span>
            </div>
          </div>

          {/* Vitals Log Table */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 font-heading">Vitals Measurement History</h3>
              <button
                onClick={() => setShowVitalModal(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                + Log New Reading
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="py-2.5">Date & Time</th>
                    <th className="py-2.5">Patient</th>
                    <th className="py-2.5">Measurement</th>
                    <th className="py-2.5">Value</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Clinical Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vitals.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-500">{v.date}</td>
                      <td className="py-3 font-bold text-slate-900">{v.patient_name}</td>
                      <td className="py-3 font-semibold text-teal-700">{v.type} {v.subType ? `(${v.subType})` : ''}</td>
                      <td className="py-3 font-bold text-slate-900">{v.value} {v.pulse ? `(Pulse: ${v.pulse} bpm)` : ''}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          v.status === 'Normal' || v.status === 'Optimal' || v.status === 'Well-Controlled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 italic max-w-xs truncate">{v.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: TIMELINE ── */}
      {activeTab === 'timeline' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <h3 className="font-bold text-base text-slate-900 font-heading">Family Health Timeline</h3>
          <div className="relative border-l-2 border-teal-200 ml-4 space-y-8 pl-6">
            {timeline.map((t, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-white shadow-xs"></div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.date}</span>
                  <h4 className="font-bold text-sm text-slate-900 mt-0.5">{t.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.description}</p>
                  <p className="text-[11px] text-teal-700 font-medium mt-1">Recorded by: {t.recorded_by}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DOCUMENT LIGHTBOX MODAL ── */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setPreviewRecord(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-teal-700 tracking-wider">
                  {previewRecord.record_type} Document
                </span>
                <h2 className="text-xl font-bold text-slate-900 font-heading">{previewRecord.title}</h2>
                <p className="text-xs text-slate-500">For {previewRecord.patient_name} • Issued on {previewRecord.date}</p>
              </div>
            </div>

            {/* Document Image Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 my-4 max-h-72 bg-slate-50 flex items-center justify-center">
              <img src={previewRecord.file_url} alt={previewRecord.title} className="max-h-72 object-contain" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
              <div>
                <p><strong>Doctor:</strong> {previewRecord.doctor_name}</p>
                <p><strong>Hospital / Lab:</strong> {previewRecord.hospital_name}</p>
              </div>
              <div>
                <p><strong>Diagnosis:</strong> {previewRecord.diagnosis || 'Clinical OPD Evaluation'}</p>
                <p className="text-slate-500 italic mt-1 leading-snug">"{previewRecord.notes}"</p>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewRecord(null)}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOG VITALS MODAL ── */}
      {showVitalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowVitalModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 font-heading">Log Vital Measurement</h2>
            <p className="text-xs text-slate-500 mt-0.5">Record blood pressure or sugar readings for historical tracking.</p>

            <form onSubmit={handleLogVitalSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Family Member:</label>
                <select
                  value={vitalForm.family_member_id}
                  onChange={e => setVitalForm({ ...vitalForm, family_member_id: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {familyMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Vital Measurement Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVitalForm({ ...vitalForm, type: 'BP' })}
                    className={`p-2.5 rounded-xl border font-bold text-center cursor-pointer ${
                      vitalForm.type === 'BP' ? 'border-rose-600 bg-rose-50 text-rose-800' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    Blood Pressure (BP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVitalForm({ ...vitalForm, type: 'Blood Sugar' })}
                    className={`p-2.5 rounded-xl border font-bold text-center cursor-pointer ${
                      vitalForm.type === 'Blood Sugar' ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    Blood Glucose (Sugar)
                  </button>
                </div>
              </div>

              {vitalForm.type === 'BP' ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Systolic</label>
                    <input
                      type="number"
                      value={vitalForm.systolic}
                      onChange={e => setVitalForm({ ...vitalForm, systolic: e.target.value })}
                      placeholder="120"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Diastolic</label>
                    <input
                      type="number"
                      value={vitalForm.diastolic}
                      onChange={e => setVitalForm({ ...vitalForm, diastolic: e.target.value })}
                      placeholder="80"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Pulse (bpm)</label>
                    <input
                      type="number"
                      value={vitalForm.pulse}
                      onChange={e => setVitalForm({ ...vitalForm, pulse: e.target.value })}
                      placeholder="72"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Timing</label>
                    <select
                      value={vitalForm.sugarType}
                      onChange={e => setVitalForm({ ...vitalForm, sugarType: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
                    >
                      <option value="Fasting">Fasting (Before Breakfast)</option>
                      <option value="Post-Meal (PP)">Post-Meal (2 hrs after lunch)</option>
                      <option value="Random">Random Glucose</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Reading (mg/dL)</label>
                    <input
                      type="number"
                      value={vitalForm.sugarValue}
                      onChange={e => setVitalForm({ ...vitalForm, sugarValue: e.target.value })}
                      placeholder="110"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-sm"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Circumstance:</label>
                <input
                  type="text"
                  value={vitalForm.notes}
                  onChange={e => setVitalForm({ ...vitalForm, notes: e.target.value })}
                  placeholder="E.g. After evening walk, morning fasting reading..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowVitalModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Measurement ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── UPLOAD DOCUMENT MODAL ── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 font-heading">Upload Medical Document</h2>
            <p className="text-xs text-slate-500 mt-0.5">Securely store prescriptions, lab reports, or discharge summaries.</p>

            <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient:</label>
                <select
                  value={formData.family_member_id}
                  onChange={e => setFormData({ ...formData, family_member_id: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {familyMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="E.g. Cardiology OPD Slip with Dr. Sharma"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type:</label>
                  <select
                    value={formData.record_type}
                    onChange={e => setFormData({ ...formData, record_type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Prescription">Prescription Slip</option>
                    <option value="Lab Report">Laboratory Report</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="X-Ray / Scan">Radiology Scan</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date:</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Name:</label>
                  <input
                    type="text"
                    value={formData.doctor_name}
                    onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                    placeholder="Dr. Rajiv Sharma"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hospital / Lab:</label>
                  <input
                    type="text"
                    value={formData.hospital_name}
                    onChange={e => setFormData({ ...formData, hospital_name: e.target.value })}
                    placeholder="Tagore Hospital"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">File Upload:</label>
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 hover:border-teal-500 cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto text-teal-600 mb-1" />
                  <p className="font-bold text-slate-700 text-xs">Choose photo or PDF</p>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save to Vault ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SHARE WITH DOCTOR MODAL ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => { setShowShareModal(false); setShareCopied(false); }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <Share2 className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 font-heading">Secure Doctor Sharing Link</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generate a temporary, encrypted link allowing a consulting physician to securely review recent prescriptions, blood pressure history, and lab reports.
            </p>

            <div className="my-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-slate-800">Link Access Settings:</p>
              <p className="text-slate-600">✓ Valid for 48 Hours</p>
              <p className="text-slate-600">✓ View-Only Clinical Summary & Prescriptions</p>
              <p className="text-slate-600">✓ Includes Latest Vitals Logs</p>

              <div className="mt-3 p-2 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-teal-800 break-all select-all">
                {shareUrl}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 3000);
                }}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition flex items-center justify-center space-x-2"
              >
                {shareCopied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Secure Link</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hello Doctor, here is the verified medical history & prescriptions from ApnoCare: ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition flex items-center justify-center space-x-2 text-center"
              >
                <span>Share via WhatsApp to Doctor</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
