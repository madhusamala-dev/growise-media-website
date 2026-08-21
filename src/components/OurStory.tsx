import { ArrowRight } from 'lucide-react'
import { Container } from './ui/Container'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import {
  brandMeaning,
  familyStory,
  ourStory,
  people,
  reasonBlock,
  storyCta,
  type Person,
} from '../data/ourStory'
import { cn } from '../lib/cn'

const tones = {
  ember: {
    avatar: 'bg-gradient-to-br from-ember-500 to-ember-700 text-white',
    tag: 'border-ember-500/40 bg-ember-500/10 text-ember-400',
    dot: 'bg-ember-400',
  },
  gold: {
    avatar: 'bg-gradient-to-br from-gold-400 to-gold-500 text-ink-950',
    tag: 'border-gold-400/40 bg-gold-400/10 text-gold-400',
    dot: 'bg-gold-400',
  },
  ink: {
    avatar: 'bg-gradient-to-br from-white/25 to-white/10 text-paper-100',
    tag: 'border-white/15 bg-white/5 text-ink-200',
    dot: 'bg-ink-300',
  },
} as const

function PersonCard({ person, index }: { person: Person; index: number }) {
  const tone = tones[person.tone]
  return (
    <Reveal delay={index * 100} className="h-full">
      <article className="group relative flex h-full flex-col rounded-3xl border border-white/10 bg-ink-900 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember-500/40 hover:shadow-[0_30px_60px_-30px_rgba(255,74,17,0.35)]">
        <div className="flex items-start justify-between gap-4">
          <div className="relative">
            {person.imageUrl ? (
              <img
                src={person.imageUrl}
                alt={`${person.name} — ${person.role}`}
                loading="lazy"
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <span
                className={cn(
                  'flex h-20 w-20 items-center justify-center rounded-2xl font-display text-3xl font-bold',
                  tone.avatar
                )}
              >
                {person.name.charAt(0)}
              </span>
            )}
            {person.avatarBadge && (
              <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-ember-500/40 bg-ink-950 shadow-[0_0_18px_-4px_rgba(255,74,17,0.6)]">
                <person.avatarBadge className="h-4 w-4 text-ember-400" aria-hidden />
              </span>
            )}
          </div>
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.16em]',
              tone.tag
            )}
          >
            {person.tag}
          </span>
        </div>

        <h3 className="mt-6 font-display text-2xl font-bold text-white">{person.name}</h3>
        <p className="mt-1.5 font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-ember-400">
          {person.role}
        </p>
        <p className="mt-1.5 text-sm text-ink-400">{person.descriptor}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-300">{person.story}</p>
        {person.quote && (
          <p className="mt-4 border-l-2 border-ember-500/60 pl-4 font-accent text-lg italic leading-snug text-ember-300">
            {person.quote}
          </p>
        )}

        <div className="mt-6 flex-1 border-t border-white/10 pt-5">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-ink-500">
            Strengths
          </p>
          <ul className="mt-3.5 space-y-2.5">
            {person.strengths.map((strength) => (
              <li
                key={strength}
                className="flex items-start gap-3 text-[14px] leading-snug text-ink-300"
              >
                <span className={cn('mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full', tone.dot)} aria-hidden />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  )
}

export function OurStory() {
  return (
    <section id="story" aria-labelledby="story-title" className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <Container className="relative">
        <SectionHeader
          dark
          eyebrow={ourStory.eyebrow}
          title={
            <>
              Three People.{' '}
              <span className="text-accent text-ember-400">One Vision.</span>
            </>
          }
          description={ourStory.description}
        />

        {/* People cards */}
        <div className="mt-16 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {people.map((person, i) => (
            <PersonCard key={person.name} person={person} index={i} />
          ))}
        </div>

        {/* Family story */}
        <Reveal className="mt-16">
          <div className="grain relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-10 text-center lg:p-14">
            <div
              aria-hidden
              className="absolute left-1/2 top-[-45%] h-[300px] w-[560px] -translate-x-1/2 rounded-full opacity-30 blur-[110px]"
              style={{ background: 'radial-gradient(circle, rgba(255,74,17,0.55), transparent 60%)' }}
            />
            <div className="relative">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-ember-400">
                Our Story
              </p>
              <h3 className="mt-4 text-balance font-display text-3xl font-bold leading-[1.1] text-paper-50 sm:text-4xl">
                {familyStory.title}
              </h3>
              <div className="mx-auto mt-6 max-w-3xl space-y-4 text-pretty text-[15px] leading-relaxed text-ink-300 sm:text-base">
                {familyStory.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-8 font-display text-2xl font-bold tracking-tight text-gradient-ember sm:text-3xl">
                {familyStory.emphasize}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Brand meaning */}
        <Reveal delay={80} className="mt-12 text-center">
          <p className="font-display text-xl font-bold text-white sm:text-2xl">
            <span className="text-gradient-ember">{brandMeaning.name}</span>
            <span className="mx-2 text-ink-500">=</span>
            <span className="text-accent text-ember-400">{brandMeaning.equals[0]}</span>
            <span className="mx-2 text-ink-500">+</span>
            <span className="text-accent text-gold-400">{brandMeaning.equals[1]}</span>
          </p>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-[15px] text-ink-400">
            {brandMeaning.support}
          </p>
        </Reveal>

        {/* Why we built GroWise */}
        <Reveal delay={120} className="mt-16">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-b from-ink-900 to-ink-850 p-10 text-center lg:p-12">
            <h3 className="text-balance font-display text-2xl font-bold text-paper-50 sm:text-3xl">
              {reasonBlock.title}
            </h3>
            <p className="mt-4 font-accent text-xl italic text-ember-400">{reasonBlock.intro}</p>
            <div className="mt-5 space-y-2 text-pretty text-[15px] leading-relaxed text-ink-300">
              {reasonBlock.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-6 font-display text-lg font-semibold text-white">{reasonBlock.outro}</p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <span aria-hidden className="h-px w-12 bg-white/15" />
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-gold-400">
                {reasonBlock.signature}
              </p>
              <span aria-hidden className="h-px w-12 bg-white/15" />
            </div>
          </div>
        </Reveal>

        {/* Closing statement + CTA */}
        <Reveal delay={160} className="mt-14 text-center">
          <h3 className="mx-auto max-w-2xl text-balance font-display text-2xl font-bold text-paper-50 sm:text-3xl">
            {storyCta.title}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-[15px] text-ink-300 sm:text-base">
            {storyCta.support}
          </p>
          <Button href="#process" size="lg" className="mt-7">
            {storyCta.button}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
