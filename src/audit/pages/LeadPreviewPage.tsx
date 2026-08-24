import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuditHeader } from '../components/AuditHeader'
import { ScoreRing } from '../components/ScoreRing'
import { LeadCaptureForm } from '../components/LeadCaptureForm'
import { OpportunityCard } from '../components/OpportunityCard'
import { AuditOrchestrator } from '../services/auditOrchestrator'
import { getStoredLevel2Report } from '../types/level2'
import type { AuditReport } from '../types'
import type { Level2AuditReport } from '../types/level2'
import { ShieldCheck } from 'lucide-react'

export function LeadPreviewPage() {
  const { auditId } = useParams<{ auditId: string }>()
  const navigate = useNavigate()

  const [report, setReport] = useState<AuditReport | null>(null)
  const [level2Report, setLevel2Report] = useState<Level2AuditReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!auditId) return

    const loadReport = async () => {
      // Load Level-2 report first (real data from Meta API)
      const l2 = getStoredLevel2Report(auditId)
      setLevel2Report(l2)

      const orchestrator = new AuditOrchestrator()
      const data = await orchestrator.getAuditReport(auditId)
      if (data) {
        setReport(data)
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

  // ── Use Level-2 data when available ────────────────────────────────────────
  const displayScore = level2Report ? level2Report.score.total : scores.overall_score
  const displayUsername = level2Report ? level2Report.profile.username : profile.username

  // Real opportunity count from Level-2 engine (deterministic, evidence-based)
  const opportunityCount = level2Report
    ? level2Report.opportunities.length
    : recommendations.length

  // Build opportunity list for display
  const displayOpportunities = level2Report
    ? level2Report.opportunities.slice(0, 3).map((opp, i) => ({
        id: `opp_${opp.rule}`,
        title: opp.title,
        description: opp.description,
        impact: opp.impact,
        effort: opp.effort,
        category: opp.category,
        priority: i + 1,
        evidence: opp.evidence,
      }))
    : recommendations.slice(0, 3)

  // Score-based insight text (derived from score, not hardcoded)
  const scoreRating = level2Report ? level2Report.score.rating : null
  const insightText =
    scoreRating === 'EXCELLENT'
      ? 'Your Instagram presence is performing exceptionally well. These opportunities can make it even stronger.'
      : scoreRating === 'GOOD'
      ? 'Your Instagram is performing well — but there are clear opportunities to accelerate growth.'
      : scoreRating === 'NEEDS IMPROVEMENT'
      ? 'There is significant potential to improve your Instagram performance. These opportunities will help you get there.'
      : 'Your Instagram has major growth potential. These opportunities can transform your results quickly.'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-ember-500 selection:text-white space-y-12 pb-20">
      <AuditHeader />

      <main className="max-w-4xl mx-auto px-4 lg:px-8 space-y-10">
        {/* Top Banner Score Preview */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-ember-400">
              Audit Completed for @{displayUsername}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              YOUR INSTAGRAM GROWTH SCORE
            </h1>
          </div>

          <div className="py-2">
            <ScoreRing score={displayScore} size={170} strokeWidth={12} />
          </div>

          {level2Report && (
            <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-slate-400">
              <span>{level2Report.auditWindow.postsAnalyzed} posts analyzed</span>
              <span>•</span>
              <span>{level2Report.auditWindow.days}-day window</span>
              <span>•</span>
              <span>{level2Report.profile.followers.toLocaleString()} followers</span>
            </div>
          )}

          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {insightText}
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
                We Found {opportunityCount} Growth Opportunit{opportunityCount === 1 ? 'y' : 'ies'} on Your Instagram
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <ShieldCheck className="h-4 w-4" />
              Verified Audit
            </span>
          </div>

          {/* Top 3 Opportunities */}
          <div className="space-y-4">
            {displayOpportunities.map((opp, index) => (
              <OpportunityCard key={opp.id || opp.title} opportunity={opp} rank={index + 1} />
            ))}
          </div>
        </div>

        {/* Lead Capture Gated Container */}
        <div id="lead-form-section" className="pt-4">
          <LeadCaptureForm
            auditId={session.id}
            opportunityCount={opportunityCount}
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
