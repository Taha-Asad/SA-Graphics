const Joi = require("joi");

const registarSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNo: Joi.string().regex(/^\d{11}$/).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

module.exports = {
  registarSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
