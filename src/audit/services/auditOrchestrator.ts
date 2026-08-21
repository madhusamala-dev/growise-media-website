import { LiveInstagramDataProvider } from '../providers/LiveInstagramDataProvider'
import { MockAIProvider } from '../providers/MockAIProvider'
import { calculateFullAuditScore } from '../engine/overallScorer'
import { isSupabaseConfigured, supabase } from './supabaseClient'
import { AnalyticsService } from './analyticsService'
import type {
  AuditLead,
  AuditReport,
  AuditSession,
} from '../types'

// Memory & localStorage fallback store
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

export class AuditOrchestrator {
  private instagramProvider = new LiveInstagramDataProvider()
  private aiProvider = new MockAIProvider()

  async createAudit(username: string): Promise<AuditSession> {
    const auditId = `aud_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    const token = `tok_${Math.random().toString(36).substr(2, 12)}`

    const session: AuditSession = {
      id: auditId,
      session_token: token,
      instagram_username: username.toLowerCase(),
      status: 'PENDING',
      overall_score: null,
      audit_version: '1.0',
      data_source: 'MOCK',
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('audit_sessions').insert({
          id: session.id,
          session_token: session.session_token,
          instagram_username: session.instagram_username,
          status: session.status,
          audit_version: session.audit_version,
          data_source: session.data_source,
        })
      } catch (err) {
        console.warn('Supabase create audit failed, falling back to local:', err)
      }
    }

    await AnalyticsService.trackEvent('AUDIT_STARTED', session.id, { username })
    return session
  }

  async processAudit(
    auditId: string,
    onProgress?: (stage: string, percent: number) => void
  ): Promise<AuditReport> {
    // Stage 1: Collect Data
    if (onProgress) onProgress('Checking profile & collecting media...', 20)
    const session = await this.getAuditSession(auditId)
    session.status = 'COLLECTING_DATA'

    const profile = await this.instagramProvider.getProfile(session.instagram_username)
    profile.audit_id = auditId

    const media = await this.instagramProvider.getMedia(session.instagram_username)
    media.forEach((m) => (m.audit_id = auditId))

    // Stage 2: Analyze & Calculate Scores
    if (onProgress) onProgress('Evaluating engagement, Reels & profile score...', 50)
    session.status = 'ANALYZING'
    const scores = calculateFullAuditScore(profile, media)

    // Stage 3: AI Recommendations & Findings
    if (onProgress) onProgress('Generating AI recommendations & growth strategy...', 80)
    const findings = await this.aiProvider.generateFindings(profile, media, scores)
    const recommendations = await this.aiProvider.generateRecommendations(profile, scores, findings)
    const growthPlan = await this.aiProvider.generate30DayPlan(profile, findings)

    // Stage 4: Complete Report
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

    // Save to Supabase if configured
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

        await supabase.from('audit_profiles').insert({
          audit_id: auditId,
          username: profile.username,
          display_name: profile.display_name,
          bio: profile.bio,
          profile_image_url: profile.profile_image_url,
          category: profile.category,
          website_url: profile.website_url,
          followers_count: profile.followers_count,
          following_count: profile.following_count,
          posts_count: profile.posts_count,
          is_business_account: profile.is_business_account,
          is_creator_account: profile.is_creator_account,
          data_source: profile.data_source,
        })

        await supabase.from('audit_scores').insert({
          audit_id: auditId,
          profile_score: scores.profile_score,
          content_score: scores.content_score,
          reels_score: scores.reels_score,
          engagement_score: scores.engagement_score,
          consistency_score: scores.consistency_score,
          branding_score: scores.branding_score,
          conversion_score: scores.conversion_score,
          overall_score: scores.overall_score,
        })
      } catch (err) {
        console.warn('Supabase processAudit sync error:', err)
      }
    }

    // Save to local fallback store
    saveLocalReport(report)

    await AnalyticsService.trackEvent('REPORT_GENERATED', auditId, {
      score: scores.overall_score,
    })

    if (onProgress) onProgress('Completed!', 100)
    return report
  }

  async getAuditReport(auditId: string): Promise<AuditReport | null> {
    const local = getLocalReports()
    if (local[auditId]) {
      return local[auditId]
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData } = await supabase
          .from('audit_sessions')
          .select('*')
          .eq('id', auditId)
          .single()

        if (sessionData) {
          // Process and re-synthesize report
          return await this.processAudit(auditId)
        }
      } catch (err) {
        console.warn('Supabase fetch audit error:', err)
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

    // Update report in memory/storage with lead
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
        console.warn('Supabase captureLead insert error:', err)
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

        if (data && data.length > 0) {
          return data
        }
      } catch (err) {
        console.warn('Supabase getAllAudits error:', err)
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

        if (data && data.length > 0) {
          return data
        }
      } catch (err) {
        console.warn('Supabase getAllLeads error:', err)
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
        console.warn('Supabase updateLeadStatus error:', err)
      }
    }
  }

  private async getAuditSession(auditId: string): Promise<AuditSession> {
    const local = getLocalReports()
    if (local[auditId]) {
      return local[auditId].session
    }

    return {
      id: auditId,
      session_token: 'token_mock',
      instagram_username: 'demo_cafe',
      status: 'PENDING',
      overall_score: null,
      audit_version: '1.0',
      data_source: 'MOCK',
      created_at: new Date().toISOString(),
    }
  }
}
