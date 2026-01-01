-- Clear image_url from about_content table
-- This migration removes any existing image_url values from the about_content table

UPDATE about_content 
SET image_url = NULL 
WHERE id = 'default' AND image_url IS NOT NULL;

-- Verify the update
SELECT id, image_url FROM about_content WHERE id = 'default';

