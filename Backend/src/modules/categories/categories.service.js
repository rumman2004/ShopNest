const db = require('../../config/database');
const { ApiError } = require('../../utils/ApiError');

const verifyShopAccess = async (shop_id, user_id, user_type) => {
    if (user_type === 'owner') {
        const [shop] = await db.execute(
            'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
            [shop_id, user_id]
        );
        if (shop.length === 0) {
            throw new ApiError(404, 'Shop not found or access denied');
        }
    } else if (user_type === 'cashier') {
        const [cashier] = await db.execute(
            'SELECT cashier_id FROM cashiers WHERE cashier_id = ? AND shop_id = ? AND is_active = true',
            [user_id, shop_id]
        );
        if (cashier.length === 0) {
            throw new ApiError(404, 'Shop not found or access denied');
        }
    } else {
        throw new ApiError(403, 'Access denied');
    }
};

const getCategoriesByShop = async (data) => {
    const { shop_id, user_id, user_type } = data;

    try {
        // Verify access to shop
        await verifyShopAccess(shop_id, user_id, user_type);

        const [categories] = await db.execute(
            `SELECT 
                c.category_id,
                c.category_name,
                c.description,
                c.created_at,
                COUNT(p.product_id) as product_count
             FROM categories c
             LEFT JOIN products p ON c.category_id = p.category_id
             WHERE c.shop_id = ?
             GROUP BY c.category_id
             ORDER BY c.category_name`,
            [shop_id]
        );

        return categories;

    } catch (error) {
        throw error;
    }
};

const createCategory = async (data) => {
    const { shop_id, category_name, description, user_id, user_type } = data;

    try {
        // Verify access to shop
        await verifyShopAccess(shop_id, user_id, user_type);

        // Check if category name already exists in this shop
        const [existingCategory] = await db.execute(
            'SELECT category_id FROM categories WHERE shop_id = ? AND category_name = ?',
            [shop_id, category_name]
        );

        if (existingCategory.length > 0) {
            throw new ApiError(409, 'Category name already exists in this shop');
        }

        const [result] = await db.execute(
            'INSERT INTO categories (shop_id, category_name, description) VALUES (?, ?, ?)',
            [shop_id, category_name, description]
        );

        const category_id = result.insertId;

        // Get the created category
        const [category] = await db.execute(
            'SELECT * FROM categories WHERE category_id = ?',
            [category_id]
        );

        return category[0];

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, 'Category name already exists in this shop');
        }
        throw error;
    }
};

const updateCategory = async (data) => {
    const { category_id, category_name, description, user_id, user_type } = data;

    try {
        // Get category and verify access
        const [existingCategory] = await db.execute(
            'SELECT shop_id FROM categories WHERE category_id = ?',
            [category_id]
        );

        if (existingCategory.length === 0) {
            throw new ApiError(404, 'Category not found');
        }

        const shop_id = existingCategory[0].shop_id;
        await verifyShopAccess(shop_id, user_id, user_type);

        // Check if new category name already exists in this shop (excluding current category)
        if (category_name) {
            const [nameCheck] = await db.execute(
                'SELECT category_id FROM categories WHERE shop_id = ? AND category_name = ? AND category_id != ?',
                [shop_id, category_name, category_id]
            );

            if (nameCheck.length > 0) {
                throw new ApiError(409, 'Category name already exists in this shop');
            }
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];

        if (category_name !== undefined) {
            updateFields.push('category_name = ?');
            updateValues.push(category_name);
        }

        if (description !== undefined) {
            updateFields.push('description = ?');
            updateValues.push(description);
        }

        if (updateFields.length === 0) {
            throw new ApiError(400, 'No fields to update');
        }

        updateValues.push(category_id);

        const [result] = await db.execute(
            `UPDATE categories SET ${updateFields.join(', ')} WHERE category_id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            throw new ApiError(404, 'Category not found');
        }

        // Get updated category
        const [updatedCategory] = await db.execute(
            'SELECT * FROM categories WHERE category_id = ?',
            [category_id]
        );

        return updatedCategory[0];

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, 'Category name already exists in this shop');
        }
        throw error;
    }
};

const deleteCategory = async (data) => {
    const { category_id, user_id, user_type } = data;

    try {
        // Get category and verify access
        const [existingCategory] = await db.execute(
            'SELECT shop_id FROM categories WHERE category_id = ?',
            [category_id]
        );

        if (existingCategory.length === 0) {
            throw new ApiError(404, 'Category not found');
        }

        const shop_id = existingCategory[0].shop_id;
        await verifyShopAccess(shop_id, user_id, user_type);

        // Check if category has products
        const [productsCheck] = await db.execute(
            'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
            [category_id]
        );

        if (productsCheck[0].count > 0) {
            throw new ApiError(409, 'Cannot delete category with existing products');
        }

        const [result] = await db.execute(
            'DELETE FROM categories WHERE category_id = ?',
            [category_id]
        );

        if (result.affectedRows === 0) {
            throw new ApiError(404, 'Category not found');
        }

    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCategoriesByShop,
    createCategory,
    updateCategory,
    deleteCategory
};