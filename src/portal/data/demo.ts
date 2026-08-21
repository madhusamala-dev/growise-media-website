import type {
  BrandKit,
  ContentItem,
  Conversation,
  PlatformId,
  PlatformState,
  PortalNotification,
  PortalSettings,
  AnalyticsPeriod,
} from './types'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function msFromNow(ms: number): number {
  return Date.now() + ms
}

/* ------------------------------------------------------------------ */
/*  Demo client (used by auth.tsx prototype login)                     */
/* ------------------------------------------------------------------ */

export const demoClient = {
  id: 'client-demo',
  fullName: 'Demo User',
  businessName: 'Demo Business',
  email: 'demo@growise.com',
  phone: '+91 98765 43210',
}

/* ------------------------------------------------------------------ */
/*  Content — empty until real video content is added                  */
/* ------------------------------------------------------------------ */

export const demoContent: ContentItem[] = []

/* ------------------------------------------------------------------ */
/*  Platforms                                                          */
/* ------------------------------------------------------------------ */

export const demoPlatforms: PlatformState[] = [
  { id: 'instagram', displayName: 'Instagram', status: 'not_connected', handle: '@yourbrand', followers: 0, followersTrend: 0, postsThisMonth: 0, engagement: 0 },
  { id: 'youtube', displayName: 'YouTube', status: 'not_connected', handle: '@yourbrand', followers: 0, followersTrend: 0, postsThisMonth: 0, engagement: 0 },
  { id: 'linkedin', displayName: 'LinkedIn', status: 'not_connected', handle: '@yourbrand', followers: 0, followersTrend: 0, postsThisMonth: 0, engagement: 0 },
  { id: 'facebook', displayName: 'Facebook', status: 'not_connected', handle: '@yourbrand', followers: 0, followersTrend: 0, postsThisMonth: 0, engagement: 0 },
]

/* ------------------------------------------------------------------ */
/*  Notifications — empty until real ones are generated                */
/* ------------------------------------------------------------------ */

export const demoNotifications: PortalNotification[] = []

/* ------------------------------------------------------------------ */
/*  Conversations — empty until real ones exist                        */
/* ------------------------------------------------------------------ */

export const demoConversations: Conversation[] = []

/* ------------------------------------------------------------------ */
/*  Brand Kit defaults                                                 */
/* ------------------------------------------------------------------ */

export const demoBrandKit: BrandKit = {
  primaryColor: '#ff4a11',
  secondaryColor: '#ffd400',
  font: 'Inter',
  tagline: '',
  tone: 'Professional',
  description: '',
  website: '',
  contactEmail: '',
  contactPhone: '',
}

/* ------------------------------------------------------------------ */
/*  Settings defaults                                                  */
/* ------------------------------------------------------------------ */

export const demoSettings: PortalSettings = {
  profile: { fullName: '', email: '', phone: '' },
  business: { name: '', industry: '', website: '', location: '' },
  notifications: { email: true, approvals: true, publishing: true, weeklyReport: true },
}

/* ------------------------------------------------------------------ */
/*  Analytics — empty series placeholders                              */
/* ------------------------------------------------------------------ */

const emptySeries = [
  { label: 'Reach', values: [0] },
  { label: 'Engagement %', values: [0] },
  { label: 'Followers', values: [0] },
  { label: 'Video views', values: [0] },
]

export const demoAnalytics: Record<AnalyticsPeriod, typeof emptySeries> = {
  '30d': emptySeries,
  '90d': emptySeries,
  '12m': emptySeries,
}

/* ------------------------------------------------------------------ */
/*  Platform performance — empty until real data arrives               */
/* ------------------------------------------------------------------ */

export const demoPlatformPerformance: {
  platform: PlatformId
  followers: number
  trend: number
  posts30d: number
  engagement: number
  views30d: number
}[] = []

/* ------------------------------------------------------------------ */
/*  Onboarding option lists                                            */
/* ------------------------------------------------------------------ */

export const fontOptions = ['Inter', 'Poppins', 'Playfair Display', 'Space Grotesk']

export const industryOptions = [
  'Bakery / Food & Beverage',
  'Restaurant / Café',
  'Real Estate',
  'Clinic / Healthcare',
  'Salon / Spa',
  'Gym / Fitness',
  'Education / Coaching',
  'Retail Store',
  'E-commerce',
  'Other',
]

export const toneOptions = ['Professional', 'Friendly', 'Bold', 'Warm', 'Minimal']

export const languageOptions = ['English', 'Hindi', 'Bilingual (Hindi + English)']

export const frequencyOptions = [
  '2 videos / week',
  '3 videos / week',
  '1 video / week',
  'Custom',
]

export const ageRangeOptions = ['18–24', '25–34', '35–44', '45–54', '55+']

export const contentStyleOptions = ['Educational', 'Promotional', 'Behind the scenes', 'Customer stories']

export const defaultOnboardingSocial: Record<PlatformId, 'connected' | 'not_connected'> = {
  instagram: 'not_connected',
  youtube: 'not_connected',
  linkedin: 'not_connected',
  facebook: 'not_connected',
}
