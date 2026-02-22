import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data: any) => api.post('/api/auth/register', data),
  login: (data: any) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

export const listings = {
  create: (data: any) => api.post('/api/listings', data),
  getAll: (params?: any) => api.get('/api/listings', { params }),
  getOne: (id: number) => api.get(`/api/listings/${id}`),
  update: (id: number, data: any) => api.put(`/api/listings/${id}`, data),
  delete: (id: number) => api.delete(`/api/listings/${id}`),
  getMy: () => api.get('/api/my-listings'),
};

export const buyRequests = {
  create: (data: any) => api.post('/api/buy-requests', data),
  getAll: () => api.get('/api/buy-requests'),
  update: (id: number, data: any) => api.put(`/api/buy-requests/${id}`, data),
};

export const admin = {
  getStats: () => api.get('/api/admin/stats'),
};

export default api;
