import React from 'react';
import { X, Database, Clock, User, Phone, MapPin, Tag } from 'lucide-react';

export default function InquiryModal({ isOpen, onClose, inquiries, loading, onRefresh }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Submitted Care Inquiries</h3>
              <p className="text-xs text-slate-500">Live records from Node.js & MongoDB Atlas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading latest records...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 text-sm font-medium">No inquiries submitted yet.</p>
              <p className="text-slate-400 text-xs mt-1">Submit the care request form on the homepage to see records appear here.</p>
            </div>
          ) : (
            inquiries.map((inquiry, idx) => (
              <div
                key={inquiry._id || idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-sky-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-600" />
                    <span className="font-semibold text-sm text-slate-900">{inquiry.fullName}</span>
                    {inquiry.patientAge && (
                      <span className="text-xs text-slate-500">({inquiry.patientAge} yrs)</span>
                    )}
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-sky-100 text-sky-800">
                    {inquiry.careType}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{inquiry.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{inquiry.city}</span>
                  </div>
                </div>

                {inquiry.notes && (
                  <p className="mt-2.5 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                    "{inquiry.notes}"
                  </p>
                )}

                <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">ID: {inquiry._id}</span>
                  <span>{new Date(inquiry.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl flex justify-between items-center">
          <button
            onClick={onRefresh}
            className="text-xs text-sky-600 hover:text-sky-700 font-medium cursor-pointer"
          >
            Refresh records
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
