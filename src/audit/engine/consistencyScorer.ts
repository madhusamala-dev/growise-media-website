import type { InstagramMedia } from '../types'

export function evaluateConsistency(media: InstagramMedia[]): number {
  if (!media || media.length === 0) return 40

  const sorted = [...media].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  )

  const newestDate = new Date(sorted[0].published_at)
  const oldestDate = new Date(sorted[sorted.length - 1].published_at)
  const daySpan = Math.max(1, (newestDate.getTime() - oldestDate.getTime()) / 86400000)

  const postsPerWeek = (media.length / daySpan) * 7

  let score = 40

  if (postsPerWeek >= 4) {
    score += 45
  } else if (postsPerWeek >= 2.5) {
    score += 35
  } else if (postsPerWeek >= 1) {
    score += 20
  } else {
    score += 5
  }

  // Check for large gaps (> 10 days)
  let maxGapDays = 0
  for (let i = 0; i < sorted.length - 1; i++) {
    const d1 = new Date(sorted[i].published_at).getTime()
    const d2 = new Date(sorted[i + 1].published_at).getTime()
    const gap = (d1 - d2) / 86400000
    if (gap > maxGapDays) maxGapDays = gap
  }

  if (maxGapDays > 14) {
    score -= 15
  } else if (maxGapDays <= 5) {
    score += 10
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}
