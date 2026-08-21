import { Link } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'

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
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Main Site</span>
        </Link>

        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all"
        >
          <Shield className="h-3.5 w-3.5 text-amber-400" />
          <span>Admin Portal</span>
        </Link>
      </div>
    </header>
  )
}
