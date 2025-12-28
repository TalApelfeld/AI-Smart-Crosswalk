import mongoose from 'mongoose';

const boundingBoxSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
    enum: ['person', 'vehicle', 'bicycle', 'motorcycle', 'other']
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  bbox: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  }
});

const trainingImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  imageData: {
    type: String,
    required: false // Optional: store base64 or reference to storage
  },
  sourceCamera: {
    type: String,
    required: true
  },
  sourceCrosswalkId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  capturedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  labeledAt: {
    type: Date,
    required: false
  },
  labeledBy: {
    type: String,
    required: false // User ID or 'auto' for automated labeling
  },
  labels: [boundingBoxSchema],
  modelPredictions: [boundingBoxSchema],
  isValidated: {
    type: Boolean,
    default: false
  },
  validationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'needs_review'],
    default: 'pending'
  },
  metadata: {
    imageWidth: Number,
    imageHeight: Number,
    format: String,
    fileSize: Number
  },
  usedForTraining: {
    type: Boolean,
    default: false
  },
  trainingEpoch: {
    type: Number,
    required: false
  },
  notes: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
trainingImageSchema.index({ capturedAt: -1 });
trainingImageSchema.index({ sourceCamera: 1, capturedAt: -1 });
trainingImageSchema.index({ validationStatus: 1 });
trainingImageSchema.index({ isValidated: 1, usedForTraining: 1 });

export default mongoose.model('TrainingImage', trainingImageSchema);
