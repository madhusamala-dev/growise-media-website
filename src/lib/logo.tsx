import { cn } from './cn'

/**
 * GroWise logo — the brand lockup (public/logo.png). Used across the
 * marketing site, the client portal, auth screens and the 404 page.
 */
export function GrowiseLogo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="GroWise"
      width={1672}
      height={941}
      className={cn('h-8 w-auto', className)}
    />
  )
}

/**
 * GroWise logo mark — square version of the wordmark's "O" badge and growth
 * chart, for favicons and small icon contexts.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('h-8 w-8', className)} aria-hidden>
      <defs>
        <linearGradient id="growise-o" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd400" />
          <stop offset="100%" stopColor="#ff6a1f" />
        </linearGradient>
        <linearGradient id="growise-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff8a2a" />
          <stop offset="100%" stopColor="#ffd400" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="14" fill="#0b0b0c" />

      {/* Growth chart — four gradient bars and a sweeping arrow */}
      <rect x="14" y="14" width="4" height="7" rx="1.5" fill="url(#growise-bar)" />
      <rect x="22" y="10" width="4" height="11" rx="1.5" fill="url(#growise-bar)" />
      <rect x="30" y="6" width="4" height="15" rx="1.5" fill="url(#growise-bar)" />
      <rect x="38" y="2" width="4" height="19" rx="1.5" fill="url(#growise-bar)" />
      <path d="M12 19 C 16 8, 26 3, 41 3" stroke="url(#growise-bar)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M41 0 L46 3 L41 6 Z" fill="url(#growise-bar)" />

      {/* The "O" badge with two green leaves */}
      <circle cx="32" cy="42" r="17" fill="url(#growise-o)" stroke="#7c2d12" strokeWidth="3" />
      <path d="M32 54 V41" stroke="#a7f3d0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M32 43 C 27.5 43, 24 38.5, 24 34 C 28.5 34, 32 38.5, 32 43 Z" fill="#4ade80" />
      <path d="M32 43 C 36.5 43, 40 38.5, 40 34 C 35.5 34, 32 38.5, 32 43 Z" fill="#22c55e" />
    </svg>
  )
}
