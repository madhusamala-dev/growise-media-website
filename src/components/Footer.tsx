import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react'
import { GrowiseLogo } from '../lib/logo'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { brand, contact, cta, navLinks, whatsappHref } from '../data/site'
import { services } from '../data/services'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-ink-950 pb-10 pt-16 text-ink-300 lg:pt-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <a href="#home" className="inline-flex items-center" aria-label={`${brand.name} — home`}>
              <GrowiseLogo />
            </a>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed">{brand.tagline}</p>
            <p className="mt-3 max-w-xs font-accent text-sm italic text-ink-400">{brand.taglineAlt}</p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="inline-flex items-center gap-1 text-[15px] transition-colors hover:text-ember-400">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.title}>
                  <a
                    href="#services"
                    className="inline-flex items-start gap-1 text-[15px] transition-colors hover:text-ember-400"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
              Say hello
            </h3>
            <ul className="mt-5 space-y-3.5 text-[15px]">
              {contact.whatsappNumber && (
                <li>
                  <a
                    href={whatsappHref('Hi GroWise! I want to talk about content for my business.')}
                    className="inline-flex items-center gap-2.5 transition-colors hover:text-ember-400"
                  >
                    <MessageCircle className="h-4 w-4 text-gold-400" aria-hidden />
                    {contact.whatsappDisplay}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-ember-400">
                  <Mail className="h-4 w-4 text-gold-400" aria-hidden />
                  {contact.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                {contact.location}
              </li>
            </ul>
            <Button href="#contact" variant="gold" size="sm" className="mt-7">
              {cta.primary}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-ink-500">
            © {year} {brand.name}. All rights reserved.
          </p>
          <p className="text-sm text-ink-500">
            You run the business. <span className="text-ink-300">We run your social media.</span>
          </p>
        </div>
      </Container>
    </footer>
  )
}
