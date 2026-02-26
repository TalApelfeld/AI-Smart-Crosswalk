import mongoose from 'mongoose';

const falsePredictionSchema = new mongoose.Schema({
  modelVersion: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  trainingImageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingImage',
    required: false
  },
  sourceCamera: {
    type: String,
    required: true
  },
  sourceCrosswalkId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  detectedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  predictionType: {
    type: String,
    enum: ['false_positive', 'false_negative', 'misclassification'],
    required: true
  },
  predictedClass: {
    type: String,
    required: false // Null for false negatives
  },
  actualClass: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: false
  },
  boundingBox: {
    x: { type: Number, required: false },
    y: { type: Number, required: false },
    width: { type: Number, required: false },
    height: { type: Number, required: false }
  },
  reportedBy: {
    type: String,
    required: true,
    enum: ['user', 'auto_validation', 'human_review']
  },
  reporterUserId: {
    type: String,
    required: false
  },
  verifiedBy: {
    type: String,
    required: false
  },
  verifiedAt: {
    type: Date,
    required: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  correctionApplied: {
    type: Boolean,
    default: false
  },
  addedToTrainingSet: {
    type: Boolean,
    default: false
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  impactDescription: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Indexes
falsePredictionSchema.index({ modelVersion: 1, detectedAt: -1 });
falsePredictionSchema.index({ predictionType: 1 });
falsePredictionSchema.index({ sourceCamera: 1, detectedAt: -1 });
falsePredictionSchema.index({ isVerified: 1, addedToTrainingSet: 1 });
falsePredictionSchema.index({ severity: 1 });

export default mongoose.model('FalsePrediction', falsePredictionSchema);
