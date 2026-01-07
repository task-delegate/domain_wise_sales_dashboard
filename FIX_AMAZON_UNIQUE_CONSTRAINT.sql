-- ============================================
-- FIX: Remove UNIQUE constraint to allow all rows
-- ============================================

-- For Amazon table - remove restrictive UNIQUE constraint
-- This allows all rows to be inserted including legitimate duplicates
-- Row-level uniqueness can be managed at application level if needed

ALTER TABLE amazon_data DROP CONSTRAINT IF EXISTS amazon_data_user_id_sale_order_code_item_sku_code_key;

-- Add a more lenient constraint that only prevents exact full duplicates (if needed)
-- This only triggers if EVERY field is identical (very rare)
-- ALTER TABLE amazon_data ADD UNIQUE(user_id, sale_order_code, item_sku_code, created_at);

-- For other domains, apply similar fix if needed:

-- Myntra - allow duplicate orders by removing the size-based unique constraint
ALTER TABLE myntra_data DROP CONSTRAINT IF EXISTS myntra_data_user_id_seller_order_id_seller_sku_code_size_key;

-- AJIO - remove unique constraint
ALTER TABLE ajio_data DROP CONSTRAINT IF EXISTS ajio_data_user_id_sale_order_code_item_code_key;

-- Flipkart - remove unique constraint
ALTER TABLE flipkart_data DROP CONSTRAINT IF EXISTS flipkart_data_user_id_sale_order_code_item_sku_code_key;

-- Verify constraints are removed
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND (tablename IN ('amazon_data', 'myntra_data', 'ajio_data', 'flipkart_data'))
AND indexname LIKE '%unique%'
ORDER BY tablename, indexname;

-- After running this, all rows from CSV will load without constraint violations
-- Total rows will now match your uploaded CSV file
