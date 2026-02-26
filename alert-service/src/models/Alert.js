import mongoose from 'mongoose';

/**
 * Alert Schema - Defines the structure of alert documents
 * 
 * Schema defines:
 * - Which fields the document will have
 * - Data type of each field
 * - Which fields are required and which are optional
 * - Default values
 */

const alertSchema = new mongoose.Schema({
  // Alert type
  type: {
    type: String,
    required: [true, 'Alert type is required'],
    enum: ['pedestrian_detected', 'vehicle_approaching', 'obstruction', 'emergency', 'other'],
    default: 'other'
  },
  
  // Severity level
  severity: {
    type: String,
    required: [true, 'Severity level is required'],
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Alert location - reference to crosswalk
  crosswalkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crosswalk',
    required: false
  },
  
  // Alert description
  description: {
    type: String,
    required: false,
    maxlength: 500
  },
  
  // Additional AI data (flexible JSON)
  aiData: {
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    detectedObjects: [{
      type: {
        type: String
      },
      position: {
        x: Number,
        y: Number
      },
      confidence: Number
    }],
    imageUrl: String,
    videoTimestamp: Date
  },
  
  // Alert status
  status: {
    type: String,
    enum: ['active', 'resolved', 'dismissed'],
    default: 'active'
  },
  
  // Alert creation time
  timestamp: {
    type: Date,
    default: Date.now
  },
  
  // Alert resolution time
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for fast retrieval by time and severity
alertSchema.index({ timestamp: -1, severity: -1 });

/**
 * Model - A class that enables CRUD operations on the collection
 * 
 * Model enables:
 * - Alert.create() - Create a new alert
 * - Alert.find() - Find alerts
 * - Alert.findById() - Find by ID
 * - Alert.updateOne() - Update an alert
 * - Alert.deleteOne() - Delete an alert
 */

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
