/** 12400 → "12.4K", 1_250_000 → "1.3M" */
export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** ISO string → "Mon, 12 Aug". */
export function formatDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** ISO string or Date → "12 Aug". */
export function formatDay(date: string | Date): string {
  const d = date instanceof Date ? date : new Date(date)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** ISO string → "12 Aug, 2026". */
export function formatFull(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
}

export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`
}

export function weekdayLabel(index: number): string {
  return WEEKDAYS[index]
}

/** Greeting based on local time. */
export function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
