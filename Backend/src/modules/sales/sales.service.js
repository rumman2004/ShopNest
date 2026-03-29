const db = require('../../config/database');
const { ApiError } = require('../../utils/ApiError');

// ✅ Helper: safely convert a Date object or string to 'YYYY-MM-DD'
const toDateString = (value) => {
    if (!value) return null;
    if (value instanceof Date) {
        return value.toISOString().split('T')[0];
    }
    return String(value).split('T')[0];
};

const verifyShopAccess = async (shop_id, user_id, user_type) => {
    if (user_type === 'owner') {
        const [shop] = await db.execute(
            'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
            [shop_id, user_id]
        );
        if (shop.length === 0) throw new ApiError(404, 'Shop not found or access denied');
    } else if (user_type === 'cashier') {
        const [cashier] = await db.execute(
            'SELECT cashier_id FROM cashiers WHERE cashier_id = ? AND shop_id = ? AND is_active = true',
            [user_id, shop_id]
        );
        if (cashier.length === 0) throw new ApiError(404, 'Shop not found or access denied');
    } else {
        throw new ApiError(403, 'Access denied');
    }
};

const getSalesByShop = async (data) => {
    const { shop_id, user_id, user_type, page, limit, sort_by, sort_order } = data;

    try {
        await verifyShopAccess(shop_id, user_id, user_type);

        // ✅ FIX: Force strict integers to prevent NaN and ER_WRONG_ARGUMENTS
        const limitInt  = Math.max(1, parseInt(limit, 10) || 10);
        const pageInt   = Math.max(1, parseInt(page, 10) || 1);
        const offsetInt = Math.max(0, (pageInt - 1) * limitInt);

        const validSortColumns = ['sale_date', 'total_amount', 'sale_id'];
        const sortColumn    = validSortColumns.includes(sort_by) ? sort_by : 'sale_date';
        const sortDirection = sort_order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        // ✅ FIX: Inject limitInt and offsetInt directly
        const [sales] = await db.execute(
            `SELECT 
                s.sale_id,
                s.total_amount,
                s.sale_date,
                s.tendered_amount,
                c.full_name as cashier_name,
                COUNT(si.sale_item_id) as item_count
             FROM sales s
             JOIN cashiers c ON s.cashier_id = c.cashier_id
             LEFT JOIN sale_items si ON s.sale_id = si.sale_id
             WHERE s.shop_id = ?
             GROUP BY s.sale_id
             ORDER BY s.${sortColumn} ${sortDirection}
             LIMIT ${limitInt} OFFSET ${offsetInt}`,
            [shop_id] // Removed limit and offset from here
        );

        const [countResult] = await db.execute(
            'SELECT COUNT(*) as total FROM sales WHERE shop_id = ?',
            [shop_id]
        );

        const total      = countResult[0].total;
        const totalPages = Math.ceil(total / limitInt);

        return {
            sales,
            pagination: {
                currentPage:  pageInt,
                totalPages,
                totalItems:   total,
                itemsPerPage: limitInt,
                hasNextPage:  pageInt < totalPages,
                hasPrevPage:  pageInt > 1,
            },
        };
    } catch (error) {
        throw error;
    }
};

const getSale = async (data) => {
    const { sale_id, user_id, user_type } = data;

    try {
        const [sales] = await db.execute(
            `SELECT 
                s.*,
                c.full_name as cashier_name,
                sh.shop_name
             FROM sales s
             JOIN cashiers c ON s.cashier_id = c.cashier_id
             JOIN shops sh ON s.shop_id = sh.shop_id
             WHERE s.sale_id = ?`,
            [sale_id]
        );

        if (sales.length === 0) throw new ApiError(404, 'Sale not found');

        const sale = sales[0];
        await verifyShopAccess(sale.shop_id, user_id, user_type);

        const [saleItems] = await db.execute(
            `SELECT 
                si.*,
                p.product_name,
                p.image_url
             FROM sale_items si
             JOIN products p ON si.product_id = p.product_id
             WHERE si.sale_id = ?
             ORDER BY si.sale_item_id`,
            [sale_id]
        );

        return { ...sale, items: saleItems };
    } catch (error) {
        throw error;
    }
};

const createSale = async (data) => {
    const { shop_id, cashier_id, items, tendered_amount } = data;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [cashierCheck] = await connection.execute(
            'SELECT cashier_id FROM cashiers WHERE cashier_id = ? AND shop_id = ? AND is_active = true',
            [cashier_id, shop_id]
        );

        if (cashierCheck.length === 0) {
            throw new ApiError(403, 'Cashier not found or not authorized for this shop');
        }

        let total_amount = 0;
        const validatedItems = [];

        for (const item of items) {
            const [product] = await connection.execute(
                'SELECT product_id, product_name, price, stock_quantity FROM products WHERE product_id = ? AND shop_id = ?',
                [item.product_id, shop_id]
            );

            if (product.length === 0) {
                throw new ApiError(404, `Product with ID ${item.product_id} not found`);
            }

            const productData = product[0];

            if (productData.stock_quantity < item.quantity) {
                throw new ApiError(400,
                    `Insufficient stock for ${productData.product_name}. ` +
                    `Available: ${productData.stock_quantity}, Required: ${item.quantity}`
                );
            }

            const unit_price = item.unit_price || productData.price;
            const subtotal   = unit_price * item.quantity;
            total_amount    += subtotal;

            validatedItems.push({
                product_id:    item.product_id,
                quantity:      item.quantity,
                unit_price,
                subtotal,
                current_stock: productData.stock_quantity,
            });
        }

        const [saleResult] = await connection.execute(
            'INSERT INTO sales (shop_id, cashier_id, total_amount, tendered_amount) VALUES (?, ?, ?, ?)',
            [shop_id, cashier_id, total_amount, tendered_amount ?? null]
        );

        const sale_id = saleResult.insertId;

        for (const item of validatedItems) {
            await connection.execute(
                'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
                [sale_id, item.product_id, item.quantity, item.unit_price, item.subtotal]
            );
            await connection.execute(
                'UPDATE products SET stock_quantity = ? WHERE product_id = ?',
                [item.current_stock - item.quantity, item.product_id]
            );
        }

        await connection.commit();

        const [createdSale] = await db.execute(
            `SELECT s.*, c.full_name as cashier_name
             FROM sales s
             JOIN cashiers c ON s.cashier_id = c.cashier_id
             WHERE s.sale_id = ?`,
            [sale_id]
        );

        const [createdSaleItems] = await db.execute(
            `SELECT si.*, p.product_name, p.price
             FROM sale_items si
             JOIN products p ON si.product_id = p.product_id
             WHERE si.sale_id = ?`,
            [sale_id]
        );

        return { ...createdSale[0], items: createdSaleItems };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getSalesByCashier = async (data) => {
    const { cashier_id, user_id, user_type, page, limit, start_date, end_date } = data;

    try {
        if (user_type === 'cashier' && cashier_id != user_id) {
            throw new ApiError(403, 'Cashiers can only view their own sales');
        }

        if (user_type === 'owner') {
            const [cashierCheck] = await db.execute(
                `SELECT c.cashier_id 
                 FROM cashiers c 
                 JOIN shops s ON c.shop_id = s.shop_id 
                 WHERE c.cashier_id = ? AND s.owner_id = ?`,
                [cashier_id, user_id]
            );
            if (cashierCheck.length === 0) {
                throw new ApiError(404, 'Cashier not found or access denied');
            }
        }

        const startStr = toDateString(start_date);
        const endStr   = toDateString(end_date);

        let whereClause = 'WHERE s.cashier_id = ?';
        let queryParams = [cashier_id];

        if (startStr && endStr) {
            whereClause += ' AND DATE(s.sale_date) BETWEEN ? AND ?';
            queryParams.push(startStr, endStr);
        }

        // ✅ FIX: Force strict integers to prevent NaN and ER_WRONG_ARGUMENTS
        const limitInt  = Math.max(1, parseInt(limit, 10) || 10);
        const pageInt   = Math.max(1, parseInt(page, 10) || 1);
        const offsetInt = Math.max(0, (pageInt - 1) * limitInt);

        // ✅ FIX: Inject limitInt and offsetInt directly
        const [sales] = await db.execute(
            `SELECT 
                s.sale_id,
                s.total_amount,
                s.sale_date,
                COUNT(si.sale_item_id) as item_count
             FROM sales s
             LEFT JOIN sale_items si ON s.sale_id = si.sale_id
             ${whereClause}
             GROUP BY s.sale_id
             ORDER BY s.sale_date DESC
             LIMIT ${limitInt} OFFSET ${offsetInt}`,
            queryParams // Removed limit and offset from here
        );

        const [countResult] = await db.execute(
            `SELECT COUNT(*) as total FROM sales s ${whereClause}`,
            queryParams
        );

        const total      = countResult[0].total;
        const totalPages = Math.ceil(total / limitInt);

        return {
            sales,
            pagination: {
                currentPage:  pageInt,
                totalPages,
                totalItems:   total,
                itemsPerPage: limitInt,
                hasNextPage:  pageInt < totalPages,
                hasPrevPage:  pageInt > 1,
            },
        };
    } catch (error) {
        throw error;
    }
};

const getSalesByDateRange = async (data) => {
    const { shop_id, user_id, user_type, start_date, end_date, page, limit } = data;

    try {
        await verifyShopAccess(shop_id, user_id, user_type);

        const pageInt = Math.max(1, parseInt(page, 10) || 1);
        const limitInt = Math.max(1, parseInt(limit, 10) || 10);
        const offsetInt = Math.max(0, (pageInt - 1) * limitInt);

        const [sales] = await db.execute(
            `SELECT 
                s.sale_id,
                s.total_amount,
                s.sale_date,
                s.tendered_amount,
                c.full_name AS cashier_name,
                COUNT(si.sale_item_id) AS item_count
             FROM sales s
             JOIN cashiers c ON s.cashier_id = c.cashier_id
             LEFT JOIN sale_items si ON s.sale_id = si.sale_id
             WHERE s.shop_id = ? AND DATE(s.sale_date) BETWEEN ? AND ?
             GROUP BY s.sale_id, s.total_amount, s.sale_date, s.tendered_amount, c.full_name
             ORDER BY s.sale_date DESC
             LIMIT ${limitInt} OFFSET ${offsetInt}`,
            [shop_id, start_date, end_date]
        );

        const [statsResult] = await db.execute(
            `SELECT 
                COUNT(*) AS total_sales,
                COALESCE(SUM(total_amount), 0) AS total_revenue,
                MAX(sale_date) AS last_sale_time
             FROM sales
             WHERE shop_id = ? AND DATE(sale_date) BETWEEN ? AND ?`,
            [shop_id, start_date, end_date]
        );

        const totalSales = parseInt(statsResult[0].total_sales, 10) || 0;
        const totalPages = Math.ceil(totalSales / limitInt);

        return {
            sales,
            total_sales: totalSales,
            total_revenue: parseFloat(statsResult[0].total_revenue) || 0,
            last_sale_time: statsResult[0].last_sale_time || null,
            pagination: {
                currentPage: pageInt,
                totalPages,
                totalItems: totalSales,
                itemsPerPage: limitInt,
                hasNextPage: pageInt < totalPages,
                hasPrevPage: pageInt > 1
            }
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getSalesByShop,
    getSale,
    createSale,
    getSalesByCashier,
    getSalesByDateRange,
};