/**
 * LiveInstagramDataProvider.ts
 *
 * Routes real Instagram profile fetches through the `fetch-instagram-profile`
 * Supabase Edge Function. The Meta access token stays server-side — it never
 * touches the browser.
 *
 * Demo accounts (username starts with "demo_") continue to use the
 * MockInstagramDataProvider so development works without live credentials.
 *
 * Real usernames are NEVER served from mock data: if the lookup fails, the
 * error is surfaced to the caller so the user sees "not found" instead of a
 * plausible-looking placeholder profile that isn't theirs.
 */

import type { InstagramDataProvider } from './InstagramDataProvider'
import type { InstagramMedia, InstagramProfile } from '../types'
import { MockInstagramDataProvider } from './MockInstagramDataProvider'
import { fetchMetaInstagramProfile, isMetaConfigured, MetaApiError } from '../services/metaGraphApi'

/** Error surfaced to the UI when a real profile cannot be verified. */
export class ProfileLookupError extends Error {
  constructor(
    message: string,
    public readonly reason: 'NOT_FOUND' | 'AUTH' | 'NOT_CONFIGURED' | 'API_ERROR',
  ) {
    super(message)
    this.name = 'ProfileLookupError'
  }
}

export class LiveInstagramDataProvider implements InstagramDataProvider {
  private mockProvider = new MockInstagramDataProvider()
  private profileCache: Map<string, InstagramProfile> = new Map()
  // instagramUserId returned by the edge function, keyed by clean username
  private instagramUserIdCache: Map<string, string> = new Map()
  private rootInstagramUserIdCache: Map<string, string> = new Map()

  /**
   * Returns the Instagram User ID for a previously-fetched username.
   * Available only after getProfile() has been called.
   */
  getInstagramUserId(username: string): string | undefined {
    return this.instagramUserIdCache.get(username.toLowerCase().trim().replace(/^@/, ''))
  }

  getRootInstagramUserId(username: string): string | undefined {
    return this.rootInstagramUserIdCache.get(username.toLowerCase().trim().replace(/^@/, ''))
  }

  async getProfile(username: string): Promise<InstagramProfile> {
    const cleanUsername = username.toLowerCase().trim().replace(/^@/, '')

    // 1. Check cache
    if (this.profileCache.has(cleanUsername)) {
      return this.profileCache.get(cleanUsername)!
    }

    // 2. Demo accounts → MockProvider
    if (cleanUsername.startsWith('demo_')) {
      const mockProfile = await this.mockProvider.getProfile(cleanUsername)
      this.profileCache.set(cleanUsername, mockProfile)
      return mockProfile
    }

    // 3. Real accounts require the live lookup — there is no mock fallback.
    if (!isMetaConfigured) {
      throw new ProfileLookupError(
        'Instagram lookup is not available right now. Please try again later.',
        'NOT_CONFIGURED',
      )
    }

    // 4. Supabase Edge Function → Meta Business Discovery (server-side token)
    try {
      const result = await fetchMetaInstagramProfile(cleanUsername)
      this.profileCache.set(cleanUsername, result.profile)
      if (result.instagramUserId) {
        this.instagramUserIdCache.set(cleanUsername, result.instagramUserId)
      }
      if (result.rootInstagramUserId) {
        this.rootInstagramUserIdCache.set(cleanUsername, result.rootInstagramUserId)
      }
      return result.profile
    } catch (err) {
      console.warn('[LiveInstagramDataProvider] Profile lookup failed for', cleanUsername, err)

      if (err instanceof MetaApiError) {
        if (err.isNotFound) {
          throw new ProfileLookupError(
            `@${cleanUsername} was not found on Instagram. Check the spelling, and note that only Business or Creator accounts can be audited.`,
            'NOT_FOUND',
          )
        }
        if (err.isAuthError) {
          throw new ProfileLookupError(
            'Instagram API authentication failed. Please contact support.',
            'AUTH',
          )
        }
        if (err.isNotConfigured) {
          throw new ProfileLookupError(
            'Instagram lookup is not available right now. Please try again later.',
            'NOT_CONFIGURED',
          )
        }
      }

      throw new ProfileLookupError(
        `We couldn't reach Instagram to verify @${cleanUsername}. Please try again in a moment.`,
        'API_ERROR',
      )
    }
  }

  async getMedia(username: string): Promise<InstagramMedia[]> {
    const cleanUsername = username.toLowerCase().trim().replace(/^@/, '')

    // Demo accounts → MockProvider
    if (cleanUsername.startsWith('demo_')) {
      return this.mockProvider.getMedia(cleanUsername)
    }

    // For real accounts, media is fetched server-side in the instagram-audit
    // Edge Function (with pagination and date filtering).
    // Return an empty array here — the Level-2 audit engine handles real media.
    return []
  }
}
