import {
  ArrowRight,
  CheckCircle2,
  Megaphone,
  Sparkles,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

export function AdManagementSection() {
  return (
    <section className="grain relative bg-ink-900 py-20 lg:py-28">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Copy */}
          <div className="lg:col-span-6 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 backdrop-blur-sm">
                <Megaphone className="h-3.5 w-3.5 text-gold-400" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                  Organic-To-Paid Ad Scaling
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                When organic growth isn't enough, <br />
                <span className="text-gradient-ember">scale with AI ads.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
                Don't guess on ad creative. GroWise identifies organic videos that are already performing exceptionally well with your audience and automatically prepares them for high-ROI paid ad campaigns.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="grid grid-cols-2 gap-3 text-xs font-medium text-ink-200">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> AI Target Audience Selection</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Automated Creative Adaptation</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Budget Allocation Planning</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Retargeting & Lead Ads</span>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div>
                <Button href="#lead-form" size="lg">
                  Scale My Top Content With Ads
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Ad Campaign Opportunity Widget */}
          <div className="lg:col-span-6">
            <Reveal delay={180}>
              <div className="rounded-2xl border border-ember-500/40 bg-gradient-to-br from-ink-950 via-ink-900 to-ember-950/40 p-6 shadow-2xl backdrop-blur-2xl lg:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-gold-400">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-gold-300">
                      AI Campaign Opportunity
                    </span>
                  </div>
                  <span className="rounded bg-ember-500/20 px-2.5 py-1 text-[10px] font-bold text-ember-400">
                    High Opportunity Signal
                  </span>
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <p className="font-display text-sm font-bold text-white">
                    "Organic Reel #4 generated 3.2x higher engagement but reached only 12% of your addressable local market."
                  </p>
                  <p className="text-xs text-ink-300">
                    GroWise recommends launching a $5/day Meta Lead Ad campaign targeting local buyers within a 15-mile radius.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-lg bg-black/40 p-3 border border-white/5">
                    <span className="block text-[10px] text-ink-400">ESTIMATED IMPRESSIONS</span>
                    <span className="font-display font-bold text-white text-base">+24,000</span>
                  </div>
                  <div className="rounded-lg bg-black/40 p-3 border border-white/5">
                    <span className="block text-[10px] text-ink-400">ESTIMATED LEADS</span>
                    <span className="font-display font-bold text-emerald-400 text-base">35–50</span>
                  </div>
                  <div className="rounded-lg bg-black/40 p-3 border border-white/5">
                    <span className="block text-[10px] text-ink-400">TARGET CPL</span>
                    <span className="font-display font-bold text-gold-400 text-base">₹140 / Lead</span>
                  </div>
                </div>

                <button type="button" className="mt-5 w-full rounded-xl bg-ember-500 py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-ember-600">
                  Approve & Launch Paid Ad
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
