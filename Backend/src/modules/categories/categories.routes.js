const express = require('express');
const categoriesController = require('./categories.controller');
const categoriesValidation = require('./categories.validation');
const { validate } = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get categories for a shop
router.get('/shop/:shop_id',
    validate(categoriesValidation.getCategoriesByShop),
    categoriesController.getCategoriesByShop
);

// Create category
router.post('/',
    validate(categoriesValidation.createCategory),
    categoriesController.createCategory
);

// Update category
router.put('/:category_id',
    validate(categoriesValidation.updateCategory),
    categoriesController.updateCategory
);

// Delete category
router.delete('/:category_id',
    validate(categoriesValidation.deleteCategory),
    categoriesController.deleteCategory
);

module.exports = router;