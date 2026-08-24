import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { AuditOrchestrator } from '../services/auditOrchestrator'
import { AuditHeader } from '../components/AuditHeader'

const STAGES = [
  { id: 1, label: 'Loading audit session from database' },
  { id: 2, label: 'Connecting to Meta Business Discovery API' },
  { id: 3, label: 'Fetching recent Instagram media with pagination' },
  { id: 4, label: 'Filtering posts to 30-day audit window' },
  { id: 5, label: 'Computing engagement & view rate metrics' },
  { id: 6, label: 'Analyzing captions, CTAs & hashtags' },
  { id: 7, label: 'Scoring profile, content & consistency' },
  { id: 8, label: 'Generating evidence-based growth opportunities' },
]

export function AnalyzingPage() {
  const { auditId } = useParams<{ auditId: string }>()
  const navigate = useNavigate()

  const [activeStage, setActiveStage] = useState(1)
  const [progressPercent, setProgressPercent] = useState(10)
  const [stageText, setStageText] = useState('Initializing Instagram Audit...')

  useEffect(() => {
    if (!auditId) return

    let isMounted = true

    const runAuditProcessing = async () => {
      const orchestrator = new AuditOrchestrator()

      // Staged progress ticker
      const interval = setInterval(() => {
        setActiveStage((prev) => {
          if (prev < STAGES.length) {
            const next = prev + 1
            setProgressPercent(Math.round((next / STAGES.length) * 100))
            return next
          }
          return prev
        })
      }, 500)

      try {
        await orchestrator.processAudit(auditId, (stageMsg) => {
          if (isMounted) {
            setStageText(stageMsg)
          }
        })
      } catch (err) {
        console.error('Audit processing error:', err)
      } finally {
        clearInterval(interval)
        if (isMounted) {
          setTimeout(() => {
            navigate(`/audit/${auditId}`)
          }, 600)
        }
      }
    }

    runAuditProcessing()

    return () => {
      isMounted = false
    }
  }, [auditId, navigate])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <AuditHeader />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="h-32 w-32 text-ember-500" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ember-500/10 text-ember-400 border border-ember-500/30 text-xs font-bold uppercase tracking-wider">
              <Loader2 className="h-4 w-4 animate-spin text-ember-400" />
              <span>AI Growth Audit Engine</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Analyzing Your Instagram
            </h2>
            <p className="text-xs text-slate-400 font-mono">{stageText}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-ember-500 to-amber-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Evaluating Data</span>
              <span>{progressPercent}%</span>
            </div>
          </div>

          {/* Staged Checklist */}
          <div className="space-y-2.5 text-left border-t border-slate-800/80 pt-6">
            {STAGES.map((stage) => {
              const isDone = stage.id <= activeStage
              const isCurrent = stage.id === activeStage

              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                    isCurrent
                      ? 'bg-slate-950 border border-ember-500/30 text-white'
                      : isDone
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-700 shrink-0" />
                  )}
                  <span className="text-xs font-medium">{stage.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 font-mono">
        Growise Instagram Audit Engine v2.0 — Deterministic Analytics
      </footer>
    </div>
  )
}
