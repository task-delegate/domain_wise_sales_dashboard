# Fix: Dashboard Insights Changing After Logout/Login

## The Problem ❌
- You upload a dataset → Insights display correctly
- You logout and login again → **Insights change automatically** ❌
- **Expected**: Same data should persist (same userId)

## The Root Cause 🔍
Your **userId is being regenerated** after logout/login instead of persisting. This happens when:

1. **🔴 Using Incognito/Private Mode** (localStorage doesn't persist)
2. **🔴 Browser privacy settings** (auto-clearing site data)
3. **🔴 Browser extensions** (clearing cookies/storage)
4. **🔴 Not saved to localStorage properly**

## How to Fix ✅

### Option 1: Check if You're in Incognito Mode (Most Common)
1. **Look at your browser tab** - Is it in Incognito/Private mode?
   - Chrome: Dark theme, "Incognito" badge visible
   - Firefox: "Private Window" indicator
   - Safari: "Private" indicator
2. **IF YES**: Switch to regular browsing mode
3. **IF NO**: Continue to Option 2

### Option 2: Disable Browser Privacy Settings
1. **Chrome/Edge/Firefox Settings** → Privacy and security
2. **Look for**: "Clear cookies and site data when you close the browser" → **Turn OFF** ❌
3. **Look for**: "Clear site data when you quit your browser" → **Turn OFF** ❌
4. Restart browser

### Option 3: Check Browser Extensions
1. Open **DevTools** (F12) → **Extensions** tab
2. Check if any extension is clearing localStorage
3. **Disable extensions** that clear browsing data

### Option 4: Add Exception for This Website
1. **Browser Settings** → Privacy → **Manage exceptions**
2. **Add** your application URL → Allow cookies/storage to persist
3. Apply and reload

## Verify the Fix is Working ✅

### Step 1: Check Console Logs (F12)
1. Open **DevTools** (Press F12)
2. Go to **Console** tab
3. Look for messages like:
   ```
   🔍 Checking for stored userId... FOUND ✓
   ✅ Using existing userId from localStorage: abc123-def456-ghi789
   📊 Loading data for userId: abc123-def456-ghi789
   ✅ Loaded data for 1 domains from Supabase: ['Myntra']
   ```

### Step 2: Test the Complete Flow
1. **Upload a CSV file** → Wait for completion
2. **Check the dashboard** → See KPIs and charts ✅
3. **Note the userId** in DevTools Console (the UUID)
4. **Click "End Session"** to logout
5. **Sign in again** with any email
6. **Check console again** → userId should be **IDENTICAL** ✓
7. **Check dashboard** → **Same data should appear** ✓

### Step 3: Verify localStorage in DevTools
1. Open **DevTools** (F12)
2. Go to **Application** tab → **Storage** → **Local Storage**
3. Look for URL matching your app
4. Find the `userId` key
5. **Before logout**: `userId = "abc123-def456-ghi789"`
6. **After logout + login**: `userId = "abc123-def456-ghi789"` ← **Should be SAME**

## Expected Result ✅
```
BEFORE logout:
  userId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
  Data = 150 rows with Myntra insights
  Dashboard shows: Revenue ₹50,000, Orders 25, etc.

AFTER logout + login:
  userId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"  ← IDENTICAL!
  Data = 150 rows with Myntra insights           ← SAME!
  Dashboard shows: Revenue ₹50,000, Orders 25, etc. ← UNCHANGED!
```

## If It's STILL Not Working 🔴

### Check 1: Console Error Messages
1. Open **DevTools** (F12) → **Console**
2. Look for error messages mentioning:
   - `⚠️ localStorage is NOT available`
   - `❌ Failed to save userId`
3. **If found**: You're in private/incognito mode → Use regular mode

### Check 2: Supabase Data Exists
1. Go to **Supabase Dashboard**
2. Select your project → **Editor** → **myntra_data** table
3. Check if rows exist with your userId (from console)
4. **If empty**: Data upload failed → Try uploading again

### Check 3: Network Issues
1. Open **DevTools** → **Network** tab
2. Reload page
3. Look for failed requests to Supabase (status 401, 403, 500)
4. **If found**: Check your Groq API key and Supabase URL

### Check 4: Clear Everything and Start Fresh
```javascript
// Run this in DevTools Console:
localStorage.clear();
location.reload();
```
Then:
1. Sign in again
2. Upload a new CSV
3. Verify the test flow again

## Technical Details

### What Happens Behind the Scenes:
```
Login → DashboardLayout loads
  → useEffect: Check localStorage for 'userId'
  → If not found: Generate new UUID
  → Save to localStorage: localStorage.setItem('userId', uuid)
  → Load data from Supabase: SELECT * WHERE user_id = [uuid]

Logout → App shows LoginPage
  → localStorage is NOT cleared (intentional)

Login Again → DashboardLayout loads
  → useEffect: Check localStorage for 'userId'
  → Should find existing UUID (from step 1)
  → Load SAME data from Supabase
  → Dashboard displays SAME insights ✓
```

### Why This Matters:
- **userId in localStorage** = persistent identifier per browser
- **Supabase filters by user_id** = data isolation between users
- **Don't clear localStorage on logout** = preserves user session
- **Same browser = same userId = same data**

## Summary

| Issue | Solution |
|-------|----------|
| Insights change after logout/login | Stop using Incognito mode |
| "Not available" message in console | Use regular browsing mode |
| localStorage clearing | Disable browser privacy settings for this site |
| Data keeps resetting | Check browser extensions aren't clearing data |
| Still doesn't work | Clear localStorage and start fresh |

## Need Help?

**Check these files:**
- [App.tsx](App.tsx) - Logout logic (doesn't clear userId)
- [DashboardLayout.tsx](components/DashboardLayout.tsx) - userId initialization with logging
- [supabase.ts](utils/supabase.ts) - Data loading filtered by user_id

**Or run this in Console:**
```javascript
// Check localStorage
console.log('userId:', localStorage.getItem('userId'));
console.log('All storage:', { ...localStorage });
```
