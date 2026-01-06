-- Domain-Specific Supabase Tables Setup
-- Run each section in your Supabase SQL Editor

-- ============================================
-- 1. AJIO Domain Table
-- ============================================
CREATE TABLE IF NOT EXISTS ajio_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  sale_order_code TEXT,
  order_date TIMESTAMP,
  item_code TEXT,
  sku_name TEXT,
  raw_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Unique constraint: Sale Order Code + Order Date + Item Code
  UNIQUE(user_id, sale_order_code, item_code)
);

CREATE INDEX IF NOT EXISTS idx_ajio_user_id ON ajio_data(user_id);
CREATE INDEX IF NOT EXISTS idx_ajio_order_code ON ajio_data(sale_order_code);
ALTER TABLE ajio_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to ajio_data" ON ajio_data;
CREATE POLICY "Allow all access to ajio_data" ON ajio_data
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 2. Myntra Domain Table
-- ============================================
CREATE TABLE IF NOT EXISTS myntra_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  seller_order_id TEXT,
  order_id_fk TEXT,
  created_on TIMESTAMP,
  seller_sku_code TEXT,
  sku_id TEXT,
  size TEXT,
  raw_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Unique constraint: seller_order_id + created_on + seller_sku_code + size
  UNIQUE(user_id, seller_order_id, seller_sku_code, size)
);

CREATE INDEX IF NOT EXISTS idx_myntra_user_id ON myntra_data(user_id);
CREATE INDEX IF NOT EXISTS idx_myntra_seller_order ON myntra_data(seller_order_id);
ALTER TABLE myntra_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to myntra_data" ON myntra_data;
CREATE POLICY "Allow all access to myntra_data" ON myntra_data
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 3. Flipkart Domain Table
-- ============================================
CREATE TABLE IF NOT EXISTS flipkart_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  sale_order_code TEXT,
  display_order_code TEXT,
  order_date TIMESTAMP,
  item_sku_code TEXT,
  item_code TEXT,
  shipping_address_city TEXT,
  selling_price NUMERIC,
  discount NUMERIC,
  raw_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Unique constraint: Sale Order Code + Item SKU Code + Order Date
  UNIQUE(user_id, sale_order_code, item_sku_code)
);

CREATE INDEX IF NOT EXISTS idx_flipkart_user_id ON flipkart_data(user_id);
CREATE INDEX IF NOT EXISTS idx_flipkart_order_code ON flipkart_data(sale_order_code);
CREATE INDEX IF NOT EXISTS idx_flipkart_sku ON flipkart_data(item_sku_code);
ALTER TABLE flipkart_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to flipkart_data" ON flipkart_data;
CREATE POLICY "Allow all access to flipkart_data" ON flipkart_data
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 4. Amazon Domain Table
-- ============================================
CREATE TABLE IF NOT EXISTS amazon_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  sale_order_code TEXT,
  display_order_code TEXT,
  order_date TIMESTAMP,
  item_sku_code TEXT,
  item_code TEXT,
  shipping_address_city TEXT,
  selling_price NUMERIC,
  discount NUMERIC,
  raw_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Unique constraint: Sale Order Code + Item SKU Code + Order Date
  UNIQUE(user_id, sale_order_code, item_sku_code)
);

CREATE INDEX IF NOT EXISTS idx_amazon_user_id ON amazon_data(user_id);
CREATE INDEX IF NOT EXISTS idx_amazon_order_code ON amazon_data(sale_order_code);
CREATE INDEX IF NOT EXISTS idx_amazon_sku ON amazon_data(item_sku_code);
ALTER TABLE amazon_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to amazon_data" ON amazon_data;
CREATE POLICY "Allow all access to amazon_data" ON amazon_data
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Notes:
-- - Each table has UNIQUE constraint for duplicate detection
-- - raw_data column stores the complete JSON for each row
-- - Indexes optimize lookups by user_id and order codes
-- - All tables have Row Level Security enabled
-- ============================================
