const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { transporter } = require('./config/nodemailer.js');
const createError = require('http-errors');
const mongoose = require('mongoose');
const settingsRoutes = require('./routes/settings');
const orderRoutes = require('./routes/orders');

// Load env vars
dotenv.config()

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files - ensure uploads folder is accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/', require('./routers/api.js'));
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/orders', orderRoutes);

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
app.use(require('./middlewares/errorHandler.js'));

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

module.exports = server;