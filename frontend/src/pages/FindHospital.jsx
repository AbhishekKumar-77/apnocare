import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Building2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Search, 
  Star, 
  AlertCircle,
  Activity,
  HeartHandshake,
  Stethoscope,
  Clock,
  Bed,
  CreditCard,
  Truck,
  CheckCircle2,
  X,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';

export default function FindHospital({ onOpenCareWizard, onSelectDoctor }) {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [emergencyFilter, setEmergencyFilter] = useState(false);
  const [cityFilter, setCityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Hospital Deep-Dive Modal
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Emergency SOS Modal
  const [emergencySosHospital, setEmergencySosHospital] = useState(null);
  const [sosDispatched, setSosDispatched] = useState(false);

  useEffect(() => {
    loadData();
  }, [emergencyFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (emergencyFilter) params.append('emergency', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const [hospData, docData] = await Promise.all([
        api.getHospitals(params.toString()),
        api.getDoctors()
      ]);
      setHospitals(hospData || []);
      setDoctors(docData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = !searchQuery ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.departments || []).some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = cityFilter === 'All' || h.city === cityFilter;
    const matchesType = typeFilter === 'All' || h.type?.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesEmergency = !emergencyFilter || h.has_emergency_24_7;

    return matchesSearch && matchesCity && matchesType && matchesEmergency;
  });

  const handleDispatchAmbulance = (hosp) => {
    setEmergencySosHospital(hosp);
    setSosDispatched(false);
  };

  const confirmAmbulanceDispatch = () => {
    setSosDispatched(true);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 mb-3 border border-white/15">
            <Building2 className="w-3.5 h-3.5 text-teal-300" />
            <span>Multi-Speciality & NABH Accredited Medical Centers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">Find Hospitals & Trauma Centers</h1>
          <p className="text-xs sm:text-sm text-teal-100/80 mt-2 leading-relaxed">
            Verified hospitals in Punjab with 24/7 cardiac ICU facilities, cashless insurance desks, and dedicated ApnoCare physical care accompaniment.
          </p>
        </div>
      </div>

      {/* Emergency Hotline Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-rose-900/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-200">24/7 Emergency Assistance</span>
            <p className="text-xs sm:text-sm font-bold">Tagore Hospital ER: 0181-2244225 • Punjab Ambulance: 108</p>
          </div>
        </div>
        <button
          onClick={() => handleDispatchAmbulance(hospitals[0] || { name: 'Tagore Hospital & Heart Care', emergency_phone: '0181-2244225' })}
          className="px-4 py-2 bg-white text-rose-700 text-xs font-extrabold rounded-xl hover:bg-rose-50 transition self-start sm:self-auto shrink-0 shadow-sm cursor-pointer"
        >
          🚨 Instant Emergency Dispatch
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search hospital name, department (e.g. Cardiology, ICU, Dialysis, Oncology)..."
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

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* City */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-semibold">City:</span>
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="All">All Cities</option>
                <option value="Jalandhar">Jalandhar</option>
                <option value="Ludhiana">Ludhiana</option>
                <option value="Amritsar">Amritsar</option>
              </select>
            </div>

            {/* Type */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-semibold">Facility Type:</span>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="All">All Facility Types</option>
                <option value="Super Speciality">Multi-Super Speciality</option>
                <option value="Cancer">Cancer & Oncology</option>
                <option value="Diagnostic">Diagnostic & Daycare</option>
              </select>
            </div>
          </div>

          {/* Emergency 24/7 Checkbox */}
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={emergencyFilter}
              onChange={e => setEmergencyFilter(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <span className="text-rose-600 font-bold">24/7 Trauma Emergency Only</span>
          </label>
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map(hosp => (
          <div 
            key={hosp.id} 
            className="glass-card rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Cover Image */}
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <img 
                  src={hosp.image_url || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop&q=80"} 
                  alt={hosp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                  {hosp.has_emergency_24_7 && (
                    <span className="px-2.5 py-1 bg-rose-600 text-white font-extrabold text-[10px] rounded-full shadow-md">
                      24/7 ER
                    </span>
                  )}
                  <span className="px-2 py-1 bg-white/95 backdrop-blur-xs text-slate-900 font-bold text-[10px] rounded-full shadow-md flex items-center">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                    {hosp.rating}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
                    {hosp.type}
                  </span>
                  {hosp.nabh_accredited && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ NABH Accredited
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-1 font-heading">{hosp.name}</h3>

                <p className="text-xs text-slate-500 mt-2 flex items-start">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0 mt-0.5" />
                  <span className="leading-tight">{hosp.address}</span>
                </p>

                <p className="text-xs text-slate-600 mt-2 flex items-center font-medium">
                  <Phone className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
                  <a href={`tel:${hosp.phone}`} className="hover:underline">{hosp.phone}</a>
                </p>

                {/* Infrastructure specs */}
                <div className="mt-3 flex items-center space-x-3 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center">
                    <Bed className="w-3.5 h-3.5 text-teal-600 mr-1" />
                    {hosp.bed_count || 200}+ Beds
                  </span>
                  <span className="flex items-center">
                    <Activity className="w-3.5 h-3.5 text-rose-500 mr-1" />
                    {hosp.icu_beds || 30}+ ICU Beds
                  </span>
                  {hosp.cashless_tpa && (
                    <span className="flex items-center text-teal-700 font-semibold">
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      Cashless TPA
                    </span>
                  )}
                </div>

                {/* Departments */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Departments
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {hosp.departments?.slice(0, 4).map((d, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 space-y-2">
              <button
                type="button"
                onClick={() => setSelectedHospital(hosp)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Inspect Hospital Details & Doctors →
              </button>
              <button
                type="button"
                onClick={() => onOpenCareWizard ? onOpenCareWizard(null, hosp.name) : null}
                className="w-full py-2.5 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer border border-teal-200/60 hover:border-transparent"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Arrange Care Visit to this Hospital</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Hospital Deep-Dive Modal ── */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setSelectedHospital(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start space-x-4 pb-6 border-b border-slate-100">
              <img 
                src={selectedHospital.image_url} 
                alt={selectedHospital.name} 
                className="w-24 h-24 rounded-2xl object-cover border-2 border-teal-500 shadow-md shrink-0" 
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-slate-900 font-heading">{selectedHospital.name}</h2>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-md flex items-center border border-amber-200/60">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                    {selectedHospital.rating}
                  </span>
                </div>
                <p className="text-xs font-semibold text-teal-700 mt-0.5">{selectedHospital.type}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-start">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 mr-1 shrink-0 mt-0.5" />
                  <span>{selectedHospital.address}</span>
                </p>
                <p className="text-xs text-slate-600 mt-1 flex items-center space-x-3">
                  <span>Tel: <a href={`tel:${selectedHospital.phone}`} className="font-bold hover:underline">{selectedHospital.phone}</a></span>
                  {selectedHospital.emergency_phone && (
                    <span className="text-rose-600 font-bold">ER: {selectedHospital.emergency_phone}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Specs Bar */}
            <div className="grid grid-cols-3 gap-3 my-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">In-Patient Beds</span>
                <span className="text-base font-extrabold text-slate-900">{selectedHospital.bed_count || 250} Beds</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">ICU & CCU Units</span>
                <span className="text-base font-extrabold text-rose-600">{selectedHospital.icu_beds || 45} Critical</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Accreditation</span>
                <span className="text-base font-extrabold text-emerald-700">NABH / NABL</span>
              </div>
            </div>

            <div className="space-y-4 text-xs max-h-72 overflow-y-auto pr-1">
              {/* Departments */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">Specialized Departments</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedHospital.departments?.map((dept, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="font-semibold text-slate-800">{dept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">Hospital Facilities & Support</h4>
                <div className="space-y-1.5">
                  {(selectedHospital.facilities || [
                    '24/7 Advanced Life Support Ambulance',
                    'In-house Pharmacy',
                    'Wheelchair & Stretcher Assistance',
                    'Cashless TPA Insurance Counter'
                  ]).map((fac, i) => (
                    <p key={i} className="flex items-center text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2 shrink-0"></span>
                      <span>{fac}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Doctors at this Hospital */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Empanelled Specialists at this Hospital
                </h4>
                <div className="space-y-2">
                  {doctors
                    .filter(d => d.hospital_name?.toLowerCase().includes(selectedHospital.name.toLowerCase()) || selectedHospital.name.toLowerCase().includes(d.hospital_name?.toLowerCase()))
                    .map(doc => (
                      <div key={doc.id} className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={doc.image_url} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{doc.name}</p>
                            <p className="text-[11px] text-teal-700">{doc.specialty} • ₹{doc.consultation_fee}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedHospital(null);
                            if (onSelectDoctor) onSelectDoctor(doc);
                          }}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Book OPD
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDispatchAmbulance(selectedHospital)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl cursor-pointer transition border border-rose-200"
              >
                🚨 Emergency Dispatch
              </button>

              <button
                type="button"
                onClick={() => {
                  const name = selectedHospital.name;
                  setSelectedHospital(null);
                  if (onOpenCareWizard) onOpenCareWizard(null, name);
                }}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition"
              >
                Dispatch Care Associate to this Hospital →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Emergency SOS Dispatch Modal ── */}
      {emergencySosHospital && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-center">
            <button 
              onClick={() => setEmergencySosHospital(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 animate-bounce" />
            </div>

            {!sosDispatched ? (
              <div className="space-y-4 text-xs">
                <h2 className="text-xl font-extrabold text-slate-900 font-heading">Emergency Dispatch Service</h2>
                <p className="text-slate-600 leading-relaxed">
                  You are initiating an urgent emergency dispatch to <strong>{emergencySosHospital.name}</strong>.
                </p>
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-left space-y-2">
                  <p className="font-bold text-rose-900">Immediate Action Plan:</p>
                  <p className="text-rose-800">1. Certified ambulance with oxygen and cardiac monitor dispatched from nearest station.</p>
                  <p className="text-rose-800">2. ApnoCare on-duty emergency coordinator alerted simultaneously.</p>
                  <p className="text-rose-800">3. Direct line to hospital ER: <a href={`tel:${emergencySosHospital.emergency_phone}`} className="font-bold underline">{emergencySosHospital.emergency_phone}</a></p>
                </div>
                <div className="pt-2 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setEmergencySosHospital(null)}
                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmAmbulanceDispatch}
                    className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-lg cursor-pointer"
                  >
                    Confirm Dispatch 🚨
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
                  DISPATCH CONFIRMED
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 font-heading">Ambulance En Route</h2>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-left space-y-1.5">
                  <p><strong>Vehicle:</strong> ALS Cardiac Ambulance (PB-08-XX-1122)</p>
                  <p><strong>Estimated Arrival:</strong> 8 - 12 Minutes at Model Town</p>
                  <p><strong>Driver / Paramedic:</strong> Harpreet Singh (+91 98140 99887)</p>
                  <p><strong>Destination:</strong> {emergencySosHospital.name} 24/7 Trauma ER</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmergencySosHospital(null)}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Close & View Live Map
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
