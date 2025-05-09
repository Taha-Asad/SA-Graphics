const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  stock: Joi.number().min(0).required(),
  countInStock: Joi.number().min(0).required(),
  publishDate: Joi.date().required(),
  // Image is handled by multer middleware
  coverImage: Joi.string().optional(),
  discount: Joi.number().min(0).max(100).default(0),
  bulkDiscount: Joi.number().min(0).max(100).default(0)
});

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
});

module.exports = { bookSchema, reviewSchema };
