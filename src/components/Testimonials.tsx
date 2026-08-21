import { Quote, Tag } from 'lucide-react'
import { Container } from './ui/Container'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { testimonials, testimonialsNote } from '../data/testimonials'

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-paper-50 py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Social Proof"
          title={
            <>
              Real words, <span className="text-accent text-ember-600">when they arrive.</span>
            </>
          }
          description={testimonialsNote}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={i} delay={i * 100} as="blockquote">
              <figure className="flex h-full flex-col rounded-3xl border border-paper-300 bg-paper-100 p-8">
                <span className="flex items-center gap-2">
                  <Quote className="h-6 w-6 rotate-180 text-ember-500" aria-hidden />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-ember-500/50 bg-ember-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ember-700">
                    <Tag className="h-3 w-3" aria-hidden />
                    Placeholder
                  </span>
                </span>
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-ink-700">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-7 border-t border-paper-200 pt-5">
                  <p className="font-display text-sm font-bold text-ink-950">{item.name}</p>
                  <p className="text-sm text-ink-500">{item.business}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-500">
            GroWise doesn’t invent clients, quotes or results. Every story in this space will be
            real, attributed and shared with permission — like the rest of this site.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
