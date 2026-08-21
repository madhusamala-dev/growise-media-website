import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronRight, Clapperboard, PartyPopper } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { usePortal } from '../lib/store'
import { PIPELINE_STAGES, type ContentItem, type WeekMetric } from '../data/types'
import { STATUS_META, PLATFORM_META } from '../lib/meta'
import { greeting, formatDate } from '../lib/format'
import { Sparkline } from '../lib/charts'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PlatformRow, PlatformIconTile } from '../components/ui/PlatformIcon'
import { Thumbnail } from '../components/ui/Thumbnail'
import { CardSkeleton, StatSkeleton, useFakeLoading } from '../components/ui/Skeleton'
import { cn } from '../../lib/cn'

export function Dashboard() {
  const { user } = useAuth()
  const { content, platforms, approveContent } = usePortal()
  const loading = useFakeLoading(700)

  const firstName = user?.businessName?.split(' ')[0] ?? 'there'
  const awaiting = content.filter((c) => c.status === 'approval')
  const scheduled = content
    .filter((c) => c.status === 'scheduled')
    .sort((a, b) => (a.scheduledAt ?? '').localeCompare(b.scheduledAt ?? ''))
  const thisWeek = content
    .filter((c) => {
      const created = new Date(c.createdAt).getTime()
      return Date.now() - created < 7 * 86_400_000
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const publishedThisWeek = content.filter((c) => {
    if (!c.publishedAt || c.status !== 'published') return false
    return Date.now() - new Date(c.publishedAt).getTime() < 7 * 86_400_000
  }).length

  /* Derived from the same data the pipeline shows — stays honest. */
  const metrics: WeekMetric[] = [
    { label: 'This Week', value: String(thisWeek.length), hint: 'content pieces created', tone: 'ember' },
    { label: 'Scheduled', value: String(scheduled.length), hint: 'ready to publish', tone: 'sky' },
    { label: 'Published', value: String(publishedThisWeek), hint: 'this week', tone: 'emerald' },
    { label: 'Awaiting Approval', value: String(awaiting.length), hint: 'needs your review', tone: 'gold' },
    { label: 'Reach', value: '12.8K', hint: 'this week', trend: 18.2, tone: 'violet' },
    { label: 'Engagement', value: '6.4%', hint: 'avg. this week', trend: 2.1, tone: 'neutral' },
  ]

  return (
    <div>
      {/* Greeting */}
      <div className="animate-fade-up">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-ember-400">
          Client dashboard
        </p>
        <h1 className="mt-1.5 text-balance font-display text-3xl font-bold tracking-tight text-paper-50 sm:text-4xl">
          {greeting()}, {firstName} 👋
        </h1>
        <p className="mt-1.5 text-[15px] text-ink-400">
          Here’s what’s happening with your social media this week.
        </p>
      </div>

      {/* Metrics */}
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
          : metrics.map((m, i) => <StatCard key={m.label} metric={m} index={i} />)}
      </div>

      {/* Pipeline + attention */}
      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContentPipeline items={thisWeek} loading={loading} />
        </div>

        <div className="space-y-5">
          <Card glow>
            <CardHeader
              title="Needs your attention"
              subtitle={awaiting.length ? 'Content waiting for your review' : 'Nothing to do right now'}
              action={
                awaiting.length > 0 && (
                  <Link
                    to="/approvals"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-ember-400 hover:text-ember-300"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                )
              }
            />
            <div className="mt-4 space-y-3">
              {loading && <CardSkeleton />}
              {!loading && awaiting.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/15 bg-ink-900/40 p-6 text-center">
                  <PartyPopper className="mx-auto h-6 w-6 text-gold-400" aria-hidden />
                  <p className="mt-2 text-sm font-semibold text-paper-50">You’re all caught up 🎉</p>
                  <p className="mt-1 text-xs text-ink-400">No content is waiting for your approval.</p>
                </div>
              )}
              {!loading &&
                awaiting.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-800/60 p-3">
                    <Thumbnail
                      palette={item.palette}
                      title={item.title}
                      duration={item.duration}
                      aspect="aspect-video"
                      className="w-24 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-paper-50">{item.title}</p>
                      <p className="mt-0.5 text-[11px] text-ink-500">{item.type} · {formatDate(item.scheduledAt)}</p>
                      <Button size="sm" className="mt-2 h-8 px-3 text-xs" onClick={() => approveContent(item.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Next to publish"
              subtitle="Already planned and scheduled"
              action={
                <Link to="/calendar" className="inline-flex items-center gap-1 text-xs font-semibold text-ember-400 hover:text-ember-300">
                  Calendar <ArrowRight className="h-3 w-3" />
                </Link>
              }
            />
            <div className="mt-4 space-y-2.5">
              {loading && <CardSkeleton />}
              {!loading &&
                scheduled.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    to={`/content/${item.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-ink-800/40 p-3 transition-colors hover:border-white/20"
                  >
                    <PlatformRow ids={item.platforms} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-paper-100 group-hover:text-white">{item.title}</p>
                      <p className="text-[11px] text-ink-500">{formatDate(item.scheduledAt)}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-ink-600" aria-hidden />
                  </Link>
                ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Social health */}
      <div className="mt-7">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-paper-50">Your Social Media</h2>
            <p className="mt-0.5 text-[13px] text-ink-400">Connected accounts and how they’re performing</p>
          </div>
          <Link to="/social-accounts" className="inline-flex items-center gap-1 text-xs font-semibold text-ember-400 hover:text-ember-300">
            Manage <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : platforms.map((p) => (
                <Card key={p.id} hover className="p-5">
                  <div className="flex items-start justify-between">
                    <PlatformIconTile id={p.id} />
                    <ConnectionPill status={p.status} />
                  </div>
                  <p className="mt-4 font-display text-2xl font-bold tracking-tight text-paper-50">
                    {(p.followers / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-ink-500">followers</p>
                  <div className="mt-3">
                    <Sparkline values={sparkSeries(p.followers, p.followersTrend)} color={PLATFORM_META[p.id].color} />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                    <span className="text-ink-400">
                      <span className="font-semibold text-paper-100">{p.postsThisMonth}</span> posts this month
                    </span>
                    <span className={cn('font-semibold', p.followersTrend >= 0 ? 'text-emerald-400' : 'text-ember-400')}>
                      {p.followersTrend >= 0 ? '+' : ''}
                      {p.followersTrend}%
                    </span>
                  </div>
                  <p className="mt-2 truncate text-[11px] text-ink-500">
                    Latest: {p.latestPost ?? '—'}
                  </p>
                </Card>
              ))}
        </div>
      </div>
    </div>
  )
}

/** Small upward series ending at the current follower count. */
function sparkSeries(followers: number, trend: number): number[] {
  const start = followers * (1 - trend / 100)
  return Array.from({ length: 14 }, (_, i) => Math.round(start + ((followers - start) * i) / 13))
}

function ConnectionPill({ status }: { status: 'connected' | 'not_connected' | 'connection_required' }) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Connected
      </span>
    )
  }
  if (status === 'connection_required') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1 text-[11px] font-semibold text-gold-300">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> Connection required
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-ink-300">
      Not connected
    </span>
  )
}

function ContentPipeline({ items, loading }: { items: ContentItem[]; loading: boolean }) {
  const stageCounts = PIPELINE_STAGES.reduce<Record<string, number>>((acc, s) => {
    acc[s.key] = items.filter((i) => STATUS_META[i.status].stage === s.label).length
    return acc
  }, {})

  return (
    <Card glow className="p-5 sm:p-6">
      <CardHeader
        title="This Week’s Content"
        subtitle="Exactly where your content sits in the pipeline"
        action={
          <Link to="/content" className="inline-flex items-center gap-1 text-xs font-semibold text-ember-400 hover:text-ember-300">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        }
      />

      {/* Stage strip */}
      <div className="portal-scroll mt-5 overflow-x-auto pb-1">
        <div className="flex min-w-max items-center">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.key} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border font-display text-xs font-bold transition-colors',
                    stageCounts[stage.key] > 0
                      ? 'border-ember-500/40 bg-ember-500/10 text-ember-400'
                      : 'border-white/10 bg-ink-800 text-ink-500'
                  )}
                >
                  {stageCounts[stage.key]}
                </span>
                <span className={cn('text-[10px] font-semibold uppercase tracking-wide', stageCounts[stage.key] > 0 ? 'text-paper-100' : 'text-ink-500')}>
                  {stage.label}
                </span>
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div className={cn('mx-2 h-px w-6 sm:w-10', stageCounts[stage.key] > 0 ? 'bg-ember-500/50' : 'bg-white/10')} aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 space-y-3">
        {loading && Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}
        {!loading && items.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-500">
            Your content pipeline is empty — GroWise is getting started.
          </p>
        )}
        {!loading &&
          items.map((item) => (
            <Link
              key={item.id}
              to={`/content/${item.id}`}
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-ink-800/40 p-3.5 transition-all duration-200 hover:border-white/20 hover:bg-ink-800/70"
            >
              <Thumbnail palette={item.palette} title={item.title} duration={item.duration} aspect="aspect-video" className="w-28 shrink-0 sm:w-32" icon={<Clapperboard className="h-6 w-6 text-white/40" />} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-display text-[15px] font-bold text-paper-50 group-hover:text-white">
                    {item.title}
                  </p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-400">{item.description}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-500">
                  <PlatformRow ids={item.platforms} />
                  <span>{item.type}</span>
                  {item.status === 'scheduled' && item.scheduledAt && <span>Publishes {formatDate(item.scheduledAt)}</span>}
                  {item.status === 'published' && item.publishedAt && <span>Published {formatDate(item.publishedAt)}</span>}
                  {item.status === 'approval' && item.scheduledAt && <span>Goes live {formatDate(item.scheduledAt)}</span>}
                </div>
              </div>
              <ChevronRight className="hidden h-5 w-5 shrink-0 text-ink-600 transition-colors group-hover:text-ember-400 sm:block" aria-hidden />
            </Link>
          ))}
      </div>
    </Card>
  )
}
