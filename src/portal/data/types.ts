/* ------------------------------------------------------------------ */
/*  Session / Auth                                                     */
/* ------------------------------------------------------------------ */

export interface SessionUser {
  id: string
  role: string
  fullName: string
  businessName: string
  email: string
  phone?: string
  createdAt: string
  onboardingComplete: boolean
  onboarding?: OnboardingData
}

export interface BusinessInfo {
  name: string
  industry: string
  website: string
  location: string
  description: string
}

export interface OnboardingData {
  business: BusinessInfo
  audience: {
    targetAudience: string
    customerType: string
    geoMarket: string
    ageRange: string
    interests: string[]
  }
  brand: {
    primaryColor: string
    secondaryColor: string
    description: string
    tone: string
    language: string
    logoUrl?: string
  }
  social: Record<PlatformId, PlatformStatus>
  content: {
    products: string[]
    topics: string[]
    avoid: string[]
    style: string
    frequency: string
  }
}

/* ------------------------------------------------------------------ */
/*  Platform                                                           */
/* ------------------------------------------------------------------ */

export type PlatformId = 'instagram' | 'youtube' | 'linkedin' | 'facebook'

export type PlatformStatus = 'connected' | 'not_connected' | 'connection_required'

export interface PlatformState {
  id: PlatformId
  displayName: string
  status: PlatformStatus
  handle: string
  followers: number
  followersTrend: number
  postsThisMonth: number
  engagement: number
  latestPost?: string
}

/* ------------------------------------------------------------------ */
/*  Content Pipeline                                                   */
/* ------------------------------------------------------------------ */

export type ContentStatus =
  | 'idea'
  | 'script'
  | 'production'
  | 'editing'
  | 'approval'
  | 'revision'
  | 'scheduled'
  | 'published'

export interface ContentItem {
  id: string
  title: string
  description: string
  caption: string
  hashtags: string[]
  type: string
  duration: string
  platforms: PlatformId[]
  stats: { views: number; likes: number; shares: number; comments: number }
  palette: [string, string]
  status: ContentStatus
  createdAt: string
  scheduledAt?: string
  publishedAt?: string
  feedbackNote?: string
}

export const PIPELINE_STAGES: { key: string; label: string }[] = [
  { key: 'idea', label: 'Idea' },
  { key: 'script', label: 'Script' },
  { key: 'production', label: 'Production' },
  { key: 'editing', label: 'Editing' },
  { key: 'approval', label: 'Client Approval' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'published', label: 'Published' },
]

/* ------------------------------------------------------------------ */
/*  Notifications                                                      */
/* ------------------------------------------------------------------ */

export type NotificationKind = 'approval' | 'scheduled' | 'published' | 'report' | 'info'

export interface PortalNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  time: string
  createdAt: number
  read: boolean
  href: string
}

/* ------------------------------------------------------------------ */
/*  Conversations                                                      */
/* ------------------------------------------------------------------ */

export interface ConversationMessage {
  id: string
  from: 'team' | 'client'
  body: string
  time: string
  createdAt: number
  attachmentName?: string
}

export interface Conversation {
  id: string
  name: string
  subtitle: string
  messages: ConversationMessage[]
  unread: number
}

/* ------------------------------------------------------------------ */
/*  Brand Kit                                                          */
/* ------------------------------------------------------------------ */

export interface BrandKit {
  primaryColor: string
  secondaryColor: string
  font: string
  tagline: string
  tone: string
  description: string
  logoUrl?: string
  website: string
  contactEmail: string
  contactPhone: string
}

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

export interface PortalSettings {
  profile: { fullName: string; email: string; phone: string }
  business: { name: string; industry: string; website: string; location: string }
  notifications: { email: boolean; approvals: boolean; publishing: boolean; weeklyReport: boolean }
}

/* ------------------------------------------------------------------ */
/*  Dashboard Metrics                                                  */
/* ------------------------------------------------------------------ */

export type WeekMetricTone = 'ember' | 'gold' | 'emerald' | 'sky' | 'violet' | 'neutral'

export interface WeekMetric {
  label: string
  value: string
  hint: string
  trend?: number
  tone: WeekMetricTone
}

/* ------------------------------------------------------------------ */
/*  Analytics                                                          */
/* ------------------------------------------------------------------ */

export type AnalyticsPeriod = '30d' | '90d' | '12m'
