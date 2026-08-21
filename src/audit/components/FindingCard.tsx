import { CheckCircle2, AlertCircle, AlertTriangle, Info, ArrowUpRight } from 'lucide-react'
import type { AuditFinding } from '../types'

interface FindingCardProps {
  finding: AuditFinding
}

export function FindingCard({ finding }: FindingCardProps) {
  const severityConfig = {
    CRITICAL: {
      badge: 'Critical Issue',
      bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
    },
    HIGH: {
      badge: 'High Priority',
      bgColor: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      icon: AlertTriangle,
      iconColor: 'text-orange-400',
    },
    MEDIUM: {
      badge: 'Medium Impact',
      bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      icon: Info,
      iconColor: 'text-amber-400',
    },
    LOW: {
      badge: 'Minor Enhancement',
      bgColor: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      icon: Info,
      iconColor: 'text-blue-400',
    },
    POSITIVE: {
      badge: 'Working Well',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
  }

  const config = severityConfig[finding.severity] || severityConfig.MEDIUM
  const Icon = config.icon

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl bg-slate-950 ${config.iconColor} shrink-0 mt-0.5`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${config.bgColor}`}>
                {config.badge}
              </span>
              <span className="text-[10px] font-mono uppercase text-slate-500">
                {finding.category}
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-white mt-1.5 leading-snug">
              {finding.title}
            </h4>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed pl-11">
        {finding.description}
      </p>

      {finding.evidence && (
        <div className="ml-11 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 font-mono">
          <span className="font-bold text-slate-300 block mb-0.5">Evidence Data:</span>
          {finding.evidence}
        </div>
      )}

      {finding.recommendation && (
        <div className="ml-11 p-3.5 rounded-xl bg-ember-500/10 border border-ember-500/20 text-xs text-slate-200 flex items-start gap-2">
          <ArrowUpRight className="h-4 w-4 text-ember-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-ember-400 block mb-0.5">Actionable Fix:</span>
            {finding.recommendation}
          </div>
        </div>
      )}
    </div>
  )
}
