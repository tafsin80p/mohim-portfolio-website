-- SQL Script to Clean/Reset All Database Tables
-- WARNING: This will DELETE ALL DATA from all tables!
-- Run this in your Supabase SQL Editor to completely clean the database

-- Clear all projects
DELETE FROM projects;

-- Clear all blog posts
DELETE FROM blog_posts;

-- Clear all services
DELETE FROM services;

-- Clear all themes
DELETE FROM themes;

-- Clear all plugins
DELETE FROM plugins;

-- Clear about content (reset to default)
UPDATE about_content 
SET 
    bio = '[]'::jsonb,
    skills = '{}',
    stats = '{}'::jsonb,
    image_url = NULL,
    updated_at = NOW()
WHERE id = 'default';

-- Clear hero content (reset to default)
UPDATE hero_content 
SET 
    tagline = '',
    headline_line1 = '',
    headline_highlight = '',
    headline_line2 = '',
    subheadline = '',
    name = '',
    role = '',
    floating_title = '',
    floating_subtitle = '',
    available_badge_text = '',
    primary_button_text = '',
    secondary_button_text = '',
    stats_label1 = '',
    stats_label2 = '',
    stats_label3 = '',
    stats_value1 = '',
    stats_value2 = '',
    stats_value3 = '',
    cv_url = NULL,
    updated_at = NOW()
WHERE id = 'default';

-- Clear footer content (reset to default)
UPDATE footer_content 
SET 
    copyright_text = '',
    updated_at = NOW()
WHERE id = 'default';

-- Verify all tables are empty
SELECT 
    'projects' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 
    'blog_posts' as table_name, COUNT(*) as count FROM blog_posts
UNION ALL
SELECT 
    'services' as table_name, COUNT(*) as count FROM services
UNION ALL
SELECT 
    'themes' as table_name, COUNT(*) as count FROM themes
UNION ALL
SELECT 
    'plugins' as table_name, COUNT(*) as count FROM plugins;

-- Show content tables status
SELECT 'about_content' as table_name, id, image_url FROM about_content WHERE id = 'default';
SELECT 'hero_content' as table_name, id, name, role FROM hero_content WHERE id = 'default';
SELECT 'footer_content' as table_name, id, copyright_text FROM footer_content WHERE id = 'default';

