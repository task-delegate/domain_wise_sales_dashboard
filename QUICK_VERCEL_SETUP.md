# ✅ Simple 5-Minute Vercel Setup (No API Key Shown Here)

## Problem
Your app shows **401 Invalid API Key** on Vercel because the API key isn't in Vercel's environment variables yet.

## Solution
Add API key to Vercel's environment variables in 5 minutes (no code changes needed).

---

## STEP-BY-STEP

### 1️⃣ Open Vercel
- Go to: https://vercel.com/dashboard
- Click your project: **domain_wise_sales_dashboard**

### 2️⃣ Go to Settings
- At the top of the page, click: **Settings**

### 3️⃣ Find Environment Variables  
- On the left sidebar, click: **Environment Variables**

### 4️⃣ Delete Old Variable (if exists)
- Look for `VITE_GROQ_API_KEY`
- If you see it, click it and delete it
- Confirm deletion

### 5️⃣ Add New Variable
- Click: **Add New** button
- Fill in the form:
  - **Name**: `VITE_GROQ_API_KEY`
  - **Value**: Go to https://console.groq.com/keys and copy your API key
  - **Environments**: Check ☑️ all three:
    - Production
    - Preview
    - Development
- Click: **Save**

### 6️⃣ Verify
- You should see `VITE_GROQ_API_KEY` in the list
- The value will show as dots (●●●) for security

### 7️⃣ Redeploy
- Click: **Deployments** tab
- Find the latest deployment
- Click: **...** (three dots on the right)
- Click: **Redeploy**
- Wait for ✅ **Ready** (3-5 minutes)

### 8️⃣ Test
1. Close ALL browser tabs with your app
2. Go to your live Vercel URL
3. Press: **Ctrl + Shift + R** (hard refresh)
4. Try uploading a CSV file
5. **Should work now!** ✅

---

## Summary

| Step | Action |
|------|--------|
| Get Key | https://console.groq.com/keys |
| Open Vercel | https://vercel.com/dashboard |
| Settings | Click Settings tab |
| Env Vars | Click Environment Variables |
| Add Variable | Name: VITE_GROQ_API_KEY, Value: [Your Key] |
| Check All 3 | Production, Preview, Development |
| Save | Click Save |
| Redeploy | Deployments → ... → Redeploy |
| Wait | 3-5 minutes for Ready status |
| Test | Hard refresh + try upload |

---

## Troubleshooting

**Still getting 401 after all steps?**
- Did you click **Save**?
- Did you go to **Deployments** and **Redeploy**?
- Did you wait for the **Ready** status?
- Did you hard refresh (**Ctrl+Shift+R**)?

**Forgot API key?**
- Get fresh one: https://console.groq.com/keys
- Update Vercel env var
- Redeploy

That's it! This 5-minute setup fixes the 401 error permanently.
