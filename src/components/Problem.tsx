import { BriefcaseBusiness, CircleHelp, Check } from 'lucide-react'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { brand } from '../data/site'

const runningBusiness = [
  'Customers',
  'Orders',
  'Employees',
  'Production',
  'Suppliers',
  'Sales',
  'Operations',
]

const contentWorries = [
  'What should I post?',
  'Who will shoot it?',
  'Who will edit it?',
  'What caption should I write?',
  'When should I post?',
  'Why is nobody engaging?',
]

export function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="relative bg-ink-950 py-24 lg:py-32">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <Container className="relative">
        <Reveal>
          <p className="mb-4 flex items-center gap-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-ember-400">
            <span aria-hidden className="h-px w-6 bg-ember-500" />
            The Problem
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            id="problem-title"
            className="max-w-3xl text-balance font-display text-3xl font-bold leading-[1.08] text-paper-50 sm:text-4xl lg:text-5xl"
          >
            You have a business to run. You shouldn’t have to become a{' '}
            <span className="text-accent text-ember-400">content creator</span> too.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Running the business */}
          <Reveal delay={120}>
            <div className="h-full rounded-3xl border border-white/10 bg-ink-900 p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                  <BriefcaseBusiness className="h-5 w-5 text-gold-400" aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Running the business
                </h3>
              </div>
              <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3.5">
                {runningBusiness.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[15px] text-ink-300">
                    <Check className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Content worries */}
          <Reveal delay={220}>
            <div className="h-full rounded-3xl border border-ember-500/30 bg-ember-500/[0.06] p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember-500/15">
                  <CircleHelp className="h-5 w-5 text-ember-400" aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  And then there’s the content
                </h3>
              </div>
              <ul className="mt-7 space-y-3.5">
                {contentWorries.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-ink-200">
                    <span aria-hidden className="text-ember-400">?</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <div className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-r from-ink-900 to-ink-850 p-8 text-center lg:p-12">
            <p className="font-display text-2xl font-bold text-paper-50 sm:text-3xl lg:text-4xl">
              That’s where {brand.name} comes in.
            </p>
            <p className="mt-3 font-accent text-xl italic text-ember-400 sm:text-2xl">
              We handle the content. You handle the business.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
