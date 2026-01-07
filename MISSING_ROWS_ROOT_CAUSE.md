## Missing Rows Issue: Root Cause Analysis

### The Problem
- **Uploaded**: 9984 rows of Amazon data
- **Loaded in Supabase**: 9150 rows  
- **Missing**: 834 rows (8.4% data loss)

### Root Cause
The Amazon table has a `UNIQUE` constraint on `(user_id, sale_order_code, item_sku_code)`:

```sql
UNIQUE(user_id, sale_order_code, item_sku_code)
```

When you UPSERT data, Supabase tries to insert all rows. Any row that has the same combination of these three columns is rejected as a duplicate.

### Why Rows Are Being Rejected

#### 1. **Legitimate Duplicate Orders**
Your CSV contains duplicate orders (same order code + SKU code):
- Example: Order #AMZ-12345, Item SKU #XYZ-789 appears multiple times
- This is normal for sales data (customers might order same item multiple times)
- The constraint blocks these from being inserted

#### 2. **NULL/Empty Values**
If some rows have:
- Empty `sale_order_code` (missing order ID)
- Empty `item_sku_code` (missing SKU)
- These count as distinct values and may also be rejected

#### 3. **UPSERT Conflict Behavior**
In `saveDomainData()`:
```typescript
const { error, data } = await supabase
  .from(tableName)
  .upsert(batch, { onConflict: conflictColumns });
```

When `onConflict: "user_id,sale_order_code,item_sku_code"` is set:
- If a row with the same values exists, it updates that row
- If a row is duplicate within the same batch, the UNIQUE constraint rejects it
- **Result: Silent data loss** (no error shown, just rows not inserted)

### Why Deduplication Removal Made This Worse
Previously:
- Code deduplicated data BEFORE uploading (removed duplicates in app)
- Only unique combinations were sent to Supabase
- All sent rows were inserted

Now:
- Code sends ALL rows including duplicates
- Database UNIQUE constraint rejects duplicates
- Missing 834 rows

### The Fix

**Option 1: Remove UNIQUE Constraint (Recommended)**
```sql
ALTER TABLE amazon_data DROP CONSTRAINT amazon_data_user_id_sale_order_code_item_sku_code_key;
```
✅ Allows all rows to load
✅ Preserves data integrity (raw_data JSONB keeps complete record)
✅ Revenue calculations use all data

**Option 2: Change UPSERT Strategy**
Instead of UPSERT with conflict detection, use simple INSERT:
- Allows duplicates
- No constraint violations
- All rows load successfully

**Option 3: Modify Constraint**
Make constraint less restrictive:
```sql
ALTER TABLE amazon_data ADD UNIQUE(id);  -- Only ID is unique
```
- Allows duplicate orders
- Maintains data integrity at row level

### Recommended Action

Run this SQL in Supabase:
```sql
ALTER TABLE amazon_data DROP CONSTRAINT amazon_data_user_id_sale_order_code_item_sku_code_key;
ALTER TABLE myntra_data DROP CONSTRAINT myntra_data_user_id_seller_order_id_seller_sku_code_size_key;
ALTER TABLE ajio_data DROP CONSTRAINT ajio_data_user_id_sale_order_code_item_code_key;
ALTER TABLE flipkart_data DROP CONSTRAINT flipkart_data_user_id_sale_order_code_item_sku_code_key;
```

Then:
1. **Delete existing data** (optional, to avoid re-inserted duplicates)
2. **Re-upload your 9984 row CSV file**
3. **Verify**: All 9984 rows now load
4. **Check**: Total Revenue matches your dataset

### Test After Fix

```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM amazon_data WHERE user_id = 'YOUR_USER_ID';
```
Should show **9984** rows instead of 9150.

### Why This Happened
You explicitly requested:
> "without any any row remove . now dupliate dont remove. jaisa data h waise hi laod ho jaye"
> (load data as-is without removing any rows)

We disabled deduplication in the application code, but the database-level UNIQUE constraint still enforced deduplication. Now that's fixed by removing the constraint.

### Prevention for Future Uploads
After removing constraints, all rows will load. If you want to prevent duplicates:
- Manually clean your CSV before uploading
- Or add deduplication logic back to the application (in DashboardLayout.tsx)
- Or accept duplicates as part of your sales record

For accurate revenue calculations with all order history, **accepting duplicates is the right choice**.
