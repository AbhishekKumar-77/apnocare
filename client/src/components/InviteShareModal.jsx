import React, { useState } from 'react';
import { X, Share2, Mail, User, ShieldCheck, Check, Loader2 } from 'lucide-react';
import { inviteFamilyShare } from '../services/api';

export default function InviteShareModal({ isOpen, onClose, patients, onShareInvited }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?._id || 'pat_1');
  const [invitedEmail, setInvitedEmail] = useState('');
  const [invitedName, setInvitedName] = useState('');
  const [permission, setPermission] = useState('FULL_ACCESS');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await inviteFamilyShare({
        patientId: selectedPatientId,
        invitedEmail,
        invitedName,
        permission,
      });
      if (onShareInvited) onShareInvited(res.data);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setInvitedEmail('');
        setInvitedName('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Invite Family Member</h3>
            <p className="text-xs text-slate-500">Share parent health monitoring with siblings</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Invitation Dispatched!</h4>
            <p className="text-xs text-slate-500">Access permission link sent to {invitedEmail}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Family Member Name & Relation
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Simran Mehta (Sister in Vancouver)"
                value={invitedName}
                onChange={(e) => setInvitedName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="simran@example.com"
                value={invitedEmail}
                onChange={(e) => setInvitedEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Select Family Member to Share
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.relationship})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Permission Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPermission('FULL_ACCESS')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    permission === 'FULL_ACCESS'
                      ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">Full Access</div>
                  <div className="text-[10px] text-slate-500">Can request & manage</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPermission('VIEW_ONLY')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    permission === 'VIEW_ONLY'
                      ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">View Only</div>
                  <div className="text-[10px] text-slate-500">Can view updates/reports</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Secure Invite</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
