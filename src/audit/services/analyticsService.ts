import { isSupabaseConfigured, supabase } from './supabaseClient'
import type { AuditEvent } from '../types'

export class AnalyticsService {
  private static eventsMemoryStore: AuditEvent[] = []

  static async trackEvent(
    eventType: AuditEvent['event_type'],
    auditId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const eventRecord: AuditEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      audit_id: auditId,
      event_type: eventType,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    }

    this.eventsMemoryStore.push(eventRecord)

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('audit_events').insert({
          audit_id: auditId,
          event_type: eventType,
          metadata: metadata || {},
        })
      } catch (err) {
        console.warn('Analytics event insert failed:', err)
      }
    }
  }

  static getMemoryEvents(): AuditEvent[] {
    return [...this.eventsMemoryStore]
  }
}
