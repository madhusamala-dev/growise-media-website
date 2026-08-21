import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuditHeader } from '../components/AuditHeader'
import { ScoreRing } from '../components/ScoreRing'
import { CategoryScoreCard } from '../components/CategoryScoreCard'
import { ProfileAuditCard } from '../components/ProfileAuditCard'
import { ContentDistributionChart } from '../components/ContentDistributionChart'
import { ReelsAuditCard } from '../components/ReelsAuditCard'
import { FindingCard } from '../components/FindingCard'
import { OpportunityCard } from '../components/OpportunityCard'
import { GrowthPlanView } from '../components/GrowthPlanView'
import { GrowiseCtaBanner } from '../components/GrowiseCtaBanner'
import { AuditOrchestrator } from '../services/auditOrchestrator'
import type { AuditReport } from '../types'
import {
  UserCheck,
  FileText,
  Video,
  Activity,
  Calendar,
  Sparkles,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react'

export function AuditReportPage() {
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
      }
      setIsLoading(false)
    }

    loadReport()
  }, [auditId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-sm">
        Loading audit report...
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

  const { profile, media, scores, findings, recommendations, growthPlan } = report

  const positiveFindings = findings.filter((f) => f.severity === 'POSITIVE')
  const problemFindings = findings.filter((f) => f.severity !== 'POSITIVE')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-ember-500 selection:text-white space-y-12 pb-24">
      <AuditHeader />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 space-y-12">
        {/* 1. Score & Immediate Executive Summary */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-left flex-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember-500/10 text-ember-400 border border-ember-500/30 text-xs font-bold uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5" />
                Verified AI Audit • @{profile.username}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                YOUR INSTAGRAM GROWTH SCORE
              </h1>
              <p className="text-base text-slate-300 leading-relaxed font-sans max-w-xl">
                Good — but there is significant room for growth. Your profile has strong raw assets, but conversion pathways and Reels frequency need optimization.
              </p>
            </div>

            <div className="shrink-0">
              <ScoreRing score={scores.overall_score} size={190} strokeWidth={14} />
            </div>
          </div>

          {/* 30-Second Glance Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800 pt-6">
            <a
              href="#working"
              className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  1. What is Working
                </span>
                <span className="text-sm font-bold text-white">
                  {positiveFindings.length} Key Strengths
                </span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </a>

            <a
              href="#problems"
              className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 hover:border-rose-500/40 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                  2. What Needs Attention
                </span>
                <span className="text-sm font-bold text-white">
                  {problemFindings.length} Critical Issues
                </span>
              </div>
              <AlertTriangle className="h-5 w-5 text-rose-400" />
            </a>

            <a
              href="#opportunities"
              className="p-4 rounded-2xl bg-ember-500/5 border border-ember-500/20 hover:border-ember-500/40 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ember-400 block">
                  3. What to do next
                </span>
                <span className="text-sm font-bold text-white">Top 3 Action Opportunities</span>
              </div>
              <ArrowRight className="h-5 w-5 text-ember-400" />
            </a>
          </div>
        </div>

        {/* 2. Category Score Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">7 Category Score Breakdown</h2>
            <span className="text-xs text-slate-500 font-mono">Weighted Algorithm Composite</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CategoryScoreCard
              title="Profile Setup"
              score={scores.profile_score}
              icon={UserCheck}
              weight="20%"
              description="Bio clarity, name optimization, and lead link setup."
            />
            <CategoryScoreCard
              title="Content Mix"
              score={scores.content_score}
              icon={FileText}
              weight="20%"
              description="Educational vs promotional content distribution."
            />
            <CategoryScoreCard
              title="Reels Strategy"
              score={scores.reels_score}
              icon={Video}
              weight="15%"
              description="Short-form video volume and view performance."
            />
            <CategoryScoreCard
              title="Engagement Rate"
              score={scores.engagement_score}
              icon={Activity}
              weight="15%"
              description="Interaction velocity relative to followers."
            />
            <CategoryScoreCard
              title="Consistency"
              score={scores.consistency_score}
              icon={Calendar}
              weight="10%"
              description="Weekly publishing frequency and scheduling gaps."
            />
            <CategoryScoreCard
              title="Brand Identity"
              score={scores.branding_score}
              icon={Sparkles}
              weight="10%"
              description="Visual consistency and tone of voice."
            />
            <CategoryScoreCard
              title="Conversion Path"
              score={scores.conversion_score}
              icon={Target}
              weight="10%"
              description="Lead magnet clarity and instant messaging response."
            />
          </div>
        </div>

        {/* 3. Profile Audit Section */}
        <section id="profile" className="space-y-4 pt-4">
          <h2 className="font-display text-2xl font-bold text-white">Profile Optimization Audit</h2>
          <ProfileAuditCard profile={profile} />
        </section>

        {/* 4. Content Distribution Section */}
        <section id="content" className="space-y-4 pt-4">
          <h2 className="font-display text-2xl font-bold text-white">Content Strategy Analysis</h2>
          <ContentDistributionChart media={media} />
        </section>

        {/* 5. Reels Audit Section */}
        <section id="reels" className="space-y-4 pt-4">
          <h2 className="font-display text-2xl font-bold text-white">Reels & Video Audit</h2>
          <ReelsAuditCard media={media} />
        </section>

        {/* 6. Strengths: What's Working */}
        <section id="working" className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <h2 className="font-display text-2xl font-bold text-white">What's Working</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positiveFindings.map((finding) => (
              <FindingCard key={finding.title} finding={finding} />
            ))}
          </div>
        </section>

        {/* 7. Problems: What Needs Attention */}
        <section id="problems" className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
            <h2 className="font-display text-2xl font-bold text-white">What Needs Attention</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problemFindings.map((finding) => (
              <FindingCard key={finding.title} finding={finding} />
            ))}
          </div>
        </section>

        {/* 8. Top Growth Opportunities */}
        <section id="opportunities" className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-400" />
            <h2 className="font-display text-2xl font-bold text-white">
              Your Biggest Growth Opportunities
            </h2>
          </div>
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((opp, i) => (
              <OpportunityCard key={opp.title} opportunity={opp} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* 9. 30-Day Growth Plan */}
        <section id="plan" className="space-y-4 pt-4">
          <GrowthPlanView plan={growthPlan} />
        </section>

        {/* 10. Growise CTA Banner */}
        <section className="pt-8">
          <GrowiseCtaBanner />
        </section>
      </main>
    </div>
  )
}
