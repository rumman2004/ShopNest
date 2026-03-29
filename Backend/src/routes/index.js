const express = require('express');

// Import route modules
const authRoutes       = require('../modules/auth/auth.routes');
const shopsRoutes      = require('../modules/shops/shops.routes');
const cashiersRoutes   = require('../modules/cashiers/cashiers.routes');
const categoriesRoutes = require('../modules/categories/categories.routes');
const productsRoutes   = require('../modules/products/products.routes');
const salesRoutes      = require('../modules/sales/sales.routes');
const reportsRoutes    = require('../modules/reports/reports.routes');

const router = express.Router();

// API information endpoint
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ShopNest POS API v1.0.0',
        description: 'Multi-tenant Point of Sale System API',
        documentation: {
            endpoints: {
                auth: {
                    base: '/auth',
                    description: 'Authentication endpoints for owners and cashiers',
                    routes: [
                        'POST /auth/register/owner - Register new owner',
                        'POST /auth/register/cashier - Register new cashier',
                        'POST /auth/login - Login (owner/cashier)',
                        'POST /auth/refresh - Refresh access token',
                        'POST /auth/logout - Logout'
                    ]
                },
                shops: {
                    base: '/shops',
                    description: 'Shop management endpoints',
                    routes: [
                        'GET /shops - Get all shops for authenticated user',
                        'GET /shops/:id - Get single shop',
                        'POST /shops - Create new shop',
                        'PUT /shops/:id - Update shop',
                        'DELETE /shops/:id - Delete shop',
                        ''
                    ]
                },
                cashiers: {
                    base: '/cashiers',
                    description: 'Cashier management endpoints',
                    routes: [
                        'GET /cashiers/shop/:shop_id - Get cashiers by shop',
                        'GET /cashiers/:id - Get single cashier',
                        'PUT /cashiers/:id - Update cashier',
                        'PATCH /cashiers/:id/status - Update cashier status',
                        'DELETE /cashiers/:id - Delete cashier',
                        'PATCH /cashiers/:id/password - Change cashier password'
                    ]
                },
                categories: {
                    base: '/categories',
                    description: 'Product category management endpoints',
                    routes: [
                        'GET /categories/shop/:shop_id - Get categories by shop',
                        'POST /categories - Create new category',
                        'PUT /categories/:id - Update category',
                        'DELETE /categories/:id - Delete category'
                    ]
                },
                products: {
                    base: '/shops/:shop_id/products',
                    description: 'Product management endpoints',
                    routes: [
                        'GET /shops/:shop_id/products - Get products by shop',
                        'GET /shops/:shop_id/products/:product_id - Get single product',
                        'POST /shops/:shop_id/products - Create new product (with image)',
                        'PUT /shops/:shop_id/products/:product_id - Update product (with image)',
                        'PATCH /shops/:shop_id/products/:product_id/stock - Update product stock',
                        'DELETE /shops/:shop_id/products/:product_id - Delete product',
                        'GET /shops/:shop_id/products/low-stock - Get low stock products',
                        'GET /shops/:shop_id/products/categories - Get categories for shop'
                    ]
                },
                sales: {
                    base: '/sales',
                    description: 'Sales transaction endpoints',
                    routes: [
                        'GET /sales/shop/:shop_id - Get sales by shop',
                        'GET /sales/:id - Get single sale',
                        'POST /sales - Create new sale',
                        'GET /sales/cashier/:cashier_id - Get sales by cashier',
                        'GET /sales/shop/:shop_id/date-range - Get sales by date range'
                    ]
                },
                reports: {
                    base: '/reports',
                    description: 'Analytics and reporting endpoints',
                    routes: [
                        'GET /reports/dashboard/:shop_id - Dashboard statistics',
                        'GET /reports/sales-analytics/:shop_id - Sales analytics',
                        'GET /reports/top-products/:shop_id - Top selling products',
                        'GET /reports/inventory/:shop_id - Inventory report',
                        'GET /reports/cashier-performance/:shop_id - Cashier performance',
                        'GET /reports/revenue-trends/:shop_id - Revenue trends',
                        'GET /reports/low-stock/:shop_id - Low stock alerts',
                        'GET /reports/export/sales/:shop_id - Export sales data'
                    ]
                }
            }
        },
        timestamp: new Date().toISOString()
    });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/shops', shopsRoutes);

// Mount products routes under shops to maintain /shops/:shop_id/products structure
router.use('/shops/:shop_id/products', productsRoutes);

router.use('/cashiers', cashiersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/sales', salesRoutes);
router.use('/reports', reportsRoutes);

module.exports = router;