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
  AlertTriangle,
  Search,
  ShoppingCart,
  Trash2,
  RefreshCw,
  Truck,
  Check,
  X,
  Phone,
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';

export default function Medicines() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'orders'
  const [catalog, setCatalog] = useState([]);
  const [orders, setOrders] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Catalog search & category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Cart state
  const [cart, setCart] = useState([
    { id: 'rx_1', name: 'Telmisartan 40mg (Telma 40)', price: 180, qty: 1, strip_size: 'Strip of 30 Tablets' },
    { id: 'rx_4', name: 'Shelcal 500 (Calcium + D3)', price: 240, qty: 1, strip_size: 'Bottle of 60 Tablets' }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRecurringRefill, setIsRecurringRefill] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('House 142, Sector 2, Model Town, Jalandhar');

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    family_member_id: '',
    notes: '',
    prescription_file: null
  });

  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catData, ordData, famData] = await Promise.all([
        api.getPharmacyCatalog(),
        api.getMedicineOrders(),
        api.getFamily()
      ]);
      setCatalog(catData || []);
      setOrders(ordData || []);
      setFamilyMembers(famData || []);

      if (famData && famData.length > 0 && !selectedPatientId) {
        setSelectedPatientId(famData[0].id);
        setDeliveryAddress(famData[0].location || 'House 142, Sector 2, Model Town, Jalandhar');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, strip_size: product.strip_size }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeCartItem = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const refillDiscount = isRecurringRefill ? Math.round(cartSubtotal * 0.15) : 0;
  const deliveryFee = cartSubtotal >= 500 ? 0 : 50;
  const cartTotal = Math.max(0, cartSubtotal - refillDiscount + deliveryFee);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your medicine cart is empty.");
      return;
    }

    const patient = familyMembers.find(f => f.id === selectedPatientId) || familyMembers[0];
    const generatedOrderCode = 'MED-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder = {
      _id: 'med_' + Date.now(),
      id: 'med_' + Date.now(),
      order_code: generatedOrderCode,
      patient_name: patient?.name || 'Jaswant Kaur',
      delivery_rider: 'Baljeet Singh (+91 98111 22334)',
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      total_amount: cartTotal,
      status: 'in_transit',
      delivery_address: deliveryAddress,
      ordered_at: new Date().toISOString(),
      estimated_delivery: 'Tomorrow, by 12:00 PM',
      is_recurring: isRecurringRefill,
      next_refill_date: isRecurringRefill ? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] : null
    };

    try {
      const savedOrders = JSON.parse(localStorage.getItem('apnocare_medicines') || '[]');
      savedOrders.unshift(newOrder);
      localStorage.setItem('apnocare_medicines', JSON.stringify(savedOrders));

      setOrders(savedOrders);
      setCart([]);
      setIsCartOpen(false);
      setTrackingOrder(newOrder);
      setActiveTab('orders');
    } catch (e) {
      alert("Failed to place order.");
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    const patient = familyMembers.find(f => f.id === uploadData.family_member_id) || familyMembers[0];
    const newOrder = {
      _id: 'med_' + Date.now(),
      id: 'med_' + Date.now(),
      order_code: 'MED-RX' + Math.floor(100 + Math.random() * 900),
      patient_name: patient?.name || 'Jaswant Kaur',
      delivery_rider: 'Assigning nearest pharmacy partner...',
      items: [{ name: 'Prescription Review in Progress: ' + (uploadData.notes || 'Routine Refill'), qty: 1, price: 350 }],
      total_amount: 350,
      status: 'processing',
      delivery_address: patient?.location || deliveryAddress,
      ordered_at: new Date().toISOString(),
      estimated_delivery: 'Pharmacist verification within 30 mins',
      is_recurring: false
    };

    const savedOrders = JSON.parse(localStorage.getItem('apnocare_medicines') || '[]');
    savedOrders.unshift(newOrder);
    localStorage.setItem('apnocare_medicines', JSON.stringify(savedOrders));

    setOrders(savedOrders);
    setShowUploadModal(false);
    setActiveTab('orders');
  };

  const categories = [
    'All',
    'Chronic - Blood Pressure',
    'Chronic - Diabetes',
    'Chronic - Heart & Cholesterol',
    'Joints & Bone Health',
    'Daily Wellness & Immunity',
    'Medical Devices & Monitors'
  ];

  const filteredCatalog = catalog.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-purple-200 mb-3 border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>Doorstep Genuine Pharmacy • Jalandhar & Punjab</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">Prescription Medicines & Refills</h1>
            <p className="text-xs sm:text-sm text-purple-100/80 mt-1 max-w-xl leading-relaxed">
              Order verified daily medications for your parents with automated 30-day recurring refills, senior citizen discounts, and temperature-controlled home delivery.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Prescription Slip</span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cart.length})</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'catalog' ? 'bg-white text-violet-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Medicine Catalog & Devices
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-violet-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Orders & Refills ({orders.length})
          </button>
        </div>

        {/* Refill Guarantee Badge */}
        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500">
          <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin-slow" />
          <span>30-Day Automated Refills active for Parents in Model Town</span>
        </div>
      </div>

      {/* ── TAB 1: CATALOG VIEW ── */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by medicine name, brand, or salt (e.g. Telmisartan, Metformin, Shelcal, BP Monitor)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-violet-500 focus:bg-white"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map(item => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <div 
                  key={item.id} 
                  className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="flex items-start space-x-3">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-violet-700 tracking-wider block">
                          {item.brand}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 leading-snug mt-0.5">{item.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.strip_size}</p>
                      </div>
                    </div>

                    <div className="mt-3.5 space-y-1 text-xs text-slate-600">
                      <p className="text-[11px] text-slate-500 line-clamp-1"><strong>Salt:</strong> {item.salt}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1"><strong>Dosage:</strong> {item.dosage}</p>
                    </div>

                    {item.requires_rx && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200">
                        Prescription Required (Rx)
                      </span>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900">₹{item.price}</span>
                      {item.mrp && <span className="text-[11px] text-slate-400 line-through ml-1.5">₹{item.mrp}</span>}
                    </div>

                    {inCart ? (
                      <div className="flex items-center space-x-2 bg-violet-50 rounded-xl p-1 border border-violet-200">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white text-violet-800 font-bold flex items-center justify-center shadow-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-violet-900 px-1">{inCart.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-violet-600 text-white font-bold flex items-center justify-center shadow-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: ORDERS VIEW ── */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map(ord => {
              const isDelivered = ord.status === 'delivered';
              const isInTransit = ord.status === 'in_transit';

              return (
                <div 
                  key={ord.id} 
                  className="glass-card rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-violet-700 uppercase tracking-wider">
                          Order ID: {ord.order_code}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 mt-0.5">For {ord.patient_name}</h3>
                        <p className="text-xs text-slate-400">
                          Placed on {new Date(ord.ordered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isDelivered ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isInTransit ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {ord.status?.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span>{it.qty}x {it.name}</span>
                          <span className="font-semibold text-slate-900">₹{it.price * it.qty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                      <p className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
                        <span className="truncate">{ord.delivery_address}</span>
                      </p>
                      {ord.delivery_rider && (
                        <p className="flex items-center text-slate-700 font-medium">
                          <Truck className="w-3.5 h-3.5 text-violet-600 mr-1.5 shrink-0" />
                          <span>Rider: {ord.delivery_rider}</span>
                        </p>
                      )}
                      {ord.is_recurring && (
                        <p className="flex items-center text-teal-700 font-semibold text-[11px]">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          <span>Next auto-refill: {ord.next_refill_date || 'In 25 days'}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Billed</span>
                      <span className="text-base font-extrabold text-slate-900">₹{ord.total_amount}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setTrackingOrder(ord)}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Shipment</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CART SIDEBAR / DRAWER ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white max-w-md w-full h-full p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-violet-600" />
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Your Medicine Basket</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">Your basket is empty. Select medicines from the catalog.</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                        <p className="text-[11px] text-slate-400">₹{item.price} each • {item.strip_size}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1.5 bg-white rounded-lg p-1 border border-slate-200">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-5 h-5 text-xs font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-900 px-1">{item.qty}</span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="w-5 h-5 text-xs font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Delivery Address & Patient */}
              {cart.length > 0 && (
                <div className="mt-6 space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Delivering to Family Member in Punjab:</label>
                    <select
                      value={selectedPatientId}
                      onChange={e => {
                        setSelectedPatientId(e.target.value);
                        const mem = familyMembers.find(f => f.id === e.target.value);
                        if (mem) setDeliveryAddress(mem.location);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    >
                      {familyMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.relation}) — {m.location}</option>
                      ))}
                    </select>
                  </div>

                  {/* 30-Day Auto-Refill Toggle */}
                  <div className={`p-4 rounded-2xl border-2 transition ${
                    isRecurringRefill ? 'border-teal-500 bg-teal-50/70' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2.5">
                        <RefreshCw className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900">Automate Monthly Refill?</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Auto-dispatches every 30 days so your parents never miss a dose. Includes 15% Senior Discount.
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isRecurringRefill}
                        onChange={e => setIsRecurringRefill(e.target.checked)}
                        className="w-5 h-5 text-teal-600 rounded cursor-pointer mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary & Checkout */}
            {cart.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                {isRecurringRefill && (
                  <div className="flex justify-between text-teal-700 font-semibold">
                    <span>15% Senior Refill Savings:</span>
                    <span>-₹{refillDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Doorstep Delivery:</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span>₹{cartTotal}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-3 py-3 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer transition flex items-center justify-center space-x-2"
                >
                  <span>Confirm Doorstep Order (₹{cartTotal})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 5-STAGE SHIPMENT TRACKER MODAL ── */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setTrackingOrder(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-bold text-violet-700 mb-1">
              <Truck className="w-4 h-4" />
              <span>LIVE DELIVERY TRACKER • {trackingOrder.order_code}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Prescription Order for {trackingOrder.patient_name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Destined to: {trackingOrder.delivery_address}</p>

            {/* 5-Stage Stepper */}
            <div className="my-6 space-y-4 text-xs">
              {[
                { title: 'Order Received & Digital Prescription Checked', desc: 'Verified by Registered Pharmacist', done: true },
                { title: 'Medicines Dispensed from Temperature-Controlled Stock', desc: 'Batch & expiry checked', done: true },
                { title: 'Sealed & Packed with Tamper-Proof ApnoCare Bag', desc: 'Dispatched to delivery partner', done: true },
                { title: 'Out for Doorstep Delivery with Local Rider', desc: `Rider: ${trackingOrder.delivery_rider}`, done: trackingOrder.status === 'in_transit' || trackingOrder.status === 'delivered', current: trackingOrder.status === 'in_transit' },
                { title: 'Safely Handed to Family Member at Home', desc: 'Signature / OTP confirmed', done: trackingOrder.status === 'delivered' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${step.current ? 'text-violet-700' : 'text-slate-900'}`}>{step.title}</p>
                    <p className="text-slate-400 text-[11px]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-violet-50/60 rounded-2xl border border-violet-100 text-xs space-y-1.5">
              <p className="font-bold text-violet-900">Order Summary:</p>
              {trackingOrder.items?.map((it, i) => (
                <p key={i} className="text-slate-600">{it.qty}x {it.name}</p>
              ))}
              <p className="font-bold text-slate-900 pt-1 border-t border-violet-200/60">Total Paid: ₹{trackingOrder.total_amount}</p>
            </div>

            <div className="mt-6 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center justify-center space-x-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD PRESCRIPTION SLIP MODAL ── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 font-heading">Upload Prescription Slip</h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload a doctor’s handwritten prescription or clinic slip. Our licensed pharmacist will review it, verify dosages, and prepare the medicines for delivery.
            </p>

            <form onSubmit={handlePrescriptionSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient:</label>
                <select
                  value={uploadData.family_member_id}
                  onChange={e => setUploadData({ ...uploadData, family_member_id: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  {familyMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Prescription Photo / PDF:</label>
                <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center hover:border-violet-500 cursor-pointer bg-slate-50">
                  <Upload className="w-8 h-8 mx-auto text-violet-600 mb-2" />
                  <p className="font-bold text-slate-700">Click to choose image or drag & drop</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG, or PDF up to 10MB</p>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Special Instructions (Optional):</label>
                <textarea
                  rows={2}
                  value={uploadData.notes}
                  onChange={e => setUploadData({ ...uploadData, notes: e.target.value })}
                  placeholder="E.g. Send 30 days supply, call before delivery, deliver in morning..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Submit for Review ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
