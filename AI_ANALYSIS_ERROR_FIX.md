## "AI analysis of the file failed" - Troubleshooting Guide

### What Causes This Error?

When you upload a CSV/Excel file, the application uses **Groq API** to analyze your data structure and detect which columns contain revenue, customer names, dates, etc. If this step fails, you'll see: **"AI analysis of the file failed"**

### Common Causes & Solutions

#### 1. **Missing or Invalid Groq API Key** ⚠️ MOST COMMON

**Symptom**: Error appears immediately when uploading any file

**Check Your .env.local File**:
```
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Solution**:
1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Create a new API key if you don't have one
3. Copy the key and add to `.env.local`:
   ```
   VITE_GROQ_API_KEY=your_actual_key_here
   ```
4. Restart the development server (`npm run dev`)
5. Clear browser cache (Ctrl+Shift+Delete)
6. Try uploading again

---

#### 2. **Groq API is Overloaded or Down**

**Symptom**: Error with message like "API request failed" or "timeout"

**Solution**:
- Try again in a few minutes
- Check [Groq Status Page](https://status.groq.com/)
- If it's down, wait for them to resolve the issue

---

#### 3. **Empty or Malformed CSV File**

**Symptom**: File with only headers or no data rows

**Solution**:
- Ensure your CSV has:
  - ✅ Column headers (first row)
  - ✅ At least 2-3 data rows
  - ✅ Clear column names (e.g., "Order Date", "Revenue", "Customer Name")
  
**Example of valid CSV**:
```
Order Date,Customer Name,Revenue,Product,City
2024-01-01,John Doe,1500,Laptop,Delhi
2024-01-02,Jane Smith,2000,Phone,Mumbai
```

---

#### 4. **Unclear or Ambiguous Column Headers**

**Symptom**: File uploads but error says "could not parse"

**Solution**:
The AI needs to identify revenue column. Use clear header names:

| ❌ Bad Headers | ✅ Good Headers |
|---|---|
| Col1, Col2, Col3 | Order Date, Revenue, Product |
| Data1, Data2, Data3 | Order Amount, Customer, City |
| A, B, C | Sale Order Code, Final Amount, Item |

**Required**: At least one column with a clear revenue/sales indicator:
- "Revenue", "Final Amount", "Total Price", "Sale Amount", "Amount", "Total"

---

#### 5. **Browser Cache Issue**

**Symptom**: Same file worked before, now it fails

**Solution**:
1. Clear browser cache: `Ctrl+Shift+Delete`
2. Close all tabs with the dashboard
3. Restart development server: `npm run dev`
4. Try uploading again

---

#### 6. **Very Large File (>10MB)**

**Symptom**: File seems to process, then error appears

**Solution**:
- Split your CSV into smaller chunks (< 10MB)
- Upload each chunk separately
- Or compress the file before uploading

---

### How to Debug

**Check Browser Console** (F12 → Console tab):
Look for messages like:
```
Groq response: {...}
Error analyzing CSV data with Groq: [error details]
```

**Check Network Tab** (F12 → Network tab):
- Look for requests to `api.groq.com`
- If status is 401/403, API key is invalid
- If status is 429, rate limit exceeded (wait a few minutes)
- If status is 500, Groq API is down

---

### Complete Troubleshooting Checklist

- [ ] `.env.local` has `VITE_GROQ_API_KEY` set
- [ ] API key is valid (from groq.com)
- [ ] CSV file has clear column headers
- [ ] CSV has at least 2-3 data rows (not just headers)
- [ ] Browser cache is cleared
- [ ] Development server restarted after env change
- [ ] File size is < 10MB
- [ ] CSV columns include a revenue-related field
- [ ] Groq API is online (check status page)

---

### If All Else Fails

1. **Test with sample file**: Download [sample_amazon_data.csv](./sample_data/sample_amazon.csv)
2. **Check Groq API status**: [status.groq.com](https://status.groq.com/)
3. **Verify .env.local**: Copy directly from groq.com console (no spaces)
4. **Test API key independently**:
   ```bash
   curl -X POST https://api.groq.com/openai/v1/chat/completions \
     -H "Authorization: Bearer YOUR_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"test"}]}'
   ```

---

### Need Help?

If the error persists:
1. Check the browser console (F12) for detailed error message
2. Share that message for debugging
3. Verify your `.env.local` file has the API key
4. Try with a simpler CSV file (fewer columns)

**Note**: The AI analysis runs entirely in your browser. Your data is never sent to Groq until you explicitly click "Process & Analyze". The API call is only to analyze column names, not your actual data.
