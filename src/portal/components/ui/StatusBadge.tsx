import { cn } from '../../../lib/cn'
import type { ContentStatus } from '../../data/types'
import { STATUS_META } from '../../lib/meta'

export function StatusBadge({
  status,
  className,
  dot = true,
}: {
  status: ContentStatus
  className?: string
  dot?: boolean
}) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
        meta.badge,
        className
      )}
    >
      {dot && <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />}
      {meta.label}
    </span>
  )
}
