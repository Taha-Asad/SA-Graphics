const Joi = require("joi");

const orderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      _id: Joi.string(),
      title: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().integer().min(1).required(),
      type: Joi.string().valid('course', 'product').required(),
      thumbnail: Joi.string().allow('', null),
      discount: Joi.number().min(0).max(100).allow(null),
      discountedPrice: Joi.number().allow(null)
    })
  ).required(),
  
  subtotal: Joi.number().required(),
  charityAmount: Joi.number().required(),
  totalAmount: Joi.number().required(),
  
  shippingAddress: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    province: Joi.string().required(),
    postalCode: Joi.string().required(),
    phoneNo: Joi.string().required()
  }).required(),
  
  userId: Joi.string().required(),
  paymentMethod: Joi.string().valid('cash', 'transfer', 'jazzcash').required(),
  paymentStatus: Joi.string().valid('pending', 'confirmed', 'failed').default('pending'),
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').default('pending'),
  paymentProof: Joi.string().allow('', null),
  orderType: Joi.string().valid('course', 'product'),
  orderNumber: Joi.string()
});

const validateOrder = (orderData) => {
  return orderSchema.validate(orderData, { abortEarly: false });
};

module.exports = {
  orderSchema,
  validateOrder
};