import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, ShieldCheck } from 'lucide-react';

export default function Register({ onSwitchToLogin, onSuccess }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'family_user', // or 'care_representative'
    service_area: 'Jalandhar',
    languages: 'Punjabi, Hindi, English'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...formData,
        languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean)
      };
      await register(payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-600/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-3">Join ApnoCare</h2>
          <p className="text-xs text-slate-500 mt-1">
            Care for your loved ones from anywhere in the world
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'family_user' })}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              formData.role === 'family_user' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Family / Sponsor
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'care_representative' })}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
              formData.role === 'care_representative' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Care Associate (Apply)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Abhishek Sharma"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
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
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {formData.role === 'family_user' ? 'Current Residence Location' : 'Base City / Service Location'}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder={formData.role === 'family_user' ? 'Toronto, Canada (Family in Jalandhar)' : 'Model Town, Jalandhar'}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {formData.role === 'care_representative' && (
            <div className="p-3 bg-teal-50 rounded-xl space-y-2 text-[11px] text-teal-900 border border-teal-200">
              <span className="font-bold block">Representative Verification Notice:</span>
              <p>Government ID (Aadhaar / Voter ID) audit and orientation review is completed by Operations Admin before activation.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition"
          >
            {loading ? 'Creating account...' : formData.role === 'care_representative' ? 'Submit Application' : 'Create Account'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-bold text-teal-700 hover:underline"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
}
