import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  crosswalkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crosswalk',
    required: [true, 'Crosswalk ID is required']
  },

  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },

  dangerLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    required: [true, 'Danger level is required']
  },

  detectionPhoto: {
    url: {
      type: String,
      required: [true, 'Photo URL is required']
    }
  }

}, {
  timestamps: true
});

// Indexes for better query performance - per specification
alertSchema.index({ crosswalkId: 1, timestamp: -1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
