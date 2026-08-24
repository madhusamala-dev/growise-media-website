import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'
import { brand, cta } from '../data/site'
import { industries } from '../data/industries'
import { useAuditModal } from '../audit/context/AuditModalContext'

export function Hero() {
  const { openAuditModal } = useAuditModal()

  return (
    <section id="home" className="grain relative overflow-hidden bg-ink-950 pb-16 pt-32 lg:pt-36">
      {/* Glow Backdrops */}
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute -top-40 right-[-10%] h-[580px] w-[580px] rounded-full opacity-50 blur-[120px] animate-glow"
        style={{ background: 'radial-gradient(circle, rgba(255,74,17,0.5), transparent 65%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-[-30%] left-[-10%] h-[500px] w-[500px] rounded-full opacity-35 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(255,212,0,0.45), transparent 65%)' }}
      />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Copy Column */}
          <div className="lg:col-span-6 xl:col-span-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-gold-400" aria-hidden />
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-paper-100">
                  {brand.positioning}
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 text-balance font-display text-[2.65rem] font-bold leading-[1.05] text-white sm:text-6xl lg:text-[4rem]">
                You run the business. <br />
                <span className="text-accent text-gradient-ember">We run your growth.</span>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-4 font-display text-xl font-bold tracking-tight text-gold-300 sm:text-2xl">
                Your AI-Powered Growth Partner
              </p>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-3 font-display text-base font-semibold text-white/90 sm:text-lg">
                From digital audit to leads, content, ads and growth — GroWise brings your entire marketing engine together.
              </p>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
                GroWise analyzes your digital presence, understands your business, builds your growth strategy, creates content, manages publishing, tracks performance, generates leads and helps you continuously improve.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button onClick={() => openAuditModal()} size="lg">
                  {cta.primary}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button href="#engine" size="lg" variant="outlineLight">
                  {cta.secondary}
                </Button>
              </div>
              <p className="mt-3 flex items-center gap-2 font-display text-xs font-medium text-ink-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {cta.badge}
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-ink-300">
                {['Digital Presence Audit', 'AI Growth Blueprint', 'WhatsApp Lead Funnel', 'AI Ad Copilot'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* AI Growth Command Center Hero Graphic */}
          <div className="relative lg:col-span-6 xl:col-span-6">
            <Reveal delay={200}>
              <div className="relative flex items-center justify-center">
                <div aria-hidden className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-ember-500/20 blur-3xl" />
                <div aria-hidden className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl" />
                <img
                  src="/hero-command-center.jpg"
                  alt="GroWise AI Growth Command Center Dashboard"
                  className="relative z-10 w-full animate-float mix-blend-screen opacity-95 filter drop-shadow-[0_20px_40px_rgba(255,74,17,0.35)] [mask-image:radial-gradient(circle_at_center,black_75%,transparent_98%)]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Industry Ticker */}
      <div className="relative mt-16 border-y border-white/10 bg-ink-900/80 py-4 backdrop-blur-md lg:mt-20">
        <div className="marquee-mask overflow-hidden" aria-hidden>
          <div className="flex w-max animate-marquee gap-8">
            {[...industries, ...industries].map((industry, i) => (
              <span
                key={`${industry}-${i}`}
                className="flex items-center gap-8 font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-300 transition-colors hover:text-white"
              >
                {industry}
                <span className="text-gold-400">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
