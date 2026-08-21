import type { ReactNode } from 'react'
import { Container } from '../ui/Container'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: ReactNode
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <section className="relative bg-ink-950 py-24 lg:py-32">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-30" />
      <Container className="relative">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-paper-50 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-ink-400">Last updated: {lastUpdated}</p>
          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-300 prose-headings:font-display prose-headings:text-paper-50 prose-headings:font-bold prose-headings:text-xl prose-headings:mt-10 prose-headings:mb-4 prose-a:text-ember-400 prose-a:underline prose-a:underline-offset-4 prose-a:hover:text-ember-300">
            {children}
          </div>
        </div>
      </Container>
    </section>
  )
}
