const salesService = require('./sales.service');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/ApiError');

const getSalesByShop = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { page = 1, limit = 10, sort_by = 'sale_date', sort_order = 'desc' } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await salesService.getSalesByShop({
        shop_id,
        user_id,
        user_type,
        page: parseInt(page),
        limit: parseInt(limit),
        sort_by,
        sort_order
    });

    res.status(200).json({
        success: true,
        message: 'Sales retrieved successfully',
        data: result
    });
});

const getSale = asyncHandler(async (req, res) => {
    const { sale_id } = req.params;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await salesService.getSale({
        sale_id,
        user_id,
        user_type
    });

    res.status(200).json({
        success: true,
        message: 'Sale retrieved successfully',
        data: result
    });
});

const createSale = asyncHandler(async (req, res) => {
    // ✅ ADD: destructure tendered_amount from body
    const { shop_id, items, tendered_amount } = req.body;
    const user_id   = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'cashier') {
        throw new ApiError(403, 'Only cashiers can create sales');
    }

    const result = await salesService.createSale({
        shop_id,
        cashier_id: user_id,
        items,
        tendered_amount, // ✅ ADD: pass it to service so it's stored/returned
    });

    res.status(201).json({
        success: true,
        message: 'Sale created successfully',
        data: result
    });
});

const getSalesByCashier = asyncHandler(async (req, res) => {
    const { cashier_id } = req.params;
    const { page = 1, limit = 10, start_date, end_date } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await salesService.getSalesByCashier({
        cashier_id,
        user_id,
        user_type,
        page: parseInt(page),
        limit: parseInt(limit),
        start_date,
        end_date
    });

    res.status(200).json({
        success: true,
        message: 'Cashier sales retrieved successfully',
        data: result
    });
});

const getSalesByDateRange = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { start_date, end_date, page = 1, limit = 10 } = req.query;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await salesService.getSalesByDateRange({
        shop_id,
        user_id,
        user_type,
        start_date,
        end_date,
        page: parseInt(page),
        limit: parseInt(limit)
    });

    res.status(200).json({
        success: true,
        message: 'Sales by date range retrieved successfully',
        data: result
    });
});

module.exports = {
    getSalesByShop,
    getSale,
    createSale,
    getSalesByCashier,
    getSalesByDateRange
};