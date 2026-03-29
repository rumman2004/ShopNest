const express = require('express');
const reportsController = require('./reports.controller');
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Dashboard overview
router.get('/dashboard/:shop_id', reportsController.getDashboardStats);

// Sales analytics
router.get('/sales-analytics/:shop_id', reportsController.getSalesAnalytics);

// Top selling products
router.get('/top-products/:shop_id', reportsController.getTopProducts);

// Inventory report
router.get('/inventory/:shop_id', reportsController.getInventoryReport);

// Cashier performance
router.get('/cashier-performance/:shop_id', reportsController.getCashierPerformance);

// Revenue trends
router.get('/revenue-trends/:shop_id', reportsController.getRevenueTrends);

// Low stock alerts
router.get('/low-stock/:shop_id', reportsController.getLowStockReport);

// Export sales data
router.get('/export/sales/:shop_id', reportsController.exportSalesData);

module.exports = router;