-- Change results_summary from TEXT to JSONB for automatic parsing
ALTER TABLE scout_executions
ALTER COLUMN results_summary TYPE JSONB USING results_summary::jsonb;
