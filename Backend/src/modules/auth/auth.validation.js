const Joi = require('joi');

const registerOwner = {
    body: Joi.object({
        full_name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.min': 'Full name must be at least 2 characters long',
                'string.max': 'Full name cannot exceed 100 characters',
                'any.required': 'Full name is required'
            }),
        email: Joi.string()
            .email()
            .max(150)
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'string.max': 'Email cannot exceed 150 characters',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .min(8)
            .max(100)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.max': 'Password cannot exceed 100 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                'any.required': 'Password is required'
            })
    })
};

const registerCashier = {
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
        full_name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.min': 'Full name must be at least 2 characters long',
                'string.max': 'Full name cannot exceed 100 characters',
                'any.required': 'Full name is required'
            }),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(50)
            .required()
            .messages({
                'string.alphanum': 'Username can only contain letters and numbers',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username cannot exceed 50 characters',
                'any.required': 'Username is required'
            }),
        password: Joi.string()
            .min(8)
            .max(100)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.max': 'Password cannot exceed 100 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                'any.required': 'Password is required'
            })
    })
};

// Fixed login validation without circular dependency
const login = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .max(150)
            .messages({
                'string.email': 'Please provide a valid email address',
                'string.max': 'Email cannot exceed 150 characters'
            }),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(50)
            .messages({
                'string.alphanum': 'Username can only contain letters and numbers',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username cannot exceed 50 characters'
            }),
        password: Joi.string()
            .min(8)
            .max(100)
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.max': 'Password cannot exceed 100 characters',
                'any.required': 'Password is required'
            })
    })
    .or('email', 'username') // Use .or() instead of .xor() with .when()
    .messages({
        'object.missing': 'Please provide either email or username'
    })
};

const refreshToken = {
    // No body validation needed as token comes from cookie
};

module.exports = {
    registerOwner,
    registerCashier,
    login,
    refreshToken
};