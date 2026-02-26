import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDatabase from './src/config/database.js';
import aiRoutes from './src/routes/aiRoutes.js';
import mlDataRoutes from './src/routes/mlDataRoutes.js';

dotenv.config();

/**
 * AI Microservice
 * Handles all AI model inference and object detection
 */

const app = express();
const PORT = process.env.PORT || 5001;
const SERVICE_NAME = process.env.SERVICE_NAME || 'ai-service';

// Connect to MongoDB for ML data
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Large images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${SERVICE_NAME}] ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/ml', mlDataRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🤖 AI Model Microservice',
    service: SERVICE_NAME,
    version: '1.0.0',
    endpoints: {
      analyzeImage: 'POST /api/ai/analyze',
      health: 'GET /health'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`[${SERVICE_NAME}] Error:`, err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🤖 ${SERVICE_NAME} running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health\n`);
});

export default app;
