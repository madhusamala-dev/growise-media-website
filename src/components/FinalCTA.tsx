import { ArrowRight, MessageCircle } from 'lucide-react'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { cta, whatsappHref, contact } from '../data/site'
import { useAuditModal } from '../audit/context/AuditModalContext'

export function FinalCTA() {
  const { openAuditModal } = useAuditModal()
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="grain relative overflow-hidden bg-ink-950 py-28 lg:py-36">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[-20%] h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(255,74,17,0.6), transparent 60%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-[-30%] right-[-5%] h-[420px] w-[420px] rounded-full opacity-30 blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(255,212,0,0.5), transparent 60%)' }}
      />

      <Container className="relative text-center">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400 backdrop-blur-sm">
            Free Level 1 AI Digital Audit • No Credit Card Required
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2
            id="final-cta-title"
            className="mx-auto mt-7 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.05] text-paper-50 sm:text-5xl lg:text-6xl"
          >
            Ready to turn your marketing <br />
            <span className="text-accent text-gradient-ember">into a growth engine?</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-ink-300">
            Stop guessing. Start growing with GroWise. Get your free AI-powered digital presence audit in under 60 seconds.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button onClick={() => openAuditModal('madhusamala_')} size="lg">
              {cta.finalPrimary}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              href={whatsappHref('Hi GroWise! I want to audit my business growth potential. Can we talk?')}
              size="lg"
              variant="outlineLight"
            >
              {contact.whatsappNumber && <MessageCircle className="h-5 w-5 text-gold-400" aria-hidden />}
              {cta.finalSecondary}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
