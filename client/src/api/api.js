import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'http://192.168.4.30:5000/api'
    : 'http://localhost:5000/api');

const API = axios.create({
  baseURL,
});

/**
 * Attach the stored auth token to outbound requests when present.
 * @param {import('axios').InternalAxiosRequestConfig} config
 * @returns {import('axios').InternalAxiosRequestConfig}
 */
const attachAuthToken= (config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

/**
 * Pass through successful responses without mutation.
 * @param {import('axios').AxiosResponse} response
 * @returns {import('axios').AxiosResponse}
 */
const passthroughResponse= (response) => response;

/**
 * Log API errors and rethrow so callers can handle them.
 * @param {unknown} error
 * @returns {Promise<never>}
 */
const handleApiError= (error) => {
  console.error('API error:', error?.message || error);
  return Promise.reject(error);
};

API.interceptors.request.use(attachAuthToken);
API.interceptors.response.use(passthroughResponse, handleApiError);

export default API;
