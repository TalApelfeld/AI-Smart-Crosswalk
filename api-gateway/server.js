import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

/**
 * API Gateway
 * Single entry point for all microservices
 * Routes requests to appropriate services
 */

const app = express();
const PORT = process.env.PORT || 8000;
const SERVICE_NAME = process.env.SERVICE_NAME || 'api-gateway';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${SERVICE_NAME}] ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Service URLs
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';
const ALERT_SERVICE_URL = process.env.ALERT_SERVICE_URL || 'http://localhost:5002';
const CROSSWALK_SERVICE_URL = process.env.CROSSWALK_SERVICE_URL || 'http://localhost:5003';

// Proxy middleware options
const proxyOptions = {
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`   → Forwarding to: ${req.baseUrl}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`   ← Response: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`   ✗ Proxy Error: ${err.message}`);
    res.status(503).json({
      success: false,
      error: 'Service temporarily unavailable',
      message: err.message
    });
  }
};

// Route to AI Service
app.use('/api/ai', createProxyMiddleware({
  target: AI_SERVICE_URL,
  pathRewrite: { '^/api/ai': '/api/ai' },
  ...proxyOptions
}));

// Route to Alert Service
app.use('/api/alerts', createProxyMiddleware({
  target: ALERT_SERVICE_URL,
  pathRewrite: { '^/api/alerts': '/api/alerts' },
  ...proxyOptions
}));

// Route to Crosswalk Service
app.use('/api/crosswalks', createProxyMiddleware({
  target: CROSSWALK_SERVICE_URL,
  pathRewrite: { '^/api/crosswalks': '/api/crosswalks' },
  ...proxyOptions
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      ai: AI_SERVICE_URL,
      alerts: ALERT_SERVICE_URL,
      crosswalks: CROSSWALK_SERVICE_URL
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    version: '1.0.0',
    description: 'API Gateway - Single entry point for all microservices',
    routes: {
      ai: {
        analyze: 'POST /api/ai/analyze',
        status: 'GET /api/ai/status',
        ml: {
          trainingImages: 'GET/POST /api/ai/ml/training-images',
          falsePredictions: 'GET/POST /api/ai/ml/false-predictions',
          modelMetrics: 'GET/POST /api/ai/ml/model-metrics',
          statistics: 'GET /api/ai/ml/statistics'
        }
      },
      alerts: {
        getAlerts: 'GET /api/alerts',
        getAlertById: 'GET /api/alerts/:id',
        createAlert: 'POST /api/alerts',
        updateAlert: 'PATCH /api/alerts/:id'
      },
      crosswalks: {
        getCrosswalks: 'GET /api/crosswalks',
        getCrosswalkById: 'GET /api/crosswalks/:id',
        createCrosswalk: 'POST /api/crosswalks',
        updateCrosswalk: 'PATCH /api/crosswalks/:id',
        deleteCrosswalk: 'DELETE /api/crosswalks/:id',
        led: {
          activate: 'POST /api/crosswalks/:id/led/activate',
          deactivate: 'POST /api/crosswalks/:id/led/deactivate',
          status: 'GET /api/crosswalks/:id/led/status'
        }
      }
    },
    microservices: {
      aiService: AI_SERVICE_URL,
      alertService: ALERT_SERVICE_URL,
      crosswalkService: CROSSWALK_SERVICE_URL
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${SERVICE_NAME}] Error:`, err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌐 [${SERVICE_NAME}] running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Info: http://localhost:${PORT}/`);
  console.log(`\n   Routing to:`);
  console.log(`   - AI Service:        ${AI_SERVICE_URL}`);
  console.log(`   - Alert Service:     ${ALERT_SERVICE_URL}`);
  console.log(`   - Crosswalk Service: ${CROSSWALK_SERVICE_URL}\n`);
});

export default app;
