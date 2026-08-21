import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuditHeader } from '../../components/AuditHeader'
import { AuditOrchestrator } from '../../services/auditOrchestrator'
import type { AuditSession } from '../../types'
import { Search, ArrowLeft, ExternalLink } from 'lucide-react'

export function AdminAuditsPage() {
  const [audits, setAudits] = useState<AuditSession[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadAudits = async () => {
      const orchestrator = new AuditOrchestrator()
      const list = await orchestrator.getAllAudits()
      setAudits(list)
    }
    loadAudits()
  }, [])

  const filtered = audits.filter((a) =>
    a.instagram_username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-ember-500 selection:text-white space-y-8 pb-20">
      <AuditHeader />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link to="/admin" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Admin Overview</span>
            </Link>
            <h1 className="font-display text-3xl font-extrabold text-white">All Audit Sessions</h1>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ember-500"
            />
          </div>
        </div>

        {/* Audit Sessions Table */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase">
                <tr>
                  <th className="px-6 py-3.5">Username</th>
                  <th className="px-6 py-3.5">Overall Score</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Data Source</th>
                  <th className="px-6 py-3.5">Created At</th>
                  <th className="px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filtered.map((audit) => (
                  <tr key={audit.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white font-mono">
                      @{audit.instagram_username}
                    </td>
                    <td className="px-6 py-4 font-bold font-mono text-ember-400">
                      {audit.overall_score !== null ? `${audit.overall_score} / 100` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {audit.data_source}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {new Date(audit.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/audit/${audit.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-ember-400 hover:text-ember-300 font-bold"
                      >
                        <span>View Audit</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
