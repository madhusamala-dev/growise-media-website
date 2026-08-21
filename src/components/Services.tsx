import { Container } from './ui/Container'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { services, servicesNote } from '../data/services'

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-paper-50 py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Services"
          title={
            <>
              Everything your brand needs to stay{' '}
              <span className="text-accent text-ember-600">impossible to ignore.</span>
            </>
          }
          description="One agency, one goal: your business stays visible while you stay focused on it. Pick the pieces you need — or let us put together the whole picture."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 4) * 70} as="article">
              <div className="group flex h-full flex-col rounded-3xl border border-paper-300 bg-paper-50 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember-500/60 hover:shadow-[0_24px_50px_-28px_rgba(11,11,12,0.35)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-500/10 transition-colors duration-300 group-hover:bg-ember-500">
                  <service.icon className="h-6 w-6 text-ember-600 transition-colors duration-300 group-hover:text-white" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold leading-snug text-ink-950">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{service.description}</p>
                <ul className="mt-5 space-y-2 border-t border-paper-200 pt-5">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] text-ink-600">
                      <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-ember-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs italic leading-relaxed text-ink-400">
          {servicesNote}
        </p>
      </Container>
    </section>
  )
}
