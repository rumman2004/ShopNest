const db         = require('../../config/database');
const cloudinary = require('../../config/cloudinary');
const { ApiError } = require('../../utils/ApiError');

// ── Access guard ─────────────────────────────────────────────────
const verifyShopAccess = async (shop_id, user_id, user_type) => {
  const shopId = parseInt(shop_id, 10);
  const userId = parseInt(user_id, 10);

  if (isNaN(shopId) || isNaN(userId)) {
    throw new ApiError(400, 'Invalid shop ID or user ID');
  }

  if (user_type === 'owner') {
    const [rows] = await db.execute(
      'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
      [shopId, userId]
    );
    if (rows.length === 0) throw new ApiError(403, 'Shop not found or access denied');

  } else if (user_type === 'cashier') {
    const [rows] = await db.execute(
      'SELECT cashier_id FROM cashiers WHERE cashier_id = ? AND shop_id = ? AND is_active = TRUE',
      [userId, shopId]
    );
    if (rows.length === 0) throw new ApiError(403, 'Shop not found or access denied');

  } else {
    throw new ApiError(403, `Access denied — unknown user_type: "${user_type}"`);
  }
};

// ── Helper: ensure a value is an integer ─────────────────────────
const toInt = (val, fallback = 0) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? fallback : n;
};

const toFloat = (val, fallback = 0) => {
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
};

// ── Cloudinary upload ────────────────────────────────────────────
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type:  'image',
        folder:         'shopnest/products',
        transformation: [
          { width: 800, height: 800, crop: 'fill' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(new ApiError(500, 'Image upload failed'));
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ── Get products by shop ─────────────────────────────────────────
const getProductsByShop = async (data) => {
  const { shop_id, user_id, user_type, page, limit, search, category, sort_by, sort_order } = data;

  await verifyShopAccess(shop_id, user_id, user_type);

  // ✅ Force every numeric param to an actual JS number
  const parsedShopId = toInt(shop_id);
  const parsedPage   = toInt(page, 1);
  const parsedLimit  = Math.max(1, toInt(limit, 50)); // Ensure limit is at least 1
  const offset       = Math.max(0, (parsedPage - 1) * parsedLimit);

  let whereClause = 'WHERE shop_id = ?';
  const queryParams = [parsedShopId];

  // ✅ Added .trim() check to safely ignore empty strings like "?search="
  if (search && search.trim() !== '') {
    whereClause += ' AND (product_name LIKE ? OR sku LIKE ?)';
    queryParams.push(`%${search.trim()}%`, `%${search.trim()}%`);
  }

  if (category && category.trim() !== '') {
    whereClause += ' AND category = ?';
    queryParams.push(category.trim());
  }

  const validCols = ['product_name', 'price', 'cost_price', 'stock_quantity', 'created_at'];
  const sortCol   = validCols.includes(sort_by) ? sort_by : 'created_at';
  const sortDir   = sort_order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  // ✅ FIX: Inject parsedLimit and offset directly into the string.
  // Because they are strictly validated integers above, SQL injection is impossible.
  // This bypasses the MySQL prepared statement bug for LIMIT/OFFSET placeholders.
  const [products] = await db.execute(
    `SELECT
        product_id,
        product_name,
        image_url,
        sku,
        price,
        cost_price,
        stock_quantity,
        category,
        description,
        created_at
     FROM products
     ${whereClause}
     ORDER BY ${sortCol} ${sortDir}
     LIMIT ${parsedLimit} OFFSET ${offset}`,
    queryParams // ✅ Now only contains params for the WHERE clause
  );

  const [[{ total }]] = await db.execute(
    `SELECT COUNT(*) AS total FROM products ${whereClause}`,
    queryParams
  );

  return {
    products,
    pagination: {
      currentPage:  parsedPage,
      totalPages:   Math.ceil(total / parsedLimit),
      totalItems:   total,
      itemsPerPage: parsedLimit,
      hasNextPage:  parsedPage < Math.ceil(total / parsedLimit),
      hasPrevPage:  parsedPage > 1,
    },
  };
};

// ── Get single product ────────────────────────────────────────────
const getProduct = async ({ product_id, user_id, user_type }) => {
  const [rows] = await db.execute(
    `SELECT p.*, s.shop_name
     FROM products p
     JOIN shops s ON p.shop_id = s.shop_id
     WHERE p.product_id = ?`,
    [toInt(product_id)]
  );

  if (rows.length === 0) throw new ApiError(404, 'Product not found');

  await verifyShopAccess(rows[0].shop_id, user_id, user_type);
  return rows[0];
};

// ── Create product ────────────────────────────────────────────────
const createProduct = async (data) => {
  const {
    shop_id, product_name, sku, price, cost_price,
    stock_quantity, category, description,
    image, user_id, user_type
  } = data;

  const parsedShopId = toInt(shop_id);

  await verifyShopAccess(parsedShopId, user_id, user_type);

  if (sku) {
    const [existing] = await db.execute(
      'SELECT product_id FROM products WHERE shop_id = ? AND sku = ?',
      [parsedShopId, sku]
    );
    if (existing.length > 0) throw new ApiError(409, 'SKU already exists in this shop');
  }

  let image_url = null;
  if (image?.buffer) {
    const upload = await uploadToCloudinary(image.buffer);
    image_url = upload.secure_url;
  }

  const [result] = await db.execute(
    `INSERT INTO products
       (shop_id, product_name, image_url, sku, price, cost_price, stock_quantity, category, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      parsedShopId,
      product_name,
      image_url,
      sku || null,
      toFloat(price),
      toFloat(cost_price),
      toInt(stock_quantity),
      category    || null,
      description || null,
    ]
  );

  const [product] = await db.execute(
    'SELECT * FROM products WHERE product_id = ?',
    [result.insertId]
  );

  return product[0];
};

// ── Update product ────────────────────────────────────────────────
const updateProduct = async (data) => {
  const {
    product_id, product_name, sku, price, cost_price,
    stock_quantity, category, description,
    image, user_id, user_type
  } = data;

  const parsedProductId = toInt(product_id);

  const [existing] = await db.execute(
    'SELECT shop_id, image_url FROM products WHERE product_id = ?',
    [parsedProductId]
  );
  if (existing.length === 0) throw new ApiError(404, 'Product not found');

  const { shop_id, image_url: oldImageUrl } = existing[0];
  await verifyShopAccess(shop_id, user_id, user_type);

  if (sku) {
    const [skuCheck] = await db.execute(
      'SELECT product_id FROM products WHERE shop_id = ? AND sku = ? AND product_id != ?',
      [toInt(shop_id), sku, parsedProductId]
    );
    if (skuCheck.length > 0) throw new ApiError(409, 'SKU already exists in this shop');
  }

  const fields = [];
  const values = [];

  if (product_name   !== undefined) { fields.push('product_name = ?');   values.push(product_name); }
  if (sku            !== undefined) { fields.push('sku = ?');            values.push(sku || null); }
  if (price          !== undefined) { fields.push('price = ?');          values.push(toFloat(price)); }
  if (cost_price     !== undefined) { fields.push('cost_price = ?');     values.push(toFloat(cost_price)); }
  if (stock_quantity !== undefined) { fields.push('stock_quantity = ?'); values.push(toInt(stock_quantity)); }
  if (category       !== undefined) { fields.push('category = ?');       values.push(category || null); }
  if (description    !== undefined) { fields.push('description = ?');    values.push(description || null); }

  if (image?.buffer) {
    const upload = await uploadToCloudinary(image.buffer);
    fields.push('image_url = ?');
    values.push(upload.secure_url);

    if (oldImageUrl) {
      try {
        const parts  = oldImageUrl.split('/');
        const file   = parts.pop().split('.')[0];
        const folder = parts.slice(parts.indexOf('shopnest')).join('/');
        await cloudinary.uploader.destroy(`${folder}/${file}`);
      } catch (e) {
        console.error('Failed to delete old image:', e.message);
      }
    }
  }

  if (fields.length === 0) throw new ApiError(400, 'No fields to update');

  values.push(parsedProductId);
  await db.execute(
    `UPDATE products SET ${fields.join(', ')} WHERE product_id = ?`,
    values
  );

  const [product] = await db.execute(
    'SELECT * FROM products WHERE product_id = ?',
    [parsedProductId]
  );

  return product[0];
};

// ── Update stock ──────────────────────────────────────────────────
const updateStock = async ({ product_id, stock_quantity, adjustment_type, reason, user_id, user_type }) => {
  const parsedProductId = toInt(product_id);
  const parsedQty       = toInt(stock_quantity);

  const [rows] = await db.execute(
    'SELECT shop_id, stock_quantity FROM products WHERE product_id = ?',
    [parsedProductId]
  );
  if (rows.length === 0) throw new ApiError(404, 'Product not found');

  await verifyShopAccess(rows[0].shop_id, user_id, user_type);

  const current = rows[0].stock_quantity;
  let newStock;

  if (adjustment_type === 'add')           newStock = current + parsedQty;
  else if (adjustment_type === 'subtract') {
    newStock = current - parsedQty;
    if (newStock < 0) throw new ApiError(400, 'Insufficient stock');
  }
  else if (adjustment_type === 'set')      newStock = parsedQty;
  else throw new ApiError(400, 'Invalid adjustment type. Use: add, subtract, set');

  await db.execute(
    'UPDATE products SET stock_quantity = ? WHERE product_id = ?',
    [newStock, parsedProductId]
  );

  const [product] = await db.execute(
    'SELECT * FROM products WHERE product_id = ?',
    [parsedProductId]
  );

  return product[0];
};

// ── Delete product ────────────────────────────────────────────────
const deleteProduct = async ({ product_id, user_id, user_type }) => {
  const parsedProductId = toInt(product_id);

  const [rows] = await db.execute(
    'SELECT shop_id, image_url FROM products WHERE product_id = ?',
    [parsedProductId]
  );
  if (rows.length === 0) throw new ApiError(404, 'Product not found');

  await verifyShopAccess(rows[0].shop_id, user_id, user_type);

  const [[{ count }]] = await db.execute(
    'SELECT COUNT(*) AS count FROM sale_items WHERE product_id = ?',
    [parsedProductId]
  );
  if (count > 0) throw new ApiError(409, 'Cannot delete product with existing sales records');

  await db.execute('DELETE FROM products WHERE product_id = ?', [parsedProductId]);

  if (rows[0].image_url) {
    try {
      const parts  = rows[0].image_url.split('/');
      const file   = parts.pop().split('.')[0];
      const folder = parts.slice(parts.indexOf('shopnest')).join('/');
      await cloudinary.uploader.destroy(`${folder}/${file}`);
    } catch (e) {
      console.error('Failed to delete image from Cloudinary:', e.message);
    }
  }
};

// ── Low stock ─────────────────────────────────────────────────────
const getLowStockProducts = async ({ shop_id, threshold, user_id, user_type }) => {
  const parsedShopId    = toInt(shop_id);
  const parsedThreshold = toInt(threshold, 10);

  await verifyShopAccess(parsedShopId, user_id, user_type);

  const [products] = await db.execute(
    `SELECT product_id, product_name, image_url, sku,
            price, cost_price, stock_quantity, category
     FROM products
     WHERE shop_id = ? AND stock_quantity <= ?
     ORDER BY stock_quantity ASC`,
    [parsedShopId, parsedThreshold]
  );

  return products;
};

module.exports = {
  getProductsByShop,
  getProduct,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  getLowStockProducts,
};