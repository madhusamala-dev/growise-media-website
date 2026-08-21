import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Eye, TrendingUp, Users } from 'lucide-react'
import { usePortal } from '../lib/store'
import { demoAnalytics, demoPlatformPerformance } from '../data/demo'
import type { AnalyticsPeriod } from '../data/types'
import { compact } from '../lib/format'
import { AreaChart } from '../lib/charts'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader } from '../components/ui/Card'
import { PlatformIconTile } from '../components/ui/PlatformIcon'
import { Thumbnail } from '../components/ui/Thumbnail'
import { CardSkeleton, useFakeLoading } from '../components/ui/Skeleton'
import { cn } from '../../lib/cn'

const PERIODS: { key: AnalyticsPeriod; label: string }[] = [
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: '12m', label: 'Last 12 months' },
]

const CHART_COLORS = ['#ff4a11', '#ffd400', '#38bdf8', '#a78bfa']

export function AnalyticsPage() {
  const { content } = usePortal()
  const loading = useFakeLoading(650)
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d')

  const series = demoAnalytics[period]
  const last = (label: string) => series.find((s) => s.label === label)?.values.at(-1) ?? 0
  const published = content.filter((c) => c.status === 'published')

  const overview = [
    { label: 'Total Reach', value: compact(last('Reach')), hint: 'across all platforms', icon: Eye },
    { label: 'Engagement', value: `${last('Engagement %').toFixed(1)}%`, hint: 'average rate', icon: TrendingUp },
    { label: 'Followers', value: compact(last('Followers')), hint: 'total following', icon: Users },
    { label: 'Video Views', value: compact(last('Video views')), hint: 'last period', icon: BarChart3 },
    { label: 'Posts Published', value: String(content.filter((c) => c.status === 'published').length), hint: 'all time', icon: BarChart3 },
  ]

  const topContent = [...published].sort((a, b) => b.stats.views - a.stats.views).slice(0, 3)
  const maxViews = topContent[0]?.stats.views ?? 1

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Your Results"
        description="Real numbers from the content GroWise creates and publishes for you."
        action={
          <div className="flex rounded-xl border border-white/10 bg-ink-800/70 p-1">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                aria-pressed={period === p.key}
                className={cn(
                  'rounded-lg px-3.5 py-1.5 font-display text-[13px] font-semibold transition-colors',
                  period === p.key ? 'bg-white/10 text-paper-50' : 'text-ink-500 hover:text-ink-300'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Overview */}
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
          : overview.map((o, i) => {
              const Icon = o.icon
              return (
                <Card key={o.label} className="p-5 animate-fade-up" glow>
                  <div style={{ animationDelay: `${i * 50}ms` }}>
                    <p className="text-[12px] font-medium text-ink-400">{o.label}</p>
                    <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-paper-50">{o.value}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-500">
                      <Icon className="h-3 w-3" aria-hidden />
                      {o.hint}
                    </p>
                  </div>
                </Card>
              )
            })}
      </div>

      {/* Growth charts */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : series.map((s, i) => (
              <Card key={s.label} className="p-5 animate-fade-up">
                <div style={{ animationDelay: `${i * 60}ms` }}>
                  <CardHeader title={s.label} subtitle="Growth over time" />
                  <div className="mt-3">
                    <AreaChart values={s.values} color={CHART_COLORS[i % CHART_COLORS.length]} height={150} />
                  </div>
                </div>
              </Card>
            ))}
      </div>

      {/* Platform performance + top content */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card className="p-5 sm:p-6 animate-fade-up">
          <CardHeader title="Platform Performance" subtitle="Followers & engagement by channel" />
          <div className="mt-6 space-y-5">
            {demoPlatformPerformance.map((p) => (
              <div key={p.platform} className="flex items-center gap-4">
                <PlatformIconTile id={p.platform} size={20} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <span className="text-[13px] font-semibold text-paper-100">{p.followers.toLocaleString()} followers</span>
                    <span className={cn('text-[11px] font-semibold', p.trend >= 0 ? 'text-emerald-400' : 'text-ember-400')}>
                      {p.trend >= 0 ? '+' : ''}
                      {p.trend}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(p.followers / demoPlatformPerformance[0].followers) * 100}%`, background: 'linear-gradient(90deg, #ff4a11, #ffd400)' }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-ink-500">
                    {p.posts30d} posts · {p.engagement}% engagement · {compact(p.views30d)} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6 animate-fade-up">
          <CardHeader
            title="Top Content"
            subtitle="Your best performing videos"
            action={
              <Link to="/content" className="text-xs font-semibold text-ember-400 hover:text-ember-300">
                View all →
              </Link>
            }
          />
          <div className="mt-5 space-y-4">
            {topContent.map((item, rank) => (
              <Link
                key={item.id}
                to={`/content/${item.id}`}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-ink-800/40 p-3 transition-colors hover:border-white/25"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-ember-500 font-display text-sm font-bold text-white">
                  {rank + 1}
                </span>
                <Thumbnail palette={item.palette} title={item.title} aspect="aspect-video" className="w-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-paper-50">{item.title}</p>
                  <p className="mt-0.5 text-[11px] text-ink-500">{compact(item.stats.views)} views</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-emerald-400/80" style={{ width: `${(item.stats.views / maxViews) * 100}%` }} />
                  </div>
                </div>
                <div className="shrink-0 text-right text-[11px] leading-relaxed text-ink-400">
                  <p>{compact(item.stats.likes)} likes</p>
                  <p>{compact(item.stats.shares)} shares</p>
                  <p>{compact(item.stats.comments)} comments</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
