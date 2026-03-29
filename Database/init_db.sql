CREATE DATABASE shopnest_db;

-- 1. Base Setup: Owners and Shops
SOURCE schema/create_owners_shops.sql;

-- 2. Entities: Products, Categories, and Cashiers
SOURCE schema/create_cashiers_products.sql;

-- 3. Transactions: Sales and Line Items
SOURCE schema/create_sales_transactions.sql;

-- (Optional) Verification message
SELECT 'Database schema initialized successfully!' AS Result;