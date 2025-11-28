-- Drop existing chat tables (safely handle if they don't exist)
DO $$
BEGIN
    DROP TRIGGER IF EXISTS update_chat_session_on_message ON chat_messages;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

DROP FUNCTION IF EXISTS update_chat_session_timestamp();
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;

-- Create scouts table
CREATE TABLE IF NOT EXISTS scouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  goal TEXT,
  search_queries JSONB DEFAULT '[]'::jsonb,
  location JSONB, -- stores {city: string, latitude: number, longitude: number}
  frequency TEXT CHECK (frequency IN ('hourly', 'every_3_days', 'weekly')),
  is_active BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false, -- true when scout configuration is finalized
  last_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scout_messages table for conversation history
CREATE TABLE IF NOT EXISTS scout_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID REFERENCES scouts(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scout_messages_scout_id ON scout_messages(scout_id);
CREATE INDEX IF NOT EXISTS idx_scouts_updated_at ON scouts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_scouts_is_active ON scouts(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scout_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE scouts
  SET updated_at = NOW()
  WHERE id = NEW.scout_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update scouts.updated_at when a message is added
DROP TRIGGER IF EXISTS update_scout_on_message ON scout_messages;
CREATE TRIGGER update_scout_on_message
  AFTER INSERT ON scout_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_scout_timestamp();

-- Disable Row Level Security for these tables (since we don't have user authentication)
ALTER TABLE scouts DISABLE ROW LEVEL SECURITY;
ALTER TABLE scout_messages DISABLE ROW LEVEL SECURITY;
