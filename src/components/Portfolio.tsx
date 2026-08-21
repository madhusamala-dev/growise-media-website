import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Building2,
  Gem,
  Play,
  Stethoscope,
  Store,
  UtensilsCrossed,
} from 'lucide-react'
import { Container } from './ui/Container'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { portfolioCategories, projects, portfolioNote, type Project } from '../data/portfolio'
import { cn } from '../lib/cn'

const categoryIcons: Record<Project['category'], LucideIcon> = {
  Food: UtensilsCrossed,
  'Real Estate': Building2,
  Healthcare: Stethoscope,
  Jewellery: Gem,
  Retail: Store,
}

function ProjectThumb({ project }: { project: Project }) {
  const Icon = categoryIcons[project.category]

  if (project.videoUrl) {
    return (
      <video
        className="h-full w-full object-cover"
        src={project.videoUrl}
        poster={project.thumbnailUrl}
        autoPlay
        muted
        loop
        playsInline
        preload={project.preload ?? 'auto'}
      />
    )
  }

  const palette = project.palette ?? ['#7c2d12', '#f97316']

  return (
    <div
      className="relative h-full w-full"
      style={{ background: `linear-gradient(150deg, ${palette[0]}, ${palette[1]})` }}
      role="img"
      aria-label={`${project.title} — sample placeholder artwork`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(120% 90% at 85% 8%, rgba(255,255,255,0.5), transparent 55%)' }}
      />
      <Icon
        aria-hidden
        className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-white/25"
        strokeWidth={1.1}
      />
      <span className="absolute left-3 top-3 rounded-md bg-ink-950/75 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400 backdrop-blur-sm">
        Sample placeholder
      </span>
      <span className="absolute right-3 top-3 rounded-md bg-ink-950/60 px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-widest text-white/85 backdrop-blur-sm">
        {project.type}
      </span>
    </div>
  )
}

function PlayButton({ project }: { project: Project }) {
  if (project.videoUrl) {
    return (
      <a
        href={project.videoUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Play ${project.title}`}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink-950 shadow-xl transition-transform duration-300 hover:scale-110"
      >
        <Play className="h-6 w-6 translate-x-0.5 fill-ink-950" aria-hidden />
      </a>
    )
  }
  return (
    <span
      title="Sample placeholder — real video coming soon"
      aria-hidden
      className="flex h-14 w-14 cursor-not-allowed items-center justify-center rounded-full border border-white/30 bg-ink-950/40 text-white/60 backdrop-blur-sm"
    >
      <Play className="h-6 w-6 translate-x-0.5" aria-hidden />
    </span>
  )
}

export function Portfolio() {
  const [active, setActive] = useState<(typeof portfolioCategories)[number]>('All')

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active]
  )

  return (
    <section id="work" aria-labelledby="work-title" className="grain relative bg-ink-950 py-24 lg:py-32">
      <Container>
        <SectionHeader
          dark
          eyebrow="Our Work"
          title={
            <>
              Content that looks like your brand’s{' '}
              <span className="text-accent text-ember-400">best ad.</span>
            </>
          }
          description="Every project below is real, live GroWise work — your brand could be next."
        />

        {/* Filters */}
        <Reveal className="mt-12">
          <div role="group" aria-label="Filter projects by category" className="flex flex-wrap justify-center gap-2.5">
            {portfolioCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                aria-pressed={active === category}
                className={cn(
                  'rounded-full border px-4 py-2 font-display text-[13px] font-semibold transition-all duration-300',
                  active === category
                    ? 'border-ember-500 bg-ember-500 text-white shadow-[0_8px_24px_-10px_rgba(255,74,17,0.8)]'
                    : 'border-white/15 bg-white/5 text-ink-300 hover:border-white/40 hover:text-white'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:mx-auto xl:max-w-6xl">
            {filtered.map((project, i) => (
              <Reveal key={project.id} delay={(i % 2) * 80} as="article">
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-900 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember-500/50 hover:shadow-[0_30px_60px_-30px_rgba(255,74,17,0.35)]">
                  <div
                    className={cn(
                      'relative overflow-hidden',
                      project.videoAspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'
                    )}
                  >
                    <ProjectThumb project={project} />
                    <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/25">
                      <PlayButton project={project} />
                    </div>
                    <span className="absolute bottom-3 left-3 rounded-md bg-ink-950/75 px-2.5 py-1 font-display text-[11px] font-semibold text-paper-100 backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold text-white">{project.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-400">{project.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center text-sm text-ink-400">
            No projects in this category yet — real client work drops in here next.
          </p>
        )}

        {/* Note + CTA */}
        <Reveal className="mt-14 text-center">
          <p className="mx-auto max-w-xl text-pretty text-[15px] text-ink-400">{portfolioNote}</p>
          <Button href="#contact" size="lg" variant="gold" className="mt-7">
            Get Your Content
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
