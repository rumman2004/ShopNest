const express = require('express');
const cashiersController = require('./cashiers.controller');
const cashiersValidation = require('./cashiers.validation');
const { validate } = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all cashiers for a shop (owners only)
router.get('/shop/:shop_id',
    validate(cashiersValidation.getCashiersByShop),
    cashiersController.getCashiersByShop
);

// Get single cashier
router.get('/:cashier_id',
    validate(cashiersValidation.getCashier),
    cashiersController.getCashier
);

// Update cashier
router.put('/:cashier_id',
    validate(cashiersValidation.updateCashier),
    cashiersController.updateCashier
);

// Create a new cashier (owners only)
router.post('/shop/:shop_id',
    validate(cashiersValidation.createCashier),
    cashiersController.createCashier
);

// Deactivate/Activate cashier
router.patch('/:cashier_id/status',
    validate(cashiersValidation.updateCashierStatus),
    cashiersController.updateCashierStatus
);

// Delete cashier
router.delete('/:cashier_id',
    validate(cashiersValidation.deleteCashier),
    cashiersController.deleteCashier
);

// Change cashier password
router.patch('/:cashier_id/password',
    validate(cashiersValidation.changePassword),
    cashiersController.changePassword
);

module.exports = router;