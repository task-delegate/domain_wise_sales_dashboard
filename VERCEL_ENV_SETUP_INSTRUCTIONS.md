# Vercel Environment Variables Setup

## The Problem
Your app is getting a 401 error: `Invalid API Key` on Vercel because the `VITE_GROQ_API_KEY` environment variable is not set in your Vercel project.

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Project Settings
1. Open https://vercel.com/dashboard
2. Click on your project: **domain_wise_sales_dashboard**
3. Go to **Settings** tab
4. Click on **Environment Variables** (left sidebar)

### Step 2: Add the Groq API Key
1. Click **"Add New"** button
2. Fill in:
   - **Name**: `VITE_GROQ_API_KEY`
   - **Value**: Your Groq API key (starts with `gsk_`)
   - **Environments**: Select `Production` (and Development if desired)
3. Click **"Save"**

> **Where to get your Groq API Key?**
> - Go to https://console.groq.com/keys
> - Generate a new API key
> - Copy the key starting with `gsk_`

### Step 3: Redeploy Your App
1. Go back to **Deployments** tab
2. Find the latest deployment (should show status)
3. Click the three dots **(...)**
4. Select **"Redeploy"**
5. Wait for deployment to complete (should say "Ready" in green)

## Verification
After deployment:
1. Go to your Vercel URL
2. Try uploading a CSV file
3. The API key error should be gone ✅

## Note
- Do NOT commit `.env.local` to GitHub (it's already in .gitignore)
- Only set environment variables via Vercel dashboard
- Each environment (Production, Preview, Development) can have different values
