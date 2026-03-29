const cashiersService = require('./cashiers.service');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/ApiError');



const getCashiersByShop = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const user_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can view shop cashiers');
    }

    const result = await cashiersService.getCashiersByShop({
        shop_id,
        owner_id: user_id
    });

    res.status(200).json({
        success: true,
        message: 'Cashiers retrieved successfully',
        data: result
    });
});

const getCashier = asyncHandler(async (req, res) => {
    const { cashier_id } = req.params;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await cashiersService.getCashier({
        cashier_id,
        user_id,
        user_type
    });

    res.status(200).json({
        success: true,
        message: 'Cashier retrieved successfully',
        data: result
    });
});

const createCashier = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { full_name, username, password } = req.body;
    const user_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can create cashiers');
    }

    const result = await cashiersService.createCashier({
        shop_id,
        owner_id: user_id,
        full_name,
        username,
        password
    });

    res.status(201).json({
        success: true,
        message: 'Cashier created successfully',
        data: result
    });
});

const updateCashier = asyncHandler(async (req, res) => {
    const { cashier_id } = req.params;
    const { full_name, username } = req.body;
    const user_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can update cashier details');
    }

    const result = await cashiersService.updateCashier({
        cashier_id,
        owner_id: user_id,
        full_name,
        username
    });

    res.status(200).json({
        success: true,
        message: 'Cashier updated successfully',
        data: result
    });
});

const updateCashierStatus = asyncHandler(async (req, res) => {
    const { cashier_id } = req.params;
    const { is_active } = req.body;
    const user_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can update cashier status');
    }

    const result = await cashiersService.updateCashierStatus({
        cashier_id,
        owner_id: user_id,
        is_active
    });

    res.status(200).json({
        success: true,
        message: `Cashier ${is_active ? 'activated' : 'deactivated'} successfully`,
        data: result
    });
});

const deleteCashier = asyncHandler(async (req, res) => {
    const { cashier_id } = req.params;
    const user_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can delete cashiers');
    }

    await cashiersService.deleteCashier({
        cashier_id,
        owner_id: user_id
    });

    res.status(200).json({
        success: true,
        message: 'Cashier deleted successfully'
    });
});

const changePassword = asyncHandler(async (req, res) => {
    const { cashier_id } = req.params;
    const { current_password, new_password } = req.body;
    const user_id = req.user.id;
    const user_type = req.user.type;

    // Cashiers can change their own password, owners can change any cashier's password
    const result = await cashiersService.changePassword({
        cashier_id,
        user_id,
        user_type,
        current_password,
        new_password
    });

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});

module.exports = {
    getCashiersByShop,
    getCashier,
    createCashier,
    updateCashier,
    updateCashierStatus,
    deleteCashier,
    changePassword
};