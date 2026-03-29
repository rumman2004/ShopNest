const Joi = require('joi');

const shopIdParamSchema = Joi.object({
  shop_id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'Shop ID is required',
      'number.base':  'Shop ID must be a number',
    }),
});

const productIdParamSchema = Joi.object({
  product_id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'Product ID is required',
      'number.base':  'Product ID must be a number',
    }),
});

const shopAndProductParams = Joi.object({
  shop_id: Joi.number().integer().positive().required().messages({
    'any.required': 'Shop ID is required',
    'number.base':  'Shop ID must be a number',
  }),
  product_id: Joi.number().integer().positive().required().messages({
    'any.required': 'Product ID is required',
    'number.base':  'Product ID must be a number',
  }),
});

const getProductsByShop = {
  params: shopIdParamSchema,
  query: Joi.object({
    page:       Joi.number().integer().min(1).default(1),
    limit:      Joi.number().integer().min(1).max(100).default(50),
    search:     Joi.string().max(100).optional().allow(''),
    category:   Joi.string().max(100).optional().allow(''),
    sort_by:    Joi.string()
      .valid('product_name', 'price', 'cost_price', 'stock_quantity', 'created_at')
      .default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const getLowStockProducts = {
  params: shopIdParamSchema,
  query: Joi.object({
    threshold: Joi.number().integer().min(0).default(10),
  }),
};

const getProduct = {
  params: shopAndProductParams,
};

const createProduct = {
  params: shopIdParamSchema,
  body: Joi.object({
    product_name: Joi.string().min(2).max(150).required()
      .messages({
        'string.min':   'Product name must be at least 2 characters',
        'string.max':   'Product name cannot exceed 150 characters',
        'any.required': 'Product name is required',
      }),

    price: Joi.number().positive().precision(2).required()
      .messages({
        'number.base':     'Price must be a number',
        'number.positive': 'Price must be greater than 0',
        'any.required':    'Price is required',
      }),

    cost_price: Joi.number().min(0).precision(2).optional().default(0)
      .messages({
        'number.base': 'Cost price must be a number',
        'number.min':  'Cost price cannot be negative',
      }),

    stock_quantity: Joi.number().integer().min(0).optional().default(0)
      .messages({
        'number.base':    'Stock quantity must be a number',
        'number.integer': 'Stock quantity must be an integer',
        'number.min':     'Stock quantity cannot be negative',
      }),

    category: Joi.string().max(100).optional().allow(null, '')
      .messages({
        'string.max': 'Category cannot exceed 100 characters',
      }),

    sku: Joi.string().max(50).optional().allow('')
      .messages({
        'string.max': 'SKU cannot exceed 50 characters',
      }),

    description: Joi.string().max(1000).optional().allow('')
      .messages({
        'string.max': 'Description cannot exceed 1000 characters',
      }),
  }),
};

const updateProduct = {
  params: shopAndProductParams,
  // ✅ FIX: Removed .min(1) so image-only uploads (which have an empty body) don't trigger a validation error.
  // The service layer handles the actual check to ensure at least an image OR a field is provided.
  body: Joi.object({
    product_name:   Joi.string().min(2).max(150).optional(),
    price:          Joi.number().positive().precision(2).optional(),
    cost_price:     Joi.number().min(0).precision(2).optional(),
    stock_quantity: Joi.number().integer().min(0).optional(),
    category:       Joi.string().max(100).optional().allow(null, ''),
    sku:            Joi.string().max(50).optional().allow(''),
    description:    Joi.string().max(1000).optional().allow(''),
  }),
};

const updateStock = {
  params: shopAndProductParams,
  body: Joi.object({
    stock_quantity:  Joi.number().integer().min(0).required(),
    adjustment_type: Joi.string().valid('add', 'subtract', 'set').required()
      .messages({
        'any.only':     'adjustment_type must be: add, subtract, or set',
        'any.required': 'adjustment_type is required',
      }),
    reason: Joi.string().max(200).optional(),
  }),
};

const deleteProduct = {
  params: shopAndProductParams,
};

module.exports = {
  getProductsByShop,
  getLowStockProducts,
  getProduct,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
};