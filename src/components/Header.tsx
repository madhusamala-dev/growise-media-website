import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { cn } from '../lib/cn'
import { GrowiseLogo } from '../lib/logo'
import { brand, cta, navLinks } from '../data/site'
import { Button } from './ui/Button'
import { useAuditModal } from '../audit/context/AuditModalContext'

function TopAnnouncementBar() {
  return (
    <div className="relative z-50 overflow-hidden border-b border-white/10 bg-ink-950/95 py-2.5 text-center text-white shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 font-display text-xs sm:text-sm">
        {/* Glowing Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 font-display text-[10px] font-extrabold uppercase tracking-widest text-gold-300 shadow-[0_0_12px_rgba(255,212,0,0.15)] sm:text-[11px]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
          ⚡ First 50 Customers Only
        </span>

        {/* Highlighted text */}
        <span className="font-semibold text-white/90">
          Get <span className="font-bold text-gold-300 underline decoration-ember-500 underline-offset-4">Free Website</span> + Free AI Growth Audit
        </span>

        {/* Action Button Link */}
        <a
          href="#lead-form"
          className="group inline-flex items-center gap-1.5 rounded-full border border-ember-500/50 bg-ember-500/20 px-3 py-1 font-display text-xs font-bold text-ember-400 transition-all hover:border-ember-500 hover:bg-ember-500 hover:text-white"
        >
          <span>Claim Free Website</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <a href="#home" className="inline-flex items-center" aria-label={`${brand.name} — home`}>
      <GrowiseLogo />
    </a>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { openAuditModal } = useAuditModal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open
          ? 'border-b border-white/10 bg-ink-950/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <TopAnnouncementBar />
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link font-display text-[15px] font-medium text-white/75 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button onClick={() => openAuditModal()} size="sm" className="hidden sm:inline-flex">
            {cta.primary}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'lg:hidden fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-ink-950 transition-all duration-300',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 pt-8 pb-12">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl font-bold text-white/85 transition-all duration-300 hover:text-white',
                open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              )}
              style={{ transitionDelay: open ? `${i * 40 + 60}ms` : '0ms' }}
            >
              {link.label}
              <ArrowRight className="h-5 w-5 text-ember-400" />
            </a>
          ))}
          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={() => {
              setOpen(false)
              openAuditModal()
            }}
          >
            {cta.primary}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-6 text-center font-accent text-sm italic text-ink-400">
            {brand.taglineAlt}
          </p>
        </nav>
      </div>
    </header>
  )
}
