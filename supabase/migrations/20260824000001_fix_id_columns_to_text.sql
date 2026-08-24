-- Fix ID columns from UUID to TEXT
-- The app generates IDs like 'aud_xxxx' which are not valid UUIDs.
-- PostgreSQL rejects these inserts on UUID columns.

-- 1. Drop foreign key constraints first (they reference audit_sessions.id)
ALTER TABLE public.audit_profiles DROP CONSTRAINT IF EXISTS audit_profiles_audit_id_fkey;
ALTER TABLE public.audit_media DROP CONSTRAINT IF EXISTS audit_media_audit_id_fkey;
ALTER TABLE public.audit_scores DROP CONSTRAINT IF EXISTS audit_scores_audit_id_fkey;
ALTER TABLE public.audit_findings DROP CONSTRAINT IF EXISTS audit_findings_audit_id_fkey;
ALTER TABLE public.audit_recommendations DROP CONSTRAINT IF EXISTS audit_recommendations_audit_id_fkey;
ALTER TABLE public.audit_leads DROP CONSTRAINT IF EXISTS audit_leads_audit_id_fkey;
ALTER TABLE public.audit_events DROP CONSTRAINT IF EXISTS audit_events_audit_id_fkey;

-- 2. Change audit_sessions.id from UUID to TEXT
ALTER TABLE public.audit_sessions ALTER COLUMN id TYPE TEXT;

-- 3. Change audit_id foreign key columns from UUID to TEXT
ALTER TABLE public.audit_profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.audit_profiles ALTER COLUMN audit_id TYPE TEXT;

ALTER TABLE public.audit_media ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.audit_media ALTER COLUMN audit_id TYPE TEXT;

ALTER TABLE public.audit_scores ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.audit_scores ALTER COLUMN audit_id TYPE TEXT;

ALTER TABLE public.audit_findings ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.audit_findings ALTER COLUMN audit_id TYPE TEXT;

ALTER TABLE public.audit_recommendations ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.audit_recommendations ALTER COLUMN audit_id TYPE TEXT;

ALTER TABLE public.audit_leads ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.audit_leads ALTER COLUMN audit_id TYPE TEXT;

ALTER TABLE public.audit_events ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.audit_events ALTER COLUMN audit_id TYPE TEXT;

-- 4. Re-add foreign key constraints
ALTER TABLE public.audit_profiles
  ADD CONSTRAINT audit_profiles_audit_id_fkey
  FOREIGN KEY (audit_id) REFERENCES public.audit_sessions(id) ON DELETE CASCADE;

ALTER TABLE public.audit_media
  ADD CONSTRAINT audit_media_audit_id_fkey
  FOREIGN KEY (audit_id) REFERENCES public.audit_sessions(id) ON DELETE CASCADE;

ALTER TABLE public.audit_scores
  ADD CONSTRAINT audit_scores_audit_id_fkey
  FOREIGN KEY (audit_id) REFERENCES public.audit_sessions(id) ON DELETE CASCADE;

ALTER TABLE public.audit_findings
  ADD CONSTRAINT audit_findings_audit_id_fkey
  FOREIGN KEY (audit_id) REFERENCES public.audit_sessions(id) ON DELETE CASCADE;

ALTER TABLE public.audit_recommendations
  ADD CONSTRAINT audit_recommendations_audit_id_fkey
  FOREIGN KEY (audit_id) REFERENCES public.audit_sessions(id) ON DELETE CASCADE;

ALTER TABLE public.audit_leads
  ADD CONSTRAINT audit_leads_audit_id_fkey
  FOREIGN KEY (audit_id) REFERENCES public.audit_sessions(id) ON DELETE SET NULL;

ALTER TABLE public.audit_events
  ADD CONSTRAINT audit_events_audit_id_fkey
  FOREIGN KEY (audit_id) REFERENCES public.audit_sessions(id) ON DELETE CASCADE;
