import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username and password are required',
        },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing')
    }

    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing')
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey
    )

    const { data: director, error } = await supabase
      .from('directors')
      .select('*')
      .eq('username', username)
      .eq('role', 'director')
      .maybeSingle()

    if (error) {
      console.error('SUPABASE DIRECTOR ERROR:', error)

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      )
    }

    if (!director) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid username or password',
        },
        { status: 401 }
      )
    }

    if (!director.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: 'Director account is disabled',
        },
        { status: 403 }
      )
    }

    if (director.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid username or password',
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      username: director.username,
      full_name: director.full_name,
      email: director.email,
      role: 'director',
    })

  } catch (error) {
    console.error('DIRECTOR LOGIN ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong',
      },
      { status: 500 }
    )
  }
}