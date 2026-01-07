# Data Persistence & Duplicate Removal Workflow

## Overview
The dashboard has a complete workflow for data persistence and automatic duplicate removal:

1. **Data Upload** → Save to Supabase
2. **Auto-load** → Retrieve data on next login
3. **Merge New Data** → Add to existing data
4. **Auto-deduplicate** → Remove duplicate records

---

## How It Works

### 1. Data Upload & Save (First Time)

**What Happens:**
- User uploads CSV/Excel file
- App analyzes column structure using Gemini AI
- Data is transformed to domain-specific format
- Data is saved to Supabase with UPSERT operation

**Code Flow:**
```
UploadModal → processData()
    ↓
DashboardLayout → handleFileUpload()
    ↓
supabase.ts → saveDomainData()
    ↓
Domain-specific table (ajio_data, myntra_data, etc.)
```

**Database Actions:**
- Creates UNIQUE constraint to identify duplicates
- Stores `raw_data` as JSONB for complete record preservation
- Tracks `created_at` and `updated_at` timestamps

### 2. Auto-Load on Login

**What Happens:**
- User logs in (authentication)
- DashboardLayout mounts
- System calls `getUserDomains()` to find all available domains
- Loads data from Supabase for each domain
- Populates dashboard with existing data

**Code Flow:**
```
DashboardLayout useEffect (on userId change)
    ↓
getUserDomains(userId)
    ↓
FOR each domain:
    loadDomainData(userId, domain)
        ↓
Load raw_data from domain table
        ↓
Reconstruct DomainData object
        ↓
setAllData (update React state)
```

**Result:**
- Dashboard shows all previously saved data
- Data persists across browser sessions
- No data loss on logout/login

### 3. Merge New Data

**What Happens:**
- User uploads new data for same domain
- App merges new data with existing data
- Deduplication logic removes matching records
- Consolidated data saved to Supabase

**Code Flow:**
```
handleFileUpload()
    ↓
Get existing data: allData[domain].data
Get new data: from CSV upload
    ↓
mergeAndDeduplicateData(existing, new, mapping, domain)
    ↓
Creates unique identifiers for each row:
    - Myntra: seller_order_id + seller_sku_code + size
    - AJIO: Sale Order Code + Item Code
    - Flipkart/Amazon: Sale Order Code + Item SKU Code
    ↓
Filter out duplicates from new data
    ↓
Combine: [...existing, ...deduplicated_new]
    ↓
saveDomainData() with UPSERT
    ↓
Update React state
```

### 4. Duplicate Removal (Two Levels)

#### Level 1: Application Level (mergeAndDeduplicateData)
- Compares using domain-specific unique identifiers
- Prevents duplicate records in memory before save
- Logs duplicates detected

#### Level 2: Database Level (UNIQUE Constraint)
- Supabase enforces UNIQUE constraint
- If duplicate is somehow inserted, database rejects it
- Uses `onConflict` with UPSERT to update existing records

**Unique Constraints by Domain:**
```sql
-- Myntra
UNIQUE(user_id, seller_order_id, seller_sku_code, size)

-- AJIO
UNIQUE(user_id, sale_order_code, item_code)

-- Flipkart
UNIQUE(user_id, sale_order_code, item_sku_code)

-- Amazon
UNIQUE(user_id, sale_order_code, item_sku_code)
```

---

## Complete Workflow Example

### Scenario: User uploads Myntra data 3 times

**Upload 1: Initial data (100 records)**
```
CSV: 100 rows
↓
saveDomainData()
↓
Supabase: myntra_data table has 100 records (user_id=ABC)
↓
Dashboard displays: 100 orders
```

**Upload 2: 60 old records + 40 new (100 total in file)**
```
CSV: 100 rows (60 duplicates + 40 new)
↓
mergeAndDeduplicateData():
  - Compare with existing 100 records
  - Identify 60 as duplicates (same seller_order_id + seller_sku_code + size)
  - Keep only 40 new records
↓
Merged data: 100 + 40 = 140 records
↓
saveDomainData() with UPSERT:
  - 60 existing records updated (if any field changed)
  - 40 new records inserted
↓
Supabase: myntra_data table has 140 records
↓
Dashboard displays: 140 orders
```

**Upload 3: 90 old records + 50 new (140 total in file)**
```
CSV: 140 rows (90 duplicates + 50 new)
↓
mergeAndDeduplicateData():
  - Identify 90 as duplicates
  - Keep only 50 new records
↓
Merged data: 140 + 50 = 190 records
↓
Supabase: myntra_data table has 190 records
↓
Dashboard displays: 190 orders
```

---

## Data Persistence Flow

### Session 1: User A logs in
```
1. Load from Supabase → 190 Myntra records
2. Upload new data → Merge & save
3. Logout
```

### Session 2: User A logs in again
```
1. Load from Supabase → Retrieves same 190+ records
2. Dashboard shows all historical data
3. Can upload more or analyze existing
```

### Technical Details

**localStorage (Client):**
```javascript
userId = localStorage.getItem('userId')
// Stored locally, persists across browser sessions
```

**Supabase (Server):**
```
Raw data stored as JSONB:
{
  user_id: "user_123...",
  raw_data: {
    "seller order id": "ORD001",
    "seller sku code": "SKU001",
    "size": "M",
    "final amount": 1000,
    ...all original CSV columns...
  },
  created_at: "2026-01-07T10:00:00Z",
  updated_at: "2026-01-07T10:00:00Z"
}
```

---

## Automatic Features

### ✅ Automatic Deduplication
- No user action needed
- Happens transparently when new data is uploaded
- Duplicates logged to browser console

### ✅ Automatic Data Persistence
- No configuration required
- All data automatically persisted to Supabase
- Survives browser close/reopen

### ✅ Automatic Merging
- New uploads automatically merge with existing
- Preserves all historical data
- Shows cumulative insights

### ✅ Automatic Incremental Updates
- UPSERT operations update existing records if fields change
- `updated_at` timestamp automatically updated
- Tracks when records were last modified

---

## Important Notes

1. **User ID**: Stored in localStorage, unique per browser
2. **Data Ownership**: All data associated with user_id
3. **Privacy**: Different users see only their own data
4. **Deduplication Key**: Domain-specific identifiers (order ID + product ID)
5. **Raw Data**: Original CSV data preserved in JSONB for audit trail

---

## Troubleshooting

### Data not loading after login
- Check browser console for errors
- Verify Supabase tables exist (run SQL setup)
- Check user_id in localStorage

### Duplicates not being removed
- Ensure CSV has consistent column names
- Check domain-specific unique identifiers in data
- Review console logs for skipped records

### Data appearing to be lost
- Check Supabase table for data
- Verify user_id is same (check localStorage)
- Check `updated_at` timestamp in database

---

## Key Code References

**Loading Data:** [DashboardLayout.tsx](components/DashboardLayout.tsx#L43-L65)
**Saving Data:** [supabase.ts](utils/supabase.ts#L340-L410)
**Merging & Deduplication:** [supabase.ts](utils/supabase.ts#L470-L500)
**Getting User Domains:** [supabase.ts](utils/supabase.ts#L440-L465)
