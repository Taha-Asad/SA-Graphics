const Joi = require("joi");

const orderSchema = Joi.object({
    items: Joi.array()
    .items(
      Joi.object({
        bookId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
      })
    )
    .required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    province: Joi.string().required(),
    postalCode: Joi.string().required(),
  }).required(),
  paymentMethod: Joi.string().required(),
});
module.exports = {orderSchema}