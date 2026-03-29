const authService = require('./auth.service');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/ApiError');

const registerOwner = asyncHandler(async (req, res) => {
    const { full_name, email, password } = req.body;
    
    const result = await authService.registerOwner({
        full_name,
        email,
        password
    });

    res.status(201).json({
        success: true,
        message: 'Owner registered successfully',
        data: result
    });
});

const registerCashier = asyncHandler(async (req, res) => {
    const { shop_id, full_name, username, password } = req.body;
    const owner_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can register cashiers');
    }

    const result = await authService.registerCashier({
        shop_id,
        full_name,
        username,
        password,
        owner_id
    });

    res.status(201).json({
        success: true,
        message: 'Cashier registered successfully',
        data: result
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    
    const result = await authService.login({
        email,
        username,
        password
    });

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: result.user,
            accessToken: result.accessToken
        }
    });
});

const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
        throw new ApiError(401, 'Refresh token not found');
    }

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
            accessToken: result.accessToken
        }
    });
});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie('refreshToken');
    
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Add these methods to your existing auth.controller.js

const getMe = asyncHandler(async (req, res) => {
    // req.user is populated by authenticate middleware
    res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: {
            user: req.user
        }
    });
});

const changePassword = asyncHandler(async (req, res) => {
    const { current_password, new_password } = req.body;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await authService.changePassword({
        user_id,
        user_type,
        current_password,
        new_password
    });

    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        data: result
    });
});

// Update your existing exports
module.exports = {
    registerOwner,
    registerCashier,
    login,
    getMe,           // Add this
    changePassword,  // Add this
    refreshToken,
    logout
};
