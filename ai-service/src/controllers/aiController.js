import aiModelService from '../services/aiModelService.js';
import axios from 'axios';

const ALERT_SERVICE_URL = process.env.ALERT_SERVICE_URL || 'http://localhost:5002';

/**
 * AI Controller
 * Handles AI inference requests
 */

/**
 * @route   POST /api/ai/analyze
 * @desc    Analyze image and detect objects
 * @body    { imageData: base64, imagePath: string, crosswalkId: string }
 */
export const analyzeImage = async (req, res) => {
  try {
    const { imageData, imagePath, crosswalkId, timestamp } = req.body;
    
    if (!imageData && !imagePath) {
      return res.status(400).json({
        success: false,
        message: 'imageData or imagePath is required'
      });
    }
    
    console.log('🔍 Analyzing image...');
    const startTime = Date.now();
    
    // Analyze with AI model
    const result = await aiModelService.analyzeImage({
      imageData,
      imagePath,
      crosswalkId,
      timestamp
    });
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Analysis complete in ${processingTime}ms`);
    console.log(`   Detections: ${result.detections.length}`);
    
    // Analyze for potential dangers
    const dangerAnalysis = aiModelService.analyzeDanger(result.detections);
    console.log(`🔍 Danger Analysis: ${dangerAnalysis.severity} - ${dangerAnalysis.reason}`);
    
    // If danger detected, send alert to Alert Service
    if (dangerAnalysis.hasDanger) {
      const alertData = {
        type: dangerAnalysis.type,
        severity: dangerAnalysis.severity,
        message: dangerAnalysis.reason,
        crosswalkId: crosswalkId || 'unknown',
        location: {
          latitude: 0, // TODO: Get from crosswalk data
          longitude: 0
        },
        detections: result.detections,
        metadata: {
          detectedObjects: dangerAnalysis.detectedObjects,
          confidence: result.confidence,
          modelType: result.modelType,
          processingTime
        },
        timestamp: timestamp || new Date().toISOString(),
        status: 'active'
      };
      
      // Send alert asynchronously (don't wait for response)
      axios.post(`${ALERT_SERVICE_URL}/api/alerts`, alertData)
        .then(response => {
          console.log(`🚨 Alert created: ${response.data.data._id}`);
        })
        .catch(err => {
          console.error(`❌ Failed to create alert: ${err.message}`);
        });
    }
    
    res.json({
      success: true,
      data: {
        detections: result.detections,
        confidence: result.confidence,
        modelType: result.modelType,
        processingTime,
        timestamp: new Date().toISOString(),
        dangerAnalysis
      }
    });
    
  } catch (error) {
    console.error('❌ Error analyzing image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze image',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/ai/status
 * @desc    Get AI model status and info
 */
export const getStatus = async (req, res) => {
  try {
    const status = aiModelService.getStatus();
    
    res.json({
      success: true,
      data: status
    });
    
  } catch (error) {
    console.error('❌ Error getting status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get status',
      error: error.message
    });
  }
};

export default { analyzeImage, getStatus };
