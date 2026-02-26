import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDatabase from './src/config/database.js';
import alertRoutes from './src/routes/alertRoutes.js';

dotenv.config();

/**
 * Alert Service
 * Handles all alert operations - saving, retrieving, and updating alerts
 */

const app = express();
const PORT = process.env.PORT || 5002;
const SERVICE_NAME = process.env.SERVICE_NAME || 'alert-service';

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${SERVICE_NAME}] ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Routes
app.use('/api', alertRoutes);

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
    service: SERVICE_NAME,
    version: '1.0.0',
    description: 'Alert management service',
    endpoints: {
      createAlert: 'POST /api/alerts',
      getAlerts: 'GET /api/alerts',
      getAlertById: 'GET /api/alerts/:id',
      updateAlert: 'PATCH /api/alerts/:id',
      health: 'GET /health'
    }
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
  console.log(`\n🚨 [${SERVICE_NAME}] running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API: http://localhost:${PORT}/api/alerts\n`);
});

export default app;
