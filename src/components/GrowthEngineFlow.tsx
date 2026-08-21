import {
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Compass,
  Layers,
  Megaphone,
  MessageSquare,
  Repeat,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'

export function GrowthEngineFlow() {
  const steps = [
    { num: '01', title: 'Discover', desc: 'Free Level 1 Growth Audit', icon: Search },
    { num: '02', title: 'Understand', desc: 'Business & Audience Onboarding', icon: Brain },
    { num: '03', title: 'Analyze', desc: 'Deep Level 2 AI Audit', icon: Layers },
    { num: '04', title: 'Strategize', desc: 'Custom Growth Blueprint', icon: Compass },
    { num: '05', title: 'Create', desc: 'AI Content Strategy & Calendar', icon: Sparkles },
    { num: '06', title: 'Approve', desc: 'Multi-Stage Review Workflow', icon: CheckCircle2 },
    { num: '07', title: 'Publish', desc: 'Automated Social Publishing', icon: Zap },
    { num: '08', title: 'Analyze', desc: 'Performance Analytics & Insights', icon: BarChart3 },
    { num: '09', title: 'Generate Leads', desc: 'Lead Pipeline & WhatsApp Funnel', icon: MessageSquare },
    { num: '10', title: 'Scale', desc: 'Organic-to-Paid Ad Scaling', icon: Megaphone },
    { num: '11', title: 'Improve', desc: 'Monthly AI Growth Review', icon: Repeat },
  ]

  return (
    <section id="engine" className="grain relative bg-ink-950 py-20 lg:py-28 overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-4 py-1.5 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-ember-400" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ember-300">
                End-To-End Platform Architecture
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              One platform. <br />
              <span className="text-gradient-ember">Your entire growth engine.</span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-4 text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
              GroWise connects every stage of your marketing into a single, continuous growth loop.
            </p>
          </Reveal>
        </div>

        {/* 11-Step Visual Flow Loop */}
        <div className="mt-16">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {steps.map((s, idx) => (
              <Reveal key={s.num} delay={100 + idx * 40}>
                <div className="relative flex h-full flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:border-ember-500/40 hover:bg-white/[0.08]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-extrabold text-gold-400">{s.num}</span>
                      <s.icon className="h-4 w-4 text-ink-400" />
                    </div>
                    <h3 className="mt-3 font-display text-sm font-bold text-white">{s.title}</h3>
                    <p className="mt-1 text-[11px] text-ink-300">{s.desc}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-ink-400">
                    <span>Stage {idx + 1}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-ember-500" />
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Loopback Card */}
            <Reveal delay={540}>
              <div className="flex h-full flex-col justify-between rounded-xl border border-gold-400/40 bg-gold-400/10 p-4 backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-extrabold text-gold-300">LOOP</span>
                    <Repeat className="h-4 w-4 text-gold-400 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-bold text-white">Continuous Growth</h3>
                  <p className="mt-1 text-[11px] text-gold-200/80">Feeds monthly learnings directly back into Strategy</p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/10 text-[10px] font-bold text-gold-300">
                  Strategy → Content → Growth
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
