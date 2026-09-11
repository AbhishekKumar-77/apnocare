import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, User, Phone, Mail, MapPin, Calendar, Heart, Loader2 } from 'lucide-react';
import { submitInquiry } from '../services/api';

export default function InquiryForm({ selectedService, onSubmitted }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    careType: 'Elderly Care',
    patientAge: '',
    city: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedService?.category) {
      setFormData((prev) => ({ ...prev, careType: selectedService.category }));
    }
  }, [selectedService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessResponse(null);

    try {
      const res = await submitInquiry(formData);
      setSuccessResponse(res);
      if (onSubmitted) onSubmitted(res.data);
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        careType: 'Elderly Care',
        patientAge: '',
        city: '',
        notes: '',
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit care inquiry. Please verify server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" className="relative py-16 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold tracking-wide uppercase">
              <Heart className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
              Compassionate Home Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Request a Certified Caregiver
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Fill out this quick requirement form. Our care coordinator will contact you within 30 minutes to match an experienced nurse or attendant.
            </p>
          </div>

          {successResponse && (
            <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-base">Care Request Received!</p>
                <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                  {successResponse.message}
                </p>
                <p className="text-xs text-emerald-600 mt-2 font-mono">
                  Stored via: {successResponse.source}
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Abhishek Sharma"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. care@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* City / Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  City / Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Care Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Required Service
                </label>
                <select
                  name="careType"
                  value={formData.careType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                >
                  <option value="Elderly Care">Elderly Companion & Daily Care</option>
                  <option value="Nursing Support">24/7 Clinical Home Nursing</option>
                  <option value="Physiotherapy">In-Home Physiotherapy</option>
                  <option value="Post-Op Recovery">Post-Operative Recovery</option>
                  <option value="Diagnostic Assistance">Home Sample Collection & Diagnostics</option>
                </select>
              </div>

              {/* Patient Age */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Patient Age (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleChange}
                    placeholder="e.g. 72"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Health condition / Notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Special Care Requirements / Medical Notes
              </label>
              <textarea
                rows="3"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Mention any specific condition (e.g., bedridden, dementia, post-cardiac surgery, diabetes monitoring)..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-700 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-semibold text-base shadow-lg shadow-sky-600/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Care Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Care Request & Get Matched</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
