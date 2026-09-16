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
  X
} from 'lucide-react';

export default function HealthRecords() {
  const [activeTab, setActiveTab] = useState('vault'); // 'vault' or 'timeline'
  const [records, setRecords] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMemberFilter, setSelectedMemberFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    family_member_id: '',
    title: '',
    record_type: 'Prescription',
    doctor_name: '',
    hospital_name: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);

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

      const [recData, tlData] = await Promise.all([
        api.getHealthRecords(params.toString()),
        api.getHealthTimeline(selectedMemberFilter !== 'all' ? `family_member_id=${selectedMemberFilter}` : '')
      ]);

      setRecords(recData || []);
      setTimeline(tlData || []);

      if (fam && fam.length > 0 && !formData.family_member_id) {
        setFormData(prev => ({ ...prev, family_member_id: fam[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Please select a document file to upload");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('family_member_id', formData.family_member_id);
      form.append('title', formData.title || 'Medical Record');
      form.append('record_type', formData.record_type);
      form.append('doctor_name', formData.doctor_name);
      form.append('hospital_name', formData.hospital_name);
      form.append('date', formData.date);
      form.append('notes', formData.notes);
      form.append('file', formData.file);

      await api.uploadHealthRecord(form);
      setShowUploadModal(false);
      setFormData({
        family_member_id: familyMembers[0]?.id || '',
        title: '',
        record_type: 'Prescription',
        doctor_name: '',
        hospital_name: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        file: null
      });
      await loadData();
    } catch (err) {
      alert(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Secure Cloud Vault
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Family Health Vault & Timeline</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Store and access prescriptions, diagnostic test slips, radiology reports, and medical history organized chronologically for every family member.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition self-start sm:self-auto shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* View Switcher & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Toggle Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-200/60 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'vault' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Health Vault ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'timeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chronological Timeline ({timeline.length})
          </button>
        </div>

        {/* Member filter */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-semibold">Member:</span>
            <select
              value={selectedMemberFilter}
              onChange={e => setSelectedMemberFilter(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            >
              <option value="all">All Family Members</option>
              {familyMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
              ))}
            </select>
          </div>

          {activeTab === 'vault' && (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-semibold">Type:</span>
              <select
                value={selectedTypeFilter}
                onChange={e => setSelectedTypeFilter(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
              >
                <option value="all">All Types</option>
                <option value="Prescription">Prescriptions</option>
                <option value="Lab Report">Lab Reports</option>
                <option value="X-Ray">X-Ray / Imaging</option>
                <option value="Bill">Medical Bills</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: Vault Documents Grid */}
      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.length === 0 ? (
            <div className="col-span-3 bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600 text-sm">No health documents in vault</p>
              <p className="text-xs mt-1">Upload a prescription or lab report to safely preserve it.</p>
            </div>
          ) : (
            records.map(rec => (
              <div 
                key={rec.id} 
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md text-[10px] font-bold uppercase">
                      {rec.record_type}
                    </span>
                    <span className="text-[11px] text-slate-400">{rec.date}</span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 mt-2">{rec.title}</h4>
                  <p className="text-xs text-teal-700 font-medium">Patient: {rec.patient_name}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                    {rec.doctor_name && <p>Doctor: <strong>{rec.doctor_name}</strong></p>}
                    {rec.hospital_name && <p>Facility: <strong>{rec.hospital_name}</strong></p>}
                    {rec.notes && <p className="italic text-slate-600 mt-1">"{rec.notes}"</p>}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {rec.file_url ? (
                    <a
                      href={rec.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Document</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs">Record Only</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Chronological Timeline Feed */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:top-2 before:bottom-2 before:left-2 sm:before:left-3 before:w-0.5 before:bg-slate-200">
            {timeline.map((event, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      {event.event_type} • For {event.patient_name}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center mt-0.5 sm:mt-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {event.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{event.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Upload to Health Vault</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Family Member *</label>
                <select
                  value={formData.family_member_id}
                  onChange={e => setFormData({ ...formData, family_member_id: e.target.value })}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {familyMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Cardiology BP Review, Annual Blood Panel"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Document Type *</label>
                  <select
                    value={formData.record_type}
                    onChange={e => setFormData({ ...formData, record_type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="X-Ray">X-Ray / Scan</option>
                    <option value="Bill">Medical Invoice / Bill</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor (optional)</label>
                  <input
                    type="text"
                    value={formData.doctor_name}
                    onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                    placeholder="e.g. Dr. Rajiv Sharma"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hospital / Lab</label>
                  <input
                    type="text"
                    value={formData.hospital_name}
                    onChange={e => setFormData({ ...formData, hospital_name: e.target.value })}
                    placeholder="e.g. Tagore Hospital"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attach File (PDF or Photo) *</label>
                <input
                  type="file"
                  required
                  accept="image/*,.pdf"
                  onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor's Advice or Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Continue BP medication daily; low sodium diet."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {uploading ? 'Uploading...' : 'Save to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
