/**
 * Guards against a Reel appearing in both the "Top Performing" and the
 * "Lower Performing" section.
 *
 * Older reports were built by slicing the best 5 and the worst 5 out of the
 * same pool, so an account with 10 Reels or fewer ended up with the same Reels
 * on both sides. The edge function now splits a single ranking, but reports
 * cached in localStorage still carry the overlapping lists — this normalises
 * them at render time.
 */

import type { RankedReel } from '../types/level2'

export function splitReelPerformers(
  best: RankedReel[],
  worst: RankedReel[],
  limit = 5,
): { best: RankedReel[]; worst: RankedReel[] } {
  const worstIds = new Set(worst.map((r) => r.mediaId))
  const overlaps = best.some((r) => worstIds.has(r.mediaId))
  if (!overlaps) return { best, worst }

  // Both lists are slices of the same ranking, so `best` followed by `worst`
  // reversed rebuilds the full best-to-worst order once duplicates are dropped.
  const seen = new Set<string>()
  const descending: RankedReel[] = []
  for (const reel of [...best, ...[...worst].reverse()]) {
    if (seen.has(reel.mediaId)) continue
    seen.add(reel.mediaId)
    descending.push(reel)
  }

  const n = descending.length
  if (n === 1) return { best: withRanks(descending), worst: [] }

  const half = Math.min(limit, Math.floor(n / 2))
  return {
    best: withRanks(descending.slice(0, half)),
    worst: withRanks(descending.slice(n - half).reverse()),
  }
}

function withRanks(reels: RankedReel[]): RankedReel[] {
  return reels.map((reel, i) => ({ ...reel, rank: i + 1 }))
}
