import { AUDIT_CONFIG } from '../config/auditConfig'
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react'

interface GrowiseCtaBannerProps {
  onOpenLeadForm?: () => void
}

export function GrowiseCtaBanner({ onOpenLeadForm }: GrowiseCtaBannerProps) {
  const { cta } = AUDIT_CONFIG

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-ember-950/80 via-slate-900 to-slate-950 border border-ember-500/30 p-8 lg:p-12 overflow-hidden shadow-2xl space-y-6">
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <Sparkles className="h-64 w-64 text-ember-500" />
      </div>

      <div className="max-w-2xl space-y-3 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember-500/20 text-ember-400 border border-ember-500/30 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          AI Growth Partner Service
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          {cta.primaryTitle}
        </h2>
        <p className="text-base text-slate-300 leading-relaxed font-sans">
          {cta.primaryCopy}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 relative z-10">
        <a
          href={cta.talkToGrowiseUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-ember-500 to-ember-600 hover:from-ember-600 hover:to-ember-700 text-white font-display font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-ember-500/25 transition-all active:scale-95 text-center"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Talk to Growise</span>
        </a>

        {onOpenLeadForm && (
          <button
            onClick={onOpenLeadForm}
            className="inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-white border border-slate-700 font-display font-bold text-base px-8 py-4 rounded-2xl transition-all active:scale-95 text-center"
          >
            <span>{cta.getGrowthPlanButtonText}</span>
            <ArrowRight className="h-5 w-5 text-ember-400" />
          </button>
        )}
      </div>
    </div>
  )
}
