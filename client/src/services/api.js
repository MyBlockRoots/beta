import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const register = (userData) => {
  return api.post('/register', userData);
};

export const login = (credentials) => {
  return api.post('/login', credentials);
};

// Family tree services
export const uploadGedcom = (formData) => {
  return api.post('/upload-gedcom', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAllFamilyTrees = () => {
  return api.get('/family-trees');
};

export const getFamilyTree = (id) => {
  return api.get(`/family-trees/${id}`);
};

export const saveToBlockchain = (treeId) => {
  return api.post(`/save-to-blockchain/${treeId}`);
};

export default api; 