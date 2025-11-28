-- Create scout_executions table to track each run of a scout
CREATE TABLE IF NOT EXISTS scout_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID REFERENCES scouts(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  results_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scout_execution_steps table to track each step of an execution
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scout_executions_scout_id ON scout_executions(scout_id);
CREATE INDEX IF NOT EXISTS idx_scout_executions_status ON scout_executions(status);
CREATE INDEX IF NOT EXISTS idx_scout_executions_started_at ON scout_executions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_scout_execution_steps_execution_id ON scout_execution_steps(execution_id);
CREATE INDEX IF NOT EXISTS idx_scout_execution_steps_step_number ON scout_execution_steps(step_number);

-- Disable Row Level Security for these tables
ALTER TABLE scout_executions DISABLE ROW LEVEL SECURITY;
ALTER TABLE scout_execution_steps DISABLE ROW LEVEL SECURITY;
