# CRITICAL: Execute These Steps Immediately

## The Problem
Your Supabase tables still have `user_id UUID` type, but your app now generates TEXT format UUIDs.
Database expects: `f47ac10b-58cc-4372-a567-0e02b2c3d479` (UUID type)
Database is receiving: `user_1767763195573_730xz19yu` (old TEXT format)

## Solution: 3 Quick Steps

### STEP 1: Clear Your Browser Data
Press F12 (DevTools) → Application → Local Storage → Right-click "localhost" → Clear

### STEP 2: Drop Old Tables in Supabase
Go to: https://app.supabase.com → Your Project → SQL Editor

Paste and run this SQL:

```sql
-- Drop old tables with wrong schema
DROP TABLE IF EXISTS public.myntra_data CASCADE;
DROP TABLE IF EXISTS public.ajio_data CASCADE;
DROP TABLE IF EXISTS public.flipkart_data CASCADE;
DROP TABLE IF EXISTS public.amazon_data CASCADE;
DROP TABLE IF EXISTS public.domain_data CASCADE;
```

Click **RUN**

### STEP 3: Create New Tables with Correct Schema
Copy the ENTIRE content from: `AJIO_FLIPKART_AMAZON_MYNTRA_SETUP.sql`

Go back to Supabase SQL Editor and paste the entire file content, then click **RUN**

### STEP 4: Disable RLS
Paste and run this in SQL Editor:

```sql
-- Disable RLS so data can be inserted
ALTER TABLE IF EXISTS ajio_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS myntra_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS flipkart_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS amazon_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS domain_data DISABLE ROW LEVEL SECURITY;
```

Click **RUN**

### STEP 5: Test Upload
1. Refresh your app (Ctrl+F5)
2. Try uploading a CSV file
3. Open F12 Console and look for success/error messages
4. Check Supabase Table Editor to verify data appears

---

## Verification Checklist

After Step 4, verify your tables are correctly set up:

In Supabase SQL Editor, run:

```sql
-- Check table schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'myntra_data' 
ORDER BY ordinal_position;
```

You should see: `user_id | text`

Not: `user_id | uuid`

---

## If Still Getting Errors

1. **"Table does not exist"** → Tables weren't created. Paste full SQL and run Step 3 again
2. **"Permission denied"** → RLS still enabled. Run Step 4 again
3. **"Column not found"** → Schema mismatch. Drop and recreate tables (Steps 2-3)

---

## Why This Happened

1. You created SQL file with TEXT type (correct)
2. Original Supabase tables had UUID type (wrong)
3. Your app's UUID v4 generation is correct
4. But database schema didn't match → Error

This fix aligns everything: **App generates UUID v4 → Database accepts TEXT → Data saves successfully**

---

**Do these steps and reply with the result!**
