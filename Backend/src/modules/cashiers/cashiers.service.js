const bcrypt = require('bcryptjs');
const db = require('../../config/database');
const { ApiError } = require('../../utils/ApiError');

const getCashiersByShop = async (data) => {
    const { shop_id, owner_id } = data;

    try {
        // Verify shop belongs to owner
        const [shop] = await db.execute(
            'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
            [shop_id, owner_id]
        );

        if (shop.length === 0) {
            throw new ApiError(404, 'Shop not found or access denied');
        }

        // Get cashiers for the shop
        const [cashiers] = await db.execute(
            `SELECT 
                c.cashier_id,
                c.full_name,
                c.username,
                c.is_active,
                s.shop_name,
                COUNT(sa.sale_id) as total_sales,
                COALESCE(SUM(sa.total_amount), 0) as total_sales_amount
             FROM cashiers c
             JOIN shops s ON c.shop_id = s.shop_id
             LEFT JOIN sales sa ON c.cashier_id = sa.cashier_id
             WHERE c.shop_id = ?
             GROUP BY c.cashier_id
             ORDER BY c.full_name`,
            [shop_id]
        );

        return cashiers;

    } catch (error) {
        throw error;
    }
};

const getCashier = async (data) => {
    const { cashier_id, user_id, user_type } = data;

    try {
        let query;
        let params;

        if (user_type === 'owner') {
            query = `
                SELECT 
                    c.cashier_id,
                    c.full_name,
                    c.username,
                    c.is_active,
                    s.shop_id,
                    s.shop_name,
                    COUNT(sa.sale_id) as total_sales,
                    COALESCE(SUM(sa.total_amount), 0) as total_sales_amount
                FROM cashiers c
                JOIN shops s ON c.shop_id = s.shop_id
                LEFT JOIN sales sa ON c.cashier_id = sa.cashier_id
                WHERE c.cashier_id = ? AND s.owner_id = ?
                GROUP BY c.cashier_id
            `;
            params = [cashier_id, user_id];
        } else if (user_type === 'cashier') {
            // Cashiers can only view their own details
            query = `
                SELECT 
                    c.cashier_id,
                    c.full_name,
                    c.username,
                    c.is_active,
                    s.shop_id,
                    s.shop_name,
                    COUNT(sa.sale_id) as total_sales,
                    COALESCE(SUM(sa.total_amount), 0) as total_sales_amount
                FROM cashiers c
                JOIN shops s ON c.shop_id = s.shop_id
                LEFT JOIN sales sa ON c.cashier_id = sa.cashier_id
                WHERE c.cashier_id = ? AND c.cashier_id = ?
                GROUP BY c.cashier_id
            `;
            params = [cashier_id, user_id];
        } else {
            throw new ApiError(403, 'Access denied');
        }

        const [cashiers] = await db.execute(query, params);

        if (cashiers.length === 0) {
            throw new ApiError(404, 'Cashier not found or access denied');
        }

        return cashiers[0];

    } catch (error) {
        throw error;
    }
};

const createCashier = async (data) => {
    const { shop_id, owner_id, full_name, username, password } = data;

    // Verify shop belongs to owner
    const [shop] = await db.execute(
        'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
        [shop_id, owner_id]
    );
    if (shop.length === 0) throw new ApiError(404, 'Shop not found or access denied');

    // Check if username exists globally
    const [existing] = await db.execute('SELECT cashier_id FROM cashiers WHERE username = ?', [username]);
    if (existing.length > 0) throw new ApiError(409, 'Username already exists');

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
        'INSERT INTO cashiers (shop_id, full_name, username, password_hash, is_active) VALUES (?, ?, ?, ?, true)',
        [shop_id, full_name, username, password_hash]
    );

    const [newCashier] = await db.execute(
        'SELECT cashier_id, full_name, username, is_active FROM cashiers WHERE cashier_id = ?',
        [result.insertId]
    );

    return newCashier[0];
};

const updateCashier = async (data) => {
    const { cashier_id, owner_id, full_name, username } = data;

    try {
        // Check if cashier exists and belongs to owner's shop
        const [existingCashier] = await db.execute(
            `SELECT c.cashier_id 
             FROM cashiers c 
             JOIN shops s ON c.shop_id = s.shop_id 
             WHERE c.cashier_id = ? AND s.owner_id = ?`,
            [cashier_id, owner_id]
        );

        if (existingCashier.length === 0) {
            throw new ApiError(404, 'Cashier not found or access denied');
        }

        // Check if username is unique (excluding current cashier)
        if (username) {
            const [usernameCheck] = await db.execute(
                'SELECT cashier_id FROM cashiers WHERE username = ? AND cashier_id != ?',
                [username, cashier_id]
            );

            if (usernameCheck.length > 0) {
                throw new ApiError(409, 'Username already exists');
            }
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];

        if (full_name !== undefined) {
            updateFields.push('full_name = ?');
            updateValues.push(full_name);
        }

        if (username !== undefined) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }

        if (updateFields.length === 0) {
            throw new ApiError(400, 'No fields to update');
        }

        updateValues.push(cashier_id);

        const [result] = await db.execute(
            `UPDATE cashiers SET ${updateFields.join(', ')} WHERE cashier_id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            throw new ApiError(404, 'Cashier not found');
        }

        // Get updated cashier
        const [updatedCashier] = await db.execute(
            `SELECT c.cashier_id, c.full_name, c.username, c.is_active, s.shop_name
             FROM cashiers c
             JOIN shops s ON c.shop_id = s.shop_id
             WHERE c.cashier_id = ?`,
            [cashier_id]
        );

        return updatedCashier[0];

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, 'Username already exists');
        }
        throw error;
    }
};

const updateCashierStatus = async (data) => {
    const { cashier_id, owner_id, is_active } = data;

    try {
        // Check if cashier exists and belongs to owner's shop
        const [existingCashier] = await db.execute(
            `SELECT c.cashier_id 
             FROM cashiers c 
             JOIN shops s ON c.shop_id = s.shop_id 
             WHERE c.cashier_id = ? AND s.owner_id = ?`,
            [cashier_id, owner_id]
        );

        if (existingCashier.length === 0) {
            throw new ApiError(404, 'Cashier not found or access denied');
        }

        const [result] = await db.execute(
            'UPDATE cashiers SET is_active = ? WHERE cashier_id = ?',
            [is_active, cashier_id]
        );

        if (result.affectedRows === 0) {
            throw new ApiError(404, 'Cashier not found');
        }

        // Get updated cashier
        const [updatedCashier] = await db.execute(
            `SELECT c.cashier_id, c.full_name, c.username, c.is_active, s.shop_name
             FROM cashiers c
             JOIN shops s ON c.shop_id = s.shop_id
             WHERE c.cashier_id = ?`,
            [cashier_id]
        );

        return updatedCashier[0];

    } catch (error) {
        throw error;
    }
};

const deleteCashier = async (data) => {
    const { cashier_id, owner_id } = data;

    try {
        // Check if cashier exists and belongs to owner's shop
        const [existingCashier] = await db.execute(
            `SELECT c.cashier_id 
             FROM cashiers c 
             JOIN shops s ON c.shop_id = s.shop_id 
             WHERE c.cashier_id = ? AND s.owner_id = ?`,
            [cashier_id, owner_id]
        );

        if (existingCashier.length === 0) {
            throw new ApiError(404, 'Cashier not found or access denied');
        }

        // Check if cashier has sales records
        const [salesCheck] = await db.execute(
            'SELECT COUNT(*) as count FROM sales WHERE cashier_id = ?',
            [cashier_id]
        );

        if (salesCheck[0].count > 0) {
            throw new ApiError(409, 'Cannot delete cashier with existing sales records. Consider deactivating instead.');
        }

        const [result] = await db.execute(
            'DELETE FROM cashiers WHERE cashier_id = ?',
            [cashier_id]
        );

        if (result.affectedRows === 0) {
            throw new ApiError(404, 'Cashier not found');
        }

    } catch (error) {
        throw error;
    }
};

const changePassword = async (data) => {
    const { cashier_id, user_id, user_type, current_password, new_password } = data;

    try {
        let cashier;

        if (user_type === 'cashier' && cashier_id != user_id) {
            throw new ApiError(403, 'Cashiers can only change their own password');
        }

        if (user_type === 'owner') {
            // Owner changing cashier password - verify ownership
            const [ownerCheck] = await db.execute(
                `SELECT c.cashier_id, c.password_hash
                 FROM cashiers c 
                 JOIN shops s ON c.shop_id = s.shop_id 
                 WHERE c.cashier_id = ? AND s.owner_id = ?`,
                [cashier_id, user_id]
            );

            if (ownerCheck.length === 0) {
                throw new ApiError(404, 'Cashier not found or access denied');
            }
            cashier = ownerCheck[0];
        } else {
            // Cashier changing own password
            const [cashierCheck] = await db.execute(
                'SELECT cashier_id, password_hash FROM cashiers WHERE cashier_id = ?',
                [cashier_id]
            );

            if (cashierCheck.length === 0) {
                throw new ApiError(404, 'Cashier not found');
            }
            cashier = cashierCheck[0];

            // Verify current password for cashier
            if (current_password) {
                const isValidPassword = await bcrypt.compare(current_password, cashier.password_hash);
                if (!isValidPassword) {
                    throw new ApiError(401, 'Current password is incorrect');
                }
            } else {
                throw new ApiError(400, 'Current password is required');
            }
        }

        // Hash new password
        const saltRounds = 12;
        const new_password_hash = await bcrypt.hash(new_password, saltRounds);

        // Update password
        const [result] = await db.execute(
            'UPDATE cashiers SET password_hash = ? WHERE cashier_id = ?',
            [new_password_hash, cashier_id]
        );

        if (result.affectedRows === 0) {
            throw new ApiError(404, 'Cashier not found');
        }

    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCashiersByShop,
    getCashier,
    createCashier,
    updateCashier,
    updateCashierStatus,
    deleteCashier,
    changePassword
};