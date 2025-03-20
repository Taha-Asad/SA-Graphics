const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().required(),
  image: Joi.string().uri().optional(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
});

module.exports = { bookSchema, reviewSchema };
