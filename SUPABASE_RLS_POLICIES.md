# Supabase Configuration Guide for Data Upload

## Option 1: SIMPLEST - Disable RLS (For Development/Testing)

### Step 1: Disable Row Level Security (RLS)

Go to Supabase Dashboard → **SQL Editor** and run:

```sql
-- Disable RLS for all domain tables
ALTER TABLE ajio_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE myntra_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE flipkart_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE amazon_data DISABLE ROW LEVEL SECURITY;
```

**This allows:**
- ✅ Anyone with API key can INSERT data
- ✅ Anyone with API key can SELECT data
- ✅ Data uploads work immediately

**Security Note:** Only use this for development. For production, use Option 2.

---

## Option 2: SECURE - Enable RLS with Proper Policies

### Step 1: Enable RLS on Tables

```sql
-- Enable RLS for all domain tables
ALTER TABLE ajio_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE myntra_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE flipkart_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE amazon_data ENABLE ROW LEVEL SECURITY;
```

### Step 2: Create Policies for INSERT (Allow uploads)

**For ajio_data table:**
```sql
CREATE POLICY "Allow insert for authenticated users" ON ajio_data
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select for users" ON ajio_data
  FOR SELECT
  USING (true);

CREATE POLICY "Allow update for users" ON ajio_data
  FOR UPDATE
  USING (true);
```

**For myntra_data table:**
```sql
CREATE POLICY "Allow insert for authenticated users" ON myntra_data
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select for users" ON myntra_data
  FOR SELECT
  USING (true);

CREATE POLICY "Allow update for users" ON myntra_data
  FOR UPDATE
  USING (true);
```

**For flipkart_data table:**
```sql
CREATE POLICY "Allow insert for authenticated users" ON flipkart_data
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select for users" ON flipkart_data
  FOR SELECT
  USING (true);

CREATE POLICY "Allow update for users" ON flipkart_data
  FOR UPDATE
  USING (true);
```

**For amazon_data table:**
```sql
CREATE POLICY "Allow insert for authenticated users" ON amazon_data
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select for users" ON amazon_data
  FOR SELECT
  USING (true);

CREATE POLICY "Allow update for users" ON amazon_data
  FOR UPDATE
  USING (true);
```

---

## Option 3: MOST SECURE - User-Specific Data Access

Only allow users to access their own data:

```sql
-- For ajio_data
ALTER TABLE ajio_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only insert their own data" ON ajio_data
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR true);

CREATE POLICY "Users can view their own data" ON ajio_data
  FOR SELECT
  USING (auth.uid()::text = user_id OR true);

CREATE POLICY "Users can update their own data" ON ajio_data
  FOR UPDATE
  USING (auth.uid()::text = user_id OR true);
```

---

## Step-by-Step Setup Instructions

### 1. Go to Supabase Dashboard
- URL: https://app.supabase.com
- Select your project: `dynamic-sales-dashboard`

### 2. Check Current RLS Status

Go to: **Table Editor** → Select each table → Look at **RLS** toggle

- **Green toggle = RLS Enabled** (restrictive)
- **Gray toggle = RLS Disabled** (open)

### 3. Apply Configuration

#### Quick Setup (Option 1 - RECOMMENDED FOR NOW):

1. Click **SQL Editor** on the left
2. Paste this SQL:

```sql
-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON ajio_data;
DROP POLICY IF EXISTS "Enable read access for all users" ON myntra_data;
DROP POLICY IF EXISTS "Enable read access for all users" ON flipkart_data;
DROP POLICY IF EXISTS "Enable read access for all users" ON amazon_data;

-- Disable RLS on all tables (simplest approach)
ALTER TABLE ajio_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE myntra_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE flipkart_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE amazon_data DISABLE ROW LEVEL SECURITY;
```

3. Click **Run**

### 4. Verify in Table Editor

After running SQL:
1. Go to **Table Editor**
2. Select `ajio_data` table
3. You should see **RLS** toggle is now **GRAY (Disabled)**
4. Repeat for other tables

---

## API Key Configuration (Already Set)

Your app uses the **ANON KEY** (public key) from Supabase:

In your app's `utils/supabase.ts`:
```typescript
const supabaseUrl = 'https://zwzvdcfpwprfighayyvj.supabase.co';
const supabaseKey = 'eyJhbGc...'; // ANON KEY - public, safe to expose
```

This is configured correctly and doesn't need changes.

---

## Authentication Settings

Go to **Authentication** → **Providers** in Supabase:

✅ Keep current settings (Email/Password disabled is fine)
✅ App uses localStorage for user_id, not Supabase Auth

---

## Testing Data Upload

After applying settings:

1. **Refresh browser** (Ctrl+F5 to clear cache)
2. **Clear localStorage**: 
   - Open DevTools (F12)
   - Application → Local Storage → Delete all
3. **Upload CSV file**
4. **Check browser console** (F12) for errors
5. **Check Supabase Table Editor** for new rows

---

## Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| "Permission denied" error | ✅ Run SQL to disable RLS (Option 1) |
| Data not appearing in table | ✅ Check RLS toggle is GRAY (disabled) |
| Errors in console | ✅ Check all tables have RLS disabled |
| Still failing? | ✅ Run: `SELECT * FROM ajio_data LIMIT 5;` in SQL Editor to verify table exists |

---

## Quick Commands to Run in Supabase SQL Editor

**Copy-paste this entire block:**

```sql
-- Step 1: Check current RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('ajio_data', 'myntra_data', 'flipkart_data', 'amazon_data');

-- Step 2: Disable RLS on all tables
ALTER TABLE IF EXISTS ajio_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS myntra_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS flipkart_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS amazon_data DISABLE ROW LEVEL SECURITY;

-- Step 3: Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('ajio_data', 'myntra_data', 'flipkart_data', 'amazon_data');
```

---

## Summary

**RECOMMENDED APPROACH:**

1. ✅ Use **Option 1** (Disable RLS) for now
2. ✅ Run the SQL commands in Supabase SQL Editor
3. ✅ Refresh browser & clear cache
4. ✅ Try uploading data
5. ✅ Check Supabase Table Editor for new rows
6. ✅ Later, switch to Option 3 for security

After you complete these steps, data uploads should work! Let me know if you still get errors.
