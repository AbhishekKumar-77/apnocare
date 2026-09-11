import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShieldCheck,
  Award,
  Users,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  Sparkles,
  RefreshCw,
  Terminal,
} from 'lucide-react';

import Navbar from './components/Navbar';
import StatusBanner from './components/StatusBanner';
import ServiceCard from './components/ServiceCard';
import InquiryForm from './components/InquiryForm';
import InquiryModal from './components/InquiryModal';
import Footer from './components/Footer';

import { getSystemHealth, getServicesList, getInquiriesList } from './services/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [services, setServices] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    setApiError(null);
    try {
      const data = await getSystemHealth();
      setHealth(data);
    } catch (err) {
      console.error('Error fetching backend health:', err);
      setApiError('Backend server is not reachable on port 5000. Please ensure "npm run dev" is running.');
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await getServicesList();
      if (res.data) setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchInquiries = async () => {
    setModalLoading(true);
    try {
      const res = await getInquiriesList();
      if (res.data) setInquiries(res.data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchServices();
    fetchInquiries();
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    const formSection = document.getElementById('book');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirySubmitted = (newInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Navigation */}
      <Navbar
        health={health}
        inquiryCount={inquiries.length}
        onOpenInquiries={() => {
          setIsModalOpen(true);
          fetchInquiries();
        }}
      />

      {/* Backend / Atlas Connection Status Banner */}
      <StatusBanner
        health={health}
        onRefresh={() => {
          fetchHealth();
          fetchServices();
        }}
        loading={loadingHealth}
      />

      {/* API Unreachable Error Banner if server is off */}
      {apiError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/70 border border-sky-200 text-sky-800 text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>Your Family's Dedicated Home Healthcare Partner</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                  Compassionate care,{' '}
                  <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">
                    right in the comfort
                  </span>{' '}
                  of your home.
                </h1>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                  ApnoCare connects your loved ones with verified clinical nurses, caring elderly attendants, and licensed physiotherapists. Seamlessly managed, medically supervised, and trusted by thousands of families.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <a
                    href="#book"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-semibold text-base shadow-lg shadow-sky-600/25 transition-all"
                  >
                    <span>Request a Caregiver</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#services"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-base shadow-xs transition-colors"
                  >
                    <span>Explore Care Services</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
                    <div className="text-xs text-slate-500 mt-0.5">Verified Nurses</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">24/7</div>
                    <div className="text-xs text-slate-500 mt-0.5">Clinical Support</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">15,000+</div>
                    <div className="text-xs text-slate-500 mt-0.5">Care Shifts Done</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Tech & Care Preview Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative backdrop glow */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-sky-500 to-teal-400 rounded-3xl blur-lg opacity-25"></div>

                  <div className="relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Fullstack Live Status</h4>
                          <p className="text-[11px] text-slate-500">React + Node + Atlas Setup</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        API Active
                      </span>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-1.5">
                        <div className="text-slate-400">// Backend Health Response:</div>
                        <div className="text-emerald-400">
                          {health ? JSON.stringify({ status: health.status, uptime: health.uptime, db: health.database?.state }, null, 2) : 'Loading...'}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-700 font-sans">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>Database Provider:</span>
                          <span className="text-emerald-700">MongoDB Atlas</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Connection:</span>
                          <span className={health?.database?.isConnected ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                            {health?.database?.isConnected ? 'Active & Ready' : 'Pending URI in server/.env'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Backend Port:</span>
                          <span className="font-mono text-slate-800">5000</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Frontend Port:</span>
                          <span className="font-mono text-slate-800">5173</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          fetchInquiries();
                        }}
                        className="text-xs text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Inquiries DB ({inquiries.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={fetchHealth}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Ping backend"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 bg-white border-y border-slate-200/80 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-wide">
                Specialized Home Health
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Tailored Healthcare Services
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3">
                Select a service below to prefill your care request form or discover our certified medical solutions.
              </p>
            </div>

            {loadingServices ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Loading available care services from API...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((svc) => (
                  <ServiceCard
                    key={svc._id || svc.title}
                    service={svc}
                    onSelect={handleServiceSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why ApnoCare Section */}
        <section id="about" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">The ApnoCare Promise</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Why Families Trust ApnoCare
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Thoroughly Vetted Caregivers</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every caregiver undergoes comprehensive police verification, reference checks, and rigorous clinical skill assessments before their first placement.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">24/7 Medical Supervision</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Caregivers are backed by on-call senior physicians and nursing supervisors to handle emergencies and regular treatment adjustments anytime.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Dedicated Care Coordinator</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  You get a personal relationship manager for seamless shift scheduling, rapid caregiver replacements, and daily care reporting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Care Inquiry Form Section */}
        <InquiryForm
          selectedService={selectedService}
          onSubmitted={handleInquirySubmitted}
        />
      </main>

      {/* Inquiry Records Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inquiries={inquiries}
        loading={modalLoading}
        onRefresh={fetchInquiries}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
