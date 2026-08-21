import { ArrowDown, ArrowRight, Check, UserRound, Zap } from 'lucide-react'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { SectionHeader } from './ui/SectionHeader'

const beforeLoad = [
  'Business operations',
  'Marketing',
  'Content creation',
  'Editing',
  'Posting',
  'Social media',
]

export function Solution() {
  return (
    <section id="solution" aria-labelledby="solution-title" className="bg-paper-100 py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="The Solution"
          title={
            <>
              Give us your business.{' '}
              <span className="text-accent text-ember-600">We’ll handle the content.</span>
            </>
          }
          description="One small change in how you spend your time: you keep doing what only you can do — and the content just keeps showing up."
        />

        <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          {/* BEFORE */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-paper-300 bg-paper-50 p-8 lg:p-10">
              <span className="inline-flex w-fit items-center rounded-full bg-ink-950 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                Before
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-ink-950">
                The business owner today
              </h3>
              <p className="mt-2 text-sm text-ink-500">
                Runs everything. Creates everything. Posts everything. At 11 pm.
              </p>
              <ul className="mt-7 space-y-2.5">
                {beforeLoad.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between rounded-xl border border-paper-200 bg-paper-100 px-4 py-3 text-[15px] font-medium text-ink-600"
                  >
                    {item}
                    <span aria-hidden className="text-ink-300">+</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Arrow */}
          <div className="flex items-center justify-center lg:flex-col">
            <Reveal delay={150}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ember-500 text-white shadow-[0_12px_30px_-10px_rgba(255,74,17,0.7)]">
                <ArrowRight className="hidden h-6 w-6 lg:block" aria-hidden />
                <ArrowDown className="h-6 w-6 lg:hidden" aria-hidden />
              </span>
            </Reveal>
          </div>

          {/* AFTER */}
          <div className="flex h-full flex-col gap-5">
            <Reveal delay={100}>
              <div className="flex h-full flex-col rounded-3xl bg-ink-950 p-8 lg:p-10">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  <UserRound className="h-3.5 w-3.5 text-gold-400" aria-hidden />
                  After — you
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-white">Runs the business</h3>
                <p className="mt-2 text-sm text-ink-400">
                  Back on the floor, with your customers — and a brand that stays visible.
                </p>
                <ul className="mt-7 space-y-2.5">
                  <li className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-[15px] text-paper-100">
                    <Check className="h-4 w-4 text-gold-400" aria-hidden />
                    Your full attention, where it pays
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex h-full flex-col rounded-3xl bg-ember-500 p-8 lg:p-10">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ink-950/15 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink-950">
                  <Zap className="h-3.5 w-3.5 text-ink-950" aria-hidden />
                  After — GroWise
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-ink-950">
                  Plans · Creates · Manages the content
                </h3>
                <ul className="mt-7 space-y-2.5">
                  {['Ideas, hooks and scripts', 'AI-powered video production', 'Captions, posting & consistency'].map((item) => (
                    <li key={item} className="flex items-center gap-3 rounded-xl bg-ink-950/10 px-4 py-3 text-[15px] font-medium text-ink-950">
                      <Check className="h-4 w-4 shrink-0" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
