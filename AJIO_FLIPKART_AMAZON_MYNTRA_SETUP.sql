-- ============================================
-- AJIO Domain Table
-- ============================================
CREATE TABLE IF NOT EXISTS ajio_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  -- Unique identifiers for deduplication
  sale_order_code TEXT,
  item_code TEXT,
  
  -- Order Information
  order_date TIMESTAMP,
  sale_order_status TEXT,
  on_hold BOOLEAN,
  priority TEXT,
  
  -- Product Details
  sku_name TEXT,
  seller_sku_code TEXT,
  item_code_value TEXT,
  combination_identifier TEXT,
  combination_description TEXT,
  
  -- Pricing & Discounts
  mrp DECIMAL(12, 2),
  total_price DECIMAL(12, 2),
  selling_price DECIMAL(12, 2),
  cost_price DECIMAL(12, 2),
  discount DECIMAL(12, 2),
  voucher_code TEXT,
  transfer_price DECIMAL(12, 2),
  
  -- Taxes
  gst_tax_type_code TEXT,
  cgst DECIMAL(12, 2),
  igst DECIMAL(12, 2),
  sgst DECIMAL(12, 2),
  utgst DECIMAL(12, 2),
  cess DECIMAL(12, 2),
  cgst_rate DECIMAL(5, 2),
  igst_rate DECIMAL(5, 2),
  sgst_rate DECIMAL(5, 2),
  utgst_rate DECIMAL(5, 2),
  cess_rate DECIMAL(5, 2),
  tcs_amount DECIMAL(12, 2),
  tax_percent DECIMAL(5, 2),
  tax_value DECIMAL(12, 2),
  
  -- Shipping
  shipping_charges DECIMAL(12, 2),
  shipping_method_charges DECIMAL(12, 2),
  cod_service_charges DECIMAL(12, 2),
  gift_wrap_charges DECIMAL(12, 2),
  shipping_provider TEXT,
  shipping_courier TEXT,
  shipping_arranged_by TEXT,
  shipping_package_code TEXT,
  shipping_package_creation_date TIMESTAMP,
  shipping_package_status_code TEXT,
  shipping_package_type TEXT,
  tracking_number TEXT,
  dispatch_date TIMESTAMP,
  delivery_time TEXT,
  
  -- Item Status
  sale_order_item_status TEXT,
  cancellation_reason TEXT,
  
  -- Return Information
  return_date TIMESTAMP,
  return_reason TEXT,
  return_remarks TEXT,
  
  -- Facility & Logistics
  facility TEXT,
  packet_number TEXT,
  
  -- Additional Item Details
  imei TEXT,
  weight DECIMAL(10, 2),
  hsn_code TEXT,
  gstin TEXT,
  customer_gstin TEXT,
  tin TEXT,
  payment_instrument TEXT,
  batch_code TEXT,
  vendor_batch_number TEXT,
  item_type_ean TEXT,
  item_seal_id TEXT,
  parent_sale_order_code TEXT,
  item_tag TEXT,
  shipment_tag TEXT,
  
  -- Gift & Customization
  gift_wrap TEXT,
  gift_message TEXT,
  
  -- Prepayment & Credits
  prepaid_amount DECIMAL(12, 2),
  subtotal DECIMAL(12, 2),
  store_credit DECIMAL(12, 2),
  
  -- Invoice & Compliance
  irn TEXT,
  acknowledgement_number TEXT,
  
  -- Bundle Information
  bundle_sku_code_number TEXT,
  
  -- Additional Fields
  currency TEXT,
  currency_conversion_rate DECIMAL(10, 4),
  fulfillment_tat TEXT,
  adjustment_in_selling_price DECIMAL(12, 2),
  adjustment_in_discount DECIMAL(12, 2),
  shipping_courier_status TEXT,
  shipping_tracking_status TEXT,
  cashfree TEXT,
  tags TEXT,
  channel_shipping TEXT,
  item_details TEXT,
  
  -- Raw data storage (JSONB)
  raw_data JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint to prevent duplicates
  UNIQUE(user_id, sale_order_code, item_code)
);

CREATE INDEX idx_ajio_user_id ON ajio_data(user_id);
CREATE INDEX idx_ajio_sale_order_code ON ajio_data(sale_order_code);
CREATE INDEX idx_ajio_order_date ON ajio_data(order_date);
CREATE INDEX idx_ajio_status ON ajio_data(sale_order_status);


-- ============================================
-- Myntra Domain Table
-- ============================================
CREATE TABLE IF NOT EXISTS myntra_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  -- Unique identifiers for deduplication
  seller_order_id TEXT,
  seller_sku_code TEXT,
  
  -- Seller Information
  seller_id TEXT,
  warehouse_id TEXT,
  seller_warehouse_id TEXT,
  
  -- Order Details
  po_type TEXT,
  store_order_id TEXT,
  order_release_id TEXT,
  order_line_id TEXT,
  order_id_fk TEXT,
  created_on TIMESTAMP,
  order_status TEXT,
  
  -- Product Details
  style_id TEXT,
  sku_id TEXT,
  myntra_sku_code TEXT,
  size TEXT,
  vendor_article_number TEXT,
  brand TEXT,
  style_name TEXT,
  article_type TEXT,
  
  -- Pricing & Amounts
  final_amount DECIMAL(12, 2),
  total_mrp DECIMAL(12, 2),
  discount DECIMAL(12, 2),
  coupon_discount DECIMAL(12, 2),
  shipping_charge DECIMAL(12, 2),
  gift_charge DECIMAL(12, 2),
  tax_recovery DECIMAL(12, 2),
  
  -- Logistics & Tracking
  packet_id TEXT,
  seller_packet_id TEXT,
  courier_code TEXT,
  order_tracking_number TEXT,
  
  -- Order Status Timeline
  packed_on TIMESTAMP,
  fmpu_date TIMESTAMP,
  inscanned_on TIMESTAMP,
  shipped_on TIMESTAMP,
  delivered_on TIMESTAMP,
  cancelled_on TIMESTAMP,
  rto_creation_date TIMESTAMP,
  lost_date TIMESTAMP,
  return_creation_date TIMESTAMP,
  
  -- Cancellation
  cancellation_reason_id_fk TEXT,
  cancellation_reason TEXT,
  
  -- Shipping Address
  city TEXT,
  state TEXT,
  zipcode TEXT,
  
  -- Raw data storage (JSONB)
  raw_data JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint to prevent duplicates
  UNIQUE(user_id, seller_order_id, seller_sku_code, size)
);

CREATE INDEX idx_myntra_user_id ON myntra_data(user_id);
CREATE INDEX idx_myntra_seller_order_id ON myntra_data(seller_order_id);
CREATE INDEX idx_myntra_created_on ON myntra_data(created_on);
CREATE INDEX idx_myntra_order_status ON myntra_data(order_status);


-- ============================================
-- Flipkart Domain Table
-- ============================================
CREATE TABLE IF NOT EXISTS flipkart_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  -- Unique identifiers for deduplication
  sale_order_code TEXT,
  item_sku_code TEXT,
  
  -- Order Information
  sale_order_item_code TEXT,
  display_order_code TEXT,
  order_date TIMESTAMP,
  sale_order_status TEXT,
  on_hold BOOLEAN,
  priority TEXT,
  
  -- Reverse Pickup
  reverse_pickup_code TEXT,
  reverse_pickup_created_date TIMESTAMP,
  reverse_pickup_reason TEXT,
  
  -- Notification
  notification_email TEXT,
  notification_mobile TEXT,
  
  -- Customization
  require_customization BOOLEAN,
  sku_require_customization BOOLEAN,
  cod BOOLEAN,
  
  -- Shipping Address
  shipping_address_id TEXT,
  shipping_address_name TEXT,
  shipping_address_line_1 TEXT,
  shipping_address_line_2 TEXT,
  shipping_address_city TEXT,
  shipping_address_state TEXT,
  shipping_address_country TEXT,
  shipping_address_pincode TEXT,
  shipping_address_latitude DECIMAL(10, 8),
  shipping_address_longitude DECIMAL(11, 8),
  shipping_address_phone TEXT,
  
  -- Billing Address
  billing_address_id TEXT,
  billing_address_name TEXT,
  billing_address_line_1 TEXT,
  billing_address_line_2 TEXT,
  billing_address_city TEXT,
  billing_address_state TEXT,
  billing_address_country TEXT,
  billing_address_pincode TEXT,
  billing_address_latitude DECIMAL(10, 8),
  billing_address_longitude DECIMAL(11, 8),
  billing_address_phone TEXT,
  
  -- Shipping Method
  shipping_method TEXT,
  
  -- Product Details
  item_code TEXT,
  channel_product_id TEXT,
  item_type_name TEXT,
  item_type_color TEXT,
  item_type_size TEXT,
  item_type_brand TEXT,
  channel_name TEXT,
  sku_name TEXT,
  
  -- Category
  category TEXT,
  
  -- Pricing & Discounts
  mrp DECIMAL(12, 2),
  total_price DECIMAL(12, 2),
  selling_price DECIMAL(12, 2),
  cost_price DECIMAL(12, 2),
  discount DECIMAL(12, 2),
  prepaid_amount DECIMAL(12, 2),
  subtotal DECIMAL(12, 2),
  voucher_code TEXT,
  transfer_price DECIMAL(12, 2),
  
  -- Taxes
  gst_tax_type_code TEXT,
  cgst DECIMAL(12, 2),
  igst DECIMAL(12, 2),
  sgst DECIMAL(12, 2),
  utgst DECIMAL(12, 2),
  cess DECIMAL(12, 2),
  cgst_rate DECIMAL(5, 2),
  igst_rate DECIMAL(5, 2),
  sgst_rate DECIMAL(5, 2),
  utgst_rate DECIMAL(5, 2),
  cess_rate DECIMAL(5, 2),
  tcs_amount DECIMAL(12, 2),
  tax_percent DECIMAL(5, 2),
  tax_value DECIMAL(12, 2),
  
  -- Shipping Charges
  shipping_charges DECIMAL(12, 2),
  shipping_method_charges DECIMAL(12, 2),
  cod_service_charges DECIMAL(12, 2),
  gift_wrap_charges DECIMAL(12, 2),
  
  -- Shipping Status
  shipping_provider TEXT,
  shipping_courier TEXT,
  shipping_arranged_by TEXT,
  shipping_package_code TEXT,
  shipping_package_creation_date TIMESTAMP,
  shipping_package_status_code TEXT,
  shipping_package_type TEXT,
  tracking_number TEXT,
  dispatch_date TIMESTAMP,
  facility TEXT,
  delivery_time TEXT,
  
  -- Package Dimensions
  length_mm DECIMAL(10, 2),
  width_mm DECIMAL(10, 2),
  height_mm DECIMAL(10, 2),
  weight DECIMAL(10, 2),
  
  -- Item Status
  sale_order_item_status TEXT,
  cancellation_reason TEXT,
  
  -- Return Information
  return_date TIMESTAMP,
  return_reason TEXT,
  return_remarks TEXT,
  
  -- Invoice
  invoice_code TEXT,
  invoice_created TIMESTAMP,
  
  -- E-Way Bill
  eway_bill_no TEXT,
  eway_bill_date TIMESTAMP,
  eway_bill_valid_till TIMESTAMP,
  
  -- Gift & Customization
  gift_wrap TEXT,
  gift_message TEXT,
  
  -- Payment & Credits
  payment_instrument TEXT,
  store_credit DECIMAL(12, 2),
  
  -- Compliance
  hsn_code TEXT,
  gstin TEXT,
  customer_gstin TEXT,
  tin TEXT,
  irn TEXT,
  acknowledgement_number TEXT,
  
  -- Bundle & Batch
  bundle_sku_code_number TEXT,
  batch_code TEXT,
  vendor_batch_number TEXT,
  seller_sku_code TEXT,
  item_type_ean TEXT,
  imei TEXT,
  
  -- Adjustments
  fulfillment_tat TEXT,
  adjustment_in_selling_price DECIMAL(12, 2),
  adjustment_in_discount DECIMAL(12, 2),
  
  -- Courier Status
  shipping_courier_status TEXT,
  shipping_tracking_status TEXT,
  
  -- Additional Fields
  packet_number TEXT,
  item_seal_id TEXT,
  parent_sale_order_code TEXT,
  item_tag TEXT,
  shipment_tag TEXT,
  cashfree TEXT,
  tags TEXT,
  channel_shipping TEXT,
  item_details TEXT,
  
  -- Currency
  currency TEXT,
  currency_conversion_rate DECIMAL(10, 4),
  
  -- Raw data storage (JSONB)
  raw_data JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint to prevent duplicates
  UNIQUE(user_id, sale_order_code, item_sku_code)
);

CREATE INDEX idx_flipkart_user_id ON flipkart_data(user_id);
CREATE INDEX idx_flipkart_sale_order_code ON flipkart_data(sale_order_code);
CREATE INDEX idx_flipkart_order_date ON flipkart_data(order_date);
CREATE INDEX idx_flipkart_status ON flipkart_data(sale_order_status);
CREATE INDEX idx_flipkart_city ON flipkart_data(shipping_address_city);


-- ============================================
-- Amazon Domain Table
-- ============================================
CREATE TABLE IF NOT EXISTS amazon_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  -- Unique identifiers for deduplication
  sale_order_code TEXT,
  item_sku_code TEXT,
  
  -- Order Information
  sale_order_item_code TEXT,
  display_order_code TEXT,
  order_date TIMESTAMP,
  sale_order_status TEXT,
  on_hold BOOLEAN,
  priority TEXT,
  
  -- Reverse Pickup
  reverse_pickup_code TEXT,
  reverse_pickup_created_date TIMESTAMP,
  reverse_pickup_reason TEXT,
  
  -- Notification
  notification_email TEXT,
  notification_mobile TEXT,
  
  -- Customization
  require_customization BOOLEAN,
  sku_require_customization BOOLEAN,
  cod BOOLEAN,
  
  -- Shipping Address
  shipping_address_id TEXT,
  shipping_address_name TEXT,
  shipping_address_line_1 TEXT,
  shipping_address_line_2 TEXT,
  shipping_address_city TEXT,
  shipping_address_state TEXT,
  shipping_address_country TEXT,
  shipping_address_pincode TEXT,
  shipping_address_latitude DECIMAL(10, 8),
  shipping_address_longitude DECIMAL(11, 8),
  shipping_address_phone TEXT,
  
  -- Billing Address
  billing_address_id TEXT,
  billing_address_name TEXT,
  billing_address_line_1 TEXT,
  billing_address_line_2 TEXT,
  billing_address_city TEXT,
  billing_address_state TEXT,
  billing_address_country TEXT,
  billing_address_pincode TEXT,
  billing_address_latitude DECIMAL(10, 8),
  billing_address_longitude DECIMAL(11, 8),
  billing_address_phone TEXT,
  
  -- Shipping Method
  shipping_method TEXT,
  
  -- Product Details
  item_code TEXT,
  channel_product_id TEXT,
  item_type_name TEXT,
  item_type_color TEXT,
  item_type_size TEXT,
  item_type_brand TEXT,
  channel_name TEXT,
  sku_name TEXT,
  
  -- Category
  category TEXT,
  
  -- Pricing & Discounts
  mrp DECIMAL(12, 2),
  total_price DECIMAL(12, 2),
  selling_price DECIMAL(12, 2),
  cost_price DECIMAL(12, 2),
  discount DECIMAL(12, 2),
  prepaid_amount DECIMAL(12, 2),
  subtotal DECIMAL(12, 2),
  voucher_code TEXT,
  transfer_price DECIMAL(12, 2),
  
  -- Taxes
  gst_tax_type_code TEXT,
  cgst DECIMAL(12, 2),
  igst DECIMAL(12, 2),
  sgst DECIMAL(12, 2),
  utgst DECIMAL(12, 2),
  cess DECIMAL(12, 2),
  cgst_rate DECIMAL(5, 2),
  igst_rate DECIMAL(5, 2),
  sgst_rate DECIMAL(5, 2),
  utgst_rate DECIMAL(5, 2),
  cess_rate DECIMAL(5, 2),
  tcs_amount DECIMAL(12, 2),
  tax_percent DECIMAL(5, 2),
  tax_value DECIMAL(12, 2),
  
  -- Shipping Charges
  shipping_charges DECIMAL(12, 2),
  shipping_method_charges DECIMAL(12, 2),
  cod_service_charges DECIMAL(12, 2),
  gift_wrap_charges DECIMAL(12, 2),
  
  -- Shipping Status
  shipping_provider TEXT,
  shipping_courier TEXT,
  shipping_arranged_by TEXT,
  shipping_package_code TEXT,
  shipping_package_creation_date TIMESTAMP,
  shipping_package_status_code TEXT,
  shipping_package_type TEXT,
  tracking_number TEXT,
  dispatch_date TIMESTAMP,
  facility TEXT,
  delivery_time TEXT,
  
  -- Package Dimensions
  length_mm DECIMAL(10, 2),
  width_mm DECIMAL(10, 2),
  height_mm DECIMAL(10, 2),
  weight DECIMAL(10, 2),
  
  -- Item Status
  sale_order_item_status TEXT,
  cancellation_reason TEXT,
  
  -- Return Information
  return_date TIMESTAMP,
  return_reason TEXT,
  return_remarks TEXT,
  
  -- Invoice
  invoice_code TEXT,
  invoice_created TIMESTAMP,
  
  -- E-Way Bill
  eway_bill_no TEXT,
  eway_bill_date TIMESTAMP,
  eway_bill_valid_till TIMESTAMP,
  
  -- Gift & Customization
  gift_wrap TEXT,
  gift_message TEXT,
  
  -- Payment & Credits
  payment_instrument TEXT,
  store_credit DECIMAL(12, 2),
  
  -- Compliance
  hsn_code TEXT,
  gstin TEXT,
  customer_gstin TEXT,
  tin TEXT,
  irn TEXT,
  acknowledgement_number TEXT,
  
  -- Bundle & Batch
  bundle_sku_code_number TEXT,
  batch_code TEXT,
  vendor_batch_number TEXT,
  seller_sku_code TEXT,
  item_type_ean TEXT,
  imei TEXT,
  
  -- Adjustments
  fulfillment_tat TEXT,
  adjustment_in_selling_price DECIMAL(12, 2),
  adjustment_in_discount DECIMAL(12, 2),
  
  -- Courier Status
  shipping_courier_status TEXT,
  shipping_tracking_status TEXT,
  
  -- Additional Fields
  packet_number TEXT,
  item_seal_id TEXT,
  parent_sale_order_code TEXT,
  item_tag TEXT,
  shipment_tag TEXT,
  cashfree TEXT,
  tags TEXT,
  channel_shipping TEXT,
  item_details TEXT,
  
  -- Currency
  currency TEXT,
  currency_conversion_rate DECIMAL(10, 4),
  
  -- Raw data storage (JSONB)
  raw_data JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint to prevent duplicates
  UNIQUE(user_id, sale_order_code, item_sku_code)
);

CREATE INDEX idx_amazon_user_id ON amazon_data(user_id);
CREATE INDEX idx_amazon_sale_order_code ON amazon_data(sale_order_code);
CREATE INDEX idx_amazon_order_date ON amazon_data(order_date);
CREATE INDEX idx_amazon_status ON amazon_data(sale_order_status);
CREATE INDEX idx_amazon_city ON amazon_data(shipping_address_city);


-- ============================================
-- UPSERT Examples for Data Updates
-- ============================================
-- Use these patterns in your application for incremental updates

-- Example: UPSERT for AJIO data
-- INSERT INTO ajio_data (...columns...) VALUES (...values...)
-- ON CONFLICT (user_id, sale_order_code, item_code) DO UPDATE SET
--   sale_order_status = EXCLUDED.sale_order_status,
--   updated_at = CURRENT_TIMESTAMP,
--   ...other_fields...;

-- Example: UPSERT for Myntra data
-- INSERT INTO myntra_data (...columns...) VALUES (...values...)
-- ON CONFLICT (user_id, seller_order_id, seller_sku_code, size) DO UPDATE SET
--   order_status = EXCLUDED.order_status,
--   updated_at = CURRENT_TIMESTAMP,
--   ...other_fields...;

-- Example: UPSERT for Flipkart data
-- INSERT INTO flipkart_data (...columns...) VALUES (...values...)
-- ON CONFLICT (user_id, sale_order_code, item_sku_code) DO UPDATE SET
--   sale_order_status = EXCLUDED.sale_order_status,
--   updated_at = CURRENT_TIMESTAMP,
--   ...other_fields...;

-- Example: UPSERT for Amazon data
-- INSERT INTO amazon_data (...columns...) VALUES (...values...)
-- ON CONFLICT (user_id, sale_order_code, item_sku_code) DO UPDATE SET
--   sale_order_status = EXCLUDED.sale_order_status,
--   updated_at = CURRENT_TIMESTAMP,
--   ...other_fields...;
