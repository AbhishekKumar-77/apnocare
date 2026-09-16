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
  Sparkles
} from 'lucide-react';

export default function FindDoctor({ preselectedPatient, onAppointmentBooked }) {
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState({ specialties: [], cities: [] });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [specialty, setSpecialty] = useState('All');
  const [city, setCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatient?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('Routine Health Checkup & Consultation');
  const [bookingSuccess, setBookingSuccess] = useState(null);

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

  const openBookingModal = (doc) => {
    setBookingDoctor(doc);
    setSelectedSlot(doc.available_slots?.[0] || '10:30 AM');
    setBookingSuccess(null);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !bookingDoctor || !selectedDate || !selectedSlot) {
      alert("Please select a patient, date, and slot");
      return;
    }

    try {
      const appt = await api.createAppointment({
        family_member_id: selectedPatientId,
        doctor_id: bookingDoctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedSlot,
        reason_for_visit: reason
      });

      setBookingSuccess(appt);
      if (onAppointmentBooked) onAppointmentBooked(appt);
    } catch (err) {
      alert(err.message || "Failed to book appointment");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Find a Doctor</h1>
        <p className="text-xs text-slate-500 mt-1">
          Search accredited medical specialists in your family's city, review authentic ratings, and book verified consultation slots.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, hospital, or health concern (e.g. Blood pressure, Knee pain)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
          >
            Search Doctors
          </button>
        </form>

        {/* Category Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
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
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map(doc => (
          <div 
            key={doc.id} 
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Doctor Details */}
              <div className="flex items-start space-x-4">
                <img 
                  src={doc.image_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"} 
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-slate-900">{doc.name}</h3>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md flex items-center">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                      {doc.rating}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-400">{doc.qualification || 'MBBS, MD'} • {doc.experience_years || 15}+ yrs exp</p>
                </div>
              </div>

              {/* Hospital & Address */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <p className="flex items-center font-medium text-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
                  <span>{doc.hospital_name}</span>
                </p>
                <p className="flex items-center text-slate-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  <span>{doc.hospital_address || doc.city}</span>
                </p>
              </div>

              {/* Available Slots Pills */}
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Available Slots Today
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {doc.available_slots?.map((slot, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-teal-50 text-teal-700 font-semibold text-[11px] rounded-lg border border-teal-200/60"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Book Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Consultation Fee</span>
                <span className="text-base font-bold text-slate-900">₹{doc.consultation_fee || 800}</span>
              </div>

              <button
                onClick={() => openBookingModal(doc)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Confirmation Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Appointment code <strong>{bookingSuccess.appointment_code}</strong> has been scheduled with {bookingSuccess.doctor_name} for {bookingSuccess.patient_name}.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                  <p><strong>Date:</strong> {bookingSuccess.appointment_date}</p>
                  <p><strong>Time:</strong> {bookingSuccess.appointment_time}</p>
                  <p><strong>Hospital:</strong> {bookingSuccess.hospital_name}</p>
                </div>
                <button
                  onClick={() => setBookingDoctor(null)}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-teal-700">Schedule Consultation</span>
                    <h3 className="text-base font-bold text-slate-900">{bookingDoctor.name}</h3>
                  </div>
                  <button onClick={() => setBookingDoctor(null)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleConfirmBooking} className="mt-4 space-y-3.5 text-xs">
                  
                  {/* Select Family Member */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">For Which Family Member? *</label>
                    <select
                      value={selectedPatientId}
                      onChange={e => setSelectedPatientId(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium"
                    >
                      {familyMembers.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.relation}) — {m.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Date */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Appointment Date *</label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  {/* Select Slot */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Available Slot *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {bookingDoctor.available_slots?.map(slot => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl font-semibold border text-center transition ${
                            selectedSlot === slot
                              ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Health Concern / Reason for Visit</label>
                    <input
                      type="text"
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="e.g. Routine BP checkup, Knee pain, Blood sugar review"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  {/* Fee Summary */}
                  <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-xs text-teal-900 font-semibold">
                    <span>Consultation Fee:</span>
                    <span className="text-base font-bold">₹{bookingDoctor.consultation_fee}</span>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setBookingDoctor(null)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      Confirm Appointment
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
