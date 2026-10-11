// src/app/hr/dashboard/page.tsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import NavbarDropdown from '@/components/navbar'
import Footer from '@/components/footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { createClient } from '@supabase/supabase-js'
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Building,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  Loader,
  UserMinus,
  Clock as ClockIcon,
  FileSpreadsheet,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarRadiusAxis,
  Label
} from 'recharts'

import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

// ============================================================
// SUPABASE CLIENT
// ============================================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ============================================================
// TYPES
// ============================================================

interface Employee {
  id: string
  employee_id: string
  full_name: string
  department: string | null
  position: string | null
  source: 'K' | 'PQ' | null
  shift: string | null
  shift_timing: string | null
  joining_date: string | null
  check_in?: Array<{ time: string; location: string }>
  check_out?: Array<{ time: string; location: string }>
  leaves?: Array<{
    fromDate: string
    toDate: string
    status: string
    leaveType: string
    appliedOn?: string
  }>
}

interface AttendanceLog {
  id: number
  user_id: string
  employee_name: string | null
  timestamp: string
  punch_type: 'CHECK_IN' | 'CHECK_OUT' | null
  device_id: string | null
  branch_code: string | null
  source: 'K' | 'PQ'
}

interface Stats {
  totalEmployees: number
  presentToday: number
  absentToday: number
  onLeave: number
  pendingLeaves: number
  approvedLeaves: number
  rejectedLeaves: number
  departments: string[]
  departmentCount: { [key: string]: number }
  attendanceRate: number
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

// ✅ Check if a date (YYYY-MM-DD) is in the current month
const isInCurrentMonth = (dateStr: string): boolean => {
  if (!dateStr) return false
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return false
    const now = new Date()
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    )
  } catch {
    return false
  }
}

// ✅ Check if a date range [fromDate, toDate] overlaps current month
const overlapsCurrentMonth = (fromDate: string, toDate: string): boolean => {
  if (!fromDate || !toDate) return false
  try {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return false

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return from <= monthEnd && to >= monthStart
  } catch {
    return false
  }
}

// ============================================================
// PAGE
// ============================================================

export default function HRDashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([])
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onLeave: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    departments: [],
    departmentCount: {},
    attendanceRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ============================================================
  // FETCH DATA
  // ============================================================

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Fetch employees
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .order('full_name', { ascending: true })

      if (employeeError) throw new Error(employeeError.message)

      if (!employeeData || employeeData.length === 0) {
        setEmployees([])
        setAttendanceLogs([])
        setStats({
          totalEmployees: 0,
          presentToday: 0,
          absentToday: 0,
          onLeave: 0,
          pendingLeaves: 0,
          approvedLeaves: 0,
          rejectedLeaves: 0,
          departments: [],
          departmentCount: {},
          attendanceRate: 0
        })
        setLoading(false)
        return
      }

      // 2. Build employee ID set
      const employeeIdSet = new Set<string>(
        employeeData
          .map((e: any) => String(e.employee_id ?? '').trim())
          .filter(Boolean)
      )
      const employeeIdsArray = Array.from(employeeIdSet)

      // 3. Paginated fetch
      const PAGE_SIZE = 1000

      const fetchAllRows = async (
        tableName: 'attendance_logs' | 'pq_attendance_logs',
        applyEmployeeFilter: boolean
      ): Promise<any[]> => {
        let all: any[] = []
        let from = 0
        const MAX_PAGES = 200

        for (let page = 0; page < MAX_PAGES; page++) {
          let query = supabase
            .from(tableName)
            .select('*')
            .order('timestamp', { ascending: true })
            .range(from, from + PAGE_SIZE - 1)

          if (applyEmployeeFilter) {
            query = query.in('user_id', employeeIdsArray)
          }

          const { data, error } = await query
          if (error) throw new Error(`${tableName}: ${error.message}`)
          if (!data || data.length === 0) break

          all = all.concat(data)
          if (data.length < PAGE_SIZE) break
          from += PAGE_SIZE
        }
        return all
      }

      // 4. Fetch K + PQ in parallel
      const [mainLogsData, pqLogsData] = await Promise.all([
        fetchAllRows('attendance_logs', true),
        fetchAllRows('pq_attendance_logs', false)
      ])

      // 5. Build all logs
      const allLogs: AttendanceLog[] = []

      mainLogsData.forEach((log: any) => {
        const uid = String(log.user_id ?? '').trim()
        if (!employeeIdSet.has(uid)) return
        allLogs.push({
          id: Number(log.id),
          user_id: uid,
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
          source: 'K'
        })
      })

      pqLogsData.forEach((log: any) => {
        const uid = String(log.user_id ?? '').trim()
        if (!employeeIdSet.has(uid)) return
        allLogs.push({
          id: Number(log.id),
          user_id: uid,
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
          source: 'PQ'
        })
      })

      allLogs.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )

      // 6. Attach source to each employee
      const employeesWithSource: Employee[] = employeeData.map((emp: any) => {
        const empId = String(emp.employee_id ?? '').trim()
        const hasPQLogs = allLogs.some(l => l.user_id === empId && l.source === 'PQ')
        const hasMainLogs = allLogs.some(l => l.user_id === empId && l.source === 'K')

        let source: 'K' | 'PQ' = 'K'
        if (hasPQLogs) source = 'PQ'
        else if (hasMainLogs) source = 'K'
        else if (emp.source === 'PQ') source = 'PQ'
        else if (emp.source === 'K') source = 'K'

        return {
          id: emp.id,
          employee_id: empId,
          full_name: emp.full_name || '',
          department: emp.department || null,
          position: emp.position || null,
          source,
          shift: emp.shift || null,
          shift_timing: emp.shift_timing || null,
          joining_date: emp.joining_date || null,
          check_in: emp.check_in || [],
          check_out: emp.check_out || [],
          leaves: emp.leaves || []
        }
      })

      // 7. Calculate stats
      const today = toLocalDateStr(new Date().toISOString())

      let presentToday = 0
      let absentToday = 0
      let onLeave = 0

      employeesWithSource.forEach(emp => {
        const onLeaveToday = (emp.leaves || []).some((l: any) => {
          if (!l || l.status !== 'approved') return false
          return l.fromDate <= today && l.toDate >= today
        })

        if (onLeaveToday) {
          onLeave++
          return
        }

        const hasCheckIn = allLogs.some(log => {
          if (log.user_id !== emp.employee_id) return false
          return toLocalDateStr(log.timestamp) === today
        })

        if (hasCheckIn) presentToday++
        else absentToday++
      })

      // ✅ Leave stats — ONLY CURRENT MONTH
      let pendingLeaves = 0
      let approvedLeaves = 0
      let rejectedLeaves = 0

      employeesWithSource.forEach(emp => {
        (emp.leaves || []).forEach((l: any) => {
          // ✅ Only count leaves that overlap the current month
          if (!overlapsCurrentMonth(l.fromDate, l.toDate)) return

          if (l.status === 'pending') pendingLeaves++
          else if (l.status === 'approved') approvedLeaves++
          else if (l.status === 'rejected') rejectedLeaves++
        })
      })

      // Department count
      const deptMap: { [key: string]: number } = {}
      employeesWithSource.forEach(emp => {
        const dept = emp.department || 'Unknown'
        deptMap[dept] = (deptMap[dept] || 0) + 1
      })

      const departments = Object.keys(deptMap)
      const totalEmployees = employeesWithSource.length
      const attendanceRate = totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0

      setStats({
        totalEmployees,
        presentToday,
        absentToday,
        onLeave,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        departments,
        departmentCount: deptMap,
        attendanceRate
      })

      setEmployees(employeesWithSource)
      setAttendanceLogs(allLogs)
      setLoading(false)
    } catch (err: any) {
      console.error('Dashboard fetch error:', err)
      setError(err?.message || 'Failed to load dashboard data')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // ============================================================
  // CHART DATA
  // ============================================================

  const getDepartmentData = useCallback(() => {
    const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#6B7280']
    return Object.entries(stats.departmentCount).map(([name, value], index) => ({
      department: name,
      employees: value,
      fill: colors[index % colors.length]
    }))
  }, [stats.departmentCount])

  // Monthly attendance
  const getMonthlyAttendanceData = useCallback(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()
    const monthlyData = []

    for (let i = 0; i < 6; i++) {
      const monthIndex = new Date().getMonth() - i
      const year = monthIndex >= 0 ? currentYear : currentYear - 1
      const adjustedMonth = monthIndex >= 0 ? monthIndex : monthIndex + 12

      let present = 0

      attendanceLogs.forEach(log => {
        const checkDate = new Date(log.timestamp)
        if (checkDate.getMonth() === adjustedMonth && checkDate.getFullYear() === year) {
          present++
        }
      })

      monthlyData.push({
        month: months[adjustedMonth],
        present,
        total: employees.length || 1,
        absent: Math.max(0, (employees.length || 1) - present)
      })
    }

    return monthlyData.reverse()
  }, [employees, attendanceLogs])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${roboto.className} bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 text-xs tracking-wide`}>
          <p className="font-medium text-gray-800 tracking-wide">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-gray-600 tracking-wide" style={{ color: item.color }}>
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // ============================================================
  // LOADING / ERROR
  // ============================================================

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto mb-4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
        <div className="text-center bg-white shadow-sm p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wider">Error</h3>
          <p className="text-gray-600 mb-4 tracking-wide">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition tracking-wider"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const monthlyData = getMonthlyAttendanceData()
  const departmentData = getDepartmentData()

  const pendingData = [{ name: 'Pending', value: stats.pendingLeaves || 0, fill: '#F59E0B' }]
  const approvedData = [{ name: 'Approved', value: stats.approvedLeaves || 0, fill: '#10B981' }]
  const rejectedData = [{ name: 'Rejected', value: stats.rejectedLeaves || 0, fill: '#EF4444' }]

  const LeaveRadialChart = ({ data, title, color, valueColor }: { data: any[], title: string, color: string, valueColor: string }) => {
    const value = data[0]?.value || 0

    return (
      <div className="flex-1">
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={data}
              endAngle={100}
              innerRadius={30}
              outerRadius={44}
              barSize={8}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="#e5e7eb"
                polarRadius={[36, 30]}
              />
              <RadialBar dataKey="value" background cornerRadius={3} fill={color} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={`${roboto.className}`}
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className={`${valueColor} text-base font-bold tracking-wide`}
                          >
                            {value}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 14}
                            className="fill-gray-500 text-[6px] tracking-wide"
                          >
                            {title}
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  // ✅ Current month name for display
  const currentMonthName = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <>
      <ProtectedRoute allowedUser='hr'>
        <NavbarDropdown />
        <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-3xl font-bold text-[#0071BD] tracking-wider">
                      HR Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 tracking-wide mt-1">
                      Overview of employee attendance and leave management
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-center flex-wrap">
                  <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center gap-2 tracking-wider"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <button
                    onClick={() => window.location.href = '/hr/get-sheet'}
                    className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center gap-2 tracking-wider"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Get Sheet
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div className="bg-white shadow-sm p-4">
                <div className="text-sm text-[#0071BD] tracking-wide">Total Employees</div>
                <div className="text-2xl font-bold text-[#0071BD] tracking-wider">{stats.totalEmployees}</div>
              </div>

              <div className="bg-white shadow-sm p-4">
                <div className="text-sm text-green-600 tracking-wide flex items-center gap-1">
                  <UserCheck className="w-4 h-4" /> Present
                </div>
                <div className="text-2xl font-bold text-green-700 tracking-wider">{stats.presentToday}</div>
              </div>

              <div className="bg-white shadow-sm p-4">
                <div className="text-sm text-red-600 tracking-wide flex items-center gap-1">
                  <UserX className="w-4 h-4" /> Absent
                </div>
                <div className="text-2xl font-bold text-red-700 tracking-wider">{stats.absentToday}</div>
              </div>

              <div className="bg-white shadow-sm p-4">
                <div className="text-sm text-yellow-600 tracking-wide flex items-center gap-1">
                  <UserMinus className="w-4 h-4" /> On Leave
                </div>
                <div className="text-2xl font-bold text-yellow-700 tracking-wider">{stats.onLeave}</div>
              </div>

              <div className="bg-white shadow-sm p-4">
                <div className="text-sm text-orange-600 tracking-wide flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" /> Pending
                </div>
                <div className="text-2xl font-bold text-orange-700 tracking-wider">{stats.pendingLeaves}</div>
              </div>

              <div className="bg-white shadow-sm p-4">
                <div className="text-sm text-blue-600 tracking-wide flex items-center gap-1">
                  <Building className="w-4 h-4" /> Depts
                </div>
                <div className="text-2xl font-bold text-blue-700 tracking-wider">{stats.departments.length}</div>
              </div>

              <div className="bg-white shadow-sm p-4">
                <div className="text-sm text-indigo-600 tracking-wide flex items-center gap-1">
                  {stats.attendanceRate > 70 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  Rate
                </div>
                <div className={`text-2xl font-bold tracking-wider ${
                  stats.attendanceRate > 70 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {stats.attendanceRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Department Distribution */}
              <div className="bg-white shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 tracking-wide">Department Distribution</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      data={departmentData}
                      innerRadius={18}
                      outerRadius={80}
                      startAngle={180}
                      endAngle={0}
                    >
                      <PolarGrid gridType="circle" stroke="#e5e7eb" />
                      <RadialBar
                        dataKey="employees"
                        cornerRadius={4}
                        label={{
                          position: 'insideStart',
                          fill: '#fff',
                          fontSize: 9,
                          fontWeight: 500,
                          fontFamily: 'Roboto, sans-serif',
                          letterSpacing: '0.05em'
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[10px]">
                  {departmentData.map((item, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 tracking-wide text-gray-700"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      ></span>
                      {item.department}: {item.employees}
                    </span>
                  ))}
                </div>
              </div>

              {/* Monthly Attendance Bar Chart */}
              <div className="bg-white shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800 tracking-wide">Monthly Attendance</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-700">
                    <span className="flex items-center gap-1 tracking-wide">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded"></span>
                      Present
                    </span>
                    <span className="flex items-center gap-1 tracking-wide">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded"></span>
                      Absent
                    </span>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barGap={3}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={4}
                        axisLine={false}
                        fontSize={9}
                        tick={{ className: `text-[9px] ${roboto.className} tracking-wide` }}
                      />
                      <YAxis
                        fontSize={9}
                        axisLine={false}
                        tickLine={false}
                        tick={{ className: `text-[9px] ${roboto.className} tracking-wide` }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="present" fill="#10B981" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="absent" fill="#EF4444" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-700 tracking-wide">
                  <span>Last 6 months</span>
                  <span className="flex items-center gap-1 text-green-600 tracking-wide">
                    <TrendingUp className="w-3 h-3" />
                    {monthlyData.length > 0 && monthlyData[monthlyData.length - 1].present > 0
                      ? `${((monthlyData[monthlyData.length - 1].present / (stats.totalEmployees || 1)) * 100).toFixed(1)}% this month`
                      : 'No data'}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ Leave Status Distribution — Current Month */}
            <div className="bg-white shadow-sm p-2 mb-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-semibold text-gray-800 tracking-wide">
                  Leave Status Distribution
                </h3>
                <span className="text-[9px] font-medium text-[#0071BD] bg-blue-50 px-2 py-0.5 rounded-full tracking-wide uppercase">
                  {currentMonthName}
                </span>
              </div>
              <div className="flex">
                <div className="flex-1">
                  <LeaveRadialChart data={pendingData} title="Pending" color="#F59E0B" valueColor="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <LeaveRadialChart data={approvedData} title="Approved" color="#10B981" valueColor="text-green-600" />
                </div>
                <div className="flex-1">
                  <LeaveRadialChart data={rejectedData} title="Rejected" color="#EF4444" valueColor="text-red-600" />
                </div>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center justify-center gap-2 text-[9px] text-gray-700">
                <span className="flex items-center gap-1 tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                  Pending: {stats.pendingLeaves}
                </span>
                <span className="flex items-center gap-1 tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Approved: {stats.approvedLeaves}
                </span>
                <span className="flex items-center gap-1 tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Rejected: {stats.rejectedLeaves}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    </>
  )
}