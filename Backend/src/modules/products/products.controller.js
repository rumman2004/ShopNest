const productsService  = require('./products.service');
const { asyncHandler } = require('../../utils/asyncHandler');

// GET /shops/:shop_id/products
const getProductsByShop = asyncHandler(async (req, res) => {
  const { shop_id } = req.params;
  const {
    page       = 1,
    limit      = 50,
    search,
    category,
    sort_by    = 'created_at',
    sort_order = 'desc',
  } = req.query;

  const result = await productsService.getProductsByShop({
    shop_id,
    user_id:     req.user.id,
    user_type:   req.user.type,
    page:        parseInt(page),
    limit:       parseInt(limit),
    search,
    category:    category || null,
    sort_by,
    sort_order,
  });

  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

// GET /shops/:shop_id/products/:product_id
const getProduct = asyncHandler(async (req, res) => {
  const { product_id } = req.params;

  const result = await productsService.getProduct({
    product_id,
    user_id:   req.user.id,
    user_type: req.user.type,
  });

  res.status(200).json({
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

// POST /shops/:shop_id/products
const createProduct = asyncHandler(async (req, res) => {
  const { shop_id } = req.params;
  const {
    product_name, sku, price, cost_price,
    stock_quantity, category, description,
  } = req.body;

  const result = await productsService.createProduct({
    shop_id,
    product_name,
    sku,
    price,
    cost_price,
    stock_quantity,
    category,
    description,
    image:     req.file,
    user_id:   req.user.id,
    user_type: req.user.type,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

// PUT /shops/:shop_id/products/:product_id
const updateProduct = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  const {
    product_name, sku, price, cost_price,
    stock_quantity, category, description,
  } = req.body;

  const result = await productsService.updateProduct({
    product_id,
    product_name,
    sku,
    price,
    cost_price,
    stock_quantity,
    category,
    description,
    image:     req.file,
    user_id:   req.user.id,
    user_type: req.user.type,
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

// PATCH /shops/:shop_id/products/:product_id/stock
const updateStock = asyncHandler(async (req, res) => {
  const { product_id } = req.params;
  const { stock_quantity, adjustment_type, reason } = req.body;

  const result = await productsService.updateStock({
    product_id,
    stock_quantity,
    adjustment_type,
    reason,
    user_id:   req.user.id,
    user_type: req.user.type,
  });

  res.status(200).json({
    success: true,
    message: 'Stock updated successfully',
    data: result,
  });
});

// DELETE /shops/:shop_id/products/:product_id
const deleteProduct = asyncHandler(async (req, res) => {
  const { product_id } = req.params;

  await productsService.deleteProduct({
    product_id,
    user_id:   req.user.id,
    user_type: req.user.type,
  });

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// GET /shops/:shop_id/products/low-stock
const getLowStockProducts = asyncHandler(async (req, res) => {
  const { shop_id } = req.params;
  const { threshold = 10 } = req.query;

  const result = await productsService.getLowStockProducts({
    shop_id,
    threshold: parseInt(threshold),
    user_id:   req.user.id,
    user_type: req.user.type,
  });

  res.status(200).json({
    success: true,
    message: 'Low stock products retrieved successfully',
    data: result,
  });
});

module.exports = {
  getProductsByShop,
  getProduct,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  getLowStockProducts,
};