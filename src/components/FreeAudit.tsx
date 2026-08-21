import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  LineChart,
  Search,
  Sparkles,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'
import { useAuditModal } from '../audit/context/AuditModalContext'

export function FreeAudit() {
  const { openAuditModal } = useAuditModal()
  return (
    <section id="audit" className="grain relative bg-ink-900 py-20 lg:py-28">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />

      <Container className="relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-4 py-1.5 backdrop-blur-sm">
              <Search className="h-3.5 w-3.5 text-ember-400" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ember-300">
                Level 1 — Free AI Growth Audit
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Before you grow, <br />
              <span className="text-gradient-ember">understand where you stand.</span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-4 text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
              GroWise gives businesses a free AI-powered digital presence audit before they commit to anything. We analyze your public profile signals across platforms to uncover your exact growth potential.
            </p>
          </Reveal>
        </div>

        {/* Audit Dashboard Visual */}
        <div className="mt-14 lg:mt-16">
          <Reveal delay={200}>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-ink-950/90 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
              {/* Dashboard Topbar */}
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-white/[0.03] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember-500/20 text-ember-400">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">Live AI Growth Audit Report</h3>
                    <p className="text-xs text-ink-400">Analyzed Domain & Social Signals</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <span className="rounded-full bg-white/5 px-3 py-1 font-display text-xs text-ink-300 border border-white/10">
                    Public Audit Engine
                  </span>
                  <Button onClick={() => openAuditModal('madhusamala_')} size="sm">
                    Run My Free Audit
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Main Dashboard Content */}
              <div className="grid gap-6 p-6 lg:grid-cols-12 lg:p-8">
                {/* Left: Overall Score Dial + Channel Breakdown */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Overall Score */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-ink-900/90 to-ink-950 p-6 shadow-[0_15px_40px_-15px_rgba(255,74,17,0.25)] backdrop-blur-xl">
                    <div aria-hidden className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-ember-500/20 blur-3xl" />
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-ink-300">
                        Overall Digital Growth Score
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        GOOD POTENTIAL
                      </span>
                    </div>

                    {/* Main Score Row */}
                    <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
                      {/* Circular Progress Ring */}
                      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-white/10"
                            fill="transparent"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="url(#score-gradient)"
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 42}
                            strokeDashoffset={2 * Math.PI * 42 * (1 - 0.78)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                          <defs>
                            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ff4a11" />
                              <stop offset="100%" stopColor="#ffd400" />
                            </linearGradient>
                          </defs>
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="font-display text-3xl font-extrabold text-white">78</span>
                          <span className="text-[10px] font-semibold text-ink-400">/ 100</span>
                        </div>
                      </div>

                      {/* Sub-Metrics Pills */}
                      <div className="w-full space-y-2 text-xs">
                        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                          <span className="text-ink-300">Profile Optimization</span>
                          <span className="font-display font-bold text-white">84%</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                          <span className="text-ink-300">Posting Consistency</span>
                          <span className="font-display font-bold text-gold-400">72%</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                          <span className="text-ink-300">Conversion Architecture</span>
                          <span className="font-display font-bold text-emerald-400">79%</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-ink-300 text-center sm:text-left">
                      Based on profile optimization, posting consistency, engagement rate & conversion architecture signals.
                    </p>
                  </div>

                  {/* Individual Scores Bar */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">Category Breakdown</h4>

                    {[
                      { label: 'Instagram Profile', score: 82, color: 'bg-pink-500' },
                      { label: 'YouTube Presence', score: 68, color: 'bg-red-500' },
                      { label: 'Content Quality', score: 88, color: 'bg-emerald-500' },
                      { label: 'Brand Positioning', score: 76, color: 'bg-amber-500' },
                      { label: 'Engagement Signal', score: 71, color: 'bg-indigo-500' },
                      { label: 'Discoverability', score: 65, color: 'bg-purple-500' },
                      { label: 'Conversion Setup', score: 79, color: 'bg-ember-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-ink-300">{item.label}</span>
                          <span className="font-bold text-white">{item.score}/100</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: AI Insights (3 Key Columns) */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gold-300">
                    AI Growth Diagnosis & Recommendations
                  </h4>

                  {/* What you're doing well */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <h5 className="font-display text-sm font-bold text-white">What You're Doing Well</h5>
                    </div>
                    <ul className="mt-3.5 space-y-3">
                      <li className="relative pl-5 text-xs font-medium leading-relaxed text-white/90">
                        <span className="absolute left-0 top-[0.42em] h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span>Strong visual identity and consistent color theme across recent Instagram Reels.</span>
                      </li>
                      <li className="relative pl-5 text-xs font-medium leading-relaxed text-white/90">
                        <span className="absolute left-0 top-[0.42em] h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span>High audience retention on product demonstration videos (top 20th percentile).</span>
                      </li>
                    </ul>
                  </div>

                  {/* What's holding you back */}
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
                    <div className="flex items-center gap-2 text-amber-400">
                      <AlertTriangle className="h-5 w-5" />
                      <h5 className="font-display text-sm font-bold text-white">What's Holding You Back</h5>
                    </div>
                    <ul className="mt-3.5 space-y-3">
                      <li className="relative pl-5 text-xs font-medium leading-relaxed text-white/90">
                        <span className="absolute left-0 top-[0.42em] h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        <span>Irregular posting cadence (gaps of 6–10 days lower algorithm recommendation authority).</span>
                      </li>
                      <li className="relative pl-5 text-xs font-medium leading-relaxed text-white/90">
                        <span className="absolute left-0 top-[0.42em] h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        <span>Weak call-to-action (CTA) structure in video hooks — losing ~65% of potential lead clicks.</span>
                      </li>
                    </ul>
                  </div>

                  {/* What you should do next */}
                  <div className="rounded-xl border border-gold-400/40 bg-gold-400/10 p-5">
                    <div className="flex items-center gap-2 text-gold-400">
                      <Sparkles className="h-5 w-5 text-gold-400" />
                      <h5 className="font-display text-sm font-bold text-gold-300">What You Should Do Next</h5>
                    </div>
                    <ul className="mt-3.5 space-y-3">
                      <li className="relative pl-5 text-xs font-medium leading-relaxed text-paper-50">
                        <span className="absolute left-0 top-[0.42em] h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(255,212,0,0.9)]" />
                        <span>Deploy a structured 30-day content calendar targeting educational & trust pillars.</span>
                      </li>
                      <li className="relative pl-5 text-xs font-medium leading-relaxed text-paper-50">
                        <span className="absolute left-0 top-[0.42em] h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(255,212,0,0.9)]" />
                        <span>Connect an automated WhatsApp lead capture funnel to your bio link & story CTAs.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Audit CTA banner */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-xs font-semibold text-white">Want to see your business audit score?</p>
                      <p className="text-[11px] text-ink-300">Takes under 60 seconds • 100% Free</p>
                    </div>
                    <Button onClick={() => openAuditModal('madhusamala_')} size="sm">
                      Run My Free Audit
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
