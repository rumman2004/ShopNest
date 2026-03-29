-- Create sales (Depends on shops & cashiers)
CREATE TABLE sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    cashier_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    tendered_amount DECIMAL(10, 2),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE,
    FOREIGN KEY (cashier_id) REFERENCES cashiers(cashier_id) ON DELETE RESTRICT
);

-- Create sale items (Depends on sales & products)
CREATE TABLE sale_items (
    sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL, 
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
);