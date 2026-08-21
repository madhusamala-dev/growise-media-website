import { Calendar, CheckCircle2 } from 'lucide-react'
import type { WeeklyGrowthPlanItem } from '../types'

interface GrowthPlanViewProps {
  plan: WeeklyGrowthPlanItem[]
}

export function GrowthPlanView({ plan }: GrowthPlanViewProps) {
  if (!plan || plan.length === 0) return null

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-ember-500/10 text-ember-400 border border-ember-500/30">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-ember-400">
            Actionable Roadmap
          </span>
          <h3 className="font-display text-xl font-bold text-white">Your Customized 30-Day Growth Plan</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plan.map((weekItem) => (
          <div
            key={weekItem.week}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-ember-400 bg-ember-500/10 border border-ember-500/20 px-2.5 py-0.5 rounded-full">
                  Week {weekItem.week}
                </span>
                <span className="font-display text-sm font-bold text-white">{weekItem.theme}</span>
              </div>

              <ul className="space-y-2.5">
                {weekItem.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
