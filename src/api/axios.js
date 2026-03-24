import axios from 'axios';

export const API_URL = 'https://hack-event-backend-ruby.vercel.app';
// const API_URL = 'http://localhost:5000'; // Uncomment for local development

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // If using cookies, ensure this is set. The API might use Bearer tokens instead.
});

// Assuming token might be stored in localStorage for this app
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
