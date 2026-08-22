/**
 * metaGraphApi.ts
 *
 * Client-side helper for the Meta Graph API Instagram Business Discovery endpoint.
 * Reads credentials from VITE_ environment variables so they are bundled safely
 * (access tokens for public read-only calls are acceptable on the client for
 *  Business Discovery — no write permissions are granted).
 *
 * API shape:
 *   GET /{version}/{BUSINESS_ACCOUNT_ID}
 *     ?fields=business_discovery.username({target}){id,username,name,...}
 *     &access_token={token}
 *
 * In dev, Vite proxies /meta-graph → https://graph.facebook.com (see vite.config.ts).
 * In production (Vercel), vercel.json rewrites /meta-graph/:path* the same way.
 */

import type { InstagramProfile } from '../types'

// ─── Config (from .env) ────────────────────────────────────────────────────
const BUSINESS_ID = import.meta.env.VITE_META_BUSINESS_ACCOUNT_ID as string
const ACCESS_TOKEN = import.meta.env.VITE_META_ACCESS_TOKEN as string
const GRAPH_VERSION = (import.meta.env.VITE_META_GRAPH_VERSION as string) || 'v26.0'

export const isMetaConfigured =
  !!BUSINESS_ID &&
  !!ACCESS_TOKEN &&
  ACCESS_TOKEN !== 'your-long-lived-access-token-here'

// ─── Types ─────────────────────────────────────────────────────────────────
export interface MetaGraphProfileRaw {
  business_discovery: {
    id: string
    username: string
    name: string
    biography?: string
    website?: string
    profile_picture_url?: string
    followers_count?: number
    follows_count?: number
    media_count?: number
  }
  id: string
}

// ─── Main fetch function ───────────────────────────────────────────────────

/**
 * Fetches an Instagram Business/Creator profile via the Meta Graph API
 * Business Discovery endpoint.
 *
 * Returns null if the API is not configured or the request fails.
 */
export async function fetchMetaInstagramProfile(
  targetUsername: string,
): Promise<InstagramProfile | null> {
  if (!isMetaConfigured) {
    console.warn(
      '[MetaGraphApi] Not configured – set VITE_META_BUSINESS_ACCOUNT_ID and VITE_META_ACCESS_TOKEN in .env',
    )
    return null
  }

  const fields = [
    'id',
    'username',
    'name',
    'biography',
    'website',
    'profile_picture_url',
    'followers_count',
    'follows_count',
    'media_count',
  ].join(',')

  const businessDiscoveryField = `business_discovery.username(${targetUsername}){${fields}}`

  const params = new URLSearchParams({
    fields: businessDiscoveryField,
    access_token: ACCESS_TOKEN,
  })

  // Use the /meta-graph proxy path so CORS is not an issue in both dev and prod
  const url = `/meta-graph/${GRAPH_VERSION}/${BUSINESS_ID}?${params.toString()}`

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    const apiError = (errorBody as any)?.error
    throw new MetaApiError(
      apiError?.message || `HTTP ${res.status}`,
      apiError?.code,
      apiError?.error_subcode,
      apiError?.type,
    )
  }

  const json: MetaGraphProfileRaw = await res.json()
  const bd = json.business_discovery

  if (!bd) {
    throw new MetaApiError(
      `No business_discovery data returned for username "${targetUsername}". ` +
        'Ensure the target account is a Business or Creator account visible to your linked Instagram Business.',
    )
  }

  const profile: InstagramProfile = {
    username: bd.username,
    display_name: bd.name || bd.username,
    bio: bd.biography || '',
    profile_image_url: bd.profile_picture_url || '',
    category: 'Business & Brand', // Business Discovery doesn't return category — default label
    website_url: bd.website || '',
    followers_count: bd.followers_count ?? 0,
    following_count: bd.follows_count ?? 0,
    posts_count: bd.media_count ?? 0,
    is_business_account: true,
    is_creator_account: false,
    data_source: 'META',
    raw_data: json as unknown as Record<string, unknown>,
  }

  return profile
}

// ─── Custom error class ────────────────────────────────────────────────────

export class MetaApiError extends Error {
  public readonly code?: number
  public readonly subcode?: number
  public readonly type?: string

  constructor(message: string, code?: number, subcode?: number, type?: string) {
    super(message)
    this.name = 'MetaApiError'
    this.code = code
    this.subcode = subcode
    this.type = type
  }

  /** True when the target IG account could not be found or is private/non-business */
  get isNotFound() {
    // Error 100, subcode 33 = "Unsupported get request" / account not found
    return this.code === 100 || this.subcode === 33
  }

  /** True when the access token is invalid or expired */
  get isAuthError() {
    return this.code === 190
  }
}
