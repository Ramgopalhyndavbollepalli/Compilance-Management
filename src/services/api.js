// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://54.172.6.232:5000';
console.log(API_BASE_URL);
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

// Add a request interceptor to include Authorization header from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');  // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API function definitions
export const fetchUsers = () => api.get('/users');
export const addUser = (userData) => api.post('/users', userData);
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

export const createPolicy = (policyData, accessToken) => {
  return api.post('/policies', policyData, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
};

export const updatePolicy = (policyId, policyData, accessToken) => {
  return api.put(`/policies/${policyId}`, policyData, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
};

export const deletePolicy = (policyId, accessToken) => {
  return api.delete(`/policies/${policyId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
  });
};
export const fetchDashboardMetrics = () => api.get('/dashboard-metrics');
export const fetchAuditLogs = () => api.get('/audit-logs');
export const fetchNotifications = () => api.get('/notifications');
export const generateReport = (reportData) => api.post('/reports', reportData);

export const getUserSettings = () => api.get('/user/settings');
export const updateUserSettings = (settingsData) => api.put('/user/settings', settingsData);

export default api;
