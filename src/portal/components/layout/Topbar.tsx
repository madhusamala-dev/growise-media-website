import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, HelpCircle, Menu, Search } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { usePortal } from '../../lib/store'
import { Avatar } from '../ui/Avatar'
import { NotificationsPanel } from './NotificationsPanel'
import { cn } from '../../../lib/cn'

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [query, setQuery] = useState('')
  const [bellOpen, setBellOpen] = useState(false)
  const { user } = useAuth()
  const { unreadNotifications } = usePortal()
  const navigate = useNavigate()

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/content?q=${encodeURIComponent(q)}` : '/content')
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-ink-950/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-paper-100 transition-colors hover:bg-white/10 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <form onSubmit={submitSearch} role="search" className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your content…"
          aria-label="Search content"
          className="h-10 w-full rounded-xl border border-white/10 bg-ink-800/70 pl-10 pr-14 text-[14px] text-paper-100 placeholder:text-ink-500 transition-all duration-200 focus:border-ember-500 focus:outline-none focus:ring-4 focus:ring-ember-500/15"
        />
        <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-display text-[10px] font-semibold text-ink-500 sm:block">
          Enter
        </kbd>
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link
          to="/messages"
          className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink-400 transition-colors hover:text-paper-100 md:flex"
        >
          <HelpCircle className="h-4 w-4" aria-hidden />
          Need help?
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setBellOpen((v) => !v)}
            aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ''}`}
            aria-expanded={bellOpen}
            className={cn(
              'relative inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors',
              bellOpen
                ? 'border-ember-500/40 bg-ember-500/10 text-ember-400'
                : 'border-white/10 bg-white/5 text-ink-300 hover:bg-white/10 hover:text-paper-100'
            )}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ember-500 px-1 font-display text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(255,74,17,0.6)]">
                {unreadNotifications}
              </span>
            )}
          </button>
          <NotificationsPanel open={bellOpen} onClose={() => setBellOpen(false)} />
        </div>

        <Link
          to="/settings"
          className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white/10"
          aria-label="Open settings"
        >
          <Avatar name={user?.fullName ?? 'Client'} size="sm" className="h-8 w-8" />
          <span className="hidden max-w-[11rem] xl:block">
            <span className="block truncate text-[13px] font-semibold leading-tight text-paper-100">
              {user?.fullName ?? 'Client'}
            </span>
            <span className="block truncate text-[10px] leading-tight text-ink-500">
              {user?.businessName ?? 'Client account'}
            </span>
          </span>
        </Link>
      </div>
    </header>
  )
}
