import { Sparkles, TrendingUp, Zap, Target } from 'lucide-react'

// Accepts both the legacy AuditRecommendation shape and the Level-2 Opportunity shape
export interface OpportunityItem {
  id?: string
  title: string
  description: string
  impact: string     // 'HIGH' | 'MEDIUM' | 'LOW' (Level-2) or 'High' | 'Medium' | 'Low' (legacy)
  effort: string     // 'LOW' | 'MEDIUM' | 'HIGH' (Level-2) or 'Easy' | 'Medium' | 'Hard' (legacy)
  category: string
  priority?: number
  evidence?: Record<string, unknown>
}

interface OpportunityCardProps {
  opportunity: OpportunityItem
  rank: number
}

// ── Impact label normalization ─────────────────────────────────────────────
function normalizeImpact(impact: string): string {
  switch (impact.toUpperCase()) {
    case 'HIGH': return 'High'
    case 'MEDIUM': return 'Medium'
    case 'LOW': return 'Low'
    default: return impact
  }
}

function normalizeEffort(effort: string): string {
  switch (effort.toUpperCase()) {
    case 'LOW': return 'Easy'
    case 'MEDIUM': return 'Medium'
    case 'HIGH': return 'Hard'
    case 'EASY': return 'Easy'
    case 'HARD': return 'Hard'
    default: return effort
  }
}

export function OpportunityCard({ opportunity, rank }: OpportunityCardProps) {
  const rankBadges = [
    { title: 'Highest Impact Opportunity', color: 'from-ember-500 to-amber-500', icon: Sparkles },
    { title: 'Second Highest Impact', color: 'from-blue-500 to-cyan-500', icon: TrendingUp },
    { title: 'Third Highest Impact', color: 'from-emerald-500 to-teal-500', icon: Zap },
  ]

  const badge = rankBadges[rank - 1] || rankBadges[2]
  const Icon = badge.icon

  const displayImpact = normalizeImpact(opportunity.impact)
  const displayEffort = normalizeEffort(opportunity.effort)

  // Evidence snippet: show up to 3 key values
  const evidenceEntries = opportunity.evidence
    ? Object.entries(opportunity.evidence).slice(0, 3)
    : []

  return (
    <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 lg:p-8 overflow-hidden space-y-4 hover:border-slate-700 transition-all shadow-xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
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
            Impact: {displayImpact}
          </span>
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-bold">
            Effort: {displayEffort}
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

        {/* Evidence panel (Level-2 only) */}
        {evidenceEntries.length > 0 ? (
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
              Evidence
            </span>
            <div className="space-y-0.5">
              {evidenceEntries.map(([k, v]) => (
                <p key={k} className="text-[11px] text-slate-300 font-mono">
                  <span className="text-slate-500">{k.replace(/([A-Z])/g, ' $1').trim()}: </span>
                  {typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : String(v)}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              Expected Growth Outcome
            </span>
            <span className="text-xs text-emerald-200 font-medium block">
              Immediate increase in engagement and lead conversion velocity.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
