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
  X
} from 'lucide-react';

export default function Diagnostics() {
  const [catalog, setCatalog] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingTest, setBookingTest] = useState(null);

  const [formData, setFormData] = useState({
    family_member_id: '',
    booking_date: new Date().toISOString().split('T')[0],
    booking_time: '08:30 AM',
    collection_type: 'Home Sample Collection',
    collection_address: ''
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
          collection_address: fam[0].location
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
    try {
      const booking = await api.createDiagnosticBooking({
        family_member_id: formData.family_member_id,
        test_name: bookingTest.test_name,
        price: bookingTest.price,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        collection_type: formData.collection_type,
        collection_address: formData.collection_address
      });
      setBookingSuccess(booking);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to book test');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider">
          Accredited Labs • Home Collection
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Diagnostic Tests & Pathology</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Book certified blood pathology, cardiac ECG, and routine metabolic screenings with certified phlebotomists visiting your family's home in Jalandhar.
        </p>
      </div>

      {/* Catalog Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Popular Health Tests & Profiles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  {t.category}
                </span>
                <h4 className="font-bold text-base text-slate-900 mt-1">{t.test_name}</h4>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <p>Sample: <strong>{t.sample_type || 'Blood'}</strong></p>
                  <p>Fasting: <strong>{t.fasting_required ? 'Required (8-10 hrs)' : 'Not Required'}</strong></p>
                  <p>Turnaround Time: <strong>{t.tat || '6-8 Hours'}</strong></p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Test Price</span>
                  <span className="text-base font-bold text-slate-900">₹{t.price}</span>
                </div>

                <button
                  onClick={() => {
                    setBookingTest(t);
                    setBookingSuccess(null);
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Book Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings History */}
      {bookings.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Active & Past Bookings ({bookings.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{b.test_name}</span>
                  <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold rounded-full text-[10px]">
                    {b.status}
                  </span>
                </div>
                <div className="text-slate-500 space-y-1">
                  <p><strong>Patient:</strong> {b.patient_name}</p>
                  <p><strong>Lab:</strong> {b.lab_name}</p>
                  <p><strong>Scheduled:</strong> {b.booking_date} at {b.booking_time}</p>
                  <p><strong>Mode:</strong> {b.collection_type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingTest && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Diagnostic Test Booked!</h3>
                <p className="text-xs text-slate-600">
                  Phlebotomist scheduled for {bookingSuccess.patient_name} on {bookingSuccess.booking_date}.
                </p>
                <button
                  onClick={() => setBookingTest(null)}
                  className="w-full py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Book {bookingTest.test_name}</h3>
                  <button onClick={() => setBookingTest(null)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleBookSubmit} className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select Family Member *</label>
                    <select
                      value={formData.family_member_id}
                      onChange={e => handlePatientSelect(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      {familyMembers.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.relation}) — {m.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Collection Mode</label>
                    <select
                      value={formData.collection_type}
                      onChange={e => setFormData({ ...formData, collection_type: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Home Sample Collection">Home Sample Collection (Technician Visits Home)</option>
                      <option value="Lab Visit">Visit Nearest Accredited Lab</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.booking_date}
                        onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Morning Time *</label>
                      <input
                        type="text"
                        required
                        value={formData.booking_time}
                        onChange={e => setFormData({ ...formData, booking_time: e.target.value })}
                        placeholder="08:30 AM"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sample Collection Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.collection_address}
                      onChange={e => setFormData({ ...formData, collection_address: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="p-3 bg-teal-50 rounded-xl flex items-center justify-between font-semibold text-teal-900">
                    <span>Total Test Fee:</span>
                    <span className="text-base font-bold">₹{bookingTest.price}</span>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setBookingTest(null)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      Confirm Test Booking
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
