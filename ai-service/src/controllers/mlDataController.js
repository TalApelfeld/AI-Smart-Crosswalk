import TrainingImage from '../models/TrainingImage.js';
import FalsePrediction from '../models/FalsePrediction.js';
import ModelMetrics from '../models/ModelMetrics.js';

/**
 * Add a new training image with labels
 */
const addTrainingImage = async (req, res) => {
  try {
    const trainingImage = new TrainingImage(req.body);
    const savedImage = await trainingImage.save();
    
    res.status(201).json({
      success: true,
      data: savedImage
    });
  } catch (error) {
    console.error('Error adding training image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get training images with filters
 */
const getTrainingImages = async (req, res) => {
  try {
    const {
      validationStatus,
      isValidated,
      usedForTraining,
      sourceCamera,
      limit = 50,
      skip = 0
    } = req.query;

    const filter = {};
    if (validationStatus) filter.validationStatus = validationStatus;
    if (isValidated !== undefined) filter.isValidated = isValidated === 'true';
    if (usedForTraining !== undefined) filter.usedForTraining = usedForTraining === 'true';
    if (sourceCamera) filter.sourceCamera = sourceCamera;

    const images = await TrainingImage.find(filter)
      .sort({ capturedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await TrainingImage.countDocuments(filter);

    res.json({
      success: true,
      data: images,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    console.error('Error fetching training images:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Update training image validation status
 */
const updateTrainingImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const image = await TrainingImage.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Training image not found'
      });
    }

    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error updating training image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Record a false prediction
 */
const addFalsePrediction = async (req, res) => {
  try {
    const falsePrediction = new FalsePrediction(req.body);
    const saved = await falsePrediction.save();

    res.status(201).json({
      success: true,
      data: saved
    });
  } catch (error) {
    console.error('Error recording false prediction:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get false predictions with filters
 */
const getFalsePredictions = async (req, res) => {
  try {
    const {
      modelVersion,
      predictionType,
      isVerified,
      severity,
      limit = 50,
      skip = 0
    } = req.query;

    const filter = {};
    if (modelVersion) filter.modelVersion = modelVersion;
    if (predictionType) filter.predictionType = predictionType;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (severity) filter.severity = severity;

    const predictions = await FalsePrediction.find(filter)
      .sort({ detectedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await FalsePrediction.countDocuments(filter);

    res.json({
      success: true,
      data: predictions,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    console.error('Error fetching false predictions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Save model training metrics
 */
const addModelMetrics = async (req, res) => {
  try {
    const metrics = new ModelMetrics(req.body);
    const saved = await metrics.save();

    res.status(201).json({
      success: true,
      data: saved
    });
  } catch (error) {
    console.error('Error saving model metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get all model versions with metrics
 */
const getModelMetrics = async (req, res) => {
  try {
    const { isProduction, limit = 20 } = req.query;

    const filter = {};
    if (isProduction !== undefined) filter.isProduction = isProduction === 'true';

    const metrics = await ModelMetrics.find(filter)
      .sort({ trainingCompletedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching model metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get specific model version metrics
 */
const getModelVersionMetrics = async (req, res) => {
  try {
    const { version } = req.params;

    const metrics = await ModelMetrics.findOne({ modelVersion: version });

    if (!metrics) {
      return res.status(404).json({
        success: false,
        error: 'Model version not found'
      });
    }

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching model version metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get ML statistics dashboard
 */
const getMLStatistics = async (req, res) => {
  try {
    const totalTrainingImages = await TrainingImage.countDocuments();
    const validatedImages = await TrainingImage.countDocuments({ isValidated: true });
    const usedForTraining = await TrainingImage.countDocuments({ usedForTraining: true });
    const pendingValidation = await TrainingImage.countDocuments({ validationStatus: 'pending' });

    const totalFalsePredictions = await FalsePrediction.countDocuments();
    const falsePositives = await FalsePrediction.countDocuments({ predictionType: 'false_positive' });
    const falseNegatives = await FalsePrediction.countDocuments({ predictionType: 'false_negative' });
    const unverifiedPredictions = await FalsePrediction.countDocuments({ isVerified: false });

    const totalModels = await ModelMetrics.countDocuments();
    const productionModels = await ModelMetrics.countDocuments({ isProduction: true });
    const latestModel = await ModelMetrics.findOne().sort({ trainingCompletedAt: -1 });

    res.json({
      success: true,
      data: {
        trainingData: {
          total: totalTrainingImages,
          validated: validatedImages,
          usedForTraining,
          pendingValidation
        },
        falsePredictions: {
          total: totalFalsePredictions,
          falsePositives,
          falseNegatives,
          unverified: unverifiedPredictions
        },
        models: {
          total: totalModels,
          inProduction: productionModels,
          latestVersion: latestModel?.modelVersion || 'none',
          latestMAP: latestModel?.overallMetrics?.meanAveragePrecision || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching ML statistics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export default {
  addTrainingImage,
  getTrainingImages,
  updateTrainingImage,
  addFalsePrediction,
  getFalsePredictions,
  addModelMetrics,
  getModelMetrics,
  getModelVersionMetrics,
  getMLStatistics
};
