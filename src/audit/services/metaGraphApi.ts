/**
 * metaGraphApi.ts
 *
 * Client-side helper for Meta Graph API interactions.
 *
 * SECURITY NOTE:
 *   All Meta API calls (profile fetch, media fetch) are routed through
 *   Supabase Edge Functions. The Meta access token NEVER leaves the server.
 *   This file contains NO tokens and NO direct Meta API calls.
 *
 * The Supabase Edge Functions (`fetch-instagram-profile`, `instagram-audit`)
 * hold META_ACCESS_TOKEN as a Supabase Secret (Deno.env) and call Meta on
 * behalf of the frontend.
 */

import { supabase } from './supabaseClient'
import type { InstagramProfile } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG CHECK (Supabase — no client-side Meta credentials)
// ─────────────────────────────────────────────────────────────────────────────

export const isMetaConfigured: boolean = (() => {
  const url = import.meta.env.VITE_SUPABASE_URL as string
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string
  return !!url && url !== 'https://your-supabase-project.supabase.co' && !!key
})()

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE FETCH VIA EDGE FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export interface ProfileFetchResult {
  profile: InstagramProfile
  instagramUserId: string
  rootInstagramUserId: string
}

/**
 * Fetches an Instagram Business/Creator profile by calling the
 * `fetch-instagram-profile` Supabase Edge Function.
 *
 * The Edge Function uses the server-side META_ACCESS_TOKEN from Supabase
 * Secrets — the token is never exposed to the browser.
 *
 * If auditId is provided, the Edge Function also updates the audit_sessions
 * row with instagram_user_id and root_instagram_user_id.
 */
export async function fetchMetaInstagramProfile(
  targetUsername: string,
  auditId?: string,
): Promise<ProfileFetchResult> {
  const cleanUsername = targetUsername.toLowerCase().trim().replace(/^@/, '')

  if (!supabase) {
    throw new MetaApiError(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.',
      { reason: 'NOT_CONFIGURED' },
    )
  }

  const { data, error } = await supabase.functions.invoke('fetch-instagram-profile', {
    body: { username: cleanUsername, ...(auditId ? { auditId } : {}) },
  })

  if (error) {
    throw new MetaApiError(`Edge function error: ${error.message}`, { reason: 'API_ERROR' })
  }

  if (!data?.success || !data?.profile) {
    // The function answered but has no profile for this username. Older
    // deployments don't send `reason`, so default to NOT_FOUND — reaching the
    // server and getting no profile back means the account isn't discoverable.
    throw new MetaApiError(
      data?.error || `@${cleanUsername} was not found on Instagram.`,
      {
        reason: (data?.reason as MetaFailureReason | undefined) ?? 'NOT_FOUND',
        code: data?.code,
        subcode: data?.subcode,
      },
    )
  }

  const raw = data.profile

  const profile: InstagramProfile = {
    username: raw.username ?? cleanUsername,
    display_name: raw.display_name ?? raw.username ?? cleanUsername,
    bio: raw.bio ?? '',
    profile_image_url: raw.profile_image_url ?? '',
    category: raw.category ?? 'Business & Brand',
    website_url: raw.website_url ?? '',
    followers_count: raw.followers_count ?? 0,
    following_count: raw.following_count ?? 0,
    posts_count: raw.posts_count ?? 0,
    is_business_account: raw.is_business_account ?? true,
    is_creator_account: raw.is_creator_account ?? false,
    data_source: 'META',
    raw_data: raw as unknown as Record<string, unknown>,
  }

  return {
    profile,
    instagramUserId: data.instagramUserId ?? '',
    rootInstagramUserId: data.rootInstagramUserId ?? '',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM ERROR CLASS
// ─────────────────────────────────────────────────────────────────────────────

/** Failure classification returned by the `fetch-instagram-profile` edge function. */
export type MetaFailureReason =
  | 'INVALID_USERNAME'
  | 'NOT_FOUND'
  | 'AUTH'
  | 'NOT_CONFIGURED'
  | 'API_ERROR'

export interface MetaApiErrorDetails {
  reason?: MetaFailureReason
  code?: number
  subcode?: number
  type?: string
}

export class MetaApiError extends Error {
  public readonly reason?: MetaFailureReason
  public readonly code?: number
  public readonly subcode?: number
  public readonly type?: string

  constructor(message: string, details: MetaApiErrorDetails = {}) {
    super(message)
    this.name = 'MetaApiError'
    this.reason = details.reason
    this.code = details.code
    this.subcode = details.subcode
    this.type = details.type
  }

  /** True when the target IG account could not be found or is private/non-business */
  get isNotFound() {
    return this.reason === 'NOT_FOUND' || this.code === 100 || this.subcode === 33
  }

  /** True when the access token is invalid or expired */
  get isAuthError() {
    return this.reason === 'AUTH' || this.code === 190
  }

  /** True when the server is missing Meta credentials */
  get isNotConfigured() {
    return this.reason === 'NOT_CONFIGURED'
  }
}
