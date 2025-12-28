import express from 'express';
import crosswalkController from '../controllers/crosswalkController.js';

const router = express.Router();

/**
 * Crosswalk Routes - Define API endpoints for crosswalk management
 */

// GET /api/crosswalks - Get all crosswalks
router.get('/', crosswalkController.getCrosswalks);

// GET /api/crosswalks/:id - Get single crosswalk
router.get('/:id', crosswalkController.getCrosswalkById);

// POST /api/crosswalks - Create new crosswalk
router.post('/', crosswalkController.createCrosswalk);

// PATCH /api/crosswalks/:id - Update crosswalk
router.patch('/:id', crosswalkController.updateCrosswalk);

// DELETE /api/crosswalks/:id - Delete crosswalk
router.delete('/:id', crosswalkController.deleteCrosswalk);

// POST /api/crosswalks/:id/led/activate - Manually activate LED system
router.post('/:id/led/activate', crosswalkController.activateLED);

// POST /api/crosswalks/:id/led/deactivate - Manually deactivate LED system
router.post('/:id/led/deactivate', crosswalkController.deactivateLED);

// GET /api/crosswalks/:id/led/status - Get LED system status
router.get('/:id/led/status', crosswalkController.getLEDStatus);

export default router;
