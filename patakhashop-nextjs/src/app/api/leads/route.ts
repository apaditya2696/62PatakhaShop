import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { LeadSchema } from '@/lib/validations'
import { getMemoryLeads } from '@/lib/memoryStore'

function getAdminKey(): string {
  const key = process.env.ADMIN_KEY
  if (!key || key.trim() === '') {
    return 'patakha62admin'
  }
  return key.trim()
}

// ── Zero-Copy Pre-Serialized RAM Caching for Leads ──
let cachedLeadsJsonString: string | null = null
let lastLeadsCacheTime = 0
const LEADS_CACHE_TTL_MS = 5000 // 5 seconds TTL

export function invalidateLeadsCache() {
  cachedLeadsJsonString = null
  lastLeadsCacheTime = 0
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('password')
  const ADMIN_KEY = getAdminKey()

  if (!ADMIN_KEY || !password) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Valid ADMIN_KEY required.' }, { status: 401 })
  }

  const pBuf = Buffer.from(password)
  const aBuf = Buffer.from(ADMIN_KEY)
  if (pBuf.length !== aBuf.length || !crypto.timingSafeEqual(pBuf, aBuf)) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid credentials.' }, { status: 401 })
  }

  const now = Date.now()
  if (cachedLeadsJsonString && now - lastLeadsCacheTime < LEADS_CACHE_TTL_MS) {
    return new Response(cachedLeadsJsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'X-Cache-Status': 'HIT_PRESERIALIZED_LEADS',
      },
    })
  }

  let leadsData: any[] = []

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('leads')
      .select('id, name, email, mobile, requirement, status, created_at')
      .order('created_at', { ascending: false })
    if (data && data.length > 0) {
      leadsData = data
    }
  }

  if (leadsData.length === 0) {
    leadsData = getMemoryLeads()
  }

  const responsePayload = { success: true, count: leadsData.length, leads: leadsData }
  cachedLeadsJsonString = JSON.stringify(responsePayload)
  lastLeadsCacheTime = Date.now()

  return new Response(cachedLeadsJsonString, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
      'X-Cache-Status': 'MISS_FRESH_LEADS',
    },
  })
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    const rateCheck = checkRateLimit(clientIp, 10, 60000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Please wait a minute before trying again.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const rawName = body.name || body.customerName
    const rawMobile = body.mobile || body.phone || body.customerPhone
    const rawEmail = body.email || ''

    let requirement = body.requirement || body.message || ''
    if (body.eventType || body.eventDate || body.venue) {
      const details = [
        body.eventType ? `Event: ${body.eventType}` : '',
        body.eventDate ? `Date: ${body.eventDate}` : '',
        body.venue ? `Venue: ${body.venue}` : '',
        requirement ? `Note: ${requirement}` : '',
      ].filter(Boolean).join(' | ')
      requirement = details || requirement
    }

    const leadPayload = {
      name: rawName ? String(rawName).trim() : '',
      mobile: rawMobile ? String(rawMobile).replace(/\D/g, '').slice(0, 15) : '',
      email: rawEmail ? String(rawEmail).trim() : '',
      requirement: requirement ? String(requirement).trim() : 'General Enquiry',
    }

    const validationResult = LeadSchema.safeParse(leadPayload)
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Invalid lead data'
      return NextResponse.json({ success: false, error: firstError }, { status: 400 })
    }

    const val = validationResult.data
    const newLead = {
      id: 'lead_' + Date.now(),
      name: val.name,
      email: val.email || '',
      mobile: val.mobile,
      requirement: val.requirement,
      createdAt: new Date().toISOString(),
      status: 'new',
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      await supabaseAdmin.from('leads').insert({
        id: newLead.id,
        name: newLead.name,
        email: newLead.email,
        mobile: newLead.mobile,
        requirement: newLead.requirement,
        status: newLead.status,
        created_at: newLead.createdAt,
      })
    } else {
      const leads = getMemoryLeads()
      leads.unshift(newLead)
    }

    invalidateLeadsCache()

    return NextResponse.json({ success: true, lead: newLead })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
