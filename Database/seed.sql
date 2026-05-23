-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SHOPNEST — SALES-ONLY SEED DATA
-- Owner ID: 1  |  Shop ID: 1
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ⚠️  Prerequisites: Owner (id=1), Shop (id=1), Cashier (id=1),
--    and Products must already exist before running this seed.
--    This file seeds ONLY sales and sale_items.
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SALES  (shop_id = 1, cashier_id = 1)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE sales AUTO_INCREMENT = 25;

INSERT INTO sales
  (shop_id, cashier_id, total_amount, tendered_amount, sale_date)
VALUES
-- Week 1 — May 12–18
(1, 1,  5150.00, 5200.00, '2026-05-12 10:15:00'),   -- Sale 1: Bat + Ball
(1, 1,  3200.00, 3500.00, '2026-05-12 14:30:00'),   -- Sale 2: Football
(1, 1,  2200.00, 2200.00, '2026-05-13 09:45:00'),   -- Sale 3: Cricket Helmet
(1, 1,  5950.00, 6000.00, '2026-05-13 16:00:00'),   -- Sale 4: Racket + Shuttlecock
(1, 1,  1200.00, 1500.00, '2026-05-14 11:20:00'),   -- Sale 5: Goalkeeper Gloves
(1, 1,  2500.00, 2500.00, '2026-05-15 10:00:00'),   -- Sale 6: Basketball
(1, 1,  2100.00, 2500.00, '2026-05-15 15:45:00'),   -- Sale 7: Running Tee + Track Pants
(1, 1,  4500.00, 5000.00, '2026-05-16 12:30:00'),   -- Sale 8: Cricket Bat
(1, 1,  1850.00, 2000.00, '2026-05-17 09:00:00'),   -- Sale 9: Gym Bag + Water Bottle
(1, 1,  3400.00, 3500.00, '2026-05-18 14:10:00'),   -- Sale 10: Dumbbells 5kg + 10kg
-- Week 2 — May 19–23
(1, 1,  6300.00, 6500.00, '2026-05-19 10:30:00'),   -- Sale 11: Bat + Pads
(1, 1,  6000.00, 6000.00, '2026-05-19 17:15:00'),   -- Sale 12: Football Shoes + Football
(1, 1,  1450.00, 1500.00, '2026-05-20 08:45:00'),   -- Sale 13: Yoga Mat + Resistance Bands
(1, 1,   900.00, 1000.00, '2026-05-20 13:20:00'),   -- Sale 14: Running T-Shirt
(1, 1,  1100.00, 1100.00, '2026-05-20 16:50:00'),   -- Sale 15: Badminton Net
(1, 1,  6700.00, 7000.00, '2026-05-21 10:00:00'),   -- Sale 16: Bat + Helmet + Ball×2
(1, 1,  3550.00, 4000.00, '2026-05-21 14:30:00'),   -- Sale 17: Stopwatch + Skipping Rope + Gym Bag + Yoga Mat + Water Bottle
(1, 1,  3300.00, 3500.00, '2026-05-22 09:15:00'),   -- Sale 18: Basketball Jersey + Track Pants + Compression Shorts
(1, 1,  2800.00, 3000.00, '2026-05-22 15:40:00'),   -- Sale 19: Football Shoes
(1, 1, 11500.00, 12000.00, '2026-05-23 11:00:00');  -- Sale 20: Racket + Bat + Gym Bag

-- Capture the first auto-generated sale_id from the batch above.
-- In MySQL, LAST_INSERT_ID() after a multi-row INSERT returns the
-- FIRST generated id. So sale 1 = @base, sale 2 = @base+1, etc.
SET @base = LAST_INSERT_ID();


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SALE ITEMS  (line items for each sale)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- product_id reference (shop_id=1 products):
--   1  = SG English Willow Cricket Bat       ₹4500
--   2  = Leather Cricket Ball (Red)          ₹650
--   3  = Cricket Batting Pads                ₹1800
--   4  = Cricket Helmet with Steel Grill     ₹2200
--   5  = Adidas FIFA Match Football          ₹3200
--   6  = Football Shoes — Firm Ground        ₹2800
--   7  = Goalkeeper Gloves                   ₹1200
--   8  = Yonex Astrox 88D Racket            ₹5500
--   9  = Yonex Mavis 350 Shuttlecock (6pcs) ₹450
--  10  = Li-Ning Badminton Net              ₹1100
--  11  = Spalding NBA Official Basketball   ₹2500
--  12  = Basketball Jersey Set              ₹1400
--  13  = Hex Dumbbell 5kg (Pair)            ₹1200
--  14  = Hex Dumbbell 10kg (Pair)           ₹2200
--  15  = Skipping Rope (Adjustable)         ₹350
--  16  = Yoga Mat 6mm                       ₹800
--  17  = Resistance Bands Set (5 pcs)       ₹650
--  18  = Dri-Fit Running T-Shirt            ₹900
--  19  = Track Pants — Slim Fit             ₹1200
--  20  = Compression Shorts                 ₹700
--  21  = Sports Water Bottle 750ml          ₹350
--  22  = Gym Bag — 35L                      ₹1500
--  23  = Sweatband Pair (Wrist)             ₹200
--  24  = Digital Sports Stopwatch           ₹550

INSERT INTO sale_items
  (sale_id, product_id, quantity, unit_price, subtotal)
VALUES
-- Sale 1: Bat + Ball = 4500 + 650 = 5150
(@base+0,  1, 1, 4500.00, 4500.00),
(@base+0,  2, 1,  650.00,  650.00),

-- Sale 2: Football = 3200
(@base+1,  5, 1, 3200.00, 3200.00),

-- Sale 3: Cricket Helmet = 2200
(@base+2,  4, 1, 2200.00, 2200.00),

-- Sale 4: Racket + Shuttlecock×1 = 5500 + 450 = 5950
(@base+3,  8, 1, 5500.00, 5500.00),
(@base+3,  9, 1,  450.00,  450.00),

-- Sale 5: Goalkeeper Gloves = 1200
(@base+4,  7, 1, 1200.00, 1200.00),

-- Sale 6: Basketball = 2500
(@base+5, 11, 1, 2500.00, 2500.00),

-- Sale 7: Running Tee + Track Pants = 900 + 1200 = 2100
(@base+6, 18, 1,  900.00,  900.00),
(@base+6, 19, 1, 1200.00, 1200.00),

-- Sale 8: Cricket Bat = 4500
(@base+7,  1, 1, 4500.00, 4500.00),

-- Sale 9: Gym Bag + Water Bottle = 1500 + 350 = 1850
(@base+8, 22, 1, 1500.00, 1500.00),
(@base+8, 21, 1,  350.00,  350.00),

-- Sale 10: Dumbbells 5kg + 10kg = 1200 + 2200 = 3400
(@base+9, 13, 1, 1200.00, 1200.00),
(@base+9, 14, 1, 2200.00, 2200.00),

-- Sale 11: Bat + Pads = 4500 + 1800 = 6300
(@base+10,  1, 1, 4500.00, 4500.00),
(@base+10,  3, 1, 1800.00, 1800.00),

-- Sale 12: Football Shoes + Football = 2800 + 3200 = 6000
(@base+11,  6, 1, 2800.00, 2800.00),
(@base+11,  5, 1, 3200.00, 3200.00),

-- Sale 13: Yoga Mat + Resistance Bands = 800 + 650 = 1450
(@base+12, 16, 1,  800.00,  800.00),
(@base+12, 17, 1,  650.00,  650.00),

-- Sale 14: Running T-Shirt = 900
(@base+13, 18, 1,  900.00,  900.00),

-- Sale 15: Badminton Net = 1100
(@base+14, 10, 1, 1100.00, 1100.00),

-- Sale 16: Bat + Helmet + Ball×2 = 4500 + 2200 + (650×2) = wait → let's be exact
-- Bat 3500 + Helmet 2200 + Ball×1 1000 = doesn't exist at that price
-- Bat 4500 + Helmet 2200 = 6700 ✓
(@base+15,  1, 1, 4500.00, 4500.00),
(@base+15,  4, 1, 2200.00, 2200.00),

-- Sale 17: Stopwatch + Skipping Rope + Gym Bag + Yoga Mat + Water Bottle
-- 550 + 350 + 1500 + 800 + 350 = 3550
(@base+16, 24, 1,  550.00,  550.00),
(@base+16, 15, 1,  350.00,  350.00),
(@base+16, 22, 1, 1500.00, 1500.00),
(@base+16, 16, 1,  800.00,  800.00),
(@base+16, 21, 1,  350.00,  350.00),

-- Sale 18: Basketball Jersey + Track Pants + Compression Shorts
-- 1400 + 1200 + 700 = 3300
(@base+17, 12, 1, 1400.00, 1400.00),
(@base+17, 19, 1, 1200.00, 1200.00),
(@base+17, 20, 1,  700.00,  700.00),

-- Sale 19: Football Shoes = 2800
(@base+18,  6, 1, 2800.00, 2800.00),

-- Sale 20: Racket + Bat + Gym Bag = 5500 + 4500 + 1500 = 11500
(@base+19,  8, 1, 5500.00, 5500.00),
(@base+19,  1, 1, 4500.00, 4500.00),
(@base+19, 22, 1, 1500.00, 1500.00);


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ✅  SALES SEED COMPLETE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT '✅ Sales seed data inserted successfully!' AS Result;
SELECT CONCAT(COUNT(*), ' sales loaded')      AS Sales      FROM sales      WHERE shop_id = 1;
SELECT CONCAT(COUNT(*), ' sale items loaded') AS SaleItems  FROM sale_items;
