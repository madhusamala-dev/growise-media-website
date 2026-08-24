import { LiveInstagramDataProvider } from '../providers/LiveInstagramDataProvider'
import { MockAIProvider } from '../providers/MockAIProvider'
import { calculateFullAuditScore } from '../engine/overallScorer'
import { isSupabaseConfigured, supabase } from './supabaseClient'
import { AnalyticsService } from './analyticsService'
import type { Level2AuditReport } from '../types/level2'
import { storeLevel2Report } from '../types/level2'
import type {
  AuditLead,
  AuditReport,
  AuditSession,
} from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY_REPORTS = 'growise_audit_reports_v1'
const STORAGE_KEY_LEADS = 'growise_audit_leads_v1'

const memoryReportsStore: Record<string, AuditReport> = {}
const memoryLeadsStore: AuditLead[] = []

function getLocalReports(): Record<string, AuditReport> {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_REPORTS)
      if (raw) return { ...memoryReportsStore, ...JSON.parse(raw) }
    } catch (err) {
      console.warn('LocalStorage read error:', err)
    }
  }
  return memoryReportsStore
}

function saveLocalReport(report: AuditReport): void {
  memoryReportsStore[report.session.id] = report
  if (typeof localStorage !== 'undefined') {
    try {
      const reports = getLocalReports()
      reports[report.session.id] = report
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports))
    } catch (err) {
      console.warn('Failed saving report to localStorage:', err)
    }
  }
}

function getLocalLeads(): AuditLead[] {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LEADS)
      if (raw) {
        const parsed = JSON.parse(raw)
        const combined = [...memoryLeadsStore]
        parsed.forEach((l: AuditLead) => {
          if (!combined.some((item) => item.id === l.id)) {
            combined.push(l)
          }
        })
        return combined
      }
    } catch (err) {
      console.warn('LocalStorage read leads error:', err)
    }
  }
  return memoryLeadsStore
}

function saveLocalLead(lead: AuditLead): void {
  const existingIdx = memoryLeadsStore.findIndex((l) => l.id === lead.id)
  if (existingIdx >= 0) {
    memoryLeadsStore[existingIdx] = lead
  } else {
    memoryLeadsStore.unshift(lead)
  }

  if (typeof localStorage !== 'undefined') {
    try {
      const leads = getLocalLeads()
      const idx = leads.findIndex((l) => l.id === lead.id)
      if (idx >= 0) {
        leads[idx] = lead
      } else {
        leads.unshift(lead)
      }
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads))
    } catch (err) {
      console.warn('Failed saving lead to localStorage:', err)
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ORCHESTRATOR
// ─────────────────────────────────────────────────────────────────────────────

export class AuditOrchestrator {
  private instagramProvider = new LiveInstagramDataProvider()
  private aiProvider = new MockAIProvider()

  /**
   * Creates an audit session in the database.
   *
   * If instagramUserId and rootInstagramUserId are provided (from Level-1
   * profile identification via the Edge Function), they are persisted so
   * the Level-2 audit engine can load them securely without the frontend
   * passing any credentials.
   */
  async createAudit(
    username: string,
    instagramUserId?: string,
    rootInstagramUserId?: string,
  ): Promise<AuditSession> {
    const auditId = `aud_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    const token = `tok_${Math.random().toString(36).substr(2, 12)}`
    const cleanUsername = username.toLowerCase().trim().replace(/^@/, '')

    const session: AuditSession = {
      id: auditId,
      session_token: token,
      instagram_username: cleanUsername,
      status: 'PENDING',
      overall_score: null,
      audit_version: '2.0',
      data_source: instagramUserId ? 'META' : 'MOCK',
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('audit_sessions').insert({
          id: session.id,
          session_token: session.session_token,
          instagram_username: cleanUsername,
          status: session.status,
          audit_version: session.audit_version,
          data_source: session.data_source,
          // Store Instagram IDs server-side for secure Level-2 lookup
          ...(instagramUserId ? { instagram_user_id: instagramUserId } : {}),
          ...(rootInstagramUserId ? { root_instagram_user_id: rootInstagramUserId } : {}),
        })
      } catch (err) {
        console.warn('[AuditOrchestrator] Supabase createAudit failed, using local fallback:', err)
      }
    }

    await AnalyticsService.trackEvent('AUDIT_STARTED', session.id, { username: cleanUsername })
    return session
  }

  /**
   * Runs the Level-2 audit via the `instagram-audit` Supabase Edge Function.
   *
   * The Edge Function:
   *   1. Loads instagramUsername + IDs from DB using auditId
   *   2. Calls Meta Business Discovery media API with pagination
   *   3. Filters by 30-day window
   *   4. Computes all metrics, scores, opportunities
   *   5. Returns a complete Level2AuditReport
   *
   * The Level-2 report is stored in localStorage by auditId.
   * A compatibility AuditReport is also produced for legacy UI components.
   */
  async processAudit(
    auditId: string,
    onProgress?: (stage: string, percent: number) => void,
    auditWindowDays = 30,
  ): Promise<AuditReport> {
    if (onProgress) onProgress('Loading audit session...', 10)

    const session = await this.getAuditSession(auditId)
    const isDemoAccount = session.instagram_username.startsWith('demo_')

    // ── LEVEL-2: Real accounts → Supabase Edge Function ────────────────────
    if (!isDemoAccount && isSupabaseConfigured && supabase) {
      try {
        if (onProgress) onProgress('Connecting to Instagram via Meta API...', 20)

        const { data: level2Data, error } = await supabase.functions.invoke('instagram-audit', {
          body: { auditId, auditWindowDays },
        })

        if (error) throw new Error(`Edge function error: ${error.message}`)
        if (!level2Data || level2Data.error) {
          throw new Error(level2Data?.error || 'instagram-audit returned no data')
        }

        const level2Report = level2Data as Level2AuditReport

        if (onProgress) onProgress('Processing media and analytics...', 60)

        // Persist Level-2 report to localStorage
        storeLevel2Report(auditId, level2Report)

        if (onProgress) onProgress('Generating growth opportunities...', 85)

        // Convert to legacy AuditReport for backward-compatible UI components
        const legacyReport = this.convertLevel2ToLegacy(session, level2Report)
        saveLocalReport(legacyReport)

        await AnalyticsService.trackEvent('REPORT_GENERATED', auditId, {
          score: level2Report.score.total,
          postsAnalyzed: level2Report.auditWindow.postsAnalyzed,
          opportunityCount: level2Report.opportunities.length,
        })

        if (onProgress) onProgress('Audit complete!', 100)
        return legacyReport
      } catch (err) {
        console.error('[AuditOrchestrator] Level-2 edge function failed:', err)
        // Fall through to legacy/mock processing
        if (onProgress) onProgress('Falling back to local analysis...', 40)
      }
    }

    // ── FALLBACK / DEMO: client-side mock scoring ───────────────────────────
    if (onProgress) onProgress('Collecting profile data...', 25)
    session.status = 'COLLECTING_DATA'

    const profile = await this.instagramProvider.getProfile(session.instagram_username)
    profile.audit_id = auditId

    const media = await this.instagramProvider.getMedia(session.instagram_username)
    media.forEach((m) => (m.audit_id = auditId))

    if (onProgress) onProgress('Calculating engagement scores...', 55)
    session.status = 'ANALYZING'
    const scores = calculateFullAuditScore(profile, media)

    if (onProgress) onProgress('Building growth recommendations...', 80)
    const findings = await this.aiProvider.generateFindings(profile, media, scores)
    const recommendations = await this.aiProvider.generateRecommendations(profile, scores, findings)
    const growthPlan = await this.aiProvider.generate30DayPlan(profile, findings)

    if (onProgress) onProgress('Finalizing report...', 95)
    session.status = 'COMPLETED'
    session.overall_score = scores.overall_score
    session.completed_at = new Date().toISOString()

    const report: AuditReport = {
      session,
      profile,
      media,
      scores,
      findings,
      recommendations,
      growthPlan,
      lead: null,
      dataCompleteness: {
        profile: true,
        media: true,
        engagement: true,
        reels: media.some((m) => m.media_type === 'REEL'),
      },
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('audit_sessions')
          .update({
            status: 'COMPLETED',
            overall_score: scores.overall_score,
            completed_at: session.completed_at,
          })
          .eq('id', auditId)
      } catch (err) {
        console.warn('[AuditOrchestrator] Supabase update failed:', err)
      }
    }

    saveLocalReport(report)

    await AnalyticsService.trackEvent('REPORT_GENERATED', auditId, {
      score: scores.overall_score,
    })

    if (onProgress) onProgress('Completed!', 100)
    return report
  }

  /**
   * Converts a Level2AuditReport to the legacy AuditReport shape so that
   * existing UI components continue to work without full redesign.
   */
  private convertLevel2ToLegacy(session: AuditSession, r: Level2AuditReport): AuditReport {
    const breakdown = r.score.breakdown

    // Normalize category scores to 0-100 for legacy component display
    const profileNorm = Math.round((breakdown.profile / 20) * 100)
    const contentNorm = Math.round((breakdown.content / 25) * 100)
    const engagementNorm = Math.round((breakdown.engagement / 25) * 100)
    const consistencyNorm = Math.round((breakdown.consistency / 15) * 100)
    const conversionNorm = Math.round((breakdown.conversionReadiness / 15) * 100)

    const updatedSession: AuditSession = {
      ...session,
      status: 'COMPLETED',
      overall_score: r.score.total,
      completed_at: new Date().toISOString(),
      instagram_username: r.profile.username,
    }

    const legacyProfile = {
      username: r.profile.username,
      display_name: r.profile.name,
      bio: r.profile.biography,
      profile_image_url: r.profile.profilePictureUrl,
      category: 'Business & Brand',
      website_url: r.profile.website,
      followers_count: r.profile.followers,
      following_count: r.profile.following,
      posts_count: r.profile.mediaCount,
      is_business_account: true,
      is_creator_account: false,
      data_source: 'META' as const,
      audit_id: r.auditId,
    }

    const legacyScores = {
      audit_id: r.auditId,
      profile_score: profileNorm,
      content_score: contentNorm,
      reels_score: contentNorm,            // Reels is subsumed into Content
      engagement_score: engagementNorm,
      consistency_score: consistencyNorm,
      branding_score: profileNorm,         // Branding subsumed into Profile
      conversion_score: conversionNorm,
      overall_score: r.score.total,
      profile_completeness: profileNorm,
      bio_has_cta: r.contentAnalysis.captionStats.CTAUsagePercentage > 0,
      has_website: !!r.profile.website,
    }

    // Convert opportunities to legacy recommendations
    const legacyRecommendations = r.opportunities.map((opp, i) => ({
      id: `opp_${opp.rule}`,
      audit_id: r.auditId,
      title: opp.title,
      description: opp.description,
      // Normalize Level-2 ('HIGH'/'MEDIUM'/'LOW') to legacy ('High'/'Medium'/'Low')
      impact: (opp.impact === 'HIGH' ? 'High' : opp.impact === 'MEDIUM' ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
      effort: (opp.effort === 'LOW' ? 'Easy' : opp.effort === 'MEDIUM' ? 'Medium' : 'Hard') as 'Easy' | 'Medium' | 'Hard',
      category: opp.category,
      priority: i + 1,
      ai_generated: false,
      evidence: opp.evidence,
    }))

    return {
      session: updatedSession,
      profile: legacyProfile,
      media: [],
      scores: legacyScores,
      findings: [],
      recommendations: legacyRecommendations,
      growthPlan: [],
      lead: null,
      dataCompleteness: {
        profile: true,
        media: true,
        engagement: true,
        reels: r.metrics.reelsAnalyzed > 0,
      },
    }
  }

  async getAuditReport(auditId: string): Promise<AuditReport | null> {
    const local = getLocalReports()
    if (local[auditId]) return local[auditId]

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData } = await supabase
          .from('audit_sessions')
          .select('*')
          .eq('id', auditId)
          .single()

        if (sessionData) {
          return await this.processAudit(auditId)
        }
      } catch (err) {
        console.warn('[AuditOrchestrator] Supabase fetch audit error:', err)
      }
    }

    return null
  }

  async captureLead(auditId: string, leadData: Omit<AuditLead, 'id' | 'created_at'>): Promise<AuditLead> {
    const lead: AuditLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      audit_id: auditId,
      ...leadData,
      lead_source: 'INSTAGRAM_AUDIT',
      lead_status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    saveLocalLead(lead)

    const report = await this.getAuditReport(auditId)
    if (report) {
      report.lead = lead
      saveLocalReport(report)
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('audit_leads').insert({
          audit_id: auditId,
          name: lead.name,
          business_name: lead.business_name,
          email: lead.email,
          phone: lead.phone,
          whatsapp: lead.whatsapp,
          industry: lead.industry,
          city: lead.city,
          consent: lead.consent,
          lead_source: lead.lead_source,
          lead_status: lead.lead_status,
        })
      } catch (err) {
        console.warn('[AuditOrchestrator] Supabase captureLead error:', err)
      }
    }

    await AnalyticsService.trackEvent('LEAD_SUBMITTED', auditId, {
      email: lead.email,
      business_name: lead.business_name,
    })

    return lead
  }

  async getAllAudits(): Promise<AuditSession[]> {
    const local = getLocalReports()
    const reportsList = Object.values(local).map((r) => r.session)

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('audit_sessions')
          .select('*')
          .order('created_at', { ascending: false })

        if (data && data.length > 0) return data
      } catch (err) {
        console.warn('[AuditOrchestrator] Supabase getAllAudits error:', err)
      }
    }

    return reportsList
  }

  async getAllLeads(): Promise<AuditLead[]> {
    const localLeads = getLocalLeads()

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('audit_leads')
          .select('*')
          .order('created_at', { ascending: false })

        if (data && data.length > 0) return data
      } catch (err) {
        console.warn('[AuditOrchestrator] Supabase getAllLeads error:', err)
      }
    }

    return localLeads
  }

  async updateLeadStatus(leadId: string, newStatus: AuditLead['lead_status']): Promise<void> {
    const leads = getLocalLeads()
    const found = leads.find((l) => l.id === leadId)
    if (found) {
      found.lead_status = newStatus
      found.updated_at = new Date().toISOString()
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads))
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('audit_leads')
          .update({ lead_status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', leadId)
      } catch (err) {
        console.warn('[AuditOrchestrator] Supabase updateLeadStatus error:', err)
      }
    }
  }

  private async getAuditSession(auditId: string): Promise<AuditSession> {
    const local = getLocalReports()
    if (local[auditId]) return local[auditId].session

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('audit_sessions')
          .select('id, instagram_username, status, overall_score, audit_version, data_source, created_at, started_at, completed_at, session_token')
          .eq('id', auditId)
          .single()

        if (data) {
          return {
            id: data.id,
            session_token: data.session_token,
            instagram_username: data.instagram_username,
            status: data.status,
            overall_score: data.overall_score,
            audit_version: data.audit_version ?? '2.0',
            data_source: data.data_source ?? 'META',
            created_at: data.created_at,
            started_at: data.started_at,
            completed_at: data.completed_at,
          } satisfies AuditSession
        }
      } catch (err) {
        console.warn('[AuditOrchestrator] Supabase getAuditSession error:', err)
      }
    }

    // Fallback stub — username unknown at this point
    return {
      id: auditId,
      session_token: 'token_local',
      instagram_username: '',
      status: 'PENDING',
      overall_score: null,
      audit_version: '2.0',
      data_source: 'MOCK',
      created_at: new Date().toISOString(),
    }
  }
}
