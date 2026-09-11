import React, { useState } from 'react';
import { X, Heart, User, MapPin, Phone, ShieldCheck, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import { createPatient } from '../services/api';

export default function OnboardingModal({ isOpen, onClose, onPatientAdded }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    relationship: 'Mother',
    name: '',
    age: '',
    gender: 'Female',
    phone: '',
    address: '',
    city: 'Jalandhar',
    state: 'Punjab',
    pincode: '',
    bloodGroup: 'B+',
    mobility: 'Independent',
    primaryDoctor: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    existingConditions: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : 65,
        currentMedications: formData.existingConditions
          ? [{ name: formData.existingConditions, frequency: 'Daily', purpose: 'Prescribed' }]
          : [],
      };
      const res = await createPatient(payload);
      onPatientAdded(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save family member profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-sky-600 tracking-wider">
              <span>Step {step} of 3</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {step === 1 && 'Who are you caring for?'}
              {step === 2 && 'Parent Details in India'}
              {step === 3 && 'Medical & Emergency Contacts'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full my-4 overflow-hidden">
          <div
            className="bg-sky-600 h-1.5 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Relationship */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-600">
              Select the family member you want to add to your ApnoCare remote dashboard:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Mother', 'Father', 'Grandmother', 'Grandfather', 'Spouse', 'Other Family'].map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, relationship: rel }))}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    formData.relationship === rel
                      ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 mx-auto mb-2 ${formData.relationship === rel ? 'text-sky-600 fill-sky-600' : 'text-slate-400'}`} />
                  <span className="text-sm">{rel}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-md shadow-sky-600/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details & Address */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jaswinder Kaur"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Age & Gender
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="68"
                    className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Parent's Phone Number in India *
              </label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Home Address in India
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House No, Street, Landmark"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Jalandhar">Jalandhar</option>
                  <option value="Ludhiana">Ludhiana</option>
                  <option value="Amritsar">Amritsar</option>
                  <option value="Chandigarh">Chandigarh / Mohali</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!formData.name || !formData.phone) {
                    setError('Please enter name and phone number.');
                    return;
                  }
                  setError('');
                  setStep(3);
                }}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-md shadow-sky-600/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Medical context & Emergency */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Known Medical Conditions / Daily Medications
              </label>
              <textarea
                rows={2}
                name="existingConditions"
                value={formData.existingConditions}
                onChange={handleChange}
                placeholder="e.g. Hypertension, Type 2 Diabetes, Knee Osteoarthritis..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Mobility Level
                </label>
                <select
                  name="mobility"
                  value={formData.mobility}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Independent">Independent</option>
                  <option value="Uses Walking Cane">Uses Walking Cane</option>
                  <option value="Wheelchair Assistance">Wheelchair Assistance</option>
                  <option value="Bedridden">Bedridden</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Primary Family Doctor
                </label>
                <input
                  type="text"
                  name="primaryDoctor"
                  value={formData.primaryDoctor}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Harvinder Singh"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Local Emergency Contact in India
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Contact Name / Neighbor"
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-md shadow-sky-600/25 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Finish & Add to Dashboard</span>
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
