import type { InstagramMedia } from '../types'

export function evaluateReels(media: InstagramMedia[]): number {
  if (!media || media.length === 0) return 40

  const reels = media.filter((m) => m.media_type === 'REEL')
  if (reels.length === 0) return 35 // Low score if zero Reels

  let score = 40

  // 1. Reel Ratio (+25)
  const reelRatio = reels.length / media.length
  if (reelRatio >= 0.4) {
    score += 25
  } else if (reelRatio >= 0.25) {
    score += 18
  } else if (reelRatio >= 0.1) {
    score += 10
  }

  // 2. Average Reel Views (+20)
  const totalViews = reels.reduce((acc, r) => acc + (r.view_count || 0), 0)
  const avgViews = totalViews / reels.length

  if (avgViews >= 20000) {
    score += 20
  } else if (avgViews >= 5000) {
    score += 15
  } else if (avgViews >= 1000) {
    score += 10
  }

  // 3. Reel Engagement (+15)
  const totalEng = reels.reduce((acc, r) => acc + r.like_count + r.comment_count, 0)
  const avgEng = totalEng / reels.length
  if (avgEng >= 500) {
    score += 15
  } else if (avgEng >= 100) {
    score += 10
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}
