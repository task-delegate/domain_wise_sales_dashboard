-- Supabase SQL Setup Script
-- Run this in your Supabase SQL Editor

-- Create domain_data table for persistent storage
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

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_domain_data_user_id ON domain_data(user_id);
CREATE INDEX IF NOT EXISTS idx_domain_data_user_domain ON domain_data(user_id, domain_name);

-- Enable Row Level Security
ALTER TABLE domain_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access (public access)
-- For production, replace with proper authentication policies
DROP POLICY IF EXISTS "Allow all access to domain_data" ON domain_data;
CREATE POLICY "Allow all access to domain_data" ON domain_data
  FOR ALL
  USING (true)
  WITH CHECK (true);
