// src/app/api/hr/employees/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return NextResponse.json({ success: true, employees: data || [] })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Employee ID is required' }, { status: 400 })
    }

    // Frontend key -> DB column
    const fieldMap: Record<string, string> = {
      employeeId: 'employee_id',
      fullName: 'full_name',
      fatherName: 'father_name',
      cnicNumber: 'cnic_number',
      phoneNumber: 'phone_number',
      emergencyContact: 'emergency_contact',
      dateOfBirth: 'date_of_birth',
      maritalStatus: 'marital_status',
      residentialAddress: 'residential_address',
      joiningDate: 'joining_date',
      department: 'department',
      position: 'position',
      shift: 'shift',
      shiftTiming: 'shift_timing',
      source: 'source',
      cvUrl: 'cv_url',
    }

    // NOT NULL columns - empty aaye to update mein shamil na karein
    const requiredCols = ['employee_id', 'full_name', 'phone_number']

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    for (const [key, col] of Object.entries(fieldMap)) {
      if (body[key] === undefined) continue
      const value = typeof body[key] === 'string' ? body[key].trim() : body[key]

      if (value === '' || value === null) {
        if (requiredCols.includes(col)) continue
        updateData[col] = null // empty string -> null (check constraints ke liye)
      } else {
        updateData[col] = value
      }
    }

    // Shift validate (DB check: A, B, C ya null)
    if (updateData.shift && !['A', 'B', 'C'].includes(updateData.shift)) {
      return NextResponse.json({ success: false, error: 'Invalid shift value' }, { status: 400 })
    }
    // Shift hata di to timing bhi hata do
    if (updateData.shift === null) updateData.shift_timing = null

    // Source validate (DB check: K, PQ ya null)
    if (updateData.source && !['K', 'PQ'].includes(updateData.source)) {
      return NextResponse.json({ success: false, error: 'Invalid branch value' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return NextResponse.json({ success: true, employee: data })
  } catch (err) {
    console.error('PUT Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'Employee ID is required' }, { status: 400 })
    }

    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to delete' },
      { status: 500 }
    )
  }
}