import { AUDIT_CONFIG } from '../config/auditConfig'
import type { AuditScore, InstagramMedia, InstagramProfile } from '../types'
import { evaluateProfile } from './profileScorer'
import { evaluateContent } from './contentScorer'
import { evaluateReels } from './reelsScorer'
import { evaluateEngagement } from './engagementScorer'
import { evaluateConsistency } from './consistencyScorer'
import { evaluateBranding } from './brandingScorer'
import { evaluateConversion } from './conversionScorer'

export interface ScoreLabelInfo {
  label: 'Excellent' | 'Strong' | 'Good' | 'Needs Improvement' | 'Weak' | 'Critical'
  color: 'emerald' | 'green' | 'blue' | 'amber' | 'orange' | 'rose'
}

export function getScoreLabelInfo(score: number): ScoreLabelInfo {
  if (score >= 90) return { label: 'Excellent', color: 'emerald' }
  if (score >= 80) return { label: 'Strong', color: 'green' }
  if (score >= 70) return { label: 'Good', color: 'blue' }
  if (score >= 60) return { label: 'Needs Improvement', color: 'amber' }
  if (score >= 40) return { label: 'Weak', color: 'orange' }
  return { label: 'Critical', color: 'rose' }
}

export function calculateFullAuditScore(
  profile: InstagramProfile,
  media: InstagramMedia[]
): AuditScore {
  const pScore = evaluateProfile(profile)
  const cScore = evaluateContent(media)
  const rScore = evaluateReels(media)
  const eScore = evaluateEngagement(profile, media)
  const conScore = evaluateConsistency(media)
  const bScore = evaluateBranding(profile)
  const convScore = evaluateConversion(profile)

  const w = AUDIT_CONFIG.scoringWeights

  const rawOverall =
    pScore * w.profile +
    cScore * w.content +
    rScore * w.reels +
    eScore * w.engagement +
    conScore * w.consistency +
    bScore * w.branding +
    convScore * w.conversion

  const overall = Math.min(100, Math.max(0, Math.round(rawOverall)))

  return {
    audit_id: profile.audit_id || '',
    profile_score: pScore,
    content_score: cScore,
    reels_score: rScore,
    engagement_score: eScore,
    consistency_score: conScore,
    branding_score: bScore,
    conversion_score: convScore,
    overall_score: overall,
    score_explanation: {
      profile: `Profile score (${pScore}/100) based on bio clarity, CTAs, and link setup.`,
      content: `Content score (${cScore}/100) based on post variety and educational ratio.`,
      reels: `Reels score (${rScore}/100) based on short-form video frequency and views.`,
      engagement: `Engagement score (${eScore}/100) based on follower-to-interaction ratio.`,
      consistency: `Consistency score (${conScore}/100) based on publishing frequency.`,
      branding: `Branding score (${bScore}/100) based on visual identity.`,
      conversion: `Conversion score (${convScore}/100) based on lead path clarity.`,
    },
  }
}
