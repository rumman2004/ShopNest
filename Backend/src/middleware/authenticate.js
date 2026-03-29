const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { ApiError } = require('../utils/ApiError');
const { asyncHandler } = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Access token is required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user still exists and is active
        let user = null;
        
        if (decoded.type === 'owner') {
            const [owners] = await db.execute(
                'SELECT owner_id as id, full_name, email FROM owners WHERE owner_id = ?',
                [decoded.id]
            );
            user = owners[0];
        } else if (decoded.type === 'cashier') {
            const [cashiers] = await db.execute(
                'SELECT cashier_id as id, full_name, username, shop_id FROM cashiers WHERE cashier_id = ? AND is_active = true',
                [decoded.id]
            );
            user = cashiers[0];
        }

        if (!user) {
            throw new ApiError(401, 'User not found or inactive');
        }

        req.user = {
            id: user.id,
            type: decoded.type,
            ...(decoded.type === 'owner' ? { email: user.email } : { 
                username: user.username, 
                shop_id: user.shop_id 
            }),
            full_name: user.full_name
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, 'Invalid access token');
        }
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Access token expired');
        }
        throw error;
    }
});

module.exports = { authenticate };