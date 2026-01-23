import Crosswalk from '../models/Crosswalk.js';
import Camera from '../models/Camera.js';
import LED from '../models/LED.js';

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
  },

  // Link camera to crosswalk
  async linkCamera(crosswalkId, cameraId) {
    // Verify camera exists
    const camera = await Camera.findById(cameraId);
    if (!camera) {
      throw new Error('Camera not found');
    }

    return Crosswalk.findByIdAndUpdate(
      crosswalkId,
      { cameraId },
      { new: true, runValidators: true }
    )
      .populate('cameraId')
      .populate('ledId');
  },

  // Unlink camera from crosswalk
  async unlinkCamera(crosswalkId) {
    return Crosswalk.findByIdAndUpdate(
      crosswalkId,
      { $unset: { cameraId: 1 } },
      { new: true }
    )
      .populate('cameraId')
      .populate('ledId');
  },

  // Link LED to crosswalk
  async linkLED(crosswalkId, ledId) {
    // Verify LED exists
    const led = await LED.findById(ledId);
    if (!led) {
      throw new Error('LED not found');
    }

    return Crosswalk.findByIdAndUpdate(
      crosswalkId,
      { ledId },
      { new: true, runValidators: true }
    )
      .populate('cameraId')
      .populate('ledId');
  },

  // Unlink LED from crosswalk
  async unlinkLED(crosswalkId) {
    return Crosswalk.findByIdAndUpdate(
      crosswalkId,
      { $unset: { ledId: 1 } },
      { new: true }
    )
      .populate('cameraId')
      .populate('ledId');
  },

  // Search crosswalks
  async search(query, limit = 10) {
    if (!query || query.length < 2) {
      return [];
    }

    const searchRegex = new RegExp(query, 'i');
    
    return Crosswalk.find({
      $or: [
        { 'location.street': searchRegex },
        { 'location.city': searchRegex },
        { 'location.number': searchRegex }
      ]
    })
      .populate('cameraId')
      .populate('ledId')
      .limit(limit)
      .sort({ 'location.street': 1 });
  }
};
