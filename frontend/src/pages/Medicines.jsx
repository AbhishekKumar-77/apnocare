import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Pill, 
  Upload, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ShieldCheck,
  Building2,
  AlertTriangle
} from 'lucide-react';

export default function Medicines() {
  const [orders, setOrders] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [formData, setFormData] = useState({
    family_member_id: '',
    medicines: '',
    delivery_address: '',
    prescription_file: null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordData, famData] = await Promise.all([
        api.getMedicineOrders(),
        api.getFamily()
      ]);
      setOrders(ordData || []);
      setFamilyMembers(famData || []);

      if (famData && famData.length > 0 && !formData.family_member_id) {
        setFormData(prev => ({
          ...prev,
          family_member_id: famData[0].id,
          delivery_address: famData[0].location
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
      delivery_address: member ? member.location : prev.delivery_address
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('family_member_id', formData.family_member_id);
      form.append('medicines', formData.medicines);
      form.append('delivery_address', formData.delivery_address);
      if (formData.prescription_file) {
        form.append('prescription_file', formData.prescription_file);
      }

      await api.createMedicineOrder(form);
      setShowOrderModal(false);
      setFormData({
        family_member_id: familyMembers[0]?.id || '',
        medicines: '',
        delivery_address: familyMembers[0]?.location || '',
        prescription_file: null
      });
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to submit medicine order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Licensed Pharmacy Coordination
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Medicine Assistance</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Upload doctor's prescription or specify prescribed medications. ApnoCare coordinates with certified local licensed pharmacies (Apollo, MedPlus) for door-step verified delivery.
          </p>
        </div>

        <button
          onClick={() => setShowOrderModal(true)}
          className="flex items-center space-x-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Request Medicines</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-800 leading-relaxed">
          <strong>Pharmacy Verification Policy:</strong> ApnoCare never independently dispenses or alters prescription drugs. Every prescription request is verified by licensed registered pharmacists before packaging.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Your Medicine Requests & Deliveries ({orders.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.length === 0 ? (
            <div className="col-span-2 bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              <Pill className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600 text-sm">No medicine requests yet</p>
              <p className="text-xs mt-1">Upload a prescription slip or order routine refills for your family.</p>
            </div>
          ) : (
            orders.map(order => (
              <div 
                key={order.id} 
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                      Order: {order.order_code}
                    </span>
                    <h4 className="font-bold text-base text-slate-900 mt-0.5">
                      For {order.patient_name}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold">
                    {order.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100">
                  <p><strong>Medicines:</strong> {order.medicines_list || 'Prescription Items'}</p>
                  <p className="text-slate-500"><strong>Coordinating Pharmacy:</strong> {order.pharmacy_name}</p>
                  <p className="text-slate-500 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
                    <span>{order.delivery_address}</span>
                  </p>
                </div>

                {order.prescription_url && (
                  <div className="pt-2">
                    <a 
                      href={order.prescription_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-teal-700 font-semibold hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Uploaded Prescription Slip</span>
                    </a>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total: ₹{order.total_amount || 650}</span>
                  <span className="text-[11px] text-teal-700 font-bold flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Estimated: Today
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Request Medicines */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Request Prescribed Medicines
            </h3>

            <form onSubmit={handleSubmitOrder} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Family Member *</label>
                <select
                  value={formData.family_member_id}
                  onChange={e => handlePatientSelect(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  {familyMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relation}) — {m.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prescription Upload (Photo or PDF)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={e => setFormData({ ...formData, prescription_file: e.target.files[0] })}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medicine Names & Quantities (if known)</label>
                <textarea
                  rows="3"
                  value={formData.medicines}
                  onChange={e => setFormData({ ...formData, medicines: e.target.value })}
                  placeholder="e.g. Telmisartan 40mg (30 tablets), Metformin 500mg (60 tablets)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={formData.delivery_address}
                  onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
                  placeholder="Home address for delivery"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {submitting ? 'Submitting...' : 'Submit Medicine Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
