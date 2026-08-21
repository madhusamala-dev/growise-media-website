import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePortal } from '../lib/store'
import type { ContentItem } from '../data/types'
import { formatDay, monthLabel, weekdayLabel } from '../lib/format'
import { PlatformIcon } from '../components/ui/PlatformIcon'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { cn } from '../../lib/cn'

const DAY_MS = 86_400_000

function startOfDay(d: Date): Date {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function CalendarPage() {
  const { content } = usePortal()
  const [view, setView] = useState<'week' | 'month'>('week')
  const [anchor, setAnchor] = useState<Date>(() => startOfDay(new Date()))

  const events = useMemo(() => {
    const map = new Map<string, ContentItem[]>()
    for (const item of content) {
      const iso = item.status === 'published' ? item.publishedAt : item.scheduledAt
      if (!iso) continue
      const key = dateKey(new Date(iso))
      const list = map.get(key) ?? []
      list.push(item)
      map.set(key, list)
    }
    return map
  }, [content])

  const todayKey = dateKey(new Date())

  const move = (dir: 1 | -1) => {
    setAnchor((a) => {
      if (view === 'month') {
        const next = new Date(a.getFullYear(), a.getMonth() + dir, 1)
        return startOfDay(next)
      }
      return new Date(a.getTime() + dir * 7 * DAY_MS)
    })
  }

  const goToday = () => setAnchor(startOfDay(new Date()))

  return (
    <div>
      <PageHeader
        eyebrow="Calendar"
        title="Your Content Calendar"
        description="Every post, already planned. Your social media is taken care of."
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-white/10 bg-ink-800/70 p-1">
              {(['week', 'month'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={cn(
                    'rounded-lg px-3.5 py-1.5 font-display text-[13px] font-semibold capitalize transition-colors',
                    view === v ? 'bg-white/10 text-paper-50' : 'text-ink-500 hover:text-ink-300'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button variant="outlineLight" size="sm" onClick={goToday}>
              Today
            </Button>
            <div className="flex items-center rounded-xl border border-white/10 bg-ink-800/70">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous"
                className="flex h-10 w-10 items-center justify-center rounded-l-xl text-ink-400 transition-colors hover:text-paper-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next"
                className="flex h-10 w-10 items-center justify-center rounded-r-xl text-ink-400 transition-colors hover:text-paper-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        }
      />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-paper-50">
          {view === 'month' ? monthLabel(anchor.getFullYear(), anchor.getMonth()) : `Week of ${formatDay(anchor)}`}
        </h2>
        <p className="hidden text-[13px] text-ink-500 sm:block">
          {view === 'week' ? `${formatDay(anchor)} – ${formatDay(new Date(anchor.getTime() + 6 * DAY_MS))}` : `${events.size} scheduled days this month`}
        </p>
      </div>

      {view === 'month' ? (
        <MonthGrid anchor={anchor} events={events} todayKey={todayKey} />
      ) : (
        <WeekGrid anchor={anchor} events={events} todayKey={todayKey} />
      )}
    </div>
  )
}

function MonthGrid({ anchor, events, todayKey }: { anchor: Date; events: Map<string, ContentItem[]>; todayKey: string }) {
  const year = anchor.getFullYear()
  const month = anchor.getMonth()
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
      <div className="grid grid-cols-7 border-b border-white/10 bg-ink-900/80">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="px-2 py-2.5 text-center font-display text-[11px] font-bold uppercase tracking-wider text-ink-500">
            {weekdayLabel((i + 1) % 7)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="min-h-[6.5rem] border-b border-r border-white/[0.06]" />
          const key = dateKey(day)
          const dayEvents = events.get(key) ?? []
          const isToday = key === todayKey
          return (
            <div
              key={key}
              className={cn(
                'min-h-[6.5rem] border-b border-r border-white/[0.06] p-1.5 transition-colors hover:bg-white/[0.03]',
                (i % 7 === 6 || i === cells.length - 1) && 'border-r-0'
              )}
            >
              <div className="flex items-center justify-between px-1">
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full font-display text-xs font-semibold',
                    isToday ? 'bg-ember-500 text-white' : day.getMonth() === anchor.getMonth() ? 'text-paper-100' : 'text-ink-600'
                  )}
                >
                  {day.getDate()}
                </span>
                {dayEvents.length > 0 && <span className="text-[10px] font-semibold text-ink-500">{dayEvents.length}</span>}
              </div>
              <div className="mt-1.5 space-y-1">
                {dayEvents.slice(0, 2).map((item) => (
                  <Link
                    key={item.id}
                    to={`/content/${item.id}`}
                    className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold leading-tight transition-colors hover:brightness-125"
                    style={{ background: `${item.palette[1]}22` }}
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: item.palette[1] }} />
                    <span className="truncate text-paper-100/90">{item.title}</span>
                  </Link>
                ))}
                {dayEvents.length > 2 && (
                  <p className="px-1.5 text-[10px] font-semibold text-ink-500">+{dayEvents.length - 2} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekGrid({ anchor, events, todayKey }: { anchor: Date; events: Map<string, ContentItem[]>; todayKey: string }) {
  const days = Array.from({ length: 7 }, (_, i) => new Date(anchor.getTime() + i * DAY_MS))
  const totalEvents = days.reduce((acc, d) => acc + (events.get(dateKey(d))?.length ?? 0), 0)

  return (
    <div className="mt-4">
      {totalEvents === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 bg-ink-900/40 py-14 text-center">
          <CalendarDays className="h-8 w-8 text-ink-500" aria-hidden />
          <p className="mt-3 font-display text-base font-bold text-paper-50">Nothing scheduled this week</p>
          <p className="mt-1 text-sm text-ink-400">New content is planned every week — check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {days.map((day) => {
            const key = dateKey(day)
            const dayEvents = events.get(key) ?? []
            const isToday = key === todayKey
            return (
              <div
                key={key}
                className={cn(
                  'flex min-h-[14rem] flex-col rounded-2xl border bg-ink-900/50 p-3',
                  isToday ? 'border-ember-500/50' : 'border-white/10'
                )}
              >
                <div className="flex items-center justify-between">
                  <p className={cn('font-display text-[13px] font-bold', isToday ? 'text-ember-400' : 'text-paper-100')}>
                    {weekdayLabel(day.getDay())}
                  </p>
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-bold',
                      isToday ? 'bg-ember-500 text-white' : 'bg-white/5 text-ink-300'
                    )}
                  >
                    {day.getDate()}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {dayEvents.map((item) => (
                    <Link
                      key={item.id}
                      to={`/content/${item.id}`}
                      className="group block overflow-hidden rounded-xl border border-white/10 bg-ink-800/70 transition-all hover:-translate-y-0.5 hover:border-white/25"
                    >
                      <div className="h-14 w-full" style={{ background: `linear-gradient(135deg, ${item.palette[0]}, ${item.palette[1]})` }} />
                      <div className="p-2.5">
                        <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-paper-100 group-hover:text-white">
                          {item.title}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="flex -space-x-1">
                            {item.platforms.map((p) => (
                              <PlatformIcon key={p} id={p} size={12} className="h-5 w-5 border border-ink-900" />
                            ))}
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-wide text-ink-500">{item.type}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {dayEvents.length === 0 && (
                    <p className="py-3 text-center text-[11px] text-ink-600">No posts</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
