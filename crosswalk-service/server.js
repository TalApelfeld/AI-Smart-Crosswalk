import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDatabase from './src/config/database.js';
import crosswalkRoutes from './src/routes/crosswalkRoutes.js';

dotenv.config();

/**
 * Crosswalk Service
 * Manages crosswalk information, cameras, and LED control
 */

const app = express();
const PORT = process.env.PORT || 5003;
const SERVICE_NAME = process.env.SERVICE_NAME || 'crosswalk-service';

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${SERVICE_NAME}] ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Routes
app.use('/api/crosswalks', crosswalkRoutes);

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
    description: 'Crosswalk management and LED control service',
    endpoints: {
      getCrosswalks: 'GET /api/crosswalks',
      getCrosswalkById: 'GET /api/crosswalks/:id',
      createCrosswalk: 'POST /api/crosswalks',
      updateCrosswalk: 'PATCH /api/crosswalks/:id',
      deleteCrosswalk: 'DELETE /api/crosswalks/:id',
      activateLED: 'POST /api/crosswalks/:id/led/activate',
      deactivateLED: 'POST /api/crosswalks/:id/led/deactivate',
      getLEDStatus: 'GET /api/crosswalks/:id/led/status',
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
  console.log(`\n🚦 [${SERVICE_NAME}] running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API: http://localhost:${PORT}/api/crosswalks\n`);
});

export default app;
