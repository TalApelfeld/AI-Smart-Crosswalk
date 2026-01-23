import Alert from '../models/Alert.js';
import mongoose from 'mongoose';

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
  },

  // Update alert
  async update(id, data) {
    const alert = await Alert.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('crosswalkId', 'location');

    return alert;
  },

  // Delete alert
  async delete(id) {
    const alert = await Alert.findByIdAndDelete(id);
    return alert;
  },

  // Get alerts for specific crosswalk with filtering and pagination
  async getAlertsByCrosswalk(crosswalkId, filters = {}) {
    const query = { crosswalkId: new mongoose.Types.ObjectId(crosswalkId) };
    
    // Date range filter
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
      if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }
    
    // Danger level filter
    if (filters.dangerLevel && filters.dangerLevel !== 'all') {
      query.dangerLevel = filters.dangerLevel.toUpperCase();
    }
    
    // Sorting
    let sort = { timestamp: -1 }; // newest first (default)
    if (filters.sortBy === 'oldest') {
      sort = { timestamp: 1 };
    } else if (filters.sortBy === 'danger') {
      sort = { dangerLevel: -1, timestamp: -1 };
    }
    
    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Execute queries in parallel
    const [alerts, total] = await Promise.all([
      Alert.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('crosswalkId', 'location'),
      Alert.countDocuments(query)
    ]);
    
    return {
      alerts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    };
  },

  // Get statistics for specific crosswalk
  async getCrosswalkStats(crosswalkId) {
    const crosswalkObjectId = new mongoose.Types.ObjectId(crosswalkId);
    
    // Get total count and counts by danger level
    const [total, dangerStats, timeStats] = await Promise.all([
      Alert.countDocuments({ crosswalkId: crosswalkObjectId }),
      Alert.aggregate([
        { $match: { crosswalkId: crosswalkObjectId } },
        { $group: {
            _id: '$dangerLevel',
            count: { $sum: 1 }
          }
        }
      ]),
      Alert.aggregate([
        { $match: { crosswalkId: crosswalkObjectId } },
        {
          $facet: {
            last24Hours: [
              { $match: { timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } },
              { $count: 'count' }
            ],
            last7Days: [
              { $match: { timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
              { $count: 'count' }
            ],
            last30Days: [
              { $match: { timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
              { $count: 'count' }
            ]
          }
        }
      ])
    ]);
    
    // Format danger level stats
    const byDangerLevel = {
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    };
    dangerStats.forEach(stat => {
      byDangerLevel[stat._id] = stat.count;
    });
    
    // Extract time-based stats
    const last24Hours = timeStats[0]?.last24Hours[0]?.count || 0;
    const last7Days = timeStats[0]?.last7Days[0]?.count || 0;
    const last30Days = timeStats[0]?.last30Days[0]?.count || 0;
    
    return {
      total,
      byDangerLevel,
      last24Hours,
      last7Days,
      last30Days
    };
  }
};
