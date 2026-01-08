import express from 'express';
import asyncHandler from 'express-async-handler';
import * as ledService from '../services/ledService.js';

const router = express.Router();

// @route   GET /api/leds
// @desc    Get all LEDs
router.get('/', asyncHandler(async (req, res) => {
  const leds = await ledService.getAllLEDs();
  res.json({
    success: true,
    count: leds.length,
    data: leds
  });
}));

// @route   GET /api/leds/:id
// @desc    Get LED by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const led = await ledService.getLEDById(req.params.id);
  res.json({
    success: true,
    data: led
  });
}));

// @route   POST /api/leds
// @desc    Create new LED
router.post('/', asyncHandler(async (req, res) => {
  const led = await ledService.createLED(req.body);
  res.status(201).json({
    success: true,
    data: led
  });
}));

// @route   DELETE /api/leds/:id
// @desc    Delete LED
router.delete('/:id', asyncHandler(async (req, res) => {
  await ledService.deleteLED(req.params.id);
  res.json({
    success: true,
    message: 'LED deleted successfully'
  });
}));

export default router;
