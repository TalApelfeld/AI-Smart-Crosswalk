import express from 'express';
import asyncHandler from 'express-async-handler';
import { crosswalkService } from '../services/index.js';

const router = express.Router();

// GET /api/crosswalks - Get all crosswalks
router.get('/', asyncHandler(async (req, res) => {
  const crosswalks = await crosswalkService.getAll();
  
  res.json({
    success: true,
    count: crosswalks.length,
    data: crosswalks
  });
}));

// GET /api/crosswalks/stats - Get crosswalk statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await crosswalkService.getStats();
  
  res.json({
    success: true,
    data: stats
  });
}));

// GET /api/crosswalks/:id - Get single crosswalk
router.get('/:id', asyncHandler(async (req, res) => {
  const crosswalk = await crosswalkService.getById(req.params.id);
  
  if (!crosswalk) {
    res.status(404);
    throw new Error('Crosswalk not found');
  }
  
  res.json({
    success: true,
    data: crosswalk
  });
}));

// POST /api/crosswalks - Create crosswalk
router.post('/', asyncHandler(async (req, res) => {
  const { location, cameraId, ledId } = req.body;

  // Validation
  if (!location?.city || !location?.street || !location?.number || !cameraId || !ledId) {
    res.status(400);
    throw new Error('Missing required fields: location.city, location.street, location.number, cameraId, ledId');
  }

  const crosswalk = await crosswalkService.create(req.body);
  
  res.status(201).json({
    success: true,
    data: crosswalk
  });
}));

// PATCH /api/crosswalks/:id - Update crosswalk
router.patch('/:id', asyncHandler(async (req, res) => {
  const crosswalk = await crosswalkService.update(req.params.id, req.body);
  
  if (!crosswalk) {
    res.status(404);
    throw new Error('Crosswalk not found');
  }
  
  res.json({
    success: true,
    data: crosswalk
  });
}));

// DELETE /api/crosswalks/:id - Delete crosswalk
router.delete('/:id', asyncHandler(async (req, res) => {
  const crosswalk = await crosswalkService.delete(req.params.id);
  
  if (!crosswalk) {
    res.status(404);
    throw new Error('Crosswalk not found');
  }
  
  res.json({
    success: true,
    message: 'Crosswalk deleted successfully'
  });
}));

export default router;
