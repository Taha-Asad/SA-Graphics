const registerSchema = require('./userValidations').registerSchema;
const loginSchema = require('./userValidations').loginSchema;
const forgotPasswordSchema = require('./userValidations').forgotPasswordSchema;
const resetPasswordSchema = require('./userValidations').resetPasswordSchema;
const bookSchema = require('./bookValidation').bookSchema;
const reviewSchema = require('./bookValidation').reviewSchema;
const orderSchema = require('./orderValidation').orderSchema;
const projectSchema = require('./portfolioValidation').projectSchema;
const testimonialSchema = require('./testimonialValidation').testimonialSchema;

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  bookSchema,
  reviewSchema,
  orderSchema,
  projectSchema,
  testimonialSchema
};