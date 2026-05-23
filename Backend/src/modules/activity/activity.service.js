const db = require('../../config/database');

// ── Log an activity ──────────────────────────────────────────────
const logActivity = async ({
  shop_id,
  user_id,
  user_type,
  action,
  entity_type = 'product',
  entity_id   = null,
  entity_name = null,
  details     = null,
}) => {
  try {
    await db.execute(
      `INSERT INTO activity_logs
         (shop_id, user_id, user_type, action, entity_type, entity_id, entity_name, details)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shop_id,
        user_id,
        user_type,
        action,
        entity_type,
        entity_id,
        entity_name,
        details ? JSON.stringify(details) : null,
      ]
    );
  } catch (err) {
    // Activity logging should never break the main flow
    console.error('[ActivityLog] Failed to log activity:', err.message);
  }
};

// ── Get activity logs by shop ────────────────────────────────────
const getActivityByShop = async ({ shop_id, page = 1, limit = 30 }) => {
  const parsedShopId = parseInt(shop_id, 10);
  const parsedPage   = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit  = Math.min(100, Math.max(1, parseInt(limit, 10) || 30));
  const offset       = (parsedPage - 1) * parsedLimit;

  const [logs] = await db.execute(
    `SELECT 
        l.log_id,
        l.shop_id,
        l.user_id,
        l.user_type,
        l.action,
        l.entity_type,
        l.entity_id,
        l.entity_name,
        l.details,
        UNIX_TIMESTAMP(l.created_at) AS created_at_epoch,
        CASE 
          WHEN l.user_type = 'owner'   THEN o.full_name
          WHEN l.user_type = 'cashier' THEN c.full_name
        END AS user_name
     FROM activity_logs l
     LEFT JOIN owners   o ON l.user_type = 'owner'   AND l.user_id = o.owner_id
     LEFT JOIN cashiers c ON l.user_type = 'cashier'  AND l.user_id = c.cashier_id
     WHERE l.shop_id = ?
     ORDER BY l.created_at DESC
     LIMIT ${parsedLimit} OFFSET ${offset}`,
    [parsedShopId]
  );

  const [[{ total }]] = await db.execute(
    'SELECT COUNT(*) AS total FROM activity_logs WHERE shop_id = ?',
    [parsedShopId]
  );

  // Parse details JSON + convert epoch to ISO string for correct timezone handling
  const parsedLogs = logs.map((log) => {
    const { created_at_epoch, ...rest } = log;
    return {
      ...rest,
      created_at: new Date(created_at_epoch * 1000).toISOString(),
      details: log.details ? (typeof log.details === 'string' ? JSON.parse(log.details) : log.details) : null,
    };
  });

  return {
    logs: parsedLogs,
    pagination: {
      currentPage:  parsedPage,
      totalPages:   Math.ceil(total / parsedLimit),
      totalItems:   total,
      itemsPerPage: parsedLimit,
    },
  };
};

module.exports = {
  logActivity,
  getActivityByShop,
};
