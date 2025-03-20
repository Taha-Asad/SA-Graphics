const Joi = require("joi");

const PortfolioSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    skillsUsed: Joi.array().items(Joi.string()).required(),
    image: Joi.string().uri().optional(),
})

module.exports = {PortfolioSchema}