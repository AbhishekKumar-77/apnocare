import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Activity, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Home, 
  FileText, 
  Calendar, 
  X,
  ShieldCheck,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  Info,
  User
} from 'lucide-react';

export default function Diagnostics() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'bookings'
  const [catalog, setCatalog] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Categories
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [inspectTest, setInspectTest] = useState(null);
  const [bookingTest, setBookingTest] = useState(null);
  const [viewingReportBooking, setViewingReportBooking] = useState(null);

  // Booking Form State
  const [formData, setFormData] = useState({
    family_member_id: '',
    booking_date: new Date().toISOString().split('T')[0],
    booking_time: '07:30 AM (Fasting Slot)',
    collection_type: 'Home Sample Collection',
    collection_address: 'House 142, Sector 2, Model Town, Jalandhar',
    lab_partner: 'Apollo Diagnostics'
  });
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cat, books, fam] = await Promise.all([
        api.getDiagnosticCatalog(),
        api.getDiagnosticBookings(),
        api.getFamily()
      ]);
      setCatalog(cat || []);
      setBookings(books || []);
      setFamilyMembers(fam || []);

      if (fam && fam.length > 0 && !formData.family_member_id) {
        setFormData(prev => ({
          ...prev,
          family_member_id: fam[0].id,
          collection_address: fam[0].location || prev.collection_address
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    'Full Body Packages',
    'Routine Pathology',
    'Diabetes Care',
    'Cardiac Health',
    'Organ Profiles',
    'Endocrine Health'
  ];

  const handlePatientSelect = (memberId) => {
    const member = familyMembers.find(f => f.id === memberId);
    setFormData(prev => ({
      ...prev,
      family_member_id: memberId,
      collection_address: member ? member.location : prev.collection_address
    }));
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const patient = familyMembers.find(f => f.id === formData.family_member_id) || familyMembers[0];
    const generatedCode = 'DIAG-' + Math.floor(1000 + Math.random() * 9000);

    const newBooking = {
      _id: 'db_' + Date.now(),
      id: 'db_' + Date.now(),
      booking_code: generatedCode,
      family_member_id: formData.family_member_id,
      patient_name: patient?.name || 'Jaswant Kaur',
      test_name: bookingTest.test_name,
      price: bookingTest.price,
      scheduled_date: formData.booking_date,
      scheduled_time: formData.booking_time,
      collection_type: formData.collection_type,
      collection_address: formData.collection_address,
      lab_partner: formData.lab_partner,
      status: 'confirmed',
      phlebotomist: 'Maninder Singh (+91 98142 55443)'
    };

    try {
      const savedBookings = JSON.parse(localStorage.getItem('apnocare_diag_bookings') || '[]');
      savedBookings.unshift(newBooking);
      localStorage.setItem('apnocare_diag_bookings', JSON.stringify(savedBookings));

      setBookings(savedBookings);
      setBookingSuccess(newBooking);
      setBookingTest(null);
      setActiveTab('bookings');
    } catch (err) {
      alert("Failed to book diagnostic test");
    }
  };

  const filteredCatalog = catalog.filter(test => {
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      test.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.parameters || []).some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-rose-200 mb-3 border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
              <span>NABL Accredited Labs • Certified Home Phlebotomy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">Diagnostic Tests & Health Packages</h1>
            <p className="text-xs sm:text-sm text-rose-100/80 mt-1 max-w-xl leading-relaxed">
              Book certified blood tests, diabetic profiles, and comprehensive full-body screenings. Certified phlebotomists visit your family home in Jalandhar for hygienic sample collection.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-white/10 backdrop-blur-md p-1 border border-white/20 shrink-0">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'catalog' ? 'bg-white text-rose-900 shadow-sm' : 'text-rose-100 hover:text-white'
              }`}
            >
              Test Catalog
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'bookings' ? 'bg-white text-rose-900 shadow-sm' : 'text-rose-100 hover:text-white'
              }`}
            >
              My Bookings ({bookings.length})
            </button>
          </div>
        </div>
      </div>

      {/* ── TAB 1: TEST CATALOG ── */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search & Category Pills */}
          <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search diagnostic test (e.g. CBC, HbA1c, Lipid, Thyroid, Kidney KFT)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map(test => (
              <div 
                key={test.id} 
                className="glass-card rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">
                      {test.category}
                    </span>
                    {test.popular && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mt-1 font-heading">{test.test_name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{test.description}</p>

                  {/* Badges */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                    <span className="flex items-center text-teal-700 font-semibold">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      TAT: {test.tat}
                    </span>
                    <span className="flex items-center text-slate-500">
                      <Activity className="w-3.5 h-3.5 mr-1 text-rose-500" />
                      {test.sample_type}
                    </span>
                    {test.fasting_required ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200">
                        10-12 Hrs Fasting
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                        No Fasting
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Fee</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-lg font-extrabold text-slate-900 font-heading">₹{test.price}</span>
                      {test.original_price && (
                        <span className="text-xs text-slate-400 line-through">₹{test.original_price}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setInspectTest(test)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingTest(test)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition"
                    >
                      Book Home Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: MY BOOKINGS ── */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.length === 0 ? (
              <div className="col-span-2 glass-card rounded-3xl p-12 text-center text-slate-400">
                <Activity className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-700">No diagnostic bookings scheduled yet</p>
                <p className="text-xs mt-1">Book home sample collection from our certified lab partners.</p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="mt-4 px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Browse Tests
                </button>
              </div>
            ) : (
              bookings.map(b => (
                <div 
                  key={b.id} 
                  className="glass-card rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">
                          Booking ID: {b.booking_code || 'DIAG-8821'}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 mt-0.5">{b.test_name}</h3>
                        <p className="text-xs text-teal-700 font-semibold">{b.lab_partner || 'Apollo Diagnostics'}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.status?.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <p className="flex items-center font-medium text-slate-800">
                        <User className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                        <span>Patient: <strong>{b.patient_name}</strong></span>
                      </p>
                      <p className="flex items-center text-slate-700 font-semibold">
                        <Clock className="w-4 h-4 text-rose-600 mr-2 shrink-0" />
                        <span>Slot: {b.scheduled_date} at {b.scheduled_time || '08:00 AM'}</span>
                      </p>
                      <p className="flex items-center text-slate-500">
                        <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <span className="truncate">{b.collection_address}</span>
                      </p>
                      {b.phlebotomist && (
                        <p className="flex items-center text-teal-800 font-medium text-[11px] pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                          <span>Assigned Phlebotomist: {b.phlebotomist}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Fee</span>
                      <span className="text-sm font-extrabold text-slate-900">₹{b.price || 450}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewingReportBooking(b)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center space-x-1.5 border border-rose-200"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Sample Report</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TEST INSPECTOR MODAL ── */}
      {inspectTest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setInspectTest(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">
              {inspectTest.category}
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-heading mt-0.5">{inspectTest.test_name}</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{inspectTest.description}</p>

            <div className="my-5 space-y-4 text-xs">
              {/* Parameters breakdown */}
              {inspectTest.parameters && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                    Included Test Parameters ({inspectTest.parameters.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {inspectTest.parameters.map((p, i) => (
                      <div key={i} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fasting & Prep */}
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1">
                <p className="font-bold text-amber-900 flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Preparation Guidelines</span>
                </p>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  {inspectTest.preparation || 'No special dietary restrictions. Continue drinking water normally.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Report Turnaround</span>
                  <p className="font-bold text-slate-900">{inspectTest.tat}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Sample Type</span>
                  <p className="font-bold text-slate-900">{inspectTest.sample_type}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Fee</span>
                <span className="text-lg font-extrabold text-slate-900">₹{inspectTest.price}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const t = inspectTest;
                  setInspectTest(null);
                  setBookingTest(t);
                }}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Schedule Home Phlebotomy →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HOME PHLEBOTOMY BOOKING MODAL ── */}
      {bookingTest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setBookingTest(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">
              Home Sample Collection
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-heading mt-0.5">Book {bookingTest.test_name}</h2>
            <p className="text-xs text-slate-500 mt-1">
              A certified phlebotomist will arrive at your home with sterilized vacutainer kits.
            </p>

            <form onSubmit={handleBookSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Patient:</label>
                <select
                  value={formData.family_member_id}
                  onChange={e => handlePatientSelect(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  {familyMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Collection Date:</label>
                <input
                  type="date"
                  value={formData.booking_date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferred Time Slot:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '07:00 AM (Fasting)',
                    '07:45 AM (Fasting)',
                    '08:30 AM (Fasting)',
                    '10:30 AM (Regular)'
                  ].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({ ...formData, booking_time: slot })}
                      className={`p-2 rounded-xl border text-center font-bold text-[11px] cursor-pointer ${
                        formData.booking_time === slot ? 'border-rose-600 bg-rose-50 text-rose-800' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Accredited Lab Partner:</label>
                <select
                  value={formData.lab_partner}
                  onChange={e => setFormData({ ...formData, lab_partner: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Apollo Diagnostics">Apollo Diagnostics (Model Town NABL Lab)</option>
                  <option value="Dr. Lal PathLabs">Dr. Lal PathLabs (Jalandhar Cantt Hub)</option>
                  <option value="Tagore Hospital Lab">Tagore Hospital In-house Pathology</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Home Collection Address:</label>
                <textarea
                  rows={2}
                  value={formData.collection_address}
                  onChange={e => setFormData({ ...formData, collection_address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setBookingTest(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Confirm Home Collection (₹{bookingTest.price}) ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE LAB REPORT VIEWER MODAL ── */}
      {viewingReportBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setViewingReportBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lab Header */}
            <div className="border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-heading">
                    {viewingReportBooking.lab_partner || 'Apollo Diagnostics Centre'}
                  </h2>
                  <p className="text-[10px] text-slate-500">ISO 15189 & NABL Certified Pathology Laboratory</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200">
                  FINAL VERIFIED REPORT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                  <p><strong>Patient:</strong> {viewingReportBooking.patient_name}</p>
                  <p className="text-slate-500">Sample Date: {viewingReportBooking.scheduled_date}</p>
                </div>
                <div className="text-right">
                  <p><strong>Ref Code:</strong> {viewingReportBooking.booking_code || 'DIAG-8821'}</p>
                  <p className="text-slate-500">Doctor: Dr. Rajiv Sharma</p>
                </div>
              </div>
            </div>

            {/* Simulated Parameters Table */}
            <div className="text-xs space-y-2">
              <h4 className="font-bold text-slate-900">{viewingReportBooking.test_name} — Findings</h4>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="py-1.5">Test Parameter</th>
                    <th className="py-1.5">Result</th>
                    <th className="py-1.5">Reference Range</th>
                    <th className="py-1.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 font-semibold">HbA1c (Glycated Hb)</td>
                    <td className="py-2 font-bold text-slate-900">5.6 %</td>
                    <td className="py-2 text-slate-500">&lt; 5.7 % (Normal)</td>
                    <td className="py-2 text-right">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Normal</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Fasting Blood Sugar</td>
                    <td className="py-2 font-bold text-slate-900">98 mg/dL</td>
                    <td className="py-2 text-slate-500">70 - 100 mg/dL</td>
                    <td className="py-2 text-right">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Normal</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Average Blood Glucose (eAG)</td>
                    <td className="py-2 font-bold text-slate-900">114 mg/dL</td>
                    <td className="py-2 text-slate-500">90 - 120 mg/dL</td>
                    <td className="py-2 text-right">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Normal</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Lab Report</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingReportBooking(null)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
