const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// API info route
router.get('/info', (req, res) => {
  res.json({
    name: 'Good Project API',
    version: '1.0.0',
    description: 'Full Stack Web Application API',
    endpoints: {
      health: '/api/health',
      info: '/api/info',
      users: '/api/users',
      projects: '/api/projects'
    }
  });
});

module.exports = router;
