/* ------------------------------------------------------------------ */
/*  Auth service — the single frontend entry point for real           */
/*  authentication. Prepared for the future Spring Boot backend.       */
/*                                                                    */
/*  Flow: Browser → Google OAuth (via Spring Boot) → Spring verifies   */
/*  the Google identity → Spring issues a session/JWT → SPA calls      */
/*  /api/auth/me to hydrate the SessionUser → protected routes open.   */
/*                                                                    */
/*  Nothing in this file can authenticate a user on its own: without   */
/*  backend + env configuration the Google button reports             */
/*  'unconfigured' and no session is created.                          */
/* ------------------------------------------------------------------ */

import { API_BASE_URL, getGoogleAuthorizeUrl, isGoogleOAuthConfigured } from './authConfig'
import type { SessionUser } from '../data/types'

/** Build an API URL — same-origin `/api` when no backend origin is set. */
const api = (path: string) => `${API_BASE_URL}${path}`

export type GoogleSignInResult =
  | { status: 'configured'; authorizeUrl: string }
  | { status: 'unconfigured' }

/**
 * Begin Google sign-in.
 *
 * - Configured: returns the Spring Boot OAuth2 authorization URL the
 *   browser should navigate to (full-page navigation; the SPA never
 *   sees Google credentials).
 * - Unconfigured: returns `{ status: 'unconfigured' }`. The caller must
 *   NOT create a session — no fake login, no redirect to the dashboard.
 */
export async function startGoogleSignIn(): Promise<GoogleSignInResult> {
  if (!isGoogleOAuthConfigured) return { status: 'unconfigured' }

  const authorizeUrl = getGoogleAuthorizeUrl()
  if (!authorizeUrl) return { status: 'unconfigured' }

  return { status: 'configured', authorizeUrl }
}

/**
 * Hydrate the current session from the backend. Call this from the
 * OAuth callback route after Spring Boot redirects the browser back.
 * Returns null when there is no valid session (unauthenticated).
 */
export async function fetchCurrentUser(): Promise<SessionUser | null> {
  try {
    const res = await fetch(api('/api/auth/me'), { credentials: 'include' })
    if (!res.ok) return null
    const data = (await res.json()) as { user?: SessionUser } | SessionUser | null
    if (!data) return null
    return 'user' in data && data.user ? data.user : (data as SessionUser)
  } catch {
    // Backend not reachable yet — treat as unauthenticated, never as logged in.
    return null
  }
}

/** End the backend session. Safe to call even when unconfigured. */
export async function signOut(): Promise<void> {
  try {
    await fetch(api('/api/auth/logout'), { method: 'POST', credentials: 'include' })
  } catch {
    // Ignore network errors — local state is cleared by the caller regardless.
  }
}

/** Whether the environment is wired up for real Google sign-in. */
export { isGoogleOAuthConfigured }
