const Joi = require('joi');

const getCashiersByShop = {
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

const getCashier = {
    params: Joi.object({
        cashier_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Cashier ID must be a number',
                'number.integer': 'Cashier ID must be an integer',
                'number.positive': 'Cashier ID must be positive',
                'any.required': 'Cashier ID is required'
            })
    })
};


const createCashier = {
    params: Joi.object({
        shop_id: Joi.number().integer().positive().required()
    }),
    body: Joi.object({
        full_name: Joi.string().min(2).max(100).required(),
        username: Joi.string().alphanum().min(3).max(50).required(),
        password: Joi.string().min(6).required()
    })
};

const updateCashier = {
    params: Joi.object({
        cashier_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Cashier ID must be a number',
                'number.integer': 'Cashier ID must be an integer',
                'number.positive': 'Cashier ID must be positive',
                'any.required': 'Cashier ID is required'
            })
    }),
    body: Joi.object({
        full_name: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Full name must be at least 2 characters long',
                'string.max': 'Full name cannot exceed 100 characters'
            }),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(50)
            .optional()
            .messages({
                'string.alphanum': 'Username can only contain letters and numbers',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username cannot exceed 50 characters'
            })
    }).min(1)
    .messages({
        'object.min': 'At least one field must be provided for update'
    })
};

const updateCashierStatus = {
    params: Joi.object({
        cashier_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Cashier ID must be a number',
                'number.integer': 'Cashier ID must be an integer',
                'number.positive': 'Cashier ID must be positive',
                'any.required': 'Cashier ID is required'
            })
    }),
    body: Joi.object({
        is_active: Joi.boolean()
            .required()
            .messages({
                'boolean.base': 'Status must be true or false',
                'any.required': 'Status is required'
            })
    })
};

const deleteCashier = {
    params: Joi.object({
        cashier_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Cashier ID must be a number',
                'number.integer': 'Cashier ID must be an integer',
                'number.positive': 'Cashier ID must be positive',
                'any.required': 'Cashier ID is required'
            })
    })
};

const changePassword = {
    params: Joi.object({
        cashier_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Cashier ID must be a number',
                'number.integer': 'Cashier ID must be an integer',
                'number.positive': 'Cashier ID must be positive',
                'any.required': 'Cashier ID is required'
            })
    }),
    body: Joi.object({
        current_password: Joi.string()
            .min(8)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Current password must be at least 8 characters long',
                'string.max': 'Current password cannot exceed 100 characters'
            }),
        new_password: Joi.string()
            .min(8)
            .max(100)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
            .required()
            .messages({
                'string.min': 'New password must be at least 8 characters long',
                'string.max': 'New password cannot exceed 100 characters',
                'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                'any.required': 'New password is required'
            })
    })
};

module.exports = {
    getCashiersByShop,
    getCashier,
    createCashier,
    updateCashier,
    updateCashierStatus,
    deleteCashier,
    changePassword
};