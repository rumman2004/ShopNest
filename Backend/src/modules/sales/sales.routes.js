const express        = require('express');
const salesController = require('./sales.controller');
const salesValidation = require('./sales.validation');
const { validate }   = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

// ✅ FIX: Specific named routes MUST come before generic /:param routes
// otherwise Express matches /cashier/123 as sale_id = "cashier"

// GET /sales/shop/:shop_id/date-range  — must be before /shop/:shop_id
router.get('/shop/:shop_id/date-range',
  validate(salesValidation.getSalesByDateRange),
  salesController.getSalesByDateRange
);

// GET /sales/shop/:shop_id
router.get('/shop/:shop_id',
  validate(salesValidation.getSalesByShop),
  salesController.getSalesByShop
);

// GET /sales/cashier/:cashier_id  — must be before /:sale_id
router.get('/cashier/:cashier_id',
  validate(salesValidation.getSalesByCashier),
  salesController.getSalesByCashier
);

// POST /sales  — checkout
router.post('/',
  validate(salesValidation.createSale),
  salesController.createSale
);

// GET /sales/:sale_id  — must be LAST, it's the catch-all
router.get('/:sale_id',
  validate(salesValidation.getSale),
  salesController.getSale
);

module.exports = router;