import axios from 'axios';

// Di production (server yang sama), pakai relative URL (kosong)
// Di development, bisa set VITE_API_BASE_URL=http://localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Biarkan axios handle Content-Type otomatis (FormData -> multipart/form-data)
  if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export default api;
