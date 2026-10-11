// src/app/api/hr/add-site-visit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface LiveLocation {
  address: string
  accuracy: number
  latitude: number
  longitude: number
  timestamp: string
}

interface SiteVisitInput {
  _key?: string
  _type?: 'siteVisit'
  notes?: string
  toTime: string
  fromTime: string
  location?: string
  followUps?: string
  visitDate: string
  companyName: string
  projectName?: string
  salesPerson?: string
  customerName?: string
  liveLocation?: LiveLocation
}

interface RequestBody {
  employee_id: string
  site_visit: SiteVisitInput
  otp_code: string
  mode?: 'insert' | 'update'  // ✅ new field
}

const safeParseArray = (raw: any): any[] => {
  if (!raw) return []
  try {
    let val = raw
    if (typeof val === 'string') val = JSON.parse(val)
    if (Array.isArray(val)) return val
    if (val && typeof val === 'object') {
      if (Array.isArray(val.visits)) return val.visits
      if (Array.isArray(val.data)) return val.data
      if (Array.isArray(val.items)) return val.items
    }
    return []
  } catch {
    return []
  }
}

const generateVisitKey = (): string => {
  const ts = Date.now()
  const rand = Math.random().toString(36).substring(2, 9)
  return `visit_${ts}_${rand}`
}

// OTP verification
async function verifySiteVisitOtp(
  otpCode: string,
  employeeId: string
): Promise<{ valid: boolean; message?: string }> {
  const code = otpCode.trim()

  if (!code || code.length !== 6) {
    return { valid: false, message: 'Invalid OTP format (must be 6 digits).' }
  }

  const { data, error } = await supabase
    .from('site_visit_otp_codes')
    .select('*')
    .eq('code', code)
    .eq('employee_id', employeeId)
    .eq('used', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('OTP lookup error:', error)
    return { valid: false, message: 'Failed to verify OTP: ' + error.message }
  }

  if (!data) {
    return {
      valid: false,
      message: `Invalid or expired verification code for employee ${employeeId}.`,
    }
  }

  const createdAt = new Date(data.created_at).getTime()
  const expiresAt = data.expires_at
    ? new Date(data.expires_at).getTime()
    : createdAt + 10 * 60 * 1000

  if (Date.now() > expiresAt) {
    return { valid: false, message: 'Verification code expired.' }
  }

  const { error: updateErr } = await supabase
    .from('site_visit_otp_codes')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('id', data.id)

  if (updateErr) {
    console.error('OTP mark used error:', updateErr)
  }

  return { valid: true }
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()
    const { employee_id, site_visit, otp_code, mode = 'insert' } = body

    if (!employee_id || !String(employee_id).trim()) {
      return NextResponse.json(
        { success: false, message: 'employee_id is required.' },
        { status: 400 }
      )
    }

    if (!site_visit) {
      return NextResponse.json(
        { success: false, message: 'site_visit payload is required.' },
        { status: 400 }
      )
    }

    if (!otp_code) {
      return NextResponse.json(
        { success: false, message: 'OTP code is required.' },
        { status: 400 }
      )
    }

    if (
      !site_visit.companyName?.trim() ||
      !site_visit.fromTime?.trim() ||
      !site_visit.toTime?.trim() ||
      !site_visit.visitDate?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Company Name, From Time, To Time and Visit Date are required.',
        },
        { status: 400 }
      )
    }

    const empId = String(employee_id).trim()

    // Verify OTP
    const otpCheck = await verifySiteVisitOtp(otp_code, empId)
    if (!otpCheck.valid) {
      return NextResponse.json(
        { success: false, message: otpCheck.message || 'OTP verification failed.' },
        { status: 401 }
      )
    }

    // Fetch employee
    const { data: empRow, error: empErr } = await supabase
      .from('employees')
      .select('employee_id, full_name, site_visits')
      .eq('employee_id', empId)
      .maybeSingle()

    if (empErr) {
      console.error('Fetch employee error:', empErr)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch employee: ' + empErr.message },
        { status: 500 }
      )
    }

    if (!empRow) {
      return NextResponse.json(
        { success: false, message: `Employee not found: ${empId}` },
        { status: 404 }
      )
    }

    const existingArr = safeParseArray(empRow.site_visits)

    const liveLoc: LiveLocation = site_visit.liveLocation || {
      address: site_visit.location?.trim() || '',
      accuracy: 0,
      latitude: 0,
      longitude: 0,
      timestamp: new Date().toISOString(),
    }

    const newEntry = {
      _key: site_visit._key || generateVisitKey(),
      _type: 'siteVisit' as const,
      notes: site_visit.notes?.trim() || '',
      toTime: site_visit.toTime.trim(),
      fromTime: site_visit.fromTime.trim(),
      location: site_visit.location?.trim() || '',
      followUps: site_visit.followUps?.trim() || '',
      visitDate: site_visit.visitDate.trim(),
      companyName: site_visit.companyName.trim(),
      projectName: site_visit.projectName?.trim() || '',
      salesPerson: site_visit.salesPerson?.trim() || '',
      customerName: site_visit.customerName?.trim() || '',
      liveLocation: liveLoc,
    }

    // =====================================================
    // ✅ FIND EXISTING VISIT FOR SAME visitDate
    //    (auto-detect — regardless of mode passed)
    // =====================================================
    const idx = existingArr.findIndex(
      (v: any) =>
        String(v.visitDate || '') === String(newEntry.visitDate)
    )

    let updatedArr: any[]
    let isUpdate = false

    if (idx !== -1) {
      // ✅ Same date visit exists → REPLACE (preserve old _key if present)
      const oldVisit = existingArr[idx]
      newEntry._key = oldVisit._key || newEntry._key

      updatedArr = [...existingArr]
      updatedArr[idx] = newEntry
      isUpdate = true
    } else {
      // ✅ No visit for this date → APPEND new
      updatedArr = [...existingArr, newEntry]
    }

    // Update employee row
    const { error: updErr } = await supabase
      .from('employees')
      .update({
        site_visits: updatedArr,
        updated_at: new Date().toISOString(),
      })
      .eq('employee_id', empId)

    if (updErr) {
      console.error('Update site_visits error:', updErr)
      return NextResponse.json(
        { success: false, message: 'Failed to save site visit: ' + updErr.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: isUpdate
        ? `Site visit for ${newEntry.visitDate} updated for ${empRow.full_name || empId}.`
        : `Site visit added for ${empRow.full_name || empId}.`,
      mode: isUpdate ? 'update' : 'insert',
      total_visits: updatedArr.length,
      saved_entry: newEntry,
    })
  } catch (err: any) {
    console.error('❌ add-site-visit error:', err)
    return NextResponse.json(
      { success: false, message: err?.message || 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}