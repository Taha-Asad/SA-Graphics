const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { transporter } = require('./config/nodemailer.js');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/', require('./routers/api.js'));

// Test email connection
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

// Handle 404
app.all('*', (req, res, next) => {
  next(createError(404, `Can't find ${req.originalUrl} on this server!`));
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