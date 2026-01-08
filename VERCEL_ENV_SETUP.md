## How to Add API Key to Vercel (NOT GitHub)

### Why?
- `.env.local` has your API key → **Never push to GitHub**
- Vercel has its own **secure environment variables** → Use those instead
- Local dev uses `.env.local`, Vercel uses its env vars

---

## Step-by-Step: Add API Key to Vercel

### 1. **Get Fresh API Key from Groq**
- Go to: https://console.groq.com/keys
- Click "Create API Key"
- Copy the key (format: `gsk_xxx...`)
- Save it temporarily (you'll paste it in Vercel next)

### 2. **Go to Vercel Dashboard**
- Visit: https://vercel.com/dashboard
- Click your project: **`domain_wise_sales_dashboard`**

### 3. **Add Environment Variable**
1. Click **Settings** tab (top of page)
2. Click **Environment Variables** (left sidebar)
3. Click **Add New** button
4. Fill in:
   - **Name**: `VITE_GROQ_API_KEY`
   - **Value**: Paste your Groq API key here
   - **Environments**: Check all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
5. Click **Save**

### 4. **Redeploy to Apply Changes**
1. Click **Deployments** tab
2. Find the latest deployment at the top
3. Click the **...** (three dots) menu on the right
4. Click **Redeploy**
5. Wait for deployment to finish (green checkmark)

---

## Verify It Works

Once redeployed:
1. Go to your Vercel app URL
2. Try uploading a CSV file
3. Should work WITHOUT the 401 error

---

## For Local Development

Keep using `.env.local`:
```
VITE_GROQ_API_KEY=gsk_your_key_here
```

This file is in `.gitignore` now, so it won't be committed to GitHub.

---

## Summary

| Where | Key Storage | Purpose |
|-------|-------------|---------|
| **Vercel (Production)** | Environment Variables → Secure | Live app uses this |
| **Your Computer (Dev)** | `.env.local` → Local only | Development uses this |
| **GitHub** | ❌ NEVER | Don't put keys there! |

---

## Troubleshooting

### Still getting 401 error after redeploy?
1. Verify the API key is correct in Vercel Settings
2. Wait 2-3 minutes for Vercel to fully update
3. Hard refresh browser: `Ctrl+Shift+R`
4. Check if Groq API key is actually valid (test on groq.com)

### How do I change the key later?
1. Go to Vercel Settings → Environment Variables
2. Click the key name
3. Update the value
4. Click Save
5. Redeploy again

