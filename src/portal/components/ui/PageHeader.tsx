import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-ember-400">
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance font-display text-2xl font-bold tracking-tight text-paper-50 sm:text-[1.75rem]">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-ink-400">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  )
}
