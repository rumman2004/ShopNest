const db = require('../../config/database');
const { ApiError } = require('../../utils/ApiError');

const createShop = async (data) => {
    const { owner_id, shop_name, category, address } = data;
    try {
        const [result] = await db.execute(
            'INSERT INTO shops (owner_id, shop_name, category, address) VALUES (?, ?, ?, ?)',
            [owner_id, shop_name, category, address]
        );

        const [shop] = await db.execute(
            'SELECT * FROM shops WHERE shop_id = ?',
            [result.insertId]
        );

        return shop[0];
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new ApiError(404, 'Owner not found');
        }
        throw error;
    }
};

const getShopsByOwner = async (owner_id) => {
    try {
        // Fixed: use subqueries to avoid COUNT multiplication from multiple JOINs
        const [shops] = await db.execute(
            `SELECT 
                s.*,
                (SELECT COUNT(*) FROM cashiers  c WHERE c.shop_id = s.shop_id AND c.is_active = TRUE) AS cashier_count,
                (SELECT COUNT(*) FROM products  p WHERE p.shop_id = s.shop_id)                        AS product_count
             FROM shops s
             WHERE s.owner_id = ?
             ORDER BY s.created_at DESC`,
            [owner_id]
        );
        return shops;
    } catch (error) {
        throw error;
    }
};

const getShopByCashier = async (cashier_id) => {
    try {
        const [shops] = await db.execute(
            `SELECT s.*
             FROM shops s
             JOIN cashiers c ON s.shop_id = c.shop_id
             WHERE c.cashier_id = ? AND c.is_active = TRUE`,
            [cashier_id]
        );
        return shops;
    } catch (error) {
        throw error;
    }
};

const getShop = async ({ shop_id, user_id, user_type }) => {
    try {
        let query, params;

        if (user_type === 'owner') {
            query = `
                SELECT 
                    s.*,
                    (SELECT COUNT(*) FROM cashiers c WHERE c.shop_id = s.shop_id AND c.is_active = TRUE) AS cashier_count,
                    (SELECT COUNT(*) FROM products p WHERE p.shop_id = s.shop_id)                        AS product_count
                FROM shops s
                WHERE s.shop_id = ? AND s.owner_id = ?`;
            params = [shop_id, user_id];
        } else if (user_type === 'cashier') {
            query = `
                SELECT s.*
                FROM shops s
                JOIN cashiers c ON s.shop_id = c.shop_id
                WHERE s.shop_id = ? AND c.cashier_id = ? AND c.is_active = TRUE`;
            params = [shop_id, user_id];
        } else {
            throw new ApiError(403, 'Access denied');
        }

        const [shops] = await db.execute(query, params);

        if (shops.length === 0) {
            throw new ApiError(404, 'Shop not found or access denied');
        }

        return shops[0];
    } catch (error) {
        throw error;
    }
};

const updateShop = async ({ shop_id, owner_id, shop_name, category, address }) => {
    try {
        const [existing] = await db.execute(
            'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
            [shop_id, owner_id]
        );

        if (existing.length === 0) {
            throw new ApiError(404, 'Shop not found or access denied');
        }

        await db.execute(
            'UPDATE shops SET shop_name = ?, category = ?, address = ? WHERE shop_id = ? AND owner_id = ?',
            [shop_name, category ?? null, address ?? null, shop_id, owner_id]
        );

        const [shop] = await db.execute(
            'SELECT * FROM shops WHERE shop_id = ?',
            [shop_id]
        );

        return shop[0];
    } catch (error) {
        throw error;
    }
};

const deleteShop = async ({ shop_id, owner_id }) => {
    try {
        const [existing] = await db.execute(
            'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
            [shop_id, owner_id]
        );

        if (existing.length === 0) {
            throw new ApiError(404, 'Shop not found or access denied');
        }

        const [sales] = await db.execute(
            'SELECT COUNT(*) AS count FROM sales WHERE shop_id = ?',
            [shop_id]
        );

        if (sales[0].count > 0) {
            throw new ApiError(409, 'Cannot delete shop with existing sales records');
        }

        const [result] = await db.execute(
            'DELETE FROM shops WHERE shop_id = ? AND owner_id = ?',
            [shop_id, owner_id]
        );

        if (result.affectedRows === 0) {
            throw new ApiError(404, 'Shop not found');
        }
    } catch (error) {
        throw error;
    }
};

const activateShop = async ({ shop_id, owner_id }) => {
  console.log('activateShop called with:', { shop_id, owner_id }); // 🔥 Debug

  const [shop] = await db.execute(
    'SELECT * FROM shops WHERE shop_id = ? AND owner_id = ?',
    [shop_id, owner_id]
  );

  if (shop.length === 0) {
    console.log('Shop not found or not owned by user'); // 🔥 Debug
    throw new ApiError(404, 'Shop not found or you do not own it');
  }

  console.log('Attempting to insert/update user_shop_selections'); // 🔥 Debug
  await db.execute(
    `INSERT INTO user_shop_selections (user_id, active_shop_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE active_shop_id = VALUES(active_shop_id)`,
    [owner_id, shop_id]
  );

  return shop[0];
};

// Add this new function to fetch the initial selection on login/load
const getActiveShopForUser = async (owner_id) => {
    const [rows] = await db.execute(
        `SELECT s.* FROM shops s
         JOIN user_shop_selections uss ON s.shop_id = uss.active_shop_id
         WHERE uss.user_id = ?`,
        [owner_id]
    );
    return rows[0] || null;
};

module.exports = {
    createShop,
    getShopsByOwner,
    getShopByCashier,
    getShop,
    updateShop,
    deleteShop,
    activateShop,
    getActiveShopForUser
};