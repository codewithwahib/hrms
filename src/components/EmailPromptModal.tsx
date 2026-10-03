// components/EmailPromptModal.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Roboto } from 'next/font/google'
import {
  Loader,
  AlertCircle,
  Mail,
  CheckCircle,
  X,
} from 'lucide-react'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ✅ Pages jahan modal show nahi hona chahiye
const SKIP_PATHS = [
  '/employee-login',
  '/hr/login',
  '/hr-login',
  '/forgot-password',
  '/reset-password',
  '/login',
]

export default function EmailPromptModal() {
  const pathname = usePathname()

  const [shouldShow, setShouldShow] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [employeeId, setEmployeeId] = useState<string>('')
  const [dismissed, setDismissed] = useState(false)

  // ============================================================
  // ✅ CHECK EMAIL
  // ============================================================

  const checkEmail = useCallback(async () => {
    if (typeof window === 'undefined') return

    const skip = SKIP_PATHS.some((p) => pathname?.startsWith(p))
    if (skip) {
      setShouldShow(false)
      return
    }

    if (dismissed) {
      setShouldShow(false)
      return
    }

    const id = localStorage.getItem('employeeId')

    if (!id) {
      setShouldShow(false)
      return
    }

    setEmployeeId(id)

    try {
      const { data, error } = await supabase
        .from('employees')
        .select('email')
        .eq('employee_id', id)
        .maybeSingle()

      if (error) {
        console.error('Email check error:', error)
        return
      }

      if (!data?.email || data.email.trim() === '') {
        console.log('📧 Email missing for:', id, '→ showing modal')
        setShouldShow(true)
      } else {
        setShouldShow(false)
      }
    } catch (err) {
      console.error('Email check error:', err)
    }
  }, [pathname, dismissed])

  // ✅ Check on mount + route change
  useEffect(() => {
    checkEmail()
  }, [checkEmail])

  // ✅ Poll every 1 second — faster catch
  useEffect(() => {
    const interval = setInterval(() => {
      checkEmail()
    }, 1000)

    return () => clearInterval(interval)
  }, [checkEmail])

  // ============================================================
  // ✅ NEW: LISTEN FOR LOGIN EVENT — INSTANT TRIGGER
  // ============================================================

  useEffect(() => {
    const handleLoginEvent = () => {
      console.log('🔔 Login event received — checking email immediately')
      // ✅ Reset dismissed so it can show again
      setDismissed(false)
      // ✅ Immediate check
      setTimeout(() => {
        checkEmail()
      }, 300) // 300ms — after localStorage is set
    }

    window.addEventListener('employeeLoggedIn', handleLoginEvent)

    return () => {
      window.removeEventListener('employeeLoggedIn', handleLoginEvent)
    }
  }, [checkEmail])

  // ============================================================
  // CLOSE HANDLER
  // ============================================================

  const handleClose = () => {
    setShouldShow(false)
    setDismissed(true)
    setEmail('')
    setError('')
    setSuccess(false)
  }

  // ============================================================
  // HANDLE SUBMIT
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/save-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          email: email.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to save email.')
        setIsLoading(false)
        return
      }

      setSuccess(true)

      setTimeout(() => {
        setShouldShow(false)
        setSuccess(false)
        setEmail('')
      }, 1500)
    } catch (err) {
      console.error('Save email error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  if (!shouldShow) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={handleClose}
      />

      <div className={`relative bg-white shadow-lg max-w-md w-full p-6 md:p-8 ${roboto.className}`}>
        {!success && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
            aria-label="Close"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {success ? (
          <div className="py-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <p className={`text-base font-medium text-green-600 tracking-wide ${roboto.className}`}>
              Your email has been saved successfully!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#0071BD]" />
                </div>
                <h2 className={`text-xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
                  Add Your Email
                </h2>
              </div>
              <p className={`text-sm text-gray-500 tracking-wide ${roboto.className}`}>
                Please add your email address to enable password recovery. This is required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className={`text-sm text-red-700 tracking-wide ${roboto.className}`}>{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className={`flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className={roboto.className}>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className={roboto.className}>Save Email</span>
                      <Mail className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}