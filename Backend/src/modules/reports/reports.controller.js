const reportsService = require('./reports.service');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/ApiError');

// ✅ Dashboard Stats - Fixed message
const getDashboardStats = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { start_date, end_date } = req.query; 
    const user_id = req.user.id;
    const user_type = req.user.type;

    if (!start_date || !end_date) {
        throw new ApiError(400, 'start_date and end_date are required');
    }

    const result = await reportsService.getDashboardStats({
        shop_id,
        user_id,
        user_type,
        start_date,
        end_date
    });

    res.status(200).json({
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: result
    });
});

// ✅ Export Sales - Correctly returns JSON
const exportSalesData = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { start_date, end_date, format = 'csv' } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await reportsService.exportSalesData({
        shop_id, 
        user_id, 
        user_type, 
        start_date, 
        end_date, 
        format
    });

    // ALWAYS return JSON - Frontend needs this structure
    res.status(200).json({
        success: true,
        message: 'Sales data exported successfully',
        data: result // Contains { format, filename, content }
    });
});

const getSalesAnalytics = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { start_date, end_date, group_by = 'day' } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await reportsService.getSalesAnalytics({
        shop_id,
        user_id,
        user_type,
        start_date,
        end_date,
        group_by
    });

    res.status(200).json({
        success: true,
        message: 'Sales analytics retrieved successfully',
        data: result
    });
});

const getTopProducts = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { period = '30d', limit = 10, sort_by = 'quantity' } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await reportsService.getTopProducts({
        shop_id,
        user_id,
        user_type,
        period,
        limit: parseInt(limit),
        sort_by
    });

    res.status(200).json({
        success: true,
        message: 'Top products retrieved successfully',
        data: result
    });
});

const getInventoryReport = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { category_id, sort_by = 'stock_quantity', sort_order = 'asc' } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await reportsService.getInventoryReport({
        shop_id,
        user_id,
        user_type,
        category_id: category_id ? parseInt(category_id) : null,
        sort_by,
        sort_order
    });

    res.status(200).json({
        success: true,
        message: 'Inventory report retrieved successfully',
        data: result
    });
});

const getCashierPerformance = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { start_date, end_date } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can view cashier performance reports');
    }

    const result = await reportsService.getCashierPerformance({
        shop_id,
        owner_id: user_id,
        start_date,
        end_date
    });

    res.status(200).json({
        success: true,
        message: 'Cashier performance retrieved successfully',
        data: result
    });
});

const getRevenueTrends = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { period = '30d', interval = 'daily' } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await reportsService.getRevenueTrends({
        shop_id,
        user_id,
        user_type,
        period,
        interval
    });

    res.status(200).json({
        success: true,
        message: 'Revenue trends retrieved successfully',
        data: result
    });
});

const getLowStockReport = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { threshold = 10 } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await reportsService.getLowStockReport({
        shop_id,
        user_id,
        user_type,
        threshold: parseInt(threshold)
    });

    res.status(200).json({
        success: true,
        message: 'Low stock report retrieved successfully',
        data: result
    });
});

module.exports = {
    getDashboardStats,
    getSalesAnalytics,
    getTopProducts,
    getInventoryReport,
    getCashierPerformance,
    getRevenueTrends,
    getLowStockReport,
    exportSalesData
};