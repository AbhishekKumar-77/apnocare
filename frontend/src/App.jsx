import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import FloatingAskApnoCare from './components/FloatingAskApnoCare';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyFamily from './pages/MyFamily';
import CareAssistance from './pages/CareAssistance';
import CareRepresentativePortal from './pages/CareRepresentativePortal';
import FindDoctor from './pages/FindDoctor';
import FindHospital from './pages/FindHospital';
import Medicines from './pages/Medicines';
import Diagnostics from './pages/Diagnostics';
import HealthRecords from './pages/HealthRecords';
import Appointments from './pages/Appointments';
import AdminDashboard from './pages/AdminDashboard';

function MainApp() {
  const { user, loading, demoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientForBooking, setSelectedPatientForBooking] = useState(null);
  const [careWizardPatient, setCareWizardPatient] = useState(null);
  const [careWizardOpen, setCareWizardOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold tracking-wider uppercase text-teal-800">Loading ApnoCare...</span>
        </div>
      </div>
    );
  }

  // Handle AI platform action dispatch
  const handleAIActionTrigger = (action) => {
    if (!action) return;
    if (action.type === 'BOOK_APPOINTMENT' || action.type === 'FIND_DOCTOR') {
      if (action.parameters?.family_member_id) {
        setSelectedPatientForBooking({ id: action.parameters.family_member_id, name: action.parameters.patient_name });
      }
      setActiveTab('doctors');
    } else if (action.type === 'REQUEST_CARE') {
      if (action.parameters?.family_member_id) {
        setCareWizardPatient({ id: action.parameters.family_member_id, name: action.parameters.patient_name, location: action.parameters.location });
      }
      setCareWizardOpen(true);
      setActiveTab('care');
    } else if (action.type === 'ORDER_MEDICINE') {
      setActiveTab('medicines');
    } else if (action.type === 'FIND_HOSPITAL') {
      setActiveTab('hospitals');
    }
  };

  // If not logged in and on auth or landing
  if (!user) {
    if (activeTab === 'register') {
      return <Register onSwitchToLogin={() => setActiveTab('login')} onSuccess={() => setActiveTab('dashboard')} />;
    }
    if (activeTab === 'login') {
      return <Login onSwitchToRegister={() => setActiveTab('register')} onSuccess={() => setActiveTab('dashboard')} />;
    }
    return (
      <Landing 
        onGetStarted={() => {
          demoLogin('family_user');
          setActiveTab('dashboard');
        }} 
        onLoginClick={() => setActiveTab('login')} 
      />
    );
  }

  // Helper callbacks from child pages
  const handleSelectPatientForDoctor = (member) => {
    setSelectedPatientForBooking(member);
    setActiveTab('doctors');
  };

  const handleOpenCareWizard = (member = null, hospital = null) => {
    setCareWizardPatient(member);
    setCareWizardOpen(true);
    setActiveTab('care');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            setActiveTab={setActiveTab} 
            onOpenCareWizard={handleOpenCareWizard}
            onSelectPatientForDoctor={handleSelectPatientForDoctor}
          />
        )}

        {activeTab === 'family' && (
          <MyFamily 
            onSelectPatientForDoctor={handleSelectPatientForDoctor}
            onOpenCareWizard={handleOpenCareWizard}
          />
        )}

        {activeTab === 'care' && (
          <CareAssistance 
            initialPatient={careWizardPatient}
            openWizardByDefault={careWizardOpen}
          />
        )}

        {activeTab === 'rep-workspace' && <CareRepresentativePortal />}
        {activeTab === 'rep-profile' && <CareRepresentativePortal />}

        {activeTab === 'doctors' && (
          <FindDoctor 
            preselectedPatient={selectedPatientForBooking} 
            onAppointmentBooked={() => setActiveTab('appointments')}
          />
        )}

        {activeTab === 'hospitals' && (
          <FindHospital onOpenCareWizard={handleOpenCareWizard} />
        )}

        {activeTab === 'medicines' && <Medicines />}
        {activeTab === 'diagnostics' && <Diagnostics />}
        {activeTab === 'records' && <HealthRecords />}
        {activeTab === 'appointments' && (
          <Appointments onBookDoctorClick={() => setActiveTab('doctors')} />
        )}

        {(activeTab === 'admin-overview' || activeTab === 'admin-reps' || activeTab === 'admin-requests') && (
          <AdminDashboard />
        )}
      </main>

      {/* Persistent Ask ApnoCare AI Assistant */}
      <FloatingAskApnoCare onTriggerAction={handleAIActionTrigger} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
