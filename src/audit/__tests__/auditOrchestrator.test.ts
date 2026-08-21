import { describe, it, expect } from 'vitest'
import { AuditOrchestrator } from '../services/auditOrchestrator'

describe('AuditOrchestrator', () => {
  it('executes full audit creation and processing lifecycle for demo_cafe', async () => {
    const orchestrator = new AuditOrchestrator()

    // 1. Create audit session
    const session = await orchestrator.createAudit('demo_cafe')
    expect(session.id).toBeDefined()
    expect(session.session_token).toBeDefined()
    expect(session.instagram_username).toBe('demo_cafe')
    expect(session.status).toBe('PENDING')

    // 2. Process audit session
    const report = await orchestrator.processAudit(session.id)
    expect(report).toBeDefined()
    expect(report.session.status).toBe('COMPLETED')
    expect(report.scores.overall_score).toBeGreaterThanOrEqual(0)
    expect(report.scores.overall_score).toBeLessThanOrEqual(100)
    expect(report.findings.length).toBeGreaterThan(0)
    expect(report.recommendations.length).toBeGreaterThan(0)
    expect(report.growthPlan.length).toBe(4) // 4 weeks

    // 3. Retrieve audit report
    const retrieved = await orchestrator.getAuditReport(session.id)
    expect(retrieved).not.toBeNull()
    expect(retrieved?.session.id).toBe(session.id)
  })

  it('captures lead for completed audit and updates status', async () => {
    const orchestrator = new AuditOrchestrator()
    const session = await orchestrator.createAudit('demo_salon')
    await orchestrator.processAudit(session.id)

    const lead = await orchestrator.captureLead(session.id, {
      name: 'Rohan Sharma',
      business_name: 'Sharma Salon & Spa',
      email: 'rohan@sharmasalon.example.com',
      whatsapp: '+919876543210',
      industry: 'Beauty & Wellness',
      city: 'Bengaluru',
      consent: true,
    })

    expect(lead.id).toBeDefined()
    expect(lead.audit_id).toBe(session.id)
    expect(lead.lead_status).toBe('NEW')

    // Update lead status
    await orchestrator.updateLeadStatus(lead.id!, 'DEMO_BOOKED')
    const allLeads = await orchestrator.getAllLeads()
    const updated = allLeads.find((l) => l.id === lead.id)
    expect(updated?.lead_status).toBe('DEMO_BOOKED')
  })
})
