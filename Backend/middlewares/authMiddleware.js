const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const createError = require('http-errors');

module.exports = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw createError(401, 'You are not logged in! Please log in to get access');
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw createError(401, 'The user belonging to this token no longer exists');
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};