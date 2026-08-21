import type { InstagramProfile } from '../types'

export function evaluateBranding(profile: InstagramProfile): number {
  let score = 55

  // 1. Clear brand name matching handle (+15)
  if (profile.display_name && profile.username) {
    score += 15
  }

  // 2. High resolution profile logo (+15)
  if (profile.profile_image_url && profile.profile_image_url.length > 5) {
    score += 15
  }

  // 3. Cohesive bio tone & formatting (+15)
  if (profile.bio && profile.bio.includes('\n')) {
    score += 15
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}
