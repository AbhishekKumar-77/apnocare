import React, { useState, useEffect } from 'react';
import TopDemoBar from './components/TopDemoBar';
import Navbar from './components/Navbar';
import PublicHome from './components/PublicHome';
import CustomerDashboard from './components/CustomerDashboard';
import PatientPortal from './components/PatientPortal';
import RepresentativePortal from './components/RepresentativePortal';
import AdminPortal from './components/AdminPortal';
import SOSModal from './components/SOSModal';
import AuthModal from './components/AuthModal';
import OnboardingModal from './components/OnboardingModal';
import RequestAssistanceModal from './components/RequestAssistanceModal';
import InviteShareModal from './components/InviteShareModal';
import NotificationDrawer from './components/NotificationDrawer';
import Footer from './components/Footer';

import {
  getDemoPersonas,
  getCurrentUser,
  getPatients,
  getServiceRequests,
  getHealthRecords,
  getFamilyShares,
  getNotifications,
  getAdminRepresentatives,
  getAdminPartners,
  getServiceAreas,
  getAdminAuditLogs,
} from './services/api';

export default function App() {
  // Authentication & Persona state
  const [currentUser, setCurrentUser] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [currency, setCurrency] = useState('CAD'); // Default for Arjun in Canada
  const [currentView, setCurrentView] = useState('dashboard'); // 'public' | 'dashboard'

  // Application Data Stores
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [familyShares, setFamilyShares] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [partners, setPartners] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isInviteShareOpen, setIsInviteShareOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  // Initialize and load core data
  const loadInitialData = async () => {
    try {
      const demoRes = await getDemoPersonas();
      if (demoRes?.personas) {
        setPersonas(demoRes.personas);
        // If not logged in, default to Arjun Mehta (Customer)
        const arjun = demoRes.personas.find((p) => p.role === 'CUSTOMER') || demoRes.personas[0];
        localStorage.setItem('apnocare_token', arjun.token);
        localStorage.setItem('apnocare_demo_user_id', arjun._id);
        setCurrentUser(arjun);
      }
      refreshAllData();
    } catch (err) {
      console.error('Error loading initial personas:', err);
    }
  };

  const refreshAllData = async () => {
    try {
      const [patRes, reqRes, recRes, shareRes, notifRes, repRes, partRes, saRes, auditRes] = await Promise.allSettled([
        getPatients(),
        getServiceRequests(),
        getHealthRecords(),
        getFamilyShares(),
        getNotifications(),
        getAdminRepresentatives(),
        getAdminPartners(),
        getServiceAreas(),
        getAdminAuditLogs(),
      ]);

      if (patRes.status === 'fulfilled') setPatients(patRes.value?.data || []);
      if (reqRes.status === 'fulfilled') setRequests(reqRes.value?.data || []);
      if (recRes.status === 'fulfilled') setHealthRecords(recRes.value?.data || []);
      if (shareRes.status === 'fulfilled') setFamilyShares(shareRes.value?.data || []);
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value?.data || []);
      if (repRes.status === 'fulfilled') setRepresentatives(repRes.value?.data || []);
      if (partRes.status === 'fulfilled') setPartners(partRes.value?.data || []);
      if (saRes.status === 'fulfilled') {
        setServiceAreas(saRes.value?.serviceAreas || []);
        setWaitlist(saRes.value?.waitlist || []);
      }
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value?.data || []);
    } catch (err) {
      console.error('Error refreshing platform data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSwitchPersona = (persona) => {
    localStorage.setItem('apnocare_token', persona.token);
    localStorage.setItem('apnocare_demo_user_id', persona._id);
    setCurrentUser(persona);
    setCurrentView('dashboard');
    refreshAllData();
  };

  const handleLogout = () => {
    localStorage.removeItem('apnocare_token');
    localStorage.removeItem('apnocare_demo_user_id');
    setCurrentUser(null);
    setCurrentView('public');
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* 1. Persistent Top Demo & Persona Bar */}
      <TopDemoBar
        currentUser={currentUser}
        personas={personas}
        onSwitchPersona={handleSwitchPersona}
        onTriggerSOS={() => setIsSOSOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
        unreadCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotifsOpen(true)}
      />

      {/* 2. Global Navigation */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        unreadCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotifsOpen(true)}
        onOpenSOS={() => setIsSOSOpen(true)}
      />

      {/* 3. Main View Router */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* PUBLIC VIEW */}
        {currentView === 'public' && (
          <PublicHome
            onGetStarted={() => {
              if (currentUser) {
                setCurrentView('dashboard');
              } else {
                setIsAuthOpen(true);
              }
            }}
            onOpenSOS={() => setIsSOSOpen(true)}
            currency={currency}
          />
        )}

        {/* ROLE 1: CUSTOMER DASHBOARD (Son/Daughter living away) */}
        {currentView === 'dashboard' && currentUser?.role === 'CUSTOMER' && (
          <CustomerDashboard
            currentUser={currentUser}
            patients={patients}
            requests={requests}
            healthRecords={healthRecords}
            familyShares={familyShares}
            currency={currency}
            onOpenNewRequest={() => setIsRequestModalOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenInviteShare={() => setIsInviteShareOpen(true)}
          />
        )}

        {/* ROLE 2: PATIENT PORTAL (Elderly Parent in India) */}
        {currentView === 'dashboard' && currentUser?.role === 'PATIENT' && (
          <PatientPortal
            currentUser={currentUser}
            patients={patients}
            requests={requests}
            onTriggerSOS={() => setIsSOSOpen(true)}
            onRequestCreated={(newReq) => {
              setRequests((prev) => [newReq, ...prev]);
            }}
          />
        )}

        {/* ROLE 3: REPRESENTATIVE DASHBOARD (Local Field Rep) */}
        {currentView === 'dashboard' && currentUser?.role === 'REPRESENTATIVE' && (
          <RepresentativePortal
            currentUser={currentUser}
            tasks={requests}
            onTaskUpdated={(updatedReq) => {
              setRequests((prev) =>
                prev.map((r) => (r._id === updatedReq._id ? updatedReq : r))
              );
              refreshAllData();
            }}
          />
        )}

        {/* ROLE 4: ADMIN CONSOLE (HQ Operations) */}
        {currentView === 'dashboard' && currentUser?.role === 'ADMIN' && (
          <AdminPortal
            requests={requests}
            representatives={representatives}
            patients={patients}
            partners={partners}
            serviceAreas={serviceAreas}
            waitlist={waitlist}
            auditLogs={auditLogs}
            onRequestAssigned={(updatedReq) => {
              setRequests((prev) =>
                prev.map((r) => (r._id === updatedReq._id ? updatedReq : r))
              );
            }}
            onRepVerified={(updatedRep) => {
              setRepresentatives((prev) =>
                prev.map((rep) => (rep._id === updatedRep._id ? updatedRep : rep))
              );
            }}
          />
        )}
      </main>

      {/* 4. MODALS & DRAWERS */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        patients={patients}
        onEmergencyCreated={(newEmergency) => {
          setRequests((prev) => [newEmergency, ...prev]);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        personas={personas}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('dashboard');
          refreshAllData();
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onPatientAdded={(newPatient) => {
          setPatients((prev) => [newPatient, ...prev]);
        }}
      />

      <RequestAssistanceModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        patients={patients}
        currency={currency}
        onRequestCreated={(newReq) => {
          setRequests((prev) => [newReq, ...prev]);
        }}
      />

      <InviteShareModal
        isOpen={isInviteShareOpen}
        onClose={() => setIsInviteShareOpen(false)}
        patients={patients}
        onShareInvited={(newShare) => {
          setFamilyShares((prev) => [newShare, ...prev]);
        }}
      />

      <NotificationDrawer
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
        notifications={notifications}
        onNotificationRead={refreshAllData}
      />

      {/* 5. Global Footer */}
      <Footer />
    </div>
  );
}
