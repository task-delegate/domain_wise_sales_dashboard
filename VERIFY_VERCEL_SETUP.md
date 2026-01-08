# ✅ Verify Vercel Environment Variable Setup

**The 401 error persists because the API key is still NOT in Vercel's environment variables.**

Use this checklist to verify it was added correctly.

---

## 📋 VERIFICATION CHECKLIST

### ✓ Did you add the environment variable?

**Go to:** https://vercel.com/dashboard
1. Click your project: `domain-wise-sales-dashboard`
2. Click: **Settings** tab (top of page)
3. Click: **Environment Variables** (left sidebar)
4. Look for `VITE_GROQ_API_KEY` in the list

**If you DON'T see it:**
- ❌ You haven't added it yet
- Follow the steps below to add it

**If you DO see it:**
- ✅ Go to next verification step

---

### ✓ Is the variable set for all environments?

**Click on:** `VITE_GROQ_API_KEY`
1. You should see three checkboxes:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
2. **All three should be CHECKED**

**If any are unchecked:**
- ❌ Click them to check all three
- Click: **Save**

---

### ✓ Did you redeploy?

**Go to:** Deployments tab (at top of project page)
1. Find the latest deployment (top of list)
2. Check the status:
   - If it says **"Ready"** with a ✅ green checkmark:
     - ✅ App was redeployed recently
   - If it says **"Building"** or something else:
     - ❌ Still building, wait for ✅ Ready

**If the latest deployment is OLD (before you added env var):**
- ❌ You need to redeploy
- Click **...** (three dots) on the latest
- Click: **Redeploy**
- Wait for ✅ **Ready** status (3-5 minutes)

---

## 🔧 IF VARIABLE IS NOT THERE - Add It Now

### Step 1: Open Vercel
https://vercel.com/dashboard → Click your project

### Step 2: Go to Environment Variables
- Settings tab → Environment Variables (left sidebar)

### Step 3: Add New Variable
- Click: **Add New** button
- Fill in:
  ```
  Name:         VITE_GROQ_API_KEY
  Value:        [Get from: https://console.groq.com/keys]
  Environments: ☑️ Production ☑️ Preview ☑️ Development
  ```
- Click: **Save**

### Step 4: Redeploy
- Go to: **Deployments** tab
- Click **...** on latest deployment
- Click: **Redeploy**
- Wait for ✅ **Ready**

### Step 5: Test
- Close ALL browser tabs
- Go to: `https://domain-wise-sales-dashboard.vercel.app/`
- Press: **Ctrl+Shift+R** (hard refresh)
- Try uploading a CSV
- **Should work now!** ✅

---

## 🆘 TROUBLESHOOTING

### "Still getting 401 after doing all steps"

1. **Verify the API key is valid:**
   - Go to: https://console.groq.com/keys
   - Check if your key still exists
   - If not, create a NEW key
   - Update Vercel env var with NEW key
   - Redeploy again

2. **Check if redeploy actually finished:**
   - Go to Deployments
   - Click on the latest deployment
   - Should show ✅ "Ready" status
   - If "Error", click it to see what went wrong

3. **Browser cache issue:**
   - Hard refresh: **Ctrl+Shift+R**
   - Clear cache: **Ctrl+Shift+Delete**
   - Close browser completely
   - Reopen

---

## ⚡ QUICK STATUS CHECK

Right now, ask yourself:

1. **Did I add `VITE_GROQ_API_KEY` to Vercel?**
   - Yes → Go to next step
   - No → Add it now (see steps above)

2. **Did I check all 3 environments?**
   - Yes → Go to next step
   - No → Check all 3 and Save

3. **Did I redeploy after adding/updating?**
   - Yes → Go to next step
   - No → Go to Deployments, click ..., Redeploy

4. **Is the latest deployment showing ✅ Ready?**
   - Yes → Go to next step
   - No → Wait or check for errors

5. **Did I hard refresh the app?**
   - Yes → Go to next step
   - No → Hard refresh: Ctrl+Shift+R

6. **Did I try uploading a CSV?**
   - Yes → Should work now!
   - No → Try it!

If you've done all 6 steps and STILL getting 401:
- Your API key might be expired/invalid
- Get a fresh one from groq.com
- Update Vercel env var
- Redeploy again

---

## 📞 NEED HELP?

If you're stuck:
1. Take a screenshot of your Vercel Environment Variables page
2. Share what you see
3. I can tell you exactly what's wrong

But 90% of the time, it's one of these:
- ❌ Variable not added
- ❌ Not all 3 environments checked
- ❌ Not redeployed
- ❌ Redeploy still in progress
- ❌ API key expired
