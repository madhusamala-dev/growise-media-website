import { useState } from 'react'
import {
  BarChart3,
  Brain,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Layers,
  Megaphone,
  MessageSquare,
  Search,
  Sparkles,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { cn } from '../lib/cn'

export function ProductArchitectureSection() {
  const categories = [
    {
      id: 'DISCOVER',
      name: 'DISCOVER',
      tagline: 'Before you grow, understand where you stand.',
      icon: Search,
      features: ['Free Level 1 Growth Audit', 'Digital Presence Analysis', 'Public Profile Diagnostics', 'Overall Growth Score (0–100)'],
    },
    {
      id: 'UNDERSTAND',
      name: 'UNDERSTAND',
      tagline: 'GroWise starts by learning about your business.',
      icon: Brain,
      features: ['Business Onboarding', 'Products & Services Catalog', 'Target Audience Demographics', 'Brand Voice & Positioning', 'Growth Goal Setting'],
    },
    {
      id: 'STRATEGIZE',
      name: 'STRATEGIZE',
      tagline: 'Turn data into a custom growth blueprint.',
      icon: Compass,
      features: ['Deep Level 2 AI Audit', 'Brand Strategy Blueprint', 'Content Pillars Framework', 'Competitor Intelligence', 'Campaign Priorities'],
    },
    {
      id: 'CREATE',
      name: 'CREATE',
      tagline: 'Know what to create before you create it.',
      icon: Sparkles,
      features: ['AI Content Ideas & Hooks', 'Reels & Shorts Scripts', 'Multi-Format Carousels', '30-Day Content Calendar', 'YouTube Concepts'],
    },
    {
      id: 'PUBLISH',
      name: 'PUBLISH',
      tagline: 'Create once. Publish everywhere.',
      icon: CalendarCheck,
      features: ['Multi-Stage Approval Workflow', 'Client & Team Review', 'Automated Multi-Channel Posting', 'Version Control & Revisions'],
    },
    {
      id: 'ANALYZE',
      name: 'ANALYZE',
      tagline: 'Don’t just publish. Learn what works.',
      icon: BarChart3,
      features: ['Unified Analytics Dashboard', 'AI Explains The Numbers', 'Engagement Heatmaps', 'Monthly Growth Review Loop'],
    },
    {
      id: 'CONVERT',
      name: 'CONVERT',
      tagline: 'Turn social attention into qualified leads.',
      icon: MessageSquare,
      features: ['Lead Generation Pipeline', 'WhatsApp Integration', 'AI Lead Qualification', 'Automated Instant Follow-Ups'],
    },
    {
      id: 'SCALE',
      name: 'SCALE',
      tagline: 'When organic growth isn’t enough, scale with ads.',
      icon: Megaphone,
      features: ['Organic-to-Paid Engine', 'Meta & Google Ad Campaigns', 'AI Audience Targeting', 'Budget Allocation & Scaling'],
    },
  ]

  const [activeCat, setActiveCat] = useState('DISCOVER')

  const current = categories.find((c) => c.id === activeCat) || categories[0]

  return (
    <section className="grain relative bg-ink-950 py-20 lg:py-28">
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <Layers className="h-3.5 w-3.5 text-gold-400" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-paper-100">
                Complete Product Architecture
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Organized into <br />
              <span className="text-gradient-ember">8 core growth pillars.</span>
            </h2>
          </Reveal>
        </div>

        {/* Categories Tab Grid */}
        <div className="mt-12">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCat(cat.id)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all duration-300 border',
                  activeCat === cat.id
                    ? 'border-ember-500 bg-ember-500 text-white shadow-lg'
                    : 'border-white/10 bg-white/5 text-ink-300 hover:border-white/20 hover:text-white'
                )}
              >
                <cat.icon className="h-4 w-4 mb-1.5" />
                <span className="font-display text-[10px] font-bold tracking-wider uppercase">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Selected Category Details Card */}
          <div className="mt-6 rounded-2xl border border-white/15 bg-ink-900/90 p-6 shadow-2xl backdrop-blur-xl lg:p-8">
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500/20 text-ember-400">
                  <current.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{current.name}</h3>
                  <p className="text-xs text-gold-300">{current.tagline}</p>
                </div>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 font-display text-xs font-bold text-white border border-white/10">
                Pillar {categories.findIndex((c) => c.id === activeCat) + 1} of 8
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {current.features.map((feat) => (
                <div key={feat} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-display text-xs font-semibold text-white">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
