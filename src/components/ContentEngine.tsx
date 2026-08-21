import { useState } from 'react'
import {
  Award,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Eye,
  Layers,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from '../portal/lib/brandIcons'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { cn } from '../lib/cn'

const objectiveData = {
  awareness: {
    tag: 'OBJECTIVE: BRAND AWARENESS & REACH',
    tagColor: 'bg-pink-500/20 text-pink-400',
    title: 'Viral Industry Insight Reel + Hook Strategy',
    description: 'Designed to maximize organic reach and introduce your brand to cold, high-potential target audiences.',
    highlights: [
      { label: 'Platform', val: 'Instagram Reels & TikTok', icon: Eye, color: 'text-pink-400' },
      { label: 'Hook Strategy', val: '3-Sec Pattern Interrupt', icon: TrendingUp, color: 'text-pink-400' },
      { label: 'Content Format', val: 'Dynamic Fast-Cut Visuals', icon: Sparkles, color: 'text-pink-400' },
      { label: 'Core Goal', val: 'Profile Visits & New Reach', icon: Users, color: 'text-pink-400' },
    ],
    scriptTitle: '// AI Viral Hook & Storyboard',
    scriptText: '"90% of business owners are making this exact growth mistake in 2026 without even realizing it..."',
    visualPrompt: 'Visual: Fast-cut split screen showing before/after performance charts with energetic caption animations.',
    statusText: 'Status: AI Optimized for High Organic Reach',
    badgeText: 'High Viral Potential',
    badgeColor: 'bg-pink-500/20 text-pink-300',
  },
  education: {
    tag: 'OBJECTIVE: EDUCATION & AUTHORITY',
    tagColor: 'bg-amber-500/20 text-amber-400',
    title: 'Value Breakdown Carousel + Deep Dive Reel',
    description: 'Teaches your audience actionable strategies, establishing your business as an undeniable industry authority.',
    highlights: [
      { label: 'Platform', val: 'LinkedIn & IG Carousels', icon: Layers, color: 'text-amber-400' },
      { label: 'Hook Strategy', val: 'Step-by-Step Problem Framework', icon: Lightbulb, color: 'text-amber-400' },
      { label: 'Content Format', val: '5-Slide Infographic Series', icon: BarChart3, color: 'text-amber-400' },
      { label: 'Core Goal', val: 'High Saves, Shares & Authority', icon: CheckCircle2, color: 'text-amber-400' },
    ],
    scriptTitle: '// AI Educational Carousel Framework',
    scriptText: '"Here is the exact 4-step framework we use to turn cold social traffic into predictable paying clients..."',
    visualPrompt: 'Visual: Clean slide-by-slide visual breakdown with key metrics highlighted and save-for-later CTA.',
    statusText: 'Status: AI Optimized for High Saves & Shares',
    badgeText: 'High Authority Score',
    badgeColor: 'bg-amber-500/20 text-amber-300',
  },
  trust: {
    tag: 'OBJECTIVE: TRUST & SOCIAL PROOF',
    tagColor: 'bg-emerald-500/20 text-emerald-400',
    title: 'Customer Transformation & Case Study Reel',
    description: 'Highlights real client results, testimonials, and before/after proof to eliminate buying hesitation.',
    highlights: [
      { label: 'Platform', val: 'Instagram, Shorts & Facebook', icon: ShieldCheck, color: 'text-emerald-400' },
      { label: 'Hook Strategy', val: '"How [Client] 3x\'d Sales in 60 Days"', icon: Award, color: 'text-emerald-400' },
      { label: 'Content Format', val: 'Client Interview & Analytics Proof', icon: CheckCircle2, color: 'text-emerald-400' },
      { label: 'Core Goal', val: 'Eliminate Buying Hesitation', icon: MessageCircle, color: 'text-emerald-400' },
    ],
    scriptTitle: '// AI Social Proof & Case Study Script',
    scriptText: '"When [Client Name] started working with us, they were struggling to get consistent leads. Here is what changed..."',
    visualPrompt: 'Visual: Verified dashboard metrics overlay with live customer interview footage and proof callouts.',
    statusText: 'Status: AI Optimized for Social Proof',
    badgeText: 'High Trust Rating',
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
  },
  leads: {
    tag: 'OBJECTIVE: LEAD GENERATION & CONVERSION',
    tagColor: 'bg-ember-500/20 text-ember-400',
    title: 'High-Intent Offer Reel + WhatsApp Hook',
    description: 'Designed to convert warm viewers who already know your brand into direct lead inquiries on WhatsApp.',
    highlights: [
      { label: 'Platform', val: 'Instagram Reel & YouTube Shorts', icon: Target, color: 'text-ember-400' },
      { label: 'Hook Strategy', val: 'Direct Offer & Problem-Solution', icon: Zap, color: 'text-ember-400' },
      { label: 'Call To Action', val: 'Comment "GROW" for Direct Link', icon: MessageSquare, color: 'text-ember-400' },
      { label: 'Destination', val: 'Automated WhatsApp Funnel', icon: CheckCircle2, color: 'text-ember-400' },
    ],
    scriptTitle: '// AI Reel Script & WhatsApp Funnel Hook',
    scriptText: '"If your social media is generating likes but zero leads, you are missing the final conversion step..."',
    visualPrompt: 'Visual: Fast-cut UI breakdown of WhatsApp Lead Funnel. On-screen text: "Stop Guessing. Start Growing."',
    statusText: 'Status: AI Optimized for Direct Leads',
    badgeText: 'High Conversion Score',
    badgeColor: 'bg-ember-500/20 text-ember-300',
  },
}

export function ContentEngine() {
  const [activeObjective, setActiveObjective] = useState<'awareness' | 'education' | 'trust' | 'leads'>('awareness')

  const currentObj = objectiveData[activeObjective]

  return (
    <section id="content" className="grain relative bg-ink-950 py-20 lg:py-28">
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />

      <Container className="relative space-y-24 lg:space-y-32">
        {/* Part 1: AI Content Strategy & Objective Framework */}
        <div>
          <Reveal>
            <div className="text-center">
              <span className="rounded-full border border-ember-500/30 bg-ember-500/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-ember-400">
                PURPOSE-DRIVEN CONTENT STRATEGY
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Every post has a clear <span className="text-gradient-ember">business objective.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-ink-300">
                We don't post random content. GroWise crafts strategy-backed assets designed for awareness, education, social proof, and direct lead generation.
              </p>
            </div>
          </Reveal>

          {/* Objective Tabs */}
          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { id: 'awareness', label: 'Awareness', icon: Eye, color: 'text-pink-400' },
                { id: 'education', label: 'Education', icon: Sparkles, color: 'text-amber-400' },
                { id: 'trust', label: 'Trust & Proof', icon: Users, color: 'text-emerald-400' },
                { id: 'leads', label: 'Lead Generation & Conversion', icon: Target, color: 'text-ember-400' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveObjective(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-full px-5 py-2.5 font-display text-xs font-semibold transition-all duration-300',
                    activeObjective === tab.id
                      ? 'border border-ember-500 bg-ember-500 text-white shadow-lg shadow-ember-500/25'
                      : 'border border-white/10 bg-white/5 text-ink-300 hover:border-white/20 hover:text-white'
                  )}
                >
                  <tab.icon className={cn('h-4 w-4', tab.color)} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Objective Preview Card */}
            <div className="mt-8 rounded-2xl border border-white/15 bg-ink-900/90 p-6 shadow-2xl backdrop-blur-xl lg:p-8">
              <div className="grid gap-6 lg:grid-cols-12 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <span className={cn('inline-block rounded-full px-3 py-1 font-display text-xs font-bold', currentObj.tagColor)}>
                    {currentObj.tag}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{currentObj.title}</h3>
                  <p className="text-sm text-ink-300 leading-relaxed">
                    {currentObj.description}
                  </p>
                  <div className="grid grid-cols-1 gap-2.5 text-xs text-paper-50 pt-2 sm:grid-cols-2">
                    {currentObj.highlights.map((h) => (
                      <div key={h.label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        <h.icon className={cn('h-4 w-4 shrink-0', h.color)} />
                        <div>
                          <span className="block text-[10px] text-ink-400 uppercase font-semibold">{h.label}</span>
                          <span className="font-medium text-white">{h.val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 rounded-xl border border-white/10 bg-black/40 p-5 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-gold-400">
                    <span>{currentObj.scriptTitle}</span>
                    <span className={cn('rounded px-2 py-0.5 text-[10px] font-sans font-bold', currentObj.badgeColor)}>
                      {currentObj.badgeText}
                    </span>
                  </div>
                  <p className="text-white/95 font-sans font-semibold text-sm leading-snug">
                    {currentObj.scriptText}
                  </p>
                  <p className="text-ink-300 font-sans text-xs leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                    {currentObj.visualPrompt}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-emerald-400 font-sans text-xs font-bold border-t border-white/10">
                    <span>{currentObj.statusText}</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: 30-Day Content Calendar */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-sm">
                <CalendarCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Automated Content Execution
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                Your next 30 days, <br />
                <span className="text-gradient-ember">planned by AI.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-4 text-pretty text-base leading-relaxed text-ink-300">
                GroWise builds a complete 30-day content calendar tailored to your brand strategy, business goals, target audience, and trending topics.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-6 space-y-3 font-display text-xs font-semibold">
                <span className="block text-gold-300 uppercase tracking-wider">Content Item Lifecycle:</span>
                <div className="flex flex-wrap items-center gap-1.5 text-ink-300">
                  <span className="rounded bg-white/10 px-2.5 py-1 text-white">1. AI Generated</span>
                  <ChevronRight className="h-3.5 w-3.5 text-ember-500" />
                  <span className="rounded bg-white/10 px-2.5 py-1 text-white">2. Team Review</span>
                  <ChevronRight className="h-3.5 w-3.5 text-ember-500" />
                  <span className="rounded bg-white/10 px-2.5 py-1 text-white">3. Client Approved</span>
                  <ChevronRight className="h-3.5 w-3.5 text-ember-500" />
                  <span className="rounded bg-white/10 px-2.5 py-1 text-white">4. Scheduled</span>
                  <ChevronRight className="h-3.5 w-3.5 text-ember-500" />
                  <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-emerald-400">5. Published & Analyzed</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Calendar Mockup Widget */}
          <div className="lg:col-span-7">
            <Reveal delay={180}>
              <div className="rounded-2xl border border-white/15 bg-ink-900/95 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-display text-sm font-bold text-white">30-Day AI Content Calendar</span>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-display text-xs font-semibold text-emerald-400">
                    24 Posts Scheduled
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-2 text-center font-display text-[11px] font-bold text-ink-400">
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                </div>

                <div className="mt-2 grid grid-cols-7 gap-2">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const channel =
                      i === 5
                        ? 'linkedin'
                        : i % 2 === 0
                        ? 'instagram'
                        : 'youtube'

                    return (
                      <div
                        key={i}
                        className={cn(
                          'min-h-[70px] rounded-lg border p-2 text-left flex flex-col justify-between transition-all',
                          channel === 'instagram'
                            ? 'border-pink-500/40 bg-pink-500/10'
                            : channel === 'youtube'
                            ? 'border-red-500/40 bg-red-500/10'
                            : 'border-sky-500/40 bg-sky-500/10'
                        )}
                      >
                        <span className="font-display text-[10px] font-bold text-white/70">Day {i + 1}</span>
                        <div className="flex items-center justify-between">
                          {channel === 'instagram' ? (
                            <InstagramIcon className="h-3.5 w-3.5 text-pink-400" />
                          ) : channel === 'youtube' ? (
                            <YoutubeIcon className="h-3.5 w-3.5 text-red-500" />
                          ) : (
                            <LinkedinIcon className="h-3.5 w-3.5 text-sky-400" />
                          )}
                          <span className="text-[9px] font-bold uppercase text-white/80">
                            {i % 3 === 0 ? 'Approved' : 'Review'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Part 3: Approval & Multi-Channel Publishing */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-4">
              <span className="rounded-full bg-gold-400/20 px-3 py-1 font-display text-xs font-bold text-gold-300">
                TOTAL CONTROL & PUBLISHING
              </span>
              <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                You stay in control. <br />
                <span className="text-gradient-ember">Create once. Publish everywhere.</span>
              </h3>
              <p className="text-sm text-ink-300 leading-relaxed">
                GroWise takes approved content and handles seamless publishing across Instagram, Facebook, YouTube, LinkedIn, and major social channels. Complete version history, revision requests, and team approvals built in.
              </p>
            </div>

            <div className="lg:col-span-6 flex flex-wrap items-center justify-center gap-4">
              {[
                { name: 'Instagram', icon: InstagramIcon, color: 'text-pink-400' },
                { name: 'YouTube', icon: YoutubeIcon, color: 'text-red-500' },
                { name: 'Facebook', icon: FacebookIcon, color: 'text-blue-500' },
                { name: 'LinkedIn', icon: LinkedinIcon, color: 'text-sky-400' },
              ].map((channel) => (
                <div key={channel.name} className="flex items-center gap-3 rounded-xl border border-white/15 bg-ink-950 px-5 py-4 shadow-lg">
                  <channel.icon className={cn('h-6 w-6', channel.color)} />
                  <span className="font-display text-sm font-bold text-white">{channel.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
