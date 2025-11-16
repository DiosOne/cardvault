import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'http://192.168.4.30:5000/api'
    : 'http://localhost:5000/api');

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
