const Joi = require("joi");

const testimonialSchema = Joi.object(
    {
        text: Joi.string().required(),
    }
)
module.exports = {testimonialSchema}