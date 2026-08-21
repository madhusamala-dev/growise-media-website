import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { fetchCurrentUser } from '../../lib/authService'
import { isGoogleOAuthConfigured } from '../../lib/authConfig'
import { AuthShell } from './AuthShell'

const hasErrorParam = (search: string) => new URLSearchParams(search).get('error') !== null

type CallbackState = 'verifying' | 'no-session' | 'unconfigured' | 'error'

/**
 * Where Spring Boot redirects the browser after Google login.
 * The backend has already verified the Google identity and issued a
 * session — this page only hydrates it via /api/auth/me. It never
 * creates a session by itself.
 */
export function OAuthCallback() {
  const { establishSession } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const search = searchParams.toString()
  const [state, setState] = useState<CallbackState>(
    isGoogleOAuthConfigured ? 'verifying' : 'unconfigured'
  )

  useEffect(() => {
    if (!isGoogleOAuthConfigured) return

    let cancelled = false

    async function verify() {
      try {
        if (hasErrorParam(search)) {
          setState('no-session')
          return
        }
        const user = await fetchCurrentUser()
        if (cancelled) return
        if (!user) {
          setState('no-session')
          return
        }
        establishSession(user)
        navigate(user.onboardingComplete ? '/dashboard' : '/onboarding', { replace: true })
      } catch {
        if (!cancelled) setState('error')
      }
    }

    void verify()
    return () => {
      cancelled = true
    }
  }, [establishSession, navigate, search])

  if (state === 'verifying') {
    return (
      <AuthShell>
        <div className="flex flex-col items-center py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-ember-600" aria-hidden />
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink-950">
            Completing sign-in…
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Verifying your Google account with GroWise.
          </p>
        </div>
      </AuthShell>
    )
  }

  const heading =
    state === 'unconfigured'
      ? 'Google sign-in isn’t wired up yet'
      : 'We couldn’t sign you in'

  const body =
    state === 'unconfigured'
      ? 'Set VITE_GOOGLE_CLIENT_ID and VITE_API_BASE_URL in your environment, then point Google OAuth at your Spring Boot backend.'
      : state === 'no-session'
        ? 'Google didn’t return a valid session. Try signing in again.'
        : 'Something went wrong while verifying your account. Please try again.'

  return (
    <AuthShell>
      <div className="flex flex-col items-center py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ember-500/10">
          <AlertTriangle className="h-6 w-6 text-ember-600" aria-hidden />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink-950">
          {heading}
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">{body}</p>
        <Link
          to="/login"
          className="mt-6 rounded-full bg-ink-950 px-6 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-ink-800"
        >
          Back to login
        </Link>
      </div>
    </AuthShell>
  )
}
