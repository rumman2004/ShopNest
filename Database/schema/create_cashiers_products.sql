-- Create categories (Depends on shops)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);

-- Create cashiers (Depends on shops)
CREATE TABLE cashiers (
    cashier_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);

-- Create products (Depends on shops)
CREATE TABLE products (
    product_id     INT AUTO_INCREMENT PRIMARY KEY,
    shop_id        INT NOT NULL,
    product_name   VARCHAR(150) NOT NULL,
    image_url      VARCHAR(255),
    sku            VARCHAR(50),
    price          DECIMAL(10, 2) NOT NULL,
    cost_price     DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    description    TEXT DEFAULT NULL,
    category       VARCHAR(100) DEFAULT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);