import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Banners API
export const bannersAPI = {
  getAll: (activeOnly = false) => 
    api.get(`/banners${activeOnly ? '?active=true' : ''}`),
  
  getById: (id) => 
    api.get(`/banners/${id}`),
  
  create: (bannerData) => 
    api.post('/banners', bannerData),
  
  update: (id, bannerData) => 
    api.put(`/banners/${id}`, bannerData),
  
  delete: (id) => 
    api.delete(`/banners/${id}`),
};

export default api;
