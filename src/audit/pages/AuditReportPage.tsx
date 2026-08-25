import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuditHeader } from '../components/AuditHeader'
import { ScoreRing } from '../components/ScoreRing'
import { GrowiseCtaBanner } from '../components/GrowiseCtaBanner'
import { AuditOrchestrator } from '../services/auditOrchestrator'
import { getStoredLevel2Report } from '../types/level2'
import { generateInsights, getOpportunityCategoryLabel, getOpportunityIcon } from '../utils/insights'
import { formatCompact, formatPercent, formatDate, formatDateRange, getScoreLabel, getScoreColor } from '../utils/formatting'
import { splitReelPerformers } from '../utils/reelPerformance'
import type { AuditReport } from '../types'
import type { Level2AuditReport, RankedReel } from '../types/level2'
import {
  CheckCircle2,
  Flame,
  ExternalLink,
  Play,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Trophy,
  TrendingDown,
  Lightbulb,
  Sparkles,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHT CARD
// ─────────────────────────────────────────────────────────────────────────────

function InsightCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
      <span className="text-2xl">{icon}</span>
      <h4 className="font-display font-bold text-sm text-white">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REEL CARD
// ─────────────────────────────────────────────────────────────────────────────

function ReelCard({ reel, variant }: { reel: RankedReel; variant: 'top' | 'bottom' }) {
  const isTop = variant === 'top'
  return (
    <div className={`flex-shrink-0 w-[340px] rounded-2xl bg-slate-900 border overflow-hidden transition-all hover:shadow-xl hover:-translate-y-0.5 ${
      isTop ? 'border-emerald-500/20 hover:border-emerald-500/40' : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Reel visual area */}
      <div className={`relative h-44 flex items-center justify-center ${
        isTop ? 'bg-gradient-to-br from-emerald-900/30 to-slate-900' : 'bg-gradient-to-br from-slate-800 to-slate-900'
      }`}>
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Play className="h-10 w-10" />
          <span className="text-[10px] font-bold uppercase tracking-wider">▶ REEL</span>
        </div>
        {/* Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
          isTop
            ? 'bg-emerald-500/90 text-white'
            : 'bg-slate-700/90 text-slate-300'
        }`}>
          {isTop ? <Trophy className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          #{reel.rank} {isTop ? 'TOP' : 'LOWER'} PERFORMER
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Caption */}
        {reel.caption && (
          <p className="text-sm text-slate-200 font-medium leading-relaxed line-clamp-2">
            {reel.caption}
          </p>
        )}

        {/* Date */}
        <p className="text-[11px] text-slate-500 font-mono">{formatDate(reel.timestamp)}</p>

        {/* Metrics row */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">❤️ {formatCompact(reel.likes)}</span>
          <span className="text-slate-400">💬 {formatCompact(reel.comments)}</span>
          {reel.views != null && (
            <span className="text-slate-400">▶ {formatCompact(reel.views)}</span>
          )}
        </div>

        {/* Rate badges */}
        <div className="flex items-center gap-2">
          {reel.engagementRate != null && (
            <div className="flex-1 p-2 rounded-xl bg-slate-800/80 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Engagement Rate</p>
              <p className={`font-display font-bold text-sm ${isTop ? 'text-emerald-400' : 'text-slate-300'}`}>
                {formatPercent(reel.engagementRate)}
              </p>
            </div>
          )}
          {reel.viewRate != null && (
            <div className="flex-1 p-2 rounded-xl bg-slate-800/80 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase">View Rate</p>
              <p className={`font-display font-bold text-sm ${isTop ? 'text-blue-400' : 'text-slate-300'}`}>
                {formatPercent(reel.viewRate)}
              </p>
            </div>
          )}
        </div>

        {/* Instagram link */}
        {reel.permalink && (
          <a
            href={reel.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 font-bold transition-colors"
          >
            View on Instagram <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REEL CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────

function ReelCarousel({ reels, variant }: { reels: RankedReel[]; variant: 'top' | 'bottom' }) {
  const [scrollPos, setScrollPos] = useState(0)
  const containerRef = useState<HTMLDivElement | null>(null)[1]
  const scrollAmount = 360

  const scroll = (dir: 'left' | 'right') => {
    const el = document.getElementById(`reel-carousel-${variant}`)
    if (!el) return
    const newPos = dir === 'right' ? scrollPos + scrollAmount : scrollPos - scrollAmount
    el.scrollTo({ left: newPos, behavior: 'smooth' })
    setScrollPos(newPos)
  }

  if (reels.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
        <p className="text-slate-500 text-sm">No Reels were found during this audit period.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Cards */}
      <div
        id={`reel-carousel-${variant}`}
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {reels.map((reel) => (
          <div key={reel.mediaId} style={{ scrollSnapAlign: 'start' }}>
            <ReelCard reel={reel} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// METRIC CARD
// ─────────────────────────────────────────────────────────────────────────────

function MetricCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub?: string }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display font-bold text-xl text-white">{value}</p>
      {sub && <p className="text-[11px] text-slate-500 font-mono">{sub}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPPORTUNITY CARD
// ─────────────────────────────────────────────────────────────────────────────

function OpportunityRow({ opp, rank }: { opp: { title: string; description: string; impact: string; effort: string; category: string; evidence: Record<string, unknown> }; rank: number }) {
  const categoryLabel = getOpportunityCategoryLabel(opp.category)
  const icon = getOpportunityIcon(opp.category)

  const evidenceEntries = Object.entries(opp.evidence).slice(0, 4)

  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
      {/* Rank number */}
      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 text-white font-display font-black text-lg">
        {rank}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-ember-400">{categoryLabel}</span>
        </div>
        <h4 className="font-display font-bold text-base text-white">{opp.title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{opp.description}</p>

        {/* Evidence */}
        {evidenceEntries.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            {evidenceEntries.map(([k, v]) => (
              <span key={k} className="text-[11px] text-slate-500 font-mono">
                <span className="text-slate-600">{k.replace(/([A-Z])/g, ' $1').trim()}: </span>
                <span className="text-slate-400">{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Impact/Effort badges */}
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
          opp.impact === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
          opp.impact === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
          'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          Impact: {opp.impact}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
          opp.effort === 'LOW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
          opp.effort === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
          'bg-rose-500/10 text-rose-400 border-rose-500/30'
        }`}>
          Effort: {opp.effort}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function AuditReportPage() {
  const { auditId } = useParams<{ auditId: string }>()
  const navigate = useNavigate()

  const [report, setReport] = useState<AuditReport | null>(null)
  const [level2Report, setLevel2Report] = useState<Level2AuditReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!auditId) return
    const loadReport = async () => {
      const l2 = getStoredLevel2Report(auditId)
      setLevel2Report(l2)
      const orchestrator = new AuditOrchestrator()
      const data = await orchestrator.getAuditReport(auditId)
      if (data) setReport(data)
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
        <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl bg-ember-500 text-white font-bold">Return to Home</button>
      </div>
    )
  }

  const l2 = level2Report
  if (!l2) {
    // Fallback for mock/demo audits — show basic legacy report
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-ember-500 selection:text-white space-y-12 pb-24">
        <AuditHeader />
        <main className="max-w-6xl mx-auto px-4 lg:px-8 space-y-12">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <h1 className="font-display text-3xl font-extrabold">Demo Audit Report</h1>
            <p className="text-slate-400">This is a demo audit. Run a real audit to see the full analytics report.</p>
            <ScoreRing score={report.scores.overall_score} size={170} strokeWidth={12} />
          </div>
          <GrowiseCtaBanner />
        </main>
      </div>
    )
  }

  // ── Level-2 data (real audit) ──────────────────────────────────────────────
  const { profile, score, metrics, contentAnalysis, opportunities, auditWindow } = l2
  // Older cached reports can list the same Reel as both a top and a lower performer.
  const { best: bestPerformingReels, worst: worstPerformingReels } = splitReelPerformers(
    l2.bestPerformingReels,
    l2.worstPerformingReels,
  )
  const consistency = contentAnalysis.postingConsistency
  const captionStats = contentAnalysis.captionStats
  const contentMix = contentAnalysis.contentMix
  const insights = generateInsights({ ...l2, bestPerformingReels, worstPerformingReels })

  const scoreLabel = getScoreLabel(score.total)
  const scoreColor = getScoreColor(score.total)

  // Dynamic summary text
  const summaryText =
    score.rating === 'EXCELLENT'
      ? 'Your Instagram is performing exceptionally well. These insights will help you compound your growth.'
      : score.rating === 'GOOD'
      ? 'You\'re creating content consistently, and a few Reels are performing extremely well. Focus on replicating your winning topics.'
      : score.rating === 'NEEDS IMPROVEMENT'
      ? 'You\'re creating content consistently, but only a small portion of your Reels are driving significant reach and engagement.'
      : 'Your Instagram has significant growth potential. The data below shows exactly where to focus for maximum impact.'

  // Reels percentage from content mix
  const reelsPercentage = Math.round(contentMix.reelsPercentage)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-ember-500 selection:text-white space-y-8 pb-24">
      <AuditHeader />

      <main className="max-w-[1300px] mx-auto px-4 lg:px-8 space-y-8">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION 1 — GROWTH SCORE HERO                                    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Header row */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember-500/10 text-ember-400 border border-ember-500/30 text-xs font-bold uppercase tracking-wider w-fit">
              <Flame className="h-3.5 w-3.5" />
              Audit Completed for @{profile.username}
            </span>
            <div className="flex flex-col items-start sm:items-end">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Verified Audit</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 sm:text-right">Based on real Instagram data</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Score ring */}
            <div className="flex flex-col items-center shrink-0">
              <ScoreRing score={score.total} size={180} strokeWidth={14} />
              <p className={`font-display font-black text-lg mt-2 ${scoreColor}`}>{scoreLabel}</p>
            </div>

            {/* Summary + facts */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  YOUR INSTAGRAM GROWTH SCORE
                </h1>
                <p className="text-base text-slate-300 leading-relaxed font-sans mt-3 max-w-2xl">
                  {summaryText}
                </p>
              </div>

              {/* Account facts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <p className="font-display font-bold text-xl text-white">{auditWindow.postsAnalyzed}</p>
                  <p className="text-[11px] text-slate-400">Posts Analyzed</p>
                  <p className="text-[10px] text-slate-500 font-mono">in last {auditWindow.days} days</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <p className="font-display font-bold text-xl text-white">{auditWindow.days}-day Window</p>
                  <p className="text-[11px] text-slate-400">{formatDateRange(auditWindow.start, auditWindow.end)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <p className="font-display font-bold text-xl text-white">{formatCompact(profile.followers)}</p>
                  <p className="text-[11px] text-slate-400">Followers</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <p className="font-display font-bold text-xl text-white">{reelsPercentage}%</p>
                  <p className="text-[11px] text-slate-400">Reels Content</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION 2 — PERFORMANCE SNAPSHOT                                 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-ember-400" />
            <h2 className="font-display text-xl font-bold text-white">Performance Snapshot</h2>
          </div>
          <p className="text-sm text-slate-400">Overview of your Instagram performance during the audit period.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <MetricCard icon={<Play className="h-3.5 w-3.5" />} value={String(metrics.reelsAnalyzed)} label="Reels Analyzed" />
            <MetricCard icon={<span className="text-xs">👁️</span>} value={formatCompact(metrics.averageViews)} label="Avg Views" sub="per post" />
            <MetricCard icon={<span className="text-xs">👁️</span>} value={formatCompact(metrics.medianViews)} label="Median Views" sub="per post" />
            <MetricCard icon={<span className="text-xs">❤️</span>} value={formatCompact(metrics.averageLikes)} label="Avg Likes" />
            <MetricCard icon={<span className="text-xs">❤️</span>} value={formatCompact(metrics.medianLikes)} label="Median Likes" />
            <MetricCard icon={<span className="text-xs">📈</span>} value={formatPercent(metrics.averageEngagementRate)} label="Avg Engagement Rate" />
            <MetricCard icon={<span className="text-xs">📈</span>} value={formatPercent(metrics.medianEngagementRate)} label="Median Engagement Rate" />
            <MetricCard icon={<span className="text-xs">📅</span>} value={consistency.averagePostsPerWeek.toFixed(1)} label="Posts / Week" />
            <MetricCard icon={<span className="text-xs">#️⃣</span>} value={contentAnalysis.captionStats.averageHashtagsPerPost.toFixed(1)} label="Avg Hashtags / Post" />
            <MetricCard icon={<span className="text-xs">📢</span>} value={`${Math.round(captionStats.CTAUsagePercentage)}%`} label="CTA Usage" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION 3 — TOP PERFORMING REELS                                 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h2 className="font-display text-xl font-bold text-white">Top Performing Reels</h2>
            </div>
            {bestPerformingReels.length > 3 && (
              <span className="text-xs text-slate-500 font-mono">View all {bestPerformingReels.length} →</span>
            )}
          </div>
          <p className="text-sm text-slate-400">Your strongest content from the audit period.</p>
          <ReelCarousel reels={bestPerformingReels} variant="top" />
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION 4 — LOWER PERFORMING REELS                               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-slate-400" />
              <h2 className="font-display text-xl font-bold text-white">Lower Performing Reels</h2>
            </div>
            {worstPerformingReels.length > 3 && (
              <span className="text-xs text-slate-500 font-mono">View all {worstPerformingReels.length} →</span>
            )}
          </div>
          <p className="text-sm text-slate-400">Content that generated comparatively lower engagement during the audit period.</p>
          <ReelCarousel reels={worstPerformingReels} variant="bottom" />
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION 5 — WHAT WE LEARNED                                      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {insights.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <h2 className="font-display text-xl font-bold text-white">What We Learned From Your Content</h2>
            </div>
            <p className="text-sm text-slate-400">Key patterns we found in your Instagram performance.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {insights.map((insight, i) => (
                <InsightCard key={i} {...insight} />
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION 6 — GROWTH OPPORTUNITIES                                 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2 className="font-display text-xl font-bold text-white">
                Your Top {Math.min(opportunities.length, 5)} Growth Opportunit{Math.min(opportunities.length, 5) === 1 ? 'y' : 'ies'}
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">View Full Opportunity Report →</span>
          </div>
          <p className="text-sm text-slate-400">Prioritized recommendations based on the patterns found in your Instagram data.</p>
          <div className="space-y-3">
            {opportunities.slice(0, 5).map((opp, i) => (
              <OpportunityRow key={opp.rule} opp={opp} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* VERIFIED AUDIT FOOTER                                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold text-slate-300">Verified using Instagram content retrieved through Meta's Instagram Graph API.</span>
          </div>
          <p className="text-xs text-slate-500">All performance metrics are calculated from your actual Instagram content during the audit period.</p>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CTA BANNER                                                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section>
          <GrowiseCtaBanner />
        </section>
      </main>
    </div>
  )
}
