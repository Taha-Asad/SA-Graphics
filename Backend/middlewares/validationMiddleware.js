const { validationResult } = require('express-validator');
const createError = require('http-errors');

module.exports = {
  validate: (schemas) => {
    return async (req, res, next) => {
      await Promise.all(schemas.map(schema => schema.run(req)));
      
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      
      const extractedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }));
      
      throw createError(422, {
        errors: extractedErrors,
        message: 'Validation failed'
      });
    };
  },
  
  // For Joi validation
  validateJoi: (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw createError(400, error.details[0].message);
    }
    next();
  }
};