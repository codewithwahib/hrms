// src/app/admin/attendance/add/page.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import NavbarDropdown from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@supabase/supabase-js'
import { Roboto } from 'next/font/google'
import {
  Loader,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  LogIn,
  LogOut,
  Plus,
  Hash,
  Building,
  Briefcase,
  PlusCircle,
  Lock,
  RefreshCw,
  Mail,
  ShieldCheck,
  CalendarDays,
} from 'lucide-react'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

// ============================================================
// SUPABASE CLIENT
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// BRANCH OPTIONS
// ============================================================

const BRANCH_OPTIONS = [
  { value: 'K', label: 'Korangi', device: 'K-01', branch: 'K' },
  { value: 'PQ', label: 'Port Qasim', device: 'PQ-01', branch: 'PQ' },
] as const

type BranchValue = (typeof BRANCH_OPTIONS)[number]['value']

// ============================================================
// INTERFACES
// ============================================================

interface Employee {
  employee_id: string
  full_name: string
  department: string | null
  position: string | null
  source: string | null
}

interface AttendanceLog {
  id: number
  user_id: string
  employee_name: string | null
  timestamp: string
  punch_type: 'CHECK_IN' | 'CHECK_OUT' | null
  device_id: string | null
  branch_code: string | null
  raw_log_key: string
  created_at: string
  source?: 'K' | 'PQ'
}

// ============================================================
// HELPERS
// ============================================================

const toLocalDateStr = (isoTimestamp: string): string => {
  if (!isoTimestamp) return ''
  try {
    const d = new Date(isoTimestamp)
    if (isNaN(d.getTime())) return ''
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch {
    return ''
  }
}

const formatTimeForInput = (isoTimestamp: string): string => {
  if (!isoTimestamp) return ''
  try {
    const d = new Date(isoTimestamp)
    if (isNaN(d.getTime())) return ''
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
  } catch {
    return ''
  }
}

// ✅ NEW: Get day name from YYYY-MM-DD string
const getDayNameFromDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    // Use local time-safe parsing (YYYY-MM-DD → local date)
    const [y, m, d] = dateStr.split('-').map(Number)
    if (!y || !m || !d) return ''
    const date = new Date(y, m - 1, d)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  } catch {
    return ''
  }
}

// ============================================================
// PAGE
// ============================================================

export default function AddAttendancePage() {
  const router = useRouter()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true)

  const [selectedDate, setSelectedDate] = useState('')

  const [checkInTime, setCheckInTime] = useState('')
  const [checkOutTime, setCheckOutTime] = useState('')

  const [existingLogsInfo, setExistingLogsInfo] = useState<{
    hasCheckIn: boolean
    hasCheckOut: boolean
  }>({ hasCheckIn: false, hasCheckOut: false })

  const [selectedBranch, setSelectedBranch] = useState<BranchValue>('K')

  const [deviceId, setDeviceId] = useState('K-01')
  const [branchCode, setBranchCode] = useState('K')

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ✅ OTP states
  const [otpCode, setOtpCode] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [otpSentTo, setOtpSentTo] = useState('')
  const [otpCountdown, setOtpCountdown] = useState(0)

  // ============================================================
  // ✅ DAY NAME (auto-calculated from selectedDate)
  // ============================================================

  const dayName = useMemo(
    () => getDayNameFromDate(selectedDate),
    [selectedDate]
  )

  // ============================================================
  // SET DEFAULT DATE
  // ============================================================

  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    setSelectedDate(`${year}-${month}-${day}`)
  }, [])

  // ============================================================
  // OTP COUNTDOWN TIMER
  // ============================================================

  useEffect(() => {
    if (otpCountdown <= 0) return
    const t = setTimeout(() => setOtpCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [otpCountdown])

  // ============================================================
  // FETCH EMPLOYEES
  // ============================================================

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoadingEmployees(true)

      const { data, error } = await supabase
        .from('employees')
        .select('employee_id, full_name, department, position, source')
        .order('employee_id', { ascending: true })

      if (error) throw new Error(error.message)

      setEmployees(data || [])
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError('Failed to load employees')
    } finally {
      setIsLoadingEmployees(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // ============================================================
  // WHEN ID SELECTED — auto-fill + auto branch + reset OTP
  // ============================================================

  useEffect(() => {
    if (!selectedEmployeeId) {
      setSelectedEmployee(null)
      setCheckInTime('')
      setCheckOutTime('')
      setExistingLogsInfo({ hasCheckIn: false, hasCheckOut: false })
      setOtpCode('')
      setOtpSentTo('')
      setOtpCountdown(0)
      return
    }

    const emp = employees.find((e) => e.employee_id === selectedEmployeeId)
    setSelectedEmployee(emp || null)

    // Reset OTP on employee change
    setOtpCode('')
    setOtpSentTo('')
    setOtpCountdown(0)

    if (emp) {
      const empBranch: BranchValue = emp.source === 'PQ' ? 'PQ' : 'K'
      setSelectedBranch(empBranch)
      setBranchCode(empBranch)
      setDeviceId(empBranch === 'PQ' ? 'PQ-01' : 'K-01')
    }
  }, [selectedEmployeeId, employees])

  // ============================================================
  // HANDLE BRANCH CHANGE
  // ============================================================

  const handleBranchChange = useCallback((val: BranchValue) => {
    setSelectedBranch(val)
    const opt = BRANCH_OPTIONS.find((b) => b.value === val)
    if (opt) {
      setBranchCode(opt.branch)
      setDeviceId(opt.device)
    }
  }, [])

  // ============================================================
  // FETCH EXISTING LOGS
  // ============================================================

  const fetchExistingLogs = useCallback(async () => {
    if (!selectedEmployeeId || !selectedDate) {
      setCheckInTime('')
      setCheckOutTime('')
      setExistingLogsInfo({ hasCheckIn: false, hasCheckOut: false })
      return
    }

    try {
      setIsLoadingLogs(true)

      const [kLogs, pqLogs] = await Promise.all([
        supabase
          .from('attendance_logs')
          .select('*')
          .eq('user_id', selectedEmployeeId)
          .order('timestamp', { ascending: true }),
        supabase
          .from('pq_attendance_logs')
          .select('*')
          .eq('user_id', selectedEmployeeId)
          .order('timestamp', { ascending: true }),
      ])

      if (kLogs.error) console.warn('K logs error:', kLogs.error)
      if (pqLogs.error) console.warn('PQ logs error:', pqLogs.error)

      const allLogs: AttendanceLog[] = []

      ;(kLogs.data || []).forEach((log: any) => {
        allLogs.push({
          id: Number(log.id),
          user_id: String(log.user_id),
          employee_name: String(log.employee_name ?? ''),
          timestamp: log.timestamp,
          punch_type:
            log.punch_type === 'CHECK_OUT'
              ? 'CHECK_OUT'
              : log.punch_type === 'CHECK_IN'
                ? 'CHECK_IN'
                : null,
          device_id: String(log.device_id ?? ''),
          branch_code: String(log.branch_code ?? 'K'),
          raw_log_key: String(log.raw_log_key ?? ''),
          created_at: log.created_at,
          source: 'K',
        })
      })

      ;(pqLogs.data || []).forEach((log: any) => {
        allLogs.push({
          id: Number(log.id),
          user_id: String(log.user_id),
          employee_name: String(log.employee_name ?? ''),
          timestamp: log.timestamp,
          punch_type:
            log.punch_type === 'CHECK_OUT'
              ? 'CHECK_OUT'
              : log.punch_type === 'CHECK_IN'
                ? 'CHECK_IN'
                : null,
          device_id: String(log.device_id ?? ''),
          branch_code: String(log.branch_code ?? 'PQ'),
          raw_log_key: String(log.raw_log_key ?? ''),
          created_at: log.created_at,
          source: 'PQ',
        })
      })

      const dayLogs = allLogs.filter(
        (log) => toLocalDateStr(log.timestamp) === selectedDate
      )

      const sortedLogs = [...dayLogs].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )

      let checkInLog: AttendanceLog | null = null
      let checkOutLog: AttendanceLog | null = null

      if (sortedLogs.length === 1) {
        const singleLog = sortedLogs[0]
        const logHour = new Date(singleLog.timestamp).getHours()
        if (logHour >= 18) {
          checkOutLog = singleLog
        } else {
          checkInLog = singleLog
        }
      } else if (sortedLogs.length >= 2) {
        checkInLog = sortedLogs[0]
        const lastLog = sortedLogs[sortedLogs.length - 1]
        const diffMs =
          new Date(lastLog.timestamp).getTime() -
          new Date(checkInLog.timestamp).getTime()
        if (diffMs >= 3600000) {
          checkOutLog = lastLog
        }
      }

      const foundCheckIn = checkInLog
        ? formatTimeForInput(checkInLog.timestamp)
        : ''
      const foundCheckOut = checkOutLog
        ? formatTimeForInput(checkOutLog.timestamp)
        : ''

      setCheckInTime(foundCheckIn)
      setCheckOutTime(foundCheckOut)

      setExistingLogsInfo({
        hasCheckIn: !!foundCheckIn,
        hasCheckOut: !!foundCheckOut,
      })
    } catch (err) {
      console.error('Error fetching existing logs:', err)
    } finally {
      setIsLoadingLogs(false)
    }
  }, [selectedEmployeeId, selectedDate])

  useEffect(() => {
    fetchExistingLogs()
  }, [fetchExistingLogs])

  // ============================================================
  // HANDLE REFRESH
  // ============================================================

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setError('')
    setSuccess('')

    try {
      await fetchExistingLogs()
      setSuccess('Attendance data refreshed!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      console.error('Refresh error:', err)
      setError('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchExistingLogs, isRefreshing])

  // ============================================================
  // HANDLE SEND OTP
  // ============================================================

  const handleSendOtp = useCallback(async () => {
    if (!selectedEmployee) {
      setError('Please select an employee first.')
      return
    }
    if (isSendingOtp) return

    setIsSendingOtp(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/hr/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: selectedEmployee.employee_id,
          employee_name: selectedEmployee.full_name,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to send verification code.')
        return
      }

      setOtpSentTo(data.email_masked || '')
      setSuccess(data.message || 'Verification code sent to HR email!')
      setOtpCountdown(60)

      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      console.error('Send OTP error:', err)
      setError('Failed to send verification code.')
    } finally {
      setIsSendingOtp(false)
    }
  }, [selectedEmployee, isSendingOtp])

  // ============================================================
  // HANDLE SUBMIT — OTP required
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!selectedEmployee) {
      setError('Please select an employee ID')
      return
    }

    if (!selectedDate) {
      setError('Please select a date')
      return
    }

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to HR email.')
      return
    }

    const canSubmitCheckIn =
      !existingLogsInfo.hasCheckIn && checkInTime.trim() !== ''
    const canSubmitCheckOut =
      !existingLogsInfo.hasCheckOut && checkOutTime.trim() !== ''

    if (!canSubmitCheckIn && !canSubmitCheckOut) {
      if (existingLogsInfo.hasCheckIn && existingLogsInfo.hasCheckOut) {
        setError('Both Check In and Check Out already exist for this date.')
      } else {
        setError('Please enter a time for the empty field.')
      }
      return
    }

    setIsLoading(true)

    try {
      const logsToAdd: Array<{
        user_id: string
        employee_name: string
        timestamp: string
        punch_type: 'CHECK_IN' | 'CHECK_OUT'
        device_id: string
        branch_code: string
      }> = []

      if (canSubmitCheckIn) {
        logsToAdd.push({
          user_id: String(selectedEmployee.employee_id).trim(),
          employee_name: String(selectedEmployee.full_name).trim(),
          timestamp: new Date(`${selectedDate}T${checkInTime}:00`).toISOString(),
          punch_type: 'CHECK_IN',
          device_id: String(deviceId || 'MANUAL').trim(),
          branch_code: String(branchCode || 'K').trim(),
        })
      }

      // ⚠️ Check Out field se bhi CHECK_IN (jaan-boojh kar)
      if (canSubmitCheckOut) {
        logsToAdd.push({
          user_id: String(selectedEmployee.employee_id).trim(),
          employee_name: String(selectedEmployee.full_name).trim(),
          timestamp: new Date(`${selectedDate}T${checkOutTime}:00`).toISOString(),
          punch_type: 'CHECK_IN',
          device_id: String(deviceId || 'MANUAL').trim(),
          branch_code: String(branchCode || 'K').trim(),
        })
      }

      console.log('📤 Sending logs:', logsToAdd)

      const response = await fetch('/api/hr/add-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logs: logsToAdd,
          otp_code: otpCode.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to add attendance logs')
        setIsLoading(false)
        return
      }

      setSuccess(data.message || 'Attendance logs added successfully!')

      // ✅ Clear OTP after success
      setOtpCode('')
      setOtpSentTo('')
      setOtpCountdown(0)

      await fetchExistingLogs()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error adding attendance:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  const isCheckInLocked = existingLogsInfo.hasCheckIn
  const isCheckOutLocked = existingLogsInfo.hasCheckOut

  return (
    <>
      <NavbarDropdown />
      <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
        <div className="w-full">
          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1
                className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}
              >
                Add Attendance
              </h1>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading || !selectedEmployeeId}
              className={`px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
              title="Refresh attendance data"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* FORM CARD */}
          <div className="bg-white shadow-sm p-6 md:p-8 mb-6 w-full">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Plus className="w-5 h-5 text-[#0071BD]" />
              <h2
                className={`text-sm font-bold text-gray-800 tracking-wide uppercase ${roboto.className}`}
              >
                New Attendance Log
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ROW 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}
                  >
                    Employee ID *
                  </label>
                  <div className="relative">
                    <Hash className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      disabled={isLoadingEmployees}
                      className={`w-full pl-10 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 appearance-none ${roboto.className}`}
                    >
                      <option value="">
                        {isLoadingEmployees ? 'Loading...' : 'Select ID'}
                      </option>
                      {employees.map((emp) => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.employee_id}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={selectedEmployee?.full_name || ''}
                      readOnly
                      placeholder="Auto-filled"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm ${roboto.className}`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}
                  >
                    Department
                  </label>
                  <div className="relative">
                    <Building className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={selectedEmployee?.department || ''}
                      readOnly
                      placeholder="Auto-filled"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm ${roboto.className}`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}
                  >
                    Designation
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={selectedEmployee?.position || ''}
                      readOnly
                      placeholder="Auto-filled"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm ${roboto.className}`}
                    />
                  </div>
                </div>
              </div>

              {/* ✅ ROW 2 — Date + Day + Check In + Check Out */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}
                  >
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 ${roboto.className}`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* ✅ NEW: DAY (auto from date) */}
                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5 ${roboto.className}`}
                  >
                    <CalendarDays className="w-4 h-4 text-[#0071BD]" />
                    Day
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded tracking-wide uppercase">
                      auto
                    </span>
                  </label>
                  <div className="relative">
                    <CalendarDays className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={dayName}
                      readOnly
                      placeholder="Auto-filled"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm font-medium ${roboto.className}`}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
                    Auto-calculated from selected date
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5 ${roboto.className}`}
                  >
                    <LogIn className="w-4 h-4 text-green-600" />
                    Check In Time
                    {isLoadingLogs && (
                      <Loader className="w-3 h-3 animate-spin text-gray-400" />
                    )}
                    {isCheckInLocked && !isLoadingLogs && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded tracking-wide flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        exists
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      readOnly={isCheckInLocked}
                      className={`w-full pl-10 pr-4 py-3 border outline-none shadow-sm ${
                        isCheckInLocked
                          ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900'
                      } ${roboto.className}`}
                      disabled={isLoading || isCheckInLocked}
                    />
                  </div>
                  {isCheckInLocked && (
                    <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
                      Check In already exists — cannot be changed
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5 ${roboto.className}`}
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    Check Out Time
                    {isLoadingLogs && (
                      <Loader className="w-3 h-3 animate-spin text-gray-400" />
                    )}
                    {isCheckOutLocked && !isLoadingLogs && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded tracking-wide flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        exists
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      readOnly={isCheckOutLocked}
                      className={`w-full pl-10 pr-4 py-3 border outline-none shadow-sm ${
                        isCheckOutLocked
                          ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900'
                      } ${roboto.className}`}
                      disabled={isLoading || isCheckOutLocked}
                    />
                  </div>
                  {isCheckOutLocked && (
                    <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
                      Check Out already exists — cannot be changed
                    </p>
                  )}
                </div>
              </div>

              {/* ROW 3 — Branch + Device + Branch Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5 ${roboto.className}`}
                  >
                    <MapPin className="w-4 h-4 text-[#0071BD]" />
                    Branch *
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                      value={selectedBranch}
                      onChange={(e) =>
                        handleBranchChange(e.target.value as BranchValue)
                      }
                      className={`w-full pl-10 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 appearance-none font-medium ${roboto.className}`}
                      disabled={isLoading}
                    >
                      {BRANCH_OPTIONS.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
                    Select branch to auto-fill Device ID and Branch Code
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5 ${roboto.className}`}
                  >
                    Device ID *
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded tracking-wide uppercase">
                      auto
                    </span>
                  </label>
                  <div className="relative">
                    <Hash className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={deviceId}
                      readOnly
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm font-medium ${roboto.className}`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5 ${roboto.className}`}
                  >
                    Branch Code *
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded tracking-wide uppercase">
                      auto
                    </span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={branchCode}
                      readOnly
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm font-medium ${roboto.className}`}
                    />
                  </div>
                </div>
              </div>

              {/* ✅ ROW 4 — HR EMAIL VERIFICATION */}
              <div className="bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#0071BD]" />
                  <h3
                    className={`text-xs font-bold text-gray-800 tracking-wide uppercase ${roboto.className}`}
                  >
                    HR Email Verification Required
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}
                    >
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={
                        isSendingOtp ||
                        isLoading ||
                        !selectedEmployee ||
                        otpCountdown > 0
                      }
                      className={`w-full py-3 border transition flex items-center justify-center gap-2 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                        otpSentTo
                          ? 'border-green-300 bg-green-50 text-green-700'
                          : 'border-[#0071BD] bg-white text-[#0071BD] hover:bg-blue-50'
                      } ${roboto.className}`}
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : otpCountdown > 0 ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Resend in {otpCountdown}s</span>
                        </>
                      ) : otpSentTo ? (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Resend Code</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Code to HR Email</span>
                        </>
                      )}
                    </button>
                    {otpSentTo && (
                      <p className="text-[10px] text-green-600 mt-1 tracking-wide">
                        Code sent to HR: {otpSentTo}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5 ${roboto.className}`}
                    >
                      
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) =>
                          setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        placeholder="● ● ● ● ● ●"
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 tracking-[0.5em] font-bold text-lg text-center ${roboto.className}`}
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
                      Code expires in 10 minutes. Check HR email inbox (and spam folder).
                    </p>
                  </div>
                </div>
              </div>

              {/* ERROR / SUCCESS */}
              {error && (
                <div className="bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p
                    className={`text-sm text-red-700 tracking-wide ${roboto.className}`}
                  >
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p
                    className={`text-sm text-green-700 tracking-wide ${roboto.className}`}
                  >
                    {success}
                  </p>
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className={`flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !selectedEmployee ||
                    otpCode.trim().length !== 6
                  }
                  className={`flex-1 py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className={roboto.className}>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span className={roboto.className}>Add Attendance</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}