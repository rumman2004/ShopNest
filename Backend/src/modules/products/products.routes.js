const express = require('express');
const productsController = require('./products.controller');
const productsValidation = require('./products.validation');
const { validate }       = require('../../middleware/validate');
const { authenticate }   = require('../../middleware/authenticate');
const { upload }         = require('../../middleware/upload');

const router = express.Router({ mergeParams: true });

router.use(authenticate);

// GET /shops/:shop_id/products
router.get('/',
  validate(productsValidation.getProductsByShop),
  productsController.getProductsByShop
);

// GET /shops/:shop_id/products/low-stock
// Must be before /:product_id
router.get('/low-stock',
  validate(productsValidation.getLowStockProducts),
  productsController.getLowStockProducts
);

// Removed: /categories route — categories are now a static list on the frontend

// GET /shops/:shop_id/products/:product_id
router.get('/:product_id',
  validate(productsValidation.getProduct),
  productsController.getProduct
);

// POST /shops/:shop_id/products
router.post('/',
  upload.single('image'),
  validate(productsValidation.createProduct),
  productsController.createProduct
);

// PUT /shops/:shop_id/products/:product_id
router.put('/:product_id',
  upload.single('image'),
  validate(productsValidation.updateProduct),
  productsController.updateProduct
);

// PATCH /shops/:shop_id/products/:product_id/stock
router.patch('/:product_id/stock',
  validate(productsValidation.updateStock),
  productsController.updateStock
);

// DELETE /shops/:shop_id/products/:product_id
router.delete('/:product_id',
  validate(productsValidation.deleteProduct),
  productsController.deleteProduct
);

module.exports = router;