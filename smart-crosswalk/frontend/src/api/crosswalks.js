import api from './config';

export const crosswalksApi = {
  // Get all crosswalks
  getAll: async (params = {}) => {
    return api.get('/crosswalks', { params });
  },

  // Get single crosswalk
  getById: async (id) => {
    return api.get(`/crosswalks/${id}`);
  },

  // Create crosswalk
  create: async (data) => {
    return api.post('/crosswalks', data);
  },

  // Update crosswalk
  update: async (id, data) => {
    return api.patch(`/crosswalks/${id}`, data);
  },

  // Delete crosswalk
  delete: async (id) => {
    return api.delete(`/crosswalks/${id}`);
  },

  // Get statistics
  getStats: async () => {
    return api.get('/crosswalks/stats');
  }
};
