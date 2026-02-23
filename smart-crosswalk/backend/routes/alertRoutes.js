import express from "express"
import multer from "multer"
import asyncHandler from "express-async-handler"
import Alert from "../models/Alert.js"
import { alertService, crosswalkService } from "../services/index.js"

const router = express.Router()

// Multer for in-memory file uploads (binary storage in MongoDB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
})

// Helper function to determine danger level from confidence
function getDangerLevelFromConfidence(confidence) {
  if (!confidence) return 'MEDIUM'
  const conf = parseFloat(confidence)
  if (conf >= 0.7) return 'HIGH'
  if (conf >= 0.4) return 'MEDIUM'
  return 'LOW'
}

// GET /api/alerts - Get all alerts
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { dangerLevel, crosswalkId } = req.query
    const alerts = await alertService.getAll({ dangerLevel, crosswalkId })

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    })
  })
)

// POST /api/alerts - Create new alert (supports JSON with imageUrl OR multipart with image file)
router.post(
  "/",
  (req, res, next) => {
    const contentType = req.headers['content-type'] || ''
    if (contentType.includes('multipart/form-data')) {
      return upload.single('image')(req, res, next)
    }
    next()
  },
  asyncHandler(async (req, res) => {
    // Support both JSON body and multipart form fields
    const body = req.body || {}
    const crosswalkId = body.crosswalkId
    const dangerLevel = body.dangerLevel
    const imageUrl = body.imageUrl
    const confidence = body.confidence
    const cameraId = body.cameraId
    let rawLocation = body.location

    // Parse location (supports object or JSON string)
    let location = null
    if (rawLocation) {
      try {
        location = typeof rawLocation === 'string' ? JSON.parse(rawLocation) : rawLocation
      } catch (e) {
        console.warn('Could not parse location:', rawLocation, e.message)
      }
    }

    console.log('--- New Alert Request ---')
    console.log('Image source:', req.file ? 'binary upload' : imageUrl ? 'URL' : 'none')
    console.log('Camera:', cameraId)

    const alertData = {}

    // Find or create crosswalk by location/camera
    if (crosswalkId) {
      alertData.crosswalkId = crosswalkId
    } else if (location && (location.city || location.street || location.number)) {
      try {
        const crosswalk = await crosswalkService.findOrCreateByLocationAndCamera(
          location,
          cameraId || null
        )
        alertData.crosswalkId = crosswalk._id
      } catch (error) {
        console.error('Error finding/creating crosswalk:', error.message)
      }
    }

    // Danger level
    if (dangerLevel) {
      alertData.dangerLevel = dangerLevel
    } else if (confidence) {
      alertData.dangerLevel = getDangerLevelFromConfidence(confidence)
    } else {
      alertData.dangerLevel = 'MEDIUM'
    }

    // Image: binary (from multipart) or URL (from JSON)
    if (req.file && req.file.buffer) {
      alertData.detectionPhoto = {
        data: req.file.buffer,
        contentType: req.file.mimetype || 'image/jpeg'
      }
    } else if (imageUrl) {
      alertData.detectionPhoto = {
        url: imageUrl
      }
    }

    const alert = await alertService.create(alertData)

    res.status(201).json({
      success: true,
      data: alert,
      id: alert._id
    })
  })
)

// GET /api/alerts/stats - Get alert statistics
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const stats = await alertService.getStats()

    res.json({
      success: true,
      data: stats,
    })
  })
)

// GET /api/alerts/:id/photo - Serve binary image from MongoDB
router.get(
  "/:id/photo",
  asyncHandler(async (req, res) => {
    const alert = await Alert.findById(req.params.id).select('+detectionPhoto.data detectionPhoto.contentType')
    if (!alert || !alert.detectionPhoto?.data) {
      res.status(404)
      throw new Error("Photo not found")
    }
    res.set('Content-Type', alert.detectionPhoto.contentType || 'image/jpeg')
    res.send(alert.detectionPhoto.data)
  })
)

// GET /api/alerts/:id - Get single alert
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const alert = await alertService.getById(req.params.id)

    if (!alert) {
      res.status(404)
      throw new Error("Alert not found")
    }

    res.json({
      success: true,
      data: alert,
    })
  })
)

// PATCH /api/alerts/:id - Update alert
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const alert = await alertService.update(req.params.id, req.body)

    if (!alert) {
      res.status(404)
      throw new Error("Alert not found")
    }

    res.json({
      success: true,
      data: alert,
    })
  })
)

// DELETE /api/alerts/:id - Delete alert
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const alert = await alertService.delete(req.params.id)

    if (!alert) {
      res.status(404)
      throw new Error("Alert not found")
    }

    res.json({
      success: true,
      message: "Alert deleted successfully",
    })
  })
)

export default router