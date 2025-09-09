import axios from 'axios';
import { authStore } from '../store/auth';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // URL backend Anda
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = authStore.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;