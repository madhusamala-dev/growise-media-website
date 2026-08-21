import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  CalendarClock,
  Clapperboard,
  Eye,
  Grid2x2,
  Heart,
  List,
  MessageCircle,
  SearchX,
} from 'lucide-react'
import { usePortal } from '../lib/store'
import type { ContentStatus } from '../data/types'
import { compact, formatDate } from '../lib/format'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PlatformRow } from '../components/ui/PlatformIcon'
import { Thumbnail } from '../components/ui/Thumbnail'
import { EmptyState } from '../components/ui/EmptyState'
import { CardSkeleton, useFakeLoading } from '../components/ui/Skeleton'
import { cn } from '../../lib/cn'

const FILTERS: { key: string; label: string; statuses: ContentStatus[] | null }[] = [
  { key: 'all', label: 'All', statuses: null },
  { key: 'ideas', label: 'Ideas', statuses: ['idea', 'script'] },
  { key: 'production', label: 'In Production', statuses: ['production', 'editing'] },
  { key: 'approval', label: 'Awaiting Approval', statuses: ['approval', 'revision'] },
  { key: 'scheduled', label: 'Scheduled', statuses: ['scheduled'] },
  { key: 'published', label: 'Published', statuses: ['published'] },
]

type SortKey = 'newest' | 'oldest' | 'az' | 'views'

export function ContentLibrary() {
  const { content } = usePortal()
  const loading = useFakeLoading(550)
  const [params, setParams] = useSearchParams()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<SortKey>('newest')

  const query = (params.get('q') ?? '').toLowerCase()
  const statusFilter = params.get('status') ?? 'all'

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const items = useMemo(() => {
    let list = [...content]
    const filter = FILTERS.find((f) => f.key === statusFilter)
    if (filter?.statuses) list = list.filter((c) => filter.statuses!.includes(c.status))
    if (query) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.caption.toLowerCase().includes(query) ||
          c.hashtags.some((h) => h.toLowerCase().includes(query))
      )
    }
    switch (sort) {
      case 'newest':
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        break
      case 'oldest':
        list.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        break
      case 'az':
        list.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'views':
        list.sort((a, b) => b.stats.views - a.stats.views)
        break
    }
    return list
  }, [content, query, statusFilter, sort])

  const publishedCount = content.filter((c) => c.status === 'published').length

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Your Content Library"
        description={`${content.length} pieces planned, created and managed by GroWise · ${publishedCount} published`}
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-white/10 bg-ink-800/70 p-1">
              <button
                type="button"
                onClick={() => setView('grid')}
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
                className={cn('flex h-8 w-8 items-center justify-center rounded-lg transition-colors', view === 'grid' ? 'bg-white/10 text-paper-50' : 'text-ink-500 hover:text-ink-300')}
              >
                <Grid2x2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                aria-label="List view"
                aria-pressed={view === 'list'}
                className={cn('flex h-8 w-8 items-center justify-center rounded-lg transition-colors', view === 'list' ? 'bg-white/10 text-paper-50' : 'text-ink-500 hover:text-ink-300')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <select
              name="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort content"
              className="h-10 rounded-xl border border-white/10 bg-ink-800/70 px-3 text-[13px] font-medium text-paper-100 focus:border-ember-500 focus:outline-none"
            >
              <option value="newest" className="bg-ink-900">Newest first</option>
              <option value="oldest" className="bg-ink-900">Oldest first</option>
              <option value="az" className="bg-ink-900">Title A–Z</option>
              <option value="views" className="bg-ink-900">Most viewed</option>
            </select>
          </div>
        }
      />

      {/* Filters */}
      <div className="portal-scroll mt-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const active = statusFilter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setParam('status', f.key === 'all' ? null : f.key)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 font-display text-[13px] font-semibold transition-all duration-200',
                active
                  ? 'border-ember-500 bg-ember-500 text-white shadow-[0_8px_24px_-10px_rgba(255,74,17,0.7)]'
                  : 'border-white/10 bg-ink-800/60 text-ink-300 hover:border-white/25 hover:text-paper-100'
              )}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Grid / list */}
      {loading ? (
        <div className={cn('mt-6 grid gap-4', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={SearchX}
          title={query || statusFilter !== 'all' ? 'Nothing matches your search' : 'Your content pipeline is empty'}
          description={
            query || statusFilter !== 'all'
              ? 'Try a different search term or clear the filters.'
              : 'Don’t worry — GroWise is getting started. Content will appear here as it’s planned.'
          }
          action={
            query || statusFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => setParams({}, { replace: true })}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[13px] font-semibold text-paper-100 transition-colors hover:bg-white/10"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : view === 'grid' ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/content/${item.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-850/80 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
            >
              <div className="relative">
                <Thumbnail palette={item.palette} title={item.title} duration={item.duration} icon={<Clapperboard className="h-7 w-7 text-white/40" />} />
                <div className="absolute left-3 top-3">
                  <StatusBadge status={item.status} />
                </div>
                <span className="absolute right-3 top-3 rounded-md bg-ink-950/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                  {item.type}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-1 font-display text-[15px] font-bold text-paper-50 transition-colors group-hover:text-white">
                  {item.title}
                </p>
                <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-ink-400">{item.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <PlatformRow ids={item.platforms} />
                  <span className="text-[11px] text-ink-500">
                    {item.status === 'scheduled' && item.scheduledAt ? `Scheduled ${formatDate(item.scheduledAt)}` : `Added ${formatDate(item.createdAt)}`}
                  </span>
                </div>
                {item.status === 'published' && (
                  <div className="mt-3 flex items-center gap-4 border-t border-white/10 pt-3 text-[12px] text-ink-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" aria-hidden /> {compact(item.stats.views)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5" aria-hidden /> {compact(item.stats.likes)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden /> {compact(item.stats.comments)}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/content/${item.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-850/80 p-3.5 transition-all duration-200 hover:border-white/25"
            >
              <Thumbnail palette={item.palette} title={item.title} duration={item.duration} aspect="aspect-video" className="w-32 shrink-0 sm:w-40" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-display text-[15px] font-bold text-paper-50">{item.title}</p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-1 hidden truncate text-[13px] text-ink-400 sm:block">{item.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-500">
                  <PlatformRow ids={item.platforms} />
                  <span>{item.type}</span>
                  {item.scheduledAt && item.status !== 'published' && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" aria-hidden /> {formatDate(item.scheduledAt)}
                    </span>
                  )}
                  {item.status === 'published' && (
                    <span className="inline-flex items-center gap-3 text-ink-400">
                      <span>{compact(item.stats.views)} views</span>
                      <span>{compact(item.stats.likes)} likes</span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
