import type { InstagramProfile } from '../types'

export function evaluateConversion(profile: InstagramProfile): number {
  let score = 35 // Base conversion score

  // 1. Direct Website / Conversion Link (+25)
  if (profile.website_url && profile.website_url.length > 5) {
    score += 25
  }

  // 2. Direct Call-to-Action in bio (+20)
  const bioLower = profile.bio ? profile.bio.toLowerCase() : ''
  if (bioLower.includes('book') || bioLower.includes('dm') || bioLower.includes('visit') || bioLower.includes('shop') || bioLower.includes('👇')) {
    score += 20
  }

  // 3. Clear Benefit Statement (+20)
  if (bioLower.includes('free') || bioLower.includes('trial') || bioLower.includes('transform') || bioLower.includes('fresh') || bioLower.includes('contact')) {
    score += 20
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}
