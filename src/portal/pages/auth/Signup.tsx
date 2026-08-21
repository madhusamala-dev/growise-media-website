import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { useAuth } from '../../lib/auth'
import { AuthShell, lightInputClass } from './AuthShell'
import { cn } from '../../../lib/cn'

interface SignupValues {
  fullName: string
  businessName: string
  email: string
  phone: string
  password: string
  confirm: string
}

const empty: SignupValues = { fullName: '', businessName: '', email: '', phone: '', password: '', confirm: '' }

export function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<SignupValues>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof SignupValues, string>>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = <K extends keyof SignupValues>(key: K, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof SignupValues, string>> = {}
    if (form.fullName.trim().length < 2) next.fullName = 'Please enter your full name'
    if (!form.businessName.trim()) next.businessName = 'Please enter your business name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Enter a valid email'
    if (!/^[+]?[0-9\s\-()]{7,20}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    if (form.password.length < 6) next.password = 'Use at least 6 characters'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setError('')
    setLoading(true)
    const result = await signup(form)
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'Could not create your account.')
      return
    }
    navigate('/onboarding', { replace: true })
  }

  return (
    <AuthShell>
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-ember-600">
        Get started
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950">
        Start your social presence.
      </h1>
      <p className="mt-2 text-[15px] text-ink-500">
        Tell us a little about you and your business — then we’ll build your content plan.
      </p>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-ember-600/30 bg-ember-500/10 px-4 py-3 text-sm font-medium text-ember-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="su-name" className="mb-1.5 block font-display text-[13px] font-semibold text-ink-900">
              Full name
            </label>
            <input
              id="su-name"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="Ananya Rao"
              aria-invalid={!!errors.fullName}
              className={cn(lightInputClass, errors.fullName && 'border-ember-600')}
            />
            {errors.fullName && <p className="mt-1 text-xs font-medium text-ember-700">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="su-business" className="mb-1.5 block font-display text-[13px] font-semibold text-ink-900">
              Business name
            </label>
            <input
              id="su-business"
              value={form.businessName}
              onChange={(e) => set('businessName', e.target.value)}
              placeholder="Revive Physiotherapy"
              aria-invalid={!!errors.businessName}
              className={cn(lightInputClass, errors.businessName && 'border-ember-600')}
            />
            {errors.businessName && <p className="mt-1 text-xs font-medium text-ember-700">{errors.businessName}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="su-email" className="mb-1.5 block font-display text-[13px] font-semibold text-ink-900">
              Email
            </label>
            <input
              id="su-email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="you@business.com"
              aria-invalid={!!errors.email}
              className={cn(lightInputClass, errors.email && 'border-ember-600')}
            />
            {errors.email && <p className="mt-1 text-xs font-medium text-ember-700">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="su-phone" className="mb-1.5 block font-display text-[13px] font-semibold text-ink-900">
              Phone / WhatsApp
            </label>
            <input
              id="su-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+91 98450 12345"
              aria-invalid={!!errors.phone}
              className={cn(lightInputClass, errors.phone && 'border-ember-600')}
            />
            {errors.phone && <p className="mt-1 text-xs font-medium text-ember-700">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="su-password" className="mb-1.5 block font-display text-[13px] font-semibold text-ink-900">
              Password
            </label>
            <input
              id="su-password"
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="At least 6 characters"
              aria-invalid={!!errors.password}
              className={cn(lightInputClass, errors.password && 'border-ember-600')}
            />
            {errors.password && <p className="mt-1 text-xs font-medium text-ember-700">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="su-confirm" className="mb-1.5 block font-display text-[13px] font-semibold text-ink-900">
              Confirm password
            </label>
            <input
              id="su-confirm"
              type="password"
              value={form.confirm}
              onChange={(e) => set('confirm', e.target.value)}
              placeholder="Repeat your password"
              aria-invalid={!!errors.confirm}
              className={cn(lightInputClass, errors.confirm && 'border-ember-600')}
            />
            {errors.confirm && <p className="mt-1 text-xs font-medium text-ember-700">{errors.confirm}</p>}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Creating account…
            </>
          ) : (
            <>
              <Check className="h-4 w-4" aria-hidden />
              Create my account
            </>
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-ember-600 hover:text-ember-700">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
