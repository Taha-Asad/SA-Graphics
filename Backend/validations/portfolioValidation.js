const Joi = require("joi");

const projectSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title is required',
        'any.required': 'Title is required'
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Description is required',
        'any.required': 'Description is required'
    }),
    skillsUsed: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Skills must be an array',
        'array.empty': 'At least one skill is required',
        'any.required': 'Skills are required'
    }),
    category: Joi.string().required().messages({
        'string.empty': 'Category is required',
        'any.required': 'Category is required'
    }),
    image: Joi.string().optional().messages({
        'string.uri': 'Image must be a valid URI'
    })
});

module.exports = { projectSchema };