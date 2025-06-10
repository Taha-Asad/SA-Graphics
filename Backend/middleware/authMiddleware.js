const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const createError = require('http-errors');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */

const authenticateUser = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw createError(401, 'You are not logged in! Please log in to get access');
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(401, 'The user belonging to this token no longer exists');
    }

    // 4. Check if user changed password after token was issued (only if method exists)
    if (user.passwordChangedAfter && decoded.iat) {
      if (user.passwordChangedAfter(decoded.iat)) {
        throw createError(401, 'User recently changed password! Please log in again');
      }
    }

    // 5. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token. Please log in again!'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Your token has expired! Please log in again.'));
    }
    next(error);
  }
};

/**
 * Role-Based Access Control Middleware
 * @param {...String} allowedRoles - Roles permitted to access the route
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return next(createError(
        403,
        `Access denied. Required roles: ${allowedRoles.join(', ')}`
      ));
    }
    next();
  };
};

/**
 * Admin-Specific Middleware (convenience wrapper)
 */
const requireAdmin = authorizeRoles('admin');

module.exports = {
  authenticateUser,
  authorizeRoles,
  requireAdmin
};