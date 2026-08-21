import {
  ArrowRight,
  BrainCircuit,
  Building,
  CheckCircle2,
  Compass,
  Layers,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

export function AuditModelAndOnboarding() {
  return (
    <section className="grain relative bg-ink-950 py-20 lg:py-28">
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />

      <Container className="relative">
        {/* Section 1: Two-Level Audit Model */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 backdrop-blur-sm">
              <Layers className="h-3.5 w-3.5 text-gold-400" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                The Two-Level Audit Architecture
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              From quick snapshot to <br />
              <span className="text-gradient-ember">Deep Growth Blueprint.</span>
            </h2>
          </Reveal>
        </div>

        {/* Audit Cards Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Level 1 Card */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 font-display text-xs font-bold text-white">
                    LEVEL 1
                  </span>
                  <span className="font-display text-xs font-semibold text-emerald-400">100% Free • Public Signal</span>
                </div>

                <h3 className="mt-5 font-display text-2xl font-bold text-white">Free Growth Audit</h3>
                <p className="mt-2 text-sm text-ink-300">Get a snapshot of your digital growth potential.</p>

                <ul className="mt-6 space-y-3 text-xs text-ink-200">
                  {[
                    'Public social profile analysis (Instagram, YouTube, Web)',
                    'Posting consistency & content quality observations',
                    'Basic engagement & reach signals',
                    'Overall Growth Score (0–100)',
                    'High-level quick-win recommendations',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Button href="#lead-form" variant="outlineLight" className="w-full justify-center">
                  Get Free Audit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Level 2 Card */}
          <Reveal delay={200}>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-ember-500/40 bg-gradient-to-b from-ember-500/10 via-ink-900 to-ink-950 p-8 shadow-[0_20px_60px_-15px_rgba(255,74,17,0.3)] backdrop-blur-xl">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ember-500/20 blur-3xl" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-ember-500 px-3 py-1 font-display text-xs font-bold text-white">
                    LEVEL 2 — DEEP AUDIT
                  </span>
                  <span className="font-display text-xs font-bold text-gold-400">Post-Onboarding Deep Dive</span>
                </div>

                <h3 className="mt-5 font-display text-2xl font-bold text-white">Deep AI Growth Audit</h3>
                <p className="mt-2 text-sm text-gold-200/90">Go beyond the surface. Understand your actual business.</p>

                <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-4">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-gold-300">Generates Your Growth Blueprint</span>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-ink-300">
                    <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-ember-400" /> Brand Positioning</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-ember-400" /> Content Strategy</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-ember-400" /> Audience Strategy</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-ember-400" /> Social Strategy</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-ember-400" /> Lead Generation</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-ember-400" /> Paid Advertising</span>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-ink-200">
                  {[
                    'Deep analysis of products, services, pricing & USPs',
                    'Demographic, pain-point & buying behavior mapping',
                    'Historical performance & competitor benchmarking',
                    'Conversion opportunities & WhatsApp pipeline design',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Button href="#lead-form" className="w-full justify-center">
                  Build My Growth Blueprint
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Section 2: Client Onboarding */}
        <div className="mt-24 lg:mt-32">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                <BrainCircuit className="h-3.5 w-3.5 text-gold-400" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-paper-100">
                  Intelligent Business Onboarding
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                GroWise starts by <br />
                <span className="text-gradient-ember">understanding your business.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-4 font-display text-base font-semibold text-gold-300 sm:text-lg">
                The more GroWise understands your business, the better its recommendations become.
              </p>
            </Reveal>
          </div>

          {/* Onboarding 5 Pillars Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: Building,
                title: 'Your Business',
                items: ['Business Type', 'Industry Sector', 'Location Signals', 'Current Marketing', 'Core Goals'],
              },
              {
                icon: Layers,
                title: 'Products & Services',
                items: ['Product Catalog', 'Key Services', 'Pricing Tiers', 'Unique Selling Points', 'Special Offers'],
              },
              {
                icon: Users,
                title: 'Your Audience',
                items: ['Ideal Customer Profile', 'Target Demographics', 'Customer Pain Points', 'Buying Behaviors', 'Geographies'],
              },
              {
                icon: Compass,
                title: 'Your Brand',
                items: ['Brand Personality', 'Tone of Voice', 'Visual Identity', 'Market Positioning', 'Competitors'],
              },
              {
                icon: Target,
                title: 'Your Goals',
                items: ['Brand Awareness', 'Lead Generation', 'WhatsApp Enquiries', 'Sales & Conversions', 'YouTube/IG Growth'],
              },
            ].map((pillar, idx) => (
              <Reveal key={pillar.title} delay={160 + idx * 60}>
                <div className="flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ember-500/20 text-ember-400">
                    <pillar.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-white">{pillar.title}</h3>
                  <ul className="mt-3 space-y-2 text-xs text-ink-300">
                    {pillar.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
