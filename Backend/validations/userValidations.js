const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().max(50),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNo: Joi.string().length(11).pattern(/^[0-9]+$/).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};