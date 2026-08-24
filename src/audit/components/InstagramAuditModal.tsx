import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { normalizeInstagramUsername } from '../utils/usernameNormalizer'
import { LiveInstagramDataProvider } from '../providers/LiveInstagramDataProvider'
import { AuditOrchestrator } from '../services/auditOrchestrator'
import { AUDIT_CONFIG } from '../config/auditConfig'
import type { InstagramProfile } from '../types'

interface InstagramAuditModalProps {
  isOpen: boolean
  onClose: () => void
  initialUsername?: string
}

type FlowStep = 'INPUT' | 'FETCHING' | 'CONFIRM' | 'STARTING'

export function InstagramAuditModal({
  isOpen,
  onClose,
  initialUsername = '',
}: InstagramAuditModalProps) {
  const navigate = useNavigate()

  const [step, setStep] = useState<FlowStep>('INPUT')
  const [usernameInput, setUsernameInput] = useState(initialUsername || '')
  const [error, setError] = useState<string | null>(null)
  const [fetchedProfile, setFetchedProfile] = useState<InstagramProfile | null>(null)
  // Instagram User IDs returned by the edge function — never sent by the user
  const [instagramUserId, setInstagramUserId] = useState<string>('')
  const [rootInstagramUserId, setRootInstagramUserId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialUsername) {
      setUsernameInput(initialUsername.replace(/^@/, ''))
    }
  }, [initialUsername])

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('INPUT')
        setError(null)
        setFetchedProfile(null)
        setInstagramUserId('')
        setRootInstagramUserId('')
        setIsSubmitting(false)
      }, 300)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleFetchProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)

    const normalized = normalizeInstagramUsername(usernameInput)
    if (!normalized.isValid) {
      setError(normalized.error || 'Please enter a valid Instagram username')
      return
    }

    setStep('FETCHING')

    try {
      const provider = new LiveInstagramDataProvider()
      const profile = await provider.getProfile(normalized.username)

      // Capture Instagram User IDs from the provider cache (set by the edge function)
      const igUserId = provider.getInstagramUserId(normalized.username) ?? ''
      const rootIgUserId = provider.getRootInstagramUserId(normalized.username) ?? ''

      setFetchedProfile(profile)
      setInstagramUserId(igUserId)
      setRootInstagramUserId(rootIgUserId)
      setStep('CONFIRM')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not connect to Instagram API. Please try again.'
      setError(message)
      setStep('INPUT')
    }
  }

  const handleConfirmAndStartAudit = async () => {
    if (!fetchedProfile) return
    setIsSubmitting(true)
    setStep('STARTING')

    try {
      const orchestrator = new AuditOrchestrator()
      // Pass Instagram User IDs so the orchestrator can persist them server-side
      // for the Level-2 audit engine — the IDs come from our Edge Function, not from the user
      const session = await orchestrator.createAudit(
        fetchedProfile.username,
        instagramUserId || undefined,
        rootInstagramUserId || undefined,
      )
      onClose()
      navigate(`/audit/analyzing/${session.id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initiate audit session.'
      setError(message)
      setStep('CONFIRM')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 p-6 sm:p-8 space-y-6 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-ember-500/15 blur-3xl pointer-events-none"
          aria-hidden
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-ember-500/20 text-ember-400 border border-ember-500/30 flex items-center justify-center font-bold">
              <Sparkles className="h-4 w-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white leading-snug">
                Free AI Instagram Growth Audit
              </h3>
              <p className="text-xs text-slate-400">Step {step === 'INPUT' || step === 'FETCHING' ? '1 of 2' : '2 of 2'} — Instagram Profile Verification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* STEP 1: Username Input */}
        {step === 'INPUT' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                Enter your Instagram username:
              </label>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our AI growth engine will connect to Instagram to fetch public profile signals, Reels distribution metrics, and bio conversion readiness.
              </p>
            </div>

            <form onSubmit={handleFetchProfile} className="space-y-4">
              <div className="relative flex items-center rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-ember-500 focus-within:ring-2 focus-within:ring-ember-500/20 transition-all p-2">
                <span className="pl-3 text-slate-400 font-mono text-lg font-bold select-none">
                  @
                </span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value.replace(/^@/, ''))
                    if (error) setError(null)
                  }}
                  placeholder="yourusername"
                  className="w-full bg-transparent py-2.5 px-2 text-white font-mono text-base sm:text-lg focus:outline-none placeholder-slate-600 font-bold"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Quick Demo Pickers */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Sample Profiles for Testing:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AUDIT_CONFIG.demoAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setUsernameInput(acc.id)
                        setError(null)
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors"
                    >
                      @{acc.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!usernameInput.trim()}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-ember-500 to-ember-600 hover:from-ember-600 hover:to-ember-700 font-display font-bold text-white text-base shadow-lg shadow-ember-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                >
                  <span>Connect & Fetch Profile Details</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </form>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Safe • No Instagram password or login permissions required</span>
            </p>
          </div>
        )}

        {/* STEP 2: Fetching Progress State */}
        {step === 'FETCHING' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-ember-500 animate-spin" />
              <Sparkles className="h-6 w-6 text-amber-400 absolute" />
            </div>

            <div className="space-y-1">
              <h4 className="font-display font-bold text-lg text-white">Connecting to Instagram API...</h4>
              <p className="text-xs text-slate-400 font-mono">
                Fetching account profile data for <span className="text-ember-400 font-bold">@{usernameInput}</span>
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Profile Confirmation Card */}
        {step === 'CONFIRM' && fetchedProfile && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Instagram Account Found
              </span>
              <h4 className="font-display text-xl font-bold text-white">
                Is this your Instagram account?
              </h4>
              <p className="text-xs text-slate-400">
                Please confirm this is the profile you want to audit.
              </p>
            </div>

            {/* Profile Card Preview */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-inner">
              <div className="flex items-center gap-4">
                <img
                  src={fetchedProfile.profile_image_url}
                  alt={fetchedProfile.display_name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-ember-500/50 shadow-md"
                />
                <div>
                  <h5 className="font-display font-bold text-base text-white">
                    {fetchedProfile.display_name}
                  </h5>
                  <p className="text-xs font-mono text-ember-400 font-bold">
                    @{fetchedProfile.username}
                  </p>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {fetchedProfile.category}
                  </span>
                </div>
              </div>

              {/* Bio Preview */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-sans whitespace-pre-line leading-relaxed">
                {fetchedProfile.bio || <span className="text-slate-500 italic">No bio set</span>}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-800/80">
                <div className="p-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Followers
                  </span>
                  <span className="font-display font-bold text-white text-sm">
                    {fetchedProfile.followers_count.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 border-x border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Following
                  </span>
                  <span className="font-display font-bold text-white text-sm">
                    {fetchedProfile.following_count.toLocaleString()}
                  </span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Posts
                  </span>
                  <span className="font-display font-bold text-white text-sm">
                    {fetchedProfile.posts_count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirmation Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleConfirmAndStartAudit}
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 font-display font-bold text-slate-950 text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Initiating Audit...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-slate-950" />
                    <span>Yes, Confirm & Start Audit</span>
                    <ArrowRight className="h-5 w-5 text-slate-950" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('INPUT')}
                disabled={isSubmitting}
                className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 font-display font-bold text-slate-300 text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Change Username</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Starting Audit Transition */}
        {step === 'STARTING' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 text-ember-500 animate-spin mx-auto" />
            <h4 className="font-display font-bold text-lg text-white">Starting Instagram Growth Audit...</h4>
            <p className="text-xs text-slate-400 font-mono">
              Redirecting to live diagnostic processing for @{fetchedProfile?.username}...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
