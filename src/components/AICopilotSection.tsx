import { useState } from 'react'
import {
  ArrowRight,
  Bot,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'
import { cn } from '../lib/cn'

export function AICopilotSection() {
  const samplePrompts = [
    {
      q: 'What should we post next week?',
      a: 'GroWise recommends 3 Educational Reels highlighting your core product USPs, plus 1 direct WhatsApp lead offer scheduled for Thursday at 6 PM when your audience engagement peaks.',
    },
    {
      q: 'Why aren’t we getting enough leads?',
      a: 'Your Reel views are strong (+42%), but your bio link was missing a direct WhatsApp call-to-action button. GroWise auto-generated a high-converting link tree with instant chat trigger.',
    },
    {
      q: 'Which content performed best this month?',
      a: 'Reel #4 ("How to solve X problem") generated 3.2x higher engagement and 14 direct WhatsApp inquiries. GroWise recommends scaling it into a paid ad campaign.',
    },
    {
      q: 'What should we promote with ads?',
      a: 'Scale Reel #4 into a $5/day Meta Lead Ad campaign targeting warm local business owners aged 28–50 within a 15-mile radius.',
    },
    {
      q: 'What should we change next month?',
      a: 'Shift content allocation from 30% to 50% Educational Reels, as educational content delivered an 84% higher lead conversion rate than brand announcements.',
    },
  ]

  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <section className="grain relative bg-ink-900 py-20 lg:py-28">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 backdrop-blur-sm">
              <Bot className="h-3.5 w-3.5 text-gold-400" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                AI Strategic Growth Assistant
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Your marketing team gets <br />
              <span className="text-gradient-ember">an AI Growth Copilot.</span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-4 text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
              Ask real business questions and get intelligent, actionable growth answers powered by your live analytics, strategy, and audience data.
            </p>
          </Reveal>
        </div>

        {/* Interactive Q&A Console */}
        <div className="mt-12">
          <Reveal delay={180}>
            <div className="rounded-2xl border border-white/15 bg-ink-950/95 p-6 shadow-2xl backdrop-blur-2xl lg:p-8">
              <div className="grid gap-6 lg:grid-cols-12">
                {/* Prompt List */}
                <div className="lg:col-span-5 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-400 block mb-3">
                    Click a question to ask AI Copilot:
                  </span>
                  {samplePrompts.map((item, idx) => (
                    <button
                      key={item.q}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={cn(
                        'w-full text-left rounded-xl p-3.5 text-xs font-medium transition-all duration-300 flex items-center justify-between border',
                        activeIdx === idx
                          ? 'border-ember-500 bg-ember-500/20 text-white font-bold'
                          : 'border-white/10 bg-white/5 text-ink-300 hover:border-white/20 hover:text-white'
                      )}
                    >
                      <span>{item.q}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-ember-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>

                {/* Copilot Answer Display */}
                <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-white/10 bg-black/40 p-6">
                  <div>
                    <div className="flex items-center gap-2 text-gold-400 border-b border-white/10 pb-3">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span className="font-display text-xs font-bold uppercase tracking-wider text-gold-300">
                        AI Growth Copilot Direct Answer
                      </span>
                    </div>

                    <div className="mt-4 space-y-4 font-sans">
                      <div className="rounded-lg bg-white/5 p-3 text-xs text-ink-200 border border-white/5 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-ink-400 shrink-0" />
                        <span className="font-semibold text-white">"{samplePrompts[activeIdx].q}"</span>
                      </div>

                      <div className="rounded-xl border border-ember-500/30 bg-ember-500/10 p-4 text-xs text-paper-50 leading-relaxed font-medium">
                        {samplePrompts[activeIdx].a}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-ink-400">Context: Connected IG + YT + WhatsApp Leads</span>
                    <Button href="#lead-form" size="sm">
                      Try Free Audit
                      <ArrowRight className="h-3.5 w-3.5" />
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
