const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().max(50).messages({
    'string.empty': 'Name is required',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  }),
  phoneNo: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
    'string.length': 'Phone number must be 11 digits',
    'string.pattern.base': 'Phone number must contain only digits',
    'string.empty': 'Phone number is required',
    'any.required': 'Phone number is required'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  })
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  })
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  })
});

const updateProfileSchema = Joi.object({
  name: Joi.string().max(50).messages({
    'string.max': 'Name cannot exceed 50 characters'
  }),
  email: Joi.string().email().messages({
    'string.email': 'Please enter a valid email address'
  }),
  phone: Joi.string().length(11).pattern(/^[0-9]+$/).messages({
    'string.length': 'Phone number must be 11 digits',
    'string.pattern.base': 'Phone number must contain only digits'
  }),
  address: Joi.string().max(200).messages({
    'string.max': 'Address cannot exceed 200 characters'
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema
};