-- Migration to create footer_content table
-- Run this SQL in your Supabase SQL Editor to create the footer_content table

CREATE TABLE IF NOT EXISTS footer_content (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  brand_name VARCHAR(255),
  description TEXT,
  social_links JSONB DEFAULT '[]',
  link_groups JSONB DEFAULT '[]',
  copyright_text VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read, authenticated write
DROP POLICY IF EXISTS "Public can read footer content" ON footer_content;
CREATE POLICY "Public can read footer content" ON footer_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage footer content" ON footer_content;
CREATE POLICY "Authenticated users can manage footer content" ON footer_content FOR ALL USING (auth.role() = 'authenticated');

