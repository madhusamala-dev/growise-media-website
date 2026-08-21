import { Container } from './ui/Container'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { steps } from '../data/steps'

export function HowItWorks() {
  return (
    <section id="process" aria-labelledby="process-title" className="grain relative bg-ink-950 py-24 lg:py-32">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <Container className="relative">
        <SectionHeader
          dark
          eyebrow="How It Works"
          title={
            <>
              From “guessing what to post” to{' '}
              <span className="text-accent text-ember-400">“predictable growth.”</span>
            </>
          }
          description="Five steps. From your free audit to automated leads and continuous scaling."
        />

        <div className="relative mt-16">
          {/* connector line (desktop) */}
          <div
            aria-hidden
            className="absolute left-[10%] right-[10%] top-7 hidden border-t border-dashed border-white/15 lg:block"
          />
          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 100} className="relative">
              <div className="relative z-10 flex flex-col items-start lg:items-center lg:text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ember-500/40 bg-ink-900 font-display text-lg font-bold text-ember-400 shadow-[0_0_0_6px_rgba(255,74,17,0.08)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <step.icon className="h-5 w-5 text-gold-400" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-white">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{step.description}</p>
              </div>
            </Reveal>
          ))}
          </ol>
        </div>

        <Reveal className="mt-14 text-center">
          <p className="font-accent text-lg italic text-paper-100/80">
            Your AI Growth Partner handles the strategy, content, leads, and scaling while you focus on running your business.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
