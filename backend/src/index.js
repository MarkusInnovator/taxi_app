import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.status(200).json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server (only if not in test mode)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

export default app;
