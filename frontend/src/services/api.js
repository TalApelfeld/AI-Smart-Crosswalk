import axios from 'axios';

/**
 * API Service - Communicates with the API Gateway
 * 
 * This file centralizes all HTTP requests using Axios
 * All requests now go through the API Gateway (port 8000)
 */

// Base URL for the API Gateway
const BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for adding auth tokens in the future)
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization headers here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for handling errors globally)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * API Methods
 */

const api = {
  // Get all alerts with optional filters
  getAlerts: async (params = {}) => {
    try {
      const response = await apiClient.get('/alerts', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single alert by ID
  getAlertById: async (id) => {
    try {
      const response = await apiClient.get(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new alert (from AI)
  createAlert: async (alertData) => {
    try {
      const response = await apiClient.post('/ai/alerts', alertData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update alert status
  updateAlertStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/alerts/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all crosswalks
  getCrosswalks: async () => {
    try {
      const response = await apiClient.get('/crosswalks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get crosswalk by ID
  getCrosswalkById: async (id) => {
    try {
      const response = await apiClient.get(`/crosswalks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get camera status
  getCameraStatus: async (crosswalkId) => {
    try {
      const response = await apiClient.get(`/camera/status/${crosswalkId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get image URL
  getImageUrl: (imageId) => {
    return `${BASE_URL}/images/${imageId}`;
  },

  // AI Analysis
  analyzeImage: async (imageData) => {
    try {
      const response = await apiClient.post('/ai/analyze', imageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get AI status
  getAIStatus: async () => {
    try {
      const response = await apiClient.get('/ai/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
