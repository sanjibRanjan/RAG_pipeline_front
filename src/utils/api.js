import axios from 'axios';
import { auth } from './firebase';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 60000, // 60 seconds timeout for document processing
});

// Request interceptor to add Firebase ID token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    } catch (error) {
      console.error('Failed to get ID token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - user needs to re-authenticate
      console.warn('Authentication error - user needs to log in again');
      // You could trigger a logout here if needed
      // But for now, just let the component handle the error
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  verifyToken: () => api.post('/api/auth/verify'),
  getProfile: () => api.get('/api/auth/me'),
};

export const qaAPI = {
  ask: (data) => api.post('/api/qa/ask', data),
};

export const documentsAPI = {
  upload: (formData) => api.post('/api/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000, // 2 minutes for upload (including file transfer)
  }),
  ingest: (data) => api.post('/api/documents/ingest', data, {
    timeout: 300000, // 5 minutes for ingestion (processing can be slow)
  }),
};

export const conversationsAPI = {
  getConversation: (id) => api.get(`/api/conversations/${id}`),
  deleteConversation: (id) => api.delete(`/api/conversations/${id}`),
};

export const userAPI = {
  getStats: () => api.get('/api/user/stats'),
  getDocuments: () => api.get('/api/user/documents'),
  deleteDocument: (id) => api.delete(`/api/user/documents/${id}`),
  clearData: () => api.post('/api/user/clear-data'),
  exportData: () => api.get('/api/user/export-data'),
};

export default api;
