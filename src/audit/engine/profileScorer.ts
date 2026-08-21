import type { InstagramProfile } from '../types'

export function evaluateProfile(profile: InstagramProfile): number {
  let score = 50 // Base score

  // 1. Profile Picture (+10)
  if (profile.profile_image_url && profile.profile_image_url.length > 5) {
    score += 10
  }

  // 2. Name Field Optimization (+10 if includes search keywords or '|' or '-')
  if (profile.display_name && (profile.display_name.includes('|') || profile.display_name.includes('-') || profile.display_name.length > 15)) {
    score += 10
  } else if (profile.display_name) {
    score += 5
  }

  // 3. Bio Length & Benefit (+15)
  if (profile.bio && profile.bio.length >= 40) {
    score += 15
  } else if (profile.bio && profile.bio.length >= 20) {
    score += 8
  }

  // 4. Call-to-Action in Bio (+10)
  const bioLower = profile.bio ? profile.bio.toLowerCase() : ''
  if (bioLower.includes('book') || bioLower.includes('dm') || bioLower.includes('visit') || bioLower.includes('shop') || bioLower.includes('👇') || bioLower.includes('link')) {
    score += 10
  }

  // 5. Website URL (+15)
  if (profile.website_url && profile.website_url.length > 5) {
    score += 15
  }

  // 6. Business or Creator Account (+10)
  if (profile.is_business_account || profile.is_creator_account) {
    score += 10
  }

  // 7. Category (+10)
  if (profile.category && profile.category.length > 2) {
    score += 10
  }

  // Clamp 0-100
  return Math.min(100, Math.max(0, Math.round(score)))
}
