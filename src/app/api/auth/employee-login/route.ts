// // import { NextRequest, NextResponse } from 'next/server'
// // import { createClient } from '@sanity/client'

// // const client = createClient({
// //   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
// //   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
// //   apiVersion: '2025-01-01',
// //   useCdn: false,
// // })

// // export async function POST(req: NextRequest) {
// //   try {
// //     const body = await req.json()
// //     const username = body.username?.trim()
// //     const password = body.password

// //     if (!username || !password) {
// //       return NextResponse.json(
// //         { success: false, message: 'Username and password are required' },
// //         { status: 400 }
// //       )
// //     }

// //     // Query employee by username and password
// //     const employee = await client.fetch(
// //       `*[_type == "employee" && username == $username && password == $password][0]{
// //         _id,
// //         personalDetails {
// //           employeeId,
// //           fullName,
// //           department,
// //           position
// //         }
// //       }`,
// //       { username, password }
// //     )

// //     if (!employee) {
// //       return NextResponse.json(
// //         { success: false, message: 'Invalid username or password' },
// //         { status: 401 }
// //       )
// //     }

// //     return NextResponse.json({
// //       success: true,
// //       employeeId: employee.personalDetails.employeeId,
// //       fullName: employee.personalDetails.fullName,
// //       department: employee.personalDetails.department,
// //       position: employee.personalDetails.position,
// //       role: 'employee',
// //     })
// //   } catch (error) {
// //     console.error('Employee login error:', error)
// //     return NextResponse.json(
// //       { success: false, message: 'Server error' },
// //       { status: 500 }
// //     )
// //   }
// // }


// // app/api/auth/employee-login/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@supabase/supabase-js'

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     const username = body.username?.trim()
//     const password = body.password

//     if (!username || !password) {
//       return NextResponse.json(
//         { success: false, message: 'Username and password are required' },
//         { status: 400 }
//       )
//     }

//     // Initialize Supabase client
//     const supabase = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )

//     // Query employee by username and password from Supabase
//     const { data: employee, error } = await supabase
//       .from('employees')
//       .select('employee_id, full_name, department, position, username')
//       .eq('username', username)
//       .eq('password', password) // ⚠️ In production, use hashed passwords!
//       .maybeSingle()

//     if (error) {
//       console.error('Supabase error:', error)
//       return NextResponse.json(
//         { success: false, message: 'Database error' },
//         { status: 500 }
//       )
//     }

//     if (!employee) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid username or password' },
//         { status: 401 }
//       )
//     }

//     // ✅ Return employee data
//     return NextResponse.json({
//       success: true,
//       employeeId: employee.employee_id,
//       fullName: employee.full_name,
//       department: employee.department,
//       position: employee.position,
//       username: employee.username,
//       role: 'employee',
//     })

//   } catch (error) {
//     console.error('Employee login error:', error)
//     return NextResponse.json(
//       { success: false, message: 'Server error' },
//       { status: 500 }
//     )
//   }
// }


// app/api/auth/employee-login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// ============================================================
// PASSWORD HASH (SHA-256)
// ============================================================

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// ============================================================
// POST — EMPLOYEE LOGIN
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const username = body.username?.trim()
    const password = body.password

    // ========================================================
    // VALIDATE INPUT
    // ========================================================

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username and password are required',
        },
        { status: 400 }
      )
    }

    // ========================================================
    // SUPABASE CLIENT
    // ========================================================

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // ========================================================
    // FETCH EMPLOYEE BY USERNAME
    // ========================================================

    const { data: employee, error } = await supabase
      .from('employees')
      .select(
        'employee_id, full_name, department, position, username, password'
      )
      .eq('username', username)
      .maybeSingle()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      )
    }

    if (!employee) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // ========================================================
    // VERIFY PASSWORD — SUPPORT BOTH PLAIN TEXT & SHA-256
    // ========================================================
    //
    // This makes login backwards-compatible:
    //   - Old users with plain text password → still works
    //   - New resets use SHA-256 hash → also works
    //
    // Once all users have reset their password,
    // you can remove the plain text check.
    // ========================================================

    const storedPassword = employee.password || ''
    const hashedInput = hashPassword(password)

    const isPlainMatch = storedPassword === password
    const isHashMatch = storedPassword === hashedInput

    if (!isPlainMatch && !isHashMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // ========================================================
    // OPTIONAL: AUTO-UPGRADE PLAIN TEXT TO HASH
    // ========================================================
    //
    // If the user logged in with plain text password,
    // upgrade it to SHA-256 hash automatically.
    // Next login will use the hash.
    // ========================================================

    if (isPlainMatch && !isHashMatch) {
      try {
        await supabase
          .from('employees')
          .update({ password: hashedInput })
          .eq('employee_id', employee.employee_id)

        console.log(
          `✅ Auto-upgraded password to hash for: ${employee.username}`
        )
      } catch (err) {
        // Silent fail — don't block login
        console.warn('Auto-upgrade failed:', err)
      }
    }

    // ========================================================
    // SUCCESS
    // ========================================================

    return NextResponse.json({
      success: true,
      employeeId: employee.employee_id,
      fullName: employee.full_name,
      department: employee.department,
      position: employee.position,
      username: employee.username,
      role: 'employee',
    })
  } catch (error) {
    console.error('Employee login error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}