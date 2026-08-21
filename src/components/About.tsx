import { Check, Cpu, UserRound, ConciergeBell } from 'lucide-react'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { brand } from '../data/site'

const beliefs = [
  'Consistency beats one viral post, every time.',
  'Your brand should sound like you — not a template.',
  'AI speeds us up; it never replaces judgment.',
  'Fair pricing based on the work, not the fame.',
]

const differentiators = [
  {
    icon: Cpu,
    title: 'AI-powered production',
    text: 'Modern tools let us create more, faster and sharper than a traditional team.',
  },
  {
    icon: UserRound,
    title: 'Human creative direction',
    text: 'Every ad starts with a person who understands what you sell and who buys it.',
  },
  {
    icon: ConciergeBell,
    title: 'Done-for-you service',
    text: 'No dashboards to learn, no tools to master — you get the finished content.',
  },
]

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-paper-50 py-24 lg:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-ember-600">
                <span aria-hidden className="h-px w-6 bg-ember-500" />
                About {brand.name}
              </p>
              <h2 id="about-title" className="text-balance font-display text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-[2.75rem]">
                An agency built around one idea:{' '}
                <span className="text-accent text-ember-600">you run the business, we handle the content.</span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-7 space-y-5 text-pretty text-[16px] leading-relaxed text-ink-600">
                <p>
                  {brand.name} exists because most business owners are great at their business and
                  exhausted by the content side of it. The ideas, the shooting, the editing, the
                  captions, the posting — it quietly eats the hours you should be spending with your
                  customers.
                </p>
                <p>
                  We use AI as a production advantage: it lets us plan, script, produce and deliver
                  more content than a traditional team could — without ever sounding like a machine.
                  Every concept is directed by humans who first understand what you sell, who you
                  sell to, and why they should stop scrolling.
                </p>
                <p>
                  We’re not a software company and we’re not selling a tool. We’re a done-for-you
                  service. You bring the business. We bring the content that makes it impossible to
                  ignore.
                </p>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <ul className="mt-9 space-y-3.5">
                {beliefs.map((belief) => (
                  <li key={belief} className="flex items-start gap-3 text-[15px] font-medium text-ink-800">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember-500/10">
                      <Check className="h-3.5 w-3.5 text-ember-600" aria-hidden />
                    </span>
                    {belief}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="flex flex-col gap-5">
            {differentiators.map((d, i) => (
              <Reveal key={d.title} delay={i * 100 + 120}>
                <div className="group flex gap-5 rounded-3xl border border-paper-300 bg-paper-100 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/50 hover:bg-paper-50">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ember-500/10 transition-colors duration-300 group-hover:bg-ember-500">
                    <d.icon className="h-6 w-6 text-ember-600 transition-colors duration-300 group-hover:text-white" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-950">{d.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">{d.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={420}>
              <div className="grain relative overflow-hidden rounded-3xl bg-ink-950 p-8">
                <p className="font-accent text-xl italic leading-snug text-paper-100">
                  “{brand.taglineAlt}”
                </p>
                <p className="mt-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-ember-400">
                  {brand.name}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
