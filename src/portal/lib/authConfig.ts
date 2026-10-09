/* ------------------------------------------------------------------ */
/*  Auth configuration — environment-driven, never hardcoded.           */
/*                                                                    */
/*  Google Cloud Console OAuth Verification Configuration:             */
/*    Project Name:   growise-media                                    */
/*    Project Number: 200344434657                                     */
/*                                                                    */
/*  Configured OAuth Scopes:                                           */
/*    1. https://www.googleapis.com/auth/youtube                       */
/*       (Channel management, video metadata updates, video deletion)  */
/*    2. https://www.googleapis.com/auth/youtube.upload                */
/*       (Upload and publish videos and YouTube Shorts)                */
/*    3. https://www.googleapis.com/auth/yt-analytics.readonly         */
/*       (Retrieve channel & video analytics for dashboard metrics)    */
/*                                                                    */
/*  Required env vars (see .env.example):                              */
/*    VITE_GOOGLE_CLIENT_ID  — public OAuth client ID (browser-safe)   */
/*    VITE_API_BASE_URL      — Spring Boot backend origin (e.g.        */
/*                             http://localhost:8080). When empty,     */
/*                             same-origin `/api` is assumed.          */
/*                                                                    */
/*  The Google CLIENT SECRET must ONLY ever live in the backend        */
/*  (application.yml / env / Supabase Vault). Never shipped to SPA.    */
/* ------------------------------------------------------------------ */

export const YOUTUBE_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
] as const


const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''
const rawApiBase = import.meta.env.VITE_API_BASE_URL ?? ''

/** Public Google OAuth client ID, if provided by the environment. */
export const GOOGLE_CLIENT_ID = rawClientId.trim()

/**
 * Origin of the future Spring Boot backend.
 * Empty → same-origin `/api` calls (works when Spring Boot serves the
 * built SPA, or behind the Vite proxy in development).
 */
export const API_BASE_URL = rawApiBase.trim().replace(/\/+$/, '')

/** Frontend route Spring Boot redirects the browser back to after Google login. */
export const OAUTH_CALLBACK_PATH = '/auth/callback'

/** Spring Security OAuth2 client authorization endpoint (server-side flow). */
export const GOOGLE_AUTHORIZE_ENDPOINT = '/oauth2/authorization/google'

/**
 * True once a backend origin is known. In the Spring Boot OAuth2-client
 * flow the Google client ID lives server-side, so the SPA only needs the
 * backend origin to begin sign-in. GOOGLE_CLIENT_ID is kept as optional
 * metadata for future direct-OIDC (PKCE) integrations.
 */
export const isGoogleOAuthConfigured = API_BASE_URL.length > 0

/**
 * Full URL the browser is sent to, to begin the Google OAuth dance.
 * The Spring Boot backend owns the client secret and the token exchange;
 * the SPA never sees credentials. Returns null when unconfigured.
 */
export function getGoogleAuthorizeUrl(): string | null {
  if (!isGoogleOAuthConfigured) return null
  return `${API_BASE_URL}${GOOGLE_AUTHORIZE_ENDPOINT}`
}
