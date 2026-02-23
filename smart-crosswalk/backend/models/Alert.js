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
    },
    data: {
      type: Buffer,
      required: false,
      select: false // Exclude from default queries to avoid loading large binary
    },
    contentType: {
      type: String,
      required: false
    }
  }

}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      // For binary-stored images, provide URL to fetch from /api/alerts/:id/photo
      if (ret.detectionPhoto?.contentType && !ret.detectionPhoto?.url) {
        ret.detectionPhoto.url = `/api/alerts/${ret._id}/photo`;
      }
      return ret;
    }
  }
});

// Indexes for better query performance - per specification
alertSchema.index({ crosswalkId: 1, timestamp: -1 });
alertSchema.index({ timestamp: -1 }); // For YOLO-only alerts

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
