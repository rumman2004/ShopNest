const Joi = require('joi');

const createShop = {
    body: Joi.object({
        shop_name: Joi.string()
            .min(2)
            .max(150)
            .required()
            .messages({
                'string.min': 'Shop name must be at least 2 characters long',
                'string.max': 'Shop name cannot exceed 150 characters',
                'any.required': 'Shop name is required'
            }),
        category: Joi.string()
            .max(100)
            .optional()
            .messages({
                'string.max': 'Category cannot exceed 100 characters'
            }),
        address: Joi.string()
            .max(500)
            .optional()
            .messages({
                'string.max': 'Address cannot exceed 500 characters'
            })
    })
};

const getShop = {
    params: Joi.object({
        shop_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Shop ID must be a number',
                'number.integer': 'Shop ID must be an integer',
                'number.positive': 'Shop ID must be positive',
                'any.required': 'Shop ID is required'
            })
    })
};

const updateShop = {
    params: Joi.object({
        shop_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Shop ID must be a number',
                'number.integer': 'Shop ID must be an integer',
                'number.positive': 'Shop ID must be positive',
                'any.required': 'Shop ID is required'
            })
    }),
    body: Joi.object({
        shop_name: Joi.string()
            .min(2)
            .max(150)
            .optional()
            .messages({
                'string.min': 'Shop name must be at least 2 characters long',
                'string.max': 'Shop name cannot exceed 150 characters'
            }),
        category: Joi.string()
            .max(100)
            .optional()
            .allow('')
            .messages({
                'string.max': 'Category cannot exceed 100 characters'
            }),
        address: Joi.string()
            .max(500)
            .optional()
            .allow('')
            .messages({
                'string.max': 'Address cannot exceed 500 characters'
            })
    }).min(1)
    .messages({
        'object.min': 'At least one field must be provided for update'
    })
};

const deleteShop = {
    params: Joi.object({
        shop_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Shop ID must be a number',
                'number.integer': 'Shop ID must be an integer',
                'number.positive': 'Shop ID must be positive',
                'any.required': 'Shop ID is required'
            })
    })
};

module.exports = {
    createShop,
    getShop,
    updateShop,
    deleteShop
};