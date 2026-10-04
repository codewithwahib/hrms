// src/app/api/hr/send-otp/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
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
// GENERATE 6-DIGIT OTP
// ============================================================

const generateOTP = (): string => {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// ============================================================
// EMAIL VALIDATION
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ============================================================
// HR USERNAME — is row ka email OTP receive karega
// ============================================================

const HR_USERNAME = 'hr'

// ============================================================
// COMPANY NAME
// ============================================================

const COMPANY_NAME = 'A to Zee Switchgear Engineering (SMC) Pvt. Ltd.'

// ============================================================
// NODEMAILER TRANSPORTER
// ============================================================

const createTransporter = () => {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is not configured')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

// ============================================================
// POST — SEND OTP
// ============================================================

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { employee_id, employee_name } = body

    console.log('======================================')
    console.log('HR SEND OTP')
    console.log('Employee ID:', employee_id)
    console.log('======================================')

    if (!employee_id || typeof employee_id !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Employee ID is required.' },
        { status: 400 }
      )
    }

    const empId = employee_id.trim()

    // --------------------------------------------------------
    // 1. Verify employee exists
    // --------------------------------------------------------
    const { data: employee, error: empError } = await supabaseAdmin
      .from('employees')
      .select('employee_id, full_name')
      .eq('employee_id', empId)
      .maybeSingle()

    if (empError) {
      console.error('Employee lookup error:', empError)
      return NextResponse.json(
        { success: false, message: 'Unable to verify employee.' },
        { status: 500 }
      )
    }

    if (!employee) {
      return NextResponse.json(
        { success: false, message: `Employee not found: ${empId}` },
        { status: 404 }
      )
    }

    // --------------------------------------------------------
    // 2. ✅ HR ka email fetch karo (username = 'hr')
    // --------------------------------------------------------
    const { data: hrLogin, error: hrError } = await supabaseAdmin
      .from('logins')
      .select('username, email')
      .eq('username', HR_USERNAME)
      .maybeSingle()

    if (hrError) {
      console.error('HR login lookup error:', hrError)
      return NextResponse.json(
        { success: false, message: 'Unable to fetch HR login record.' },
        { status: 500 }
      )
    }

    const hrEmail = hrLogin?.email?.trim() || ''

    if (!hrEmail) {
      return NextResponse.json(
        {
          success: false,
          message: `No email configured for HR (username="${HR_USERNAME}") in logins table.`,
        },
        { status: 404 }
      )
    }

    if (!EMAIL_REGEX.test(hrEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid HR email configured: ${hrEmail}`,
        },
        { status: 400 }
      )
    }

    console.log('📧 OTP will be sent to HR email:', hrEmail)

    // --------------------------------------------------------
    // 3. Rate limit — 1 OTP per 60 seconds per employee
    // --------------------------------------------------------
    const { data: recent } = await supabaseAdmin
      .from('attendance_otps')
      .select('id, created_at')
      .eq('employee_id', empId)
      .eq('used', false)
      .gte('created_at', new Date(Date.now() - 60 * 1000).toISOString())
      .limit(1)

    if (recent && recent.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please wait 60 seconds before requesting a new code.',
        },
        { status: 429 }
      )
    }

    // --------------------------------------------------------
    // 4. Invalidate old unused OTPs
    // --------------------------------------------------------
    await supabaseAdmin
      .from('attendance_otps')
      .update({ used: true })
      .eq('employee_id', empId)
      .eq('used', false)

    // --------------------------------------------------------
    // 5. Generate + store new OTP
    // --------------------------------------------------------
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: insertError } = await supabaseAdmin
      .from('attendance_otps')
      .insert({
        username: HR_USERNAME,
        employee_id: empId,
        otp_code: otp,
        email: hrEmail,
        expires_at: expiresAt,
        used: false,
      })

    if (insertError) {
      console.error('OTP insert error:', insertError)
      return NextResponse.json(
        { success: false, message: 'Failed to create OTP.' },
        { status: 500 }
      )
    }

    // --------------------------------------------------------
    // 6. Send email to HR
    // --------------------------------------------------------
    const transporter = createTransporter()
    const empName = employee.full_name || employee_name || empId

    const mailOptions = {
      // ✅ Full company name in "from"
      from: `"${COMPANY_NAME}" <${process.env.GMAIL_USER}>`,
      to: hrEmail,
      subject: `Attendance Verification Code — ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 20px; background: #f9fafb;">
          <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 24px;">
            <h2 style="color: #0071BD; margin: 0 0 8px 0; font-size: 20px;">
              Attendance Verification Code
            </h2>
            <p style="color: #374151; font-size: 14px; margin: 0 0 20px 0;">
              Dear HR,
            </p>
            <p style="color: #374151; font-size: 14px; margin: 0 0 16px 0;">
              Use the code below to verify the attendance submission for
              <strong>${empName}</strong> (ID: <strong>${empId}</strong>).
              This code is valid for <strong>10 minutes</strong>.
            </p>
            <div style="background: #f3f4f6; border: 2px dashed #0071BD; padding: 20px; text-align: center; margin: 24px 0;">
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0071BD; font-family: monospace;">
                ${otp}
              </div>
            </div>
            <p style="color: #6b7280; font-size: 12px; margin: 16px 0 0 0;">
              If you did not request this code, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0 12px 0;" />
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              ${COMPANY_NAME}<br/>
              This is an automated email — please do not reply.
            </p>
          </div>
        </div>
      `,
    }

    try {
      await transporter.sendMail(mailOptions)
      console.log(`✅ OTP sent to HR email: ${hrEmail}`)
    } catch (mailError) {
      console.error('Email send error:', mailError)
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send email: ${getErrorMessage(mailError, 'Unknown error')}`,
        },
        { status: 500 }
      )
    }

    console.log('======================================')

    const maskedEmail = hrEmail.replace(/(.{2}).+(@.+)/, '$1***$2')

    return NextResponse.json(
      {
        success: true,
        message: `Verification code sent to HR (${maskedEmail})`,
        email_masked: maskedEmail,
        expires_in_seconds: 600,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error, 'Something went wrong.'),
      },
      { status: 500 }
    )
  }
}