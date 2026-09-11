import React from 'react';
import { X, Bell, CheckCircle2, Clock, ShieldAlert, Check } from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead } from '../services/api';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onNotificationRead,
}) {
  if (!isOpen) return null;

  const handleMarkOne = async (id) => {
    try {
      await markNotificationRead(id);
      onNotificationRead();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      onNotificationRead();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">Live family care alerts & milestones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              You're all caught up. No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleMarkOne(n._id)}
                className={`p-4 rounded-2xl border text-xs transition-colors cursor-pointer ${
                  n.read
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-sky-50/70 border-sky-200 text-sky-950 font-medium'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-900">{n.title}</span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0 mt-1"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <button
              onClick={handleMarkAll}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
