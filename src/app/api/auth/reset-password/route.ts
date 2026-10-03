// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import crypto from 'crypto'

// ============================================================
// PASSWORD HASHING
// ============================================================
//
// ⚠️ MATCH THIS WITH YOUR employee-login API
//
// Options:
//   A) Plain text  →  return password
//   B) SHA-256     →  return hash
//   C) bcrypt      →  use bcryptjs
//
// Current: SHA-256 (change if needed)
// ============================================================

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// ============================================================
// ERROR HELPER
// ============================================================

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return fallback
}

// ============================================================
// ✅ GET — VERIFY RESET TOKEN
// ============================================================
//
// Called when page loads:
//   GET /api/auth/reset-password?token=abc-123
//
// Returns:
//   { success: true, fullName, email }   ← valid token
//   { success: false, message }          ← invalid/expired
// ============================================================

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    console.log('=== VERIFY RESET TOKEN ===')
    console.log('Token:', token)

    // ========================================================
    // VALIDATE TOKEN
    // ========================================================

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Token is required.' },
        { status: 400 }
      )
    }

    // ========================================================
    // FIND EMPLOYEE BY TOKEN
    // ========================================================

    const { data: employee, error } = await supabaseAdmin
      .from('employees')
      .select('id, full_name, username, email, reset_token_expires_at')
      .eq('reset_token', token)
      .maybeSingle()

    if (error) {
      console.error('Token lookup error:', error)
      return NextResponse.json(
        { success: false, message: 'Unable to verify token.' },
        { status: 500 }
      )
    }

    if (!employee) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset link.' },
        { status: 404 }
      )
    }

    // ========================================================
    // CHECK EXPIRY
    // ========================================================

    const expiresAt = employee.reset_token_expires_at
      ? new Date(employee.reset_token_expires_at).getTime()
      : 0

    if (Date.now() > expiresAt) {
      // Clean up expired token
      await supabaseAdmin
        .from('employees')
        .update({
          reset_token: null,
          reset_token_expires_at: null,
        })
        .eq('id', employee.id)

      return NextResponse.json(
        {
          success: false,
          message: 'This reset link has expired. Please request a new one.',
        },
        { status: 410 }
      )
    }

    // ========================================================
    // TOKEN VALID
    // ========================================================

    console.log('✅ Token valid for:', employee.email)

    return NextResponse.json(
      {
        success: true,
        message: 'Token is valid.',
        fullName: employee.full_name || employee.username || '',
        email: employee.email,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Verify token error:', error)

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error, 'Something went wrong.'),
      },
      { status: 500 }
    )
  }
}

// ============================================================
// ✅ POST — RESET PASSWORD
// ============================================================
//
// Called on form submit:
//   POST /api/auth/reset-password
//   Body: { token, password }
//
// Returns:
//   { success: true, message }   ← reset successful
//   { success: false, message }  ← error
// ============================================================

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = body

    console.log('=== RESET PASSWORD ===')
    console.log('Token:', token)

    // ========================================================
    // VALIDATE INPUT
    // ========================================================

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Token is required.' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Password is required.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters long.',
        },
        { status: 400 }
      )
    }

    // ========================================================
    // FIND EMPLOYEE BY TOKEN
    // ========================================================

    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('id, reset_token_expires_at')
      .eq('reset_token', token)
      .maybeSingle()

    if (employeeError) {
      console.error('Employee lookup error:', employeeError)
      return NextResponse.json(
        { success: false, message: 'Unable to verify token.' },
        { status: 500 }
      )
    }

    if (!employee) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset link.' },
        { status: 404 }
      )
    }

    // ========================================================
    // CHECK EXPIRY
    // ========================================================

    const expiresAt = employee.reset_token_expires_at
      ? new Date(employee.reset_token_expires_at).getTime()
      : 0

    if (Date.now() > expiresAt) {
      // Clean up expired token
      await supabaseAdmin
        .from('employees')
        .update({
          reset_token: null,
          reset_token_expires_at: null,
        })
        .eq('id', employee.id)

      return NextResponse.json(
        {
          success: false,
          message: 'This reset link has expired. Please request a new one.',
        },
        { status: 410 }
      )
    }

    // ========================================================
    // HASH NEW PASSWORD
    // ========================================================

    const hashedPassword = hashPassword(password)

    // ========================================================
    // UPDATE PASSWORD + CLEAR TOKEN
    // ========================================================

    const { error: updateError } = await supabaseAdmin
      .from('employees')
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expires_at: null,
      })
      .eq('id', employee.id)

    if (updateError) {
      console.error('Password update error:', updateError)
      return NextResponse.json(
        {
          success: false,
          message: `Failed to reset password: ${updateError.message}`,
        },
        { status: 500 }
      )
    }

    console.log('✅ Password reset successfully for employee ID:', employee.id)

    return NextResponse.json(
      {
        success: true,
        message:
          'Password reset successfully! You can now login with your new password.',
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Reset password error:', error)

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error, 'Something went wrong.'),
      },
      { status: 500 }
    )
  }
}