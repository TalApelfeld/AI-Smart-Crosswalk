import Crosswalk from '../models/Crosswalk.js';

export const crosswalkService = {
  // Get all crosswalks
  async getAll(filters = {}) {
    return Crosswalk.find()
      .populate('cameraId')
      .populate('ledId')
      .sort({ createdAt: -1 });
  },

  // Get single crosswalk by ID
  async getById(id) {
    return Crosswalk.findById(id)
      .populate('cameraId')
      .populate('ledId');
  },

  // Create new crosswalk
  async create(data) {
    const crosswalk = new Crosswalk(data);
    return crosswalk.save();
  },

  // Update crosswalk
  async update(id, data) {
    return Crosswalk.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    })
      .populate('cameraId')
      .populate('ledId');
  },

  // Delete crosswalk
  async delete(id) {
    return Crosswalk.findByIdAndDelete(id);
  },

  // Get crosswalk statistics
  async getStats() {
    const total = await Crosswalk.countDocuments();
    return { total };
  }
};
