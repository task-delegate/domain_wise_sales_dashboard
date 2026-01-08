# URGENT: Verify API Key is in Vercel

You're still getting 401 errors, which means the API key **is NOT in Vercel's environment variables yet**.

---

## Step-by-Step Verification & Setup

### **Step 1: Open Vercel Dashboard**
1. Go to: **https://vercel.com/dashboard**
2. You should see your projects listed
3. Find and click: **`domain_wise_sales_dashboard`**

### **Step 2: Open Settings**
1. At the top of the project page, click **Settings** tab
2. On the left sidebar, scroll down and click **Environment Variables**

### **Step 3: Check for Existing Variable**
1. Look at the list of environment variables
2. Search for `VITE_GROQ_API_KEY`
3. If it exists:
   - Click on it
   - Click the **trash/delete icon** on the right
   - Confirm deletion

### **Step 4: Add NEW Environment Variable**
1. Click **Add New** button (top right)
2. A form will appear. Fill it like this:

```
Name:           VITE_GROQ_API_KEY
Value:          [Paste your Groq API key here]
Environments:   ☑ Production  ☑ Preview  ☑ Development
```

**Important**: 
- For Value, go to https://console.groq.com/keys
- Copy the key (format: `gsk_xxxxxxxxxxxxx...`)
- Paste it in the Value field
- Make sure NO extra spaces before/after

3. Click **Save**

### **Step 5: Verify It Was Added**
1. After saving, you should see `VITE_GROQ_API_KEY` in the list
2. Click it to verify the value is correct
3. Make sure all 3 environments are checked ✅

### **Step 6: Redeploy (CRITICAL!)**
1. Click **Deployments** tab (at top)
2. Find the latest deployment (top of list)
3. Click the **...** (three dots) on the right side
4. Click **Redeploy**
5. Wait... it will show "Building" → "Ready" (green ✅)
6. This takes 2-5 minutes

### **Step 7: Test**
1. Close ALL browser tabs with your app
2. Go to your Vercel URL (not localhost)
3. Press **Ctrl+Shift+R** (force refresh + clear cache)
4. Try uploading a CSV file
5. **Should work now!** ✅

---

## Troubleshooting: Still Getting 401?

### Issue: "I added the variable but still getting 401"

**Did you redeploy after adding the variable?**
- Go to Deployments
- Click ... → Redeploy
- Wait for ✅ Ready

**Was it redeployed successfully?**
- Check Deployments tab
- Latest should say "Ready" with green ✅
- If it says "Error", click it to see what went wrong

### Issue: "I see VITE_GROQ_API_KEY in Vercel but still 401"

**The key might be wrong:**
- Go to https://console.groq.com/keys
- Get a fresh key
- In Vercel, delete the old one
- Add the new one
- Redeploy

**Browser cache:**
- Hard refresh: **Ctrl+Shift+R**
- Clear cache: **Ctrl+Shift+Delete** → Clear all
- Close browser completely
- Reopen and try again

### Issue: "Vercel shows 'Value: ***' (hidden)"

This is normal! Vercel hides secret values for security.

**To verify it's correct:**
1. Click on the variable
2. Click **Edit**
3. The value should be visible (highlighted in dots: **•••••••**)
4. Click **Copy** to verify it
5. Don't change it, just close

---

## Verification Checklist

- [ ] Opened https://vercel.com/dashboard
- [ ] Clicked correct project (domain_wise_sales_dashboard)
- [ ] Went to Settings → Environment Variables
- [ ] Deleted any old VITE_GROQ_API_KEY
- [ ] Clicked Add New
- [ ] Entered name: `VITE_GROQ_API_KEY`
- [ ] Entered value: API key from groq.com (starts with gsk_)
- [ ] Checked all 3 environments ✅
- [ ] Clicked Save
- [ ] Confirmed variable appears in list
- [ ] Went to Deployments tab
- [ ] Clicked ... → Redeploy on latest
- [ ] Waited for ✅ Ready (green checkmark)
- [ ] Closed all browser tabs
- [ ] Went to live Vercel URL
- [ ] Hard refreshed (Ctrl+Shift+R)
- [ ] Cleared cache (Ctrl+Shift+Delete)
- [ ] Tried uploading file

---

## If ALL Steps are Done and Still 401

The API key itself might be invalid or expired:
1. Go to https://console.groq.com/keys
2. Delete the current key
3. Click **Create API Key**
4. Copy the NEW key
5. Update Vercel (remove old, add new)
6. Redeploy
7. Test again

---

## Quick Summary

| What | Where | Status |
|------|-------|--------|
| API Key | groq.com console | ✅ Valid |
| .env.local | Local computer | ✅ Correct |
| Vercel Env Var | vercel.com → Settings | ⏳ **NEEDS TO BE ADDED** |
| Vercel Deployment | vercel.com → Deployments | ⏳ **NEEDS TO BE REDEPLOYED** |
| Live App | Your Vercel URL | ❌ Will work after above 2 done |

---

## Need Visual Help?

If you're stuck on any step, take a screenshot of your Vercel dashboard and share it. I can tell you exactly what to click.

The 401 error WILL go away once the environment variable is properly added to Vercel and the app is redeployed.
