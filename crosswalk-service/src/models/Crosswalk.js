import mongoose from 'mongoose';

/**
 * Crosswalk Schema - Defines the structure of crosswalk documents
 */

const crosswalkSchema = new mongoose.Schema({
  // Crosswalk name
  name: {
    type: String,
    required: [true, 'Crosswalk name is required'],
    trim: true
  },
  
  // Location - address
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true,
      default: 'Israel'
    },
    coordinates: {
      latitude: {
        type: Number,
        required: false
      },
      longitude: {
        type: Number,
        required: false
      }
    }
  },
  
  // Camera URL
  cameraUrl: {
    type: String,
    required: [true, 'Camera URL is required'],
    validate: {
      validator: function(v) {
        return /^(http|https|rtsp):\/\//.test(v);
      },
      message: 'Please provide a valid camera URL'
    }
  },
  
  // Camera status
  cameraStatus: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'online'
  },
  
  // LED Control System
  ledSystem: {
    // URL endpoint to trigger LED lights
    controlUrl: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          return !v || /^(http|https):\/\//.test(v);
        },
        message: 'Please provide a valid LED control URL'
      }
    },
    // LED system status
    status: {
      type: String,
      enum: ['operational', 'malfunction', 'disabled'],
      default: 'operational'
    },
    // LED activation method (REST API, MQTT, WebSocket, etc.)
    activationMethod: {
      type: String,
      enum: ['http_post', 'http_get', 'mqtt', 'websocket', 'gpio'],
      default: 'http_post'
    },
    // Authentication for LED system (if needed)
    authentication: {
      apiKey: String,
      username: String,
      token: String
    },
    // LED patterns configuration
    patterns: {
      warning: {
        color: {
          type: String,
          default: 'yellow'
        },
        flashRate: {
          type: Number,
          default: 2 // flashes per second
        },
        duration: {
          type: Number,
          default: 10 // seconds
        }
      },
      danger: {
        color: {
          type: String,
          default: 'red'
        },
        flashRate: {
          type: Number,
          default: 4 // flashes per second
        },
        duration: {
          type: Number,
          default: 15 // seconds
        }
      },
      safe: {
        color: {
          type: String,
          default: 'green'
        },
        flashRate: {
          type: Number,
          default: 0 // solid, no flashing
        },
        duration: {
          type: Number,
          default: 5 // seconds
        }
      }
    },
    // Last activation info
    lastActivation: {
      timestamp: Date,
      pattern: String,
      success: Boolean,
      responseTime: Number // milliseconds
    }
  },
  
  // Additional details
  details: {
    type: {
      type: String,
      enum: ['standard', 'smart', 'traffic_light'],
      default: 'standard'
    },
    width: Number, // Crosswalk width in meters
    lanes: Number, // Number of lanes
    hasTrafficLight: {
      type: Boolean,
      default: false
    },
    hasLEDWarningSystem: {
      type: Boolean,
      default: false
    },
    averageDailyPedestrians: Number
  },
  
  // Image Storage & Statistics
  imageData: {
    lastImageUrl: String,          // URL to most recent image
    lastImageTimestamp: Date,      // When last image was received
    totalImagesProcessed: {
      type: Number,
      default: 0
    },
    lastDetections: [{             // Most recent AI detections
      type: {
        type: String
      },
      confidence: Number,
      timestamp: Date
    }],
    detectionStats: {
      totalPedestrians: { type: Number, default: 0 },
      totalVehicles: { type: Number, default: 0 },
      totalChildren: { type: Number, default: 0 },
      totalBicycles: { type: Number, default: 0 }
    }
  },
  
  // Is active
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Notes
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Index for searching by location
crosswalkSchema.index({ 'location.city': 1, 'location.address': 1 });

const Crosswalk = mongoose.model('Crosswalk', crosswalkSchema);

export default Crosswalk;
