import express from 'express';
import mlDataController from '../controllers/mlDataController.js';

const router = express.Router();

// Training Images Routes
router.post('/training-images', mlDataController.addTrainingImage);
router.get('/training-images', mlDataController.getTrainingImages);
router.put('/training-images/:id', mlDataController.updateTrainingImage);

// False Predictions Routes
router.post('/false-predictions', mlDataController.addFalsePrediction);
router.get('/false-predictions', mlDataController.getFalsePredictions);

// Model Metrics Routes
router.post('/model-metrics', mlDataController.addModelMetrics);
router.get('/model-metrics', mlDataController.getModelMetrics);
router.get('/model-metrics/:version', mlDataController.getModelVersionMetrics);

// Statistics Dashboard
router.get('/statistics', mlDataController.getMLStatistics);

export default router;
