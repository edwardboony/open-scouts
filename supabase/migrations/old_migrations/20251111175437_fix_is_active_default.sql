-- Change the default value of is_active from true to false
ALTER TABLE scouts ALTER COLUMN is_active SET DEFAULT false;

-- Update existing scouts to inactive
-- (This ensures scouts that were auto-created with is_active=true are set to false)
UPDATE scouts
SET is_active = false
WHERE is_active = true;

-- Drop the index on is_completed before dropping the column
DROP INDEX IF EXISTS idx_scouts_is_completed;

-- Remove the is_completed column as it's redundant
-- (completeness can be determined by checking if required fields are filled)
ALTER TABLE scouts DROP COLUMN IF EXISTS is_completed;
