-- Activity Log table for ShopNest
-- Tracks inventory-related actions: product CRUD, stock adjustments, image uploads

USE shopnest_db;

CREATE TABLE IF NOT EXISTS activity_logs (
    log_id       INT AUTO_INCREMENT PRIMARY KEY,
    shop_id      INT NOT NULL,
    user_id      INT NOT NULL,
    user_type    ENUM('owner','cashier') NOT NULL,
    action       ENUM('product_created','product_updated','product_deleted','stock_adjusted','image_uploaded') NOT NULL,
    entity_type  VARCHAR(50) NOT NULL DEFAULT 'product',
    entity_id    INT DEFAULT NULL,
    entity_name  VARCHAR(150) DEFAULT NULL,
    details      JSON DEFAULT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_shop_date (shop_id, created_at DESC),
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);

SELECT 'activity_logs table created successfully.' AS result;
