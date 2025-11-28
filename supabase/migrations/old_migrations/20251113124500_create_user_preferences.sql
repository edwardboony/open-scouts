-- Create user_preferences table for storing notification settings
-- Since there's no user auth system, this will store global preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default row (single-user system for now)
INSERT INTO user_preferences (id, notification_email)
VALUES ('00000000-0000-0000-0000-000000000001', NULL)
ON CONFLICT (id) DO NOTHING;

-- Disable Row Level Security (no user auth)
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_user_preferences_on_change ON user_preferences;
CREATE TRIGGER update_user_preferences_on_change
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_timestamp();
