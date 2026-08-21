import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { DEMO_EMAIL, DEMO_PASSWORD, useAuth } from '../../lib/auth'
import { startGoogleSignIn } from '../../lib/authService'
import { AuthShell, lightInputClass } from './AuthShell'
import { cn } from '../../../lib/cn'

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.6z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5l-3.8 3C3.3 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.1 14.4a7.7 7.7 0 0 1 0-4.8L1.3 6.6a11.5 11.5 0 0 0 0 10.8l3.8-3z" />
      <path fill="#EA4335" d="M12 4.6c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l3.8 3c1-2.9 3.7-5 6.9-5z" />
    </svg>
  )
}

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleUnconfigured, setGoogleUnconfigured] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const from = (location.state as { from?: string } | null)?.from

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'Could not sign you in.')
      return
    }
    navigate(from ?? '/dashboard', { replace: true })
  }

  const useDemo = () => {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError('')
  }

  const handleGoogle = async () => {
    setGoogleUnconfigured(false)
    setGoogleLoading(true)
    const result = await startGoogleSignIn()
    setGoogleLoading(false)

    if (result.status === 'configured') {
      // Full-page navigation to Spring Boot → Google OAuth. The backend
      // verifies the identity and redirects back to /auth/callback.
      window.location.assign(result.authorizeUrl)
      return
    }

    // Unconfigured: never fake a login. Show a clear dev message instead.
    setGoogleUnconfigured(true)
  }

  return (
    <AuthShell>
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-ember-600">
        Client login
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950">Welcome back.</h1>
      <p className="mt-2 text-[15px] text-ink-500">
        Your content is being planned, created and published. Sign in to see it.
      </p>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-ember-600/30 bg-ember-500/10 px-4 py-3 text-sm font-medium text-ember-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block font-display text-[13px] font-semibold text-ink-900">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className={cn(lightInputClass, 'pl-10')}
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="block font-display text-[13px] font-semibold text-ink-900">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-ember-600 hover:text-ember-700">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(lightInputClass, 'pl-10 pr-11')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-950"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-paper-300 accent-ember-500"
          />
          Remember me
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-paper-200" />
        <span className="text-xs font-medium text-ink-400">or</span>
        <span className="h-px flex-1 bg-paper-200" />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-2.5 rounded-full border border-paper-300 bg-white py-3 text-[15px] font-semibold text-ink-900 transition-all duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-white disabled:cursor-wait disabled:opacity-70"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <GoogleMark />
          )}
          Continue with Google
        </button>
        {googleUnconfigured && (
          <p
            role="status"
            className="rounded-xl border border-gold-500/30 bg-gold-400/10 px-4 py-3 text-[13px] leading-relaxed text-ink-700"
          >
            Google sign-in isn’t connected yet — this is a development preview. No login was
            performed. Set <code className="rounded bg-ink-950/5 px-1.5 py-0.5 font-mono text-[12px]">VITE_API_BASE_URL</code>{' '}
            (and configure Google OAuth in Spring Boot) to enable the real flow. Use the demo
            account below for now.
          </p>
        )}
        <button
          type="button"
          onClick={useDemo}
          className="flex w-full items-center justify-center gap-2.5 rounded-full border border-paper-300 bg-white py-3 text-[15px] font-semibold text-ink-900 transition-all duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-white"
        >
          <Sparkles className="h-4 w-4 text-ember-500" aria-hidden />
          Try the demo account
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-ink-500">
        New to GroWise?{' '}
        <Link to="/signup" className="font-semibold text-ember-600 hover:text-ember-700">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
