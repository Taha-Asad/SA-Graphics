const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const createError = require('http-errors');

// Verify token middleware
const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'No auth token found' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Please authenticate'
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      status: 'fail',
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// Legacy auth middleware (for backward compatibility)
const auth = verifyToken;

module.exports = { auth, verifyToken, isAdmin }; 