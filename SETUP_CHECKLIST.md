# Domain-Wise Sales Dashboard - Setup Checklist

## ✅ COMPLETED
- [x] Repository created on GitHub
- [x] Code pushed to GitHub
- [x] Groq API key configured
- [x] 4 domain-specific Supabase tables designed
- [x] Duplicate detection logic implemented
- [x] Automatic merge functionality added

## 📋 YOUR TODO LIST

### Step 1: Create Supabase Tables (5 minutes)
**Location:** https://zwzvdcfpwprfighayyvj.supabase.co

1. Click **SQL Editor** → **New Query**
2. Copy the SQL from [DOMAIN_TABLES_SETUP.sql](DOMAIN_TABLES_SETUP.sql)
3. Paste and click **Run**

**Tables Created:**
- ✅ `myntra_data` - Unique: seller_order_id + seller_sku_code + size
- ✅ `amazon_data` - Unique: sale_order_code + item_sku_code
- ✅ `flipkart_data` - Unique: sale_order_code + item_sku_code
- ✅ `ajio_data` - Unique: sale_order_code + item_code

### Step 2: Deploy to Vercel (1-2 minutes)
**Your app is already deployed and will auto-redeploy from GitHub**

Or manually trigger:
1. Go to https://vercel.com/dashboard
2. Open your project
3. Wait for automatic redeploy (watch "Deployments")

### Step 3: Test the Application (10 minutes)

**Test 1: Upload Myntra Data**
1. Open https://domain-wise-sales-dashboard.vercel.app/
2. Select **Myntra** domain
3. Click **Upload New Data**
4. Upload your Myntra CSV/Excel file
5. ✅ Should show in dashboard

**Test 2: Verify Data Persists**
1. Click **Logout**
2. Click **Login**
3. ✅ Myntra data should still be there

**Test 3: Duplicate Detection**
1. Upload the **same Myntra file again**
2. ✅ Should see: "Added 0 new unique rows" (duplicates removed)
3. ✅ Dashboard shows same number of rows

**Test 4: Merge New Data**
1. Create a new file with same Myntra format
2. Add a few **new rows** (different order IDs/SKUs)
3. Upload
4. ✅ New rows added, old rows unchanged
5. ✅ Total count increases only by new rows

**Test 5: Multi-Domain**
1. Upload **Amazon** data
2. Upload **Flipkart** data
3. Upload **AJIO** data
4. ✅ Each domain shows its own data
5. ✅ No mixing between domains

## 📊 DATA FLOW

```
Your File (Excel/CSV)
    ↓
Upload to App
    ↓
AI Analyzes Columns
    ↓
Maps to Domain Schema
    ↓
Check Supabase (UNIQUE constraint)
    ↓
DUPLICATES? → Rejected ❌
NEW DATA? → Inserted ✅
    ↓
Refresh Dashboard
    ↓
Show All Data (Old + New)
```

## 📁 FILES REFERENCE

### Core Files Updated
- `utils/supabase.ts` - Domain-specific database functions
- `components/DashboardLayout.tsx` - Handles uploads and data persistence
- `DOMAIN_TABLES_SETUP.sql` - SQL to create all 4 tables

### Documentation
- `SUPABASE_SETUP.md` - Complete setup guide
- `DOMAIN_TABLES_SETUP.sql` - Create tables script
- `README.md` - Project overview

### Configuration
- `.env.local` - Contains VITE_GROQ_API_KEY (already set)
- `package.json` - Dependencies and scripts

## 🎯 KEY FEATURES

| Feature | Details |
|---------|---------|
| **Domain Isolation** | Each domain has its own Supabase table |
| **Automatic Dedup** | UNIQUE constraint prevents duplicates at DB level |
| **Merge Data** | New uploads automatically merge with existing |
| **Persist Data** | Survives logout/login/refresh |
| **Multi-Domain** | Manage 4 domains simultaneously |
| **AI Column Mapping** | Automatically detects your column structure |

## ⚠️ IMPORTANT NOTES

1. **Domain names are case-sensitive:**
   - Use exactly: `Myntra`, `Amazon`, `Flipkart`, `AJIO`
   - NOT: `myntra`, `amazon`, `flipkart`, `ajio`

2. **First time setup:**
   - When you first upload a domain, it creates the record in that table
   - Subsequent uploads merge automatically

3. **Unique identifier per domain:**
   - Myntra: `seller_order_id + seller_sku_code + size`
   - Amazon: `sale_order_code + item_sku_code`
   - Flipkart: `sale_order_code + item_sku_code`
   - AJIO: `sale_order_code + item_code`

4. **Browser localStorage:**
   - userId is stored in browser localStorage
   - If you clear cache, userId resets but data remains in Supabase

## 🔗 USEFUL LINKS

- **GitHub Repo:** https://github.com/task-delegate/domain_wise_sales_dashboard
- **Live App:** https://domain-wise-sales-dashboard.vercel.app/
- **Supabase Dashboard:** https://zwzvdcfpwprfighayyvj.supabase.co
- **Vercel Dashboard:** https://vercel.com/dashboard

## 📞 TROUBLESHOOTING

**Q: I uploaded data but don't see it in the dashboard?**
- Wait 30 seconds for dashboard to refresh
- Check browser console (F12) for errors
- Verify Supabase tables were created

**Q: Same data keeps getting added (no duplicate detection)?**
- Wait for Vercel redeploy (can take 2-3 minutes)
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check that unique columns are being detected correctly

**Q: Data disappeared after logout/login?**
- Check Supabase tables have the data
- Check if userId in localStorage is being restored
- Check browser DevTools → Application → LocalStorage

**Q: Different domains showing same data?**
- Each domain should have separate table
- Check domain name spelling (case-sensitive)
- Clear browser cache and try again

## ✨ NEXT STEPS (OPTIONAL)

1. Add more domains (Nykaa, etc.) - just follow same pattern
2. Set up authentication (currently using anonymous userId)
3. Add data backup/export feature
4. Create reports by domain
5. Track data upload history

---

**Status:** Ready to test! 🚀
**Questions?** Check SUPABASE_SETUP.md for detailed guide
