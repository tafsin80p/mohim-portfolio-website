-- SQL Script to Clean All Data Tables (Safe Version - Keeps Structure)
-- This script clears all data but keeps the table structure
-- Run this in your Supabase SQL Editor

BEGIN;

-- Clear all projects
TRUNCATE TABLE projects RESTART IDENTITY CASCADE;

-- Clear all blog posts
TRUNCATE TABLE blog_posts RESTART IDENTITY CASCADE;

-- Clear all services
TRUNCATE TABLE services RESTART IDENTITY CASCADE;

-- Clear all themes
TRUNCATE TABLE themes RESTART IDENTITY CASCADE;

-- Clear all plugins
TRUNCATE TABLE plugins RESTART IDENTITY CASCADE;

-- Reset about content to empty
UPDATE about_content 
SET 
    bio = '[]'::jsonb,
    skills = '{}',
    stats = '{}'::jsonb,
    image_url = NULL,
    updated_at = NOW()
WHERE id = 'default';

-- Reset hero content to empty
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

-- Reset footer content to empty
UPDATE footer_content 
SET 
    copyright_text = '',
    updated_at = NOW()
WHERE id = 'default';

COMMIT;

-- Verify cleanup
SELECT 'Cleanup Complete!' as status;
SELECT 'projects' as table, COUNT(*) as rows FROM projects
UNION ALL SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL SELECT 'services', COUNT(*) FROM services
UNION ALL SELECT 'themes', COUNT(*) FROM themes
UNION ALL SELECT 'plugins', COUNT(*) FROM plugins;

