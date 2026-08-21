import { useState } from 'react'
import { CheckCircle2, Lock, Sparkles, ArrowRight } from 'lucide-react'
import type { AuditLead } from '../types'

interface LeadCaptureFormProps {
  auditId: string
  opportunityCount?: number
  onSubmitSuccess: (lead: AuditLead) => void
  onCancel?: () => void
}

export function LeadCaptureForm({
  auditId,
  opportunityCount = 11,
  onSubmitSuccess,
  onCancel,
}: LeadCaptureFormProps) {
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [industry, setIndustry] = useState('')
  const [city, setCity] = useState('')
  const [consent, setConsent] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdLead, setCreatedLead] = useState<AuditLead | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Full Name is required')
      return
    }
    if (!businessName.trim()) {
      setError('Business Name is required')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (!consent) {
      setError('Please accept the consent terms to receive your report')
      return
    }

    setIsLoading(true)

    try {
      const { AuditOrchestrator } = await import('../services/auditOrchestrator')
      const orchestrator = new AuditOrchestrator()

      const lead = await orchestrator.captureLead(auditId, {
        name: name.trim(),
        business_name: businessName.trim(),
        email: email.trim().toLowerCase(),
        whatsapp: whatsapp.trim() || undefined,
        industry: industry.trim() || undefined,
        city: city.trim() || undefined,
        consent,
      })

      setCreatedLead(lead)
      setIsSuccess(true)
      onSubmitSuccess(lead)
    } catch (err: any) {
      setError(err?.message || 'Failed to submit lead form. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess && createdLead) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-5 animate-fade-in shadow-2xl">
        <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Audit Unlocked
          </span>
          <h3 className="font-display text-2xl font-bold text-white mt-1">You're All Set!</h3>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            Your complete Instagram Growth Plan is unlocked. Growise experts will also review your report and reach out to help you scale.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-display font-bold text-base px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-95"
        >
          <span>View My Complete Audit</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-ember-500/40 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="h-32 w-32 text-ember-500" />
      </div>

      <div className="text-center max-w-md mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember-500/10 text-ember-400 border border-ember-500/30 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          {opportunityCount} Growth Opportunities Found
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
          Want Your Complete Growise Growth Plan?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Enter your business details to unlock full recommendations, Reel scripts & 30-day strategy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-medium">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Your Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Madhu Samala"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ember-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. GroWise Media"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ember-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Work Email *</label>
            <input
              type="email"
              required
              placeholder="name@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ember-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Phone</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ember-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-ember-500"
            >
              <option value="">Select Industry...</option>
              <option value="Food & Beverage">Food & Beverage / Cafe</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Fitness & Health">Fitness & Health</option>
              <option value="Real Estate">Real Estate</option>
              <option value="E-Commerce & Retail">E-Commerce & Retail</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">City</label>
            <input
              type="text"
              placeholder="e.g. Hyderabad / Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ember-500"
            />
          </div>
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-800 text-ember-500 focus:ring-ember-500 bg-slate-950"
          />
          <label htmlFor="consent" className="text-xs text-slate-400 leading-normal cursor-pointer select-none">
            I agree to be contacted by Growise regarding my Instagram audit and growth strategy services.
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 font-display font-bold text-white text-base shadow-lg shadow-ember-500/25 hover:from-ember-600 hover:to-ember-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Unlocking Growth Plan...</span>
          ) : (
            <>
              <span>Get My Complete Growth Plan</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          <span>Your information is 100% secure and never shared.</span>
        </p>
      </form>
    </div>
  )
}
