import { describe, it, expect } from 'vitest'
import { evaluateProfile } from '../engine/profileScorer'
import { evaluateContent } from '../engine/contentScorer'
import { evaluateReels } from '../engine/reelsScorer'
import { evaluateEngagement } from '../engine/engagementScorer'
import { evaluateConsistency } from '../engine/consistencyScorer'
import { evaluateBranding } from '../engine/brandingScorer'
import { evaluateConversion } from '../engine/conversionScorer'
import { calculateFullAuditScore, getScoreLabelInfo } from '../engine/overallScorer'
import type { InstagramMedia, InstagramProfile } from '../types'

const mockProfile: InstagramProfile = {
  username: 'test_brand',
  display_name: 'Test Brand | Official',
  bio: 'Helping businesses scale with AI ✨\nBook your free consultation below 👇',
  profile_image_url: 'https://example.com/avatar.jpg',
  category: 'Marketing Agency',
  website_url: 'https://example.com',
  followers_count: 5000,
  following_count: 300,
  posts_count: 100,
  is_business_account: true,
  is_creator_account: false,
  data_source: 'MOCK',
}

const mockMedia: InstagramMedia[] = [
  {
    external_media_id: 'm1',
    media_type: 'REEL',
    media_url: 'https://example.com/m1.mp4',
    thumbnail_url: 'https://example.com/m1.jpg',
    caption: 'How to scale your leads using short-form Reels! 💡',
    permalink: 'https://instagram.com/p/m1',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    like_count: 450,
    comment_count: 35,
    view_count: 12000,
    share_count: 50,
    save_count: 80,
    engagement_rate: 9.7,
    content_category: 'EDUCATIONAL',
  },
  {
    external_media_id: 'm2',
    media_type: 'CAROUSEL',
    media_url: 'https://example.com/m2.jpg',
    thumbnail_url: 'https://example.com/m2.jpg',
    caption: '5 steps to optimize your bio for search ranking 📌',
    permalink: 'https://instagram.com/p/m2',
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    like_count: 220,
    comment_count: 18,
    view_count: 0,
    share_count: 20,
    save_count: 40,
    engagement_rate: 4.76,
    content_category: 'EDUCATIONAL',
  },
]

describe('ScoringEngine', () => {
  it('evaluates profile score within 0-100 bounds', () => {
    const score = evaluateProfile(mockProfile)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
    expect(score).toBeGreaterThan(60) // Strong profile should score well
  })

  it('evaluates content score within 0-100 bounds', () => {
    const score = evaluateContent(mockMedia)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('evaluates Reels score and handles missing Reels gracefully', () => {
    const reelScore = evaluateReels(mockMedia)
    expect(reelScore).toBeGreaterThan(50)

    const noReelsScore = evaluateReels([])
    expect(noReelsScore).toBeLessThan(50)
  })

  it('evaluates engagement score correctly', () => {
    const engScore = evaluateEngagement(mockProfile, mockMedia)
    expect(engScore).toBeGreaterThanOrEqual(0)
    expect(engScore).toBeLessThanOrEqual(100)
  })

  it('evaluates consistency score', () => {
    const conScore = evaluateConsistency(mockMedia)
    expect(conScore).toBeGreaterThanOrEqual(0)
    expect(conScore).toBeLessThanOrEqual(100)
  })

  it('evaluates branding score', () => {
    const brandScore = evaluateBranding(mockProfile)
    expect(brandScore).toBeGreaterThanOrEqual(0)
    expect(brandScore).toBeLessThanOrEqual(100)
  })

  it('evaluates conversion score', () => {
    const convScore = evaluateConversion(mockProfile)
    expect(convScore).toBeGreaterThanOrEqual(0)
    expect(convScore).toBeLessThanOrEqual(100)
  })

  it('calculates weighted composite overall score correctly', () => {
    const result = calculateFullAuditScore(mockProfile, mockMedia)
    expect(result.overall_score).toBeGreaterThanOrEqual(0)
    expect(result.overall_score).toBeLessThanOrEqual(100)

    expect(result.profile_score).toBeDefined()
    expect(result.content_score).toBeDefined()
    expect(result.reels_score).toBeDefined()
    expect(result.engagement_score).toBeDefined()
    expect(result.consistency_score).toBeDefined()
    expect(result.branding_score).toBeDefined()
    expect(result.conversion_score).toBeDefined()
  })

  it('returns correct score labels and threshold colors', () => {
    expect(getScoreLabelInfo(95).label).toBe('Excellent')
    expect(getScoreLabelInfo(85).label).toBe('Strong')
    expect(getScoreLabelInfo(75).label).toBe('Good')
    expect(getScoreLabelInfo(65).label).toBe('Needs Improvement')
    expect(getScoreLabelInfo(45).label).toBe('Weak')
    expect(getScoreLabelInfo(20).label).toBe('Critical')
  })
})
