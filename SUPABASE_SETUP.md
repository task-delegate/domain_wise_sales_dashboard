# Supabase Setup Guide

## Required Tables

### 1. Create `domain_data` table

Go to your Supabase dashboard and execute this SQL:

```sql
CREATE TABLE IF NOT EXISTS domain_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  domain_name TEXT NOT NULL,
  data JSONB NOT NULL,
  mapping JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, domain_name)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_domain_data_user_id ON domain_data(user_id);
CREATE INDEX IF NOT EXISTS idx_domain_data_user_domain ON domain_data(user_id, domain_name);

-- Enable Row Level Security (RLS) for security
ALTER TABLE domain_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous access (adjust based on your auth model)
CREATE POLICY "Allow all access to domain_data" ON domain_data
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## How Data Persistence Works

### Upload Flow:
1. User uploads CSV/Excel file
2. AI analyzes column structure
3. Data is merged with existing data (duplicates removed)
4. Merged data is saved to Supabase `domain_data` table
5. User sees all data (old + new) in dashboard

### Login Flow:
1. User logs in (userId stored in localStorage)
2. App loads all user's domain data from Supabase
3. Dashboard displays historical data
4. User can add more data, it merges automatically

### Duplicate Detection:
- Uses: `date | customer | product | quantity` as unique identifier
- If same combination exists, new row is ignored
- Only new unique rows are added

## Updating Your Project

The following files have been updated:
- `utils/supabase.ts` - New functions for data persistence
- `components/DashboardLayout.tsx` - Loads/saves data with Supabase
- `.env.local` - Contains VITE_GROQ_API_KEY

## Deploy to Vercel

1. Add environment variable on Vercel:
   - `VITE_GROQ_API_KEY` = your Groq API key

2. Push changes to GitHub:
```bash
git add .
git commit -m "Add Supabase data persistence"
git push
```

3. Vercel automatically redeploys on push

## Testing Locally

```bash
npm run dev
```

1. Upload data for "Amazon" domain
2. Logout/Login - data should still be there
3. Upload same data again - duplicates should be removed
4. Upload new data for same domain - should merge automatically
