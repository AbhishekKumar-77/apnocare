import React from 'react';
import { Database, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

export default function StatusBanner({ health, onRefresh, loading }) {
  const isConnected = health?.database?.isConnected;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div
        className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
          isConnected
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base">
                  {isConnected ? 'MongoDB Atlas Cluster Active' : 'MongoDB Atlas Configuration Guide'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                    isConnected ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {isConnected ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {isConnected ? 'Connected' : 'Action Needed'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {isConnected
                  ? `Connected to database "${health?.database?.name}" on host: ${health?.database?.host}. Mongoose models and queries are operating normally.`
                  : 'To link your live MongoDB Atlas database, update your connection string in server/.env and make sure Network Access allows your current IP.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Check Status</span>
            </button>
            <a
              href="https://cloud.mongodb.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-colors"
            >
              <span>Atlas Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
