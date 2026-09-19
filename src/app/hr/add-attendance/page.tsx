// src/app/hr/add-attenadance/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import NavbarDropdown from '@/components/navbar'
import Footer from '@/components/footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import {
  User,
  Search,
  Building,
  Globe,
  Clock,
  LogIn,
  LogOut,
  Calendar,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Users,
  ChevronDown,
  History,
  Timer,
  BadgeCheck,
  Save,
} from 'lucide-react'

import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

// =====================================================
// Types
// =====================================================
interface Employee {
  id: string
  employeeId: string
  fullName: string
  department: string | null
  position: string | null
  source: 'K' | 'PQ'
  shift: string | null
  shiftTiming: string | null
  branch: string
}

interface AttendanceRecord {
  id: number
  user_id: string
  employee_name: string | null
  timestamp: string
  punch_type: 'CHECK_IN' | 'CHECK_OUT'
  device_id: string | null
  branch_code: string | null
  created_at: string
}

interface ManualPunchForm {
  employeeId: string
  employeeName: string
  branch: 'K' | 'PQ' | ''
  punchType: 'CHECK_IN' | 'CHECK_OUT' | ''
  punchDate: string
  punchTime: string
  deviceId: string
}

// =====================================================
// Main Component
// =====================================================
export default function AddAttendancePage() {
  const router = useRouter()

  // State
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [employeeError, setEmployeeError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState<'ALL' | 'K' | 'PQ'>('ALL')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Punch Form
  const [punchForm, setPunchForm] = useState<ManualPunchForm>({
    employeeId: '',
    employeeName: '',
    branch: '',
    punchType: '',
    punchDate: new Date().toISOString().split('T')[0],
    punchTime: new Date().toTimeString().slice(0, 5),
    deviceId: 'MANUAL_ENTRY',
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Recent attendance for selected employee
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([])
  const [loadingAttendance, setLoadingAttendance] = useState(false)

  // =====================================================
  // Fetch Employees
  // =====================================================
  const fetchEmployees = useCallback(async () => {
    setLoadingEmployees(true)
    setEmployeeError('')
    try {
      const res = await fetch('/api/hr/employees?limit=1000', {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to fetch employees')

      const data = await res.json()
      const list: any[] = data.employees || data.data || data || []

      const mapped: Employee[] = list.map((e: any) => ({
        id: e.id?.toString() || e.employeeId || '',
        employeeId: e.employeeId || e.employee_id || '',
        fullName: e.fullName || e.full_name || e.name || '',
        department: e.department || null,
        position: e.position || e.designation || null,
        source: (e.source || e.branch || 'K') as 'K' | 'PQ',
        shift: e.shift || null,
        shiftTiming: e.shiftTiming || e.shift_timing || null,
        branch: (e.source || e.branch || 'K') === 'PQ' ? 'Port Qasim' : 'Korangi',
      }))

      setEmployees(mapped)
      setFilteredEmployees(mapped)
    } catch (err) {
      console.error('Error fetching employees:', err)
      setEmployeeError('Failed to load employees. Please try again.')
    } finally {
      setLoadingEmployees(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // =====================================================
  // Filter Employees
  // =====================================================
  useEffect(() => {
    let result = [...employees]

    if (branchFilter !== 'ALL') {
      result = result.filter((e) => e.source === branchFilter)
    }

    if (departmentFilter !== 'ALL') {
      result = result.filter((e) => e.department === departmentFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q) ||
          (e.department || '').toLowerCase().includes(q) ||
          (e.position || '').toLowerCase().includes(q),
      )
    }

    setFilteredEmployees(result)
  }, [employees, searchQuery, branchFilter, departmentFilter])

  // Get unique departments
  const departments = Array.from(
    new Set(employees.map((e) => e.department).filter(Boolean)),
  ) as string[]

  // =====================================================
  // Select Employee -> auto-fill form
  // =====================================================
  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp)
    setPunchForm({
      employeeId: emp.employeeId,
      employeeName: emp.fullName,
      branch: emp.source, // ✅ Auto-select branch
      punchType: '',
      punchDate: new Date().toISOString().split('T')[0],
      punchTime: new Date().toTimeString().slice(0, 5),
      deviceId: 'MANUAL_ENTRY',
    })
    setSuccess('')
    setError('')
    fetchRecentAttendance(emp.employeeId)
  }

  // =====================================================
  // Fetch recent attendance for an employee
  // =====================================================
  const fetchRecentAttendance = async (employeeId: string) => {
    setLoadingAttendance(true)
    try {
      const res = await fetch(
        `/api/hr/attendance/employee/${encodeURIComponent(employeeId)}?limit=10`,
        { headers: { Accept: 'application/json' } },
      )
      if (!res.ok) {
        setRecentAttendance([])
        return
      }
      const data = await res.json()
      setRecentAttendance(data.records || data.data || [])
    } catch (err) {
      console.error('Error fetching attendance:', err)
      setRecentAttendance([])
    } finally {
      setLoadingAttendance(false)
    }
  }

  // =====================================================
  // Submit Manual Punch
  // =====================================================
  const handleSubmitPunch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!punchForm.employeeId) {
      setError('Please select an employee first')
      return
    }
    if (!punchForm.branch) {
      setError('Branch is required')
      return
    }
    if (!punchForm.punchType) {
      setError('Please select punch type (Check In / Check Out)')
      return
    }
    if (!punchForm.punchDate || !punchForm.punchTime) {
      setError('Please select date and time')
      return
    }

    setSubmitting(true)
    try {
      const timestamp = new Date(
        `${punchForm.punchDate}T${punchForm.punchTime}:00`,
      ).toISOString()

      const payload = {
        user_id: punchForm.employeeId,
        employee_name: punchForm.employeeName,
        punch_type: punchForm.punchType,
        timestamp,
        device_id: punchForm.deviceId || 'MANUAL_ENTRY',
        branch_code: punchForm.branch,
      }

      const res = await fetch('/api/hr/add-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to add attendance')
      }

      setSuccess(
        `✅ ${punchForm.punchType === 'CHECK_IN' ? 'Check In' : 'Check Out'} recorded for ${punchForm.employeeName}`,
      )

      fetchRecentAttendance(punchForm.employeeId)
      setPunchForm((prev) => ({ ...prev, punchType: '' }))

      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      console.error('Error adding attendance:', err)
      setError(err instanceof Error ? err.message : 'Failed to add attendance')
    } finally {
      setSubmitting(false)
    }
  }

  // =====================================================
  // Format helpers
  // =====================================================
  const formatDateTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  // =====================================================
  // Render
  // =====================================================
  return (
    <>
      <ProtectedRoute allowedUser="hr">
        <NavbarDropdown />
        <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#0071BD] tracking-wider flex items-center gap-3">
                    <Clock className="w-8 h-8" />
                    Add Attendance
                  </h1>
                  <p className="text-sm text-gray-500 tracking-wide mt-1">
                    Select an employee and record Check In / Check Out manually
                  </p>
                </div>
                <button
                  onClick={() => router.push('/hr/dashboard')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition tracking-wider flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Back to Dashboard
                </button>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-4 flex items-start gap-3 bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-700 tracking-wide">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 flex items-start gap-3 bg-green-50 border border-green-200">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-green-700 tracking-wide">{success}</p>
                </div>
                <button
                  onClick={() => setSuccess('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* LEFT: Employee List */}
              <div className="lg:col-span-2 bg-white shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 tracking-wider flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-[#0071BD]" />
                    Employees
                    <span className="text-xs font-normal text-gray-500 ml-auto">
                      {filteredEmployees.length} found
                    </span>
                  </h2>

                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, ID, dept..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black text-sm"
                    />
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        value={branchFilter}
                        onChange={(e) =>
                          setBranchFilter(e.target.value as 'ALL' | 'K' | 'PQ')
                        }
                        className="w-full pl-9 pr-6 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none shadow-sm tracking-wide text-black text-sm appearance-none"
                      >
                        <option value="ALL">All Branches</option>
                        <option value="K">Korangi</option>
                        <option value="PQ">Port Qasim</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="w-full pl-9 pr-6 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none shadow-sm tracking-wide text-black text-sm appearance-none"
                      >
                        <option value="ALL">All Depts</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Employee List */}
                <div className="max-h-[600px] overflow-y-auto">
                  {loadingEmployees ? (
                    <div className="p-8 text-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#0071BD] mx-auto mb-2" />
                      <p className="text-sm text-gray-500 tracking-wide">
                        Loading employees...
                      </p>
                    </div>
                  ) : employeeError ? (
                    <div className="p-8 text-center">
                      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-red-600 tracking-wide mb-3">
                        {employeeError}
                      </p>
                      <button
                        onClick={fetchEmployees}
                        className="px-4 py-2 bg-[#0071BD] text-white text-sm hover:bg-[#005a96] tracking-wide"
                      >
                        Retry
                      </button>
                    </div>
                  ) : filteredEmployees.length === 0 ? (
                    <div className="p-8 text-center">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 tracking-wide">
                        No employees found
                      </p>
                    </div>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const isSelected = selectedEmployee?.employeeId === emp.employeeId
                      return (
                        <button
                          key={emp.employeeId}
                          onClick={() => handleSelectEmployee(emp)}
                          className={`w-full text-left p-3 border-b border-gray-100 transition hover:bg-blue-50 ${
                            isSelected ? 'bg-blue-50 border-l-4 border-l-[#0071BD]' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? 'bg-[#0071BD] text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <User className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 tracking-wide text-sm truncate">
                                {emp.fullName}
                              </p>
                              <p className="text-xs text-gray-500 tracking-wide truncate">
                                ID: {emp.employeeId}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {emp.department && (
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                    {emp.department}
                                  </span>
                                )}
                                <span
                                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                                    emp.source === 'PQ'
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}
                                >
                                  {emp.source === 'PQ' ? 'Port Qasim' : 'Korangi'}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <BadgeCheck className="w-5 h-5 text-[#0071BD] flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

              {/* RIGHT: Punch Form + Recent Attendance */}
              <div className="lg:col-span-3 space-y-6">
                {/* Punch Form */}
                <div className="bg-white shadow-sm">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#0071BD] to-[#005a96]">
                    <h2 className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
                      <Timer className="w-5 h-5" />
                      Record Attendance
                    </h2>
                  </div>

                  {!selectedEmployee ? (
                    <div className="p-12 text-center">
                      <User className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 tracking-wide">
                        Select an employee from the list to record attendance
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitPunch} className="p-6">
                      {/* Selected Employee Info */}
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#0071BD] text-white flex items-center justify-center">
                            <User className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 tracking-wide">
                              {selectedEmployee.fullName}
                            </p>
                            <p className="text-sm text-gray-600 tracking-wide">
                              ID: {selectedEmployee.employeeId}
                              {selectedEmployee.position &&
                                ` • ${selectedEmployee.position}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEmployee(null)
                              setRecentAttendance([])
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Branch (auto-selected) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                            Branch *
                          </label>
                          <div className="relative">
                            <Globe className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                              value={punchForm.branch}
                              onChange={(e) =>
                                setPunchForm({
                                  ...punchForm,
                                  branch: e.target.value as 'K' | 'PQ',
                                })
                              }
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none shadow-sm tracking-wide text-black bg-green-50"
                            >
                              <option value="">Select Branch</option>
                              <option value="K">Korangi</option>
                              <option value="PQ">Port Qasim</option>
                            </select>
                          </div>
                          <p className="text-xs text-green-600 mt-1 tracking-wide flex items-center gap-1">
                            <Check className="w-3 h-3" /> Auto-selected from employee
                          </p>
                        </div>

                        {/* Punch Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                            Punch Type *
                          </label>
                          <div className="relative">
                            <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                              value={punchForm.punchType}
                              onChange={(e) =>
                                setPunchForm({
                                  ...punchForm,
                                  punchType: e.target.value as
                                    | 'CHECK_IN'
                                    | 'CHECK_OUT',
                                })
                              }
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none shadow-sm tracking-wide text-black"
                            >
                              <option value="">Select Type</option>
                              <option value="CHECK_IN">Check In</option>
                              {punchForm.branch === 'K' && (
                                <option value="CHECK_OUT">Check Out</option>
                              )}
                            </select>
                          </div>
                          {punchForm.branch === 'PQ' && (
                            <p className="text-xs text-purple-600 mt-1 tracking-wide">
                              Port Qasim only supports Check In
                            </p>
                          )}
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                            Date *
                          </label>
                          <div className="relative">
                            <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="date"
                              value={punchForm.punchDate}
                              onChange={(e) =>
                                setPunchForm({
                                  ...punchForm,
                                  punchDate: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none shadow-sm tracking-wide text-black"
                            />
                          </div>
                        </div>

                        {/* Time */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                            Time *
                          </label>
                          <div className="relative">
                            <Timer className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="time"
                              value={punchForm.punchTime}
                              onChange={(e) =>
                                setPunchForm({
                                  ...punchForm,
                                  punchTime: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none shadow-sm tracking-wide text-black"
                            />
                          </div>
                        </div>

                        {/* Device ID */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                            Device ID
                          </label>
                          <input
                            type="text"
                            value={punchForm.deviceId}
                            onChange={(e) =>
                              setPunchForm({
                                ...punchForm,
                                deviceId: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none shadow-sm tracking-wide text-black"
                            placeholder="MANUAL_ENTRY"
                          />
                        </div>
                      </div>

                      {/* Quick action buttons */}
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setPunchForm({
                              ...punchForm,
                              punchType: 'CHECK_IN',
                              punchDate: new Date().toISOString().split('T')[0],
                              punchTime: new Date().toTimeString().slice(0, 5),
                            })
                          }
                          className={`px-4 py-3 flex items-center justify-center gap-2 tracking-wider font-medium transition border-2 ${
                            punchForm.punchType === 'CHECK_IN'
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                          }`}
                        >
                          <LogIn className="w-5 h-5" />
                          Quick Check In
                        </button>
                        {punchForm.branch !== 'PQ' && (
                          <button
                            type="button"
                            onClick={() =>
                              setPunchForm({
                                ...punchForm,
                                punchType: 'CHECK_OUT',
                                punchDate: new Date().toISOString().split('T')[0],
                                punchTime: new Date().toTimeString().slice(0, 5),
                              })
                            }
                            className={`px-4 py-3 flex items-center justify-center gap-2 tracking-wider font-medium transition border-2 ${
                              punchForm.punchType === 'CHECK_OUT'
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50'
                            }`}
                          >
                            <LogOut className="w-5 h-5" />
                            Quick Check Out
                          </button>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting || !punchForm.punchType}
                        className="w-full mt-4 px-6 py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        {submitting ? 'Saving...' : 'Save Attendance Record'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Recent Attendance */}
                {selectedEmployee && (
                  <div className="bg-white shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-md font-bold text-gray-800 tracking-wider flex items-center gap-2">
                        <History className="w-5 h-5 text-[#0071BD]" />
                        Recent Attendance
                        <span className="text-xs font-normal text-gray-500 ml-auto">
                          Last 10 records
                        </span>
                      </h3>
                    </div>

                    <div className="p-4">
                      {loadingAttendance ? (
                        <div className="text-center py-6">
                          <RefreshCw className="w-5 h-5 animate-spin text-[#0071BD] mx-auto mb-2" />
                          <p className="text-sm text-gray-500 tracking-wide">
                            Loading...
                          </p>
                        </div>
                      ) : recentAttendance.length === 0 ? (
                        <div className="text-center py-6">
                          <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-400 tracking-wide">
                            No attendance records found
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {recentAttendance.map((rec) => (
                            <div
                              key={rec.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100"
                            >
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  rec.punch_type === 'CHECK_IN'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                {rec.punch_type === 'CHECK_IN' ? (
                                  <LogIn className="w-4 h-4" />
                                ) : (
                                  <LogOut className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium tracking-wide ${
                                    rec.punch_type === 'CHECK_IN'
                                      ? 'text-green-700'
                                      : 'text-orange-700'
                                  }`}
                                >
                                  {rec.punch_type === 'CHECK_IN'
                                    ? 'Check In'
                                    : 'Check Out'}
                                </p>
                                <p className="text-xs text-gray-500 tracking-wide">
                                  {formatDateTime(rec.timestamp)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-400 tracking-wide">
                                  {rec.branch_code || '-'}
                                </p>
                                <p className="text-xs text-gray-400 tracking-wide">
                                  {rec.device_id || '-'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    </>
  )
}