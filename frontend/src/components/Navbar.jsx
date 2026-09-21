import React, { useState, useRef, useEffect } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  HeartHandshake, 
  Bell, 
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
  ChevronDown,
  Layers
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, demoLogin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const servicesRef = useRef(null);
  const roleMenuRef = useRef(null);
  const notifsRef = useRef(null);

  const role = user?.role || 'family_user';

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setShowServicesMenu(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target)) {
        setShowRoleMenu(false);
      }
      if (notifsRef.current && !notifsRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Family Core navigation
  const familyCoreItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'family', label: 'My Family', icon: Users },
    { id: 'care', label: 'Care Assistance', icon: HeartHandshake, badge: 'Flagship', highlight: true },
  ];

  // Family Medical Services (Grouped in rich dropdown)
  const familyServiceItems = [
    { 
      id: 'doctors', 
      label: 'Find Doctor', 
      desc: 'Accredited specialists & morning/evening OPD slots', 
      icon: Stethoscope,
      color: 'text-teal-600 bg-teal-50' 
    },
    { 
      id: 'hospitals', 
      label: 'Find Hospital', 
      desc: '24/7 Emergency trauma, ambulance & ICU beds', 
      icon: Building2,
      color: 'text-rose-600 bg-rose-50' 
    },
    { 
      id: 'medicines', 
      label: 'Medicines', 
      desc: 'Prescription upload & genuine doorstep pharmacy', 
      icon: Pill,
      color: 'text-amber-600 bg-amber-50' 
    },
    { 
      id: 'diagnostics', 
      label: 'Diagnostics', 
      desc: 'Home sample collection & digital lab reports', 
      icon: Activity,
      color: 'text-cyan-600 bg-cyan-50' 
    },
  ];

  // Family Records & Appointments
  const familyUtilityItems = [
    { id: 'records', label: 'Health Vault', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
  ];

  // Care Representative Navigation
  const repNavItems = [
    { id: 'rep-workspace', label: 'Care Workspace', icon: HeartHandshake },
    { id: 'rep-profile', label: 'My Availability & Area', icon: UserCheck },
  ];

  // Admin Navigation
  const adminNavItems = [
    { id: 'admin-overview', label: 'Admin Dashboard', icon: Activity },
    { id: 'admin-requests', label: 'Care Requests Oversight', icon: HeartHandshake },
    { id: 'admin-reps', label: 'Representative Verification', icon: ShieldCheck },
  ];

  const isServiceActive = familyServiceItems.some(item => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 glass-nav shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab(role === 'care_representative' ? 'rep-workspace' : role === 'admin' ? 'admin-overview' : 'dashboard')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform duration-200">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                  Apno<span className="text-teal-600">Care</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/80 rounded-full">
                  Family Health
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                You may be far away. ApnoCare is there.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            {role === 'family_user' ? (
              <>
                {/* Core Items */}
                {familyCoreItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`relative flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/25'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide rounded-full ${
                          isActive 
                            ? 'bg-amber-400 text-slate-950' 
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Healthcare Services Hub (Rich Dropdown) */}
                <div className="relative" ref={servicesRef}>
                  <button
                    onClick={() => setShowServicesMenu(!showServicesMenu)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isServiceActive
                        ? 'bg-teal-50 text-teal-700 border border-teal-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Layers className={`w-4 h-4 ${isServiceActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>Healthcare Services</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showServicesMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showServicesMenu && (
                    <div className="absolute left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Connected Healthcare Hub
                        </span>
                      </div>
                      <div className="space-y-1">
                        {familyServiceItems.map((svc) => {
                          const Icon = svc.icon;
                          const isCurrent = activeTab === svc.id;
                          return (
                            <button
                              key={svc.id}
                              onClick={() => {
                                setActiveTab(svc.id);
                                setShowServicesMenu(false);
                              }}
                              className={`w-full flex items-start space-x-3 p-2.5 rounded-xl text-left transition-all ${
                                isCurrent 
                                  ? 'bg-teal-50/80 text-teal-900 ring-1 ring-teal-300/50' 
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className={`p-2 rounded-lg shrink-0 ${svc.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-bold text-slate-900">{svc.label}</p>
                                  {isCurrent && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-1">
                                  {svc.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Vault & Appointments */}
                {familyUtilityItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </>
            ) : role === 'care_representative' ? (
              repNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })
            ) : (
              adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3">
            
            {/* Perspective Role Switcher */}
            <div className="relative" ref={roleMenuRef}>
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80 transition-all shadow-xs"
                title="Switch demo perspective"
              >
                <span className="hidden sm:inline text-slate-400 text-[11px] font-medium">Role:</span>
                <span className="font-bold text-slate-900">
                  {role === 'admin' ? 'Admin' : role === 'care_representative' ? 'Care Associate' : 'Family'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch Perspective</p>
                    <p className="text-xs text-slate-500">Test different user perspectives</p>
                  </div>
                  {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
                    <button
                      key={key}
                      onClick={() => {
                        demoLogin(key);
                        setShowRoleMenu(false);
                        setActiveTab(key === 'admin' ? 'admin-overview' : key === 'care_representative' ? 'rep-workspace' : 'dashboard');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex flex-col hover:bg-slate-50 transition-colors ${
                        role === acc.role ? 'bg-teal-50 font-semibold text-teal-900 border border-teal-200/70' : 'text-slate-700'
                      }`}
                    >
                      <span className="font-semibold text-slate-900">{acc.label}</span>
                      <span className="text-[11px] text-slate-400">{acc.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell Dropdown */}
            <div className="relative" ref={notifsRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-teal-600 hover:text-teal-700"
                      >
                        Mark all read
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
                            {!n.read && <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0 mt-1"></span>}
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean Category Grouping) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {role === 'family_user' ? (
            <>
              {/* Primary Core Section */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Core Management
                </p>
                <div className="space-y-1">
                  {familyCoreItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-teal-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-400 text-slate-950 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Healthcare Services */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Connected Healthcare Services
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {familyServiceItems.map((svc) => {
                    const Icon = svc.icon;
                    const isActive = activeTab === svc.id;
                    return (
                      <button
                        key={svc.id}
                        onClick={() => {
                          setActiveTab(svc.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          isActive 
                            ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold' 
                            : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-teal-600 mb-1.5" />
                        <span className="text-xs block font-semibold">{svc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Records & Schedule */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Records & Visits
                </p>
                <div className="space-y-1">
                  {familyUtilityItems.map((item) => {
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
              </div>
            </>
          ) : role === 'care_representative' ? (
            <div className="space-y-1">
              {repNavItems.map((item) => {
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
          ) : (
            <div className="space-y-1">
              {adminNavItems.map((item) => {
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
        </div>
      )}
    </header>
  );
}
