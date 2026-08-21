-- Growise Instagram Growth Audit - Database Migration (Phase 1)

-- 1. Table: audit_sessions
CREATE TABLE IF NOT EXISTS public.audit_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token TEXT UNIQUE NOT NULL,
    instagram_username TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'COLLECTING_DATA', 'ANALYZING', 'COMPLETED', 'PARTIAL', 'FAILED')),
    overall_score INTEGER CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)),
    audit_version TEXT NOT NULL DEFAULT '1.0',
    data_source TEXT NOT NULL DEFAULT 'MOCK' CHECK (data_source IN ('MOCK', 'META')),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 2. Table: audit_profiles
CREATE TABLE IF NOT EXISTS public.audit_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES public.audit_sessions(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    display_name TEXT,
    bio TEXT,
    profile_image_url TEXT,
    category TEXT,
    website_url TEXT,
    followers_count INTEGER NOT NULL DEFAULT 0,
    following_count INTEGER NOT NULL DEFAULT 0,
    posts_count INTEGER NOT NULL DEFAULT 0,
    is_business_account BOOLEAN DEFAULT true,
    is_creator_account BOOLEAN DEFAULT false,
    data_source TEXT NOT NULL DEFAULT 'MOCK',
    raw_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table: audit_media
CREATE TABLE IF NOT EXISTS public.audit_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES public.audit_sessions(id) ON DELETE CASCADE,
    external_media_id TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO', 'REEL', 'CAROUSEL')),
    media_url TEXT,
    thumbnail_url TEXT,
    caption TEXT,
    permalink TEXT,
    published_at TIMESTAMPTZ,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    engagement_rate NUMERIC(8,4) DEFAULT 0.0000,
    content_category TEXT,
    ai_analysis JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: audit_scores
CREATE TABLE IF NOT EXISTS public.audit_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES public.audit_sessions(id) ON DELETE CASCADE,
    profile_score INTEGER NOT NULL CHECK (profile_score >= 0 AND profile_score <= 100),
    content_score INTEGER NOT NULL CHECK (content_score >= 0 AND content_score <= 100),
    reels_score INTEGER NOT NULL CHECK (reels_score >= 0 AND reels_score <= 100),
    engagement_score INTEGER NOT NULL CHECK (engagement_score >= 0 AND engagement_score <= 100),
    consistency_score INTEGER NOT NULL CHECK (consistency_score >= 0 AND consistency_score <= 100),
    branding_score INTEGER NOT NULL CHECK (branding_score >= 0 AND branding_score <= 100),
    conversion_score INTEGER NOT NULL CHECK (conversion_score >= 0 AND conversion_score <= 100),
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    score_explanation JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table: audit_findings
CREATE TABLE IF NOT EXISTS public.audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES public.audit_sessions(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('PROFILE', 'CONTENT', 'REELS', 'ENGAGEMENT', 'CONSISTENCY', 'BRANDING', 'CONVERSION')),
    severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'POSITIVE')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence TEXT,
    recommendation TEXT,
    priority INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Table: audit_recommendations
CREATE TABLE IF NOT EXISTS public.audit_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES public.audit_sessions(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    impact TEXT NOT NULL,
    effort TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    ai_generated BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Table: audit_leads
CREATE TABLE IF NOT EXISTS public.audit_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES public.audit_sessions(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    industry TEXT,
    city TEXT,
    consent BOOLEAN NOT NULL DEFAULT false,
    lead_source TEXT DEFAULT 'INSTAGRAM_AUDIT',
    lead_status TEXT NOT NULL DEFAULT 'NEW' CHECK (lead_status IN ('NEW', 'CONTACTED', 'DEMO_BOOKED', 'PROPOSAL_SENT', 'CONVERTED', 'LOST')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Table: audit_events
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES public.audit_sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_audit_sessions_token ON public.audit_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_audit_sessions_username ON public.audit_sessions(instagram_username);
CREATE INDEX IF NOT EXISTS idx_audit_profiles_audit_id ON public.audit_profiles(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_media_audit_id ON public.audit_media(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_scores_audit_id ON public.audit_scores(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_findings_audit_id ON public.audit_findings(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_recommendations_audit_id ON public.audit_recommendations(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_leads_audit_id ON public.audit_leads(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_leads_email ON public.audit_leads(email);
CREATE INDEX IF NOT EXISTS idx_audit_events_audit_id ON public.audit_events(audit_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.audit_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Anonymous Users: Can insert sessions, leads, events, and view session data matching their session token
CREATE POLICY "Public insert audit_sessions" ON public.audit_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select audit_sessions" ON public.audit_sessions FOR SELECT USING (true);
CREATE POLICY "Public select audit_profiles" ON public.audit_profiles FOR SELECT USING (true);
CREATE POLICY "Public select audit_media" ON public.audit_media FOR SELECT USING (true);
CREATE POLICY "Public select audit_scores" ON public.audit_scores FOR SELECT USING (true);
CREATE POLICY "Public select audit_findings" ON public.audit_findings FOR SELECT USING (true);
CREATE POLICY "Public select audit_recommendations" ON public.audit_recommendations FOR SELECT USING (true);

CREATE POLICY "Public insert audit_leads" ON public.audit_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select audit_leads" ON public.audit_leads FOR SELECT USING (true);
CREATE POLICY "Public update audit_leads" ON public.audit_leads FOR UPDATE USING (true);

CREATE POLICY "Public insert audit_events" ON public.audit_events FOR INSERT WITH CHECK (true);
