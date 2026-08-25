import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function AuditHeader() {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-ember-500 to-ember-600 flex items-center justify-center text-white font-bold shadow-md shadow-ember-500/20 group-hover:scale-105 transition-transform">
            G
          </div>
          <div>
            <span className="font-display font-bold text-white text-base block leading-tight">
              Growise <span className="text-ember-400 font-mono text-xs">AI Audit</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Growth Engine</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/60 bg-slate-800/50 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Main Site</span>
        </Link>
      </div>
    </header>
  )
}
