/**
 * Format large numbers compactly: 1234 → "1.2K", 1234567 → "1.23M"
 */
export function formatCompact(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return '—'
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return v >= 10 ? `${Math.round(v)}M` : `${v.toFixed(2).replace(/\.?0+$/, '')}M`
  }
  if (n >= 1_000) {
    const v = n / 1_000
    return v >= 100 ? `${Math.round(v)}K` : `${v.toFixed(1).replace(/\.?0+$/, '')}K`
  }
  return Number.isInteger(n) ? n.toString() : n.toFixed(1)
}

/**
 * Format a percentage: 7.96 → "7.96%"
 */
export function formatPercent(n: number | null | undefined, decimals = 2): string {
  if (n == null || !isFinite(n)) return '—'
  return `${n.toFixed(decimals)}%`
}

/**
 * Format date to "Aug 19, 2026"
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Format date range: "Jul 24 — Aug 23, 2026"
 */
export function formatDateRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return '—'
  const sStr = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const eStr = e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${sStr} — ${eStr}`
}

/**
 * Get score label from numeric score
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'EXCELLENT'
  if (score >= 75) return 'GOOD'
  if (score >= 60) return 'NEEDS IMPROVEMENT'
  return 'POOR'
}

/**
 * Get color class for score label
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-rose-400'
}

/**
 * Get score ring color gradient
 */
export function getScoreRingGradient(score: number): string {
  if (score >= 80) return 'from-emerald-500 to-emerald-400'
  if (score >= 60) return 'from-amber-500 to-amber-400'
  if (score >= 40) return 'from-orange-500 to-orange-400'
  return 'from-rose-500 to-rose-400'
}
