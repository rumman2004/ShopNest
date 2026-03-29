const express = require('express');
const shopsController = require('./shops.controller');
const shopsValidation = require('./shops.validation');
const { validate } = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const validateShopAccess = require('../../middleware/validateShopAccess');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create shop (owners only)
router.post('/',
    validate(shopsValidation.createShop),
    shopsController.createShop
);

// Get all shops for the authenticated owner
router.get('/',
    shopsController.getOwnerShops
);

router.get('/preference/active', shopsController.getActivePreference);

// Get single shop by ID
router.get('/:shop_id',
    validate(shopsValidation.getShop),
    validateShopAccess,
    shopsController.getShop
);

// Update shop
router.put('/:shop_id',
    validate(shopsValidation.updateShop),
    validateShopAccess,
    shopsController.updateShop
);

// Delete shop
router.delete('/:shop_id',
    validate(shopsValidation.deleteShop),
    validateShopAccess,
    shopsController.deleteShop
);

router.patch('/:shop_id/active',
  validate(shopsValidation.getShop),
  validateShopAccess,
  shopsController.setActiveShop
);

module.exports = router;