import mongoose from 'mongoose';

const classMetricsSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true
  },
  precision: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  recall: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  f1Score: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  truePositives: {
    type: Number,
    required: true,
    default: 0
  },
  falsePositives: {
    type: Number,
    required: true,
    default: 0
  },
  falseNegatives: {
    type: Number,
    required: true,
    default: 0
  }
});

const modelMetricsSchema = new mongoose.Schema({
  modelVersion: {
    type: String,
    required: true,
    unique: true
  },
  modelType: {
    type: String,
    required: true,
    default: 'YOLO'
  },
  trainingStartedAt: {
    type: Date,
    required: true
  },
  trainingCompletedAt: {
    type: Date,
    required: true
  },
  trainingDuration: {
    type: Number, // Duration in seconds
    required: true
  },
  epochs: {
    type: Number,
    required: true
  },
  batchSize: {
    type: Number,
    required: true
  },
  learningRate: {
    type: Number,
    required: true
  },
  trainingDatasetSize: {
    type: Number,
    required: true
  },
  validationDatasetSize: {
    type: Number,
    required: true
  },
  overallMetrics: {
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    meanAveragePrecision: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    inferenceTime: {
      type: Number, // Average time in milliseconds
      required: true
    }
  },
  classMetrics: [classMetricsSchema],
  lossHistory: [{
    epoch: Number,
    trainingLoss: Number,
    validationLoss: Number
  }],
  hyperparameters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  hardwareUsed: {
    type: String,
    required: false
  },
  isProduction: {
    type: Boolean,
    default: false
  },
  deployedAt: {
    type: Date,
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
modelMetricsSchema.index({ modelVersion: 1 });
modelMetricsSchema.index({ trainingCompletedAt: -1 });
modelMetricsSchema.index({ isProduction: 1 });
modelMetricsSchema.index({ 'overallMetrics.meanAveragePrecision': -1 });

export default mongoose.model('ModelMetrics', modelMetricsSchema);
