import { Sparkles, TrendingUp, Zap, Target } from 'lucide-react'
import type { AuditRecommendation } from '../types'

interface OpportunityCardProps {
  opportunity: AuditRecommendation
  rank: number
}

export function OpportunityCard({ opportunity, rank }: OpportunityCardProps) {
  const rankBadges = [
    { title: 'Highest Impact Opportunity', color: 'from-ember-500 to-amber-500', icon: Sparkles },
    { title: 'Second Highest Impact', color: 'from-blue-500 to-cyan-500', icon: TrendingUp },
    { title: 'Third Highest Impact', color: 'from-emerald-500 to-teal-500', icon: Zap },
  ]

  const badge = rankBadges[rank - 1] || rankBadges[0]
  const Icon = badge.icon

  return (
    <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 lg:p-8 overflow-hidden space-y-4 hover:border-slate-700 transition-all shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl bg-gradient-to-r ${badge.color} text-white shadow-md`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              #{rank} Growth Accelerator
            </span>
            <h3 className="font-display text-lg font-bold text-white">{opportunity.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
            Impact: {opportunity.impact}
          </span>
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-bold">
            Effort: {opportunity.effort}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed font-sans">
        {opportunity.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-ember-400" />
            Target Category
          </span>
          <span className="text-xs text-white font-mono font-semibold block uppercase">
            {opportunity.category}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            Expected Growth Outcome
          </span>
          <span className="text-xs text-emerald-200 font-medium block">
            Immediate increase in engagement and lead conversion velocity.
          </span>
        </div>
      </div>
    </div>
  )
}
