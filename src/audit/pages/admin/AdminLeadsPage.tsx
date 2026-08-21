import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuditHeader } from '../../components/AuditHeader'
import { AuditOrchestrator } from '../../services/auditOrchestrator'
import type { AuditLead, LeadStatus } from '../../types'
import { Search, ArrowLeft } from 'lucide-react'

const LEAD_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'DEMO_BOOKED',
  'PROPOSAL_SENT',
  'CONVERTED',
  'LOST',
]

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<AuditLead[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadLeads = async () => {
      const orchestrator = new AuditOrchestrator()
      const list = await orchestrator.getAllLeads()
      setLeads(list)
    }
    loadLeads()
  }, [])

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const orchestrator = new AuditOrchestrator()
    await orchestrator.updateLeadStatus(leadId, newStatus)
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, lead_status: newStatus } : l))
    )
  }

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.business_name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="font-display text-3xl font-extrabold text-white">Audit Captured Leads</h1>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search lead or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ember-500"
            />
          </div>
        </div>

        {/* Leads Table */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase">
                <tr>
                  <th className="px-6 py-3.5">Name / Business</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">WhatsApp / Phone</th>
                  <th className="px-6 py-3.5">Industry / City</th>
                  <th className="px-6 py-3.5">Lead Status</th>
                  <th className="px-6 py-3.5">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-white block text-sm">{lead.name}</span>
                      <span className="text-xs text-ember-400 font-medium">{lead.business_name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {lead.whatsapp || lead.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <span>{lead.industry || 'General'}</span>
                      {lead.city && <span className="block text-[11px] text-slate-500">{lead.city}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.lead_status || 'NEW'}
                        onChange={(e) => handleStatusChange(lead.id!, e.target.value as LeadStatus)}
                        className="bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 rounded-lg px-2.5 py-1 focus:outline-none focus:border-ember-500 cursor-pointer"
                      >
                        {LEAD_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A'}
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
