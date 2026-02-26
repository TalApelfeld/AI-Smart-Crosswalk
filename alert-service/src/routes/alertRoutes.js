import express from 'express';
import alertController from '../controllers/alertController.js';

const router = express.Router();

/**
 * Routes - Define API endpoints
 */

// POST /api/ai/alerts - Create new alert from AI Service
router.post('/ai/alerts', alertController.createAlert);

// GET /api/alerts - Get all alerts
router.get('/alerts', alertController.getAlerts);

// GET /api/alerts/:id - Get single alert
router.get('/alerts/:id', alertController.getAlertById);

// PATCH /api/alerts/:id - Update alert status
router.patch('/alerts/:id', alertController.updateAlertStatus);

export default router;
