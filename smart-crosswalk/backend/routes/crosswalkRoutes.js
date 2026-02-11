import express from 'express';
import asyncHandler from 'express-async-handler';
import { crosswalkService, alertService } from '../services/index.js';

const router = express.Router();

// GET /api/crosswalks/search - Search crosswalks
router.get('/search', asyncHandler(async (req, res) => {
  const { q, limit } = req.query;

  if (!q) {
    res.status(400);
    throw new Error('Query parameter "q" is required');
  }

  const results = await crosswalkService.search(q, limit ? parseInt(limit) : 10);
  
  res.json({
    success: true,
    count: results.length,
    data: results
  });
}));

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

// GET /api/crosswalks/:id/alerts - Get alerts for specific crosswalk
router.get('/:id/alerts', asyncHandler(async (req, res) => {
  const { startDate, endDate, dangerLevel, sortBy, limit, page } = req.query;
  
  const result = await alertService.getAlertsByCrosswalk(req.params.id, {
    startDate,
    endDate,
    dangerLevel,
    sortBy,
    limit,
    page
  });
  
  const crosswalk = await crosswalkService.getById(req.params.id);
  
  if (!crosswalk) {
    res.status(404);
    throw new Error('Crosswalk not found');
  }
  
  res.json({
    success: true,
    crosswalk: {
      _id: crosswalk._id,
      location: crosswalk.location
    },
    alerts: result.alerts,
    pagination: {
      currentPage: result.page,
      totalPages: result.totalPages,
      totalAlerts: result.total,
      hasMore: result.hasMore
    }
  });
}));

// GET /api/crosswalks/:id/stats - Get statistics for specific crosswalk
router.get('/:id/stats', asyncHandler(async (req, res) => {
  const stats = await alertService.getCrosswalkStats(req.params.id);
  
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
  const { location } = req.body;

  // Validation - only location is required, camera and LED are optional
  if (!location?.city || !location?.street || !location?.number) {
    res.status(400);
    throw new Error('Missing required fields: location.city, location.street, location.number');
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

// PATCH /api/crosswalks/:id/camera - Link camera to crosswalk
router.patch('/:id/camera', asyncHandler(async (req, res) => {
  const { cameraId } = req.body;

  if (!cameraId) {
    res.status(400);
    throw new Error('cameraId is required');
  }

  const crosswalk = await crosswalkService.linkCamera(req.params.id, cameraId);
  
  if (!crosswalk) {
    res.status(404);
    throw new Error('Crosswalk not found');
  }
  
  res.json({
    success: true,
    message: 'Camera linked successfully',
    data: crosswalk
  });
}));

// DELETE /api/crosswalks/:id/camera - Unlink camera from crosswalk
router.delete('/:id/camera', asyncHandler(async (req, res) => {
  const crosswalk = await crosswalkService.unlinkCamera(req.params.id);
  
  if (!crosswalk) {
    res.status(404);
    throw new Error('Crosswalk not found');
  }
  
  res.json({
    success: true,
    message: 'Camera unlinked successfully',
    data: crosswalk
  });
}));

// PATCH /api/crosswalks/:id/led - Link LED to crosswalk
router.patch('/:id/led', asyncHandler(async (req, res) => {
  const { ledId } = req.body;

  if (!ledId) {
    res.status(400);
    throw new Error('ledId is required');
  }

  const crosswalk = await crosswalkService.linkLED(req.params.id, ledId);
  
  if (!crosswalk) {
    res.status(404);
    throw new Error('Crosswalk not found');
  }
  
  res.json({
    success: true,
    message: 'LED linked successfully',
    data: crosswalk
  });
}));

// DELETE /api/crosswalks/:id/led - Unlink LED from crosswalk
router.delete('/:id/led', asyncHandler(async (req, res) => {
  const crosswalk = await crosswalkService.unlinkLED(req.params.id);
  
  if (!crosswalk) {
    res.status(404);
    throw new Error('Crosswalk not found');
  }
  
  res.json({
    success: true,
    message: 'LED unlinked successfully',
    data: crosswalk
  });
}));

export default router;
