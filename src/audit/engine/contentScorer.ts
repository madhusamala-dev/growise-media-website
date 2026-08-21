import type { InstagramMedia } from '../types'

export function evaluateContent(media: InstagramMedia[]): number {
  if (!media || media.length === 0) return 40

  let score = 50

  // 1. Post Volume Analyzed (+15)
  if (media.length >= 15) {
    score += 15
  } else if (media.length >= 8) {
    score += 10
  }

  // 2. Educational & Value Content Presence (+15)
  const eduCount = media.filter((m) => m.content_category === 'EDUCATIONAL' || m.content_category === 'AUTHORITY').length
  const eduRatio = eduCount / media.length
  if (eduRatio >= 0.25) {
    score += 15
  } else if (eduRatio >= 0.1) {
    score += 8
  }

  // 3. Carousel Usage (+10)
  const carouselCount = media.filter((m) => m.media_type === 'CAROUSEL').length
  if (carouselCount >= 2) {
    score += 10
  }

  // 4. Over-promotion penalty (Excessive promotional pitch > 50% = -15)
  const promoCount = media.filter((m) => m.content_category === 'PROMOTIONAL').length
  const promoRatio = promoCount / media.length
  if (promoRatio > 0.5) {
    score -= 15
  } else {
    score += 10
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}
