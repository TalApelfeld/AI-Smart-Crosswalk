import Alert from '../models/Alert.js';
import axios from 'axios';

const CROSSWALK_SERVICE_URL = process.env.CROSSWALK_SERVICE_URL || 'http://localhost:5003';

/**
 * Controllers - Functions that handle business logic
 */

/**
 * @route   POST /api/ai/alerts
 * @desc    Receive a new alert from AI and save it to database
 * @access  Public (can add authentication later)
 */
export const createAlert = async (req, res) => {
  try {
    const alertData = req.body;
    
    // Create new alert
    const alert = await Alert.create(alertData);
    
    console.log('🚨 New alert created:', alert._id);
    
    // Trigger LED warning system if crosswalk is specified
    if (alert.crosswalkId && alert.severity) {
      // Determine LED pattern based on severity
      let ledPattern = 'warning';
      if (alert.severity === 'critical') {
        ledPattern = 'danger';
      } else if (alert.severity === 'high') {
        ledPattern = 'warning';
      }
      
      // Activate LEDs asynchronously via Crosswalk Service (don't wait for response)
      axios.post(`${CROSSWALK_SERVICE_URL}/api/crosswalks/${alert.crosswalkId}/led/activate`, {
        pattern: ledPattern,
        metadata: {
          type: alert.type,
          severity: alert.severity,
          alertId: alert._id
        }
      }).then(response => {
        console.log(`💡 LED system activated: ${ledPattern}`);
      }).catch(err => {
        console.error('❌ LED activation error:', err.message);
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert
    });
  } catch (error) {
    console.error('❌ Error creating alert:', error);
    
    res.status(400).json({
      success: false,
      message: 'Failed to create alert',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/alerts
 * @desc    Get all alerts (with optional filtering)
 * @access  Public
 */
export const getAlerts = async (req, res) => {
  try {
    // Filter parameters (query parameters)
    const { 
      severity, 
      status, 
      type,
      limit = 50,
      page = 1
    } = req.query;
    
    // Build search query object
    const query = {};
    
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (type) query.type = type;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch alerts
    const alerts = await Alert.find(query)
      .sort({ timestamp: -1 }) // Sort by time (newest first)
      .limit(parseInt(limit))
      .skip(skip);
    
    // Count total alerts
    const total = await Alert.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: alerts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: alerts
    });
  } catch (error) {
    console.error('❌ Error fetching alerts:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/alerts/:id
 * @desc    Get a single alert by ID
 * @access  Public
 */
export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('❌ Error fetching alert:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alert',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/alerts/:id
 * @desc    Update alert status
 * @access  Public
 */
export const updateAlertStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'resolved' && { resolvedAt: new Date() })
      },
      { new: true, runValidators: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Alert status updated',
      data: alert
    });
  } catch (error) {
    console.error('❌ Error updating alert:', error);
    
    res.status(400).json({
      success: false,
      message: 'Failed to update alert',
      error: error.message
    });
  }
};

export default { createAlert, getAlerts, getAlertById, updateAlertStatus };
