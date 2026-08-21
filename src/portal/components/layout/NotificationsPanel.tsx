import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  Info,
  Rocket,
} from 'lucide-react'
import { usePortal } from '../../lib/store'
import { cn } from '../../../lib/cn'
import type { NotificationKind } from '../../data/types'

const KIND_META: Record<NotificationKind, { icon: typeof Bell; className: string }> = {
  approval: { icon: CheckCircle2, className: 'bg-gold-400/10 text-gold-300' },
  scheduled: { icon: CalendarClock, className: 'bg-sky-500/10 text-sky-300' },
  published: { icon: Rocket, className: 'bg-emerald-500/10 text-emerald-300' },
  report: { icon: BarChart3, className: 'bg-violet-500/10 text-violet-300' },
  info: { icon: Info, className: 'bg-white/5 text-ink-300' },
}

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead } = usePortal()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close notifications"
          className="fixed inset-0 z-40 cursor-default bg-transparent"
          onClick={onClose}
        />
      )}
      <div
        ref={ref}
        className={cn(
          'absolute right-0 top-[calc(100%+10px)] z-50 w-[min(92vw,22rem)] origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] transition-all duration-200',
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        )}
        role="dialog"
        aria-label="Notifications"
        aria-hidden={!open}
        inert={open ? undefined : true}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="font-display text-sm font-bold text-paper-50">Notifications</p>
          <button
            type="button"
            onClick={markAllNotificationsRead}
            disabled={unreadNotifications === 0}
            className="text-xs font-semibold text-ember-400 transition-colors hover:text-ember-300 disabled:opacity-40"
          >
            Mark all as read
          </button>
        </div>

        <ul className="max-h-[22rem] overflow-y-auto portal-scroll">
          {notifications.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-ink-400">You’re all caught up. 🎉</li>
          )}
          {notifications.map((n) => {
            const meta = KIND_META[n.kind]
            const Icon = meta.icon
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    markNotificationRead(n.id)
                    navigate(n.href)
                    onClose()
                  }}
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.04]',
                    !n.read && 'bg-ember-500/[0.06]'
                  )}
                >
                  <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', meta.className)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={cn('truncate text-[13px] font-semibold', n.read ? 'text-ink-300' : 'text-paper-50')}>
                        {n.title}
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-500">{n.time}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-ink-400">{n.body}</span>
                  </span>
                  {!n.read && <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ember-500" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
