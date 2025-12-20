-- Migration to add new editable text fields to hero_content table
-- Run this SQL in your Supabase SQL Editor to update the hero_content table

ALTER TABLE hero_content
ADD COLUMN IF NOT EXISTS available_badge_text VARCHAR(255) DEFAULT 'Available',
ADD COLUMN IF NOT EXISTS primary_button_text VARCHAR(255) DEFAULT 'View My Work',
ADD COLUMN IF NOT EXISTS secondary_button_text VARCHAR(255) DEFAULT 'Download CV',
ADD COLUMN IF NOT EXISTS stats_label1 VARCHAR(255) DEFAULT 'Projects',
ADD COLUMN IF NOT EXISTS stats_label2 VARCHAR(255) DEFAULT 'Themes',
ADD COLUMN IF NOT EXISTS stats_label3 VARCHAR(255) DEFAULT 'Plugins',
ADD COLUMN IF NOT EXISTS stats_value1 VARCHAR(255) DEFAULT '50+',
ADD COLUMN IF NOT EXISTS stats_value2 VARCHAR(255) DEFAULT '8+',
ADD COLUMN IF NOT EXISTS stats_value3 VARCHAR(255) DEFAULT '15+',
ADD COLUMN IF NOT EXISTS cv_url TEXT;

