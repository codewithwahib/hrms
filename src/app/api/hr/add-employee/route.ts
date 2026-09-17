// // // app/api/hr/add-employee/route.ts
// // import { NextRequest, NextResponse } from 'next/server'
// // import { createClient } from '@supabase/supabase-js'

// // export async function POST(request: NextRequest) {
// //   try {
// //     const body = await request.json()
// //     const { personalDetails, qualifications, experience, username, password } = body

// //     console.log('📝 Received data:', {
// //       personalDetails,
// //       qualifications,
// //       experience,
// //       username
// //     })

// //     // Validate required fields
// //     if (!personalDetails?.employeeId || !personalDetails?.fullName || !username || !password) {
// //       return NextResponse.json(
// //         { success: false, error: 'Missing required fields' },
// //         { status: 400 }
// //       )
// //     }

// //     const supabase = createClient(
// //       process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// //     )

// //     // Check if employee already exists
// //     const { data: existingEmployee } = await supabase
// //       .from('employees')
// //       .select('id')
// //       .eq('employee_id', personalDetails.employeeId)
// //       .maybeSingle()

// //     if (existingEmployee) {
// //       return NextResponse.json(
// //         { success: false, error: 'Employee ID already exists' },
// //         { status: 400 }
// //       )
// //     }

// //     // Check if username already exists
// //     const { data: existingUser } = await supabase
// //       .from('employees')
// //       .select('id')
// //       .eq('username', username)
// //       .maybeSingle()

// //     if (existingUser) {
// //       return NextResponse.json(
// //         { success: false, error: 'Username already exists' },
// //         { status: 400 }
// //       )
// //     }

// //     // ✅ Clean and prepare data - convert empty strings to null
// //     const cleanValue = (value: any) => {
// //       if (value === '' || value === 'undefined' || value === 'null') return null
// //       return value || null
// //     }

// //     // ✅ Insert employee with cleaned data
// //     const employeeData = {
// //       employee_id: personalDetails.employeeId,
// //       full_name: personalDetails.fullName,
// //       father_name: cleanValue(personalDetails.fatherName),
// //       cnic_number: cleanValue(personalDetails.cnicNumber),
// //       phone_number: cleanValue(personalDetails.phoneNumber),
// //       emergency_contact: cleanValue(personalDetails.emergencyContact),
// //       date_of_birth: personalDetails.dateOfBirth || null,
// //       marital_status: cleanValue(personalDetails.maritalStatus),
// //       residential_address: cleanValue(personalDetails.residentialAddress),
// //       joining_date: personalDetails.joiningDate || null,
// //       department: cleanValue(personalDetails.department),
// //       position: cleanValue(personalDetails.position),
// //       username: username,
// //       password: password, // ⚠️ In production, hash this!
// //       qualifications: qualifications || [],
// //       experience: experience || [],
// //       cv_url: cleanValue(personalDetails.cv),
// //       created_at: new Date().toISOString(),
// //       updated_at: new Date().toISOString()
// //     }

// //     console.log('📤 Inserting data:', employeeData)

// //     const { data, error } = await supabase
// //       .from('employees')
// //       .insert([employeeData])
// //       .select()
// //       .single()

// //     if (error) {
// //       console.error('❌ Supabase error:', error)
// //       return NextResponse.json(
// //         { success: false, error: error.message },
// //         { status: 500 }
// //       )
// //     }

// //     console.log('✅ Employee added:', data)

// //     return NextResponse.json({
// //       success: true,
// //       message: 'Employee added successfully',
// //       employee: data
// //     })

// //   } catch (error) {
// //     console.error('❌ Error adding employee:', error)
// //     return NextResponse.json(
// //       { 
// //         success: false, 
// //         error: error instanceof Error ? error.message : 'Failed to add employee' 
// //       },
// //       { status: 500 }
// //     )
// //   }
// // }


// // app/api/hr/add-employee/route.ts

// import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@supabase/supabase-js'

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { personalDetails, qualifications, experience, username, password } = body

//     console.log('📝 Received data:', {
//       personalDetails,
//       qualifications,
//       experience,
//       username
//     })

//     // Validate required fields
//     if (!personalDetails?.employeeId || !personalDetails?.fullName || !username || !password) {
//       return NextResponse.json(
//         { success: false, error: 'Missing required fields' },
//         { status: 400 }
//       )
//     }

//     const supabase = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )

//     // Check if employee already exists
//     const { data: existingEmployee } = await supabase
//       .from('employees')
//       .select('id')
//       .eq('employee_id', personalDetails.employeeId)
//       .maybeSingle()

//     if (existingEmployee) {
//       return NextResponse.json(
//         { success: false, error: 'Employee ID already exists' },
//         { status: 400 }
//       )
//     }

//     // Check if username already exists
//     const { data: existingUser } = await supabase
//       .from('employees')
//       .select('id')
//       .eq('username', username)
//       .maybeSingle()

//     if (existingUser) {
//       return NextResponse.json(
//         { success: false, error: 'Username already exists' },
//         { status: 400 }
//       )
//     }

//     // ✅ Clean and prepare data - convert empty strings to null
//     const cleanValue = (value: any) => {
//       if (value === '' || value === 'undefined' || value === 'null') return null
//       return value || null
//     }

//     // ✅ Fix CV URL - ensure it's the full URL
//     let cvUrl = cleanValue(personalDetails.cv)
//     if (cvUrl && !cvUrl.startsWith('http://') && !cvUrl.startsWith('https://')) {
//       // If it's not a full URL, construct it
//       const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
//       const cleanPath = cvUrl.replace(/^\/+/, '')
//       cvUrl = `${supabaseUrl}/storage/v1/object/public/CVS/${cleanPath}`
//       console.log('✅ Constructed full CV URL:', cvUrl)
//     }

//     // ✅ Insert employee with cleaned data
//     const employeeData = {
//       employee_id: personalDetails.employeeId,
//       full_name: personalDetails.fullName,
//       father_name: cleanValue(personalDetails.fatherName),
//       cnic_number: cleanValue(personalDetails.cnicNumber),
//       phone_number: cleanValue(personalDetails.phoneNumber),
//       emergency_contact: cleanValue(personalDetails.emergencyContact),
//       date_of_birth: personalDetails.dateOfBirth || null,
//       marital_status: cleanValue(personalDetails.maritalStatus),
//       residential_address: cleanValue(personalDetails.residentialAddress),
//       joining_date: personalDetails.joiningDate || null,
//       department: cleanValue(personalDetails.department),
//       position: cleanValue(personalDetails.position),
//       username: username,
//       password: password, // ⚠️ In production, hash this!
//       qualifications: qualifications || [],
//       experience: experience || [],
//       cv_url: cvUrl, // ✅ Store the full URL
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     }

//     console.log('📤 Inserting data:', employeeData)

//     const { data, error } = await supabase
//       .from('employees')
//       .insert([employeeData])
//       .select()
//       .single()

//     if (error) {
//       console.error('❌ Supabase error:', error)
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 500 }
//       )
//     }

//     console.log('✅ Employee added:', data)

//     return NextResponse.json({
//       success: true,
//       message: 'Employee added successfully',
//       employee: data
//     })

//   } catch (error) {
//     console.error('❌ Error adding employee:', error)
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: error instanceof Error ? error.message : 'Failed to add employee' 
//       },
//       { status: 500 }
//     )
//   }
// }


// app/api/hr/add-employee/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { personalDetails, qualifications, experience, username, password } = body

    console.log('📝 Received data:', {
      personalDetails,
      qualifications,
      experience,
      username
    })

    // Validate required fields
    if (!personalDetails?.employeeId || !personalDetails?.fullName || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check if employee already exists
    const { data: existingEmployee } = await supabase
      .from('employees')
      .select('id')
      .eq('employee_id', personalDetails.employeeId)
      .maybeSingle()

    if (existingEmployee) {
      return NextResponse.json(
        { success: false, error: 'Employee ID already exists' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('employees')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      )
    }

    // ✅ Clean and prepare data - convert empty strings to null
    const cleanValue = (value: any) => {
      if (value === '' || value === 'undefined' || value === 'null') return null
      return value || null
    }

    // ✅ Helper: parse salary (returns null if empty/invalid)
    const parseSalary = (value: any): number | null => {
      if (value === '' || value === null || value === undefined) return null
      const num = typeof value === 'number' ? value : parseFloat(String(value))
      return Number.isFinite(num) ? num : null
    }

    // ✅ Fix CV URL - ensure it's the full URL
    let cvUrl = cleanValue(personalDetails.cv)
    if (cvUrl && !cvUrl.startsWith('http://') && !cvUrl.startsWith('https://')) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const cleanPath = cvUrl.replace(/^\/+/, '')
      cvUrl = `${supabaseUrl}/storage/v1/object/public/CVS/${cleanPath}`
      console.log('✅ Constructed full CV URL:', cvUrl)
    }

    // ✅ Auto-fill shift timing if empty but shift is set
    let shiftTiming = cleanValue(personalDetails.shiftTiming)
    const shiftValue = cleanValue(personalDetails.shift)
    if (!shiftTiming && shiftValue === 'A') shiftTiming = '09:00 - 18:00'
    else if (!shiftTiming && shiftValue === 'B') shiftTiming = '18:00 - 03:00'

    // ✅ Insert employee with all fields including NEW ones
    const employeeData = {
      // Personal Info
      employee_id: personalDetails.employeeId,
      full_name: personalDetails.fullName,
      father_name: cleanValue(personalDetails.fatherName),
      cnic_number: cleanValue(personalDetails.cnicNumber),
      phone_number: cleanValue(personalDetails.phoneNumber),
      emergency_contact: cleanValue(personalDetails.emergencyContact),
      date_of_birth: personalDetails.dateOfBirth || null,
      marital_status: cleanValue(personalDetails.maritalStatus),
      residential_address: cleanValue(personalDetails.residentialAddress),

      // Work Info
      joining_date: personalDetails.joiningDate || null,
      department: cleanValue(personalDetails.department),
      position: cleanValue(personalDetails.position),
      source: personalDetails.source || 'K',         // ✅ NEW (branch)

      // ✅ NEW: Shift & Timing
      shift: shiftValue,
      shift_timing: shiftTiming,

      // ✅ NEW: Salaries
      gross_salary: parseSalary(personalDetails.grossSalary),
      basic_salary: parseSalary(personalDetails.basicSalary),

      // Credentials
      username: username,
      password: password, // ⚠️ In production, hash this!

      // JSONB
      qualifications: qualifications || [],
      experience: experience || [],

      // CV
      cv_url: cvUrl,

      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('📤 Inserting data:', employeeData)

    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData])
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Employee added:', data)

    return NextResponse.json({
      success: true,
      message: 'Employee added successfully',
      employee: data
    })

  } catch (error) {
    console.error('❌ Error adding employee:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add employee'
      },
      { status: 500 }
    )
  }
}