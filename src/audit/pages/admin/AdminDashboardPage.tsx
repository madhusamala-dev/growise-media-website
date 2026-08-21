import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuditHeader } from '../../components/AuditHeader'
import { AuditOrchestrator } from '../../services/auditOrchestrator'
import type { AuditLead, AuditSession } from '../../types'
import { Users, FileText, CheckCircle2, TrendingUp, BarChart2, ArrowRight } from 'lucide-react'

export function AdminDashboardPage() {
  const [audits, setAudits] = useState<AuditSession[]>([])
  const [leads, setLeads] = useState<AuditLead[]>([])

  useEffect(() => {
    const loadAdminData = async () => {
      const orchestrator = new AuditOrchestrator()
      const allAudits = await orchestrator.getAllAudits()
      const allLeads = await orchestrator.getAllLeads()

      setAudits(allAudits)
      setLeads(allLeads)
    }

    loadAdminData()
  }, [])

  const totalAudits = audits.length
  const completedAudits = audits.filter((a) => a.status === 'COMPLETED').length
  const totalLeads = leads.length
  const convertedLeads = leads.filter((l) => l.lead_status === 'CONVERTED').length
  const qualifiedLeads = leads.filter((l) => l.lead_status === 'DEMO_BOOKED' || l.lead_status === 'PROPOSAL_SENT' || l.lead_status === 'CONVERTED').length

  const conversionRate = totalAudits > 0 ? Math.round((totalLeads / totalAudits) * 100) : 0

  const validScores = audits.map((a) => a.overall_score).filter((s): s is number => s !== null)
  const avgScore = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 72

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-ember-500 selection:text-white space-y-8 pb-20">
      <AuditHeader />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ember-400">
              Internal Control Panel
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/audits"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-white transition-colors"
            >
              View All Audits ({totalAudits})
            </Link>
            <Link
              to="/admin/leads"
              className="px-4 py-2 rounded-xl bg-ember-500 hover:bg-ember-600 text-white font-bold text-xs transition-colors"
            >
              Manage Leads ({totalLeads})
            </Link>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Total Audits', val: totalAudits, icon: FileText, color: 'text-blue-400' },
            { label: 'Completed', val: completedAudits, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Total Leads', val: totalLeads, icon: Users, color: 'text-ember-400' },
            { label: 'Qualified', val: qualifiedLeads, icon: TrendingUp, color: 'text-amber-400' },
            { label: 'Converted', val: convertedLeads, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Conv. Rate', val: `${conversionRate}%`, icon: BarChart2, color: 'text-cyan-400' },
            { label: 'Avg Score', val: `${avgScore}/100`, icon: TrendingUp, color: 'text-amber-400' },
          ].map((card) => (
            <div key={card.label} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {card.label}
              </span>
              <span className={`font-display font-extrabold text-xl ${card.color}`}>
                {card.val}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Lists Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Audits */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white">Recent Audit Sessions</h3>
              <Link to="/admin/audits" className="text-xs text-ember-400 font-bold flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {audits.slice(0, 5).map((audit) => (
                <div
                  key={audit.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">@{audit.instagram_username}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(audit.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded font-mono">
                      Score: {audit.overall_score ?? 'N/A'}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {audit.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white">Recent Captured Leads</h3>
              <Link to="/admin/leads" className="text-xs text-ember-400 font-bold flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{lead.name} ({lead.business_name})</span>
                    <span className="text-[10px] text-slate-400 font-mono">{lead.email}</span>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {lead.lead_status || 'NEW'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
