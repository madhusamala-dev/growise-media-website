import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { auditId, name, businessName, email, phone, whatsapp, industry, city, consent } = body

    if (!name || !businessName || !email || !consent) {
      return new Response(
        JSON.stringify({ error: 'Name, Business Name, Email and Consent are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabase
      .from('audit_leads')
      .insert({
        audit_id: auditId || null,
        name,
        business_name: businessName,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        industry: industry || null,
        city: city || null,
        consent: Boolean(consent),
        lead_source: 'INSTAGRAM_AUDIT',
        lead_status: 'NEW',
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, lead: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
