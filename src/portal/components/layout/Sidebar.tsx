import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Palette,
  Settings,
  Share2,
} from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { usePortal } from '../../lib/store'
import { cn } from '../../../lib/cn'
import { Avatar } from '../ui/Avatar'
import { PortalLogo } from '../Logo'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/content', label: 'Content', icon: Clapperboard, end: false },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays, end: false },
  { to: '/approvals', label: 'Approvals', icon: CheckCircle2, end: false, badge: 'approvals' as const },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, end: false },
  { to: '/social-accounts', label: 'Social Accounts', icon: Share2, end: false },
  { to: '/brand', label: 'Brand', icon: Palette, end: false },
  { to: '/messages', label: 'Messages', icon: MessageSquare, end: false, badge: 'messages' as const },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()
  const { content, unreadConversations } = usePortal()

  const approvalsCount = content.filter((c) => c.status === 'approval').length
  const badgeCount = (kind: 'approvals' | 'messages') =>
    kind === 'approvals' ? approvalsCount : unreadConversations

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <PortalLogo onClick={onNavigate} />
      </div>

      <nav aria-label="Client portal" className="flex-1 overflow-y-auto portal-scroll px-3 py-4">
        <p className="mb-2 px-3 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-ink-500">
          Workspace
        </p>
        <ul className="space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon
            const count = item.badge ? badgeCount(item.badge) : 0
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200',
                      isActive
                        ? 'bg-ember-500/12 text-paper-50 shadow-[inset_0_0_0_1px_rgba(255,74,17,0.25)]'
                        : 'text-ink-400 hover:bg-white/5 hover:text-paper-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn('h-[18px] w-[18px] transition-colors', isActive ? 'text-ember-400' : 'text-ink-500 group-hover:text-ink-300')}
                        strokeWidth={isActive ? 2.4 : 2}
                      />
                      <span className="flex-1">{item.label}</span>
                      {count > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ember-500 px-1.5 font-display text-[10px] font-bold text-white">
                          {count}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-ember-500/10 to-transparent p-4">
          <p className="font-display text-[13px] font-bold text-paper-50">Need help?</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-400">
            Our team replies within a few hours on weekdays.
          </p>
          <NavLink
            to="/messages"
            onClick={onNavigate}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ember-400 transition-colors hover:text-ember-300"
          >
            Message GroWise →
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar name={user?.fullName ?? 'Client'} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-paper-100">
              {user?.businessName ?? 'Client'}
            </p>
            <p className="truncate text-[11px] text-ink-500">Client account</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            title="Log out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-white/5 hover:text-ember-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
