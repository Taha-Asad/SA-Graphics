const createError = require('http-errors');

module.exports = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw createError(403, 'You do not have permission to perform this action');
    }
    next();
  } catch (error) {
    next(error);
  }
};