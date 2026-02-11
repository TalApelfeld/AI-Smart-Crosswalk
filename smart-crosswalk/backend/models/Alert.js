import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  crosswalkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crosswalk',
    required: false, // Made optional for YOLO detections
    default: null
  },

  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },

  dangerLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    required: false, // Made optional, will default to MEDIUM
    default: 'MEDIUM'
  },

  detectionPhoto: {
    url: {
      type: String,
      required: false
    }
  }

}, {
  timestamps: true
});

// Indexes for better query performance - per specification
alertSchema.index({ crosswalkId: 1, timestamp: -1 });
alertSchema.index({ timestamp: -1 }); // For YOLO-only alerts

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
