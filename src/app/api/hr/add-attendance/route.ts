// src/app/api/hr/add-attendance/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'

// ============================================================
// ERROR HELPER
// ============================================================

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return fallback
}

// ============================================================
// VALID PUNCH TYPES
// ============================================================

const VALID_PUNCH_TYPES = ['CHECK_IN', 'CHECK_OUT'] as const
type PunchType = (typeof VALID_PUNCH_TYPES)[number]

// ============================================================
// VALID BRANCH CODES
// ============================================================

const VALID_BRANCH_CODES = ['K', 'PQ'] as const

// ============================================================
// BRANCH → TABLE MAPPING
// ============================================================

const getTableForBranch = (
  branch: string
): 'attendance_logs' | 'pq_attendance_logs' => {
  return branch === 'PQ' ? 'pq_attendance_logs' : 'attendance_logs'
}

// ============================================================
// VERIFY OTP
// ============================================================

const verifyOTP = async (
  employeeId: string,
  otpCode: string
): Promise<{ valid: boolean; message: string }> => {
  if (!otpCode || typeof otpCode !== 'string' || otpCode.trim().length !== 6) {
    return { valid: false, message: 'Invalid verification code format.' }
  }

  const { data: otpRow, error } = await supabaseAdmin
    .from('attendance_otps')
    .select('id, otp_code, expires_at, used')
    .eq('employee_id', employeeId.trim())
    .eq('otp_code', otpCode.trim())
    .eq('used', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('OTP verify error:', error)
    return { valid: false, message: 'Unable to verify code.' }
  }

  if (!otpRow) {
    return {
      valid: false,
      message: 'Invalid or already used verification code.',
    }
  }

  if (new Date(otpRow.expires_at).getTime() < Date.now()) {
    return { valid: false, message: 'Verification code has expired.' }
  }

  // Mark as used
  await supabaseAdmin
    .from('attendance_otps')
    .update({ used: true })
    .eq('id', otpRow.id)

  return { valid: true, message: 'OK' }
}

// ============================================================
// POST — ADD ATTENDANCE LOGS (MULTIPLE) — OTP REQUIRED
// ============================================================

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { logs, otp_code } = body

    console.log('======================================')
    console.log('HR ADD ATTENDANCE LOGS')
    console.log('Logs count:', Array.isArray(logs) ? logs.length : 0)
    console.log('OTP provided:', !!otp_code)
    console.log('======================================')

    // ========================================================
    // VALIDATE INPUT
    // ========================================================

    if (!Array.isArray(logs) || logs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one log is required.' },
        { status: 400 }
      )
    }

    if (logs.length > 10) {
      return NextResponse.json(
        { success: false, message: 'Too many logs in one request (max 10).' },
        { status: 400 }
      )
    }

    // ========================================================
    // ✅ OTP VERIFY
    // ========================================================

    const employeeId = String(logs[0]?.user_id || '').trim()

    if (!otp_code) {
      return NextResponse.json(
        { success: false, message: 'Verification code is required.' },
        { status: 400 }
      )
    }

    const otpResult = await verifyOTP(employeeId, String(otp_code))
    if (!otpResult.valid) {
      return NextResponse.json(
        { success: false, message: otpResult.message },
        { status: 401 }
      )
    }

    console.log('✅ OTP verified for', employeeId)

    // ========================================================
    // PREPARE + VALIDATE EACH LOG
    // ========================================================

    const preparedLogs: Array<{
      user_id: string
      employee_name: string | null
      timestamp: string
      punch_type: PunchType
      device_id: string
      branch_code: string
      raw_log_key: string
    }> = []

    for (const log of logs) {
      const {
        user_id,
        employee_name,
        timestamp,
        punch_type,
        device_id,
        branch_code,
      } = log

      if (!user_id || typeof user_id !== 'string') {
        return NextResponse.json(
          { success: false, message: 'User ID is required for all logs.' },
          { status: 400 }
        )
      }

      if (!timestamp || typeof timestamp !== 'string') {
        return NextResponse.json(
          { success: false, message: 'Timestamp is required for all logs.' },
          { status: 400 }
        )
      }

      const parsedDate = new Date(timestamp)
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { success: false, message: `Invalid timestamp format: ${timestamp}` },
          { status: 400 }
        )
      }

      if (
        !punch_type ||
        !VALID_PUNCH_TYPES.includes(punch_type as PunchType)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'Punch type must be CHECK_IN or CHECK_OUT.',
          },
          { status: 400 }
        )
      }

      const finalBranchCode = branch_code || 'K'
      if (!VALID_BRANCH_CODES.includes(finalBranchCode as any)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid branch code: ${finalBranchCode}. Must be K or PQ.`,
          },
          { status: 400 }
        )
      }

      const finalDeviceId =
        typeof device_id === 'string' && device_id.trim()
          ? device_id.trim()
          : 'MANUAL'

      const rawLogKey =
        `HR_MANUAL_${user_id}_${punch_type}_${parsedDate.getTime()}_` +
        Math.random().toString(36).substring(2, 10)

      preparedLogs.push({
        user_id: user_id.trim(),
        employee_name:
          typeof employee_name === 'string' && employee_name.trim()
            ? employee_name.trim()
            : null,
        timestamp: parsedDate.toISOString(),
        punch_type: punch_type as PunchType,
        device_id: finalDeviceId,
        branch_code: finalBranchCode,
        raw_log_key: rawLogKey,
      })
    }

    // ========================================================
    // VERIFY ALL EMPLOYEES EXIST
    // ========================================================

    const uniqueUserIds = [...new Set(preparedLogs.map((l) => l.user_id))]

    const { data: employees, error: empError } = await supabaseAdmin
      .from('employees')
      .select('employee_id, full_name')
      .in('employee_id', uniqueUserIds)

    if (empError) {
      console.error('Employee lookup error:', empError)
      return NextResponse.json(
        { success: false, message: 'Unable to verify employee.' },
        { status: 500 }
      )
    }

    const foundIds = new Set(
      (employees || []).map((e) => String(e.employee_id).trim())
    )

    const missingIds = uniqueUserIds.filter((id) => !foundIds.has(id.trim()))

    if (missingIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Employee not found: ${missingIds.join(', ')}`,
        },
        { status: 404 }
      )
    }

    // ========================================================
    // DETECT DUPLICATE LOGS
    // ========================================================

    for (const log of preparedLogs) {
      const tableName = getTableForBranch(log.branch_code)

      const { data: existing, error: dupError } = await supabaseAdmin
        .from(tableName)
        .select('id, timestamp')
        .eq('user_id', log.user_id)
        .eq('punch_type', log.punch_type)
        .eq('timestamp', log.timestamp)
        .limit(1)

      if (dupError) {
        console.warn('Duplicate check warning:', dupError.message)
      }

      if (existing && existing.length > 0) {
        console.log(
          `⚠️ Duplicate detected in ${tableName}: user=${log.user_id}, type=${log.punch_type}, timestamp=${log.timestamp}`
        )
        return NextResponse.json(
          {
            success: false,
            message: `A ${log.punch_type === 'CHECK_IN' ? 'Check In' : 'Check Out'} log already exists for this employee at the exact same time.`,
          },
          { status: 409 }
        )
      }
    }

    // ========================================================
    // SPLIT LOGS BY BRANCH → TABLE
    // ========================================================

    const kLogs = preparedLogs.filter((l) => l.branch_code !== 'PQ')
    const pqLogs = preparedLogs.filter((l) => l.branch_code === 'PQ')

    console.log('📊 Branch split:')
    console.log('   K  → attendance_logs     :', kLogs.length, 'log(s)')
    console.log('   PQ → pq_attendance_logs  :', pqLogs.length, 'log(s)')

    const insertedRows: any[] = []

    // ========================================================
    // INSERT K LOGS → attendance_logs
    // ========================================================

    if (kLogs.length > 0) {
      const { data, error } = await supabaseAdmin
        .from('attendance_logs')
        .insert(kLogs)
        .select()

      if (error) {
        console.error('❌ attendance_logs insert error:', error)

        if (error.code === '23505') {
          return NextResponse.json(
            {
              success: false,
              message:
                'Duplicate attendance log detected. Please try again with different time.',
            },
            { status: 409 }
          )
        }

        if (error.code === '23514') {
          return NextResponse.json(
            {
              success: false,
              message: 'Invalid punch type. Must be CHECK_IN or CHECK_OUT.',
            },
            { status: 400 }
          )
        }

        return NextResponse.json(
          {
            success: false,
            message: `Failed to add attendance (Korangi): ${error.message}`,
          },
          { status: 500 }
        )
      }

      if (data) insertedRows.push(...data)
      console.log(`✅ ${data?.length || 0} log(s) inserted into attendance_logs`)
    }

    // ========================================================
    // INSERT PQ LOGS → pq_attendance_logs
    // ========================================================

    if (pqLogs.length > 0) {
      const { data, error } = await supabaseAdmin
        .from('pq_attendance_logs')
        .insert(pqLogs)
        .select()

      if (error) {
        console.error('❌ pq_attendance_logs insert error:', error)

        if (error.code === '23505') {
          return NextResponse.json(
            {
              success: false,
              message:
                'Duplicate attendance log detected. Please try again with different time.',
            },
            { status: 409 }
          )
        }

        if (error.code === '23514') {
          return NextResponse.json(
            {
              success: false,
              message: 'Invalid punch type. Must be CHECK_IN or CHECK_OUT.',
            },
            { status: 400 }
          )
        }

        return NextResponse.json(
          {
            success: false,
            message: `Failed to add attendance (Port Qasim): ${error.message}`,
          },
          { status: 500 }
        )
      }

      if (data) insertedRows.push(...data)
      console.log(
        `✅ ${data?.length || 0} log(s) inserted into pq_attendance_logs`
      )
    }

    const empName =
      employees?.[0]?.full_name ||
      preparedLogs[0]?.employee_name ||
      uniqueUserIds[0]

    console.log(`🎉 Total ${insertedRows.length} log(s) added for ${empName}`)
    console.log('User ID(s):', uniqueUserIds.join(', '))
    console.log('======================================')

    return NextResponse.json(
      {
        success: true,
        message: `${insertedRows.length} attendance log(s) added successfully for ${empName}!`,
        data: insertedRows,
        count: insertedRows.length,
        branches: {
          K: kLogs.length,
          PQ: pqLogs.length,
        },
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Add attendance error:', error)
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error, 'Something went wrong.'),
      },
      { status: 500 }
    )
  }
}