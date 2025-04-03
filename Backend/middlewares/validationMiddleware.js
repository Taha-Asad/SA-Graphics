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
  validateJoi: (schema) => {
    return (req, res, next) => {
      if (!schema || typeof schema.validate !== 'function') {
        console.error('Invalid schema provided to validateJoi middleware');
        return next();
      }

      const { error } = schema.validate(req.body, { 
        abortEarly: false,
        allowUnknown: true
      });
      
      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path[0],
          message: detail.message
        }));
        
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors
        });
      }

      next();
    };
  }
};