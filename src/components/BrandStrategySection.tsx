import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Compass,
  Sparkles,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

export function BrandStrategySection() {
  return (
    <section id="strategy" className="grain relative bg-ink-900 py-20 lg:py-28">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Copy */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 backdrop-blur-sm">
                <Compass className="h-3.5 w-3.5 text-gold-400" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                  AI Brand & Growth Strategy
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Your strategy shouldn't come from <br />
                <span className="text-gradient-ember">a generic template.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-4 text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
                GroWise combines your business information, audience demography, brand positioning, and live performance data to build a growth strategy tailored specifically for you.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <ul className="mt-8 space-y-3 text-sm text-ink-200">
                {[
                  'Custom brand positioning & voice guidelines',
                  'Audience segment & buyer pain-point mapping',
                  'Strategic content pillars tailored to your USPs',
                  'Quarterly campaign themes & priority initiatives',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember-500/20 text-ember-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-8">
                <Button href="#lead-form" size="lg">
                  Build My Growth Strategy
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* AI Strategy Dashboard Mockup */}
          <div className="lg:col-span-7">
            <Reveal delay={180}>
              <div className="rounded-2xl border border-white/15 bg-ink-950/95 p-6 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-8">
                {/* Dashboard Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/20 text-gold-400">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-white">AI Strategy Dashboard</h3>
                      <p className="text-xs text-ink-400">Tailored Brand & Growth Blueprint</p>
                    </div>
                  </div>
                  <span className="rounded-md bg-white/5 px-2.5 py-1 font-display text-[11px] font-semibold text-gold-400 border border-gold-400/20">
                    Live Strategy Matrix
                  </span>
                </div>

                {/* 3x3 Strategy Grid */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ember-400">01. Brand Positioning</span>
                    <p className="mt-2 font-display text-xs font-bold text-white">Premium AI Growth Solution</p>
                    <p className="mt-1 text-[11px] text-ink-300">Positioned above generic social schedulers as an active growth partner.</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">02. Target Audience</span>
                    <p className="mt-2 font-display text-xs font-bold text-white">SMB Owners & Founders</p>
                    <p className="mt-1 text-[11px] text-ink-300">Decision makers wanting growth without hiring a 10-person agency.</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">03. Content Pillars</span>
                    <p className="mt-2 font-display text-xs font-bold text-white">Education • Trust • Promo</p>
                    <p className="mt-1 text-[11px] text-ink-300">40% Educational Reels, 35% Customer Proof, 25% High-Intent Offers.</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">04. Brand Voice</span>
                    <p className="mt-2 font-display text-xs font-bold text-white">Authoritative & Empowering</p>
                    <p className="mt-1 text-[11px] text-ink-300">Direct, zero-fluff, outcome-focused communication tone.</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">05. Growth Priorities</span>
                    <p className="mt-2 font-display text-xs font-bold text-white">WhatsApp Lead Funnel</p>
                    <p className="mt-1 text-[11px] text-ink-300">Convert Reel viewers into direct WhatsApp inquiries within 2 clicks.</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">06. Ad Scaling</span>
                    <p className="mt-2 font-display text-xs font-bold text-white">Organic-to-Paid Engine</p>
                    <p className="mt-1 text-[11px] text-ink-300">Promote top 10% performing Reels to local warm audiences.</p>
                  </div>
                </div>

                {/* AI Executive Summary banner */}
                <div className="mt-6 rounded-xl border border-gold-400/30 bg-gold-400/10 p-4 flex items-start gap-3">
                  <Bot className="h-5 w-5 shrink-0 text-gold-400 mt-0.5" />
                  <div>
                    <h4 className="font-display text-xs font-bold text-gold-300">AI Strategy Directive</h4>
                    <p className="mt-1 text-xs text-paper-50 font-medium leading-relaxed">
                      "By shifting messaging from 'posting content' to 'generating WhatsApp leads', projected lead conversion is estimated to increase by 45% over the next 30 days."
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
