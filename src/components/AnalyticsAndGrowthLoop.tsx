import {
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Repeat,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'

export function AnalyticsAndGrowthLoop() {
  return (
    <section className="grain relative bg-ink-900 py-20 lg:py-28">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />

      <Container className="relative space-y-24">
        {/* Section 1: AI Explains the Numbers */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 backdrop-blur-sm">
                <BarChart3 className="h-3.5 w-3.5 text-gold-400" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                  AI Performance Intelligence
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Don't just publish. <br />
                <span className="text-gradient-ember">Learn what actually works.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-4 text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
                Most platforms give you overwhelming charts and raw data. GroWise goes a step further: <strong className="text-white">AI explains the numbers</strong> so you know exactly what happened, why, and what to do next.
              </p>
            </Reveal>
          </div>

          {/* AI Explanation Widget */}
          <div className="mt-12">
            <Reveal delay={180}>
              <div className="rounded-2xl border border-white/15 bg-ink-950/95 p-6 shadow-2xl backdrop-blur-2xl lg:p-8">
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember-500/20 text-ember-400">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-white">AI Insight Explainer Engine</h3>
                      <p className="text-xs text-ink-400">Natural Language Performance Analysis</p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-display text-xs font-bold text-emerald-400">
                    +42% MoM Engagement
                  </span>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  {/* 1. What Happened? */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2 text-gold-400">
                      <HelpCircle className="h-4 w-4" />
                      <h4 className="font-display text-xs font-bold uppercase tracking-wider">1. What Happened?</h4>
                    </div>
                    <p className="mt-3 font-display text-sm font-semibold text-white">
                      Reels generated 42% more engagement this month.
                    </p>
                    <p className="mt-2 text-xs text-ink-300">
                      Overall impressions grew to 48,200 (+18% higher reach) across Instagram & YouTube Shorts.
                    </p>
                  </div>

                  {/* 2. Why Did It Happen? */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2 text-sky-400">
                      <Brain className="h-4 w-4" />
                      <h4 className="font-display text-xs font-bold uppercase tracking-wider">2. Why Did It Happen?</h4>
                    </div>
                    <p className="mt-3 font-display text-sm font-semibold text-white">
                      Educational & demonstration content resonated best.
                    </p>
                    <p className="mt-2 text-xs text-ink-300">
                      Videos explaining "How to solve X problem" had a 3.4x higher watch-through rate than generic promotional posts.
                    </p>
                  </div>

                  {/* 3. What Should You Do Next? */}
                  <div className="rounded-xl border border-ember-500/30 bg-ember-500/10 p-5">
                    <div className="flex items-center gap-2 text-gold-300">
                      <Lightbulb className="h-4 w-4 text-gold-400" />
                      <h4 className="font-display text-xs font-bold uppercase tracking-wider">3. What Should You Do Next?</h4>
                    </div>
                    <p className="mt-3 font-display text-sm font-semibold text-white">
                      Increase educational content ratio next month.
                    </p>
                    <p className="mt-2 text-xs font-medium text-paper-50">
                      GroWise recommends increasing educational Reel scripts by 25% and scaling top Reel #3 into a paid ad campaign.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Section 2: Monthly Growth Review Continuous Loop */}
        <div className="rounded-2xl border border-white/10 bg-ink-950 p-8 backdrop-blur-xl lg:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                <Repeat className="h-3.5 w-3.5 text-gold-400" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-paper-100">
                  The Continuous Growth Loop
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                Every month, <br />
                <span className="text-gradient-ember">GroWise gets smarter.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-4 text-pretty text-base leading-relaxed text-ink-300">
                GroWise isn't a one-time tool. It reviews your performance monthly and feeds real audience learning back into the next growth cycle.
              </p>
            </Reveal>
          </div>

          {/* 3 Month Loop Grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                month: 'MONTH 1',
                title: 'Foundation & Baseline',
                steps: ['Audit Digital Presence', 'Build Brand Strategy', 'Deploy 30-Day Content', 'Publish & Gather Data'],
                color: 'border-white/10 bg-white/5',
              },
              {
                month: 'MONTH 2',
                title: 'Learning & Adaptation',
                steps: ['Analyze Audience Response', 'Identify Winning Hooks', 'Adjust Content Strategy', 'Launch Lead Automation'],
                color: 'border-ember-500/30 bg-ember-500/10',
              },
              {
                month: 'MONTH 3',
                title: 'Optimization & Scale',
                steps: ['Optimize High-ROI Content', 'Scale Winning Reels with Ads', 'Expand WhatsApp Funnel', 'Accelerate Revenue Growth'],
                color: 'border-gold-400/30 bg-gold-400/10',
              },
            ].map((cycle, i) => (
              <Reveal key={cycle.month} delay={180 + i * 80}>
                <div className={`flex h-full flex-col justify-between rounded-xl border p-6 backdrop-blur-md ${cycle.color}`}>
                  <div>
                    <span className="font-display text-xs font-bold text-gold-400 tracking-wider">{cycle.month}</span>
                    <h3 className="mt-2 font-display text-lg font-bold text-white">{cycle.title}</h3>
                    <ul className="mt-4 space-y-2 text-xs text-ink-300">
                      {cycle.steps.map((step) => (
                        <li key={step} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
