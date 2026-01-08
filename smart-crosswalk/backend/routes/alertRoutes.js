import express from "express";
import asyncHandler from "express-async-handler";
import { alertService } from "../services/index.js";

const router = express.Router();

// GET /api/alerts - Get all alerts
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { dangerLevel, crosswalkId } = req.query;
    const alerts = await alertService.getAll({ dangerLevel, crosswalkId });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  })
);

// POST /api/alerts - Create new alert (from YOLO detection)
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { crosswalkId, dangerLevel, detectionPhoto } = req.body;

    // Validation
    if (!crosswalkId || !dangerLevel || !detectionPhoto?.url) {
      res.status(400);
      throw new Error('Missing required fields: crosswalkId, dangerLevel, detectionPhoto.url');
    }

    const alert = await alertService.create({
      crosswalkId,
      dangerLevel,
      detectionPhoto: {
        url: detectionPhoto.url
      }
    });

    res.status(201).json({
      success: true,
      data: alert,
    });
  })
);

// GET /api/alerts/stats - Get alert statistics
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const stats = await alertService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  })
);

// GET /api/alerts/:id - Get single alert
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const alert = await alertService.getById(req.params.id);

    if (!alert) {
      res.status(404);
      throw new Error("Alert not found");
    }

    res.json({
      success: true,
      data: alert,
    });
  })
);

export default router;
