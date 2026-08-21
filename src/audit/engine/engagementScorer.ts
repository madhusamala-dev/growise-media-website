import type { InstagramMedia, InstagramProfile } from '../types'

export function evaluateEngagement(profile: InstagramProfile, media: InstagramMedia[]): number {
  if (!media || media.length === 0 || profile.followers_count === 0) return 50

  const totalLikes = media.reduce((sum, item) => sum + item.like_count, 0)
  const totalComments = media.reduce((sum, item) => sum + item.comment_count, 0)

  const avgEngagementPerPost = (totalLikes + totalComments) / media.length
  const estimatedRate = (avgEngagementPerPost / profile.followers_count) * 100

  let score = 40

  if (estimatedRate >= 5.0) {
    score = 92
  } else if (estimatedRate >= 3.0) {
    score = 82
  } else if (estimatedRate >= 2.0) {
    score = 74
  } else if (estimatedRate >= 1.0) {
    score = 62
  } else if (estimatedRate >= 0.5) {
    score = 50
  } else {
    score = 38
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}
