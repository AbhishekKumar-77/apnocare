import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT auth token & demo user header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('apnocare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const demoUserId = localStorage.getItem('apnocare_demo_user_id');
    if (demoUserId) {
      config.headers['x-demo-user-id'] = demoUserId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional auto-logout or notification
      console.warn('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

// System Health & Catalog
export const getSystemHealth = async () => (await api.get('/health')).data;
export const getServicesList = async () => (await api.get('/services')).data;

// Authentication & Persona Switching
export const getDemoPersonas = async () => (await api.get('/auth/demo-accounts')).data;
export const loginUser = async (credentials) => (await api.post('/auth/login', credentials)).data;
export const registerUser = async (userData) => (await api.post('/auth/register', userData)).data;
export const getCurrentUser = async () => (await api.get('/auth/me')).data;

// Patients / Family Members
export const getPatients = async () => (await api.get('/patients')).data;
export const getPatientById = async (id) => (await api.get(`/patients/${id}`)).data;
export const createPatient = async (patientData) => (await api.post('/patients', patientData)).data;
export const updatePatient = async (id, patientData) => (await api.put(`/patients/${id}`, patientData)).data;

// Service Requests & Milestones
export const getServiceRequests = async (params) => (await api.get('/requests', { params })).data;
export const getServiceRequestById = async (id) => (await api.get(`/requests/${id}`)).data;
export const createServiceRequest = async (requestData) => (await api.post('/requests', requestData)).data;
export const updateRequestMilestone = async (id, milestoneData) => (await api.post(`/requests/${id}/milestone`, milestoneData)).data;
export const assignRepresentative = async (id, representativeId) => (await api.post(`/requests/${id}/assign`, { representativeId })).data;

// Representative Portal
export const getRepTasks = async () => (await api.get('/representative/tasks')).data;
export const updateTaskStep = async (id, stepData) => (await api.post(`/representative/tasks/${id}/step`, stepData)).data;

// Admin Portal
export const getAdminStats = async () => (await api.get('/admin/analytics')).data;
export const getAdminRepresentatives = async () => (await api.get('/admin/representatives')).data;
export const verifyRepresentative = async (id, payload) => (await api.put(`/admin/representatives/${id}/verify`, payload)).data;
export const getAdminPartners = async () => (await api.get('/admin/partners')).data;
export const createPartner = async (partnerData) => (await api.post('/admin/partners', partnerData)).data;
export const getServiceAreas = async () => (await api.get('/admin/service-areas')).data;
export const joinWaitlist = async (data) => (await api.post('/admin/waitlist', data)).data;
export const getAdminAuditLogs = async () => (await api.get('/admin/audit-logs')).data;

// Health Records & Family Sharing
export const getHealthRecords = async (params) => (await api.get('/records', { params })).data;
export const uploadHealthRecord = async (recordData) => (await api.post('/records', recordData)).data;
export const getFamilyShares = async () => (await api.get('/records/shares')).data;
export const inviteFamilyShare = async (data) => (await api.post('/records/shares', data)).data;

// In-App Notifications
export const getNotifications = async () => (await api.get('/notifications')).data;
export const markNotificationRead = async (id) => (await api.put(`/notifications/${id}/read`)).data;
export const markAllNotificationsRead = async () => (await api.put('/notifications/read-all')).data;

export default api;
