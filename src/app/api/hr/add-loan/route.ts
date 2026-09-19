// app/api/hr/add-loan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const body = await req.json()
    const { user_id, employee_name, total_loan, monthly_installment, time_period } = body

    if (!user_id || !employee_name) {
      return NextResponse.json({ success: false, error: 'Employee is required' }, { status: 400 })
    }
    if (!total_loan || Number(total_loan) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid total loan' }, { status: 400 })
    }
    if (!Array.isArray(time_period) || time_period.length === 0) {
      return NextResponse.json({ success: false, error: 'Time period required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('employee_loans')
      .insert({
        user_id,
        employee_name,
        department: body.department || null,
        designation: body.designation || null,
        branch: body.branch || null,
        total_loan: Number(total_loan),
        amount_recovered: 0,
        amount_remaining: Number(total_loan),
        monthly_installment: Number(monthly_installment) || 0,
        time_period
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, loan: data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 })
  }
}