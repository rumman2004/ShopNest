const ApiError = require('../utils/ApiError');
const pool = require('../config/database');

const validateShopAccess = async (req, res, next) => {
    try {
        const shopIdToCheck =
            req.params.shopId   || req.params.shop_id  ||
            req.query.shopId    || req.query.shop_id   ||
            req.body.shopId     || req.body.shop_id;

        const user = req.user;

        if (!shopIdToCheck) return next();

        // ✅ FIXED: was user.role === 'cashier' which is always false
        if (user.type === 'cashier') {
            if (parseInt(shopIdToCheck) !== parseInt(user.shop_id)) {
                throw new ApiError(403, 'Unauthorized: You do not have access to this shop');
            }
        // ✅ FIXED: simplified to just user.type === 'owner'
        } else if (user.type === 'owner') {
            const [rows] = await pool.execute(
                'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
                [shopIdToCheck, user.id]
            );
            if (rows.length === 0) {
                throw new ApiError(403, 'Unauthorized: You do not own this shop');
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateShopAccess;