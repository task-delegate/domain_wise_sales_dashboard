# Total Revenue Mismatch - Root Cause & Solution

## The Problem

Total Revenue in dashboard doesn't match your CSV/dataset because **the wrong column is being used to calculate revenue**.

---

## Current Revenue Mapping (Hardcoded):

**For AJIO:**
```typescript
revenue: 'Total Price'  // ❌ This is wrong if your column name is different
```

But your CSV might have columns named:
- ❌ `Selling Price`
- ❌ `MRP`
- ❌ `Final Amount`
- ✅ `Total Price` (if this is correct, should match)

---

## How to Fix It:

### Step 1: Identify Correct Revenue Column

**Open your CSV file and check:**

**For AJIO:** What column contains the final amount per order?
- `Total Price`? 
- `Selling Price`?
- `Final Amount`?
- `Amount`?

**For Myntra:** What column contains revenue?
- `Final Amount`?
- `Total MRP`?
- `Sale Price`?

**For Flipkart/Amazon:** What column contains revenue?
- `Total Price`?
- `Selling Price`?
- `Final Amount`?

---

## Solution:

### Fix 1: Check Column Mapping

Go to `utils/supabase.ts` line 460-480 and update:

**Current (Hardcoded):**
```typescript
revenue: 'Total Price',  // ❌ May be wrong
```

**Should be:**
```typescript
// AJIO
revenue: 'total price',  // or 'Total Price' or 'Selling Price' - check your CSV

// Myntra
revenue: 'final amount',  // or 'Final Amount'

// Flipkart/Amazon
revenue: 'total price',  // or whatever column name you have
```

### Fix 2: Case Sensitivity

The column names are CASE SENSITIVE! 
- ❌ `Total Price` ≠ `total price`
- ❌ `Final Amount` ≠ `final amount`

Check your CSV header exactly as it appears.

### Fix 3: Use AI to Auto-Detect (Better Solution)

Instead of hardcoding, let Groq AI detect the revenue column:

```typescript
// In gemini.ts - already does this!
// The AI response maps: "revenue": "column name from csv"
```

The AI should return something like:
```json
{
  "revenue": "total price",
  "quantity": "quantity",
  "date": "order date"
}
```

---

## Verification:

### To verify the revenue column is correct:

1. **Upload your CSV**
2. **Check browser console (F12 → Console)**
3. **Look for message like:**
   ```
   Groq response: {
     "revenue": "total price",
     ...
   }
   ```

4. **Compare with your CSV:**
   - Does your CSV have a column named exactly as Groq detected?
   - Is the case (uppercase/lowercase) correct?

5. **Manual calculation:**
   - Sum all values in that column manually
   - Compare with dashboard Total Revenue
   - If it matches → column is correct ✅
   - If it doesn't → wrong column ❌

---

## Common Issues:

| Issue | Fix |
|-------|-----|
| Dashboard shows 0 revenue | Column name doesn't match CSV header |
| Revenue is too high | Wrong column (like MRP instead of Selling Price) |
| Revenue is too low | Column name case is wrong (`total price` vs `Total Price`) |
| Revenue has decimals missing | Data type parsing issue (string vs number) |

---

## Quick Test:

**Do this to find the exact column name:**

1. Open your CSV in Excel/Sheets
2. Look at the header row (first row)
3. Find the column that has sales amounts
4. Copy the EXACT column name (including capitals, spaces, punctuation)
5. Tell me what it is

**Example:**
- AJIO CSV column: `"Total Price"` → revenue: 'Total Price'
- Myntra CSV column: `"final amount"` → revenue: 'final amount'
- Flipkart CSV column: `"Total Price"` → revenue: 'Total Price'

---

## Tell Me:

Please provide for EACH domain:
1. **Domain name** (Myntra/AJIO/Flipkart/Amazon)
2. **Exact column name from your CSV** (for sales amount)
3. **Total revenue from your dataset** (manually calculated or from export)
4. **Total revenue showing in dashboard** (screenshot of KPI)

Example:
```
Myntra:
- Column: "Final Amount"
- CSV Total: ₹50,000,000
- Dashboard: ₹25,000,000 (MISMATCH - wrong column!)
```

Then I'll fix it! 💰
