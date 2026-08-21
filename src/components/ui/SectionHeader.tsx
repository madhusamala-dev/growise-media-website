import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Container } from './Container'
import { Reveal } from './Reveal'

interface SectionHeaderProps {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  dark?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  dark = false,
  className,
}: SectionHeaderProps) {
  return (
    <Container
      narrow={align === 'center'}
      className={cn(align === 'center' && 'text-center', className)}
    >
      <Reveal>
        <p
          className={cn(
            'mb-4 flex items-center gap-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.28em]',
            align === 'center' && 'justify-center',
            dark ? 'text-ember-400' : 'text-ember-600'
          )}
        >
          <span aria-hidden className="h-px w-6 bg-ember-500" />
          {eyebrow}
          {align === 'center' && <span aria-hidden className="h-px w-6 bg-ember-500" />}
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h2
          className={cn(
            'text-balance font-display text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl',
            dark ? 'text-paper-50' : 'text-ink-950'
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={160}>
          <p
            className={cn(
              'mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg',
              dark ? 'text-ink-300' : 'text-ink-500',
              align === 'left' && 'mx-0'
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </Container>
  )
}
