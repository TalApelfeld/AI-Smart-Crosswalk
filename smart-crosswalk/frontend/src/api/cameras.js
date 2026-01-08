import api from './config';

export const camerasApi = {
  // Get all cameras
  getAll: async (params = {}) => {
    return api.get('/cameras', { params });
  },

  // Get single camera
  getById: async (id) => {
    return api.get(`/cameras/${id}`);
  },

  // Create camera
  create: async (data) => {
    return api.post('/cameras', data);
  },

  // Update camera status
  updateStatus: async (id, status) => {
    return api.patch(`/cameras/${id}/status`, { status });
  },

  // Delete camera
  delete: async (id) => {
    return api.delete(`/cameras/${id}`);
  }
};
