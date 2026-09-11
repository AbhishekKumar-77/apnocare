import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

export const getSystemHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getServicesList = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const submitInquiry = async (inquiryData) => {
  const response = await api.post('/inquiries', inquiryData);
  return response.data;
};

export const getInquiriesList = async () => {
  const response = await api.get('/inquiries');
  return response.data;
};

export default api;
