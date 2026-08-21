import { Link } from 'react-router-dom'
import { GrowiseLogo, LogoMark } from '../../lib/logo'

export { GrowiseLogo, LogoMark }

export function PortalLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/dashboard"
      onClick={onClick}
      className="flex items-center gap-2.5"
      aria-label="GroWise — client portal home"
    >
      <GrowiseLogo />
      <span className="rounded-full border border-ember-500/40 bg-ember-500/10 px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-[0.18em] text-ember-400">
        Client
      </span>
    </Link>
  )
}
