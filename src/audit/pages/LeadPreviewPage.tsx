import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuditHeader } from '../components/AuditHeader'
import { ScoreRing } from '../components/ScoreRing'
import { LeadCaptureForm } from '../components/LeadCaptureForm'
import { OpportunityCard } from '../components/OpportunityCard'
import { AuditOrchestrator } from '../services/auditOrchestrator'
import type { AuditReport } from '../types'
import { ShieldCheck } from 'lucide-react'

export function LeadPreviewPage() {
  const { auditId } = useParams<{ auditId: string }>()
  const navigate = useNavigate()

  const [report, setReport] = useState<AuditReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!auditId) return

    const loadReport = async () => {
      const orchestrator = new AuditOrchestrator()
      const data = await orchestrator.getAuditReport(auditId)
      if (data) {
        setReport(data)
        // If lead already captured, navigate directly to full report
        if (data.lead) {
          navigate(`/audit/${auditId}`)
        }
      }
      setIsLoading(false)
    }

    loadReport()
  }, [auditId, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-sm">
        Loading preview...
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 space-y-4">
        <h2 className="text-2xl font-bold">Audit Report Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-ember-500 text-white font-bold"
        >
          Return to Home
        </button>
      </div>
    )
  }

  const { session, profile, scores, recommendations } = report

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-ember-500 selection:text-white space-y-12 pb-20">
      <AuditHeader />

      <main className="max-w-4xl mx-auto px-4 lg:px-8 space-y-10">
        {/* Top Banner Score Preview */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-ember-400">
              Audit Completed for @{profile.username}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              YOUR INSTAGRAM GROWTH SCORE
            </h1>
          </div>

          <div className="py-2">
            <ScoreRing score={scores.overall_score} size={170} strokeWidth={12} />
          </div>

          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Good — but there is significant room for growth. We identified top operational and content optimization areas.
          </p>
        </div>

        {/* Opportunities Preview Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ember-400">
                Found Opportunities
              </span>
              <h2 className="font-display text-2xl font-bold text-white">
                We Found {recommendations.length * 2 + 1} Opportunities On Your Instagram
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <ShieldCheck className="h-4 w-4" />
              Verified Audit
            </span>
          </div>

          {/* Top 3 Opportunities */}
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((opp, index) => (
              <OpportunityCard key={opp.title} opportunity={opp} rank={index + 1} />
            ))}
          </div>
        </div>

        {/* Lead Capture Gated Container */}
        <div id="lead-form-section" className="pt-4">
          <LeadCaptureForm
            auditId={session.id}
            opportunityCount={recommendations.length * 2 + 1}
            onSubmitSuccess={() => {
              setTimeout(() => {
                navigate(`/audit/${session.id}`)
              }, 1200)
            }}
          />
        </div>
      </main>
    </div>
  )
}
