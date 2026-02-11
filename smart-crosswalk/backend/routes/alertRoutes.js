import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import asyncHandler from "express-async-handler";
import { alertService, crosswalkService } from "../services/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '..', 'uploads', 'alerts');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `alert-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Helper function to determine danger level from confidence
function getDangerLevelFromConfidence(confidence) {
  if (!confidence) return 'MEDIUM';
  const conf = parseFloat(confidence);
  if (conf >= 0.7) return 'HIGH';
  if (conf >= 0.4) return 'MEDIUM';
  return 'LOW';
}

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

// POST /api/alerts - Create new alert (supports both JSON and multipart/form-data)
router.post(
  "/",
  upload.single('image'), // Handle file upload (optional)
  asyncHandler(async (req, res) => {
    const { 
      crosswalkId, 
      dangerLevel, 
      detectionPhoto, 
      confidence,
      cameraId
    } = req.body;

    // Handle location from multipart/form-data (can come as JSON string or bracket notation)
    let location = null;
    if (req.body.location) {
      // Try to parse as JSON string first
      try {
        location = typeof req.body.location === 'string' 
          ? JSON.parse(req.body.location) 
          : req.body.location;
      } catch (e) {
        // If not JSON, check for bracket notation (location[city], location[street], location[number])
        if (req.body['location[city]'] || req.body['location[street]'] || req.body['location[number]']) {
          location = {
            city: req.body['location[city]'] || '',
            street: req.body['location[street]'] || '',
            number: req.body['location[number]'] || ''
          };
        } else {
          console.warn('Could not parse location:', req.body.location, e.message);
        }
      }
    }

    // Debug logging
    console.log('Alert creation request:', {
      cameraId,
      location,
      hasLocation: !!location,
      crosswalkId
    });

    const alertData = {};

    // Handle crosswalkId - find or create by location and cameraId if provided
    if (crosswalkId) {
      alertData.crosswalkId = crosswalkId;
    } else if (location && (location.city || location.street || location.number)) {
      // Find or create crosswalk by location and cameraId
      try {
        console.log('Finding/creating crosswalk with:', { location, cameraId });
        const crosswalk = await crosswalkService.findOrCreateByLocationAndCamera(
          location,
          cameraId || null
        );
        alertData.crosswalkId = crosswalk._id;
        console.log('Crosswalk found/created:', crosswalk._id, crosswalk.location);
      } catch (error) {
        console.error('Error finding/creating crosswalk:', error.message);
        console.error(error.stack);
        // Continue without crosswalkId if there's an error
      }
    }

    // Handle dangerLevel - derive from confidence if not provided
    if (dangerLevel) {
      alertData.dangerLevel = dangerLevel;
    } else if (confidence) {
      alertData.dangerLevel = getDangerLevelFromConfidence(confidence);
    } else {
      alertData.dangerLevel = 'MEDIUM'; // Default
    }

    // Handle image upload
    if (req.file) {
      // File was uploaded via multer
      alertData.detectionPhoto = {
        url: `/uploads/alerts/${req.file.filename}`
      };
    } else if (detectionPhoto?.url) {
      // URL was provided in JSON body
      alertData.detectionPhoto = {
        url: detectionPhoto.url
      };
    }

    const alert = await alertService.create(alertData);

    res.status(201).json({
      success: true,
      data: alert,
      id: alert._id
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

// PATCH /api/alerts/:id - Update alert
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const alert = await alertService.update(req.params.id, req.body);

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

// DELETE /api/alerts/:id - Delete alert
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const alert = await alertService.delete(req.params.id);

    if (!alert) {
      res.status(404);
      throw new Error("Alert not found");
    }

    res.json({
      success: true,
      message: "Alert deleted successfully",
    });
  })
);

export default router;
