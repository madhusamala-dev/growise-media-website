import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '../../../lib/cn'
import type { WeekMetric } from '../../data/types'

const toneText: Record<WeekMetric['tone'], string> = {
  ember: 'text-ember-400',
  gold: 'text-gold-300',
  emerald: 'text-emerald-400',
  sky: 'text-sky-400',
  violet: 'text-violet-400',
  neutral: 'text-paper-50',
}

export function StatCard({ metric, index = 0 }: { metric: WeekMetric; index?: number }) {
  return (
    <div
      className="card-glow rounded-2xl border border-white/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-ink-400">{metric.label}</p>
        {typeof metric.trend === 'number' && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
              metric.trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-ember-500/10 text-ember-400'
            )}
          >
            {metric.trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(metric.trend)}%
          </span>
        )}
      </div>
      <p className={cn('mt-2 font-display text-3xl font-bold tracking-tight tabular-nums', toneText[metric.tone])}>
        {metric.value}
      </p>
      <p className="mt-1 text-xs text-ink-500">{metric.hint}</p>
    </div>
  )
}
