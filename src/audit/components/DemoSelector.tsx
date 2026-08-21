import { AUDIT_CONFIG } from '../config/auditConfig'
import { Sparkles } from 'lucide-react'

interface DemoSelectorProps {
  onSelectDemo: (username: string) => void
}

export function DemoSelector({ onSelectDemo }: DemoSelectorProps) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 max-w-xl mx-auto backdrop-blur-xl shadow-xl space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Quick Demo Testing Mode</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">5 Sample Profiles</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {AUDIT_CONFIG.demoAccounts.map((acc) => (
          <button
            key={acc.id}
            onClick={() => onSelectDemo(acc.id)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-ember-500/20 hover:border-ember-500/40 border border-slate-800 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all active:scale-95"
          >
            @{acc.id}
          </button>
        ))}
      </div>
    </div>
  )
}
