require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded media)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/banners', require('./routes/banners'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'StreamerLive API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'StreamerLive Backend API',
    version: '1.0.0',
    endpoints: {
      banners: '/api/banners',
      sections: '/api/sections',
      settings: '/api/settings',
      upload: '/api/upload',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StreamerLive Backend API running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${process.env.UPLOAD_DIR || './uploads'}`);
  console.log(`🗄️  Database: ${process.env.DB_PATH || './db/streamerlive.db'}`);
  console.log('\n📍 Available endpoints:');
  console.log(`   GET    /api/health`);
  console.log(`   GET    /api/banners`);
  console.log(`   POST   /api/banners`);
  console.log(`   PUT    /api/banners/:id`);
  console.log(`   DELETE /api/banners/:id`);
  console.log(`   GET    /api/sections`);
  console.log(`   POST   /api/sections`);
  console.log(`   PUT    /api/sections/:id`);
  console.log(`   DELETE /api/sections/:id`);
  console.log(`   GET    /api/settings`);
  console.log(`   PUT    /api/settings`);
  console.log(`   POST   /api/upload`);
  console.log(`   POST   /api/upload/multiple`);
});

module.exports = app;
