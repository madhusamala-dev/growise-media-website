-- Growise Instagram Growth Audit - Migration (Phase 2: Level-2 Audit Engine)
-- Adds Instagram User IDs to audit_sessions so the Level-2 audit edge function
-- can load them server-side (never passed from the frontend).

-- 1. Add instagram_user_id: the Instagram User ID of the account being audited
--    (returned by Meta Business Discovery as business_discovery.id)
ALTER TABLE public.audit_sessions
  ADD COLUMN IF NOT EXISTS instagram_user_id TEXT;

-- 2. Add root_instagram_user_id: the Instagram Business Account ID used for
--    Business Discovery API calls (comes from server config, not from the user)
ALTER TABLE public.audit_sessions
  ADD COLUMN IF NOT EXISTS root_instagram_user_id TEXT;

-- 3. Add level2_completed_at: when the Level-2 media audit finished
ALTER TABLE public.audit_sessions
  ADD COLUMN IF NOT EXISTS level2_completed_at TIMESTAMPTZ;

-- 4. Allow edge functions (using service role) to UPDATE audit_sessions
--    to store instagram_user_id and root_instagram_user_id after Level-1 fetch.
--    (Edge functions use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS,
--     but these policies are needed for anon-key client usage.)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Public update audit_sessions status'
      AND tablename = 'audit_sessions'
  ) THEN
    CREATE POLICY "Public update audit_sessions status"
      ON public.audit_sessions
      FOR UPDATE
      USING (true);
  END IF;
END
$$;

-- 5. Add index for instagram_user_id lookups
CREATE INDEX IF NOT EXISTS idx_audit_sessions_instagram_user_id 
  ON public.audit_sessions(instagram_user_id);
