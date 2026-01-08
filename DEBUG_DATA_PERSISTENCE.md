# Debug Guide: Why Dashboard Data Changes After Sign Out/In

## The Expected Behavior ✓

Your userId **should** persist across sign out/in. This is intentional:

```tsx
// In App.tsx handleLogout:
// Note: userId is intentionally persisted in localStorage across sign out/in
// This ensures users see their data on sign-in without losing it
```

## Verification Steps

### Step 1: Check if localStorage is persisting your userId

**In DevTools Console** (F12 → Console tab):
```javascript
// Before logout
console.log('Before logout:', localStorage.getItem('userId'));

// After logout (navigate back to login, then login again)
console.log('After login:', localStorage.getItem('userId'));

// Should be IDENTICAL if working correctly
```

### Step 2: Check if browser is clearing localStorage

**Possible causes:**
- 🔴 Using **Incognito/Private Mode** (clears localStorage on close)
- 🔴 Browser privacy settings auto-clearing site data
- 🔴 Browser extensions clearing localStorage
- 🟢 Regular browsing mode should preserve

**Fix:**
- Use regular browsing mode (not incognito)
- Check browser settings: Settings → Privacy → Clear site data on close (toggle OFF)

### Step 3: Verify Supabase is retrieving your data

**In DevTools Console:**
```javascript
// Check the network tab while logging in
// Look for requests to: https://zwzvdcfpwprfighayyvj.supabase.co/rest/v1/myntra_data

// Or check the browser console for logs like:
// "Loaded data for 1 domains from Supabase"
```

### Step 4: Check the Supabase database directly

**In Supabase Dashboard:**
1. Go to your Supabase project
2. Click **Editor** → Select table `myntra_data` (or your domain)
3. **Filter by user_id** column:
   - Look for your userId from localStorage
   - Should show all your uploaded data

## What Each Column Means

| Column | Meaning |
|--------|---------|
| `user_id` | Your unique ID from localStorage |
| `raw_data` | Original CSV row (before transformation) |
| `created_at` | When data was inserted |
| Other columns | Domain-specific fields (seller_sku_code, final_amount, etc.) |

## If Data is Still Different After Sign Out/In

**Possible reasons:**

### ❌ Reason 1: localStorage is actually being cleared
**Verify:**
```javascript
localStorage.getItem('userId')  // Check if this changes after logout/login
```

**Solution:**
- Don't use incognito mode
- Disable browser extensions that clear data
- Change browser privacy settings

### ❌ Reason 2: Multiple users / Multiple browsers
**Verify:**
- Are you using different browsers? (Chrome, Firefox, Safari)
- Are you on different devices?
- Each will have a DIFFERENT userId

**Solution:**
- Use the SAME browser and device
- userId is device/browser specific, not account specific

### ❌ Reason 3: Data wasn't actually uploaded
**Verify:**
1. Upload CSV → See loading spinner
2. After upload completes → Check if you see "No data" placeholder
3. If NO data appears → Upload failed silently

**Solution:**
- Check browser console (F12) for error messages
- Check Groq API key is set (in Vercel env vars or .env.local)
- Upload again with error details

### ❌ Reason 4: Wrong domain selected
**Verify:**
- After uploading to "Myntra" domain
- Make sure you're viewing "Myntra" dashboard (not "Amazon" or "All Domains")

**Solution:**
- Click on the domain name in the sidebar that matches your upload

## The Complete Data Flow

```
1. Sign In → App.tsx setIsAuthenticated(true)
2. DashboardLayout useEffect fires → loads userId from localStorage
3. Second useEffect → calls loadDomainData(userId, domain) for each domain
4. Supabase query: SELECT * FROM myntra_data WHERE user_id = [YOUR_ID]
5. Data displayed in Dashboard

Sign Out:
6. App.tsx handleLogout → setIsAuthenticated(false), userId STAYS in localStorage
7. LoginPage shows

Sign In Again:
8. Same userId loaded from localStorage
9. loadDomainData queries with SAME user_id
10. Same data appears ✓
```

## Confirming the Fix Works

**Test Case:**
1. Upload data to "Myntra" domain
2. See charts/KPIs display
3. Click "End Session" (sign out)
4. Click anywhere to trigger login screen
5. Sign in again with ANY email/password
6. **EXPECTED**: Same Myntra data appears with same KPIs
7. **Check**: DevTools → Application → localStorage → userId is IDENTICAL

**Success Indicator:**
```javascript
// Before logout
userId = "abc123-def456-ghi789"
data count = 150 rows

// After logout+login
userId = "abc123-def456-ghi789"  // ← SAME
data count = 150 rows  // ← SAME
```

## If Something is Wrong

**Check this file:** [USER_ID_AND_DATA_PERSISTENCE.md](USER_ID_AND_DATA_PERSISTENCE.md)
**Or check code:** [App.tsx](App.tsx#L9-L14) and [DashboardLayout.tsx](components/DashboardLayout.tsx#L27-L40)

## Summary

- ✅ userId persists across logout/login (by design)
- ✅ All data is filtered by user_id in Supabase
- ✅ Same browser = same userId = same data
- ✅ Different browser/device = different userId = different data (expected)

**Next step:** Test the complete flow and check your localStorage in DevTools!
