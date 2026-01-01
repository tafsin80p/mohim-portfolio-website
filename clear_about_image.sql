-- SQL Script to Clear Profile Image from About Content
-- NOTE: Images are now stored in localStorage only, not in Supabase
-- This script is kept for reference but is no longer needed
-- The image_url field in Supabase is ignored by the application

-- Optional: Clear the image_url field from Supabase (not used by app anymore)
-- UPDATE about_content 
-- SET image_url = NULL,
--     updated_at = NOW()
-- WHERE id = 'default';

-- Optional: Remove the image_url column entirely (if you want to clean up the schema)
-- ALTER TABLE about_content DROP COLUMN IF EXISTS image_url;

-- Verify current state
SELECT 
    id,
    image_url,
    updated_at
FROM about_content 
WHERE id = 'default';

