const Joi = require('joi');

const getCategoriesByShop = {
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

const createCategory = {
    body: Joi.object({
        shop_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Shop ID must be a number',
                'number.integer': 'Shop ID must be an integer',
                'number.positive': 'Shop ID must be positive',
                'any.required': 'Shop ID is required'
            }),
        category_name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.min': 'Category name must be at least 2 characters long',
                'string.max': 'Category name cannot exceed 100 characters',
                'any.required': 'Category name is required'
            }),
        description: Joi.string()
            .max(500)
            .optional()
            .allow('')
            .messages({
                'string.max': 'Description cannot exceed 500 characters'
            })
    })
};

const updateCategory = {
    params: Joi.object({
        category_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Category ID must be a number',
                'number.integer': 'Category ID must be an integer',
                'number.positive': 'Category ID must be positive',
                'any.required': 'Category ID is required'
            })
    }),
    body: Joi.object({
        category_name: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Category name must be at least 2 characters long',
                'string.max': 'Category name cannot exceed 100 characters'
            }),
        description: Joi.string()
            .max(500)
            .optional()
            .allow('')
            .messages({
                'string.max': 'Description cannot exceed 500 characters'
            })
    }).min(1)
    .messages({
        'object.min': 'At least one field must be provided for update'
    })
};

const deleteCategory = {
    params: Joi.object({
        category_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Category ID must be a number',
                'number.integer': 'Category ID must be an integer',
                'number.positive': 'Category ID must be positive',
                'any.required': 'Category ID is required'
            })
    })
};

module.exports = {
    getCategoriesByShop,
    createCategory,
    updateCategory,
    deleteCategory
};