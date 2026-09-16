import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Login({ onSwitchToRegister, onSuccess }) {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleKey) => {
    setLoading(true);
    try {
      await demoLogin(roleKey);
      if (onSuccess) onSuccess();
    } catch (e) {
      setError('Failed to login as demo user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Brand header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-600/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-3">Welcome to ApnoCare</h2>
          <p className="text-xs text-slate-500 mt-1">
            "You may be far away. ApnoCare is there."
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Quick Demo Test Buttons */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            One-Click Instant Demo Access:
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('family_user')}
              className="w-full py-2 px-3 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 rounded-xl text-xs font-semibold flex items-center justify-between transition"
            >
              <span>Family User (Remote in Toronto)</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('care_representative')}
              className="w-full py-2 px-3 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 rounded-xl text-xs font-semibold flex items-center justify-between transition"
            >
              <span>Care Associate (Rajesh - Jalandhar)</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="w-full py-2 px-3 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 rounded-xl text-xs font-semibold flex items-center justify-between transition"
            >
              <span>Platform Ops Admin</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. abhishek@apnocare.com"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <button
            onClick={onSwitchToRegister}
            className="font-bold text-teal-700 hover:underline"
          >
            Create an Account
          </button>
        </div>

      </div>
    </div>
  );
}
