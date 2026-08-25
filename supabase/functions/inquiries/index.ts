/**
 * inquiries — Supabase Edge Function
 *
 * Receives the website LeadForm submission, validates & sanitises the data,
 * inserts a row into the `leads` table, then sends an internal notification
 * email via Resend.
 *
 * Environment variables (set via `supabase secrets set`):
 *   EMAIL_API_KEY     — Resend API key
 *   INQUIRY_EMAIL_TO  — recipient address (default: social@growise.media)
 *   EMAIL_FROM        — sender address
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── CORS ────────────────────────────────────────────────────────────────────
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Validation limits ────────────────────────────────────────────────────────
const MAX_LENGTHS: Record<string, number> = {
  name: 100,
  businessName: 200,
  phone: 30,
  email: 254,
  businessCategory: 100,
  location: 200,
  advertisingRequirement: 2000,
  additionalNotes: 3000,
  website: 500,
  instagram: 200,
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitize(value: unknown): string {
  if (typeof value !== 'string') return ''
  return escapeHtml(value.trim())
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

function validatePhone(phone: string): boolean {
  return /^[+]?[0-9\s\-()]{7,30}$/.test(phone)
}

interface LeadPayload {
  name: string
  businessName: string
  phone: string
  email?: string
  businessCategory?: string
  location?: string
  advertisingRequirement?: string
  contentTypes?: string[]
  monthlyContentVolume?: string
  website?: string
  instagram?: string
  additionalNotes?: string
  pageUrl?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

// ── Email builder ────────────────────────────────────────────────────────────
function buildEmailHtml(body: LeadPayload, leadId: string): string {
  const fields: [string, string | undefined][] = [
    ['Business', body.businessName],
    ['Customer', body.name],
    ['Phone', body.phone],
    ['Email', body.email],
    ['Business Category', body.businessCategory],
    ['Location', body.location],
  ]

  const interestedIn = body.contentTypes?.length
    ? body.contentTypes.join('<br/>')
    : undefined

  const optionalFields: [string, string | undefined][] = [
    ['Advertising Requirement', body.advertisingRequirement],
    ['Monthly Content Volume', body.monthlyContentVolume],
    ['Website', body.website],
    ['Instagram', body.instagram],
    ['Additional Notes', body.additionalNotes],
  ]

  const now = new Date()
  const ist = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 40px;text-align:center;">
    <div style="font-size:28px;margin-bottom:8px;">🔥</div>
    <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">NEW GROWISE MEDIA INQUIRY</h1>
  </td></tr>

  <!-- Quick Summary -->
  <tr><td style="padding:28px 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${fields.map(([label, val]) =>
        val ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">${label}</td></tr>
      <tr><td style="padding:0 0 12px;color:#111827;font-size:16px;font-weight:500;">${escapeHtml(val)}</td></tr>` : ''
      ).join('')}
      ${interestedIn ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Interested In</td></tr>
      <tr><td style="padding:0 0 12px;color:#111827;font-size:15px;line-height:1.6;">${interestedIn}</td></tr>` : ''}
      ${body.monthlyContentVolume ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Content Volume</td></tr>
      <tr><td style="padding:0 0 12px;color:#111827;font-size:15px;">${escapeHtml(body.monthlyContentVolume)}</td></tr>` : ''}
    </table>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>

  <!-- Full Details -->
  <tr><td style="padding:24px 40px;">
    <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;">Customer Details</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;line-height:1.7;">
      <tr><td style="padding:4px 0;color:#6b7280;width:180px;">Name</td><td>${escapeHtml(body.name)}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Phone</td><td>${escapeHtml(body.phone)}</td></tr>
      ${body.email ? `<tr><td style="padding:4px 0;color:#6b7280;">Email</td><td><a href="mailto:${escapeHtml(body.email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(body.email)}</a></td></tr>` : ''}
    </table>
  </td></tr>

  <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>

  <tr><td style="padding:24px 40px;">
    <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;">Business Information</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;line-height:1.7;">
      <tr><td style="padding:4px 0;color:#6b7280;width:180px;">Business Name</td><td>${escapeHtml(body.businessName)}</td></tr>
      ${body.businessCategory ? `<tr><td style="padding:4px 0;color:#6b7280;">Category</td><td>${escapeHtml(body.businessCategory)}</td></tr>` : ''}
      ${body.location ? `<tr><td style="padding:4px 0;color:#6b7280;">Location</td><td>${escapeHtml(body.location)}</td></tr>` : ''}
    </table>
  </td></tr>

  ${body.advertisingRequirement ? `
  <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>
  <tr><td style="padding:24px 40px;">
    <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;">Advertising Requirement</h2>
    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${escapeHtml(body.advertisingRequirement)}</p>
  </td></tr>` : ''}

  ${interestedIn ? `
  <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>
  <tr><td style="padding:24px 40px;">
    <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;">Content Requirement</h2>
    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${interestedIn}</p>
  </td></tr>` : ''}

  ${body.monthlyContentVolume ? `
  <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>
  <tr><td style="padding:24px 40px;">
    <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;">Monthly Content</h2>
    <p style="margin:0;font-size:14px;color:#374151;">${escapeHtml(body.monthlyContentVolume)}</p>
  </td></tr>` : ''}

  ${(body.website || body.instagram) ? `
  <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>
  <tr><td style="padding:24px 40px;">
    <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;">Online Presence</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;line-height:1.7;">
      ${body.website ? `<tr><td style="padding:4px 0;color:#6b7280;width:100px;">Website</td><td><a href="${escapeHtml(body.website)}" style="color:#2563eb;text-decoration:none;" target="_blank">${escapeHtml(body.website)}</a></td></tr>` : ''}
      ${body.instagram ? `<tr><td style="padding:4px 0;color:#6b7280;">Instagram</td><td>${escapeHtml(body.instagram)}</td></tr>` : ''}
    </table>
  </td></tr>` : ''}

  ${body.additionalNotes ? `
  <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>
  <tr><td style="padding:24px 40px;">
    <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;">Additional Information</h2>
    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${escapeHtml(body.additionalNotes)}</p>
  </td></tr>` : ''}

  <!-- Lead metadata -->
  <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/></td></tr>
  <tr><td style="padding:24px 40px;">
    <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;">Lead Information</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;line-height:1.7;">
      <tr><td style="padding:4px 0;color:#6b7280;width:120px;">Status</td><td><span style="background:#dbeafe;color:#1d4ed8;padding:2px 10px;border-radius:99px;font-size:12px;font-weight:600;text-transform:uppercase;">New</span></td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Source</td><td>Growise Media Website</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Submitted</td><td>${ist} IST</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Lead ID</td><td style="font-family:monospace;font-size:12px;">${leadId}</td></tr>
    </table>
  </td></tr>

</table>
<p style="margin:16px 0 0;text-align:center;font-size:12px;color:#9ca3af;">This is an internal notification. Do not reply to this email directly.</p>
</td></tr>
</table>
</body>
</html>`
}

// ── Main handler ─────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ── 1. Parse ───────────────────────────────────────────────────────────
    const body: LeadPayload = await req.json()

    // ── 2. Validate required fields ────────────────────────────────────────
    const name = (body.name ?? '').trim()
    const businessName = (body.businessName ?? '').trim()
    const phone = (body.phone ?? '').trim()

    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({ success: false, message: 'Name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }
    if (!businessName) {
      return new Response(
        JSON.stringify({ success: false, message: 'Business name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }
    if (!validatePhone(phone)) {
      return new Response(
        JSON.stringify({ success: false, message: 'A valid phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Validate max lengths
    for (const [field, max] of Object.entries(MAX_LENGTHS)) {
      const val = (body as Record<string, unknown>)[field]
      if (typeof val === 'string' && val.length > max) {
        return new Response(
          JSON.stringify({ success: false, message: `Field "${field}" exceeds maximum length of ${max}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // Validate email format if supplied
    const email = (body.email ?? '').trim()
    if (email && !validateEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Validate contentTypes is an array
    if (body.contentTypes !== undefined && !Array.isArray(body.contentTypes)) {
      return new Response(
        JSON.stringify({ success: false, message: 'contentTypes must be an array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // ── 3. Sanitize ────────────────────────────────────────────────────────
    const clean = {
      name: sanitize(body.name),
      business_name: sanitize(body.businessName),
      phone: sanitize(body.phone),
      email: email ? sanitize(body.email) : null,
      business_category: body.businessCategory ? sanitize(body.businessCategory) : null,
      location: body.location ? sanitize(body.location) : null,
      advertising_requirement: body.advertisingRequirement ? sanitize(body.advertisingRequirement) : null,
      content_types: Array.isArray(body.contentTypes) ? body.contentTypes.map(String) : null,
      monthly_content_volume: body.monthlyContentVolume ? sanitize(body.monthlyContentVolume) : null,
      website: body.website ? sanitize(body.website) : null,
      instagram: body.instagram ? sanitize(body.instagram) : null,
      additional_notes: body.additionalNotes ? sanitize(body.additionalNotes) : null,
      source: 'website',
      status: 'new',
      email_status: 'pending',
      page_url: body.pageUrl || null,
      utm_source: body.utmSource || null,
      utm_medium: body.utmMedium || null,
      utm_campaign: body.utmCampaign || null,
    }

    // ── 4. Insert lead into Supabase ───────────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert(clean)
      .select('id')
      .single()

    if (dbError) {
      console.error('[inquiries] DB insert failed:', dbError.message)
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to save inquiry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const leadId: string = lead.id

    // ── 5. Send notification email ─────────────────────────────────────────
    const apiKey = Deno.env.get('EMAIL_API_KEY') ?? ''
    const emailTo = Deno.env.get('INQUIRY_EMAIL_TO') || 'social@growise.media'
    const emailFrom = Deno.env.get('EMAIL_FROM') || 'Growise Media <notifications@growise.media>'

    if (!apiKey) {
      console.error('[inquiries] EMAIL_API_KEY not set — skipping email')
      await supabase
        .from('leads')
        .update({ email_status: 'failed' })
        .eq('id', leadId)
      return new Response(
        JSON.stringify({ success: true, message: 'Inquiry submitted successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const emailSubject = `New Growise Inquiry — ${clean.business_name}`
    const emailHtml = buildEmailHtml(body, leadId)

    const resendPayload: Record<string, unknown> = {
      from: emailFrom,
      to: [emailTo],
      subject: emailSubject,
      html: emailHtml,
    }

    // Reply-To: customer email if provided
    if (clean.email) {
      resendPayload.reply_to = clean.email
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resendPayload),
    })

    if (!emailRes.ok) {
      const errText = await emailRes.text()
      console.error(`[inquiries] Email send failed (${emailRes.status}):`, errText)
      await supabase
        .from('leads')
        .update({ email_status: 'failed' })
        .eq('id', leadId)
    } else {
      await supabase
        .from('leads')
        .update({ email_status: 'sent', email_sent_at: new Date().toISOString() })
        .eq('id', leadId)
    }

    // ── 6. Success ─────────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({ success: true, message: 'Inquiry submitted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('[inquiries] Unexpected error:', err)
    return new Response(
      JSON.stringify({ success: false, message: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
