import {
  initialFamily,
  initialDoctors,
  initialHospitals,
  initialCareRequests,
  initialAppointments,
  initialTimeline,
  initialHealthRecords,
  initialDiagnostics,
  initialMedicines,
  initialPharmacyCatalog,
  initialVitals,
  initialNotifications,
  initialAdminStats,
  initialAdminReps
} from './mockData';

const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_BASE = envUrl ? (envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl) : '/api';

// Helper to get / set from localStorage with fallback
function getLocalStore(key, fallback) {
  try {
    const item = localStorage.getItem('apnocare_' + key);
    if (!item) {
      localStorage.setItem('apnocare_' + key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
}

function setLocalStore(key, data) {
  try {
    localStorage.setItem('apnocare_' + key, JSON.stringify(data));
  } catch (e) {}
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('apnocare_token');
  const headers = {
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // If no backend configured and running on Vercel/static, throw early so mock catches
  const hasConfiguredBackend = !!envUrl && !envUrl.includes('localhost:5173');
  const isLocalhostDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (!hasConfiguredBackend && !isLocalhostDev) {
    throw new Error('No backend URL configured in static deployment — using mock mode');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  // Check if response returned HTML (like Vercel SPA rewrite fallback) instead of JSON
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Non-JSON response received from server');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.detail || (typeof data === 'string' ? data : 'API Request failed');
    throw new Error(errorMsg);
  }

  return data;
}

// Wrapper that runs real API or falls back cleanly to mock data
async function withFallback(apiCall, mockFallback) {
  try {
    return await apiCall();
  } catch (err) {
    // Graceful fallback to mock data so application never crashes
    return typeof mockFallback === 'function' ? mockFallback() : mockFallback;
  }
}

export const api = {
  // Auth
  login: async (credentials) => {
    return withFallback(
      () => apiRequest('/auth/login/', { method: 'POST', body: JSON.stringify(credentials) }),
      () => {
        const email = (credentials.email || 'abhishek@apnocare.com').toLowerCase();
        const role = email.includes('admin') ? 'admin' : (email.includes('care') || email.includes('rep')) ? 'care_representative' : 'family_user';
        return {
          token: 'apnocare_demo_token_' + role,
          user: {
            _id: 'user_' + role,
            id: 'user_' + role,
            name: role === 'admin' ? 'ApnoCare Ops Admin' : role === 'care_representative' ? 'Rajesh Kumar' : 'Abhishek Sharma',
            email: credentials.email || 'abhishek@apnocare.com',
            role: role,
            phone: role === 'care_representative' ? '+91 98722 34567' : '+1 (647) 555-0192',
            location: role === 'care_representative' ? 'Model Town, Jalandhar' : 'Toronto, Canada (Family in Jalandhar, Punjab)'
          }
        };
      }
    );
  },

  register: async (data) => {
    return withFallback(
      () => apiRequest('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
      () => ({
        token: 'apnocare_token_reg_' + Date.now(),
        user: {
          _id: 'user_reg_' + Date.now(),
          id: 'user_reg_' + Date.now(),
          name: data.name || 'New Member',
          email: data.email || 'user@apnocare.com',
          role: data.role || 'family_user',
          phone: data.phone || '+91 98000 00000',
          location: data.location || 'Jalandhar, Punjab'
        }
      })
    );
  },

  getMe: async () => {
    return withFallback(
      () => apiRequest('/auth/me/'),
      () => {
        const saved = localStorage.getItem('apnocare_user');
        if (saved) {
          try { return JSON.parse(saved); } catch (e) {}
        }
        return {
          _id: 'user_abhishek',
          id: 'user_abhishek',
          name: 'Abhishek Sharma',
          email: 'abhishek@apnocare.com',
          role: 'family_user',
          phone: '+1 (647) 555-0192',
          location: 'Toronto, Canada (Family in Jalandhar, Punjab)'
        };
      }
    );
  },

  updateProfile: (data) => withFallback(() => apiRequest('/auth/me/', { method: 'PUT', body: JSON.stringify(data) }), data),
  applyRepresentative: (data) => withFallback(() => apiRequest('/auth/representative/apply/', { method: 'POST', body: JSON.stringify(data) }), { success: true }),

  // Family
  getFamily: async () => {
    return withFallback(
      () => apiRequest('/family/'),
      () => getLocalStore('family', initialFamily)
    );
  },

  getFamilyMember: async (id) => {
    return withFallback(
      () => apiRequest(`/family/${id}/`),
      () => {
        const list = getLocalStore('family', initialFamily);
        return list.find(m => m.id === id || m._id === id) || list[0];
      }
    );
  },

  createFamilyMember: async (data) => {
    return withFallback(
      () => apiRequest('/family/', { method: 'POST', body: JSON.stringify(data) }),
      () => {
        const list = getLocalStore('family', initialFamily);
        const newMember = { ...data, _id: 'fam_' + Date.now(), id: 'fam_' + Date.now() };
        list.push(newMember);
        setLocalStore('family', list);
        return newMember;
      }
    );
  },

  updateFamilyMember: async (id, data) => {
    return withFallback(
      () => apiRequest(`/family/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
      () => {
        const list = getLocalStore('family', initialFamily);
        const idx = list.findIndex(m => m.id === id || m._id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...data };
          setLocalStore('family', list);
          return list[idx];
        }
        return data;
      }
    );
  },

  deleteFamilyMember: async (id) => {
    return withFallback(
      () => apiRequest(`/family/${id}/`, { method: 'DELETE' }),
      () => {
        const list = getLocalStore('family', initialFamily);
        const filtered = list.filter(m => m.id !== id && m._id !== id);
        setLocalStore('family', filtered);
        return { success: true };
      }
    );
  },

  // Healthcare
  getDoctors: async (params = '') => {
    return withFallback(
      () => apiRequest(`/healthcare/doctors/${params ? `?${params}` : ''}`),
      () => initialDoctors
    );
  },

  getDoctor: async (id) => {
    return withFallback(
      () => apiRequest(`/healthcare/doctors/${id}/`),
      () => initialDoctors.find(d => d.id === id || d._id === id) || initialDoctors[0]
    );
  },

  getHospitals: async (params = '') => {
    return withFallback(
      () => apiRequest(`/healthcare/hospitals/${params ? `?${params}` : ''}`),
      () => initialHospitals
    );
  },

  getHospital: async (id) => {
    return withFallback(
      () => apiRequest(`/healthcare/hospitals/${id}/`),
      () => initialHospitals.find(h => h.id === id || h._id === id) || initialHospitals[0]
    );
  },

  getCategories: async () => {
    return withFallback(
      () => apiRequest('/healthcare/categories/'),
      () => ({
        specialties: ['General Physician', 'Cardiologist', 'Orthopedic Surgeon', 'Neurologist', 'Diabetologist', 'Gastroenterologist'],
        cities: ['Jalandhar', 'Ludhiana', 'Amritsar', 'Chandigarh', 'Delhi NCR']
      })
    );
  },

  // Appointments
  getAppointments: async (params = '') => {
    return withFallback(
      () => apiRequest(`/appointments/${params ? `?${params}` : ''}`),
      () => getLocalStore('appointments', initialAppointments)
    );
  },

  createAppointment: async (data) => {
    return withFallback(
      () => apiRequest('/appointments/', { method: 'POST', body: JSON.stringify(data) }),
      () => {
        const list = getLocalStore('appointments', initialAppointments);
        const newAppt = {
          _id: 'appt_' + Date.now(),
          id: 'appt_' + Date.now(),
          status: 'confirmed',
          created_at: new Date().toISOString(),
          ...data
        };
        list.unshift(newAppt);
        setLocalStore('appointments', list);
        return newAppt;
      }
    );
  },

  cancelAppointment: async (id, reason) => {
    return withFallback(
      () => apiRequest(`/appointments/${id}/`, { method: 'PUT', body: JSON.stringify({ action: 'cancel', reason }) }),
      () => {
        const list = getLocalStore('appointments', initialAppointments);
        const idx = list.findIndex(a => a.id === id || a._id === id);
        if (idx !== -1) {
          list[idx].status = 'cancelled';
          list[idx].cancellation_reason = reason;
          setLocalStore('appointments', list);
          return list[idx];
        }
        return { success: true };
      }
    );
  },

  rescheduleAppointment: async (id, newDate, newSlot) => {
    return withFallback(
      () => apiRequest(`/appointments/${id}/`, { method: 'PUT', body: JSON.stringify({ action: 'reschedule', appointment_date: newDate, appointment_time: newSlot }) }),
      () => {
        const list = getLocalStore('appointments', initialAppointments);
        const idx = list.findIndex(a => a.id === id || a._id === id);
        if (idx !== -1) {
          list[idx].appointment_date = newDate;
          list[idx].appointment_time = newSlot;
          list[idx].status = 'confirmed';
          setLocalStore('appointments', list);
          return list[idx];
        }
        return { success: true };
      }
    );
  },

  attachCareAssociateToAppointment: async (id) => {
    return withFallback(
      () => apiRequest(`/appointments/${id}/`, { method: 'PUT', body: JSON.stringify({ action: 'attach_companion' }) }),
      () => {
        const list = getLocalStore('appointments', initialAppointments);
        const idx = list.findIndex(a => a.id === id || a._id === id);
        if (idx !== -1) {
          list[idx].accompanied_by_rep = true;
          list[idx].representative_name = 'Rajesh Kumar';
          list[idx].representative_phone = '+91 98722 34567';
          setLocalStore('appointments', list);
          return list[idx];
        }
        return { success: true };
      }
    );
  },

  // Care Requests (Flagship)
  getCareRequests: async () => {
    return withFallback(
      () => apiRequest('/care/requests/'),
      () => getLocalStore('care_requests', initialCareRequests)
    );
  },

  getCareRequest: async (id) => {
    return withFallback(
      () => apiRequest(`/care/requests/${id}/`),
      () => {
        const list = getLocalStore('care_requests', initialCareRequests);
        return list.find(r => r.id === id || r._id === id || r.request_code === id) || list[0];
      }
    );
  },

  createCareRequest: async (data) => {
    return withFallback(
      () => apiRequest('/care/requests/', { method: 'POST', body: JSON.stringify(data) }),
      () => {
        const list = getLocalStore('care_requests', initialCareRequests);
        const newReq = {
          _id: 'care_' + Date.now(),
          id: 'care_' + Date.now(),
          request_code: 'CARE-' + Math.floor(100000 + Math.random() * 900000),
          status: 'assigned',
          representative_name: 'Rajesh Kumar',
          representative_phone: '+91 98722 34567',
          representative_rating: 4.95,
          representative_photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          timeline: [
            {
              stage: 'requested',
              title: 'Care Request Created',
              timestamp: new Date().toISOString(),
              notes: 'Care request placed successfully.'
            },
            {
              stage: 'assigned',
              title: 'Care Associate Rajesh Kumar Assigned',
              timestamp: new Date().toISOString(),
              notes: 'Verified local representative matched nearby.'
            }
          ],
          uploaded_documents: [],
          created_at: new Date().toISOString(),
          ...data
        };
        list.unshift(newReq);
        setLocalStore('care_requests', list);
        return newReq;
      }
    );
  },

  updateCareStatus: async (id, data) => {
    return withFallback(
      () => apiRequest(`/care/requests/${id}/update-status/`, { method: 'POST', body: JSON.stringify(data) }),
      () => {
        const list = getLocalStore('care_requests', initialCareRequests);
        const idx = list.findIndex(r => r.id === id || r._id === id);
        if (idx !== -1) {
          list[idx].status = data.status || list[idx].status;
          if (data.notes || data.title) {
            list[idx].timeline = list[idx].timeline || [];
            list[idx].timeline.push({
              stage: data.status,
              title: data.title || 'Status Updated',
              timestamp: new Date().toISOString(),
              notes: data.notes || ''
            });
          }
          setLocalStore('care_requests', list);
          return list[idx];
        }
        return data;
      }
    );
  },

  uploadCareDocument: async (id, formData) => {
    return withFallback(
      () => apiRequest(`/care/requests/${id}/upload-document/`, { method: 'POST', body: formData }),
      () => ({ success: true })
    );
  },

  getRepAssigned: async () => {
    return withFallback(
      () => apiRequest('/care/representative/assigned/'),
      () => {
        const list = getLocalStore('care_requests', initialCareRequests);
        return list;
      }
    );
  },

  respondCareRequest: async (id, action) => {
    return withFallback(
      () => apiRequest(`/care/requests/${id}/respond/`, { method: 'POST', body: JSON.stringify({ action }) }),
      () => ({ success: true, action })
    );
  },

  // Medicines
  getPharmacyCatalog: async () => {
    return withFallback(
      () => apiRequest('/medicines/catalog/'),
      () => initialPharmacyCatalog
    );
  },

  getMedicineOrders: async () => {
    return withFallback(
      () => apiRequest('/medicines/'),
      () => getLocalStore('medicines', initialMedicines)
    );
  },

  createMedicineOrder: async (formData) => {
    return withFallback(
      () => apiRequest('/medicines/', { method: 'POST', body: formData }),
      () => {
        const list = getLocalStore('medicines', initialMedicines);
        const newOrder = {
          _id: 'med_' + Date.now(),
          id: 'med_' + Date.now(),
          patient_name: 'Jaswant Kaur',
          order_code: 'MED-' + Math.floor(1000 + Math.random() * 9000),
          items: [{ name: 'Prescribed Medications Order', qty: 1, price: 450 }],
          total_amount: 450,
          status: 'confirmed',
          ordered_at: new Date().toISOString()
        };
        list.unshift(newOrder);
        setLocalStore('medicines', list);
        return newOrder;
      }
    );
  },

  // Diagnostics
  getDiagnosticCatalog: async () => {
    return withFallback(
      () => apiRequest('/diagnostics/catalog/'),
      () => initialDiagnostics
    );
  },

  getDiagnosticBookings: async () => {
    return withFallback(
      () => apiRequest('/diagnostics/bookings/'),
      () => getLocalStore('diag_bookings', [
        {
          _id: 'db_1',
          id: 'db_1',
          test_name: 'HbA1c & Fasting Sugar',
          patient_name: 'Harbhajan Singh',
          scheduled_date: new Date().toISOString().split('T')[0],
          status: 'sample_collected',
          lab_partner: 'Apollo Diagnostics'
        }
      ])
    );
  },

  createDiagnosticBooking: async (data) => {
    return withFallback(
      () => apiRequest('/diagnostics/bookings/', { method: 'POST', body: JSON.stringify(data) }),
      () => {
        const list = getLocalStore('diag_bookings', []);
        const newBooking = { _id: 'db_' + Date.now(), id: 'db_' + Date.now(), status: 'confirmed', ...data };
        list.unshift(newBooking);
        setLocalStore('diag_bookings', list);
        return newBooking;
      }
    );
  },

  // Health Records Vault & Timeline
  getHealthRecords: async (params = '') => {
    return withFallback(
      () => apiRequest(`/health-records/${params ? `?${params}` : ''}`),
      () => getLocalStore('health_records', initialHealthRecords)
    );
  },

  uploadHealthRecord: async (formData) => {
    return withFallback(
      () => apiRequest('/health-records/', { method: 'POST', body: formData }),
      () => {
        const list = getLocalStore('health_records', initialHealthRecords);
        const newRec = {
          _id: 'hr_' + Date.now(),
          id: 'hr_' + Date.now(),
          title: 'Uploaded Medical Document',
          record_type: 'Prescription',
          doctor_name: 'Consulting Physician',
          hospital_name: 'Medical Centre',
          date: new Date().toISOString().split('T')[0],
          file_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
          created_at: new Date().toISOString()
        };
        list.unshift(newRec);
        setLocalStore('health_records', list);
        return newRec;
      }
    );
  },

  getHealthTimeline: async (params = '') => {
    return withFallback(
      () => apiRequest(`/health-records/timeline/${params ? `?${params}` : ''}`),
      () => initialTimeline
    );
  },

  // Vitals Tracker
  getVitals: async (memberId = null) => {
    return withFallback(
      () => apiRequest(`/health-records/vitals/${memberId ? `?family_member_id=${memberId}` : ''}`),
      () => {
        const list = getLocalStore('vitals', initialVitals);
        if (memberId && memberId !== 'all') {
          return list.filter(v => v.family_member_id === memberId);
        }
        return list;
      }
    );
  },

  addVitalLog: async (vitalData) => {
    return withFallback(
      () => apiRequest('/health-records/vitals/', { method: 'POST', body: JSON.stringify(vitalData) }),
      () => {
        const list = getLocalStore('vitals', initialVitals);
        const newVital = {
          id: 'v_' + Date.now(),
          date: 'Just now',
          ...vitalData
        };
        list.unshift(newVital);
        setLocalStore('vitals', list);
        return newVital;
      }
    );
  },

  // Notifications
  getNotifications: async () => {
    return withFallback(
      () => apiRequest('/notifications/'),
      () => getLocalStore('notifications', initialNotifications)
    );
  },

  markNotificationRead: async (id) => {
    return withFallback(
      () => apiRequest(`/notifications/${id}/read/`, { method: 'PUT' }),
      () => {
        const list = getLocalStore('notifications', initialNotifications);
        const item = list.find(n => n.id === id);
        if (item) item.read = true;
        setLocalStore('notifications', list);
        return { success: true };
      }
    );
  },

  markAllNotificationsRead: async () => {
    return withFallback(
      () => apiRequest('/notifications/mark-all-read/', { method: 'PUT' }),
      () => {
        const list = getLocalStore('notifications', initialNotifications);
        list.forEach(n => n.read = true);
        setLocalStore('notifications', list);
        return { success: true };
      }
    );
  },

  // Payments
  checkoutPayment: async (data) => {
    return withFallback(
      () => apiRequest('/payments/checkout/', { method: 'POST', body: JSON.stringify(data) }),
      () => ({ status: 'success', transaction_id: 'TXN_' + Date.now() })
    );
  },

  getPaymentHistory: async () => {
    return withFallback(
      () => apiRequest('/payments/history/'),
      () => [
        { id: 'p1', date: '2026-09-20', description: 'Doctor Visit Care Assistance', amount: 1200, status: 'paid' },
        { id: 'p2', date: '2026-09-15', description: 'Monthly Pharmacy Refill', amount: 305, status: 'paid' }
      ]
    );
  },

  // AI Assistant
  askAI: async (data) => {
    return withFallback(
      () => apiRequest('/ai/chat/', { method: 'POST', body: JSON.stringify(data) }),
      () => {
        const query = (data.query || '').toLowerCase();
        let response = "I'm here to assist your family with healthcare in Punjab. You can schedule doctor appointments, request care representatives, or order prescriptions.";
        let action = null;

        if (query.includes('doctor') || query.includes('physician') || query.includes('cardiologist')) {
          response = "I found verified top doctors in Jalandhar. Dr. Rajiv Sharma (General Physician at Tagore Hospital) is available for consultation today.";
          action = { type: 'FIND_DOCTOR', parameters: { specialty: 'General Physician' } };
        } else if (query.includes('care') || query.includes('accompany') || query.includes('help') || query.includes('mother')) {
          response = "I can arrange a verified Care Representative to physically accompany your loved one to the hospital and coordinate all queues and medicines.";
          action = { type: 'REQUEST_CARE', parameters: { patient_name: 'Jaswant Kaur' } };
        } else if (query.includes('medicine') || query.includes('tablet') || query.includes('prescription')) {
          response = "You can order doorstep medicine delivery or refill recurring prescriptions for your parents.";
          action = { type: 'ORDER_MEDICINE' };
        } else if (query.includes('emergency') || query.includes('chest pain') || query.includes('unconscious')) {
          response = "⚠️ Emergency guidance: Please contact Tagore Hospital 24/7 ER immediately at 0181-2244225 or call 108/112 for ambulance services.";
        }

        return {
          response,
          action,
          is_emergency: query.includes('emergency')
        };
      }
    );
  },

  // Admin Portal
  getAdminStats: async () => {
    return withFallback(
      () => apiRequest('/admin-portal/overview/'),
      () => initialAdminStats
    );
  },

  getAdminReps: async () => {
    return withFallback(
      () => apiRequest('/admin-portal/representatives/'),
      () => getLocalStore('admin_reps', initialAdminReps)
    );
  },

  verifyRep: async (id, status) => {
    return withFallback(
      () => apiRequest(`/admin-portal/representatives/${id}/`, { method: 'PUT', body: JSON.stringify({ verification_status: status }) }),
      () => {
        const list = getLocalStore('admin_reps', initialAdminReps);
        const rep = list.find(r => r.id === id || r._id === id);
        if (rep) rep.verification_status = status;
        setLocalStore('admin_reps', list);
        return rep;
      }
    );
  },

  getAdminCareRequests: async () => {
    return withFallback(
      () => apiRequest('/admin-portal/care-requests/'),
      () => getLocalStore('care_requests', initialCareRequests)
    );
  },

  manageAdminCareRequest: async (id, data) => {
    return withFallback(
      () => apiRequest(`/admin-portal/care-requests/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
      () => data
    );
  }
};
