const Joi = require('joi');

const getSalesByShop = {
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
    query: Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .optional()
            .default(1)
            .messages({
                'number.base': 'Page must be a number',
                'number.integer': 'Page must be an integer',
                'number.min': 'Page must be at least 1'
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .optional()
            .default(10)
            .messages({
                'number.base': 'Limit must be a number',
                'number.integer': 'Limit must be an integer',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 100'
            }),
        sort_by: Joi.string()
            .valid('sale_date', 'total_amount', 'sale_id')
            .optional()
            .default('sale_date')
            .messages({
                'any.only': 'Sort by must be one of: sale_date, total_amount, sale_id'
            }),
        sort_order: Joi.string()
            .valid('asc', 'desc')
            .optional()
            .default('desc')
            .messages({
                'any.only': 'Sort order must be either asc or desc'
            })
    })
};

const getSale = {
    params: Joi.object({
        sale_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Sale ID must be a number',
                'number.integer': 'Sale ID must be an integer',
                'number.positive': 'Sale ID must be positive',
                'any.required': 'Sale ID is required'
            })
    })
};

const createSale = {
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

        // ✅ ADD: tendered_amount was being rejected by validation
        tendered_amount: Joi.number()
            .positive()
            .precision(2)
            .optional()
            .messages({
                'number.base': 'Tendered amount must be a number',
                'number.positive': 'Tendered amount must be positive'
            }),

        items: Joi.array()
            .items(
                Joi.object({
                    product_id: Joi.number()
                        .integer()
                        .positive()
                        .required()
                        .messages({
                            'number.base': 'Product ID must be a number',
                            'number.integer': 'Product ID must be an integer',
                            'number.positive': 'Product ID must be positive',
                            'any.required': 'Product ID is required'
                        }),
                    quantity: Joi.number()
                        .integer()
                        .positive()
                        .required()
                        .messages({
                            'number.base': 'Quantity must be a number',
                            'number.integer': 'Quantity must be an integer',
                            'number.positive': 'Quantity must be positive',
                            'any.required': 'Quantity is required'
                        }),
                    unit_price: Joi.number()
                        .positive()
                        .precision(2)
                        .optional()
                        .messages({
                            'number.base': 'Unit price must be a number',
                            'number.positive': 'Unit price must be positive'
                        })
                })
            )
            .min(1)
            .required()
            .messages({
                'array.min': 'At least one item is required',
                'any.required': 'Items array is required'
            })
    })
};

const getSalesByCashier = {
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
    query: Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .optional()
            .default(1)
            .messages({
                'number.base': 'Page must be a number',
                'number.integer': 'Page must be an integer',
                'number.min': 'Page must be at least 1'
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .optional()
            .default(10)
            .messages({
                'number.base': 'Limit must be a number',
                'number.integer': 'Limit must be an integer',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 100'
            }),
        start_date: Joi.date()
            .iso()
            .optional()
            .messages({
                'date.base': 'Start date must be a valid date',
                'date.format': 'Start date must be in ISO format (YYYY-MM-DD)'
            }),
        end_date: Joi.date()
            .iso()
            .min(Joi.ref('start_date'))
            .optional()
            .messages({
                'date.base': 'End date must be a valid date',
                'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
                'date.min': 'End date must be after start date'
            })
    })
};

const getSalesByDateRange = {
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
    query: Joi.object({
        start_date: Joi.date()
            .iso()
            .required()
            .messages({
                'date.base': 'Start date must be a valid date',
                'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
                'any.required': 'Start date is required'
            }),
        end_date: Joi.date()
            .iso()
            .min(Joi.ref('start_date'))
            .required()
            .messages({
                'date.base': 'End date must be a valid date',
                'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
                'date.min': 'End date must be after start date',
                'any.required': 'End date is required'
            }),
        page: Joi.number()
            .integer()
            .min(1)
            .optional()
            .default(1)
            .messages({
                'number.base': 'Page must be a number',
                'number.integer': 'Page must be an integer',
                'number.min': 'Page must be at least 1'
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .optional()
            .default(10)
            .messages({
                'number.base': 'Limit must be a number',
                'number.integer': 'Limit must be an integer',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 100'
            })
    })
};

module.exports = {
    getSalesByShop,
    getSale,
    createSale,
    getSalesByCashier,
    getSalesByDateRange
};