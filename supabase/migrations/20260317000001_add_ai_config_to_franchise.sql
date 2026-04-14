-- Add AI Config to Franchise Units
ALTER TABLE public.franchise_units 
ADD COLUMN IF NOT EXISTS ai_config JSONB DEFAULT '{
  "provider": "gemini",
  "openai_key": "",
  "openrouter_key": "",
  "openai_model": "gpt-4o",
  "openrouter_model": "anthropic/claude-3.5-sonnet"
}'::jsonb;

-- Ensure RLS allows updating this column (already allowed by previous policies but good to be explicit for authenticated users)
-- Policies are usually "Allow all authenticated" on franchise_units in this codebase.
