// src/app/leave-request/[employeeId]/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import NavbarDropdown from '@/app/Navbar/page'
import ProtectedEmployeeRoute from '@/components/ProtectedEmployeeRoute'
import Footer from '@/components/footer'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  Calendar,
  Clock,
  User,
  Building,
  FileText,
  MessageCircle,
  AlertCircle,
  Check,
  X,
  Loader,
  ArrowLeft
} from 'lucide-react'

// Import Roboto font
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

interface Employee {
  id: string
  employee_id: string
  full_name: string
  department?: string
  position?: string
}

// ✅ Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LeaveRequestPage() {
  const params = useParams()
  const router = useRouter()
  const employeeId = typeof params.employeeId === 'string' ? params.employeeId : ''

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // ✅ Leave balance state (from DB)
  const [leaveBalance, setLeaveBalance] = useState<{
    totalLeaves: number
    usedLeaves: number
    remainingLeaves: number
  }>({ totalLeaves: 0, usedLeaves: 0, remainingLeaves: 0 })

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    totalDays: 0,
    reason: '',
    fromTime: '',
    toTime: '',
  })

  const isHalfDay = formData.leaveType === 'Half Day'

  // =====================================================
  // fetchEmployee
  // =====================================================

  const fetchEmployee = useCallback(async () => {
    if (!employeeId) {
      setError('Employee ID is missing.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('employees')
        .select('id, employee_id, full_name, department, position, total_leaves, used_leaves, remaining_leaves')
        .eq('employee_id', employeeId)
        .maybeSingle()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      if (!data) {
        throw new Error('Employee data not found')
      }

      setEmployee(data)

      // ✅ Load current leave balance
      setLeaveBalance({
        totalLeaves: data.total_leaves ?? 0,
        usedLeaves: data.used_leaves ?? 0,
        remainingLeaves: data.remaining_leaves ?? 0,
      })

      setFormData((prev) => ({
        ...prev,
        employeeName: data.full_name || '',
        employeeId: data.employee_id || employeeId,
        department: data.department || '',
        position: data.position || '',
      }))
    } catch (err) {
      console.error('Employee loading error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load employee')
    } finally {
      setLoading(false)
    }
  }, [employeeId])

  useEffect(() => {
    fetchEmployee()
  }, [fetchEmployee])

  const calculateTotalDays = (from: string, to: string) => {
    if (!from || !to) return 0
    const fromDate = new Date(`${from}T00:00:00`)
    const toDate = new Date(`${to}T00:00:00`)
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) return 0
    if (toDate < fromDate) return 0
    const diffTime = toDate.getTime() - fromDate.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      if (name === 'fromDate' || name === 'toDate') {
        const from = name === 'fromDate' ? value : prev.fromDate
        const to = name === 'toDate' ? value : prev.toDate
        newData.totalDays = calculateTotalDays(from, to)
      }
      if (name === 'leaveType' && value === 'Half Day') {
        if (prev.fromDate) {
          newData.toDate = prev.fromDate
        }
        newData.totalDays = prev.fromDate ? 0.5 : 0
      }
      if (name === 'leaveType' && value !== 'Half Day') {
        newData.fromTime = ''
        newData.toTime = ''
      }
      return newData
    })
  }

  useEffect(() => {
    if (isHalfDay && formData.fromDate && formData.fromDate !== formData.toDate) {
      setFormData((prev) => ({
        ...prev,
        toDate: prev.fromDate,
        totalDays: 0.5,
      }))
    }
  }, [formData.fromDate, formData.toDate, isHalfDay])

  // =====================================================
  // handleSubmit
  // =====================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSuccessMessage('')

    if (!formData.employeeId) {
      setError('Employee ID is missing.')
      return
    }
    if (!formData.leaveType) {
      setError('Please select a leave type.')
      return
    }
    if (!formData.fromDate) {
      setError('Please select from date.')
      return
    }
    if (!formData.toDate) {
      setError('Please select to date.')
      return
    }
    if (formData.totalDays <= 0) {
      setError('To date must be equal to or after from date.')
      return
    }

    if (isHalfDay) {
      if (!formData.fromTime) {
        setError('Please select from time for half day.')
        return
      }
      if (!formData.toTime) {
        setError('Please select to time for half day.')
        return
      }
      if (formData.fromTime >= formData.toTime) {
        setError('To time must be after from time.')
        return
      }
    }

    if (!formData.reason.trim()) {
      setError('Please provide a reason for leave.')
      return
    }
    if (formData.reason.trim().length < 20) {
      setError('Please provide a detailed reason (minimum 20 characters).')
      return
    }

    try {
      setSubmitting(true)

      // ✅ Fetch current data: leaves, used_leaves, remaining_leaves, total_leaves
      const { data: employeeData, error: fetchError } = await supabase
        .from('employees')
        .select('leaves, total_leaves, used_leaves, remaining_leaves')
        .eq('employee_id', formData.employeeId)
        .maybeSingle()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      if (!employeeData) {
        throw new Error('Employee not found')
      }

      // ✅ Build new leave record
      const newLeave: any = {
        _key: `leave-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        employeeName: formData.employeeName,
        employeeId: formData.employeeId,
        department: formData.department,
        position: formData.position,
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        totalDays: formData.totalDays,
        reason: formData.reason.trim(),
        status: 'pending',
        appliedOn: new Date().toISOString(),
      }

      if (isHalfDay) {
        newLeave.fromTime = formData.fromTime
        newLeave.toTime = formData.toTime
      }

      const currentLeaves = employeeData.leaves || []
      const updatedLeaves = [...currentLeaves, newLeave]

      // ✅ NEW: Update used_leaves and remaining_leaves
      const currentUsedLeaves = Number(employeeData.used_leaves ?? 0)
      const currentRemainingLeaves = Number(employeeData.remaining_leaves ?? 0)

      // Add days requested this time (supports 0.5 for half day)
      const newUsedLeaves = currentUsedLeaves + formData.totalDays
      const newRemainingLeaves = Math.max(
        0,
        currentRemainingLeaves - formData.totalDays
      )

      const { error: updateError } = await supabase
        .from('employees')
        .update({
          leaves: updatedLeaves,
          used_leaves: newUsedLeaves,
          remaining_leaves: newRemainingLeaves,
          updated_at: new Date().toISOString()
        })
        .eq('employee_id', formData.employeeId)

      if (updateError) {
        throw new Error(updateError.message)
      }

      // ✅ Refresh leave balance display
      setLeaveBalance((prev) => ({
        ...prev,
        usedLeaves: newUsedLeaves,
        remainingLeaves: newRemainingLeaves,
      }))

      setSuccess(true)
      setSuccessMessage(
        isHalfDay
          ? `✅ Your Half Day request (${formData.fromTime} - ${formData.toTime}) has been submitted successfully!`
          : `✅ Your ${formData.leaveType} request for ${formData.totalDays} day(s) has been submitted successfully!`
      )

      // Clear form
      setFormData((prev) => ({
        ...prev,
        leaveType: '',
        fromDate: '',
        toDate: '',
        totalDays: 0,
        reason: '',
        fromTime: '',
        toTime: '',
      }))

      setTimeout(() => {
        setSuccess(false)
        setSuccessMessage('')
      }, 8000)

    } catch (err) {
      console.error('Leave submit error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit leave request')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto mb-4" />
        </div>
      </div>
    )
  }

  if (error && !employee) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
        <div className="text-center bg-white shadow-sm p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wider">Error</h3>
          <p className="text-gray-600 mb-4 tracking-wide">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition tracking-wider"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
    <ProtectedEmployeeRoute allowedRole='employee'>
    <NavbarDropdown/>
      <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-[#0071BD] tracking-wider">
                    Leave Request
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Leave Balance Summary */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white shadow-sm border-l-4 border-[#0071BD] p-4">
              <p className="text-xs text-gray-500 tracking-wide uppercase">Total Leaves</p>
              <p className="text-2xl font-bold text-[#0071BD] mt-1">{leaveBalance.totalLeaves}</p>
            </div>
            <div className="bg-white shadow-sm border-l-4 border-red-500 p-4">
              <p className="text-xs text-gray-500 tracking-wide uppercase">Used Leaves</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{leaveBalance.usedLeaves}</p>
            </div>
            <div className="bg-white shadow-sm border-l-4 border-green-500 p-4">
              <p className="text-xs text-gray-500 tracking-wide uppercase">Remaining Leaves</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{leaveBalance.remainingLeaves}</p>
            </div>
          </div>

          {/* ✅ Success Message */}
          {success && (
            <div className="mb-6 p-4 flex items-start gap-3 bg-green-50 border-l-4 border-green-500 shadow-md">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-green-700 tracking-wide font-semibold">
                  ✅ Success!
                </p>
                <p className="text-sm text-green-600 tracking-wide mt-1">
                  {successMessage}
                </p>
                <p className="text-xs text-green-500 tracking-wide mt-2">
                  You can submit another leave request or go back to dashboard.
                </p>
              </div>
              <button
                onClick={() => {
                  setSuccess(false)
                  setSuccessMessage('')
                }}
                className="flex-shrink-0 text-green-500 hover:text-green-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ❌ Error Message */}
          {error && employee && (
            <div className="mb-6 p-4 flex items-start gap-3 bg-red-50 border-l-4 border-red-500 shadow-md">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 tracking-wide font-semibold">❌ Error</p>
                <p className="text-sm text-red-600 tracking-wide mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form */}
          <div className="bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 tracking-wider flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0071BD]" />
                Leave Application
              </h2>
              <p className="text-sm text-gray-500 tracking-wide mt-1">Submit a new leave request</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Employee Information */}
              <div className="bg-gray-50 p-4 border-l-4 border-[#0071BD]">
                <h3 className="font-medium text-gray-700 flex items-center gap-2 tracking-wider mb-4">
                  <User className="w-4 h-4" />
                  Employee Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm tracking-wide">
                  <div>
                    <p className="text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800 mt-1">{formData.employeeName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Employee ID</p>
                    <p className="font-medium text-gray-800 mt-1">{formData.employeeId || employeeId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Department</p>
                    <p className="font-medium text-gray-800 mt-1 flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {formData.department || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Position</p>
                    <p className="font-medium text-gray-800 mt-1">{formData.position || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Leave Details */}
              <div>
                <h3 className="font-medium text-gray-700 flex items-center gap-2 tracking-wider mb-4">
                  <Calendar className="w-4 h-4" />
                  Leave Details
                </h3>
                <div className="grid text-black grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                      Leave Type *
                    </label>
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide disabled:bg-gray-100"
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                      <option value="Maternity Leave">Maternity Leave</option>
                      <option value="Paternity Leave">Paternity Leave</option>
                      <option value="Study Leave">Study Leave</option>
                      <option value="Unpaid Leave">Unpaid Leave</option>
                      <option value="Half Day">Half Day</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                      {isHalfDay ? 'Total Days (Half Day)' : 'Total Days'}
                    </label>
                    <input
                      type="number"
                      value={formData.totalDays}
                      step={isHalfDay ? '0.5' : '1'}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed shadow-sm tracking-wide"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                      From Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                      To Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        required
                        disabled={submitting || isHalfDay}
                        min={formData.fromDate || undefined}
                        className={`w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide ${
                          isHalfDay
                            ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                            : 'disabled:bg-gray-100'
                        }`}
                      />
                    </div>
                    {isHalfDay && (
                      <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
                        Auto-set to same as From Date for Half Day
                      </p>
                    )}
                  </div>
                </div>

                {/* ✅ Half Day Time Fields */}
                {isHalfDay && (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2 tracking-wider mb-3 text-sm">
                      <Clock className="w-4 h-4" />
                      Half Day Timing
                    </h4>
                    <div className="grid text-black grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                          From Time *
                        </label>
                        <div className="relative">
                          <Clock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="time"
                            name="fromTime"
                            value={formData.fromTime}
                            onChange={handleChange}
                            required={isHalfDay}
                            disabled={submitting}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                          To Time *
                        </label>
                        <div className="relative">
                          <Clock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="time"
                            name="toTime"
                            value={formData.toTime}
                            onChange={handleChange}
                            required={isHalfDay}
                            disabled={submitting}
                            min={formData.fromTime || undefined}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 tracking-wide">
                      Specify the exact time range for your half-day leave.
                    </p>
                  </div>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                  Reason for Leave *
                </label>
                <div className="relative">
                  <MessageCircle className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    rows={4}
                    placeholder="Please provide detailed reason (minimum 20 characters)"
                    className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide resize-none disabled:bg-gray-100"
                  />
                </div>
                <p className={`text-xs mt-1 tracking-wide ${formData.reason.length < 20 ? 'text-gray-500' : 'text-green-600'}`}>
                  {formData.reason.length}/20 characters minimum
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 disabled:opacity-50 tracking-wider"
                >
                  {submitting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {submitting ? 'Submitting...' : 'Submit Leave Request'}
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => router.push(`/dashboard/${employeeId}`)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition tracking-wider"
                >
                  Go to Dashboard
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-400 tracking-wide">
            <p>Leave request management</p>
          </div>
        </div>
      </div>
      <Footer/>
      </ProtectedEmployeeRoute>
    </>
  )
}