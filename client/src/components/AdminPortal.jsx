import React, { useState } from 'react';
import {
  Users,
  Heart,
  Activity,
  ShieldCheck,
  Building2,
  MapPin,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  BadgeAlert,
} from 'lucide-react';
import { assignRepresentative, verifyRepresentative } from '../services/api';

export default function AdminPortal({
  requests,
  representatives,
  patients,
  partners,
  serviceAreas,
  waitlist,
  auditLogs,
  onRequestAssigned,
  onRepVerified,
}) {
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'requests' | 'reps' | 'partners' | 'service-areas' | 'audit'
  const [selectedRepId, setSelectedRepId] = useState('');
  const [targetRequestId, setTargetRequestId] = useState(null);

  const totalRevenue = requests.reduce((sum, r) => sum + (r.estimatedPriceINR || 0), 0) + 4999;
  const activeRequests = requests.filter((r) => !['COMPLETED', 'CANCELLED'].includes(r.status));
  const emergencyRequests = requests.filter((r) => r.priority === 'EMERGENCY' || r.status === 'EMERGENCY');

  const handleAssign = async (requestId) => {
    if (!selectedRepId) return;
    try {
      const res = await assignRepresentative(requestId, selectedRepId);
      if (onRequestAssigned) onRequestAssigned(res.data);
      setTargetRequestId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyRep = async (repId, newStatus) => {
    try {
      const res = await verifyRepresentative(repId, {
        verificationStatus: newStatus,
        policeVerificationStatus: newStatus === 'VERIFIED' ? 'PASSED' : 'PENDING',
      });
      if (onRepVerified) onRepVerified(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Operations Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-semibold mb-2 border border-sky-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HQ Operations Control Center • India Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">ApnoCare Platform Admin</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Care coordination monitoring, representative dispatching, partner oversight & security audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Dispatch Engines Online</span>
          </span>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Active Requests</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{activeRequests.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">In dispatch or transit</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Verified Reps</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {representatives.filter((r) => r.verificationStatus === 'VERIFIED').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Available across 6 cities</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Revenue (INR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Services + Subscriptions</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Emergency Triggers</span>
            <BadgeAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">{emergencyRequests.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">High priority escalations</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-sm font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Dispatch' },
          { id: 'reps', label: `Care Representatives (${representatives.length})` },
          { id: 'partners', label: `Partner Network (${partners.length})` },
          { id: 'service-areas', label: `Coverage & Waitlist (${waitlist.length})` },
          { id: 'audit', label: `Audit Trail (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            className={`pb-3 px-3 cursor-pointer whitespace-nowrap transition-colors relative ${
              adminTab === tab.id
                ? 'text-sky-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {adminTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & REQUEST DISPATCHER */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Live Service Request Queue</h3>
            <span className="text-xs text-slate-500">Showing all customer requests</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4">Request ID</th>
                    <th className="py-3.5 px-4">Service Type</th>
                    <th className="py-3.5 px-4">Patient & City</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Assigned Rep</th>
                    <th className="py-3.5 px-4">Fee</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #{r._id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {r.serviceType}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{r.patientName}</div>
                        <div className="text-slate-400">{r.city}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.priority === 'EMERGENCY'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-sky-100 text-sky-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {r.representativeName || 'Unassigned'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ₹{r.estimatedPriceINR}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setTargetRequestId(r._id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 hover:text-sky-700 text-slate-700 font-semibold text-[11px] cursor-pointer"
                        >
                          Reassign Rep
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reassign Modal */}
          {targetRequestId && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Assign Care Representative
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Select a verified field representative for Request #{targetRequestId}
                </p>

                <select
                  value={selectedRepId}
                  onChange={(e) => setSelectedRepId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-4 focus:outline-none"
                >
                  <option value="">-- Choose Representative --</option>
                  {representatives.map((rep) => (
                    <option key={rep._id} value={rep._id}>
                      {rep.name} ({rep.city}) - Status: {rep.verificationStatus}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setTargetRequestId(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAssign(targetRequestId)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REPRESENTATIVES VERIFICATION */}
      {adminTab === 'reps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Care Representative Management</h3>
            <span className="text-xs text-slate-500">ID Verification & Background Checks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {representatives.map((rep) => (
              <div
                key={rep._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                      rep.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rep.verificationStatus}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">{rep.badgeId}</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900">{rep.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    City: <strong>{rep.city}</strong> • Phone: {rep.phone}
                  </p>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Police Verification:</span>
                      <span className="font-bold text-emerald-700">{rep.policeVerificationStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training Status:</span>
                      <span className="font-bold">{rep.trainingCompleted ? 'Completed ✓' : 'In Progress'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Assists:</span>
                      <span className="font-bold">{rep.totalAssists} ({rep.rating}⭐)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2">
                  {rep.verificationStatus === 'VERIFIED' ? (
                    <button
                      onClick={() => handleVerifyRep(rep._id, 'SUSPENDED')}
                      className="w-full py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Suspend Access
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyRep(rep._id, 'VERIFIED')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Approve & Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PARTNER NETWORK */}
      {adminTab === 'partners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Partner Healthcare Network</h3>
              <p className="text-xs text-slate-500">Verified hospitals, clinics, diagnostic centers, and pharmacies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800">
                    {p.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">Verified Partner ✓</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {p.address}, {p.city} • Phone: {p.phone}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.services?.map((svc, i) => (
                    <span key={i} className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SERVICE AREAS & WAITLIST */}
      {adminTab === 'service-areas' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Serviceable Indian Cities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {serviceAreas?.map((sa, idx) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200">
                  <div className="font-bold text-sm text-slate-900">{sa.city}</div>
                  <div className="text-xs text-slate-500">{sa.state}</div>
                  <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
                    {sa.activeReps} Active Reps • {sa.totalRequests}+ Completed
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Expansion Waitlist Requests</h3>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email & Phone</th>
                    <th className="py-3 px-4">Requested City</th>
                    <th className="py-3 px-4">Service Needed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {waitlist.map((w) => (
                    <tr key={w._id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{w.name}</td>
                      <td className="py-3 px-4">{w.email} ({w.phone})</td>
                      <td className="py-3 px-4 font-semibold text-sky-700">{w.patientCity}, {w.state}</td>
                      <td className="py-3 px-4">{w.neededService}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {adminTab === 'audit' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Security & Operational Audit Trail</h3>
          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div
                key={log._id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded mr-2">
                    {log.action}
                  </span>
                  <span className="font-bold text-slate-800">{log.actorName}</span>
                  <span className="text-slate-500"> → {log.target} ({log.details})</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
