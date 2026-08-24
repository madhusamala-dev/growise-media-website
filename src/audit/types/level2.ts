/**
 * Level-2 Audit Engine — Frontend TypeScript Types
 *
 * These types mirror the response shape returned by the `instagram-audit`
 * Supabase Edge Function. They are the source of truth for the frontend.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CORE REPORT SHAPE
// ─────────────────────────────────────────────────────────────────────────────

export interface Level2AuditReport {
  auditId: string
  profile: Level2Profile
  auditWindow: AuditWindow
  score: Level2Score
  metrics: AccountMetrics
  contentAnalysis: ContentAnalysis
  topPosts: RankedPost[]
  bottomPosts: RankedPost[]
  reelsAnalyzed: number
  bestPerformingReels: RankedReel[]
  worstPerformingReels: RankedReel[]
  opportunities: Opportunity[]
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────

export interface Level2Profile {
  instagramUserId: string
  username: string
  name: string
  biography: string
  website: string
  profilePictureUrl: string
  followers: number
  following: number
  mediaCount: number
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT WINDOW
// ─────────────────────────────────────────────────────────────────────────────

export interface AuditWindow {
  days: number
  start: string          // ISO timestamp
  end: string            // ISO timestamp
  oldestPostTimestamp: string | null
  newestPostTimestamp: string | null
  postsAnalyzed: number
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE
// ─────────────────────────────────────────────────────────────────────────────

export type ScoreRating = 'EXCELLENT' | 'GOOD' | 'NEEDS IMPROVEMENT' | 'POOR'

export interface Level2Score {
  total: number
  rating: ScoreRating
  breakdown: {
    profile: number          // max 20
    content: number          // max 25
    engagement: number       // max 25
    consistency: number      // max 15
    conversionReadiness: number  // max 15
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNT METRICS
// ─────────────────────────────────────────────────────────────────────────────

export interface AccountMetrics {
  postsAnalyzed: number
  reelsAnalyzed: number
  videosAnalyzed: number
  imagesAnalyzed: number
  carouselsAnalyzed: number

  averageLikes: number
  averageComments: number
  averageViews: number | null
  averageEngagement: number

  medianLikes: number
  medianComments: number
  medianViews: number | null
  medianEngagement: number

  averageEngagementRate: number | null
  medianEngagementRate: number | null

  averageViewRate: number | null
  medianViewRate: number | null

  averageCommentRate: number | null
  medianCommentRate: number | null

  averageLikeRate: number | null
  medianLikeRate: number | null
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

export interface ContentAnalysis {
  contentMix: ContentMix
  captionStats: CaptionStats
  hashtagAnalysis: HashtagAnalysis
  postingConsistency: PostingConsistency
}

export interface ContentMix {
  reelsPercentage: number
  videoPercentage: number
  imagePercentage: number
  carouselPercentage: number
}

export interface CaptionStats {
  averageCaptionLength: number
  CTAUsagePercentage: number
  averageHashtagsPerPost: number
  postsWithoutCaptions: number
  postsWithoutCTA: number
  postsWithoutHashtags: number
}

export interface HashtagAnalysis {
  averageHashtagsPerPost: number
  uniqueHashtags: number
  mostUsedHashtags: Array<{ tag: string; count: number }>
  postsWithoutHashtags: number
  repeatedHashtagPercentage: number
}

export interface PostingConsistency {
  postsLast7Days: number
  postsLast30Days: number
  averagePostsPerWeek: number
  averageReelsPerWeek: number
  averageDaysBetweenPosts: number
  longestPostingGapDays: number
}

// ─────────────────────────────────────────────────────────────────────────────
// RANKED POSTS
// ─────────────────────────────────────────────────────────────────────────────

export interface RankedPost {
  rank: number
  mediaId: string
  mediaType: string
  mediaProductType: string | null
  timestamp: string | null
  permalink: string | null
  likes: number
  comments: number
  views: number | null
  engagementRate: number | null
  viewRate: number | null
}

// ─────────────────────────────────────────────────────────────────────────────
// RANKED REELS (best/worst performing)
// ─────────────────────────────────────────────────────────────────────────────

export interface RankedReel {
  rank: number
  mediaId: string
  caption: string
  permalink: string | null
  timestamp: string | null
  mediaType: string
  mediaProductType: string
  likes: number
  comments: number
  views: number | null
  engagement: number
  engagementRate: number | null
  viewRate: number | null
}

// ─────────────────────────────────────────────────────────────────────────────
// OPPORTUNITIES
// ─────────────────────────────────────────────────────────────────────────────

export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type EffortLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Opportunity {
  rule: string
  title: string
  description: string
  impact: ImpactLevel
  effort: EffortLevel
  category: string
  evidence: Record<string, unknown>
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE KEY
// ─────────────────────────────────────────────────────────────────────────────

export const LEVEL2_STORAGE_KEY = 'growise_level2_reports_v1'

export function getStoredLevel2Report(auditId: string): Level2AuditReport | null {
  try {
    const raw = localStorage.getItem(LEVEL2_STORAGE_KEY)
    if (!raw) return null
    const store = JSON.parse(raw) as Record<string, Level2AuditReport>
    return store[auditId] ?? null
  } catch {
    return null
  }
}

export function storeLevel2Report(auditId: string, report: Level2AuditReport): void {
  try {
    const raw = localStorage.getItem(LEVEL2_STORAGE_KEY)
    const store = raw ? (JSON.parse(raw) as Record<string, Level2AuditReport>) : {}
    store[auditId] = report
    localStorage.setItem(LEVEL2_STORAGE_KEY, JSON.stringify(store))
  } catch (e) {
    console.warn('[level2] Failed to persist report to localStorage:', e)
  }
}
