import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Search, 
  Stethoscope, 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  Building2, 
  DollarSign, 
  Check, 
  X,
  Sparkles,
  ShieldCheck,
  User,
  HeartHandshake,
  Video,
  Home,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Phone,
  QrCode,
  CheckCircle2,
  Printer,
  Info
} from 'lucide-react';

export default function FindDoctor({ preselectedPatient, onAppointmentBooked }) {
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState({ specialties: [], cities: [] });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [specialty, setSpecialty] = useState('All');
  const [city, setCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  // Doctor Profile Modal
  const [profileDoctor, setProfileDoctor] = useState(null);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Patient & Mode, 2: Slot & Date, 3: Companion & Notes, 4: Confirmed Pass
  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatient?.id || '');
  const [consultationMode, setConsultationMode] = useState('In-Clinic OPD');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [includeCompanion, setIncludeCompanion] = useState(true);
  const [reason, setReason] = useState('Routine Health Checkup & Medication Review');
  const [bookingSuccessPass, setBookingSuccessPass] = useState(null);

  useEffect(() => {
    loadDoctors();
    loadMetadata();
  }, [specialty, city]);

  const loadMetadata = async () => {
    try {
      const [cats, fam] = await Promise.all([
        api.getCategories(),
        api.getFamily()
      ]);
      setCategories(cats || { specialties: [], cities: [] });
      setFamilyMembers(fam || []);
      if (!selectedPatientId && fam && fam.length > 0) {
        setSelectedPatientId(fam[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (specialty && specialty !== 'All') params.append('specialty', specialty);
      if (city && city !== 'All') params.append('city', city);
      if (searchQuery) params.append('search', searchQuery);

      const data = await api.getDoctors(params.toString());
      setDoctors(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDoctors();
  };

  // Filter and sort doctors client-side for immediate responsiveness
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.health_concerns || []).some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty = specialty === 'All' || doc.specialty === specialty;
    const matchesCity = city === 'All' || doc.city === city;
    const matchesMode = selectedMode === 'All' || (doc.modes || ['In-Clinic OPD']).includes(selectedMode);

    return matchesSearch && matchesSpecialty && matchesCity && matchesMode;
  }).sort((a, b) => {
    if (sortBy === 'fee_low') return (a.consultation_fee || 0) - (b.consultation_fee || 0);
    if (sortBy === 'fee_high') return (b.consultation_fee || 0) - (a.consultation_fee || 0);
    if (sortBy === 'experience') return (b.experience_years || 0) - (a.experience_years || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // recommended default
  });

  const openBookingModal = (doc) => {
    setBookingDoctor(doc);
    setSelectedSlot(doc.available_slots?.[0] || '10:30 AM');
    setConsultationMode(doc.modes?.[0] || 'In-Clinic OPD');
    setBookingStep(1);
    setBookingSuccessPass(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedPatientId || !bookingDoctor || !selectedDate || !selectedSlot) {
      alert("Please ensure patient, date, and slot are selected.");
      return;
    }

    const patient = familyMembers.find(f => f.id === selectedPatientId) || familyMembers[0];
    const generatedToken = 'OPD-' + Math.floor(10 + Math.random() * 89);
    const generatedCode = 'APPT-' + Math.floor(1000 + Math.random() * 9000);

    try {
      const apptData = {
        appointment_code: generatedCode,
        token_number: generatedToken,
        doctor_id: bookingDoctor.id,
        doctor_name: bookingDoctor.name,
        doctor_specialty: bookingDoctor.specialty,
        hospital_name: bookingDoctor.hospital_name,
        hospital_address: bookingDoctor.hospital_address,
        family_member_id: patient?.id,
        patient_id: patient?.id,
        patient_name: patient?.name,
        patient_relation: patient?.relation,
        appointment_date: selectedDate,
        appointment_time: selectedSlot,
        consultation_mode: consultationMode,
        reason_for_visit: reason,
        consultation_fee: bookingDoctor.consultation_fee,
        accompanied_by_rep: includeCompanion,
        representative_name: includeCompanion ? 'Rajesh Kumar' : null,
        representative_phone: includeCompanion ? '+91 98722 34567' : null
      };

      const created = await api.createAppointment(apptData);

      // If user opted for physical Care Companion, auto-create a Care Request as well
      if (includeCompanion) {
        await api.createCareRequest({
          family_member_id: patient?.id,
          patient_name: patient?.name,
          patient_relation: patient?.relation,
          pickup_address: patient?.location || 'Model Town, Jalandhar',
          service_type: 'Doctor Visit Assistance',
          preferred_hospital_doctor: `${bookingDoctor.name} at ${bookingDoctor.hospital_name}`,
          scheduled_date: selectedDate,
          scheduled_time: selectedSlot,
          special_instructions: `Accompany patient to appointment with ${bookingDoctor.name}. Reason: ${reason}`
        });
      }

      setBookingSuccessPass({
        ...created,
        token_number: generatedToken,
        appointment_code: generatedCode,
        doctor: bookingDoctor,
        patient: patient,
        includeCompanion
      });
      setBookingStep(4);
      if (onAppointmentBooked) onAppointmentBooked(created);
    } catch (err) {
      alert(err.message || "Failed to book appointment");
    }
  };

  const selectedPatientObj = familyMembers.find(f => f.id === selectedPatientId);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 mb-3 border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>100% Verified Medical Specialists in Punjab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">Find & Book Specialist Doctors</h1>
          <p className="text-xs sm:text-sm text-teal-100/80 mt-2 leading-relaxed">
            Direct appointments with top physicians, cardiologists, and orthopedic specialists. Add an ApnoCare Care Associate to physically pick up and accompany your parents throughout the visit.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search doctor, hospital, condition (e.g. BP, Diabetes, Knee Osteoarthritis)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Specialty Dropdown */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-semibold">Specialty:</span>
              <select
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="All">All Specialties</option>
                {categories.specialties?.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-semibold">City:</span>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="All">All Cities</option>
                {categories.cities?.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Consultation Mode Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-semibold">Mode:</span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                {['All', 'In-Clinic OPD', 'Video Consultation', 'Home Visit'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSelectedMode(mode)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                      selectedMode === mode ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode === 'In-Clinic OPD' ? 'OPD' : mode === 'Video Consultation' ? 'Video' : mode === 'Home Visit' ? 'Home' : 'All'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
            >
              <option value="recommended">Recommended</option>
              <option value="fee_low">Fee: Low to High</option>
              <option value="fee_high">Fee: High to Low</option>
              <option value="experience">Most Experienced</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong>{filteredDoctors.length}</strong> accredited doctors</span>
        <span className="text-teal-700 font-medium">📍 Hospital OPDs in Jalandhar, Punjab</span>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map(doc => (
          <div 
            key={doc.id} 
            className="glass-card rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Doctor Details */}
              <div className="flex items-start space-x-4">
                <div className="relative shrink-0">
                  <img 
                    src={doc.image_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"} 
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm" title="Verified Medical Practitioner">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 font-heading truncate">{doc.name}</h3>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md flex items-center shrink-0 border border-amber-200/60">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                      {doc.rating} ({doc.reviews_count})
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-500 truncate">{doc.qualification} • {doc.experience_years}+ yrs exp</p>
                </div>
              </div>

              {/* Hospital & Address */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center font-medium text-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
                  <span className="truncate">{doc.hospital_name}</span>
                </p>
                <p className="flex items-center text-slate-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  <span className="truncate">{doc.hospital_address || doc.city}</span>
                </p>
              </div>

              {/* Modes of Consultation */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(doc.modes || ['In-Clinic OPD']).map((m, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md font-medium">
                    {m}
                  </span>
                ))}
              </div>

              {/* Available Slots Today */}
              <div className="mt-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Today's Slots
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {doc.available_slots?.slice(0, 4).map((slot, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 bg-teal-50 text-teal-700 font-semibold text-[10px] rounded-md border border-teal-200/60"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">OPD Fee</span>
                <span className="text-base font-extrabold text-slate-900 font-heading">₹{doc.consultation_fee || 800}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setProfileDoctor(doc)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => openBookingModal(doc)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Book Slot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Doctor Profile Deep-Dive Modal ── */}
      {profileDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setProfileDoctor(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start space-x-4 pb-6 border-b border-slate-100">
              <img 
                src={profileDoctor.image_url} 
                alt={profileDoctor.name} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md shrink-0" 
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-slate-900 font-heading">{profileDoctor.name}</h2>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-md flex items-center border border-amber-200/60">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                    {profileDoctor.rating}
                  </span>
                </div>
                <p className="text-xs font-semibold text-teal-700 mt-0.5">{profileDoctor.specialty}</p>
                <p className="text-xs text-slate-500 mt-1">{profileDoctor.qualification} • {profileDoctor.experience_years} Years Experience</p>
                <p className="text-xs text-slate-600 mt-1 flex items-center">
                  <Building2 className="w-3.5 h-3.5 text-teal-600 mr-1 shrink-0" />
                  <span>{profileDoctor.hospital_name}</span>
                </p>
              </div>
            </div>

            {/* About Bio */}
            <div className="mt-5 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">About Doctor</h4>
                <p className="text-slate-600 leading-relaxed">{profileDoctor.bio}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">Languages Spoken</h4>
                <div className="flex gap-1.5">
                  {profileDoctor.languages?.map(l => (
                    <span key={l} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">Specialized Health Concerns</h4>
                <div className="flex flex-wrap gap-1.5">
                  {profileDoctor.health_concerns?.map(h => (
                    <span key={h} className="px-2 py-1 bg-teal-50 text-teal-700 rounded-md font-medium text-[11px] border border-teal-200/60">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Patient Reviews */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">Verified Patient Reviews</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {(profileDoctor.reviews || []).map((rev, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{rev.author} ({rev.relation})</span>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <p className="text-slate-600 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Consultation Fee</span>
                <span className="text-lg font-extrabold text-slate-900">₹{profileDoctor.consultation_fee}</span>
              </div>
              <button
                onClick={() => {
                  const doc = profileDoctor;
                  setProfileDoctor(null);
                  openBookingModal(doc);
                }}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition"
              >
                Proceed to Book Slot →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Multi-Step Deep Booking Modal ── */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setBookingDoctor(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStep < 4 && (
              <div className="mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 mb-1">
                  <span>Step {bookingStep} of 3</span>
                  <span>•</span>
                  <span>{bookingStep === 1 ? 'Patient & Mode' : bookingStep === 2 ? 'Date & Time Slot' : 'Care Companion & Confirm'}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">
                  Book with {bookingDoctor.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{bookingDoctor.specialty} • {bookingDoctor.hospital_name}</p>
              </div>
            )}

            {/* STEP 1: Select Patient & Mode */}
            {bookingStep === 1 && (
              <div className="space-y-5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-2">1. Select Family Member for Consultation:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {familyMembers.map(m => (
                      <div
                        key={m.id}
                        onClick={() => setSelectedPatientId(m.id)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-center space-x-3 ${
                          selectedPatientId === m.id ? 'border-teal-600 bg-teal-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">
                          {m.name?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{m.name}</p>
                          <p className="text-[11px] text-teal-700 font-medium">{m.relation} • {m.age} yrs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-2">2. Consultation Mode:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(bookingDoctor.modes || ['In-Clinic OPD', 'Video Consultation']).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setConsultationMode(mode)}
                        className={`p-3 rounded-2xl border-2 font-bold text-center cursor-pointer transition ${
                          consultationMode === mode ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {mode === 'In-Clinic OPD' && <Building2 className="w-4 h-4 mx-auto mb-1 text-teal-600" />}
                        {mode === 'Video Consultation' && <Video className="w-4 h-4 mx-auto mb-1 text-blue-600" />}
                        {mode === 'Home Visit' && <Home className="w-4 h-4 mx-auto mb-1 text-amber-600" />}
                        <span className="block text-[11px]">{mode}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Continue to Schedule →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Date & Slot */}
            {bookingStep === 2 && (
              <div className="space-y-5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Select Consultation Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-2">Available Time Slots for {selectedDate}:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {bookingDoctor.available_slots?.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl border-2 font-bold text-xs cursor-pointer transition ${
                          selectedSlot === slot ? 'border-teal-600 bg-teal-600 text-white shadow-xs' : 'border-slate-200 text-slate-700 hover:border-teal-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Companion & Details →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Care Companion Add-on & Reason */}
            {bookingStep === 3 && (
              <div className="space-y-5 text-xs">
                {/* Companion Add-on Highlight Box */}
                <div className={`p-4 rounded-2xl border-2 transition ${
                  includeCompanion ? 'border-amber-400 bg-amber-50/60' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-900">Add ApnoCare Care Associate?</h4>
                          <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full">RECOMMENDED</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          A verified associate picks up your parent from home, manages OPD queues, takes consultation notes, and escorts them safely home.
                        </p>
                        <p className="text-amber-800 font-bold text-xs mt-1.5">+ ₹1,200 (Inclusive of local companion care & transport coordination)</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeCompanion}
                      onChange={e => setIncludeCompanion(e.target.checked)}
                      className="w-5 h-5 text-amber-600 rounded cursor-pointer mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Reason for Consultation / Chief Complaints:</label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="E.g. Routine blood pressure checkup, knee pain worsening in mornings, review recent blood reports..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Summary Box */}
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Doctor OPD Fee:</span>
                    <span className="text-slate-800">₹{bookingDoctor.consultation_fee}</span>
                  </div>
                  {includeCompanion && (
                    <div className="flex justify-between font-semibold text-amber-800">
                      <span>Care Associate Accompaniment:</span>
                      <span>₹1,200</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-slate-200 text-slate-900">
                    <span>Total Estimated:</span>
                    <span>₹{bookingDoctor.consultation_fee + (includeCompanion ? 1200 : 0)}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer shadow-md"
                  >
                    Confirm & Generate OPD Pass ✓
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Digital OPD Pass & Confirmation */}
            {bookingStep === 4 && bookingSuccessPass && (
              <div className="space-y-6 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                    CONFIRMED & SCHEDULED
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-2 font-heading">Digital OPD Pass Issued</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Present this token at the reception desk upon arrival.
                  </p>
                </div>

                {/* Digital Token Card */}
                <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 rounded-3xl text-left relative overflow-hidden shadow-xl border border-teal-500/30">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-teal-300 tracking-wider">Appointment Token</span>
                      <p className="text-2xl font-black text-white font-heading">{bookingSuccessPass.token_number}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-teal-200 block font-mono">Code: {bookingSuccessPass.appointment_code}</span>
                      <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] font-bold rounded-md border border-teal-400/30">
                        {consultationMode}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p><strong>Patient:</strong> {bookingSuccessPass.patient?.name} ({bookingSuccessPass.patient?.relation})</p>
                    <p><strong>Specialist:</strong> {bookingSuccessPass.doctor?.name} ({bookingSuccessPass.doctor?.specialty})</p>
                    <p><strong>Hospital:</strong> {bookingSuccessPass.doctor?.hospital_name}</p>
                    <p><strong>Scheduled:</strong> {selectedDate} at {selectedSlot}</p>
                  </div>

                  {includeCompanion && (
                    <div className="mt-4 pt-3 border-t border-white/15 flex items-center space-x-2 text-xs text-amber-300">
                      <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Care Associate Rajesh Kumar (+91 98722 34567) assigned for home pickup</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Token</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingDoctor(null)}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
