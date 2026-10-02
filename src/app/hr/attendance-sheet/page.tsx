// app/hr/attendance-sheet/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Footer from '@/components/footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import NavbarDropdown from '@/components/navbar'
import { createClient } from '@supabase/supabase-js'
import {
  Loader, Download, Database, User, Building, Calendar,
  AlertCircle, CheckCircle2, Filter, X, RefreshCw
} from 'lucide-react'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// =====================================================
// Types
// =====================================================
interface AttendanceRow {
  id: number
  user_id: string
  name: string
  department: string | null
  designation: string | null
  month: string
  total_month_days: number
  total_present: number
  total_absent: number
  approved_leaves: number
  late_hours: number
  overtime_hours: number
  company: string
  shift: string | null
  created_at: string
  updated_at: string
}

// =====================================================
// Helpers
// =====================================================
const round2 = (n: number) => {
  if (!Number.isFinite(n)) return 0
  return Math.round((n + Number.EPSILON) * 100) / 100
}

const fmt = (n: number) => round2(n ?? 0).toFixed(2)

const buildMonthKey = (month: string, year: string) => {
  if (!month || !year) return ''
  return `${year}-${String(month).padStart(2, '0')}`
}

const monthLabel = (monthKey: string) => {
  if (!monthKey) return '-'
  const [y, m] = monthKey.split('-').map(Number)
  if (!y || !m) return monthKey
  return new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const YEAR_OPTIONS = ['2022', '2023', '2024', '2025', '2026', '2027']

// =====================================================
// Page
// =====================================================
export default function AttendanceSheetPage() {
  const [bulkMonth, setBulkMonth] = useState<string>('')
  const [bulkYear, setBulkYear] = useState<string>('')
  const [bulkDepartment, setBulkDepartment] = useState<string>('')
  const [bulkCompany, setBulkCompany] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [departments, setDepartments] = useState<string[]>([])
  const [companies, setCompanies] = useState<string[]>([])

  const [rows, setRows] = useState<AttendanceRow[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // =====================================================
  // Init defaults (current month/year)
  // =====================================================
  useEffect(() => {
    const now = new Date()
    setBulkMonth(String(now.getMonth() + 1))
    setBulkYear(String(now.getFullYear()))
  }, [])

  // =====================================================
  // Load filter dropdown values
  // =====================================================
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('attendance_sheet')
          .select('department, company')

        if (data) {
          const depts = [...new Set(data.map(d => d.department).filter(Boolean))] as string[]
          const comps = [...new Set(data.map(d => d.company).filter(Boolean))] as string[]
          setDepartments(depts.sort())
          setCompanies(comps.sort())
        }
      } catch (err) {
        console.error('Filter load error:', err)
      }
    }
    load()
  }, [])

  // =====================================================
  // Fetch sheet data (callable)
  // =====================================================
  const fetchSheet = useCallback(async () => {
    if (!bulkMonth || !bulkYear) return

    setLoading(true)
    setMessage(null)

    try {
      const monthKey = buildMonthKey(bulkMonth, bulkYear)

      let query = supabase
        .from('attendance_sheet')
        .select('*')
        .eq('month', monthKey)
        .order('user_id', { ascending: true })

      if (bulkDepartment) query = query.eq('department', bulkDepartment)
      if (bulkCompany) query = query.eq('company', bulkCompany)

      const { data, error } = await query
      if (error) throw new Error(error.message)

      if (!data || data.length === 0) {
        setRows([])
        setMessage(`❌ No records found for ${monthLabel(monthKey)}`)
        return
      }

      setRows(data as AttendanceRow[])
      setMessage(`✅ Loaded ${data.length} records for ${monthLabel(monthKey)}`)
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Failed to load attendance sheet'}`)
    } finally {
      setLoading(false)
    }
  }, [bulkMonth, bulkYear, bulkDepartment, bulkCompany])

  // =====================================================
  // AUTO-FETCH: runs whenever filters change (after init)
  // =====================================================
  useEffect(() => {
    if (!bulkMonth || !bulkYear) return

    if (!initialized) {
      setInitialized(true)
      return
    }

    const timer = setTimeout(() => {
      fetchSheet()
    }, 250)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkMonth, bulkYear, bulkDepartment, bulkCompany, initialized])

  // Initial auto-fetch once month/year are set for the first time
  useEffect(() => {
    if (initialized && bulkMonth && bulkYear) {
      fetchSheet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized])

  // =====================================================
  // Filtered view (search)
  // =====================================================
  const filteredRows = rows.filter(r => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      r.user_id.toLowerCase().includes(q) ||
      (r.name || '').toLowerCase().includes(q) ||
      (r.department || '').toLowerCase().includes(q) ||
      (r.designation || '').toLowerCase().includes(q) ||
      (r.company || '').toLowerCase().includes(q)
    )
  })

  // =====================================================
  // Summary stats
  // =====================================================
  const totalPresent = round2(filteredRows.reduce((s, r) => s + (Number(r.total_present) || 0), 0))
  const totalAbsent = round2(filteredRows.reduce((s, r) => s + (Number(r.total_absent) || 0), 0))
  const totalLeaves = round2(filteredRows.reduce((s, r) => s + (Number(r.approved_leaves) || 0), 0))
  const totalLate = round2(filteredRows.reduce((s, r) => s + (Number(r.late_hours) || 0), 0))
  const totalOT = round2(filteredRows.reduce((s, r) => s + (Number(r.overtime_hours) || 0), 0))

  // =====================================================
  // Export CSV
  // =====================================================
  const handleExportCSV = () => {
    if (filteredRows.length === 0) return

    const headers = [
      'Emp ID', 'Name', 'Department', 'Designation', 'Company', 'Shift',
      'Month', 'Month Days', 'Present', 'Absent', 'Approved Leaves',
      'Late Hours', 'Overtime Hours'
    ]

    const csvRows = filteredRows.map(r => [
      r.user_id,
      r.name,
      r.department || '',
      r.designation || '',
      r.company,
      r.shift || '',
      r.month,
      r.total_month_days,
      r.total_present,
      r.total_absent,
      r.approved_leaves,
      r.late_hours,
      r.overtime_hours
    ])

    const escape = (v: any) => {
      const s = String(v ?? '')
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }

    const csv = [headers, ...csvRows].map(row => row.map(escape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_sheet_${bulkMonth}_${bulkYear}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <>
      <ProtectedRoute allowedUser='hr'>
        <NavbarDropdown />
        <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
          <div className="max-w-7xl mx-auto">

            {/* ============= HEADER ============= */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#0071BD] tracking-wider">
                    Attendance Sheet
                  </h1>
                  <p className="text-sm text-gray-500 tracking-wide mt-1">
                    Auto-loads records for the selected month • change filters to reload
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={fetchSheet}
                    disabled={loading || !bulkMonth || !bulkYear}
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Manual refresh"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {loading ? 'Loading...' : 'Refresh'}
                  </button>

                  {filteredRows.length > 0 && (
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 tracking-wider"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ============= MESSAGES ============= */}
            {message && (
              <div className={`mb-6 p-4 flex items-start gap-3 border rounded ${
                message.startsWith('✅') ? 'bg-green-50 border-green-200' :
                'bg-red-50 border-red-200'
              }`}>
                {message.startsWith('✅')
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  : <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                <div className="flex-1">
                  <p className={`text-sm tracking-wide ${
                    message.startsWith('✅') ? 'text-green-700' : 'text-red-700'
                  }`}>{message}</p>
                </div>
                <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ============= FILTERS ============= */}
            <div className="bg-white shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#0071BD]" />
                  <span className="text-sm font-medium text-gray-700 tracking-wide">Filters</span>
                </div>
                {loading && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Loader className="w-3 h-3 animate-spin" />
                    Loading...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Month</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={bulkMonth}
                      onChange={(e) => setBulkMonth(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                    >
                      <option value="">-- Month --</option>
                      {MONTHS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Year</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={bulkYear}
                      onChange={(e) => setBulkYear(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                    >
                      <option value="">-- Year --</option>
                      {YEAR_OPTIONS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Department</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={bulkDepartment}
                      onChange={(e) => setBulkDepartment(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                    >
                      <option value="">All Departments</option>
                      {departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Company</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={bulkCompany}
                      onChange={(e) => setBulkCompany(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                    >
                      <option value="">All Companies</option>
                      {companies.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {rows.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">
                    Search (ID, Name, Department, Designation, Company)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type to filter..."
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ============= STATS ============= */}
            {filteredRows.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                <div className="bg-white shadow-sm p-3 border-l-4 border-[#0071BD]">
                  <div className="text-xs text-gray-500 tracking-wide">Total Records</div>
                  <div className="text-xl font-bold text-[#0071BD] tracking-wider">{filteredRows.length}</div>
                </div>
                <div className="bg-white shadow-sm p-3 border-l-4 border-green-500">
                  <div className="text-xs text-gray-500 tracking-wide">Total Present</div>
                  <div className="text-xl font-bold text-green-700 tracking-wider">{fmt(totalPresent)}</div>
                </div>
                <div className="bg-white shadow-sm p-3 border-l-4 border-red-500">
                  <div className="text-xs text-gray-500 tracking-wide">Total Absent</div>
                  <div className="text-xl font-bold text-red-700 tracking-wider">{fmt(totalAbsent)}</div>
                </div>
                <div className="bg-white shadow-sm p-3 border-l-4 border-yellow-500">
                  <div className="text-xs text-gray-500 tracking-wide">Approved Leaves</div>
                  <div className="text-xl font-bold text-yellow-700 tracking-wider">{fmt(totalLeaves)}</div>
                </div>
                <div className="bg-white shadow-sm p-3 border-l-4 border-orange-500">
                  <div className="text-xs text-gray-500 tracking-wide">Late Hours</div>
                  <div className="text-xl font-bold text-orange-700 tracking-wider">{fmt(totalLate)}</div>
                </div>
                <div className="bg-white shadow-sm p-3 border-l-4 border-purple-500">
                  <div className="text-xs text-gray-500 tracking-wide">Overtime Hours</div>
                  <div className="text-xl font-bold text-purple-700 tracking-wider">{fmt(totalOT)}</div>
                </div>
              </div>
            )}

            {/* ============= TABLE ============= */}
            {loading && rows.length === 0 ? (
              <div className="bg-white shadow-sm p-12 text-center">
                <Loader className="w-10 h-10 animate-spin text-[#0071BD] mx-auto mb-3" />
                <p className="text-gray-500 tracking-wide">Loading attendance sheet...</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="bg-white shadow-sm p-8 text-center">
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 tracking-wide">
                  No records found for <span className="font-semibold text-[#0071BD]">{monthLabel(buildMonthKey(bulkMonth, bulkYear)) || '—'}</span>
                </p>
                <p className="text-xs text-gray-400 tracking-wide mt-2">
                  Try changing Month/Year or clearing Department/Company filters
                </p>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="bg-white shadow-sm p-8 text-center">
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 tracking-wide">No records match your search</p>
              </div>
            ) : (
              <div className="bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">#</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Emp ID</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Designation</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Company</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Shift</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Month</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">M.Days</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Present</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Absent</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Appr. Leaves</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Late Hrs</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">OT Hrs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredRows.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-gray-50 transition">
                          <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">{idx + 1}</td>
                          <td className="px-3 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{row.user_id}</td>
                          <td className="px-3 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{row.name}</td>
                          <td className="px-3 py-3 text-sm text-gray-600 whitespace-nowrap">{row.department || '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-600 whitespace-nowrap">{row.designation || '-'}</td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {row.company ? (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded tracking-wide">
                                {row.company}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {row.shift ? (
                              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded tracking-wide">
                                {row.shift}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600 whitespace-nowrap">{monthLabel(row.month)}</td>
                          <td className="px-3 py-3 text-sm text-center text-gray-800 whitespace-nowrap">{row.total_month_days}</td>
                          <td className="px-3 py-3 text-sm text-right whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded tracking-wide">
                              {fmt(row.total_present)}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-right whitespace-nowrap">
                            <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded tracking-wide">
                              {fmt(row.total_absent)}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.approved_leaves)}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.late_hours)}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.overtime_hours)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-500 tracking-wide">
                    Showing {filteredRows.length} of {rows.length} records
                  </div>
                  <div className="text-sm font-bold text-[#0071BD] tracking-wide">
                    {monthLabel(buildMonthKey(bulkMonth, bulkYear))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    </>
  )
}