// Load env vars
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { transporter } = require('./config/nodemailer.js');
const createError = require('http-errors');
const mongoose = require('mongoose');
const settingsRoutes = require('./routes/settings');
const orderRoutes = require('./routes/order.routes.js');
const adminRoutes = require('./routes/admin.routes');
const testimonialRoutes = require('./routes/testimonials.routes');
const courseRoutes = require('./routes/course.routes');
const { UPLOAD_PATH } = require('./config/multer');
const fs = require('fs');

// Connect to database
connectDB();

// Create Express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Content-Length']
};

// Apply CORS configuration
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Ensure uploads directory exists
try {
  if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
    console.log(`Created uploads directory at: ${UPLOAD_PATH}`);
  } else {
    console.log(`Uploads directory exists at: ${UPLOAD_PATH}`);
  }
} catch (error) {
  console.error('Error creating uploads directory:', error);
}

// Serve static files from uploads directory with proper CORS headers
app.use('/uploads', (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=31557600'
  });
  next();
}, express.static(UPLOAD_PATH, {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif')) {
      res.setHeader('Content-Type', `image/${path.split('.').pop()}`);
    }
  }
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Content-Type', `image/${path.split('.').pop()}`);
    }
  }
}));

// Routes
app.use('/api/v1/', require('./routers/api.js'));
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/services', require('./routes/services'));
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);

// Serve frontend for all other routes
app.use(express.static(path.join(__dirname, '../Frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

// Handle 404
app.all('/api/*', (req, res, next) => {
  next(createError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Test email connection
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

// Error handling middleware
app.use(require('./middleware/errorHandler.js'));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.name, err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.name, err.message);
  server.close(() => process.exit(1));
});

module.exports = server;