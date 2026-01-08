# Quick API Key Troubleshooting

## Check if API Key is Valid

### Option 1: Test in Browser Console
1. Open your Vercel app
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Paste this:
```javascript
const key = new URLSearchParams(window.location.search).get('key') || 'gsk_your_key';
console.log('API Key format check:');
console.log('Starts with gsk_:', key.startsWith('gsk_'));
console.log('Length:', key.length);
console.log('Should be 50+ characters');
```

### Option 2: Test with curl (in Terminal)
Replace `YOUR_KEY` with your actual key:

```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "test"}],
    "max_tokens": 100
  }'
```

If you get:
- ✅ `"choices"` in response = **KEY IS VALID**
- ❌ `"Invalid API Key"` = **KEY IS EXPIRED/WRONG**

### Option 3: Just Get a Fresh Key
1. Go to https://console.groq.com/keys
2. Delete all old keys
3. Click **"Create API Key"**
4. Copy immediately (it won't show again)
5. Add to Vercel (see VERCEL_ENV_SETUP.md)

## Common Issues

### "API Key looks invalid"
- Key should start with `gsk_`
- Key should be 50+ characters
- No spaces before/after
- Check Vercel Settings → copy/paste carefully

### "Key works locally but not on Vercel"
- Vercel env var not set correctly
- Vercel not redeployed after setting env var
- Wait 2-3 minutes for Vercel to update

### "Keep getting 401 even after adding key"
1. Delete old key from groq.com
2. Create brand new key
3. Delete env var from Vercel
4. Add brand new key to Vercel
5. Redeploy
6. Wait 3 minutes
7. Hard refresh: Ctrl+Shift+R
8. Try again

## Vercel Environment Variable Checklist

- [ ] Logged into https://vercel.com/dashboard
- [ ] In correct project (domain_wise_sales_dashboard)
- [ ] Clicked Settings → Environment Variables
- [ ] Variable name is exactly: `VITE_GROQ_API_KEY`
- [ ] Value is your actual key (starts with `gsk_`)
- [ ] All 3 environments checked (Production, Preview, Development)
- [ ] Clicked "Save"
- [ ] Went to Deployments tab
- [ ] Clicked ... → Redeploy on latest deployment
- [ ] Waited for green ✅ "Ready" status
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Cleared cache (Ctrl+Shift+Delete)
- [ ] Tried uploading file again

If all these are done and still 401: The API key itself is probably expired.
