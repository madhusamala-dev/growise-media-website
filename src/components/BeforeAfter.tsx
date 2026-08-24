import { ArrowDown, ArrowRight, Check, Minus, Sparkles } from 'lucide-react'
import { Container } from './ui/Container'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import {
  afterCard,
  beforeAfter,
  beforeCard,
  coreMessage,
  differenceCta,
  viralNote,
  type VisualTile,
} from '../data/beforeAfter'
import { cn } from '../lib/cn'
import { useAuditModal } from '../audit/context/AuditModalContext'

const afterTones = {
  ember: 'bg-gradient-to-br from-ember-500/35 via-ember-600/15 to-ink-900',
  gold: 'bg-gradient-to-br from-gold-400/30 via-gold-500/10 to-ink-900',
  ink: 'bg-gradient-to-br from-white/10 via-white/5 to-ink-900',
} as const

const afterIconTones = {
  ember: 'text-ember-400',
  gold: 'text-gold-400',
  ink: 'text-paper-100/70',
} as const

function ContentTile({
  tile,
  index,
  variant,
}: {
  tile: VisualTile
  index: number
  variant: 'before' | 'after'
}) {
  const isAfter = variant === 'after'
  return (
    <div
      className={cn(
        'group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-xl border p-3 transition-all duration-500',
        isAfter
          ? cn(afterTones[tile.tone], 'border-white/15 hover:-translate-y-1 hover:border-ember-500/40')
          : cn('border-white/10 bg-white/[0.03]', index % 2 === 0 ? 'rotate-1' : '-rotate-2')
      )}
    >
      {tile.imageUrl ? (
        <>
          <img
            src={tile.imageUrl}
            alt={tile.label}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
          <span
            className={cn(
              'relative mt-auto text-[11px] font-semibold leading-tight',
              isAfter ? 'text-white' : 'text-ink-300'
            )}
          >
            {tile.label}
          </span>
        </>
      ) : (
        <>
          <tile.icon
            className={cn('h-5 w-5', isAfter ? afterIconTones[tile.tone] : 'text-ink-600')}
            aria-hidden
          />
          <span
            className={cn(
              'text-[11px] font-semibold leading-tight',
              isAfter ? 'text-paper-100/90' : 'text-ink-500'
            )}
          >
            {tile.label}
          </span>
        </>
      )}
    </div>
  )
}

export function BeforeAfter() {
  const { openAuditModal } = useAuditModal()
  return (
    <section
      id="difference"
      aria-labelledby="difference-title"
      className="relative overflow-hidden bg-ink-950 py-24 lg:py-32"
    >
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <Container className="relative">
        <SectionHeader
          dark
          eyebrow={beforeAfter.eyebrow}
          title={
            <>
              From Posting Content to{' '}
              <span className="text-accent text-ember-400">Building Growth.</span>
            </>
          }
          description={beforeAfter.description}
        />

        {/* Before / GroWise / After split */}
        <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          {/* BEFORE */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-ink-900 p-8 lg:p-10">
              <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink-300">
                {beforeCard.label}
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">
                {beforeCard.heading}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{beforeCard.subheading}</p>

              <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                {beforeCard.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-ink-400">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink-600" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>

              <p className="mt-7 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-ink-500">
                {beforeCard.visualsCaption}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {beforeCard.visuals.map((tile, i) => (
                  <ContentTile key={tile.label} tile={tile} index={i} variant="before" />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Transformation indicator */}
          <div className="flex items-center justify-center lg:flex-col">
            <Reveal delay={150}>
              <div className="relative">
                <span
                  aria-hidden
                  className="animate-glow absolute left-1/2 top-1/2 h-16 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/30 blur-2xl"
                />
                <span className="relative flex items-center gap-2.5 rounded-full border border-ember-500/40 bg-ink-900/90 px-5 py-2.5 backdrop-blur-sm">
                  <ArrowRight className="hidden h-4 w-4 text-ember-400 lg:block" aria-hidden />
                  <ArrowDown className="h-4 w-4 text-ember-400 lg:hidden" aria-hidden />
                  <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-ember-400">
                    GroWise
                  </span>
                  <ArrowRight className="hidden h-4 w-4 text-ember-400 lg:block" aria-hidden />
                  <ArrowDown className="h-4 w-4 text-ember-400 lg:hidden" aria-hidden />
                </span>
              </div>
            </Reveal>
          </div>

          {/* AFTER */}
          <Reveal delay={100} className="h-full">
            <div className="card-glow relative flex h-full flex-col rounded-3xl border border-ember-500/30 p-8 shadow-[0_40px_80px_-40px_rgba(255,74,17,0.35)] lg:p-10">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ember-500/15 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ember-400">
                <Sparkles className="h-3.5 w-3.5 text-gold-400" aria-hidden />
                {afterCard.label}
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">
                {afterCard.heading}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{afterCard.subheading}</p>

              <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                {afterCard.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-paper-100/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember-400" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>

              <p className="mt-7 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-ember-400">
                {afterCard.visualsCaption}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {afterCard.visuals.map((tile, i) => (
                  <ContentTile key={tile.label} tile={tile} index={i} variant="after" />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Core message */}
        <Reveal className="mt-20 text-center">
          <p className="mx-auto max-w-3xl text-balance font-display text-2xl font-bold leading-snug text-paper-50 sm:text-3xl lg:text-4xl">
            {coreMessage.title}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
            {coreMessage.support}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {coreMessage.words.map((word, i) => (
              <span
                key={word}
                className={cn(
                  'rounded-full border px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.18em]',
                  i % 2 === 0
                    ? 'border-ember-500/40 bg-ember-500/10 text-ember-400'
                    : 'border-gold-400/40 bg-gold-400/10 text-gold-400'
                )}
              >
                {word}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Viral content connection */}
        <Reveal delay={100} className="mt-12">
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-ink-900 p-7 text-center lg:p-8">
            <p className="font-display text-lg font-bold text-paper-50 sm:text-xl">
              {viralNote.title}
            </p>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-400">{viralNote.support}</p>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={200} className="mt-14 text-center">
          <p className="font-display text-xl font-bold text-paper-50 sm:text-2xl">
            {differenceCta.title}
          </p>
          <Button onClick={() => openAuditModal()} size="lg" className="mt-6">
            {differenceCta.button}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
