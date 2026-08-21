import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { AuthShell, lightInputClass } from './AuthShell'
import { cn } from '../../../lib/cn'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
  }

  return (
    <AuthShell>
      {sent ? (
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink-950">Check your inbox.</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
            We sent a password reset link to <span className="font-semibold text-ink-900">{email}</span>.
            It expires in 30 minutes.
          </p>
          <Button to="/login" variant="outline" className="mt-7 w-full">
            Back to sign in
          </Button>
        </div>
      ) : (
        <>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-ember-600">
            Reset password
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950">Forgot your password?</h1>
          <p className="mt-2 text-[15px] text-ink-500">
            Enter your email and we’ll send you a link to reset it.
          </p>

          {error && (
            <p role="alert" className="mt-5 rounded-xl border border-ember-600/30 bg-ember-500/10 px-4 py-3 text-sm font-medium text-ember-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <div>
              <label htmlFor="fp-email" className="mb-1.5 block font-display text-[13px] font-semibold text-ink-900">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className={cn(lightInputClass, 'pl-10')}
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Sending link…
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to sign in
          </Link>
        </>
      )}
    </AuthShell>
  )
}
