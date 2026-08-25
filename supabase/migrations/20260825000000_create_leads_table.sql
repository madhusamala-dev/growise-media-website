-- Growise Website Inquiry Leads
-- Stores enquiries submitted via the public LeadForm on the Growise website.

CREATE TABLE IF NOT EXISTS public.leads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Customer details
    name            TEXT NOT NULL,
    business_name   TEXT NOT NULL,
    phone           TEXT NOT NULL,
    email           TEXT,

    -- Business context
    business_category       TEXT,
    location                TEXT,
    advertising_requirement TEXT,
    content_types           JSONB,
    monthly_content_volume  TEXT,
    website                 TEXT,
    instagram               TEXT,
    additional_notes        TEXT,

    -- Pipeline metadata
    source          TEXT NOT NULL DEFAULT 'website',
    status          TEXT NOT NULL DEFAULT 'new',
    email_status    TEXT NOT NULL DEFAULT 'pending',
    email_sent_at   TIMESTAMPTZ,

    -- Attribution
    page_url    TEXT,
    utm_source  TEXT,
    utm_medium  TEXT,
    utm_campaign TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_created_at  ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status      ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_business_name ON public.leads (business_name);
CREATE INDEX IF NOT EXISTS idx_leads_email       ON public.leads (email);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- The leads table is written to exclusively by the `inquiries` Edge Function
-- using the service-role key (which bypasses RLS).
-- SELECT is allowed for authenticated / anon users so the admin dashboard
-- can query leads from the client side.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select leads" ON public.leads
  FOR SELECT USING (true);

-- INSERT is only possible via service-role key (Edge Function bypasses RLS).
-- No INSERT or UPDATE policies for anon/authenticated roles.
