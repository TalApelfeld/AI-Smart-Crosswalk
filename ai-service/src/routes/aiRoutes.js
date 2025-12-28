import express from 'express';
import aiController from '../controllers/aiController.js';

const router = express.Router();

/**
 * AI Service Routes
 */

// POST /api/ai/analyze - Analyze image with AI model
router.post('/analyze', aiController.analyzeImage);

// GET /api/ai/status - Get AI model status
router.get('/status', aiController.getStatus);

export default router;
