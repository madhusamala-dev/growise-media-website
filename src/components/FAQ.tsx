import { ArrowRight, ChevronDown, MessageCircleQuestion } from 'lucide-react'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { faqs } from '../data/faq'
import { contact, whatsappHref } from '../data/site'

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-paper-100 py-24 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* Sticky intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="mb-4 flex items-center gap-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-ember-600">
                <span aria-hidden className="h-px w-6 bg-ember-500" />
                FAQ
              </p>
              <h2 id="faq-title" className="text-balance font-display text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl">
                Questions? <span className="text-accent text-ember-600">We’ve got answers.</span>
              </h2>
              <p className="mt-5 text-pretty text-base leading-relaxed text-ink-500">
                Everything business owners usually ask before starting. If yours isn’t here, just
                ask us directly.
              </p>
              <div className="mt-8 rounded-3xl border border-paper-300 bg-paper-50 p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember-500/10">
                    <MessageCircleQuestion className="h-5 w-5 text-ember-600" aria-hidden />
                  </span>
                  <h3 className="font-display text-base font-bold text-ink-950">
                    Still not sure?
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Tell us what you sell — we’ll show you what we can create.{' '}
                  {contact.whatsappNumber && (
                    <>
                      Or message us directly on WhatsApp at{' '}
                      <a
                        href={whatsappHref('Hi GroWise! I have a question about your services.')}
                        className="font-semibold text-ember-600 underline underline-offset-4 hover:text-ember-700"
                      >
                        {contact.whatsappDisplay}
                      </a>
                      .
                    </>
                  )}
                </p>
                <Button href="#contact" variant="outline" className="mt-5">
                  Talk to GroWise
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Accordion */}
          <div className="space-y-3.5">
            {faqs.map((item, i) => (
              <Reveal key={item.question} delay={Math.min(i * 40, 240)}>
                <details className="group rounded-2xl border border-paper-300 bg-paper-50 transition-colors duration-300 open:border-ember-500/50 open:shadow-[0_18px_40px_-28px_rgba(255,74,17,0.35)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-base font-semibold text-ink-950">
                      {item.question}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper-300 text-ink-500 transition-all duration-300 group-open:rotate-180 group-open:border-ember-500 group-open:bg-ember-500 group-open:text-white">
                      <ChevronDown className="h-4 w-4" aria-hidden />
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink-600">
                    {item.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
