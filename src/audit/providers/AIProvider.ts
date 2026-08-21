import type {
  AuditFinding,
  AuditRecommendation,
  AuditScore,
  InstagramMedia,
  InstagramProfile,
  WeeklyGrowthPlanItem,
} from '../types'

export interface ProfileAiAnalysis {
  clarityScore: number
  customerBenefitScore: number
  ctaScore: number
  keywordScore: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

export interface CaptionAiAnalysis {
  hookScore: number
  clarityScore: number
  storytellingScore: number
  ctaScore: number
  readabilityScore: number
  contentType: string
  promotionalIntensity: number
  strengths: string[]
  improvements: string[]
}

export interface CreativeAiAnalysis {
  visualScore: number
  brandingScore: number
  hookScore: number
  textReadabilityScore: number
  ctaScore: number
  humanPresence: boolean
  strengths: string[]
  improvements: string[]
}

export interface AIProvider {
  analyzeProfile(profile: InstagramProfile): Promise<ProfileAiAnalysis>
  analyzeCaption(caption: string): Promise<CaptionAiAnalysis>
  analyzeCreative(media: InstagramMedia): Promise<CreativeAiAnalysis>
  generateFindings(
    profile: InstagramProfile,
    media: InstagramMedia[],
    scores: AuditScore
  ): Promise<AuditFinding[]>
  generateRecommendations(
    profile: InstagramProfile,
    scores: AuditScore,
    findings: AuditFinding[]
  ): Promise<AuditRecommendation[]>
  generate30DayPlan(
    profile: InstagramProfile,
    findings: AuditFinding[]
  ): Promise<WeeklyGrowthPlanItem[]>
  generateSummary(
    profile: InstagramProfile,
    scores: AuditScore
  ): Promise<{ headline: string; overview: string }>
}
