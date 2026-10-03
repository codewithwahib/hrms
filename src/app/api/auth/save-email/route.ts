// app/api/auth/save-email/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return fallback
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, email, employeeId } = body

    console.log('=== SAVE EMAIL ===')
    console.log('Username:', username)
    console.log('Employee ID:', employeeId)
    console.log('Email:', email)

    // ========================================================
    // VALIDATE
    // ========================================================

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      )
    }

    if (!username && !employeeId) {
      return NextResponse.json(
        { success: false, message: 'Username or Employee ID is required.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // ========================================================
    // FIND EMPLOYEE (by username OR employee_id)
    // ========================================================

    let query = supabaseAdmin
      .from('employees')
      .select('id, employee_id, username, full_name, email')

    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    } else {
      query = query.eq('username', username.toLowerCase().trim())
    }

    const { data: employee, error: employeeError } = await query.maybeSingle()

    if (employeeError) {
      console.error('Employee lookup error:', employeeError)
      return NextResponse.json(
        { success: false, message: 'Unable to check account.' },
        { status: 500 }
      )
    }

    if (!employee) {
      return NextResponse.json(
        { success: false, message: 'Account not found. Please contact HR admin.' },
        { status: 404 }
      )
    }

    // ========================================================
    // CHECK EMAIL UNIQUE
    // ========================================================

    const { data: emailCheck } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('email', normalizedEmail)
      .neq('id', employee.id)
      .maybeSingle()

    if (emailCheck) {
      return NextResponse.json(
        { success: false, message: 'This email is already linked to another account.' },
        { status: 409 }
      )
    }

    // ========================================================
    // UPDATE EMAIL
    // ========================================================

    const { error: updateError } = await supabaseAdmin
      .from('employees')
      .update({ email: normalizedEmail })
      .eq('id', employee.id)

    if (updateError) {
      console.error('Email update error:', updateError)
      return NextResponse.json(
        { success: false, message: `Failed to save email: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Email saved for:', employee.employee_id)

    return NextResponse.json(
      {
        success: true,
        message: 'Your email has been saved successfully.',
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Save email error:', error)
    return NextResponse.json(
      { success: false, message: getErrorMessage(error, 'Something went wrong.') },
      { status: 500 }
    )
  }
}