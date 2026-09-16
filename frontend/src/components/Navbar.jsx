import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  HeartHandshake, 
  Bell, 
  User, 
  LogOut, 
  ShieldCheck, 
  Users, 
  Stethoscope, 
  Building2, 
  Pill, 
  FileText, 
  Calendar, 
  UserCheck, 
  Activity,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, demoLogin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = user?.role || 'family_user';

  const familyNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'family', label: 'My Family', icon: Users },
    { id: 'care', label: 'Care Assistance', icon: HeartHandshake, badge: 'Flagship' },
    { id: 'doctors', label: 'Find Doctor', icon: Stethoscope },
    { id: 'hospitals', label: 'Find Hospital', icon: Building2 },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'records', label: 'Health Vault', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
  ];

  const repNavItems = [
    { id: 'rep-workspace', label: 'Care Workspace', icon: HeartHandshake },
    { id: 'rep-profile', label: 'My Availability & Area', icon: UserCheck },
  ];

  const adminNavItems = [
    { id: 'admin-overview', label: 'Admin Dashboard', icon: Activity },
    { id: 'admin-requests', label: 'Care Requests Oversight', icon: HeartHandshake },
    { id: 'admin-reps', label: 'Representative Verification', icon: ShieldCheck },
  ];

  const navItems = role === 'admin' 
    ? adminNavItems 
    : role === 'care_representative' 
      ? repNavItems 
      : familyNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(role === 'care_representative' ? 'rep-workspace' : role === 'admin' ? 'admin-overview' : 'dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">ApnoCare</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/60 rounded-full">
                  Family Health
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">You may be far away. ApnoCare is there.</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-teal-600 text-[9px] font-bold text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2.5">
            
            {/* Interactive Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition"
                title="Switch demo perspective"
              >
                <span className="hidden sm:inline text-slate-400 text-[11px]">Role:</span>
                <span className="font-semibold text-slate-900">
                  {role === 'admin' ? 'Admin' : role === 'care_representative' ? 'Care Associate' : 'Family Member'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch Perspective</p>
                    <p className="text-xs text-slate-500">Test different user experiences</p>
                  </div>
                  {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
                    <button
                      key={key}
                      onClick={() => {
                        demoLogin(key);
                        setShowRoleMenu(false);
                        setActiveTab(key === 'admin' ? 'admin-overview' : key === 'care_representative' ? 'rep-workspace' : 'dashboard');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 ${
                        role === acc.role ? 'bg-teal-50/70 font-semibold text-teal-900' : 'text-slate-700'
                      }`}
                    >
                      <span className="font-medium text-slate-900">{acc.label}</span>
                      <span className="text-[11px] text-slate-400">{acc.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-teal-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-teal-600 hover:text-teal-700"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markAsRead(n.id)}
                          className={`p-3.5 text-xs transition cursor-pointer hover:bg-slate-50 ${
                            n.read ? 'opacity-70' : 'bg-teal-50/40'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-slate-900 text-xs">{n.title}</h4>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-teal-600"></span>}
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Logout */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-teal-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
