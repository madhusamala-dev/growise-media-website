export type AuditStatus =
  | 'PENDING'
  | 'COLLECTING_DATA'
  | 'ANALYZING'
  | 'COMPLETED'
  | 'PARTIAL'
  | 'FAILED'

export type DataSource = 'MOCK' | 'META' | 'LIVE'

export type MediaType = 'IMAGE' | 'VIDEO' | 'REEL' | 'CAROUSEL'

export type MetricStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'ESTIMATED'

export type ContentCategory =
  | 'EDUCATIONAL'
  | 'PROMOTIONAL'
  | 'PRODUCT'
  | 'TESTIMONIAL'
  | 'ENTERTAINMENT'
  | 'BEHIND_THE_SCENES'
  | 'AUTHORITY'
  | 'COMMUNITY'
  | 'OTHER'

export type FindingCategory =
  | 'PROFILE'
  | 'CONTENT'
  | 'REELS'
  | 'ENGAGEMENT'
  | 'CONSISTENCY'
  | 'BRANDING'
  | 'CONVERSION'

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'POSITIVE'

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'DEMO_BOOKED'
  | 'PROPOSAL_SENT'
  | 'CONVERTED'
  | 'LOST'

export interface AuditSession {
  id: string
  session_token: string
  instagram_username: string
  status: AuditStatus
  overall_score: number | null
  audit_version: string
  data_source: DataSource
  error_message?: string | null
  created_at: string
  started_at?: string | null
  completed_at?: string | null
}

export interface InstagramProfile {
  id?: string
  audit_id?: string
  username: string
  display_name: string
  bio: string
  profile_image_url: string
  category: string
  website_url: string
  followers_count: number
  following_count: number
  posts_count: number
  is_business_account: boolean
  is_creator_account: boolean
  data_source: DataSource
  raw_data?: Record<string, unknown>
  created_at?: string
}

export interface InstagramMedia {
  id?: string
  audit_id?: string
  external_media_id: string
  media_type: MediaType
  media_url: string
  thumbnail_url: string
  caption: string
  permalink: string
  published_at: string
  like_count: number
  comment_count: number
  view_count: number
  share_count: number
  save_count: number
  engagement_rate: number
  content_category: ContentCategory
  ai_analysis?: {
    hookScore?: number
    clarityScore?: number
    readabilityScore?: number
    strengths?: string[]
    improvements?: string[]
  }
  created_at?: string
}

export interface AuditScore {
  id?: string
  audit_id: string
  profile_score: number
  content_score: number
  reels_score: number
  engagement_score: number
  consistency_score: number
  branding_score: number
  conversion_score: number
  overall_score: number
  score_explanation?: {
    profile?: string
    content?: string
    reels?: string
    engagement?: string
    consistency?: string
    branding?: string
    conversion?: string
  }
  created_at?: string
}

export interface AuditFinding {
  id?: string
  audit_id: string
  category: FindingCategory
  severity: SeverityLevel
  title: string
  description: string
  evidence?: string
  recommendation?: string
  priority: number
  created_at?: string
}

export interface AuditRecommendation {
  id?: string
  audit_id: string
  category: FindingCategory | string
  title: string
  description: string
  impact: 'High' | 'Medium' | 'Low'
  effort: 'Easy' | 'Medium' | 'Hard'
  priority: number
  ai_generated: boolean
  created_at?: string
}

export interface WeeklyGrowthPlanItem {
  week: number
  theme: string
  actions: string[]
}

export interface AuditLead {
  id?: string
  audit_id?: string
  name: string
  business_name: string
  email: string
  phone?: string
  whatsapp?: string
  industry?: string
  city?: string
  consent: boolean
  lead_source?: string
  lead_status?: LeadStatus
  created_at?: string
  updated_at?: string
}

export interface AuditEvent {
  id?: string
  audit_id?: string
  event_type:
    | 'LANDING_VIEW'
    | 'AUDIT_STARTED'
    | 'DATA_COLLECTED'
    | 'ANALYSIS_STARTED'
    | 'REPORT_GENERATED'
    | 'REPORT_VIEWED'
    | 'LEAD_FORM_OPENED'
    | 'LEAD_SUBMITTED'
    | 'CTA_CLICKED'
  metadata?: Record<string, unknown>
  created_at?: string
}

export interface AuditReport {
  session: AuditSession
  profile: InstagramProfile
  media: InstagramMedia[]
  scores: AuditScore
  findings: AuditFinding[]
  recommendations: AuditRecommendation[]
  growthPlan: WeeklyGrowthPlanItem[]
  lead?: AuditLead | null
  dataCompleteness: {
    profile: boolean
    media: boolean
    engagement: boolean
    reels: boolean
  }
}
