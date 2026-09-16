const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('apnocare_token');
  const headers = {
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, set Content-Type to JSON
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.detail || (typeof data === 'string' ? data : 'API Request failed');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login/', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => apiRequest('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me/'),
  updateProfile: (data) => apiRequest('/auth/me/', { method: 'PUT', body: JSON.stringify(data) }),
  applyRepresentative: (data) => apiRequest('/auth/representative/apply/', { method: 'POST', body: JSON.stringify(data) }),

  // Family
  getFamily: () => apiRequest('/family/'),
  getFamilyMember: (id) => apiRequest(`/family/${id}/`),
  createFamilyMember: (data) => apiRequest('/family/', { method: 'POST', body: JSON.stringify(data) }),
  updateFamilyMember: (id, data) => apiRequest(`/family/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFamilyMember: (id) => apiRequest(`/family/${id}/`, { method: 'DELETE' }),

  // Healthcare
  getDoctors: (params = '') => apiRequest(`/healthcare/doctors/${params ? `?${params}` : ''}`),
  getDoctor: (id) => apiRequest(`/healthcare/doctors/${id}/`),
  getHospitals: (params = '') => apiRequest(`/healthcare/hospitals/${params ? `?${params}` : ''}`),
  getHospital: (id) => apiRequest(`/healthcare/hospitals/${id}/`),
  getCategories: () => apiRequest('/healthcare/categories/'),

  // Appointments
  getAppointments: (params = '') => apiRequest(`/appointments/${params ? `?${params}` : ''}`),
  createAppointment: (data) => apiRequest('/appointments/', { method: 'POST', body: JSON.stringify(data) }),
  cancelAppointment: (id, reason) => apiRequest(`/appointments/${id}/`, { method: 'PUT', body: JSON.stringify({ action: 'cancel', reason }) }),

  // Care Requests (Flagship)
  getCareRequests: () => apiRequest('/care/requests/'),
  getCareRequest: (id) => apiRequest(`/care/requests/${id}/`),
  createCareRequest: (data) => apiRequest('/care/requests/', { method: 'POST', body: JSON.stringify(data) }),
  updateCareStatus: (id, data) => apiRequest(`/care/requests/${id}/update-status/`, { method: 'POST', body: JSON.stringify(data) }),
  uploadCareDocument: (id, formData) => apiRequest(`/care/requests/${id}/upload-document/`, { method: 'POST', body: formData }),
  getRepAssigned: () => apiRequest('/care/representative/assigned/'),
  respondCareRequest: (id, action) => apiRequest(`/care/requests/${id}/respond/`, { method: 'POST', body: JSON.stringify({ action }) }),

  // Medicines
  getMedicineOrders: () => apiRequest('/medicines/'),
  createMedicineOrder: (formData) => apiRequest('/medicines/', { method: 'POST', body: formData }),

  // Diagnostics
  getDiagnosticCatalog: () => apiRequest('/diagnostics/catalog/'),
  getDiagnosticBookings: () => apiRequest('/diagnostics/bookings/'),
  createDiagnosticBooking: (data) => apiRequest('/diagnostics/bookings/', { method: 'POST', body: JSON.stringify(data) }),

  // Health Records Vault & Timeline
  getHealthRecords: (params = '') => apiRequest(`/health-records/${params ? `?${params}` : ''}`),
  uploadHealthRecord: (formData) => apiRequest('/health-records/', { method: 'POST', body: formData }),
  getHealthTimeline: (params = '') => apiRequest(`/health-records/timeline/${params ? `?${params}` : ''}`),

  // Notifications
  getNotifications: () => apiRequest('/notifications/'),
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read/`, { method: 'PUT' }),
  markAllNotificationsRead: () => apiRequest('/notifications/mark-all-read/', { method: 'PUT' }),

  // Payments
  checkoutPayment: (data) => apiRequest('/payments/checkout/', { method: 'POST', body: JSON.stringify(data) }),
  getPaymentHistory: () => apiRequest('/payments/history/'),

  // AI Assistant
  askAI: (data) => apiRequest('/ai/chat/', { method: 'POST', body: JSON.stringify(data) }),

  // Admin Portal
  getAdminStats: () => apiRequest('/admin-portal/overview/'),
  getAdminReps: () => apiRequest('/admin-portal/representatives/'),
  verifyRep: (id, status) => apiRequest(`/admin-portal/representatives/${id}/`, { method: 'PUT', body: JSON.stringify({ verification_status: status }) }),
  getAdminCareRequests: () => apiRequest('/admin-portal/care-requests/'),
  manageAdminCareRequest: (id, data) => apiRequest(`/admin-portal/care-requests/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
};
