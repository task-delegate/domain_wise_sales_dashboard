# Database Setup Guide - Troubleshooting "Failed to Save Data"

## Problem
You're getting "Failed to save data. Please try again." error when uploading data.

## Root Causes & Solutions

### 1. **Tables Don't Exist in Supabase**
The most likely issue is that the domain-specific tables haven't been created yet.

#### Solution:
1. Open Supabase Dashboard: https://app.supabase.com
2. Go to your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire content from: `AJIO_FLIPKART_AMAZON_MYNTRA_SETUP.sql`
6. Paste it into the SQL editor
7. Click **Run** (Execute button)
8. Wait for the query to complete successfully

The script will create these 4 tables:
- `ajio_data` - For AJIO orders
- `myntra_data` - For Myntra orders
- `flipkart_data` - For Flipkart orders
- `amazon_data` - For Amazon orders

### 2. **User ID Not Available**
Make sure you're logged in with a valid user account.

#### Solution:
- Log out and log back in
- Check browser console (F12) for any authentication errors
- Ensure your Firebase/Auth provider is properly configured

### 3. **Data Validation Issues**
Your CSV/Excel file might be missing required column identifiers.

#### Solution:
Ensure your data file has clear column headers like:
- **For Myntra**: `seller order id`, `seller sku code`, `size`, `created on`
- **For AJIO**: `Sale Order Code`, `Item Code`, `Order Date as dd/mm/yyyy hh:MM:ss`
- **For Flipkart**: `Sale Order Code`, `Item SKU Code`, `Order Date as dd/mm/yyyy hh:MM:ss`
- **For Amazon**: `Sale Order Code`, `Item SKU Code`, `Order Date as dd/mm/yyyy hh:MM:ss`

### 4. **Check Browser Console for Detailed Errors**
The app now logs detailed error messages.

#### Solution:
1. Open browser DevTools: `F12` or `Ctrl+Shift+I`
2. Go to **Console** tab
3. Try uploading data again
4. Look for detailed error messages starting with:
   - "Supabase error for"
   - "Error saving domain data:"
5. Share these error messages for further debugging

### 5. **Verify Table Structure**
Check if tables exist in Supabase.

#### Solution:
1. Open Supabase Dashboard
2. Click **Table Editor**
3. You should see in the left sidebar:
   - `ajio_data`
   - `myntra_data`
   - `flipkart_data`
   - `amazon_data`

If they don't appear, run the SQL setup script from step 1.

## Step-by-Step Checklist

- [ ] SQL setup script executed in Supabase
- [ ] Tables visible in Supabase Table Editor
- [ ] User is logged in (check Authentication)
- [ ] CSV/Excel file has proper column headers
- [ ] Browser console shows no errors (F12)
- [ ] Try uploading a sample file with test data

## Sample Test Data Structure

### For AJIO:
```
Sale Order Code | Item Code | SKU Name | Order Date as dd/mm/yyyy hh:MM:ss | Selling Price | Total Price
SO001          | IC001     | Product1 | 07/01/2026 10:30:45               | 500           | 500
```

### For Myntra:
```
seller order id | seller sku code | size | created on | final amount
SO001          | SKU001          | M    | 07/01/2026 | 1000
```

### For Flipkart/Amazon:
```
Sale Order Code | Item SKU Code | SKU Name | Order Date as dd/mm/yyyy hh:MM:ss | Selling Price | Total Price
SO001          | SKU001        | Product1 | 07/01/2026 10:30:45               | 500           | 500
```

## If Issues Persist

1. **Check Supabase Status**: https://status.supabase.com
2. **Check your API Keys**: Verify Supabase URL and API keys in `utils/supabase.ts`
3. **Check RLS Policies**: Go to Supabase > Authentication > Policies
   - Ensure your user has INSERT/UPDATE permissions on the tables
4. **Check Rate Limits**: Supabase has rate limits, if uploading massive files, wait a moment

## Network Request Debugging

1. Open DevTools (F12) > **Network** tab
2. Try uploading data
3. Look for failed requests to `supabase.co`
4. Click on the failed request
5. Check **Response** tab for error details
6. Share the response content with developers

---

**After applying the fix, please report back with:**
- Did the SQL script run successfully?
- Do the tables appear in Supabase Table Editor?
- What error message appears in the browser console?
