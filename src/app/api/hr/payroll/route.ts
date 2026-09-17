// app/api/hr/payroll/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// =====================================================
// POST → Insert payroll record
// =====================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Basic validation
    if (!body.employee_id) {
      return NextResponse.json(
        { error: 'employee_id is required' },
        { status: 400 }
      )
    }
    if (!body.month_year) {
      return NextResponse.json(
        { error: 'month_year is required' },
        { status: 400 }
      )
    }

    // Ensure numeric fields are numbers (avoid NaN / null errors)
    const numericFields = [
      'total_increase', 'gross', 'total_gross_after_increa', 'basic_salary',
      'per_month_salary', 'per_day', 'present_amount', 'absent_amount',
      'duty_hours', 'pr_hours', 'total_month_hours', 'late_hours',
      'late_hour_amount', 'salary_exp', 'over_time_hour', 'over_time',
      'hold_salary', 'deduct_health_insurance', 'total_salary', 'loan',
      'adv_salary', 'income_tax', 'net_salary_payable'
    ]
    const intFields = [
      'present_day', 'absent_day', 'approvl_lvn',
      'total_salary_days', 'approvl_lvn_2'
    ]

    const payload: any = {
      employee_id: String(body.employee_id).trim(),
      name: body.name || '',
      designation: body.designation || '',
      cnic: body.cnic || '',
      month_year: body.month_year
    }

    for (const key of numericFields) {
      payload[key] = Number.isFinite(Number(body[key])) ? Number(body[key]) : 0
    }
    for (const key of intFields) {
      payload[key] = Number.isFinite(Number(body[key])) ? Math.trunc(Number(body[key])) : 0
    }

    const { data, error } = await supabase
      .from('payroll')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: error.message, details: error.details, hint: error.hint },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Payroll submitted successfully', data },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('API payroll POST error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// =====================================================
// GET → Fetch payroll records (optional filter)
// =====================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employee_id')
    const monthYear = searchParams.get('month_year')

    let query = supabase
      .from('payroll')
      .select('*')
      .order('created_at', { ascending: false })

    if (employeeId) query = query.eq('employee_id', employeeId)
    if (monthYear) query = query.eq('month_year', monthYear)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// =====================================================
// PUT → Update payroll record by id
// =====================================================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'id is required for update' },
        { status: 400 }
      )
    }

    const numericFields = [
      'total_increase', 'gross', 'total_gross_after_increa', 'basic_salary',
      'per_month_salary', 'per_day', 'present_amount', 'absent_amount',
      'duty_hours', 'pr_hours', 'total_month_hours', 'late_hours',
      'late_hour_amount', 'salary_exp', 'over_time_hour', 'over_time',
      'hold_salary', 'deduct_health_insurance', 'total_salary', 'loan',
      'adv_salary', 'income_tax', 'net_salary_payable'
    ]
    const intFields = [
      'present_day', 'absent_day', 'approvl_lvn',
      'total_salary_days', 'approvl_lvn_2'
    ]

    const payload: any = { updated_at: new Date().toISOString() }

    if (body.name !== undefined) payload.name = body.name
    if (body.designation !== undefined) payload.designation = body.designation
    if (body.cnic !== undefined) payload.cnic = body.cnic
    if (body.month_year !== undefined) payload.month_year = body.month_year

    for (const key of numericFields) {
      if (body[key] !== undefined) {
        payload[key] = Number.isFinite(Number(body[key])) ? Number(body[key]) : 0
      }
    }
    for (const key of intFields) {
      if (body[key] !== undefined) {
        payload[key] = Number.isFinite(Number(body[key])) ? Math.trunc(Number(body[key])) : 0
      }
    }

    const { data, error } = await supabase
      .from('payroll')
      .update(payload)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: 'Payroll updated', data },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// =====================================================
// DELETE → Delete payroll record by id
// =====================================================
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('payroll')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: 'Payroll deleted' },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}