# Supabase Database Setup Guide

## Error: Table 'public.projects' not found

This error means the database tables haven't been created yet. Follow these steps:

## Step 1: Open Supabase SQL Editor

1. Go to https://app.supabase.com/
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New query"

## Step 2: Run the Schema

1. Open the file: `supabase/migrations/20250101000000_create_content_tables.sql`
2. Copy **ALL** the SQL code from that file
3. Paste it into the Supabase SQL Editor
4. Click "Run" (or press Ctrl/Cmd + Enter)

## Step 3: Verify Tables Were Created

After running the SQL, you should see:
- ✅ Success message
- Tables created: `projects`, `blog_posts`, `services`, `themes`, `plugins`, `about_content`, `hero_content`, `contact_info`

## Step 4: Refresh Your Dashboard

1. Go back to your app: http://localhost:8080
2. Go to Dashboard → Overview
3. The Database Status should now show "Connected" ✅

## What the Schema Creates

The SQL schema creates:
- **projects** - Portfolio projects table
- **blog_posts** - Blog posts table  
- **services** - Services offered
- **themes** - WordPress themes
- **plugins** - WordPress plugins
- **about_content** - About page content
- **hero_content** - Hero section content
- **contact_info** - Contact information

All tables have:
- Row Level Security (RLS) enabled
- Public read access
- Authenticated write access

## Troubleshooting

If you still see errors after running the schema:
1. Check the Supabase SQL Editor for any error messages
2. Verify you copied the entire SQL file
3. Make sure you're running it in the correct project
4. Try refreshing your browser and checking the dashboard again

