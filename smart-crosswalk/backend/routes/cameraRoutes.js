import express from 'express';
import asyncHandler from 'express-async-handler';
import * as cameraService from '../services/cameraService.js';

const router = express.Router();

// @route   GET /api/cameras
// @desc    Get all cameras
router.get('/', asyncHandler(async (req, res) => {
  const cameras = await cameraService.getAllCameras();
  res.json({
    success: true,
    count: cameras.length,
    data: cameras
  });
}));

// @route   GET /api/cameras/:id
// @desc    Get camera by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const camera = await cameraService.getCameraById(req.params.id);
  res.json({
    success: true,
    data: camera
  });
}));

// @route   POST /api/cameras
// @desc    Create new camera
router.post('/', asyncHandler(async (req, res) => {
  const camera = await cameraService.createCamera(req.body);
  res.status(201).json({
    success: true,
    data: camera
  });
}));

// @route   PATCH /api/cameras/:id/status
// @desc    Update camera status
router.patch('/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;
  const camera = await cameraService.updateCameraStatus(req.params.id, status);
  res.json({
    success: true,
    data: camera
  });
}));

// @route   PATCH /api/cameras/:id
// @desc    Update camera (general)
router.patch('/:id', asyncHandler(async (req, res) => {
  const camera = await cameraService.updateCamera(req.params.id, req.body);
  res.json({
    success: true,
    data: camera
  });
}));

// @route   DELETE /api/cameras/:id
// @desc    Delete camera
router.delete('/:id', asyncHandler(async (req, res) => {
  await cameraService.deleteCamera(req.params.id);
  res.json({
    success: true,
    message: 'Camera deleted successfully'
  });
}));

export default router;
