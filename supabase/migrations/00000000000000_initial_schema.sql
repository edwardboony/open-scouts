-- =============================================================================
-- OPEN SCOUT - COMPLETE DATABASE SCHEMA
-- This consolidated migration represents the full current state of the database
-- =============================================================================

-- Enable pgvector extension for embedding storage
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop old chat tables if they exist (from previous iterations)
DO $$
BEGIN
    DROP TRIGGER IF EXISTS update_chat_session_on_message ON chat_messages;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

DROP FUNCTION IF EXISTS update_chat_session_timestamp();
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;

-- =============================================================================
-- SCOUTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS scouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  goal TEXT,
  search_queries JSONB DEFAULT '[]'::jsonb,
  location JSONB, -- {city: string, latitude: number, longitude: number}
  frequency TEXT CHECK (frequency IN ('hourly', 'every_3_days', 'weekly')),
  is_active BOOLEAN DEFAULT false, -- Changed from true to false per migration 20251111175437
  last_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- Note: is_completed column was removed per migration 20251111175437
);

-- =============================================================================
-- SCOUT MESSAGES TABLE (conversation history)
-- =============================================================================
CREATE TABLE IF NOT EXISTS scout_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID REFERENCES scouts(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SCOUT EXECUTIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS scout_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID REFERENCES scouts(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  results_summary JSONB, -- Changed from TEXT to JSONB per migration 20251111182000
  summary_text TEXT, -- One-sentence AI-generated summary of the execution
  summary_embedding vector(1536), -- OpenAI text-embedding-3-small generates 1536-dimensional vectors
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SCOUT EXECUTION STEPS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS scout_execution_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID REFERENCES scout_executions(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('search', 'scrape', 'analyze', 'summarize', 'tool_call')),
  description TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- USER PREFERENCES TABLE (per migration 20251113124500)
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row (single-user system)
INSERT INTO user_preferences (id, notification_email)
VALUES ('00000000-0000-0000-0000-000000000001', NULL)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_scout_messages_scout_id ON scout_messages(scout_id);
CREATE INDEX IF NOT EXISTS idx_scouts_updated_at ON scouts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_scouts_is_active ON scouts(is_active);
CREATE INDEX IF NOT EXISTS idx_scout_executions_scout_id ON scout_executions(scout_id);
CREATE INDEX IF NOT EXISTS idx_scout_executions_status ON scout_executions(status);
CREATE INDEX IF NOT EXISTS idx_scout_executions_started_at ON scout_executions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_scout_execution_steps_execution_id ON scout_execution_steps(execution_id);
CREATE INDEX IF NOT EXISTS idx_scout_execution_steps_step_number ON scout_execution_steps(step_number);

-- Vector similarity search index using HNSW (Hierarchical Navigable Small World)
-- This enables fast approximate nearest neighbor search on embeddings
CREATE INDEX IF NOT EXISTS idx_scout_executions_summary_embedding ON scout_executions
  USING hnsw (summary_embedding vector_cosine_ops);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to update scouts.updated_at when a message is added
CREATE OR REPLACE FUNCTION update_scout_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE scouts
  SET updated_at = NOW()
  WHERE id = NEW.scout_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for scout messages
DROP TRIGGER IF EXISTS update_scout_on_message ON scout_messages;
CREATE TRIGGER update_scout_on_message
  AFTER INSERT ON scout_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_scout_timestamp();

-- Function to update user_preferences.updated_at
CREATE OR REPLACE FUNCTION update_user_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user preferences
DROP TRIGGER IF EXISTS update_user_preferences_on_change ON user_preferences;
CREATE TRIGGER update_user_preferences_on_change
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_timestamp();

-- =============================================================================
-- SECURITY
-- =============================================================================
ALTER TABLE scouts DISABLE ROW LEVEL SECURITY;
ALTER TABLE scout_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE scout_executions DISABLE ROW LEVEL SECURITY;
ALTER TABLE scout_execution_steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
