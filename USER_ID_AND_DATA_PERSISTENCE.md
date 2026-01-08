# User ID & Data Persistence Guide

## How Data Isolation Works

### User Identification
- **User ID**: Generated as a UUID v4 and stored in `localStorage.userId`
- **Scope**: All data is filtered by this `userId` in Supabase queries
- **Persistence**: The userId persists across browser sessions

### Data Flow
```
Login → Generate/Retrieve userId from localStorage
    ↓
Upload CSV → Groq analyzes → Save to Supabase with user_id
    ↓
Sign Out (userId still in localStorage)
    ↓
Sign In → Retrieve userId from localStorage → Load data from Supabase
    ↓
Dashboard shows SAME data as before (because same userId)
```

## Why Dashboard Shows Different Data After Sign Out/In

### Scenario 1: userId Changed (Problem)
- **Symptom**: You see no data or different data after sign out/in
- **Cause**: localStorage was cleared, new userId generated
- **Solution**: Check browser DevTools → Application → localStorage for `userId` key

### Scenario 2: Data Wasn't Saved (Problem)
- **Symptom**: You upload data, see it in UI, but after sign out/in it's gone
- **Cause**: Data failed to save to Supabase (network error, API key issue)
- **Solution**: Check browser Console for Supabase errors during upload

### Scenario 3: Correct Behavior (Expected)
- **What happens**: You upload → See data → Sign out → Sign in → Same data appears
- **Why**: Same userId retrieves same data from Supabase
- **How to verify**: Check `console.log` shows same userId

## Debugging Steps

### 1. Check Your User ID
```javascript
// Open browser DevTools Console and run:
localStorage.getItem('userId')
```
- **Should return**: A long string like `a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5`
- **If it changes**: Between sign out/in, that's the problem
- **If it stays same**: userId is persisted correctly ✓

### 2. Check Supabase Data
1. Go to Supabase Dashboard
2. Select your project
3. Check table: `myntra_data`, `amazon_data`, etc.
4. Look for rows where `user_id = [your_userid_from_step_1]`
5. If no rows exist, data wasn't saved

### 3. Check Upload Errors
1. Open browser DevTools → Console tab
2. Upload a CSV file
3. Look for errors like:
   - `Groq API key not found` → Set VITE_GROQ_API_KEY in .env.local
   - `Failed to save batch to Myntra` → Supabase connection issue
   - `Invalid API key` → Wrong API key

### 4. Check localStorage
```javascript
// In browser console:
localStorage.getItem('userId')
localStorage.removeItem('userId')  // If you want to reset to a new user
```

## Current Implementation

### User ID Storage
- **Location**: `localStorage.userId`
- **Generated in**: [DashboardLayout.tsx](../components/DashboardLayout.tsx) - useEffect on mount
- **Format**: UUID v4
- **Persistence**: Across browser sessions automatically

### Data Filtering
- **Supabase queries** in [supabase.ts](../utils/supabase.ts):
  ```typescript
  .eq('user_id', userId)  // All queries filter by this
  ```
- **Ensures**: Each user only sees their own data
- **Multi-user support**: Multiple users can use the app independently

## If You Want to Reset to a New User

### Option 1: Clear localStorage
```javascript
// In browser console:
localStorage.removeItem('userId')
// Then refresh the page
```

### Option 2: Incognito/Private Mode
- Open app in incognito window
- Each incognito session gets a different userId
- Original window still has original userId

### Option 3: Different Browser
- Each browser gets its own localStorage
- Different userId = different data

## Expected Behavior ✓

1. Upload data to Myntra domain → Saved with userId
2. Sign out
3. Sign in
4. Dashboard loads → Shows SAME data (because same userId)
5. Switch to Amazon domain
6. Upload different data → Saved with SAME userId
7. Sign out and sign in
8. Both Myntra and Amazon data appear → All from same userId

## Troubleshooting Checklist

| Issue | Check |
|-------|-------|
| No data after sign in | userId from localStorage |
| Different data after sign in | userId changed? |
| Upload fails silently | Browser Console errors |
| "Intelligence Awaits" placeholder | Check Supabase table has data |
| Data in UI but disappears | Network error during save |
| Supabase shows no rows | Data never saved or wrong userId |
