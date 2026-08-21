import { getScoreLabelInfo } from '../engine/overallScorer'
import { LucideIcon } from 'lucide-react'

interface CategoryScoreCardProps {
  title: string
  score: number
  icon: LucideIcon
  description?: string
  weight?: string
}

export function CategoryScoreCard({
  title,
  score,
  icon: Icon,
  description,
  weight,
}: CategoryScoreCardProps) {
  const info = getScoreLabelInfo(score)

  const barColors = {
    emerald: 'bg-emerald-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    orange: 'bg-orange-500',
    rose: 'bg-rose-500',
  }

  const badgeColors = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    green: 'bg-green-500/10 text-green-400 border-green-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  }

  return (
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-ember-400 group-hover:scale-105 transition-transform">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-white">{title}</h4>
              {weight && <span className="text-[11px] text-slate-500">{weight} weight</span>}
            </div>
          </div>
          <span className="font-display font-black text-2xl text-white">{score}</span>
        </div>

        {description && (
          <p className="text-xs text-slate-400 leading-relaxed mb-4">{description}</p>
        )}
      </div>

      <div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColors[info.color]}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Status</span>
          <span
            className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
              badgeColors[info.color]
            }`}
          >
            {info.label}
          </span>
        </div>
      </div>
    </div>
  )
}
