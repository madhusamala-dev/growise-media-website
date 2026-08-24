/**
 * instagram-audit — Supabase Edge Function (Level-2 Audit Engine)
 *
 * Performs a complete, deterministic Level-2 Instagram audit using
 * Meta Business Discovery. All scoring, metrics, and opportunity
 * generation are computed here — no LLM, no fabricated data.
 *
 * Security:
 *   - Meta access token loaded from Deno.env (Supabase Secret)
 *   - instagramUsername + IDs loaded from DB by auditId
 *   - Frontend sends only auditId — no credentials, no IDs
 *
 * Request body: { auditId: string, auditWindowDays?: number }
 * Response: Level2AuditReport (see spec section 29)
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Instagram username validation ─────────────────────────────────────────────
const INSTAGRAM_USERNAME_RE = /^[a-zA-Z0-9._]{1,30}$/

// ── CTA keywords (case-insensitive) ──────────────────────────────────────────
const CTA_KEYWORDS = [
  'comment', 'share', 'save', 'follow', 'dm', 'message', 'learn more',
  'register', 'join', 'book', 'contact', 'click', 'link in bio', 'visit',
  'subscribe', 'download', 'apply', 'enroll', 'call', 'whatsapp', 'order',
  'buy', 'shop',
]

// ── Value proposition heuristic keywords ─────────────────────────────────────
const VALUE_PROP_KEYWORDS = [
  'help', 'transform', 'grow', 'learn', 'discover', 'achieve', 'expert',
  'specialist', 'official', 'trusted', 'proven', 'result', 'service',
  'solution', 'platform', 'studio', 'academy', 'clinic', 'school', 'brand',
]

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const auditId: string = body.auditId
    const auditWindowDays: number = Math.max(1, Math.min(90, Number(body.auditWindowDays) || 30))

    console.log('═══════════════════════════════════════════════════════════════')
    console.log('[instagram-audit] STARTING AUDIT')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('[instagram-audit] auditId:', auditId)
    console.log('[instagram-audit] auditWindowDays:', auditWindowDays)
    console.log('[instagram-audit] timestamp:', new Date().toISOString())

    if (!auditId || typeof auditId !== 'string') {
      return jsonError('auditId is required', 400)
    }

    // ── Server-side credentials ─────────────────────────────────────────────
    const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN') ?? ''
    const GRAPH_VERSION = Deno.env.get('META_GRAPH_VERSION') ?? 'v26.0'

    console.log('[instagram-audit] GRAPH_VERSION:', GRAPH_VERSION)
    console.log('[instagram-audit] META_ACCESS_TOKEN present:', META_ACCESS_TOKEN.length > 0)
    console.log('[instagram-audit] META_ACCESS_TOKEN prefix:', META_ACCESS_TOKEN.substring(0, 10) + '...')

    if (!META_ACCESS_TOKEN) {
      console.error('[instagram-audit] META_ACCESS_TOKEN is empty!')
      return jsonError('Meta API not configured. Set META_ACCESS_TOKEN in Supabase Secrets.', 503)
    }

    // ── Load audit session from DB ──────────────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('[instagram-audit] Loading audit session from DB...')
    const { data: session, error: sessionErr } = await supabase
      .from('audit_sessions')
      .select('id, instagram_username, instagram_user_id, root_instagram_user_id')
      .eq('id', auditId)
      .single()

    if (sessionErr || !session) {
      console.error('[instagram-audit] Session not found!', sessionErr)
      return jsonError(`Audit session not found: ${auditId}`, 404)
    }

    console.log('[instagram-audit] Session loaded:', JSON.stringify(session, null, 2))

    const instagramUsername: string = session.instagram_username ?? ''
    const rootInstagramUserId: string = session.root_instagram_user_id ?? Deno.env.get('META_BUSINESS_ACCOUNT_ID') ?? ''

    console.log('[instagram-audit] instagramUsername:', instagramUsername)
    console.log('[instagram-audit] instagram_user_id (from DB):', session.instagram_user_id)
    console.log('[instagram-audit] root_instagram_user_id (from DB):', session.root_instagram_user_id)
    console.log('[instagram-audit] rootInstagramUserId (effective):', rootInstagramUserId)
    console.log('[instagram-audit] META_BUSINESS_ACCOUNT_ID (env):', Deno.env.get('META_BUSINESS_ACCOUNT_ID') ?? '(not set)')

    if (!instagramUsername || !INSTAGRAM_USERNAME_RE.test(instagramUsername)) {
      return jsonError('Invalid or missing instagram_username in audit session', 400)
    }
    if (!rootInstagramUserId) {
      return jsonError('root_instagram_user_id not set. Complete Level-1 profile identification first.', 400)
    }

    // ── Mark audit as in-progress ───────────────────────────────────────────
    await supabase
      .from('audit_sessions')
      .update({ status: 'COLLECTING_DATA', started_at: new Date().toISOString() })
      .eq('id', auditId)

    // ── Fetch profile (fresh, for current follower count etc.) ──────────────
    console.log('[instagram-audit] Fetching profile for @' + instagramUsername + '...')
    console.log('[instagram-audit] Meta URL: https://graph.facebook.com/' + GRAPH_VERSION + '/' + rootInstagramUserId + '?fields=business_discovery.username(' + instagramUsername + '){...}&access_token=...')
    const profile = await fetchProfile(rootInstagramUserId, instagramUsername, GRAPH_VERSION, META_ACCESS_TOKEN)
    if (!profile) {
      console.error('[instagram-audit] Profile fetch returned null!')
      await supabase.from('audit_sessions').update({ status: 'FAILED', error_message: 'Profile fetch failed' }).eq('id', auditId)
      return jsonError(`Could not fetch profile for @${instagramUsername}`, 502)
    }

    console.log('[instagram-audit] Profile fetched successfully:')
    console.log('  id:', profile.id)
    console.log('  username:', profile.username)
    console.log('  name:', profile.name)
    console.log('  followers_count:', profile.followers_count)
    console.log('  follows_count:', profile.follows_count)
    console.log('  media_count:', profile.media_count)
    console.log('  biography:', profile.biography)
    console.log('  website:', profile.website)
    console.log('  profile_picture_url:', profile.profile_picture_url)

    // ── Calculate audit window ──────────────────────────────────────────────
    const auditEnd = new Date()
    const auditStart = new Date(auditEnd.getTime() - auditWindowDays * 24 * 60 * 60 * 1000)

    console.log('[instagram-audit] Audit window:')
    console.log('  start:', auditStart.toISOString())
    console.log('  end:', auditEnd.toISOString())
    console.log('  days:', auditWindowDays)

    // ── Paginate and collect media within the audit window ──────────────────
    console.log('[instagram-audit] Starting media fetch with pagination...')
    const allMedia = await fetchAllMediaInWindow(
      rootInstagramUserId,
      instagramUsername,
      GRAPH_VERSION,
      META_ACCESS_TOKEN,
      auditStart,
    )

    console.log('[instagram-audit] Media fetch complete. Total posts in window:', allMedia.length)
    console.log('[instagram-audit] Media types:', allMedia.reduce((acc, m) => {
      const type = m.media_type ?? 'UNKNOWN'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>))

    // Log first 3 media items as sample
    allMedia.slice(0, 3).forEach((m, i) => {
      console.log(`[instagram-audit] Sample post ${i + 1}:`, JSON.stringify({
        id: m.id,
        media_type: m.media_type,
        media_product_type: m.media_product_type,
        timestamp: m.timestamp,
        like_count: m.like_count,
        comments_count: m.comments_count,
        view_count: m.view_count,
        caption: (m.caption ?? '').substring(0, 80),
      }, null, 2))
    })

    // ── Mark as analyzing ───────────────────────────────────────────────────
    await supabase
      .from('audit_sessions')
      .update({ status: 'ANALYZING' })
      .eq('id', auditId)

    // ── Run audit engine ────────────────────────────────────────────────────
    const followers = profile.followers_count ?? 0
    const mediaWithMetrics = allMedia.map((m) => enrichMediaItem(m, followers))

    console.log('[instagram-audit] Followers:', followers)
    console.log('[instagram-audit] Running audit engine...')

    const auditWindow = buildAuditWindow(auditWindowDays, auditStart, auditEnd, allMedia)
    console.log('[instagram-audit] Audit window result:', JSON.stringify(auditWindow, null, 2))

    const metrics = calculateAccountMetrics(mediaWithMetrics, followers)
    console.log('[instagram-audit] Account metrics:', JSON.stringify(metrics, null, 2))

    const consistency = calculatePostingConsistency(allMedia, auditWindowDays)
    console.log('[instagram-audit] Posting consistency:', JSON.stringify(consistency, null, 2))

    const captionStats = calculateCaptionStats(allMedia)
    console.log('[instagram-audit] Caption stats:', JSON.stringify(captionStats, null, 2))

    const hashtagAnalysis = calculateHashtagAnalysis(allMedia)
    console.log('[instagram-audit] Hashtag analysis:', JSON.stringify(hashtagAnalysis, null, 2))

    const contentMix = calculateContentMix(allMedia)
    console.log('[instagram-audit] Content mix:', JSON.stringify(contentMix, null, 2))

    const scores = calculateScores(profile, mediaWithMetrics, metrics, consistency, captionStats)
    console.log('[instagram-audit] ═══════════════════════════════════════')
    console.log('[instagram-audit] FINAL SCORES:')
    console.log('  Total:', scores.total.total)
    console.log('  Rating:', scores.total.rating)
    console.log('  Profile:', scores.total.breakdown.profile, '/ 20')
    console.log('  Content:', scores.total.breakdown.content, '/ 25')
    console.log('  Engagement:', scores.total.breakdown.engagement, '/ 25')
    console.log('  Consistency:', scores.total.breakdown.consistency, '/ 15')
    console.log('  ConversionReadiness:', scores.total.breakdown.conversionReadiness, '/ 15')
    console.log('[instagram-audit] ═══════════════════════════════════════')

    const opportunities = runOpportunityEngine(profile, metrics, consistency, captionStats, scores, mediaWithMetrics)
    console.log('[instagram-audit] Opportunities generated:', opportunities.length)
    opportunities.forEach((opp) => {
      console.log(`  RULE ${opp.rule}: [${opp.impact}/${opp.effort}] ${opp.title}`)
      console.log(`    Category: ${opp.category}`)
      console.log(`    Evidence:`, JSON.stringify(opp.evidence))
    })

    const { top: topPosts, bottom: bottomPosts } = splitTopBottom(rankPosts(mediaWithMetrics, followers), 10)
    console.log('[instagram-audit] Top posts:', topPosts.length, '| Bottom posts:', bottomPosts.length)

    // ── Reels ranking ──────────────────────────────────────────────────────
    const reelsMedia = mediaWithMetrics.filter((m) => isReel(m))
    const reelsAnalyzed = reelsMedia.length
    console.log('[instagram-audit] Reels in audit window:', reelsAnalyzed)

    const { top: bestPerformingReels, bottom: worstPerformingReels } = splitTopBottom(
      rankReels(reelsMedia, followers),
      5,
    )
    console.log('[instagram-audit] Best performing reels:', bestPerformingReels.length)
    console.log('[instagram-audit] Worst performing reels:', worstPerformingReels.length)

    // ── Build final response ────────────────────────────────────────────────
    const report = {
      auditId,
      profile: {
        instagramUserId: session.instagram_user_id ?? profile.id ?? '',
        username: profile.username,
        name: profile.name,
        biography: profile.biography ?? '',
        website: profile.website ?? '',
        profilePictureUrl: profile.profile_picture_url ?? '',
        followers: profile.followers_count ?? 0,
        following: profile.follows_count ?? 0,
        mediaCount: profile.media_count ?? 0,
      },
      auditWindow,
      score: scores.total,
      metrics,
      contentAnalysis: {
        contentMix: calculateContentMix(allMedia),
        captionStats,
        hashtagAnalysis,
        postingConsistency: consistency,
      },
      topPosts,
      bottomPosts,
      reelsAnalyzed,
      bestPerformingReels,
      worstPerformingReels,
      opportunities,
    }

    console.log('[instagram-audit] ════════════════════════════════════════════════')
    console.log('[instagram-audit] AUDIT COMPLETE — FINAL REPORT SUMMARY')
    console.log('[instagram-audit] ════════════════════════════════════════════════')
    console.log('  auditId:', report.auditId)
    console.log('  username:', report.profile.username)
    console.log('  followers:', report.profile.followers)
    console.log('  posts analyzed:', report.auditWindow.postsAnalyzed)
    console.log('  audit window:', report.auditWindow.days, 'days')
    console.log('  SCORE:', report.score.total, '/', report.score.rating)
    console.log('  Breakdown:', JSON.stringify(report.score.breakdown))
    console.log('  Opportunities:', report.opportunities.length)
    console.log('  Top posts:', report.topPosts.length)
    console.log('  Bottom posts:', report.bottomPosts.length)
    console.log('═══════════════════════════════════════════════════════════════')

    // ── Mark as completed ───────────────────────────────────────────────────
    await supabase
      .from('audit_sessions')
      .update({
        status: 'COMPLETED',
        overall_score: scores.total.total,
        level2_completed_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq('id', auditId)

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    console.error('[instagram-audit] Unhandled error:', msg)
    return jsonError(msg, 500)
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// META API: PROFILE FETCH
// ─────────────────────────────────────────────────────────────────────────────

interface RawProfile {
  id?: string
  username?: string
  name?: string
  biography?: string
  website?: string
  profile_picture_url?: string
  followers_count?: number
  follows_count?: number
  media_count?: number
}

async function fetchProfile(
  rootId: string,
  targetUsername: string,
  version: string,
  token: string,
): Promise<RawProfile | null> {
  const fields = [
    'id', 'username', 'name', 'biography', 'website',
    'profile_picture_url', 'followers_count', 'follows_count', 'media_count',
  ].join(',')

  const url = new URL(`https://graph.facebook.com/${version}/${rootId}`)
  url.searchParams.set('fields', `business_discovery.username(${targetUsername}){${fields}}`)
  url.searchParams.set('access_token', token)

  const requestUrl = url.toString()
  console.log('[fetchProfile] Request URL:', requestUrl.replace(token, 'TOKEN_REDACTED'))

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
  const json = await res.json()

  console.log('[fetchProfile] Response status:', res.status)
  console.log('[fetchProfile] Response OK:', res.ok)
  console.log('[fetchProfile] Has error:', !!json.error)
  if (json.error) {
    console.error('[fetchProfile] Meta API error:', JSON.stringify(json.error))
  }
  console.log('[fetchProfile] Has business_discovery:', !!json.business_discovery)

  if (!res.ok || json.error) {
    console.error('[fetchProfile] Meta error:', json.error?.message)
    return null
  }

  return json.business_discovery as RawProfile ?? null
}

// ─────────────────────────────────────────────────────────────────────────────
// META API: PAGINATED MEDIA FETCH
// ─────────────────────────────────────────────────────────────────────────────

interface RawMedia {
  id: string
  caption?: string | null
  media_type?: string
  media_product_type?: string
  permalink?: string
  timestamp?: string
  like_count?: number | null
  comments_count?: number | null
  view_count?: number | null
}

async function fetchAllMediaInWindow(
  rootId: string,
  targetUsername: string,
  version: string,
  token: string,
  auditStart: Date,
): Promise<RawMedia[]> {
  const mediaFields = [
    'id', 'caption', 'media_type', 'media_product_type',
    'permalink', 'timestamp', 'like_count', 'comments_count', 'view_count',
  ].join(',')

  const collected: RawMedia[] = []
  const seenIds = new Set<string>()
  let nextCursor: string | null = null
  let pageCount = 0
  const MAX_PAGES = 20 // safety limit

  console.log('[fetchMedia] Starting paginated media fetch...')
  console.log('[fetchMedia] Audit start date:', auditStart.toISOString())
  console.log('[fetchMedia] Target username:', targetUsername)
  console.log('[fetchMedia] Root Instagram User ID:', rootId)

  while (pageCount < MAX_PAGES) {
    pageCount++

    // Build URL for this page
    const url = new URL(`https://graph.facebook.com/${version}/${rootId}`)
    if (!nextCursor) {
      // First page: use fields parameter
      const fields = `business_discovery.username(${targetUsername}){media{${mediaFields}}}`
      url.searchParams.set('fields', fields)
    } else {
      // Subsequent pages: use cursor on business_discovery
      const fields = `business_discovery.username(${targetUsername}){media.after(${nextCursor}){${mediaFields}}}`
      url.searchParams.set('fields', fields)
    }
    url.searchParams.set('access_token', token)

    const requestUrl = url.toString()
    console.log(`[fetchMedia] Page ${pageCount}: URL:`, requestUrl.replace(token, 'TOKEN_REDACTED'))

    const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
    const json = await res.json()

    console.log(`[fetchMedia] Page ${pageCount}: HTTP status:`, res.status)
    console.log(`[fetchMedia] Page ${pageCount}: Response OK:`, res.ok)

    if (!res.ok || json.error) {
      console.error(`[fetchMedia] Meta error on page ${pageCount}:`, JSON.stringify(json.error))
      break
    }

    const mediaData = json?.business_discovery?.media?.data as RawMedia[] | undefined
    const paging = json?.business_discovery?.media?.paging

    console.log(`[fetchMedia] Page ${pageCount}: Raw media items returned:`, mediaData?.length ?? 0)
    console.log(`[fetchMedia] Page ${pageCount}: Has paging:`, !!paging)
    console.log(`[fetchMedia] Page ${pageCount}: Has next cursor:`, !!paging?.cursors?.after)

    if (!mediaData || mediaData.length === 0) {
      console.log(`[fetchMedia] Page ${pageCount}: No media data, stopping pagination.`)
      break
    }

    // Process this page
    let reachedCutoff = false
    let keptFromPage = 0
    let skippedDuplicate = 0
    let skippedCutoff = 0
    for (const item of mediaData) {
      if (!item.id || seenIds.has(item.id)) {
        skippedDuplicate++
        continue
      }

      const ts = item.timestamp ? new Date(item.timestamp) : null
      if (ts && ts < auditStart) {
        reachedCutoff = true
        skippedCutoff++
        break // Items are newest-first; stop when we go past the window
      }

      seenIds.add(item.id)
      collected.push(item)
      keptFromPage++
    }

    console.log(`[fetchMedia] Page ${pageCount}: Kept: ${keptFromPage}, Duplicates skipped: ${skippedDuplicate}, Cutoff skipped: ${skippedCutoff}`)
    console.log(`[fetchMedia] Page ${pageCount}: Total collected so far: ${collected.length}`)

    if (reachedCutoff) {
      console.log(`[fetchMedia] Reached audit window cutoff on page ${pageCount}. Stopping.`)
    }

    // Stop if we hit the audit window cutoff or there are no more pages
    if (reachedCutoff || !paging?.cursors?.after || !paging?.next) break

    nextCursor = paging.cursors.after as string
    console.log(`[fetchMedia] Next cursor:`, nextCursor.substring(0, 30) + '...')
  }

  console.log('[fetchMedia] Pagination complete. Total pages fetched:', pageCount)
  console.log('[fetchMedia] Total media collected:', collected.length)

  return collected
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA ENRICHMENT (per-post metrics)
// ─────────────────────────────────────────────────────────────────────────────

interface EnrichedMedia extends RawMedia {
  likes: number
  comments: number
  views: number | null
  engagement: number
  engagementRate: number | null
  viewRate: number | null
  commentRate: number | null
  likeRate: number | null
  engagementPerView: number | null
  captionAnalysis: CaptionAnalysis
}

interface CaptionAnalysis {
  wordCount: number
  characterCount: number
  hasCTA: boolean
  hasURL: boolean
  hashtagCount: number
  mentionCount: number
  hashtags: string[]
}

function enrichMediaItem(raw: RawMedia, followers: number): EnrichedMedia {
  const likes = raw.like_count ?? 0
  const comments = raw.comments_count ?? 0
  const views = (raw.view_count != null && raw.view_count > 0) ? raw.view_count : null

  const engagement = likes + comments

  const engagementRate = followers > 0
    ? safeDiv(engagement, followers) * 100
    : null

  const viewRate = (views != null && followers > 0)
    ? safeDiv(views, followers) * 100
    : null

  const commentRate = followers > 0
    ? safeDiv(comments, followers) * 100
    : null

  const likeRate = followers > 0
    ? safeDiv(likes, followers) * 100
    : null

  const engagementPerView = (views != null && views > 0)
    ? safeDiv(engagement, views) * 100
    : null

  return {
    ...raw,
    likes,
    comments,
    views,
    engagement,
    engagementRate,
    viewRate,
    commentRate,
    likeRate,
    engagementPerView,
    captionAnalysis: analyzeCaption(raw.caption ?? ''),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CAPTION ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

function analyzeCaption(caption: string): CaptionAnalysis {
  const text = caption ?? ''
  const lower = text.toLowerCase()

  const hashtags = (text.match(/#\w+/g) ?? []).map((h) => h.toLowerCase())
  const mentions = (text.match(/@\w+/g) ?? []).length
  const words = text.trim() ? text.trim().split(/\s+/) : []

  const hasCTA = CTA_KEYWORDS.some((kw) => lower.includes(kw))
  const hasURL = /https?:\/\/\S+/.test(text)

  return {
    wordCount: words.length,
    characterCount: text.length,
    hasCTA,
    hasURL,
    hashtagCount: hashtags.length,
    mentionCount: mentions,
    hashtags,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNT METRICS
// ─────────────────────────────────────────────────────────────────────────────

interface AccountMetrics {
  postsAnalyzed: number
  reelsAnalyzed: number
  videosAnalyzed: number
  imagesAnalyzed: number
  carouselsAnalyzed: number
  averageLikes: number
  averageComments: number
  averageViews: number | null
  averageEngagement: number
  medianLikes: number
  medianComments: number
  medianViews: number | null
  medianEngagement: number
  averageEngagementRate: number | null
  medianEngagementRate: number | null
  averageViewRate: number | null
  medianViewRate: number | null
  averageCommentRate: number | null
  medianCommentRate: number | null
  averageLikeRate: number | null
  medianLikeRate: number | null
}

function calculateAccountMetrics(media: EnrichedMedia[], _followers: number): AccountMetrics {
  const n = media.length
  if (n === 0) {
    return {
      postsAnalyzed: 0,
      reelsAnalyzed: 0,
      videosAnalyzed: 0,
      imagesAnalyzed: 0,
      carouselsAnalyzed: 0,
      averageLikes: 0,
      averageComments: 0,
      averageViews: null,
      averageEngagement: 0,
      medianLikes: 0,
      medianComments: 0,
      medianViews: null,
      medianEngagement: 0,
      averageEngagementRate: null,
      medianEngagementRate: null,
      averageViewRate: null,
      medianViewRate: null,
      averageCommentRate: null,
      medianCommentRate: null,
      averageLikeRate: null,
      medianLikeRate: null,
    }
  }

  const reels = media.filter((m) => isReel(m))
  const videos = media.filter((m) => m.media_type === 'VIDEO' && !isReel(m))
  const images = media.filter((m) => m.media_type === 'IMAGE')
  const carousels = media.filter((m) => m.media_type === 'CAROUSEL_ALBUM' || m.media_type === 'CAROUSEL')

  const likesList = media.map((m) => m.likes)
  const commentsList = media.map((m) => m.comments)
  const engagementList = media.map((m) => m.engagement)

  const viewsItems = media.filter((m) => m.views != null)
  const viewsList = viewsItems.map((m) => m.views as number)

  const erItems = media.filter((m) => m.engagementRate != null)
  const erList = erItems.map((m) => m.engagementRate as number)

  const vrItems = media.filter((m) => m.viewRate != null)
  const vrList = vrItems.map((m) => m.viewRate as number)

  const crItems = media.filter((m) => m.commentRate != null)
  const crList = crItems.map((m) => m.commentRate as number)

  const lrItems = media.filter((m) => m.likeRate != null)
  const lrList = lrItems.map((m) => m.likeRate as number)

  return {
    postsAnalyzed: n,
    reelsAnalyzed: reels.length,
    videosAnalyzed: videos.length,
    imagesAnalyzed: images.length,
    carouselsAnalyzed: carousels.length,
    averageLikes: round2(avg(likesList)),
    averageComments: round2(avg(commentsList)),
    averageViews: viewsList.length > 0 ? round2(avg(viewsList)) : null,
    averageEngagement: round2(avg(engagementList)),
    medianLikes: round2(median(likesList)),
    medianComments: round2(median(commentsList)),
    medianViews: viewsList.length > 0 ? round2(median(viewsList)) : null,
    medianEngagement: round2(median(engagementList)),
    averageEngagementRate: erList.length > 0 ? round2(avg(erList)) : null,
    medianEngagementRate: erList.length > 0 ? round2(median(erList)) : null,
    averageViewRate: vrList.length > 0 ? round2(avg(vrList)) : null,
    medianViewRate: vrList.length > 0 ? round2(median(vrList)) : null,
    averageCommentRate: crList.length > 0 ? round2(avg(crList)) : null,
    medianCommentRate: crList.length > 0 ? round2(median(crList)) : null,
    averageLikeRate: lrList.length > 0 ? round2(avg(lrList)) : null,
    medianLikeRate: lrList.length > 0 ? round2(median(lrList)) : null,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT MIX & CAPTION STATS
// ─────────────────────────────────────────────────────────────────────────────

function calculateContentMix(media: RawMedia[]) {
  const n = media.length
  if (n === 0) return { reelsPercentage: 0, videoPercentage: 0, imagePercentage: 0, carouselPercentage: 0 }

  const reelCount = media.filter(isReel).length
  const videoCount = media.filter((m) => m.media_type === 'VIDEO' && !isReel(m)).length
  const imageCount = media.filter((m) => m.media_type === 'IMAGE').length
  const carouselCount = media.filter((m) => m.media_type === 'CAROUSEL_ALBUM' || m.media_type === 'CAROUSEL').length

  return {
    reelsPercentage: pct(reelCount, n),
    videoPercentage: pct(videoCount, n),
    imagePercentage: pct(imageCount, n),
    carouselPercentage: pct(carouselCount, n),
  }
}

function calculateCaptionStats(media: RawMedia[]) {
  const n = media.length
  if (n === 0) {
    return {
      averageCaptionLength: 0,
      CTAUsagePercentage: 0,
      averageHashtagsPerPost: 0,
      postsWithoutCaptions: 0,
      postsWithoutCTA: 0,
      postsWithoutHashtags: 0,
    }
  }

  const analyses = media.map((m) => analyzeCaption(m.caption ?? ''))

  const withCaptions = analyses.filter((a) => a.characterCount > 0)
  const withCTA = analyses.filter((a) => a.hasCTA)
  const withHashtags = analyses.filter((a) => a.hashtagCount > 0)
  const totalHashtags = analyses.reduce((s, a) => s + a.hashtagCount, 0)
  const totalChars = analyses.reduce((s, a) => s + a.characterCount, 0)

  return {
    averageCaptionLength: round2(totalChars / n),
    CTAUsagePercentage: pct(withCTA.length, n),
    averageHashtagsPerPost: round2(totalHashtags / n),
    postsWithoutCaptions: n - withCaptions.length,
    postsWithoutCTA: n - withCTA.length,
    postsWithoutHashtags: n - withHashtags.length,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HASHTAG ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

function calculateHashtagAnalysis(media: RawMedia[]) {
  const n = media.length
  const hashtagFreq: Record<string, number> = {}
  let totalHashtags = 0
  let postsWithoutHashtags = 0

  for (const m of media) {
    const analysis = analyzeCaption(m.caption ?? '')
    if (analysis.hashtags.length === 0) {
      postsWithoutHashtags++
    }
    for (const tag of analysis.hashtags) {
      hashtagFreq[tag] = (hashtagFreq[tag] ?? 0) + 1
      totalHashtags++
    }
  }

  const uniqueHashtags = Object.keys(hashtagFreq).length
  const mostUsed = Object.entries(hashtagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }))

  const repeatedCount = Object.values(hashtagFreq).filter((c) => c > 1).length
  const repeatedHashtagPercentage = uniqueHashtags > 0 ? pct(repeatedCount, uniqueHashtags) : 0

  return {
    averageHashtagsPerPost: n > 0 ? round2(totalHashtags / n) : 0,
    uniqueHashtags,
    mostUsedHashtags: mostUsed,
    postsWithoutHashtags,
    repeatedHashtagPercentage,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTING CONSISTENCY
// ─────────────────────────────────────────────────────────────────────────────

function calculatePostingConsistency(media: RawMedia[], windowDays: number) {
  const sorted = [...media]
    .filter((m) => m.timestamp)
    .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime())

  const n = sorted.length
  if (n === 0) {
    return {
      postsLast7Days: 0,
      postsLast30Days: n,
      averagePostsPerWeek: 0,
      averageReelsPerWeek: 0,
      averageDaysBetweenPosts: 0,
      longestPostingGapDays: 0,
    }
  }

  const now = Date.now()
  const last7 = sorted.filter((m) => now - new Date(m.timestamp!).getTime() <= 7 * 86400 * 1000).length

  const totalWeeks = Math.max(1, windowDays / 7)
  const reelsInWindow = media.filter(isReel).length

  let longestGap = 0
  let totalGap = 0

  for (let i = 1; i < sorted.length; i++) {
    const gapMs = new Date(sorted[i].timestamp!).getTime() - new Date(sorted[i - 1].timestamp!).getTime()
    const gapDays = gapMs / 86400000
    totalGap += gapDays
    if (gapDays > longestGap) longestGap = gapDays
  }

  const avgDaysBetween = n > 1 ? round2(totalGap / (n - 1)) : 0

  return {
    postsLast7Days: last7,
    postsLast30Days: n,
    averagePostsPerWeek: round2(n / totalWeeks),
    averageReelsPerWeek: round2(reelsInWindow / totalWeeks),
    averageDaysBetweenPosts: avgDaysBetween,
    longestPostingGapDays: round2(longestGap),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT WINDOW
// ─────────────────────────────────────────────────────────────────────────────

function buildAuditWindow(
  days: number,
  auditStart: Date,
  auditEnd: Date,
  media: RawMedia[],
) {
  const timestamps = media
    .filter((m) => m.timestamp)
    .map((m) => new Date(m.timestamp!).getTime())
    .filter((t) => !isNaN(t))

  const oldest = timestamps.length > 0
    ? new Date(Math.min(...timestamps)).toISOString()
    : null

  const newest = timestamps.length > 0
    ? new Date(Math.max(...timestamps)).toISOString()
    : null

  return {
    days,
    start: auditStart.toISOString(),
    end: auditEnd.toISOString(),
    oldestPostTimestamp: oldest,
    newestPostTimestamp: newest,
    postsAnalyzed: media.length,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5-CATEGORY SCORING (Profile/20, Content/25, Engagement/25, Consistency/15, Conversion/15)
// ─────────────────────────────────────────────────────────────────────────────

interface Scores {
  total: {
    total: number
    rating: 'EXCELLENT' | 'GOOD' | 'NEEDS IMPROVEMENT' | 'POOR'
    breakdown: {
      profile: number
      content: number
      engagement: number
      consistency: number
      conversionReadiness: number
    }
  }
}

function calculateScores(
  profile: RawProfile,
  media: EnrichedMedia[],
  metrics: AccountMetrics,
  consistency: ReturnType<typeof calculatePostingConsistency>,
  captionStats: ReturnType<typeof calculateCaptionStats>,
): Scores {
  const profileScore = scoreProfile(profile)       // 0-20
  const contentScore = scoreContent(media, metrics, captionStats)  // 0-25
  const engagementScore = scoreEngagement(metrics, media)           // 0-25
  const consistencyScore = scoreConsistency(consistency)            // 0-15
  const conversionScore = scoreConversion(profile, captionStats)   // 0-15

  const total = clamp(
    profileScore + contentScore + engagementScore + consistencyScore + conversionScore,
    0, 100,
  )

  const rating =
    total >= 90 ? 'EXCELLENT' :
    total >= 75 ? 'GOOD' :
    total >= 60 ? 'NEEDS IMPROVEMENT' : 'POOR'

  return {
    total: {
      total,
      rating,
      breakdown: {
        profile: profileScore,
        content: contentScore,
        engagement: engagementScore,
        consistency: consistencyScore,
        conversionReadiness: conversionScore,
      },
    },
  }
}

// ── Profile Score (max 20) ────────────────────────────────────────────────────
function scoreProfile(profile: RawProfile): number {
  let s = 0

  // Profile picture (+4)
  if (profile.profile_picture_url && profile.profile_picture_url.length > 5) s += 4

  // Bio exists (+2)
  const bio = profile.biography ?? ''
  if (bio.length > 0) s += 2

  // Bio length (+4: >80 chars = full, >40 = half)
  if (bio.length >= 80) s += 4
  else if (bio.length >= 40) s += 2

  // Website (+4)
  if (profile.website && profile.website.length > 5) s += 4

  // Value proposition heuristic (+3)
  const bioLower = bio.toLowerCase()
  const hasValueProp = VALUE_PROP_KEYWORDS.some((kw) => bioLower.includes(kw))
  if (hasValueProp) s += 3

  // Bio CTA (+3)
  const hasBioCTA = CTA_KEYWORDS.some((kw) => bioLower.includes(kw))
  if (hasBioCTA) s += 3

  return clamp(s, 0, 20)
}

// ── Content Score (max 25) ────────────────────────────────────────────────────
function scoreContent(
  media: EnrichedMedia[],
  metrics: AccountMetrics,
  captionStats: ReturnType<typeof calculateCaptionStats>,
): number {
  let s = 0
  const n = media.length
  if (n === 0) return 0

  // Content variety (+5): at least 2 different format types
  const types = new Set(media.map((m) => m.media_product_type ?? m.media_type ?? 'IMAGE'))
  if (types.size >= 3) s += 5
  else if (types.size >= 2) s += 3

  // Reel frequency (+6): based on reels/week
  const rpw = metrics.reelsAnalyzed / Math.max(1, (media.length > 0 ? 4 : 1))
  if (metrics.reelsAnalyzed >= 8) s += 6
  else if (metrics.reelsAnalyzed >= 4) s += 4
  else if (metrics.reelsAnalyzed >= 2) s += 2

  // Caption usage (+5): % posts with meaningful captions
  const withCaptions = media.filter((m) => (m.captionAnalysis.characterCount ?? 0) > 10).length
  const captionPct = pct(withCaptions, n)
  if (captionPct >= 80) s += 5
  else if (captionPct >= 50) s += 3
  else if (captionPct >= 20) s += 1

  // CTA usage (+5)
  const ctaPct = captionStats.CTAUsagePercentage
  if (ctaPct >= 60) s += 5
  else if (ctaPct >= 40) s += 3
  else if (ctaPct >= 20) s += 1

  // Recent activity (+4): posts in last 7 days
  const last7 = media.filter((m) => {
    if (!m.timestamp) return false
    return Date.now() - new Date(m.timestamp).getTime() <= 7 * 86400 * 1000
  }).length
  if (last7 >= 3) s += 4
  else if (last7 >= 1) s += 2

  return clamp(s, 0, 25)
}

// ── Engagement Score (max 25) ─────────────────────────────────────────────────
function scoreEngagement(metrics: AccountMetrics, media: EnrichedMedia[]): number {
  let s = 0
  const n = media.length
  if (n === 0) return 0

  // Median engagement rate (+10)
  const mer = metrics.medianEngagementRate
  if (mer != null) {
    if (mer >= 5.0) s += 10
    else if (mer >= 3.0) s += 8
    else if (mer >= 2.0) s += 6
    else if (mer >= 1.0) s += 4
    else if (mer >= 0.5) s += 2
  }

  // Median reel view rate (+7)
  const reels = media.filter(isReel)
  if (reels.length > 0) {
    const reelViewRates = reels.filter((r) => r.viewRate != null).map((r) => r.viewRate as number)
    const medViewRate = reelViewRates.length > 0 ? median(reelViewRates) : null
    if (medViewRate != null) {
      if (medViewRate >= 50) s += 7
      else if (medViewRate >= 20) s += 5
      else if (medViewRate >= 10) s += 3
      else if (medViewRate >= 5) s += 1
    }
  }

  // Comment rate (+4)
  const mcr = metrics.medianCommentRate
  if (mcr != null) {
    if (mcr >= 0.5) s += 4
    else if (mcr >= 0.2) s += 2
    else if (mcr >= 0.05) s += 1
  }

  // % posts above median engagement (+4)
  const medEng = metrics.medianEngagement
  const aboveMedian = media.filter((m) => m.engagement > medEng).length
  const abovePct = pct(aboveMedian, n)
  if (abovePct >= 60) s += 4
  else if (abovePct >= 45) s += 2

  return clamp(s, 0, 25)
}

// ── Consistency Score (max 15) ────────────────────────────────────────────────
function scoreConsistency(consistency: ReturnType<typeof calculatePostingConsistency>): number {
  let s = 0

  // Avg posts/week (+5)
  const ppw = consistency.averagePostsPerWeek
  if (ppw >= 4) s += 5
  else if (ppw >= 2) s += 3
  else if (ppw >= 1) s += 2

  // Avg reels/week (+4)
  const rpw = consistency.averageReelsPerWeek
  if (rpw >= 3) s += 4
  else if (rpw >= 1.5) s += 2
  else if (rpw >= 0.5) s += 1

  // Longest gap penalty/reward (+4)
  const gap = consistency.longestPostingGapDays
  if (gap <= 3) s += 4
  else if (gap <= 7) s += 2
  else if (gap > 14) s += 0

  // Recent activity (+2)
  const recentRatio = consistency.postsLast7Days / Math.max(1, consistency.averagePostsPerWeek)
  if (recentRatio >= 0.8) s += 2
  else if (recentRatio >= 0.4) s += 1

  return clamp(s, 0, 15)
}

// ── Conversion Readiness Score (max 15) ──────────────────────────────────────
function scoreConversion(
  profile: RawProfile,
  captionStats: ReturnType<typeof calculateCaptionStats>,
): number {
  let s = 0

  // Website (+4)
  if (profile.website && profile.website.length > 5) s += 4

  // Bio CTA (+3)
  const bioLower = (profile.biography ?? '').toLowerCase()
  const hasBioCTA = CTA_KEYWORDS.some((kw) => bioLower.includes(kw))
  if (hasBioCTA) s += 3

  // Post CTA usage (+4)
  const ctaPct = captionStats.CTAUsagePercentage
  if (ctaPct >= 50) s += 4
  else if (ctaPct >= 30) s += 2
  else if (ctaPct >= 10) s += 1

  // DM/WhatsApp/contact language in bio (+2)
  const conversionWords = ['dm', 'whatsapp', 'contact', 'call', 'message', 'reach']
  const hasDMLanguage = conversionWords.some((w) => bioLower.includes(w))
  if (hasDMLanguage) s += 2

  // Offer/service language in bio (+2)
  const offerWords = ['offer', 'service', 'book', 'order', 'buy', 'enroll', 'free', 'consultation']
  const hasOfferLanguage = offerWords.some((w) => bioLower.includes(w))
  if (hasOfferLanguage) s += 2

  return clamp(s, 0, 15)
}

// ─────────────────────────────────────────────────────────────────────────────
// OPPORTUNITY ENGINE (11 deterministic rules)
// ─────────────────────────────────────────────────────────────────────────────

interface Opportunity {
  rule: string
  title: string
  description: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  effort: 'LOW' | 'MEDIUM' | 'HIGH'
  category: string
  evidence: Record<string, unknown>
}

function runOpportunityEngine(
  profile: RawProfile,
  metrics: AccountMetrics,
  consistency: ReturnType<typeof calculatePostingConsistency>,
  captionStats: ReturnType<typeof calculateCaptionStats>,
  scores: Scores,
  media: EnrichedMedia[],
): Opportunity[] {
  const opps: Opportunity[] = []

  const bio = (profile.biography ?? '').toLowerCase()
  const breakdown = scores.total.breakdown

  // ── RULE 001: Low Reels frequency ─────────────────────────────────────────
  if (consistency.averageReelsPerWeek < 3) {
    opps.push({
      rule: '001',
      title: 'Publish 3 Short-Form Educational Reels Per Week',
      description: 'Short-form video drives the highest organic reach on Instagram. Publishing consistently builds algorithmic momentum.',
      impact: 'HIGH',
      effort: 'MEDIUM',
      category: 'CONTENT',
      evidence: {
        averageReelsPerWeek: consistency.averageReelsPerWeek,
        reelsAnalyzed: metrics.reelsAnalyzed,
      },
    })
  }

  // ── RULE 002: Low posting frequency or large gap ──────────────────────────
  if (consistency.averagePostsPerWeek < 2 || consistency.longestPostingGapDays > 7) {
    opps.push({
      rule: '002',
      title: 'Improve Instagram Posting Consistency',
      description: 'Irregular posting reduces algorithmic reach and audience recall. Aim for at least 2 posts per week with no gap longer than 7 days.',
      impact: 'HIGH',
      effort: 'MEDIUM',
      category: 'CONSISTENCY',
      evidence: {
        averagePostsPerWeek: consistency.averagePostsPerWeek,
        longestPostingGapDays: consistency.longestPostingGapDays,
      },
    })
  }

  // ── RULE 003: No bio CTA ──────────────────────────────────────────────────
  const hasBioCTA = CTA_KEYWORDS.some((kw) => bio.includes(kw))
  if (!hasBioCTA) {
    opps.push({
      rule: '003',
      title: 'Add a Clear Call-to-Action to Your Bio',
      description: 'Your bio is one of the highest-traffic pages on your profile. A clear CTA tells visitors exactly what to do next.',
      impact: 'HIGH',
      effort: 'LOW',
      category: 'PROFILE',
      evidence: {
        bioCTADetected: false,
        bioLength: (profile.biography ?? '').length,
      },
    })
  }

  // ── RULE 004: Weak value proposition ─────────────────────────────────────
  const hasValueProp = VALUE_PROP_KEYWORDS.some((kw) => bio.includes(kw))
  if (!hasValueProp || (profile.biography ?? '').length < 40) {
    opps.push({
      rule: '004',
      title: 'Optimize Bio With a Clear Value Proposition',
      description: 'Your bio should immediately communicate who you help and what outcome you deliver. A strong value proposition increases profile-to-follow conversion.',
      impact: 'MEDIUM',
      effort: 'LOW',
      category: 'PROFILE',
      evidence: {
        valuePropDetected: hasValueProp,
        bioLength: (profile.biography ?? '').length,
      },
    })
  }

  // ── RULE 005: No website ──────────────────────────────────────────────────
  if (!profile.website || profile.website.length < 5) {
    opps.push({
      rule: '005',
      title: 'Add a Website or Conversion Link',
      description: 'Instagram accounts without a website link lose a critical conversion touchpoint. Use a link-in-bio tool or direct landing page URL.',
      impact: 'HIGH',
      effort: 'LOW',
      category: 'CONVERSION',
      evidence: {
        websitePresent: false,
      },
    })
  }

  // ── RULE 006: Low CTA usage in posts ─────────────────────────────────────
  if (captionStats.CTAUsagePercentage < 30) {
    opps.push({
      rule: '006',
      title: 'Use Stronger Calls-to-Action in Your Content',
      description: 'Posts without a clear CTA have lower engagement and conversion rates. Every post should guide your audience toward a specific next step.',
      impact: 'MEDIUM',
      effort: 'LOW',
      category: 'CONTENT',
      evidence: {
        CTAUsagePercentage: captionStats.CTAUsagePercentage,
        postsWithoutCTA: captionStats.postsWithoutCTA,
        postsAnalyzed: metrics.postsAnalyzed,
      },
    })
  }

  // ── RULE 007: Weak comment engagement ────────────────────────────────────
  const mcr = metrics.medianCommentRate
  if (mcr != null && mcr < 0.2 && metrics.postsAnalyzed >= 5) {
    opps.push({
      rule: '007',
      title: 'Create More Conversation-Driven Content',
      description: 'Your comment rate is lower than your overall engagement. Posts with questions, polls, or debate-style prompts drive more comments and signal quality to the algorithm.',
      impact: 'MEDIUM',
      effort: 'MEDIUM',
      category: 'ENGAGEMENT',
      evidence: {
        medianCommentRate: mcr,
        averageComments: metrics.averageComments,
      },
    })
  }

  // ── RULE 008: Low content variety ────────────────────────────────────────
  const uniqueTypes = new Set(media.map((m) => m.media_product_type ?? m.media_type ?? 'IMAGE')).size
  if (uniqueTypes <= 1 && metrics.postsAnalyzed >= 5) {
    opps.push({
      rule: '008',
      title: 'Increase Content Format Variety',
      description: 'Using only one content format limits your audience reach. Mix Reels, carousels, and static images to reach different audience segments.',
      impact: 'MEDIUM',
      effort: 'MEDIUM',
      category: 'CONTENT',
      evidence: {
        uniqueFormatsDetected: uniqueTypes,
        reelsPercentage: pct(metrics.reelsAnalyzed, metrics.postsAnalyzed),
        imagesPercentage: pct(metrics.imagesAnalyzed, metrics.postsAnalyzed),
        carouselsPercentage: pct(metrics.carouselsAnalyzed, metrics.postsAnalyzed),
      },
    })
  }

  // ── RULE 009: Declining recent activity ──────────────────────────────────
  const expectedWeekly = consistency.averagePostsPerWeek
  const actualLast7 = consistency.postsLast7Days
  if (expectedWeekly > 0 && actualLast7 < expectedWeekly * 0.5 && metrics.postsAnalyzed >= 5) {
    opps.push({
      rule: '009',
      title: 'Increase Recent Publishing Activity',
      description: 'Your posting rate in the last 7 days is significantly lower than your historical average. Maintaining consistent activity prevents algorithmic decline.',
      impact: 'HIGH',
      effort: 'MEDIUM',
      category: 'CONSISTENCY',
      evidence: {
        postsLast7Days: actualLast7,
        averagePostsPerWeek: expectedWeekly,
        deficit: round2(expectedWeekly - actualLast7),
      },
    })
  }

  // ── RULE 010: Weak Reel view rate ─────────────────────────────────────────
  const reels = media.filter(isReel)
  if (reels.length >= 3) {
    const reelViewRates = reels.filter((r) => r.viewRate != null).map((r) => r.viewRate as number)
    const medReelVR = reelViewRates.length > 0 ? median(reelViewRates) : null
    if (medReelVR != null && medReelVR < 10) {
      opps.push({
        rule: '010',
        title: 'Improve Reel Hooks and Watchability',
        description: 'Your Reel view rate is below expected. This recommendation is based on view performance relative to your follower count — not an analysis of your actual video content or hook quality.',
        impact: 'HIGH',
        effort: 'MEDIUM',
        category: 'CONTENT',
        evidence: {
          medianReelViewRate: round2(medReelVR),
          reelsAnalyzed: reels.length,
        },
      })
    }
  }

  // ── RULE 011: One format significantly outperforms ────────────────────────
  if (metrics.postsAnalyzed >= 6) {
    const formats = ['REELS', 'IMAGE', 'CAROUSEL'] as const
    const formatAvgER: Record<string, number | null> = {}

    for (const fmt of formats) {
      const fmtMedia = media.filter((m) => {
        if (fmt === 'REELS') return isReel(m)
        if (fmt === 'CAROUSEL') return m.media_type === 'CAROUSEL_ALBUM' || m.media_type === 'CAROUSEL'
        return m.media_type === 'IMAGE'
      })
      if (fmtMedia.length >= 2) {
        const ers = fmtMedia.filter((m) => m.engagementRate != null).map((m) => m.engagementRate as number)
        formatAvgER[fmt] = ers.length > 0 ? avg(ers) : null
      }
    }

    const validFormats = Object.entries(formatAvgER).filter(([, v]) => v != null) as [string, number][]
    if (validFormats.length >= 2) {
      validFormats.sort((a, b) => b[1] - a[1])
      const [bestFmt, bestER] = validFormats[0]
      const [secondFmt, secondER] = validFormats[1]
      if (bestER > secondER * 1.4) {
        opps.push({
          rule: '011',
          title: 'Double Down on Your Best-Performing Content Format',
          description: `Your ${bestFmt.toLowerCase()} content consistently outperforms other formats. Increasing ${bestFmt.toLowerCase()} frequency can compound engagement growth.`,
          impact: 'HIGH',
          effort: 'LOW',
          category: 'CONTENT',
          evidence: {
            bestFormat: bestFmt,
            bestFormatAvgEngagementRate: round2(bestER),
            secondFormat: secondFmt,
            secondFormatAvgEngagementRate: round2(secondER),
            advantage: round2(((bestER - secondER) / secondER) * 100),
          },
        })
      }
    }
  }

  // Return max 11 (spec cap)
  return opps.slice(0, 11)
}

// ─────────────────────────────────────────────────────────────────────────────
// POST RANKING (Top/Bottom 10)
// ─────────────────────────────────────────────────────────────────────────────

function rankPosts(media: EnrichedMedia[], followers: number) {
  const scored = media.map((m) => ({
    mediaId: m.id,
    mediaType: m.media_type ?? 'IMAGE',
    mediaProductType: m.media_product_type ?? null,
    timestamp: m.timestamp ?? null,
    permalink: m.permalink ?? null,
    likes: m.likes,
    comments: m.comments,
    views: m.views,
    engagementRate: m.engagementRate != null ? round2(m.engagementRate) : null,
    viewRate: m.viewRate != null ? round2(m.viewRate) : null,
    // Composite score for ranking: engagement rate primary, view rate for reels, raw engagement fallback
    _rankScore: (m.engagementRate ?? 0) + (isReel(m) ? (m.viewRate ?? 0) * 0.1 : 0),
  }))

  scored.sort((a, b) => b._rankScore - a._rankScore)

  return scored.map((p, i) => {
    const { _rankScore, ...rest } = p
    return { ...rest, rank: i + 1 }
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// REELS RANKING (best/worst performing Reels only)
// ─────────────────────────────────────────────────────────────────────────────

function rankReels(reels: EnrichedMedia[], followers: number) {
  if (reels.length === 0) return []

  const scored = reels.map((m) => {
    const engagement = m.likes + m.comments
    const engagementRate = m.engagementRate ?? 0
    const viewRate = m.viewRate ?? 0

    // Composite score: engagementRate primary, viewRate secondary, raw engagement tertiary
    const _rankScore = engagementRate * 10 + viewRate * 0.5 + engagement * 0.01

    const caption = m.caption ?? ''
    const captionPreview = caption.length > 120 ? caption.substring(0, 120) + '...' : caption

    return {
      rank: 0, // will be set after sorting
      mediaId: m.id,
      caption: captionPreview,
      permalink: m.permalink ?? null,
      timestamp: m.timestamp ?? null,
      mediaType: m.media_type ?? 'VIDEO',
      mediaProductType: m.media_product_type ?? 'REELS',
      likes: m.likes,
      comments: m.comments,
      views: m.views,
      engagement,
      engagementRate: engagementRate != null ? round2(engagementRate) : null,
      viewRate: viewRate != null ? round2(viewRate) : null,
      _rankScore,
    }
  })

  scored.sort((a, b) => b._rankScore - a._rankScore)

  return scored.map((p, i) => {
    const { _rankScore, ...rest } = p
    return { ...rest, rank: i + 1 }
  })
}

/**
 * Splits a single descending ranking into disjoint top/bottom slices.
 *
 * Taking `slice(0, limit)` of both a descending and an ascending sort makes the
 * same item appear in both lists whenever the pool is smaller than 2 x limit
 * (e.g. 5 Reels showing up as both "top" and "lower" performers). Splitting one
 * ranking at its midpoint guarantees no item can be on both sides; with an odd
 * count the median item is left out of both.
 */
function splitTopBottom<T extends { rank: number }>(rankedDesc: T[], limit: number) {
  const n = rankedDesc.length
  if (n === 0) return { top: [] as T[], bottom: [] as T[] }
  if (n === 1) return { top: withRanks(rankedDesc), bottom: [] as T[] }

  const half = Math.min(limit, Math.floor(n / 2))
  return {
    top: withRanks(rankedDesc.slice(0, half)),
    bottom: withRanks(rankedDesc.slice(n - half).reverse()),
  }
}

function withRanks<T extends { rank: number }>(items: T[]): T[] {
  return items.map((item, i) => ({ ...item, rank: i + 1 }))
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isReel(m: RawMedia): boolean {
  return m.media_product_type === 'REELS' || m.media_type === 'REELS'
}

function safeDiv(numerator: number, denominator: number): number {
  if (!isFinite(denominator) || denominator === 0) return 0
  const result = numerator / denominator
  return isFinite(result) ? result : 0
}

function avg(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

function pct(count: number, total: number): number {
  if (total === 0) return 0
  return round2((count / total) * 100)
}

function round2(n: number): number {
  if (!isFinite(n) || isNaN(n)) return 0
  return Math.round(n * 100) / 100
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)))
}

function jsonError(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
