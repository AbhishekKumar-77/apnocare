import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Activity, 
  Users, 
  HeartHandshake, 
  ShieldCheck, 
  Calendar, 
  Pill, 
  DollarSign, 
  Check, 
  X, 
  AlertTriangle,
  Clock,
  UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [representatives, setRepresentatives] = useState([]);
  const [careRequests, setCareRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('overview'); // overview, reps, requests

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, repsData, reqsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminReps(),
        api.getAdminCareRequests()
      ]);
      setStats(statsData);
      setRepresentatives(repsData || []);
      setCareRequests(reqsData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRep = async (repId, newStatus) => {
    try {
      await api.verifyRep(repId, newStatus);
      await loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update representative');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full uppercase tracking-wider border border-teal-500/30">
            Platform Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">ApnoCare Admin Console</h1>
          <p className="text-xs text-slate-400 mt-1">
            System overview, care representative background verification, and live request oversight.
          </p>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-white/10 rounded-2xl">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeAdminTab === 'overview' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveAdminTab('reps')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeAdminTab === 'reps' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Representatives ({representatives.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('requests')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeAdminTab === 'requests' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Care Visits ({careRequests.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Overview KPIs */}
      {activeAdminTab === 'overview' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Care Visits', val: stats.active_care_requests, icon: HeartHandshake, color: 'text-teal-600 bg-teal-50' },
              { label: 'Completed Visits', val: stats.completed_care_requests, icon: Check, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Total Family Users', val: stats.total_users || 12, icon: Users, color: 'text-blue-600 bg-blue-50' },
              { label: 'Care Associates', val: stats.total_representatives || 6, icon: UserCheck, color: 'text-purple-600 bg-purple-50' },
              { label: 'Doctor Appointments', val: stats.total_appointments || 24, icon: Calendar, color: 'text-teal-600 bg-teal-50' },
              { label: 'Medicine Orders', val: stats.total_medicine_orders || 18, icon: Pill, color: 'text-amber-600 bg-amber-50' },
              { label: 'Diagnostic Bookings', val: stats.total_diagnostic_bookings || 14, icon: Activity, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Platform Revenue', val: `₹${stats.total_revenue_inr.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
            ].map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 mt-2">{kpi.val}</p>
                </div>
              );
            })}
          </div>

          {/* Verification Alert if Pending */}
          {stats.pending_verifications > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>You have <strong>{stats.pending_verifications} pending Care Representative applications</strong> requiring government ID audit.</span>
              </div>
              <button
                onClick={() => setActiveAdminTab('reps')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
              >
                Review Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Representatives Table */}
      {activeAdminTab === 'reps' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Care Representative Onboarding & Verification</h3>
              <p className="text-xs text-slate-500 mt-0.5">Audit identity details and control service permissions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Representative</th>
                  <th className="py-3 px-4">Service Area & Radius</th>
                  <th className="py-3 px-4">Languages</th>
                  <th className="py-3 px-4">Government ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {representatives.map(rep => {
                  const status = rep.representative_profile?.verification_status || 'pending';
                  return (
                    <tr key={rep.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{rep.name}</div>
                        <div className="text-[11px] text-slate-400">{rep.email} • {rep.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{rep.representative_profile?.service_area || 'Jalandhar'}</div>
                        <div className="text-[11px] text-slate-400">Radius: {rep.representative_profile?.service_radius_km || 15} km</div>
                      </td>
                      <td className="py-3 px-4">
                        {(rep.representative_profile?.languages || ['Punjabi']).join(', ')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                          {rep.representative_profile?.government_id_type}: {rep.representative_profile?.government_id_number}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          status === 'verified' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : status === 'rejected' 
                              ? 'bg-rose-50 text-rose-700' 
                              : 'bg-amber-50 text-amber-700'
                        }`}>
                          {status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {status !== 'verified' && (
                          <button
                            onClick={() => handleVerifyRep(rep.id, 'verified')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        {status !== 'rejected' && (
                          <button
                            onClick={() => handleVerifyRep(rep.id, 'rejected')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Care Requests Oversight */}
      {activeAdminTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">All Care Assistance Requests</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking across remote family sponsors</p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {careRequests.map(req => (
              <div key={req.id} className="p-5 hover:bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{req.patient_name}</span>
                    <span className="text-slate-400">({req.patient_relation})</span>
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md text-[10px] font-bold">
                      {req.request_code}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Sponsor: <strong>{req.user_name}</strong> • Service: <strong>{req.service_type}</strong>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Pickup: {req.pickup_address}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full text-[10px] font-bold uppercase block">
                      {req.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Assigned: {req.representative_name || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
