import { Container } from './ui/Container'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { reasons } from '../data/why'

export function WhyGrowise() {
  return (
    <section id="why" aria-labelledby="why-title" className="grain relative bg-ink-950 py-24 lg:py-32">
      <Container>
        <SectionHeader
          dark
          eyebrow="Target Businesses"
          title={
            <>
              Built for businesses that{' '}
              <span className="text-accent text-ember-400">want to grow.</span>
            </>
          }
          description="Built for businesses that want to grow without building a full marketing department."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 3) * 90} as="article">
              <div className="group flex h-full flex-col rounded-3xl border border-white/10 bg-ink-900 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember-500/50">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-500/10 transition-colors duration-300 group-hover:bg-ember-500">
                  <reason.icon className="h-6 w-6 text-ember-400 transition-colors duration-300 group-hover:text-white" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{reason.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-400">{reason.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
