import Alert from '../models/Alert.js';

export const alertService = {
  // Get all alerts with optional filters
  async getAll(filters = {}) {
    const query = {};
    
    if (filters.dangerLevel) query.dangerLevel = filters.dangerLevel;
    if (filters.crosswalkId) query.crosswalkId = filters.crosswalkId;

    return Alert.find(query)
      .populate('crosswalkId', 'location')
      .sort({ timestamp: -1 });
  },

  // Get single alert by ID
  async getById(id) {
    return Alert.findById(id)
      .populate('crosswalkId', 'location');
  },

  // Create new alert (immutable event)
  async create(data) {
    const alert = new Alert(data);
    return alert.save();
  },

  // Get alert statistics
  async getStats() {
    const [total, low, medium, high] = await Promise.all([
      Alert.countDocuments(),
      Alert.countDocuments({ dangerLevel: 'LOW' }),
      Alert.countDocuments({ dangerLevel: 'MEDIUM' }),
      Alert.countDocuments({ dangerLevel: 'HIGH' })
    ]);

    return { total, low, medium, high };
  }
};
