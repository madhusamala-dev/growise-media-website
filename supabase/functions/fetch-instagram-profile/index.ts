/**
 * fetch-instagram-profile — Supabase Edge Function
 *
 * Uses Meta Business Discovery API to fetch an Instagram profile.
 * The Meta access token and Business Account ID are loaded from
 * Supabase Secrets (Deno.env) — never from the request body or query params.
 *
 * Request body: { username: string, auditId?: string }
 * Response: { success: true, profile: {...}, instagramUserId: string }
 *           { success: false, error: string, reason: FailureReason, code?, subcode? }
 *
 * If auditId is provided, updates audit_sessions with instagramUserId
 * and rootInstagramUserId so the Level-2 audit can load them securely.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Regex: Instagram username rules (alphanumeric, underscore, dot, max 30) ──
const INSTAGRAM_USERNAME_RE = /^[a-zA-Z0-9._]{1,30}$/

interface RequestBody {
  username: string
  auditId?: string
}

/**
 * Machine-readable failure classification so the client can tell "this username
 * does not exist" apart from "our API call broke". The client must never
 * substitute placeholder data for a real lookup, so it needs the distinction.
 */
type FailureReason = 'INVALID_USERNAME' | 'NOT_FOUND' | 'AUTH' | 'NOT_CONFIGURED' | 'API_ERROR'

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: RequestBody = await req.json()
    const rawUsername = body.username
    const auditId = body.auditId

    // ── Validate ──────────────────────────────────────────────────────────
    if (!rawUsername || typeof rawUsername !== 'string') {
      return jsonResponse({ success: false, reason: 'INVALID_USERNAME', error: 'username is required' }, 400)
    }

    const cleanUsername = rawUsername.toLowerCase().trim().replace(/^@/, '')

    if (!INSTAGRAM_USERNAME_RE.test(cleanUsername)) {
      return jsonResponse({
        success: false,
        reason: 'INVALID_USERNAME',
        error: 'Invalid Instagram username. Only letters, numbers, underscores and dots allowed (max 30 chars).',
      }, 400)
    }

    // ── Server-side credentials (never returned to client) ─────────────────
    const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN') ?? ''
    const META_BUSINESS_ACCOUNT_ID = Deno.env.get('META_BUSINESS_ACCOUNT_ID') ?? ''
    const GRAPH_VERSION = Deno.env.get('META_GRAPH_VERSION') ?? 'v26.0'

    if (!META_ACCESS_TOKEN || !META_BUSINESS_ACCOUNT_ID) {
      return jsonResponse({
        success: false,
        reason: 'NOT_CONFIGURED',
        error: 'Meta API is not configured on the server. Please contact support.',
      }, 503)
    }

    // ── Build Meta Business Discovery request ──────────────────────────────
    const profileFields = [
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

    const fields = `business_discovery.username(${cleanUsername}){${profileFields}}`

    const metaUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${META_BUSINESS_ACCOUNT_ID}`)
    metaUrl.searchParams.set('fields', fields)
    metaUrl.searchParams.set('access_token', META_ACCESS_TOKEN)

    const metaRes = await fetch(metaUrl.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    const metaJson = await metaRes.json()

    // ── Handle Meta API errors ────────────────────────────────────────────
    if (!metaRes.ok || metaJson.error) {
      const apiErr = metaJson.error || {}
      const code = apiErr.code
      const subcode = apiErr.error_subcode
      const msg = apiErr.message || `Meta API error (HTTP ${metaRes.status})`
      console.error('[fetch-instagram-profile] Meta API error:', code, subcode, msg)

      // Business Discovery reports an unknown / private / personal account as
      // code 100 (with subcode 33 for "does not exist").
      const reason: FailureReason =
        code === 190 ? 'AUTH' : code === 100 || subcode === 33 ? 'NOT_FOUND' : 'API_ERROR'

      return jsonResponse({
        success: false,
        reason,
        code,
        subcode,
        username: cleanUsername,
        error: reason === 'NOT_FOUND'
          ? `@${cleanUsername} was not found on Instagram.`
          : msg,
      }, 200)
    }

    const bd = metaJson.business_discovery
    if (!bd) {
      return jsonResponse({
        success: false,
        reason: 'NOT_FOUND',
        username: cleanUsername,
        error: `@${cleanUsername} was not found on Instagram.`,
      }, 200)
    }

    // ── Build profile response (NO token included) ─────────────────────────
    const instagramUserId: string = bd.id ?? ''
    const rootInstagramUserId: string = META_BUSINESS_ACCOUNT_ID

    const profile = {
      username: bd.username ?? cleanUsername,
      display_name: bd.name ?? bd.username ?? cleanUsername,
      bio: bd.biography ?? '',
      profile_image_url: bd.profile_picture_url ?? '',
      category: 'Business & Brand',
      website_url: bd.website ?? '',
      followers_count: bd.followers_count ?? 0,
      following_count: bd.follows_count ?? 0,
      posts_count: bd.media_count ?? 0,
      is_business_account: true,
      is_creator_account: false,
      data_source: 'META',
    }

    // ── If auditId supplied, persist IDs server-side ───────────────────────
    if (auditId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )
        await supabase
          .from('audit_sessions')
          .update({
            instagram_user_id: instagramUserId,
            root_instagram_user_id: rootInstagramUserId,
            instagram_username: cleanUsername,
            data_source: 'META',
          })
          .eq('id', auditId)
      } catch (dbErr) {
        // Non-fatal: IDs will be missing but audit can still proceed
        console.warn('[fetch-instagram-profile] DB update failed:', dbErr)
      }
    }

    return jsonResponse({
      success: true,
      profile,
      instagramUserId,
      rootInstagramUserId,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('[fetch-instagram-profile] Unhandled error:', message)
    return jsonResponse({ success: false, reason: 'API_ERROR', error: message }, 500)
  }
})

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
