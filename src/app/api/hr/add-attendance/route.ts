// src/app/api/hr/add-attendance/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// =====================================================
// Helper: fetch employee's source (branch) from DB
// =====================================================
async function getEmployeeSource(employeeId: string): Promise<'K' | 'PQ' | null> {
  try {
    // Adjust table/column names if needed
    const { data, error } = await supabase
      .from('employees')
      .select('source')
      .eq('employee_id', employeeId)
      .maybeSingle()

    if (error || !data) {
      // Fallback: try 'employeeId' column
      const { data: data2 } = await supabase
        .from('employees')
        .select('source')
        .eq('employeeId', employeeId)
        .maybeSingle()

      if (data2?.source) {
        return (data2.source as 'K' | 'PQ') || null
      }
      return null
    }

    return (data.source as 'K' | 'PQ') || null
  } catch (err) {
    console.error('Error fetching employee source:', err)
    return null
  }
}

// =====================================================
// POST: Add attendance record
// Backend auto-determines branch + device from employee
// =====================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, employee_name, punch_type, timestamp } = body

    // ---------- Validation ----------
    if (!user_id || typeof user_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'user_id is required' },
        { status: 400 },
      )
    }

    if (!punch_type || !['CHECK_IN', 'CHECK_OUT'].includes(punch_type)) {
      return NextResponse.json(
        { success: false, error: 'punch_type must be CHECK_IN or CHECK_OUT' },
        { status: 400 },
      )
    }

    if (!timestamp) {
      return NextResponse.json(
        { success: false, error: 'timestamp is required' },
        { status: 400 },
      )
    }

    const ts = new Date(timestamp)
    if (isNaN(ts.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid timestamp format' },
        { status: 400 },
      )
    }

    // ---------- Fetch employee branch from DB ----------
    const source = await getEmployeeSource(user_id.trim())

    if (!source) {
      return NextResponse.json(
        {
          success: false,
          error: `Employee "${user_id}" not found or branch not set`,
        },
        { status: 404 },
      )
    }

    const isPQ = source === 'PQ'

    // PQ branch only allows CHECK_IN
    if (isPQ && punch_type === 'CHECK_OUT') {
      return NextResponse.json(
        {
          success: false,
          error: 'Port Qasim branch only supports Check In',
        },
        { status: 400 },
      )
    }

    const table = isPQ ? 'pq_attendance_logs' : 'attendance_logs'
    const effectivePunchType = isPQ ? 'CHECK_IN' : punch_type

    // ---------- Auto device ID + branch code ----------
    const branchPrefix = isPQ ? 'PQ' : 'K'
    const deviceId = isPQ ? 'PQ-01' : 'K-01'

    // ---------- raw_log_key: {BRANCH}_{EMPID}_{TIMESTAMP}_{DEVICEID} ----------
    const raw_log_key = `${branchPrefix}_${user_id.trim()}_${ts.getTime()}_${deviceId}`

    const record: any = {
      user_id: user_id.trim(),
      employee_name: employee_name?.trim() || null,
      punch_type: effectivePunchType,
      timestamp: ts.toISOString(),
      device_id: deviceId,
      branch_code: branchPrefix,
      raw_log_key,
    }

    // ---------- Insert ----------
    const { data, error } = await supabase
      .from(table)
      .insert([record])
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase insert error:', error)

      // Duplicate raw_log_key
      if (error.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error:
              'Isi time pe pehle se entry mojood hai. Thora time change karein.',
          },
          { status: 409 },
        )
      }

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      )
    }

    console.log('✅ Attendance added:', data)

    return NextResponse.json({
      success: true,
      message: 'Attendance recorded successfully',
      record: data,
    })
  } catch (err) {
    console.error('❌ Attendance error:', err)
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}

// =====================================================
// GET: fetch attendance (optional)
// =====================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const [kRes, pqRes] = await Promise.all([
      supabase
        .from('attendance_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit),
      supabase
        .from('pq_attendance_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit),
    ])

    let records = [...(kRes.data || []), ...(pqRes.data || [])]
    if (userId) records = records.filter((r) => r.user_id === userId)

    records.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return NextResponse.json({
      success: true,
      records: records.slice(0, limit),
    })
  } catch (err) {
    console.error('❌ Fetch attendance error:', err)
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}