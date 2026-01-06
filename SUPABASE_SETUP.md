# Supabase Setup Guide - Domain-Specific Tables

## Overview

Your dashboard now uses **4 separate Supabase tables** (one per domain):
- `myntra_data` - for Myntra orders
- `amazon_data` - for Amazon orders
- `flipkart_data` - for Flipkart orders
- `ajio_data` - for AJIO orders

Each table has **built-in duplicate detection** using unique constraints.

## Step 1: Create Domain Tables

Go to your Supabase dashboard and execute the SQL from [DOMAIN_TABLES_SETUP.sql](DOMAIN_TABLES_SETUP.sql):

1. Visit: https://zwzvdcfpwprfighayyvj.supabase.co
2. Click **SQL Editor** → **New Query**
3. Copy ALL the SQL from `DOMAIN_TABLES_SETUP.sql`
4. Paste and click **Run**

This creates:
- ✅ `myntra_data` table (unique: seller_order_id + seller_sku_code + size)
- ✅ `amazon_data` table (unique: sale_order_code + item_sku_code)
- ✅ `flipkart_data` table (unique: sale_order_code + item_sku_code)
- ✅ `ajio_data` table (unique: sale_order_code + item_code)

## How It Works

### Upload New Data
1. User uploads CSV/Excel file (e.g., Amazon.csv)
2. AI analyzes and maps columns
3. App checks for duplicates at database level
4. **Duplicates are automatically rejected by Supabase UNIQUE constraint**
5. Only new rows are inserted
6. User sees all data (old + new) in dashboard

### Login Flow
1. User logs in (userId stored in localStorage)
2. App loads data from **domain-specific table**
3. Dashboard displays all historical data
4. User can add more data anytime

### Duplicate Detection

Each domain has a unique identifier:

| Domain | Unique By |
|--------|-----------|
| **Myntra** | `seller_order_id` + `seller_sku_code` + `size` |
| **AJIO** | `sale_order_code` + `item_code` |
| **Flipkart** | `sale_order_code` + `item_sku_code` |
| **Amazon** | `sale_order_code` + `item_sku_code` |

**Example:**
- Upload: Amazon order #12345, SKU XYZ → Saved ✅
- Upload same again → Database rejects duplicate ❌
- Upload: Amazon order #12345, SKU ABC → Saved (different SKU) ✅

## Step 2: Deploy to Vercel

```bash
git add .
git commit -m "Add domain-specific Supabase tables"
git push origin main
```

Vercel auto-deploys in 1-2 minutes.

## Step 3: Test It

1. Open https://domain-wise-sales-dashboard.vercel.app/
2. **Myntra domain:**
   - Upload Myntra data → Data saved in `myntra_data` table ✅
   - Logout/Login → Data still there ✅
   - Upload same file again → Duplicates removed ✅
   
3. **Amazon domain:**
   - Upload Amazon data → Data saved in `amazon_data` table ✅
   - Add new rows for same orders → Auto-merges ✅
   
4. **Each domain is completely isolated** - Myntra data in `myntra_data`, Amazon data in `amazon_data`, etc.

## Column Mappings by Domain

### Myntra
- Order ID: `seller order id`
- Date: `created on`
- Customer: (in raw data)
- SKU: `seller sku code`
- Size: `size`
- Price: `final amount`
- Discount: `discount`
- Status: `order status`

### AJIO
- Order ID: `Sale Order Code`
- Date: `Order Date as dd/mm/yyyy hh:MM:ss`
- Item: `Item Code`
- SKU: `SKU Name`
- Price: `Selling Price`
- Revenue: `Total Price`
- Discount: `Discount`
- Status: `Sale Order Status`

### Flipkart
- Order ID: `Sale Order Code`
- Date: `Order Date as dd/mm/yyyy hh:MM:ss`
- Item: `Item SKU Code`
- City: `Shipping Address City`
- Price: `Selling Price`
- Revenue: `Total Price`
- Discount: `Discount`
- Status: `Sale Order Status`

### Amazon
- Order ID: `Sale Order Code`
- Date: `Order Date as dd/mm/yyyy hh:MM:ss`
- Item: `Item SKU Code`
- City: `Shipping Address City`
- Price: `Selling Price`
- Revenue: `Total Price`
- Discount: `Discount`
- Status: `Sale Order Status`

## Data Persistence Flow

```
Upload CSV/Excel
    ↓
AI analyzes column structure
    ↓
Map columns to domain schema
    ↓
Check database for duplicates (UNIQUE constraint)
    ↓
Insert only new rows → Supabase domain table
    ↓
Load in dashboard (all historical + new data)
    ↓
User sees merged data ✅
```

## Files Updated

- `utils/supabase.ts` - Domain-specific save/load functions
- `components/DashboardLayout.tsx` - Uses domain-specific tables
- `DOMAIN_TABLES_SETUP.sql` - SQL to create all 4 tables
- `.env.local` - Contains VITE_GROQ_API_KEY

## Troubleshooting

**Q: Data not saving?**
- Check Supabase SQL Editor - is the table created?
- Open browser DevTools → Console → Check errors
- Make sure `user_id` is being set (should see in localStorage)

**Q: Duplicates still being saved?**
- Wait for Vercel redeploy (can take 2-3 minutes)
- Clear browser cache (Ctrl+Shift+Del)
- Verify UNIQUE constraint exists in Supabase

**Q: Different domains mixing data?**
- Each domain has separate table - shouldn't happen
- Check that domain name matches exactly: "Myntra" ≠ "myntra"

## Next Steps

1. ✅ Create domain tables (SQL)
2. ✅ Push code to GitHub
3. ✅ Test uploading data for each domain
4. Monitor Supabase dashboard for data growth
5. Add more domains (Nykaa, etc.) by following same pattern

