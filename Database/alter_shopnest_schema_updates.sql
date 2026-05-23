-- ShopNest schema update migration
-- Applies the database changes needed by the latest backend fixes.
-- Run this against your ShopNest MySQL database.

USE shopnest_db;

DELIMITER $$

DROP PROCEDURE IF EXISTS apply_shopnest_schema_updates $$

CREATE PROCEDURE apply_shopnest_schema_updates()
BEGIN
    DECLARE duplicate_category_count INT DEFAULT 0;
    DECLARE duplicate_sku_count INT DEFAULT 0;
    DECLARE column_count INT DEFAULT 0;
    DECLARE index_count INT DEFAULT 0;

    SELECT COUNT(*) INTO duplicate_category_count
    FROM (
        SELECT shop_id, category_name
        FROM categories
        GROUP BY shop_id, category_name
        HAVING COUNT(*) > 1
    ) duplicates;

    IF duplicate_category_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot add unique_shop_category: duplicate category names exist in the same shop.';
    END IF;

    SELECT COUNT(*) INTO duplicate_sku_count
    FROM (
        SELECT shop_id, sku
        FROM products
        WHERE sku IS NOT NULL AND sku <> ''
        GROUP BY shop_id, sku
        HAVING COUNT(*) > 1
    ) duplicates;

    IF duplicate_sku_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot add unique_shop_sku: duplicate SKUs exist in the same shop.';
    END IF;

    SELECT COUNT(*) INTO column_count
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'categories'
      AND COLUMN_NAME = 'description';

    IF column_count = 0 THEN
        ALTER TABLE categories
            ADD COLUMN description TEXT DEFAULT NULL AFTER category_name;
    END IF;

    SELECT COUNT(*) INTO column_count
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'categories'
      AND COLUMN_NAME = 'created_at';

    IF column_count = 0 THEN
        ALTER TABLE categories
            ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER description;
    END IF;

    SELECT COUNT(*) INTO index_count
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'categories'
      AND INDEX_NAME = 'unique_shop_category';

    IF index_count = 0 THEN
        ALTER TABLE categories
            ADD UNIQUE KEY unique_shop_category (shop_id, category_name);
    END IF;

    SELECT COUNT(*) INTO index_count
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'products'
      AND INDEX_NAME = 'unique_shop_sku';

    IF index_count = 0 THEN
        ALTER TABLE products
            ADD UNIQUE KEY unique_shop_sku (shop_id, sku);
    END IF;

    SELECT COUNT(*) INTO index_count
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'products'
      AND INDEX_NAME = 'idx_products_category';

    IF index_count = 0 THEN
        ALTER TABLE products
            ADD INDEX idx_products_category (shop_id, category);
    END IF;
END $$

DELIMITER ;

CALL apply_shopnest_schema_updates();

DROP PROCEDURE IF EXISTS apply_shopnest_schema_updates;

SELECT 'ShopNest schema updates applied successfully.' AS result;
