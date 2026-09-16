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
  HeartHandshake
} from 'lucide-react';

export default function FindHospital({ onOpenCareWizard }) {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emergencyFilter, setEmergencyFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadHospitals();
  }, [emergencyFilter]);

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (emergencyFilter) params.append('emergency', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const data = await api.getHospitals(params.toString());
      setHospitals(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadHospitals();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Find Hospital & Clinics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore multi-speciality medical centers, accredited hospitals with 24/7 trauma emergency services, and comprehensive facilities.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search hospital name, department (e.g. Cardiology, Oncology, ICU)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
          />
        </form>

        <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={emergencyFilter}
            onChange={e => setEmergencyFilter(e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
          />
          <span className="text-rose-600">24/7 Emergency Care Only</span>
        </label>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map(hosp => (
          <div 
            key={hosp.id} 
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <img 
                  src={hosp.image_url || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop&q=80"} 
                  alt={hosp.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                  {hosp.has_emergency_24_7 && (
                    <span className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[10px] rounded-full shadow-md">
                      24/7 ER
                    </span>
                  )}
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-[10px] rounded-full shadow-md flex items-center">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                    {hosp.rating}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  {hosp.type}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{hosp.name}</h3>

                <p className="text-xs text-slate-500 mt-2 flex items-start">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0 mt-0.5" />
                  <span className="leading-tight">{hosp.address}</span>
                </p>

                <p className="text-xs text-slate-600 mt-2 flex items-center font-medium">
                  <Phone className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
                  <a href={`tel:${hosp.phone}`} className="hover:underline">{hosp.phone}</a>
                </p>

                {hosp.emergency_phone && (
                  <p className="text-[11px] text-rose-600 mt-1 font-bold">
                    Emergency: {hosp.emergency_phone}
                  </p>
                )}

                {/* Departments */}
                <div className="mt-4 pt-3 border-t border-slate-100">
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
            <div className="p-6 pt-0">
              <button
                onClick={() => onOpenCareWizard ? onOpenCareWizard(null, hosp.name) : null}
                className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Arrange Care Visit to this Hospital</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
