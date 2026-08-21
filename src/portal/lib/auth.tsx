import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { OnboardingData, SessionUser } from '../data/types'
import { demoClient } from '../data/demo'
import { signOut } from './authService'

const SESSION_KEY = 'growise.session'

/* ------------------------------------------------------------------ */
/*  Auth context.                                                      */
/*                                                                    */
/*  Two paths share this provider:                                     */
/*   1. REAL auth (Google OAuth → Spring Boot)  — see authService.ts.  */
/*      The backend verifies the Google identity and issues a session; */
/*      the SPA hydrates it via establishSession() from the OAuth      */
/*      callback. Never fakes a login.                                 */
/*   2. PROTOTYPE auth (email/password demo) — below. Clearly a mock   */
/*      for the demo experience; the shape mirrors a future REST       */
/*      auth endpoint so swapping is mechanical.                       */
/* ------------------------------------------------------------------ */

interface AuthResult {
  ok: boolean
  error?: string
}

interface AuthContextValue {
  user: SessionUser | null
  /** Establish a server-verified session (Google OAuth callback). */
  establishSession: (user: SessionUser) => void
  /** Prototype demo login — to be replaced by real backend auth. */
  login: (email: string, password: string) => Promise<AuthResult>
  /** Prototype demo signup — to be replaced by real backend auth. */
  signup: (data: {
    fullName: string
    businessName: string
    email: string
    phone: string
    password: string
  }) => Promise<AuthResult>
  logout: () => void
  completeOnboarding: (data: OnboardingData) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Demo account — one click on the login screen. */
export const DEMO_EMAIL = 'demo@growise.com'
export const DEMO_PASSWORD = 'demo1234'

function loadSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

function persist(session: SessionUser | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => loadSession())

  useEffect(() => {
    persist(user)
  }, [user])

  /** Real auth path: called with a session already verified by the backend. */
  const establishSession = useCallback((session: SessionUser) => {
    setUser(session)
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      // Simulate a network round-trip.
      await new Promise((r) => setTimeout(r, 550))
      const cleanEmail = email.trim().toLowerCase()

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
        return { ok: false, error: 'Enter a valid email address.' }
      }
      if (password.length < 6) {
        return { ok: false, error: 'Password must be at least 6 characters.' }
      }

      if (cleanEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
        setUser({
          id: demoClient.id,
          role: 'CLIENT',
          fullName: demoClient.fullName,
          businessName: demoClient.businessName,
          email: demoClient.email,
          phone: demoClient.phone,
          createdAt: new Date().toISOString(),
          onboardingComplete: true,
        })
        return { ok: true }
      }

      // Any other valid credentials → a returning client who hasn't onboarded.
      setUser({
        id: `client-${Date.now()}`,
        role: 'CLIENT',
        fullName: cleanEmail.split('@')[0],
        businessName: 'Your Business',
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        onboardingComplete: false,
      })
      return { ok: true }
    },
    []
  )

  const signup = useCallback(
    async (data: {
      fullName: string
      businessName: string
      email: string
      phone: string
      password: string
    }): Promise<AuthResult> => {
      await new Promise((r) => setTimeout(r, 700))
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) {
        return { ok: false, error: 'Enter a valid email address.' }
      }
      if (data.password.length < 6) {
        return { ok: false, error: 'Password must be at least 6 characters.' }
      }
      setUser({
        id: `client-${Date.now()}`,
        role: 'CLIENT',
        fullName: data.fullName.trim(),
        businessName: data.businessName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        createdAt: new Date().toISOString(),
        onboardingComplete: false,
      })
      return { ok: true }
    },
    []
  )

  const logout = useCallback(() => {
    // End the backend session (fire-and-forget — no-op until Spring Boot
    // exists), then clear local state regardless of the network result.
    void signOut()
    setUser(null)
  }, [])

  const completeOnboarding = useCallback((onboarding: OnboardingData) => {
    setUser((u) =>
      u
        ? {
            ...u,
            onboardingComplete: true,
            onboarding,
            businessName: (onboarding.business.name || '').trim() || u.businessName,
          }
        : u
    )
  }, [])

  const value = useMemo(
    () => ({ user, establishSession, login, signup, logout, completeOnboarding }),
    [user, establishSession, login, signup, logout, completeOnboarding]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/* ------------------------------ Guards ------------------------------ */

/** Protects portal pages: no session → /login, incomplete onboarding → /onboarding. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

/** Auth screens: already signed in → straight into the app. */
export function RequireGuest({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (user) return <Navigate to={user.onboardingComplete ? '/dashboard' : '/onboarding'} replace />
  return <>{children}</>
}

/** Onboarding: needs a session, and must not have finished onboarding. */
export function RequireOnboarding({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.onboardingComplete) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
