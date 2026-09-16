import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Users, 
  Plus, 
  MapPin, 
  Phone, 
  Heart, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  Building2,
  Calendar,
  HeartHandshake
} from 'lucide-react';

export default function MyFamily({ onSelectPatientForDoctor, onOpenCareWizard }) {
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    relation: 'Mother',
    age: '',
    gender: 'Female',
    phone: '',
    location: '',
    city: 'Jalandhar',
    preferred_language: 'Punjabi',
    blood_group: 'B+',
    chronic_conditions: '',
    allergies: '',
    preferred_hospital: 'Tagore Hospital & Heart Care, Jalandhar',
    notes: ''
  });

  useEffect(() => {
    loadFamily();
  }, []);

  const loadFamily = async () => {
    setLoading(true);
    try {
      const data = await api.getFamily();
      setFamily(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        relation: member.relation || 'Mother',
        age: member.age || '',
        gender: member.gender || 'Female',
        phone: member.phone || '',
        location: member.location || '',
        city: member.city || 'Jalandhar',
        preferred_language: member.preferred_language || 'Punjabi',
        blood_group: member.blood_group || 'B+',
        chronic_conditions: (member.chronic_conditions || []).join(', '),
        allergies: (member.allergies || []).join(', '),
        preferred_hospital: member.preferred_hospital || '',
        notes: member.notes || ''
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        relation: 'Mother',
        age: '',
        gender: 'Female',
        phone: '',
        location: 'Model Town, Jalandhar, Punjab',
        city: 'Jalandhar',
        preferred_language: 'Punjabi',
        blood_group: 'B+',
        chronic_conditions: '',
        allergies: '',
        preferred_hospital: 'Tagore Hospital & Heart Care, Jalandhar',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      chronic_conditions: formData.chronic_conditions ? formData.chronic_conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
      allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : []
    };

    try {
      if (editingMember) {
        await api.updateFamilyMember(editingMember.id, payload);
      } else {
        await api.createFamilyMember(payload);
      }
      setShowModal(false);
      loadFamily();
    } catch (err) {
      alert(err.message || "Failed to save family member");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from family profiles?`)) {
      try {
        await api.deleteFamilyMember(id);
        loadFamily();
      } catch (e) {
        alert(e.message);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Family Profiles</h1>
          <p className="text-xs text-slate-500 mt-1">
            Store loved ones' home locations, chronic conditions, and emergency contacts for seamless bookings from anywhere.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Family Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {family.map((member) => (
          <div 
            key={member.id} 
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-800 font-bold flex items-center justify-center text-lg shadow-inner">
                    {member.name ? member.name[0] : 'F'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{member.name}</h3>
                    <p className="text-xs font-semibold text-teal-700">{member.relation} • {member.age || '—'} yrs</p>
                    <p className="text-[11px] text-slate-400">{member.gender} • Lang: {member.preferred_language}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleOpenModal(member)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                    title="Edit profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details & Location */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
                <div className="flex items-start text-slate-600">
                  <MapPin className="w-4 h-4 text-teal-600 mr-2 shrink-0 mt-0.5" />
                  <span className="leading-tight">{member.location}</span>
                </div>
                
                {member.phone && (
                  <div className="flex items-center text-slate-600">
                    <Phone className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                )}

                {member.preferred_hospital && (
                  <div className="flex items-center text-slate-600">
                    <Building2 className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                    <span className="truncate">{member.preferred_hospital}</span>
                  </div>
                )}

                {member.blood_group && (
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-md">
                      Blood: {member.blood_group}
                    </span>
                  </div>
                )}

                {/* Chronic Conditions */}
                {member.chronic_conditions?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Health Conditions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.chronic_conditions.map((cond, i) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[11px] rounded-md font-medium border border-amber-200/50">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {member.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                    Note: "{member.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectPatientForDoctor ? onSelectPatientForDoctor(member) : null}
                className="py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-bold text-center transition"
              >
                Book Doctor
              </button>
              <button
                onClick={() => onOpenCareWizard ? onOpenCareWizard(member) : null}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold text-center transition shadow-xs"
              >
                Request Care
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingMember ? 'Edit Family Profile' : 'Add Family Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jaswant Kaur"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Relation *</label>
                  <select
                    value={formData.relation}
                    onChange={e => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other Family</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    placeholder="64"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.blood_group}
                    onChange={e => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Home Address / Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="House No, Sector/Street, Model Town, Jalandhar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98140 12345"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Language</label>
                  <select
                    value={formData.preferred_language}
                    onChange={e => setFormData({ ...formData, preferred_language: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Punjabi">Punjabi</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Kannada">Kannada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chronic Conditions (comma separated)</label>
                <input
                  type="text"
                  value={formData.chronic_conditions}
                  onChange={e => setFormData({ ...formData, chronic_conditions: e.target.value })}
                  placeholder="Hypertension, Diabetes Type 2, Knee Osteoarthritis"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Hospital / Clinic</label>
                <input
                  type="text"
                  value={formData.preferred_hospital}
                  onChange={e => setFormData({ ...formData, preferred_hospital: e.target.value })}
                  placeholder="Tagore Hospital & Heart Care, Jalandhar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Special Healthcare Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Takes BP medication morning; needs assistance while walking steps."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
