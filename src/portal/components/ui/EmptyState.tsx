import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../../lib/cn'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-ink-900/40 text-center',
        compact ? 'px-6 py-10' : 'px-6 py-16',
        className
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-ink-800">
        <Icon className="h-6 w-6 text-ember-400" strokeWidth={1.8} aria-hidden />
      </span>
      <h3 className="mt-5 font-display text-lg font-bold text-paper-50">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
