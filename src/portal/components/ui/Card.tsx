import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Adds the subtle ember top glow. */
  glow?: boolean
  hover?: boolean
}

export function Card({ children, className, glow = false, hover = false, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-ink-850/80',
        glow && 'card-glow',
        hover &&
          'transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        <h3 className="font-display text-base font-bold text-paper-50">{title}</h3>
        {subtitle && <p className="mt-1 text-[13px] text-ink-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
