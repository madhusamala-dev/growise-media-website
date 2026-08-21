import { ArrowRight, Check, Quote, Sparkles } from 'lucide-react'
import { Container } from './ui/Container'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import {
  plans,
  pricingFootnote,
  pricingMessage,
  pricingNote,
  valuePillars,
  whyDifferent,
} from '../data/pricing'
import { cn } from '../lib/cn'

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="bg-paper-100 py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Pricing"
          title={
            <>
              More than content.{' '}
              <span className="text-accent text-ember-600">
                It's your AI-powered marketing engine.
              </span>
            </>
          }
          description={pricingMessage.support}
        />

        <Reveal className="mt-6">
          <blockquote className="mx-auto flex max-w-2xl items-start gap-4 text-center">
            <Quote className="mt-1 h-8 w-8 shrink-0 rotate-180 text-ember-500" aria-hidden />
            <p className="font-accent text-xl italic leading-snug text-ink-800 sm:text-2xl">
              {pricingNote}
            </p>
          </blockquote>
        </Reveal>

        {/* Pricing cards */}
        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 110} className="h-full">
              <article
                className={cn(
                  'relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-500 lg:p-10',
                  plan.featured
                    ? 'border-ember-500 bg-ink-950 text-paper-50 shadow-[0_40px_90px_-40px_rgba(255,74,17,0.55)] lg:-translate-y-3 lg:scale-[1.02]'
                    : 'border-paper-300 bg-paper-50 text-ink-950 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-30px_rgba(11,11,12,0.4)]'
                )}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-400 px-5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink-950 shadow-[0_10px_30px_-8px_rgba(255,212,0,0.7)]">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                  {plan.featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ember-500/15 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-ember-400">
                      <Sparkles className="h-3 w-3" aria-hidden />
                      Recommended
                    </span>
                  )}
                </div>
                <p className={cn('mt-1.5 text-sm', plan.featured ? 'text-ink-300' : 'text-ink-500')}>
                  {plan.tagline}
                </p>
                <p className="mt-7 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold tracking-tight">{plan.price}</span>
                  {plan.priceNote && (
                    <span className={cn('text-sm font-medium', plan.featured ? 'text-ink-400' : 'text-ink-500')}>
                      {plan.priceNote}
                    </span>
                  )}
                </p>
                {plan.featured ? (
                  <div className="mt-8 flex-1 border-t border-white/10 pt-7">
                    {plan.valueStatement && (
                      <div className="mb-5 rounded-2xl border border-gold-400/25 bg-gold-400/10 p-4">
                        <p className="flex items-start gap-2.5 font-display text-[15px] font-bold leading-snug text-gold-300">
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                          {plan.valueStatement.title}
                        </p>
                        <p className="mt-1.5 pl-7 text-[13px] leading-relaxed text-ink-300">
                          {plan.valueStatement.support}
                        </p>
                      </div>
                    )}

                    {plan.heroFeature && (
                      <p className="flex items-start gap-3 rounded-xl bg-gold-400/10 px-3 py-2 text-[15px] font-semibold text-gold-300">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                        {plan.heroFeature}
                      </p>
                    )}

                    {plan.featureGroups && (
                      <div className="mt-5 space-y-5">
                        <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400">
                          AI Marketing Workflow
                        </p>
                        {plan.featureGroups.map((group) => (
                          <div key={group.label}>
                            <p className="flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink-400">
                              <span aria-hidden className="h-px w-4 bg-white/15" />
                              {group.label}
                            </p>
                            <ul className="mt-2.5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                              {group.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-[15px]">
                                  <Check
                                    className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                                    aria-hidden
                                  />
                                  <span className="text-paper-100/90">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {plan.whyCard && (
                      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="font-display text-sm font-bold text-white">{plan.whyCard.title}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-300">{plan.whyCard.text}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <ul className="mt-8 flex-1 space-y-3 border-t border-paper-200 pt-7">
                    {plan.features?.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[15px]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember-600" aria-hidden />
                        <span className="text-ink-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {plan.ctaMicroMessage && (
                  <p className="mt-8 text-center text-[13px] italic leading-relaxed text-ink-300">
                    {plan.ctaMicroMessage}
                  </p>
                )}
                <Button
                  href="#lead-form"
                  variant={plan.featured ? 'primary' : 'outline'}
                  size="lg"
                  className={cn(
                    'w-full',
                    plan.featured
                      ? 'mt-3 px-6 text-[15px] shadow-[0_18px_45px_-12px_rgba(255,74,17,0.8)]'
                      : 'mt-9'
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
                {plan.footnote && (
                  <p className="mt-4 text-center text-xs italic text-ink-400">
                    {plan.footnote}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* Why GroWise is different */}
        <Reveal className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-ember-600">
              <span aria-hidden className="h-px w-6 bg-ember-500" />
              Value
              <span aria-hidden className="h-px w-6 bg-ember-500" />
            </p>
            <h3 className="mt-4 text-balance font-display text-3xl font-bold leading-[1.1] text-ink-950 sm:text-4xl">
              {whyDifferent.title}
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-500 sm:text-lg">
              {whyDifferent.intro}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valuePillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={(i % 3) * 90} as="article">
              <div className="group flex h-full flex-col rounded-3xl border border-paper-300 bg-paper-50 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember-500/60 hover:shadow-[0_24px_50px_-28px_rgba(11,11,12,0.35)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-500/10 transition-colors duration-300 group-hover:bg-ember-500">
                  <pillar.icon className="h-6 w-6 text-ember-600 transition-colors duration-300 group-hover:text-white" aria-hidden />
                </span>
                <h4 className="mt-5 font-display text-lg font-bold leading-snug text-ink-950">
                  {pillar.title}
                </h4>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="mx-auto max-w-xl text-[15px] text-ink-600">{pricingFootnote}</p>
        </Reveal>
      </Container>
    </section>
  )
}
