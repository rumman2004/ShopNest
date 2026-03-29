const db = require('../../config/database'); // Fixed path: ../../config/database
const { ApiError } = require('../../utils/ApiError'); // Fixed path: ../../utils/ApiError

// Helper function to verify shop access
const verifyShopAccess = async (shop_id, user_id, user_type) => {
    if (user_type === 'cashier') {
        const [cashier] = await db.execute(
            'SELECT shop_id FROM cashiers WHERE cashier_id = ? AND is_active = true',
            [user_id]
        );
        
        if (cashier.length === 0 || parseInt(cashier[0].shop_id) !== parseInt(shop_id)) {
            throw new ApiError(403, 'Unauthorized: You do not have access to this shop');
        }
    } else if (user_type === 'owner') {
        const [shop] = await db.execute(
            'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
            [shop_id, user_id]
        );
        
        if (shop.length === 0) {
            throw new ApiError(403, 'Unauthorized: You do not own this shop');
        }
    } else {
        throw new ApiError(400, 'Invalid user type');
    }
};

// Get dashboard statistics
const getDashboardStats = async (data) => {
    const { shop_id, user_id, user_type, start_date, end_date } = data;

    try {
        await verifyShopAccess(shop_id, user_id, user_type);

        // ✅ FIX 1: Calculate Sales, Revenue, and Average WITHOUT JOINING sale_items.
        // This prevents total_amount from duplicating if a sale has multiple items.
        const [salesStats] = await db.execute(
            `SELECT
                COUNT(sale_id) AS total_sales,
                COALESCE(SUM(total_amount), 0) AS total_revenue,
                COALESCE(AVG(total_amount), 0) AS avg_sale
             FROM sales
             WHERE shop_id = ?
               AND DATE(sale_date) BETWEEN ? AND ?`,
            [shop_id, start_date, end_date]
        );

        // ✅ FIX 2: Calculate Profit separately by joining the items.
        const [profitStats] = await db.execute(
            `SELECT
                COALESCE(
                    SUM(
                        (si.unit_price - p.cost_price) * si.quantity
                    ),
                    0
                ) AS total_profit
             FROM sales s
             JOIN sale_items si ON s.sale_id = si.sale_id
             JOIN products p ON si.product_id = p.product_id
             WHERE s.shop_id = ?
               AND DATE(s.sale_date) BETWEEN ? AND ?`,
            [shop_id, start_date, end_date]
        );

        // ✅ Daily revenue (for chart)
        const [dailyRevenue] = await db.execute(
            `SELECT
                DATE(s.sale_date) AS date,
                SUM(s.total_amount) AS revenue
             FROM sales s
             WHERE s.shop_id = ?
               AND DATE(s.sale_date) BETWEEN ? AND ?
             GROUP BY DATE(s.sale_date)
             ORDER BY date ASC`,
            [shop_id, start_date, end_date]
        );

        // ✅ Top products (by quantity sold)
        const [topProducts] = await db.execute(
            `SELECT
                p.product_name,
                SUM(si.quantity) AS quantity_sold
             FROM sale_items si
             JOIN sales s ON si.sale_id = s.sale_id
             JOIN products p ON si.product_id = p.product_id
             WHERE s.shop_id = ?
               AND DATE(s.sale_date) BETWEEN ? AND ?
             GROUP BY p.product_id
             ORDER BY quantity_sold DESC
             LIMIT 5`,
            [shop_id, start_date, end_date]
        );

        // ✅ Recent sales
        const [recentSales] = await db.execute(
            `SELECT
                s.sale_id,
                s.total_amount,
                s.sale_date,
                c.full_name AS cashier_name
             FROM sales s
             JOIN cashiers c ON s.cashier_id = c.cashier_id
             WHERE s.shop_id = ?
               AND DATE(s.sale_date) BETWEEN ? AND ?
             ORDER BY s.sale_date DESC
             LIMIT 10`,
            [shop_id, start_date, end_date]
        );

        return {
            // Mapping from the two separate queries to fix the duplicate summation bug
            total_sales:   salesStats[0].total_sales || 0,
            total_revenue: parseFloat(salesStats[0].total_revenue || 0),
            total_profit:  parseFloat(profitStats[0].total_profit || 0), 
            avg_sale:      parseFloat(salesStats[0].avg_sale || 0),

            daily_revenue: dailyRevenue.map(d => ({
                date: d.date,
                revenue: parseFloat(d.revenue)
            })),

            top_products: topProducts.map(p => ({
                product_name: p.product_name,
                quantity_sold: parseInt(p.quantity_sold, 10)
            })),

            recent_sales: recentSales.map(s => ({
                sale_id: s.sale_id,
                total_amount: parseFloat(s.total_amount),
                sale_date: s.sale_date,
                cashier_name: s.cashier_name
            }))
        };
    } catch (error) {
        throw error;
    }
};

// Get sales analytics
const getSalesAnalytics = async (data) => {
    const { shop_id, user_id, user_type, days = 30 } = data;

    try {
        await verifyShopAccess(shop_id, user_id, user_type);

        const [analytics] = await db.execute(
            `SELECT 
                DATE(sale_date) as date,
                COUNT(*) as total_sales,
                SUM(total_amount) as revenue,
                AVG(total_amount) as avg_sale_amount
             FROM sales 
             WHERE shop_id = ? AND sale_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
             GROUP BY DATE(sale_date)
             ORDER BY date DESC`,
            [shop_id, days]
        );

        return analytics.map(row => ({
            date: row.date,
            total_sales: row.total_sales,
            revenue: parseFloat(row.revenue),
            avg_sale_amount: parseFloat(row.avg_sale_amount)
        }));

    } catch (error) {
        throw error;
    }
};

// Get top selling products
const getTopProducts = async (data) => {
    const { shop_id, user_id, user_type, limit = 10, days = 30 } = data;

    try {
        await verifyShopAccess(shop_id, user_id, user_type);

        const [topProducts] = await db.execute(
            `SELECT 
                p.product_id,
                p.product_name,
                p.image_url,
                p.price,
                p.stock_quantity,
                SUM(si.quantity) as total_sold,
                SUM(si.subtotal) as total_revenue,
                COUNT(DISTINCT s.sale_id) as times_sold
             FROM products p
             JOIN sale_items si ON p.product_id = si.product_id
             JOIN sales s ON si.sale_id = s.sale_id
             WHERE p.shop_id = ? AND s.sale_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY p.product_id, p.product_name, p.image_url, p.price, p.stock_quantity
             ORDER BY total_sold DESC
             LIMIT ?`,
            [shop_id, days, limit]
        );

        return topProducts.map(product => ({
            ...product,
            total_revenue: parseFloat(product.total_revenue),
            price: parseFloat(product.price)
        }));

    } catch (error) {
        throw error;
    }
};

// Get inventory report
const getInventoryReport = async (data) => {
    const { shop_id, user_id, user_type } = data;

    try {
        await verifyShopAccess(shop_id, user_id, user_type);

        const [inventory] = await db.execute(
            `SELECT 
                p.product_id,
                p.product_name,
                p.sku,
                p.price,
                p.stock_quantity,
                c.category_name,
                (p.price * p.stock_quantity) as inventory_value,
                CASE 
                    WHEN p.stock_quantity = 0 THEN 'Out of Stock'
                    WHEN p.stock_quantity <= 10 THEN 'Low Stock'
                    WHEN p.stock_quantity <= 50 THEN 'Medium Stock'
                    ELSE 'Good Stock'
                END as stock_status
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             WHERE p.shop_id = ?
             ORDER BY p.stock_quantity ASC, p.product_name`,
            [shop_id]
        );

        const summary = {
            total_products: inventory.length,
            total_inventory_value: inventory.reduce((sum, item) => sum + parseFloat(item.inventory_value || 0), 0),
            out_of_stock: inventory.filter(item => item.stock_status === 'Out of Stock').length,
            low_stock: inventory.filter(item => item.stock_status === 'Low Stock').length
        };

        return {
            summary,
            products: inventory.map(product => ({
                ...product,
                price: parseFloat(product.price),
                inventory_value: parseFloat(product.inventory_value || 0)
            }))
        };

    } catch (error) {
        throw error;
    }
};

// Get cashier performance
const getCashierPerformance = async (data) => {
    const { shop_id, user_id, user_type, days = 30 } = data;

    try {
        await verifyShopAccess(shop_id, user_id, user_type);

        const [performance] = await db.execute(
            `SELECT 
                c.cashier_id,
                c.full_name,
                c.username,
                COUNT(s.sale_id) as total_sales,
                SUM(s.total_amount) as total_revenue,
                AVG(s.total_amount) as avg_sale_amount,
                MIN(s.sale_date) as first_sale,
                MAX(s.sale_date) as last_sale
             FROM cashiers c
             LEFT JOIN sales s ON c.cashier_id = s.cashier_id 
                AND s.sale_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
             WHERE c.shop_id = ? AND c.is_active = true
             GROUP BY c.cashier_id, c.full_name, c.username
             ORDER BY total_revenue DESC`,
            [days, shop_id]
        );

        return performance.map(cashier => ({
            ...cashier,
            total_sales: cashier.total_sales || 0,
            total_revenue: parseFloat(cashier.total_revenue || 0),
            avg_sale_amount: parseFloat(cashier.avg_sale_amount || 0)
        }));

    } catch (error) {
        throw error;
    }
};

// Get revenue trends
const getRevenueTrends = async (data) => {
    const { shop_id, user_id, user_type, period = 'daily', days = 30 } = data;

    try {
        await verifyShopAccess(shop_id, user_id, user_type);

        let groupBy, dateFormat;
        
        switch (period) {
            case 'hourly':
                groupBy = 'DATE(sale_date), HOUR(sale_date)';
                dateFormat = 'CONCAT(DATE(sale_date), " ", HOUR(sale_date), ":00")';
                break;
            case 'weekly':
                groupBy = 'YEAR(sale_date), WEEK(sale_date)';
                dateFormat = 'CONCAT(YEAR(sale_date), "-W", LPAD(WEEK(sale_date), 2, "0"))';
                break;
            case 'monthly':
                groupBy = 'YEAR(sale_date), MONTH(sale_date)';
                dateFormat = 'DATE_FORMAT(sale_date, "%Y-%m")';
                break;
            default: // daily
                groupBy = 'DATE(sale_date)';
                dateFormat = 'DATE(sale_date)';
        }

        const [trends] = await db.execute(
            `SELECT 
                ${dateFormat} as period,
                COUNT(*) as total_sales,
                SUM(total_amount) as revenue,
                AVG(total_amount) as avg_sale_amount
             FROM sales 
             WHERE shop_id = ? AND sale_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY ${groupBy}
             ORDER BY sale_date ASC`,
            [shop_id, days]
        );

        return trends.map(trend => ({
            period: trend.period,
            total_sales: trend.total_sales,
            revenue: parseFloat(trend.revenue),
            avg_sale_amount: parseFloat(trend.avg_sale_amount)
        }));

    } catch (error) {
        throw error;
    }
};

// Get low stock report
const getLowStockReport = async (data) => {
    const { shop_id, user_id, user_type, threshold = 10 } = data;

    try {
        await verifyShopAccess(shop_id, user_id, user_type);

        const [lowStockProducts] = await db.execute(
            `SELECT 
                p.product_id,
                p.product_name,
                p.image_url,
                p.sku,
                p.price,
                p.stock_quantity,
                c.category_name,
                CASE 
                    WHEN p.stock_quantity = 0 THEN 'Out of Stock'
                    ELSE 'Low Stock'
                END as stock_status,
                (p.price * p.stock_quantity) as inventory_value
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             WHERE p.shop_id = ? AND p.stock_quantity <= ?
             ORDER BY p.stock_quantity ASC, p.product_name`,
            [shop_id, threshold]
        );

        // Get sales data for these products in the last 30 days
        if (lowStockProducts.length > 0) {
            const productIds = lowStockProducts.map(p => p.product_id);
            const placeholders = productIds.map(() => '?').join(',');
            
            const [salesData] = await db.execute(
                `SELECT 
                    si.product_id,
                    SUM(si.quantity) as total_sold_30_days,
                    AVG(si.quantity) as avg_daily_sales
                 FROM sale_items si
                 JOIN sales s ON si.sale_id = s.sale_id
                 WHERE s.shop_id = ? AND si.product_id IN (${placeholders}) 
                   AND s.sale_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                 GROUP BY si.product_id`,
                [shop_id, ...productIds]
            );

            // Create a map for faster lookup
            const salesMap = new Map(salesData.map(item => [item.product_id, item]));
            
            // Merge sales data with product data
            lowStockProducts.forEach(product => {
                const sales = salesMap.get(product.product_id);
                product.total_sold_30_days = sales ? parseInt(sales.total_sold_30_days) : 0;
                product.avg_daily_sales = sales ? parseFloat(sales.avg_daily_sales) : 0;
                
                // Calculate suggested reorder quantity (2 weeks supply minimum 10)
                const dailySales = product.total_sold_30_days / 30;
                product.suggested_reorder = Math.max(10, Math.ceil(dailySales * 14));
                
                // Convert price and inventory value to float
                product.price = parseFloat(product.price);
                product.inventory_value = parseFloat(product.inventory_value || 0);
            });
        }

        return lowStockProducts;

    } catch (error) {
        throw error;
    }
};

// Export sales data
const exportSalesData = async (data) => {
  const { shop_id, user_id, user_type, start_date, end_date } = data

  if (!start_date || !end_date) {
    throw new ApiError(400, 'start_date and end_date are required')
  }

  try {
    console.log('[EXPORT] Starting export for shop:', shop_id);
    console.log('[EXPORT] Date range:', start_date, 'to', end_date);
    
    await verifyShopAccess(shop_id, user_id, user_type)

    const [shopRows] = await db.execute(
      'SELECT shop_name FROM shops WHERE shop_id = ?',
      [shop_id]
    )
    const shopName = shopRows[0]?.shop_name || 'Unknown Shop'
    const exportDate = new Date().toISOString().split('T')[0]
    
    const [salesData] = await db.execute(
      `SELECT 
          s.sale_id,
          s.total_amount,
          s.sale_date,
          c.full_name as cashier_name,
          p.product_name,
          p.cost_price,
          si.quantity,
          si.unit_price,
          (si.unit_price * si.quantity) as line_total,
          (p.cost_price * si.quantity) as line_cost
       FROM sales s
       JOIN cashiers c ON s.cashier_id = c.cashier_id
       JOIN sale_items si ON s.sale_id = si.sale_id
       JOIN products p ON si.product_id = p.product_id
       WHERE s.shop_id = ? AND DATE(s.sale_date) BETWEEN ? AND ?
       ORDER BY s.sale_id ASC`,
      [shop_id, start_date, end_date]
    )

    console.log('[EXPORT] Found', salesData.length, 'sale records');

    const revenuePerSale = new Map()
    salesData.forEach((row) => {
      if (!revenuePerSale.has(row.sale_id)) {
        revenuePerSale.set(row.sale_id, parseFloat(row.total_amount || 0))
      }
    })

    const totalSales = revenuePerSale.size
    const totalRevenue = Array.from(revenuePerSale.values()).reduce((sum, val) => sum + val, 0)
    const totalCost = salesData.reduce((sum, row) => sum + parseFloat(row.line_cost || 0), 0)
    const totalProfit = totalRevenue - totalCost

    const headers = [
      'Receipt #',
      'Date',
      'Cashier',
      'Product Name',
      'Selling Price',
      'Cost Price',
      'Quantity',
      'Line Total',
      'Status'
    ]

    let csvContent = `"Shop","${shopName}"\n`
    csvContent += `"Export Date","${exportDate}"\n`
    csvContent += `"Period","${start_date} to ${end_date}"\n`
    csvContent += `"Total Sales","${totalSales}"\n`
    csvContent += `"Total Revenue","${totalRevenue.toFixed(2)}"\n`
    csvContent += `"Total Cost","${totalCost.toFixed(2)}"\n`
    csvContent += `"Total Profit","${totalProfit.toFixed(2)}"\n\n`
    csvContent += headers.join(',') + '\n'

    salesData.forEach(row => {
      const csvRow = [
          row.sale_id,
          `"${row.sale_date}"`,
          `"${row.cashier_name}"`,
          `"${row.product_name.replace(/"/g, '""')}"`,
          parseFloat(row.unit_price).toFixed(2),
          parseFloat(row.cost_price).toFixed(2),
          row.quantity,
          parseFloat(row.line_total).toFixed(2),
          '"Completed"'
      ].join(',');
      csvContent += csvRow + '\n';
    });

    console.log('[EXPORT] CSV length:', csvContent.length);
    console.log('[EXPORT] CSV preview:', csvContent.substring(0, 200));

    return {
      format: 'csv',
      filename: `finance-report-${shop_id}-${start_date}-${end_date}.csv`,
      content: csvContent
    };
  } catch (error) {
    console.error('[EXPORT ERROR]', error.message);
    throw error
  }
}

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