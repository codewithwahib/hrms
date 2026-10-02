// // app/hr/get-sheet/page.tsx
// 'use client'

// import { useState, useEffect, useCallback, useRef } from 'react'
// import Footer from '@/components/footer'
// import ProtectedRoute from '@/components/ProtectedRoute'
// import { createClient } from '@supabase/supabase-js'
// import NavbarDropdown from '@/components/navbar'
// import {
//   RefreshCw,
//   Calendar,
//   Users,
//   Building,
//   Filter,
//   ChevronDown,
//   ChevronUp,
//   User,
//   Loader,
//   UserCheck,
//   UserX,
//   UserMinus,
//   UserPlus,
//   Printer,
//   MapPin,
//   AlertCircle,
//   Palette,
//   FileText,
//   LogIn,
//   LogOut,
//   Clock,
//   Download,
//   FileSpreadsheet,
//   Calculator,
//   CheckCircle2
// } from 'lucide-react'

// import { Roboto } from 'next/font/google'

// const roboto = Roboto({
//   weight: ['100', '300', '400', '500', '700', '900'],
//   style: ['normal', 'italic'],
//   subsets: ['latin'],
//   display: 'swap',
// })

// interface Employee {
//   id: string
//   employee_id: string
//   full_name: string
//   department: string
//   position: string
//   father_name?: string
//   cnic_number?: string
//   phone_number?: string
//   emergency_contact?: string
//   date_of_birth?: string
//   marital_status?: string
//   residential_address?: string
//   joining_date?: string
//   source?: 'K' | 'PQ'
//   enable_attendance?: boolean
//   shift?: 'A' | 'B' | null
//   shift_timing?: string | null
//   check_in?: Array<{ time: string; location: string }>
//   check_out?: Array<{ time: string; location: string }>
//   qualifications?: Array<{
//     degree: string
//     institution: string
//     year: string
//     grade: string
//   }>
//   experience?: Array<{
//     company: string
//     position: string
//     fromDate: string
//     toDate: string
//     description: string
//   }>
//   leaves?: Array<{
//     fromDate: string
//     toDate: string
//     status: string
//     leaveType: string
//     reason?: string
//     totalDays?: number
//   }>
// }

// interface AttendanceLog {
//   id: number
//   user_id: string
//   employee_name: string
//   timestamp: string
//   punch_type: 'CHECK_IN' | 'CHECK_OUT' | null
//   device_id: string
//   branch_code: string
//   raw_log_key: string
//   created_at: string
//   source?: 'K' | 'PQ'
// }

// interface AttendanceRecord {
//   employeeId: string
//   name: string
//   fatherName: string
//   cnic: string
//   phoneNumber: string
//   emergencyContact: string
//   dob: string
//   maritalStatus: string
//   address: string
//   department: string
//   designation: string
//   joiningDate: string
//   date: string
//   day: string
//   checkIn: string
//   checkOut: string
//   checkInTime: string
//   checkOutTime: string
//   totalHours: string
//   checkInLocation: string
//   checkOutLocation: string
//   status: 'Present' | 'Absent' | 'Leave' | 'Half Day' | 'Off'
//   leaveType?: string
//   leaveReason?: string
//   qualifications: string
//   experience: string
//   isOnLeave: boolean
//   hasCheckIn: boolean
//   hasCheckOut: boolean
//   outsideCheckIn: string
//   outsideCheckOut: string
//   outsideTotalHours: string
//   outsideCheckInTime: string
//   outsideCheckOutTime: string
//   branch: string
//   branchCode: 'K' | 'PQ'
//   totalHoursWithOS: string
//   shift?: string
//   shiftTiming?: string
// }

// interface MonthlySummary {
//   user_id: string
//   name: string
//   department: string | null
//   designation: string | null
//   shift: string | null
//   month: string
//   total_month_days: number
//   total_present: number
//   total_absent: number
//   approved_leaves: number
//   late_hours: number
//   overtime_hours: number
//   company: string
// }

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

// const getBranchDisplayName = (source: string | undefined) => {
//   if (source === 'PQ') return 'Port Qasim'
//   if (source === 'K') return 'Korangi'
//   return 'Korangi'
// }

// // ✅ Convert "HH:MM" (24h) → "hh:MM AM/PM" (12h)
// const to12HourFormat = (time24: string): string => {
//   if (!time24) return ''
//   const trimmed = time24.trim()
//   if (/AM|PM/i.test(trimmed)) return trimmed.toUpperCase()
//   const match = trimmed.match(/^(\d{1,2}):(\d{2})/)
//   if (!match) return trimmed
//   let hours = parseInt(match[1])
//   const minutes = match[2]
//   const ampm = hours >= 12 ? 'PM' : 'AM'
//   hours = hours % 12
//   if (hours === 0) hours = 12
//   return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
// }

// // ✅ shift_timing ko 12-hour format mein convert karo
// const getShiftDisplay = (shiftTiming: string | null | undefined, _shift?: string | null) => {
//   if (!shiftTiming || !String(shiftTiming).trim()) return '-'
//   const raw = String(shiftTiming).trim()
//   const parts = raw.split(/\s*-\s*/)
//   if (parts.length === 2) {
//     const start = to12HourFormat(parts[0])
//     const end = to12HourFormat(parts[1])
//     return `${start} - ${end}`
//   }
//   return to12HourFormat(raw)
// }

// // ✅ shift timing se total shift hours calculate karo
// const getShiftTotalHours = (shiftTiming: string | null | undefined): number => {
//   if (!shiftTiming) return 8
//   const raw = String(shiftTiming).trim()
//   const parts = raw.split(/\s*-\s*/)
//   if (parts.length !== 2) return 8

//   const parseTime = (t: string): number => {
//     const trimmed = t.trim().toUpperCase()
//     const ampmMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
//     if (ampmMatch) {
//       let h = parseInt(ampmMatch[1])
//       const m = parseInt(ampmMatch[2])
//       const ampm = ampmMatch[3]
//       if (ampm === 'PM' && h !== 12) h += 12
//       if (ampm === 'AM' && h === 12) h = 0
//       return h * 60 + m
//     }
//     const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/)
//     if (match24) {
//       return parseInt(match24[1]) * 60 + parseInt(match24[2])
//     }
//     return -1
//   }

//   const startMin = parseTime(parts[0])
//   const endMin = parseTime(parts[1])
//   if (startMin < 0 || endMin < 0) return 8

//   let diffMin = endMin - startMin
//   if (diffMin < 0) diffMin += 24 * 60

//   return diffMin / 60
// }

// // ✅ Convert ISO timestamp → local YYYY-MM-DD
// const toLocalDateStr = (isoTimestamp: string): string => {
//   if (!isoTimestamp) return ''
//   try {
//     const d = new Date(isoTimestamp)
//     if (isNaN(d.getTime())) return ''
//     const y = d.getFullYear()
//     const m = String(d.getMonth() + 1).padStart(2, '0')
//     const day = String(d.getDate()).padStart(2, '0')
//     return `${y}-${m}-${day}`
//   } catch {
//     return ''
//   }
// }

// export default function GetSheetPage() {
//   const [employees, setEmployees] = useState<Employee[]>([])
//   const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [fromDate, setFromDate] = useState('')
//   const [toDate, setToDate] = useState('')
//   const [selectedDepartment, setSelectedDepartment] = useState('all')
//   const [departments, setDepartments] = useState<string[]>([])
//   const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
//   const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([])
//   const [expandedFilters, setExpandedFilters] = useState(false)
//   const [selectedEmployee, setSelectedEmployee] = useState<string>('all')
//   const [employeeNames, setEmployeeNames] = useState<{ id: string, name: string, department: string, source: string }[]>([])
//   const [showPrintOptions, setShowPrintOptions] = useState(false)
//   const [dataSource, setDataSource] = useState<{ K: number; PQ: number }>({ K: 0, PQ: 0 })

//   const [showExportMenu, setShowExportMenu] = useState(false)
//   const [submittingPayroll, setSubmittingPayroll] = useState(false)
//   const [exportSuccess, setExportSuccess] = useState<string | null>(null)

//   const [selectedBranch, setSelectedBranch] = useState<string>('all')
//   const [branches, setBranches] = useState<string[]>(['K', 'PQ'])

//   const isMounted = useRef(true)
//   const exportMenuRef = useRef<HTMLDivElement | null>(null)

//   // =====================================================
//   // Helpers
//   // =====================================================

//   const getDayName = useCallback((dateStr: string) => {
//     const date = new Date(dateStr + 'T00:00:00')
//     return date.toLocaleDateString('en-US', { weekday: 'long' })
//   }, [])

//   const formatTime = useCallback((timestamp: string) => {
//     if (!timestamp) return '-'
//     try {
//       const date = new Date(timestamp)
//       return date.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: true
//       })
//     } catch {
//       return '-'
//     }
//   }, [])

//   const formatDate = useCallback((dateStr: string) => {
//     if (!dateStr) return '-'
//     try {
//       const date = new Date(dateStr + 'T00:00:00')
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       })
//     } catch {
//       return '-'
//     }
//   }, [])

//   const formatDateForDisplay = useCallback((dateStr: string) => {
//     if (!dateStr) return '-'
//     try {
//       const date = new Date(dateStr + 'T00:00:00')
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })
//     } catch {
//       return '-'
//     }
//   }, [])

//   const displayDateToISO = useCallback((displayDate: string): string => {
//     if (!displayDate || displayDate === '-') return ''
//     try {
//       const d = new Date(displayDate)
//       if (isNaN(d.getTime())) return ''
//       const y = d.getFullYear()
//       const m = String(d.getMonth() + 1).padStart(2, '0')
//       const day = String(d.getDate()).padStart(2, '0')
//       return `${y}-${m}-${day}`
//     } catch {
//       return ''
//     }
//   }, [])

//   const calculateTotalHours = useCallback((checkIn: string, checkOut: string) => {
//     if (!checkIn || !checkOut) return '-'
//     try {
//       const inTime = new Date(checkIn)
//       const outTime = new Date(checkOut)
//       const diffMs = outTime.getTime() - inTime.getTime()
//       if (diffMs < 0) return '-'
//       const totalSeconds = Math.floor(diffMs / 1000)
//       const hours = Math.floor(totalSeconds / 3600)
//       const minutes = Math.floor((totalSeconds % 3600) / 60)
//       const seconds = totalSeconds % 60
//       return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
//     } catch {
//       return '-'
//     }
//   }, [])

//   const calculateOutsideHours = useCallback((inTime: string, outTime: string) => {
//     if (!outTime || !inTime) return '-'
//     try {
//       const diffMs = new Date(outTime).getTime() - new Date(inTime).getTime()
//       if (diffMs < 0) return '-'
//       const s = Math.floor(diffMs / 1000)
//       return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
//     } catch { return '-' }
//   }, [])

//   const calculateTotalHoursWithOS = useCallback((hours: string, osHours: string) => {
//     if ((!hours || hours === '-') && (!osHours || osHours === '-')) return '-'
//     const parseHours = (h: string) => {
//       if (!h || h === '-') return 0
//       const parts = h.split(':')
//       return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2] || '0')
//     }
//     const totalSec = parseHours(hours) + parseHours(osHours)
//     return `${String(Math.floor(totalSec / 3600)).padStart(2, '0')}:${String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')}:${String(totalSec % 60).padStart(2, '0')}`
//   }, [])

//   const parseHoursToDecimal = useCallback((h: string): number => {
//     if (!h || h === '-') return 0
//     const parts = h.split(':')
//     const hours = parseInt(parts[0] || '0')
//     const minutes = parseInt(parts[1] || '0')
//     const seconds = parseInt(parts[2] || '0')
//     return hours + minutes / 60 + seconds / 3600
//   }, [])

//   const getQualificationsString = useCallback((qualifications: any[] = []) => {
//     if (!qualifications || qualifications.length === 0) return '-'
//     return qualifications.map(q => `${q.degree} (${q.institution}, ${q.year}) - ${q.grade}`).join('; ')
//   }, [])

//   const getExperienceString = useCallback((experience: any[] = []) => {
//     if (!experience || experience.length === 0) return '-'
//     return experience.map(exp => `${exp.position} at ${exp.company}`).join('; ')
//   }, [])

//   const parseCoordinates = useCallback((location: string): { lat: number; lng: number } | null => {
//     if (!location || location === '-') return null
//     const parts = location.split(',').map(s => s.trim())
//     if (parts.length !== 2) return null
//     const lat = parseFloat(parts[0])
//     const lng = parseFloat(parts[1])
//     if (isNaN(lat) || isNaN(lng)) return null
//     return { lat, lng }
//   }, [])

//   const openGoogleMaps = useCallback((location: string) => {
//     const coords = parseCoordinates(location)
//     if (!coords) {
//       window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank')
//       return
//     }
//     window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank')
//   }, [parseCoordinates])

//   const getEmployeeAttendance = useCallback((employee: Employee, date: string, logs: AttendanceLog[]): AttendanceRecord => {
//     const dateStr = date
//     const dayName = getDayName(dateStr)

//     if (dayName === 'Sunday') {
//       return {
//         employeeId: employee.employee_id || '',
//         name: employee.full_name || '',
//         fatherName: employee.father_name || '-',
//         cnic: employee.cnic_number || '-',
//         phoneNumber: employee.phone_number || '-',
//         emergencyContact: employee.emergency_contact || '-',
//         dob: formatDate(employee.date_of_birth || ''),
//         maritalStatus: employee.marital_status || '-',
//         address: employee.residential_address || '-',
//         department: employee.department || '',
//         designation: employee.position || '',
//         joiningDate: formatDate(employee.joining_date || ''),
//         date: formatDate(dateStr),
//         day: dayName,
//         checkIn: '-',
//         checkOut: '-',
//         checkInTime: '',
//         checkOutTime: '',
//         totalHours: '-',
//         checkInLocation: '-',
//         checkOutLocation: '-',
//         status: 'Off',
//         leaveType: '',
//         leaveReason: '',
//         qualifications: getQualificationsString(employee.qualifications),
//         experience: getExperienceString(employee.experience),
//         isOnLeave: false,
//         hasCheckIn: false,
//         hasCheckOut: false,
//         outsideCheckIn: '-',
//         outsideCheckOut: '-',
//         outsideTotalHours: '-',
//         outsideCheckInTime: '',
//         outsideCheckOutTime: '',
//         branch: getBranchDisplayName(employee.source),
//         branchCode: (employee.source || 'K') as 'K' | 'PQ',
//         totalHoursWithOS: '-',
//         shift: employee.shift || undefined,
//         shiftTiming: employee.shift_timing || undefined
//       }
//     }

//     const dayLogs = logs.filter(log => {
//       const logDate = toLocalDateStr(log.timestamp)
//       const logUserId = String(log.user_id).trim()
//       const empId = String(employee.employee_id).trim()
//       return logDate === dateStr && logUserId === empId
//     })

//     const sortedLogs = [...dayLogs].sort(
//       (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//     )

//     let checkInLog: AttendanceLog | null = null
//     let checkOutLog: AttendanceLog | null = null
//     let hasCheckIn = false
//     let hasCheckOut = false

//     if (sortedLogs.length === 1) {
//       const singleLog = sortedLogs[0]
//       const logHour = new Date(singleLog.timestamp).getHours()
//       if (logHour >= 18) {
//         checkOutLog = singleLog
//         hasCheckOut = true
//       } else {
//         checkInLog = singleLog
//         hasCheckIn = true
//       }
//     } else if (sortedLogs.length >= 2) {
//       checkInLog = sortedLogs[0]
//       hasCheckIn = true
//       const lastLog = sortedLogs[sortedLogs.length - 1]
//       const diffMs = new Date(lastLog.timestamp).getTime() - new Date(checkInLog.timestamp).getTime()
//       if (diffMs >= 3600000) {
//         checkOutLog = lastLog
//         hasCheckOut = true
//       }
//     }

//     const leave = employee.leaves?.find(
//       l => l.fromDate <= dateStr && l.toDate >= dateStr && l.status === 'approved'
//     )

//     let status: 'Present' | 'Absent' | 'Leave' | 'Half Day' | 'Off' = 'Absent'
//     let leaveType = ''
//     let leaveReason = ''
//     let isOnLeave = false

//     if (leave) {
//       status = 'Leave'
//       leaveType = leave.leaveType || ''
//       leaveReason = leave.reason || ''
//       isOnLeave = true
//     } else if (hasCheckIn) {
//       const checkInDate = new Date(checkInLog!.timestamp)
//       const checkInHour = checkInDate.getHours()
//       const checkInMinute = checkInDate.getMinutes()
//       const isAfterNoon = checkInHour > 12 || (checkInHour === 12 && checkInMinute > 0)
//       if (isAfterNoon) status = 'Half Day'
//       else status = 'Present'
//     }

//     let outsideCheckInTime = ''
//     let outsideCheckOutTime = ''

//     if (employee.check_in && employee.check_in.length > 0) {
//       const checkInJson = employee.check_in.find(c => toLocalDateStr(c.time) === dateStr)
//       if (checkInJson) outsideCheckInTime = checkInJson.time
//     }
//     if (employee.check_out && employee.check_out.length > 0) {
//       const checkOutJson = employee.check_out.find(c => toLocalDateStr(c.time) === dateStr)
//       if (checkOutJson) outsideCheckOutTime = checkOutJson.time
//     }

//     const outsideCheckIn = outsideCheckInTime ? formatTime(outsideCheckInTime) : '-'
//     const outsideCheckOut = outsideCheckOutTime ? formatTime(outsideCheckOutTime) : '-'
//     const outsideTotalHours = (outsideCheckInTime && outsideCheckOutTime)
//       ? calculateOutsideHours(outsideCheckInTime, outsideCheckOutTime) : '-'

//     const displayCheckIn = isOnLeave ? '-' : (checkInLog ? formatTime(checkInLog.timestamp) : '-')
//     const displayCheckOut = isOnLeave ? '-' : (checkOutLog ? formatTime(checkOutLog.timestamp) : '-')
//     const displayTotalHours = isOnLeave ? '-' : calculateTotalHours(checkInLog?.timestamp || '', checkOutLog?.timestamp || '')
//     const displayCheckInLocation = isOnLeave ? '-' : (checkInLog?.branch_code || '-')
//     const displayCheckOutLocation = isOnLeave ? '-' : (checkOutLog?.branch_code || '-')

//     const totalHoursWithOS = calculateTotalHoursWithOS(displayTotalHours, outsideTotalHours)

//     let source = employee.source || 'K'
//     if (!employee.source) {
//       source = (checkInLog?.source || checkOutLog?.source || 'K') as 'K' | 'PQ'
//     }

//     return {
//       employeeId: employee.employee_id || '',
//       name: employee.full_name || '',
//       fatherName: employee.father_name || '-',
//       cnic: employee.cnic_number || '-',
//       phoneNumber: employee.phone_number || '-',
//       emergencyContact: employee.emergency_contact || '-',
//       dob: formatDate(employee.date_of_birth || ''),
//       maritalStatus: employee.marital_status || '-',
//       address: employee.residential_address || '-',
//       department: employee.department || '',
//       designation: employee.position || '',
//       joiningDate: formatDate(employee.joining_date || ''),
//       date: formatDate(dateStr),
//       day: dayName,
//       checkIn: displayCheckIn,
//       checkOut: displayCheckOut,
//       checkInTime: checkInLog?.timestamp || '',
//       checkOutTime: checkOutLog?.timestamp || '',
//       totalHours: displayTotalHours,
//       checkInLocation: displayCheckInLocation,
//       checkOutLocation: displayCheckOutLocation,
//       status,
//       leaveType,
//       leaveReason,
//       qualifications: getQualificationsString(employee.qualifications),
//       experience: getExperienceString(employee.experience),
//       isOnLeave,
//       hasCheckIn,
//       hasCheckOut,
//       outsideCheckIn,
//       outsideCheckOut,
//       outsideTotalHours,
//       outsideCheckInTime,
//       outsideCheckOutTime,
//       branch: getBranchDisplayName(source),
//       branchCode: source as 'K' | 'PQ',
//       totalHoursWithOS,
//       shift: employee.shift || undefined,
//       shiftTiming: employee.shift_timing || undefined
//     }
//   }, [formatDate, getDayName, formatTime, calculateTotalHours, calculateOutsideHours, calculateTotalHoursWithOS, getQualificationsString, getExperienceString])

//   const getSelectedEmployeeName = useCallback(() => {
//     if (selectedEmployee === 'all') return 'All Employees'
//     const emp = employees.find(e => e.employee_id === selectedEmployee)
//     return emp?.full_name || 'Selected Employee'
//   }, [employees, selectedEmployee])

//   const getRowColor = useCallback((checkInTime: string, day: string, isOnLeave: boolean, status: string) => {
//     if (status === 'Off' || day === 'Sunday') return '#E5E7EB'
//     if (isOnLeave) return 'transparent'
//     if (!checkInTime || checkInTime === '-') return 'transparent'
//     try {
//       const timeStr = checkInTime.replace(/\s/g, '')
//       const isPM = timeStr.includes('PM')
//       let hours = parseInt(timeStr.split(':')[0])
//       const minutes = parseInt(timeStr.split(':')[1]?.replace(/[AP]M/g, ''))
//       if (isPM && hours !== 12) hours += 12
//       if (!isPM && hours === 12) hours = 0
//       const totalMinutes = hours * 60 + (minutes || 0)
//       if (totalMinutes < 600) return '#4A90D9'
//       if (totalMinutes >= 600 && totalMinutes < 630) return '#27AE60'
//       if (totalMinutes >= 630 && totalMinutes < 690) return '#F1C40F'
//       if (totalMinutes >= 690) return '#E74C3C'
//       return 'transparent'
//     } catch { return 'transparent' }
//   }, [])

//   // =====================================================
//   // fetchData — FINAL FIX
//   //   ✅ Pagination (1000-row Supabase limit handle)
//   //   ✅ K logs: .in() with employee IDs
//   //   ✅ PQ logs: NO .in() — fetch all, filter client-side
//   //   ✅ String-safe user_id comparison
//   // =====================================================

//   const fetchData = useCallback(async () => {
//     if (!isMounted.current) return
//     try {
//       setLoading(true)
//       setError(null)

//       // ---------------------------------------------------
//       // 1. Fetch employees
//       // ---------------------------------------------------
//       const { data: employeeData, error: employeeError } = await supabase
//         .from('employees')
//         .select('*')
//         .order('full_name', { ascending: true })

//       if (employeeError) throw new Error(employeeError.message)

//       if (!employeeData || employeeData.length === 0) {
//         setError('No employees found')
//         setEmployees([])
//         setDepartments([])
//         setEmployeeNames([])
//         setAttendanceLogs([])
//         setDataSource({ K: 0, PQ: 0 })
//         setLoading(false)
//         return
//       }

//       // ---------------------------------------------------
//       // 2. Build employee ID Set (string, trimmed)
//       // ---------------------------------------------------
//       const employeeIdSet = new Set<string>(
//         employeeData
//           .map((e: any) => String(e.employee_id ?? '').trim())
//           .filter(Boolean)
//       )

//       const employeeIdsArray = Array.from(employeeIdSet)

//       console.log('======================================')
//       console.log('👥 Employees:', employeeData.length)
//       console.log('🆔 Unique IDs:', employeeIdsArray.length)
//       console.log('🆔 Sample IDs:', employeeIdsArray.slice(0, 20))
//       console.log('======================================')

//       // ---------------------------------------------------
//       // 3. Paginated fetch helper
//       // ---------------------------------------------------
//       const PAGE_SIZE = 1000

//       const fetchAllRows = async (
//         tableName: 'attendance_logs' | 'pq_attendance_logs',
//         applyEmployeeFilter: boolean
//       ): Promise<any[]> => {
//         let all: any[] = []
//         let from = 0
//         const MAX_PAGES = 200

//         for (let page = 0; page < MAX_PAGES; page++) {
//           let query = supabase
//             .from(tableName)
//             .select('*')
//             .order('timestamp', { ascending: true })
//             .range(from, from + PAGE_SIZE - 1)

//           if (applyEmployeeFilter) {
//             query = query.in('user_id', employeeIdsArray)
//           }

//           const { data, error } = await query

//           if (error) {
//             throw new Error(`${tableName}: ${error.message}`)
//           }

//           if (!data || data.length === 0) break

//           all = all.concat(data)

//           console.log(
//             `📡 ${tableName}: +${data.length} rows (total ${all.length})`
//           )

//           if (data.length < PAGE_SIZE) break

//           from += PAGE_SIZE
//         }

//         return all
//       }

//       // ---------------------------------------------------
//       // 4. Fetch K + PQ in parallel
//       // ---------------------------------------------------
//       console.log('📡 Fetching K logs (filtered by employee IDs)...')
//       console.log('📡 Fetching ALL PQ logs (no .in() filter)...')

//       const [mainLogsData, pqLogsData] = await Promise.all([
//         fetchAllRows('attendance_logs', true),
//         fetchAllRows('pq_attendance_logs', false)
//       ])

//       console.log('✅ K fetched:', mainLogsData.length)
//       console.log('✅ PQ fetched:', pqLogsData.length)

//       // ---------------------------------------------------
//       // 5. Build allLogs
//       // ---------------------------------------------------
//       const allLogs: AttendanceLog[] = []

//       // 5a. K logs
//       mainLogsData.forEach((log: any) => {
//         const uid = String(log.user_id ?? '').trim()
//         if (!employeeIdSet.has(uid)) return

//         allLogs.push({
//           id: Number(log.id),
//           user_id: uid,
//           employee_name: String(log.employee_name ?? ''),
//           timestamp: log.timestamp,
//           punch_type:
//             log.punch_type === 'CHECK_OUT'
//               ? 'CHECK_OUT'
//               : log.punch_type === 'CHECK_IN'
//                 ? 'CHECK_IN'
//                 : null,
//           device_id: String(log.device_id ?? ''),
//           branch_code: String(log.branch_code ?? 'K'),
//           raw_log_key: String(log.raw_log_key ?? ''),
//           created_at: log.created_at,
//           source: 'K'
//         })
//       })

//       // 5b. PQ logs
//       pqLogsData.forEach((log: any) => {
//         const uid = String(log.user_id ?? '').trim()
//         if (!employeeIdSet.has(uid)) return

//         allLogs.push({
//           id: Number(log.id),
//           user_id: uid,
//           employee_name: String(log.employee_name ?? ''),
//           timestamp: log.timestamp,
//           punch_type:
//             log.punch_type === 'CHECK_OUT'
//               ? 'CHECK_OUT'
//               : log.punch_type === 'CHECK_IN'
//                 ? 'CHECK_IN'
//                 : null,
//           device_id: String(log.device_id ?? ''),
//           branch_code: String(log.branch_code ?? 'PQ'),
//           raw_log_key: String(log.raw_log_key ?? ''),
//           created_at: log.created_at,
//           source: 'PQ'
//         })
//       })

//       // ---------------------------------------------------
//       // 6. Sort
//       // ---------------------------------------------------
//       allLogs.sort(
//         (a, b) =>
//           new Date(a.timestamp).getTime() -
//           new Date(b.timestamp).getTime()
//       )

//       // ---------------------------------------------------
//       // 7. Counts
//       // ---------------------------------------------------
//       const kCount = allLogs.filter(l => l.source === 'K').length
//       const pqCount = allLogs.filter(l => l.source === 'PQ').length

//       console.log('======================================')
//       console.log('📊 FINAL LOG COUNTS')
//       console.log('   K  :', kCount)
//       console.log('   PQ :', pqCount)
//       console.log('   TOT:', allLogs.length)
//       console.log('======================================')

//       // ---------------------------------------------------
//       // 8. Attach source to each employee
//       // ---------------------------------------------------
//       const employeesWithSource = employeeData.map((emp: any) => {
//         const empId = String(emp.employee_id ?? '').trim()

//         const hasPQLogs = allLogs.some(
//           log => log.user_id === empId && log.source === 'PQ'
//         )
//         const hasMainLogs = allLogs.some(
//           log => log.user_id === empId && log.source === 'K'
//         )

//         let source: 'K' | 'PQ' = 'K'
//         if (hasPQLogs) source = 'PQ'
//         else if (hasMainLogs) source = 'K'
//         else if (emp.source === 'PQ') source = 'PQ'
//         else if (emp.source === 'K') source = 'K'

//         return { ...emp, employee_id: empId, source }
//       })

//       // ---------------------------------------------------
//       // 9. Update state
//       // ---------------------------------------------------
//       setDataSource({ K: kCount, PQ: pqCount })

//       setDepartments(
//         [
//           ...new Set(
//             employeesWithSource
//               .map((e: any) => e.department)
//               .filter(Boolean)
//           )
//         ] as string[]
//       )

//       setBranches(
//         [
//           ...new Set(
//             employeesWithSource
//               .map((e: any) => e.source)
//               .filter(Boolean)
//           )
//         ] as string[]
//       )

//       setEmployeeNames(
//         employeesWithSource
//           .map((emp: any) => ({
//             id: emp.employee_id || '',
//             name: emp.full_name || '',
//             department: emp.department || '',
//             source: emp.source || 'K'
//           }))
//           .filter((n: any) => n.id && n.name)
//       )

//       setEmployees(employeesWithSource)
//       setAttendanceLogs(allLogs)
//       setLoading(false)

//       console.log('🎉 Attendance data loaded successfully.')
//     } catch (err: any) {
//       console.error('❌ Attendance fetch error:', err)
//       if (isMounted.current) {
//         setError(err?.message || 'Failed to load attendance data')
//         setLoading(false)
//       }
//     }
//   }, [])

//   const generateAttendanceSheet = useCallback(() => {
//     if (!fromDate || !toDate || employees.length === 0) return

//     const startDate = new Date(fromDate + 'T00:00:00')
//     const endDate = new Date(toDate + 'T00:00:00')
//     const dateArray: string[] = []

//     const currentDate = new Date(startDate)
//     while (currentDate <= endDate) {
//       const year = currentDate.getFullYear()
//       const month = String(currentDate.getMonth() + 1).padStart(2, '0')
//       const day = String(currentDate.getDate()).padStart(2, '0')
//       dateArray.push(`${year}-${month}-${day}`)
//       currentDate.setDate(currentDate.getDate() + 1)
//     }

//     let filteredEmployees = employees
//     if (selectedDepartment !== 'all') filteredEmployees = filteredEmployees.filter(emp => emp.department === selectedDepartment)
//     if (selectedBranch !== 'all') filteredEmployees = filteredEmployees.filter(emp => emp.source === selectedBranch)
//     if (selectedEmployee !== 'all') filteredEmployees = filteredEmployees.filter(emp => emp.employee_id === selectedEmployee)

//     const allRecords: AttendanceRecord[] = []
//     filteredEmployees.forEach(employee => {
//       dateArray.forEach(date => {
//         allRecords.push(getEmployeeAttendance(employee, date, attendanceLogs))
//       })
//     })

//     setAttendanceData(allRecords)
//     setFilteredData(allRecords)
//   }, [employees, fromDate, toDate, selectedDepartment, selectedBranch, selectedEmployee, attendanceLogs, getEmployeeAttendance])

//   const getSummary = useCallback(() => {
//     const total = filteredData.length
//     const present = filteredData.filter(r => r.status === 'Present').length
//     const absent = filteredData.filter(r => r.status === 'Absent').length
//     const leave = filteredData.filter(r => r.status === 'Leave').length
//     const halfDay = filteredData.filter(r => r.status === 'Half Day').length
//     const off = filteredData.filter(r => r.status === 'Off').length    
//     return { total, present, absent, leave, halfDay, off }
//   }, [filteredData])

//   // =====================================================
//   // EXPORT: CSV
//   // =====================================================

//   const handleExportCSV = useCallback(() => {
//     if (filteredData.length === 0) { alert('No data to export'); return }

//     const headers = [
//       'User ID', 'Name', 'Dept', 'Designation', 'Shift', 'Date', 'Day',
//       'Check In', 'Check Out', 'Hours', 'Total Hours',
//       'OS Check In', 'OS Check Out', 'OS Hours',
//       'Company', 'Status', 'Leave Type', 'Leave Reason'
//     ]

//     const rows = filteredData.map(r => [
//       r.employeeId,
//       r.name,
//       r.department,
//       r.designation,
//       getShiftDisplay(r.shiftTiming, r.shift),
//       r.date,
//       r.day,
//       r.checkIn,
//       r.checkOut,
//       r.totalHours,
//       r.totalHoursWithOS,
//       r.outsideCheckIn,
//       r.outsideCheckOut,
//       r.outsideTotalHours,
//       r.branch,
//       r.status,
//       r.leaveType || '',
//       r.leaveReason || ''
//     ])

//     const escapeCSV = (val: any) => {
//       const s = String(val ?? '')
//       if (s.includes(',') || s.includes('"') || s.includes('\n')) {
//         return `"${s.replace(/"/g, '""')}"`
//       }
//       return s
//     }

//     const csv = [
//       headers.map(escapeCSV).join(','),
//       ...rows.map(row => row.map(escapeCSV).join(','))
//     ].join('\n')

//     const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
//     const url = URL.createObjectURL(blob)
//     const link = document.createElement('a')
//     link.href = url
//     link.download = `attendance_sheet_${fromDate}_to_${toDate}.csv`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     URL.revokeObjectURL(url)

//     setShowExportMenu(false)
//     setExportSuccess('CSV downloaded successfully')
//     setTimeout(() => setExportSuccess(null), 3000)
//   }, [filteredData, fromDate, toDate])

//   // =====================================================
//   // EXPORT: PDF
//   // =====================================================

//   const handleExportPDF = useCallback(() => {
//     if (filteredData.length === 0) { alert('No data to export'); return }

//     const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
//     const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
//     const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

//     let tableRows = ''
//     filteredData.forEach((record, index) => {
//       const isSunday = record.day === 'Sunday'
//       const rowColor = getRowColor(record.checkIn, record.day, record.isOnLeave, record.status)
//       const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
//       const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)

//       tableRows += `
//         <tr style="${bgStyle}">
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${index + 1}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.employeeId}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.name}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.department}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.designation}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${shiftDisplay}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.date}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; ${isSunday ? 'font-weight: bold; color: #FF0000;' : ''}">${record.day}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.checkIn}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.checkOut}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.totalHours}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.outsideCheckIn}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.outsideCheckOut}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.outsideTotalHours}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.branch}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.status}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.leaveType || '-'}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.leaveReason || '-'}</td>
//         </tr>
//       `
//     })

//     const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Attendance Sheet</title>
//           <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
//           <style>
//             @page { size: A4 landscape; margin: 8mm 6mm; }
//             * { box-sizing: border-box; margin: 0; padding: 0; }
//             body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #000; font-size: 11px; }
//             .print-container { width: 100%; }
//             .print-header { text-align: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid #000; }
//             .print-header .company-name { font-size: 13px; font-weight: 700; text-transform: uppercase; }
//             .print-header .title { font-size: 11px; font-weight: 700; margin-top: 2px; }
//             .print-header .sub-info { font-size: 8px; margin-top: 3px; font-weight: 500; }
//             .print-header .date-range { font-size: 8px; margin-top: 2px; }
//             table { width: 100%; border-collapse: collapse; font-size: 8px; margin-top: 3px; }
//             table thead th { background: #C4BD97; font-weight: 700; text-align: center; padding: 4px 3px; border: 1px solid #000; text-transform: uppercase; font-size: 7px; white-space: nowrap; }
//             table tbody td { padding: 3px 4px; border: 1px solid #000; vertical-align: middle; text-align: center; font-size: 8px; }
//             .print-footer { margin-top: 8px; padding-top: 5px; border-top: 1px solid #000; text-align: center; font-size: 7px; }
//             @media print {
//               table thead th { background: #C4BD97 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//               tr[style*="background-color"] td { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//               tr[style*="background-color"] { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-container">
//             <div class="print-header">
//               <div class="company-name">A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</div>
//               <div class="title">EMPLOYEE ATTENDANCE SHEET</div>
//               <div class="sub-info">${employeeName} | ${deptName} | ${branchName}</div>
//               <div class="date-range">${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}</div>
//             </div>
//             <table>
//               <thead>
//                 <tr>
//                   <th style="width:1%">#</th>
//                   <th style="width:2%">Emp ID</th>
//                   <th style="width:5%">Name</th>
//                   <th style="width:3%">Dept</th>
//                   <th style="width:4%">Designation</th>
//                   <th style="width:5%">Shift</th>
//                   <th style="width:3%">Date</th>
//                   <th style="width:3%">Day</th>
//                   <th style="width:3%">Check In</th>
//                   <th style="width:3%">Check Out</th>
//                   <th style="width:3%">Hours</th>
//                   <th style="width:3%">Total Hours</th>
//                   <th style="width:3%">OS Check In</th>
//                   <th style="width:3%">OS Check Out</th>
//                   <th style="width:3%">OS Hours</th>
//                   <th style="width:3%">Company</th>
//                   <th style="width:3%">Status</th>
//                   <th style="width:3%">Leave Type</th>
//                   <th style="width:4%">Leave Reason</th>
//                 </tr>
//               </thead>
//               <tbody>${tableRows}</tbody>
//             </table>
//             <div class="print-footer">
//               <span>This sheet is generated by system software | A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</span>
//             </div>
//           </div>
//           <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
//         </body>
//       </html>
//     `

//     const printWindow = window.open('', '_blank')
//     if (!printWindow) { alert('Please allow popups for PDF'); return }
//     printWindow.document.write(html)
//     printWindow.document.close()
//     setShowExportMenu(false)
//     setExportSuccess('PDF ready — use "Save as PDF" in print dialog')
//     setTimeout(() => setExportSuccess(null), 4000)
//   }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getRowColor, fromDate, toDate, formatDateForDisplay])

//   // =====================================================
//   // Monthly Summary Calculator — SHIFT-BASED LATE HOURS
//   // =====================================================

//   const calculateMonthlySummaries = useCallback((): MonthlySummary[] => {
//     if (filteredData.length === 0) return []

//     const groups: Record<string, AttendanceRecord[]> = {}

//     filteredData.forEach(r => {
//       const isoDate = displayDateToISO(r.date)
//       if (!isoDate) return
//       const monthKey = isoDate.substring(0, 7)
//       const key = `${r.employeeId}__${monthKey}`
//       if (!groups[key]) groups[key] = []
//       groups[key].push(r)
//     })

//     const summaries: MonthlySummary[] = []

//     Object.entries(groups).forEach(([, records]) => {
//       if (records.length === 0) return

//       const first = records[0]
//       const isoDate = displayDateToISO(first.date)
//       const monthKey = isoDate.substring(0, 7)

//       const [yearStr, monthStr] = monthKey.split('-')
//       const year = parseInt(yearStr)
//       const month = parseInt(monthStr)
//       const totalMonthDays = new Date(year, month, 0).getDate()

//       let presentDays = 0
//       let absentDays = 0
//       let approvedLeaves = 0
//       let lateHoursTotal = 0
//       let overtimeHoursTotal = 0

//       const shiftHours = getShiftTotalHours(first.shiftTiming)

//       records.forEach(r => {
//         if (r.status === 'Absent') absentDays += 1
//         else if (r.status === 'Leave') approvedLeaves += 1
//         else presentDays += 1

//         if (
//           r.day !== 'Sunday' &&
//           r.status !== 'Off' &&
//           r.status !== 'Leave' &&
//           r.status !== 'Absent'
//         ) {
//           const workedHours = parseHoursToDecimal(r.totalHoursWithOS)

//           if (workedHours > 0 && workedHours < shiftHours) {
//             lateHoursTotal += (shiftHours - workedHours)
//           }

//           if (workedHours > shiftHours) {
//             overtimeHoursTotal += (workedHours - shiftHours)
//           }
//         }
//       })

//       summaries.push({
//         user_id: first.employeeId,
//         name: first.name,
//         department: first.department || null,
//         designation: first.designation || null,
//         shift: getShiftDisplay(first.shiftTiming, first.shift),
//         month: monthKey,
//         total_month_days: totalMonthDays,
//         total_present: Math.round(presentDays * 100) / 100,
//         total_absent: Math.round(absentDays * 100) / 100,
//         approved_leaves: Math.round(approvedLeaves * 100) / 100,
//         late_hours: Math.round(lateHoursTotal * 100) / 100,
//         overtime_hours: Math.round(overtimeHoursTotal * 100) / 100,
//         company: first.branch || 'Korangi'
//       })
//     })

//     return summaries
//   }, [filteredData, displayDateToISO, parseHoursToDecimal])

//   // =====================================================
//   // EXPORT: FOR PAYROLL
//   // =====================================================

//   const handleExportForPayroll = useCallback(async () => {
//     if (filteredData.length === 0) {
//       alert('No data to submit')
//       return
//     }

//     const summaries = calculateMonthlySummaries()

//     console.log('📊 Monthly Summaries to submit:', summaries)
//     console.log('ℹ️ Late hours = shift timing se kam kaam')

//     if (summaries.length === 0) {
//       alert('Could not calculate summaries — check date range')
//       return
//     }

//     if (!confirm(
//       `Submit ${summaries.length} monthly summary record(s) to attendance_sheet?\n\n` +
//       `Late hours = shift timing se kam kaam karne par\n` +
//       `Existing records with same (user_id + month + company) will be UPDATED.`
//     )) {
//       return
//     }

//     try {
//       setSubmittingPayroll(true)
//       setError(null)

//       const { data, error: upsertError } = await supabase
//         .from('attendance_sheet')
//         .upsert(summaries, {
//           onConflict: 'user_id,month,company',
//           ignoreDuplicates: false
//         })
//         .select()

//       if (upsertError) throw new Error(upsertError.message)

//       setShowExportMenu(false)
//       setExportSuccess(`✅ ${data?.length || summaries.length} monthly record(s) submitted to attendance_sheet`)
//       setTimeout(() => setExportSuccess(null), 5000)
//     } catch (err: any) {
//       console.error('❌ Payroll submit error:', err)
//       setError(err.message || 'Failed to submit to attendance_sheet')
//     } finally {
//       setSubmittingPayroll(false)
//     }
//   }, [filteredData, calculateMonthlySummaries])

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
//         setShowExportMenu(false)
//       }
//     }
//     if (showExportMenu) document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [showExportMenu])

//   // =====================================================
//   // handlePrintWithColor
//   // =====================================================

//   const handlePrintWithColor = useCallback((withColor: boolean) => {
//     setShowPrintOptions(false)

//     const data = filteredData
//     const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
//     const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
//     const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

//     const getRowColorForPrint = (record: AttendanceRecord) => {
//       if (!withColor) return 'transparent'
//       return getRowColor(record.checkIn, record.day, record.isOnLeave, record.status)
//     }

//     let tableRows = ''
//     data.forEach((record, index) => {
//       const isSunday = record.day === 'Sunday'
//       const rowColor = getRowColorForPrint(record)
//       const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
//       const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)

//       tableRows += `
//         <tr style="${bgStyle}">
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${index + 1}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.employeeId}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.name}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.department}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.designation}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${shiftDisplay}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.date}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; ${isSunday ? 'font-weight: bold; color: #FF0000;' : ''}">${record.day}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.checkIn}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.checkOut}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.totalHours}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.outsideCheckIn}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.outsideCheckOut}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.outsideTotalHours}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.branch}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.status}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.leaveType || '-'}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.leaveReason || '-'}</td>
//         </tr>
//       `
//     })

//     const printHTML = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Attendance Sheet - ${employeeName}</title>
//           <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
//           <style>
//             @page { size: A4 landscape; margin: 5mm 4mm; }
//             * { box-sizing: border-box; margin: 0; padding: 0; }
//             body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #000; font-size: 11px; }
//             .print-container { width: 100%; padding: 0; }
//             .print-header { text-align: center; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 2px solid #000; }
//             .print-header .company-name { font-size: 11px; font-weight: 700; text-transform: uppercase; }
//             .print-header .title { font-size: 10px; font-weight: 700; margin-top: 1px; }
//             .print-header .sub-info { font-size: 7px; margin-top: 2px; font-weight: 500; }
//             .print-header .date-range { font-size: 7px; margin-top: 1px; }
//             table { width: 100%; border-collapse: collapse; font-size: 7px; margin-top: 2px; }
//             table thead th { background: #C4BD97; font-weight: 700; text-align: center; padding: 3px 2px; border: 1px solid #000; text-transform: uppercase; font-size: 6px; white-space: nowrap; }
//             table tbody td { padding: 2px 3px; border: 1px solid #000; vertical-align: middle; text-align: center; font-size: 7px; }
//             .print-footer { margin-top: 6px; padding-top: 4px; border-top: 1px solid #000; text-align: center; font-size: 6px; }
//             @media print {
//               table thead th { background: #C4BD97 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//               tr[style*="background-color"] td { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//               tr[style*="background-color"] { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-container">
//             <div class="print-header">
//               <div class="company-name">A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</div>
//               <div class="title">EMPLOYEE ATTENDANCE SHEET</div>
//               <div class="sub-info">${employeeName} | ${deptName} | ${branchName}</div>
//               <div class="date-range">${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}</div>
//             </div>
//             <table>
//               <thead>
//                 <tr>
//                   <th style="width:1%">#</th>
//                   <th style="width:2%">Emp ID</th>
//                   <th style="width:5%">Name</th>
//                   <th style="width:3%">Dept</th>
//                   <th style="width:4%">Designation</th>
//                   <th style="width:5%">Shift</th>
//                   <th style="width:3%">Date</th>
//                   <th style="width:3%">Day</th>
//                   <th style="width:3%">Check In</th>
//                   <th style="width:3%">Check Out</th>
//                   <th style="width:3%">Hours</th>
//                   <th style="width:3%">Total Hours</th>
//                   <th style="width:3%">OS Check In</th>
//                   <th style="width:3%">OS Check Out</th>
//                   <th style="width:3%">OS Hours</th>
//                   <th style="width:3%">Company</th>
//                   <th style="width:3%">Status</th>
//                   <th style="width:3%">Leave Type</th>
//                   <th style="width:4%">Leave Reason</th>
//                 </tr>
//               </thead>
//               <tbody>${tableRows}</tbody>
//             </table>
//             <div class="print-footer">
//               <span>This sheet is generated by system software | A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</span>
//             </div>
//           </div>
//           <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
//         </body>
//       </html>
//     `

//     const printWindow = window.open('', '_blank')
//     if (!printWindow) { alert('Please allow popups for printing'); return }
//     printWindow.document.write(printHTML)
//     printWindow.document.close()
//   }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getRowColor, fromDate, toDate, formatDateForDisplay])

//   useEffect(() => {
//     isMounted.current = true
//     fetchData()
//     const now = new Date()
//     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
//     const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
//     setFromDate(firstDay.toISOString().split('T')[0])
//     setToDate(lastDay.toISOString().split('T')[0])
//     return () => { isMounted.current = false }
//   }, [fetchData])

//   useEffect(() => {
//     if (employees.length > 0 && fromDate && toDate) generateAttendanceSheet()
//   }, [employees, fromDate, toDate, selectedDepartment, selectedBranch, selectedEmployee, generateAttendanceSheet])

//   const summary = getSummary()

//   if (loading) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
//         <Loader className="w-12 h-12 animate-spin text-[#0071BD]" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
//         <div className="text-center bg-white shadow-sm p-8 max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wider">Error</h3>
//           <p className="text-gray-600 mb-4 tracking-wide">{error}</p>
//           <button onClick={fetchData} className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] tracking-wider">Retry</button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <ProtectedRoute allowedUser='hr'>
//         <NavbarDropdown />
//         <div className={`min-h-screen bg-gray-50 p-2 ${roboto.className}`}>
//           <div className="max-w-full mx-auto">
//             <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//               <div>
//                 <h1 className="text-lg font-bold text-[#0071BD] tracking-wider">Attendance Sheet</h1>
//                 <p className="text-[10px] text-gray-500 tracking-wide">
//                   {selectedEmployee === 'all' ? 'All employees' : getSelectedEmployeeName()}
//                 </p>
//               </div>
//               <div className="flex gap-2 flex-wrap items-center">
//                 <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">K: {dataSource.K}</span>
//                 <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">PQ: {dataSource.PQ}</span>

//                 <button onClick={fetchData} className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 flex items-center gap-1 tracking-wider">
//                   <RefreshCw className="w-3 h-3" /> Refresh
//                 </button>

//                 <div className="relative" ref={exportMenuRef}>
//                   <button
//                     type="button"
//                     onClick={() => setShowExportMenu(!showExportMenu)}
//                     disabled={submittingPayroll || filteredData.length === 0}
//                     className="px-2 py-1 text-xs bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {submittingPayroll ? <Loader className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
//                     {submittingPayroll ? 'Submitting...' : 'Export'}
//                     <ChevronDown className="w-3 h-3" />
//                   </button>

//                   {showExportMenu && (
//                     <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 shadow-lg rounded z-50">
//                       <button onClick={handleExportCSV}
//                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2">
//                         <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
//                         <span>Export as CSV</span>
//                       </button>
//                       <button onClick={handleExportPDF}
//                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100">
//                         <FileText className="w-3.5 h-3.5 text-red-600" />
//                         <span>Export as PDF</span>
//                       </button>
//                       <button onClick={handleExportForPayroll}
//                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100">
//                         <Calculator className="w-3.5 h-3.5 text-blue-600" />
//                         <span>For Payroll</span>
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <button onClick={() => setShowPrintOptions(true)} className="px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 tracking-wider">
//                   <Printer className="w-3 h-3" /> Print
//                 </button>
//               </div>
//             </div>

//             {exportSuccess && (
//               <div className="mb-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded flex items-center gap-2 text-xs">
//                 <CheckCircle2 className="w-4 h-4" /> {exportSuccess}
//               </div>
//             )}

//             {error && (
//               <div className="mb-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded flex items-center gap-2 text-xs">
//                 <AlertCircle className="w-4 h-4" /> {error}
//               </div>
//             )}

//             {showPrintOptions && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                 <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
//                   <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-bold text-gray-800 tracking-wider flex items-center gap-2">
//                       <Printer className="w-5 h-5 text-[#0071BD]" /> Print Options
//                     </h2>
//                     <button onClick={() => setShowPrintOptions(false)} className="p-1 hover:bg-gray-200 rounded-lg">
//                       <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                   <p className="text-sm text-gray-600 tracking-wide mb-4">Select print style:</p>
//                   <div className="space-y-3">
//                     <button onClick={() => handlePrintWithColor(true)}
//                       className="w-full flex items-center gap-3 px-4 py-3 border-2 border-blue-600 rounded-lg hover:bg-blue-50">
//                       <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-lg flex items-center justify-center">
//                         <Palette className="w-5 h-5 text-white" />
//                       </div>
//                       <div className="flex-1 text-left">
//                         <p className="font-semibold text-gray-800 tracking-wide">With Colors</p>
//                         <p className="text-xs text-gray-500">Show time-based colors + gray for Off days</p>
//                       </div>
//                     </button>
//                     <button onClick={() => handlePrintWithColor(false)}
//                       className="w-full flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
//                       <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
//                         <FileText className="w-5 h-5 text-gray-600" />
//                       </div>
//                       <div className="flex-1 text-left">
//                         <p className="font-semibold text-gray-800 tracking-wide">Without Colors</p>
//                         <p className="text-xs text-gray-500">Plain white background</p>
//                       </div>
//                     </button>
//                   </div>
//                   <button onClick={() => setShowPrintOptions(false)}
//                     className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 tracking-wider text-sm rounded-lg">Cancel</button>
//                 </div>
//               </div>
//             )}

//             <div className="grid grid-cols-6 gap-1.5 mb-2">
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="text-[10px] text-[#0071BD] tracking-wide">Total</div>
//                 <div className="text-base font-bold text-[#0071BD] tracking-wider">{summary.total}</div>
//               </div>
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="text-[10px] text-green-600 tracking-wide flex items-center gap-0.5">
//                   <UserCheck className="w-2.5 h-2.5" /> P
//                 </div>
//                 <div className="text-base font-bold text-green-700 tracking-wider">{summary.present}</div>
//               </div>
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="text-[10px] text-red-600 tracking-wide flex items-center gap-0.5">
//                   <UserX className="w-2.5 h-2.5" /> A
//                 </div>
//                 <div className="text-base font-bold text-red-700 tracking-wider">{summary.absent}</div>
//               </div>
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="text-[10px] text-blue-600 tracking-wide flex items-center gap-0.5">
//                   <UserMinus className="w-2.5 h-2.5" /> L
//                 </div>
//                 <div className="text-base font-bold text-blue-700 tracking-wider">{summary.leave}</div>
//               </div>
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="text-[10px] text-yellow-600 tracking-wide flex items-center gap-0.5">
//                   <UserPlus className="w-2.5 h-2.5" /> H
//                 </div>
//                 <div className="text-base font-bold text-yellow-700 tracking-wider">{summary.halfDay}</div>
//               </div>
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="text-[10px] text-gray-600 tracking-wide flex items-center gap-0.5">
//                   <Clock className="w-2.5 h-2.5" /> OFF
//                 </div>
//                 <div className="text-base font-bold text-gray-700 tracking-wider">{summary.off}</div>
//               </div>
//             </div>

//             <div className="bg-white text-black shadow-sm p-1.5 mb-2">
//               <button onClick={() => setExpandedFilters(!expandedFilters)}
//                 className="flex items-center gap-1 text-gray-700 hover:text-[#0071BD] tracking-wider text-xs">
//                 <Filter className="w-3 h-3" />
//                 {expandedFilters ? 'Hide Filters' : 'Show Filters'}
//                 {expandedFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//               </button>
//               {expandedFilters && (
//                 <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2">
//                   <div>
//                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">From Date</label>
//                     <div className="relative">
//                       <Calendar className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
//                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">To Date</label>
//                     <div className="relative">
//                       <Calendar className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
//                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Department</label>
//                     <div className="relative">
//                       <Building className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}
//                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
//                         <option value="all">All Departments</option>
//                         {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
//                       </select>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Branch</label>
//                     <div className="relative">
//                       <MapPin className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}
//                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
//                         <option value="all">All Branches</option>
//                         {branches.map(b => <option key={b} value={b}>{getBranchDisplayName(b)}</option>)}
//                       </select>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Employee</label>
//                     <div className="relative">
//                       <User className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}
//                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
//                         <option value="all">All Employees</option>
//                         {employeeNames.map(emp => (
//                           <option key={emp.id} value={emp.id}>
//                             {emp.name} ({emp.id}) - {getBranchDisplayName(emp.source)}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="bg-white shadow-sm overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-[10px]">
//                   <thead>
//                     <tr className="bg-gray-50 border-b border-gray-200">
//                       {['#','Emp ID','Name','Dept','Designation','Shift','Date','Day','Check In','Check Out','Hours','Total Hours','OS Check In','OS Check Out','OS Hours','Company','Status','Leave Type','Leave Reason'].map(h => (
//                         <th key={h} className="px-1.5 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {filteredData.length === 0 ? (
//                       <tr>
//                         <td colSpan={19} className="px-2 py-3 text-center text-gray-500 text-xs">
//                           <div className="flex flex-col items-center gap-1">
//                             <Users className="w-6 h-6 text-gray-300" />
//                             <p className="tracking-wide">No data found</p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredData.map((record, index) => {
//                         const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)
//                         return (
//                           <tr key={index} className={`transition ${record.status === 'Off' ? 'bg-gray-200' : 'hover:bg-gray-50'}`}>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-500 whitespace-nowrap">{index + 1}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap">{record.employeeId}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-700 whitespace-nowrap">{record.name}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.department}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.designation}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-700 whitespace-nowrap font-medium">
//                               {shiftDisplay !== '-' ? (
//                                 <span className="px-1 py-0.5 text-[9px] font-bold tracking-wide rounded bg-blue-100 text-blue-700">
//                                   {shiftDisplay}
//                                 </span>
//                               ) : (
//                                 <span className="text-gray-400">-</span>
//                               )}
//                             </td>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.date}</td>
//                             <td className={`px-1.5 py-0.5 text-[10px] whitespace-nowrap ${record.day === 'Sunday' ? 'font-bold text-red-600' : 'text-gray-600'}`}>{record.day}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
//                               {record.hasCheckIn ? (
//                                 <div className="flex items-center gap-0.5">
//                                   <LogIn className="w-3 h-3 text-green-500 flex-shrink-0" />
//                                   <span className="text-gray-700 font-medium">{record.checkIn}</span>
//                                 </div>
//                               ) : <span className="text-gray-400">-</span>}
//                             </td>
//                             <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
//                               {record.hasCheckOut ? (
//                                 <div className="flex items-center gap-0.5">
//                                   <LogOut className="w-3 h-3 text-red-500 flex-shrink-0" />
//                                   <span className="text-gray-700 font-medium">{record.checkOut}</span>
//                                 </div>
//                               ) : <span className="text-gray-400">-</span>}
//                             </td>
//                             <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap text-center">{record.totalHours}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] font-bold text-blue-700 whitespace-nowrap text-center">{record.totalHoursWithOS}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.outsideCheckIn}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.outsideCheckOut}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap text-center">{record.outsideTotalHours}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
//                               <span className={`px-1 py-0.5 text-[9px] font-medium tracking-wide rounded-full ${
//                                 record.branchCode === 'PQ'
//                                   ? 'bg-purple-100 text-purple-700 border border-purple-200'
//                                   : 'bg-blue-100 text-blue-700 border border-blue-200'
//                               }`}>
//                                 {record.branch}
//                               </span>
//                             </td>
//                             <td className="px-1.5 py-0.5 whitespace-nowrap">
//                               <span className={`px-1 py-0.5 text-[9px] font-medium tracking-wide rounded-full ${
//                                 record.status === 'Present' ? 'bg-green-100 text-green-700' :
//                                 record.status === 'Absent' ? 'bg-red-100 text-red-700' :
//                                 record.status === 'Leave' ? 'bg-blue-100 text-blue-700' :
//                                 record.status === 'Off' ? 'bg-gray-300 text-gray-800 font-bold' :
//                                 'bg-yellow-100 text-yellow-700'
//                               }`}>
//                                 {record.status}
//                               </span>
//                             </td>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.leaveType || '-'}</td>
//                             <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.leaveReason || '-'}</td>
//                           </tr>
//                         )
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {filteredData.length > 0 && (
//               <div className="mt-1.5 bg-white shadow-sm p-1.5">
//                 <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-600 tracking-wide">
//                   <div>{filteredData.length} records</div>
//                   <div className="flex items-center gap-2">
//                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-green-500 rounded"></span> P: {summary.present}</span>
//                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-red-500 rounded"></span> A: {summary.absent}</span>
//                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-blue-500 rounded"></span> L: {summary.leave}</span>
//                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-yellow-500 rounded"></span> H: {summary.halfDay}</span>
//                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-gray-400 rounded"></span> OFF: {summary.off}</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="mt-1.5 grid grid-cols-3 gap-1.5">
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="flex items-center gap-1 text-[10px] text-gray-600">
//                   <Users className="w-3 h-3 text-[#0071BD]" />
//                   <span className="font-medium">Employees</span>
//                 </div>
//                 <div className="text-base font-bold text-[#0071BD]">{employees.length}</div>
//               </div>
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="flex items-center gap-1 text-[10px] text-gray-600">
//                   <Calendar className="w-3 h-3 text-[#0071BD]" />
//                   <span className="font-medium">Range</span>
//                 </div>
//                 <div className="text-[10px] font-medium text-gray-700">
//                   {formatDate(fromDate)} - {formatDate(toDate)}
//                 </div>
//               </div>
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="flex items-center gap-1 text-[10px] text-gray-600">
//                   <Building className="w-3 h-3 text-[#0071BD]" />
//                   <span className="font-medium">Depts</span>
//                 </div>
//                 <div className="text-base font-medium text-gray-700">{departments.length}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </ProtectedRoute>
//     </>
//   )
// }



// app/hr/get-sheet/page.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Footer from '@/components/footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { createClient } from '@supabase/supabase-js'
import NavbarDropdown from '@/components/navbar'
import {
  RefreshCw,
  Calendar,
  Users,
  Building,
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  Loader,
  UserCheck,
  UserX,
  UserMinus,
  UserPlus,
  Printer,
  MapPin,
  AlertCircle,
  Palette,
  FileText,
  LogIn,
  LogOut,
  Clock,
  Download,
  FileSpreadsheet,
  Calculator,
  CheckCircle2
} from 'lucide-react'

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
  department: string
  position: string
  father_name?: string
  cnic_number?: string
  phone_number?: string
  emergency_contact?: string
  date_of_birth?: string
  marital_status?: string
  residential_address?: string
  joining_date?: string
  source?: 'K' | 'PQ'
  enable_attendance?: boolean
  shift?: 'A' | 'B' | null
  shift_timing?: string | null
  check_in?: Array<{ time: string; location: string }>
  check_out?: Array<{ time: string; location: string }>
  qualifications?: Array<{
    degree: string
    institution: string
    year: string
    grade: string
  }>
  experience?: Array<{
    company: string
    position: string
    fromDate: string
    toDate: string
    description: string
  }>
  leaves?: Array<{
    fromDate: string
    toDate: string
    status: string
    leaveType: string
    reason?: string
    totalDays?: number
  }>
}

interface AttendanceLog {
  id: number
  user_id: string
  employee_name: string
  timestamp: string
  punch_type: 'CHECK_IN' | 'CHECK_OUT' | null
  device_id: string
  branch_code: string
  raw_log_key: string
  created_at: string
  source?: 'K' | 'PQ'
}

interface AttendanceRecord {
  employeeId: string
  name: string
  fatherName: string
  cnic: string
  phoneNumber: string
  emergencyContact: string
  dob: string
  maritalStatus: string
  address: string
  department: string
  designation: string
  joiningDate: string
  date: string
  day: string
  checkIn: string
  checkOut: string
  checkInTime: string
  checkOutTime: string
  totalHours: string
  checkInLocation: string
  checkOutLocation: string
  status: 'Present' | 'Absent' | 'Leave' | 'Half Day' | 'Off'
  leaveType?: string
  leaveReason?: string
  qualifications: string
  experience: string
  isOnLeave: boolean
  hasCheckIn: boolean
  hasCheckOut: boolean
  outsideCheckIn: string
  outsideCheckOut: string
  outsideTotalHours: string
  outsideCheckInTime: string
  outsideCheckOutTime: string
  branch: string
  branchCode: 'K' | 'PQ'
  totalHoursWithOS: string
  shift?: string
  shiftTiming?: string
}

interface MonthlySummary {
  user_id: string
  name: string
  department: string | null
  designation: string | null
  shift: string | null
  month: string
  total_month_days: number
  total_present: number
  total_absent: number
  approved_leaves: number
  late_hours: number
  overtime_hours: number
  company: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const getBranchDisplayName = (source: string | undefined) => {
  if (source === 'PQ') return 'Port Qasim'
  if (source === 'K') return 'Korangi'
  return 'Korangi'
}

// ✅ Convert "HH:MM" (24h) → "hh:MM AM/PM" (12h)
const to12HourFormat = (time24: string): string => {
  if (!time24) return ''
  const trimmed = time24.trim()
  if (/AM|PM/i.test(trimmed)) return trimmed.toUpperCase()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return trimmed
  let hours = parseInt(match[1])
  const minutes = match[2]
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
}

// ✅ shift_timing ko 12-hour format mein convert karo
const getShiftDisplay = (shiftTiming: string | null | undefined, _shift?: string | null) => {
  if (!shiftTiming || !String(shiftTiming).trim()) return '-'
  const raw = String(shiftTiming).trim()
  const parts = raw.split(/\s*-\s*/)
  if (parts.length === 2) {
    const start = to12HourFormat(parts[0])
    const end = to12HourFormat(parts[1])
    return `${start} - ${end}`
  }
  return to12HourFormat(raw)
}

// ✅ shift timing se total shift hours calculate karo
const getShiftTotalHours = (shiftTiming: string | null | undefined): number => {
  if (!shiftTiming) return 8
  const raw = String(shiftTiming).trim()
  const parts = raw.split(/\s*-\s*/)
  if (parts.length !== 2) return 8

  const parseTime = (t: string): number => {
    const trimmed = t.trim().toUpperCase()
    const ampmMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
    if (ampmMatch) {
      let h = parseInt(ampmMatch[1])
      const m = parseInt(ampmMatch[2])
      const ampm = ampmMatch[3]
      if (ampm === 'PM' && h !== 12) h += 12
      if (ampm === 'AM' && h === 12) h = 0
      return h * 60 + m
    }
    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/)
    if (match24) {
      return parseInt(match24[1]) * 60 + parseInt(match24[2])
    }
    return -1
  }

  const startMin = parseTime(parts[0])
  const endMin = parseTime(parts[1])
  if (startMin < 0 || endMin < 0) return 8

  let diffMin = endMin - startMin
  if (diffMin < 0) diffMin += 24 * 60

  return diffMin / 60
}

// ✅ Convert ISO timestamp → local YYYY-MM-DD
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

export default function GetSheetPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [departments, setDepartments] = useState<string[]>([])
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([])
  const [expandedFilters, setExpandedFilters] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all')
  const [employeeNames, setEmployeeNames] = useState<{ id: string, name: string, department: string, source: string }[]>([])
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  const [dataSource, setDataSource] = useState<{ K: number; PQ: number }>({ K: 0, PQ: 0 })

  const [showExportMenu, setShowExportMenu] = useState(false)
  const [submittingPayroll, setSubmittingPayroll] = useState(false)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)

  const [selectedBranch, setSelectedBranch] = useState<string>('all')
  const [branches, setBranches] = useState<string[]>(['K', 'PQ'])

  // ✅ NEW: Status filter (Present / Absent / etc.)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const isMounted = useRef(true)
  const exportMenuRef = useRef<HTMLDivElement | null>(null)

  // =====================================================
  // Helpers
  // =====================================================

  const getDayName = useCallback((dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }, [])

  const formatTime = useCallback((timestamp: string) => {
    if (!timestamp) return '-'
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    } catch {
      return '-'
    }
  }, [])

  const formatDate = useCallback((dateStr: string) => {
    if (!dateStr) return '-'
    try {
      const date = new Date(dateStr + 'T00:00:00')
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return '-'
    }
  }, [])

  const formatDateForDisplay = useCallback((dateStr: string) => {
    if (!dateStr) return '-'
    try {
      const date = new Date(dateStr + 'T00:00:00')
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return '-'
    }
  }, [])

  const displayDateToISO = useCallback((displayDate: string): string => {
    if (!displayDate || displayDate === '-') return ''
    try {
      const d = new Date(displayDate)
      if (isNaN(d.getTime())) return ''
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    } catch {
      return ''
    }
  }, [])

  const calculateTotalHours = useCallback((checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return '-'
    try {
      const inTime = new Date(checkIn)
      const outTime = new Date(checkOut)
      const diffMs = outTime.getTime() - inTime.getTime()
      if (diffMs < 0) return '-'
      const totalSeconds = Math.floor(diffMs / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    } catch {
      return '-'
    }
  }, [])

  const calculateOutsideHours = useCallback((inTime: string, outTime: string) => {
    if (!outTime || !inTime) return '-'
    try {
      const diffMs = new Date(outTime).getTime() - new Date(inTime).getTime()
      if (diffMs < 0) return '-'
      const s = Math.floor(diffMs / 1000)
      return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
    } catch { return '-' }
  }, [])

  const calculateTotalHoursWithOS = useCallback((hours: string, osHours: string) => {
    if ((!hours || hours === '-') && (!osHours || osHours === '-')) return '-'
    const parseHours = (h: string) => {
      if (!h || h === '-') return 0
      const parts = h.split(':')
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2] || '0')
    }
    const totalSec = parseHours(hours) + parseHours(osHours)
    return `${String(Math.floor(totalSec / 3600)).padStart(2, '0')}:${String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')}:${String(totalSec % 60).padStart(2, '0')}`
  }, [])

  const parseHoursToDecimal = useCallback((h: string): number => {
    if (!h || h === '-') return 0
    const parts = h.split(':')
    const hours = parseInt(parts[0] || '0')
    const minutes = parseInt(parts[1] || '0')
    const seconds = parseInt(parts[2] || '0')
    return hours + minutes / 60 + seconds / 3600
  }, [])

  const getQualificationsString = useCallback((qualifications: any[] = []) => {
    if (!qualifications || qualifications.length === 0) return '-'
    return qualifications.map(q => `${q.degree} (${q.institution}, ${q.year}) - ${q.grade}`).join('; ')
  }, [])

  const getExperienceString = useCallback((experience: any[] = []) => {
    if (!experience || experience.length === 0) return '-'
    return experience.map(exp => `${exp.position} at ${exp.company}`).join('; ')
  }, [])

  const parseCoordinates = useCallback((location: string): { lat: number; lng: number } | null => {
    if (!location || location === '-') return null
    const parts = location.split(',').map(s => s.trim())
    if (parts.length !== 2) return null
    const lat = parseFloat(parts[0])
    const lng = parseFloat(parts[1])
    if (isNaN(lat) || isNaN(lng)) return null
    return { lat, lng }
  }, [])

  const openGoogleMaps = useCallback((location: string) => {
    const coords = parseCoordinates(location)
    if (!coords) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank')
      return
    }
    window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank')
  }, [parseCoordinates])

  const getEmployeeAttendance = useCallback((employee: Employee, date: string, logs: AttendanceLog[]): AttendanceRecord => {
    const dateStr = date
    const dayName = getDayName(dateStr)

    if (dayName === 'Sunday') {
      return {
        employeeId: employee.employee_id || '',
        name: employee.full_name || '',
        fatherName: employee.father_name || '-',
        cnic: employee.cnic_number || '-',
        phoneNumber: employee.phone_number || '-',
        emergencyContact: employee.emergency_contact || '-',
        dob: formatDate(employee.date_of_birth || ''),
        maritalStatus: employee.marital_status || '-',
        address: employee.residential_address || '-',
        department: employee.department || '',
        designation: employee.position || '',
        joiningDate: formatDate(employee.joining_date || ''),
        date: formatDate(dateStr),
        day: dayName,
        checkIn: '-',
        checkOut: '-',
        checkInTime: '',
        checkOutTime: '',
        totalHours: '-',
        checkInLocation: '-',
        checkOutLocation: '-',
        status: 'Off',
        leaveType: '',
        leaveReason: '',
        qualifications: getQualificationsString(employee.qualifications),
        experience: getExperienceString(employee.experience),
        isOnLeave: false,
        hasCheckIn: false,
        hasCheckOut: false,
        outsideCheckIn: '-',
        outsideCheckOut: '-',
        outsideTotalHours: '-',
        outsideCheckInTime: '',
        outsideCheckOutTime: '',
        branch: getBranchDisplayName(employee.source),
        branchCode: (employee.source || 'K') as 'K' | 'PQ',
        totalHoursWithOS: '-',
        shift: employee.shift || undefined,
        shiftTiming: employee.shift_timing || undefined
      }
    }

    const dayLogs = logs.filter(log => {
      const logDate = toLocalDateStr(log.timestamp)
      const logUserId = String(log.user_id).trim()
      const empId = String(employee.employee_id).trim()
      return logDate === dateStr && logUserId === empId
    })

    const sortedLogs = [...dayLogs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    let checkInLog: AttendanceLog | null = null
    let checkOutLog: AttendanceLog | null = null
    let hasCheckIn = false
    let hasCheckOut = false

    if (sortedLogs.length === 1) {
      const singleLog = sortedLogs[0]
      const logHour = new Date(singleLog.timestamp).getHours()
      if (logHour >= 18) {
        checkOutLog = singleLog
        hasCheckOut = true
      } else {
        checkInLog = singleLog
        hasCheckIn = true
      }
    } else if (sortedLogs.length >= 2) {
      checkInLog = sortedLogs[0]
      hasCheckIn = true
      const lastLog = sortedLogs[sortedLogs.length - 1]
      const diffMs = new Date(lastLog.timestamp).getTime() - new Date(checkInLog.timestamp).getTime()
      if (diffMs >= 3600000) {
        checkOutLog = lastLog
        hasCheckOut = true
      }
    }

    const leave = employee.leaves?.find(
      l => l.fromDate <= dateStr && l.toDate >= dateStr && l.status === 'approved'
    )

    let status: 'Present' | 'Absent' | 'Leave' | 'Half Day' | 'Off' = 'Absent'
    let leaveType = ''
    let leaveReason = ''
    let isOnLeave = false

    if (leave) {
      status = 'Leave'
      leaveType = leave.leaveType || ''
      leaveReason = leave.reason || ''
      isOnLeave = true
    } else if (hasCheckIn) {
      const checkInDate = new Date(checkInLog!.timestamp)
      const checkInHour = checkInDate.getHours()
      const checkInMinute = checkInDate.getMinutes()
      const isAfterNoon = checkInHour > 12 || (checkInHour === 12 && checkInMinute > 0)
      if (isAfterNoon) status = 'Half Day'
      else status = 'Present'
    }

    let outsideCheckInTime = ''
    let outsideCheckOutTime = ''

    if (employee.check_in && employee.check_in.length > 0) {
      const checkInJson = employee.check_in.find(c => toLocalDateStr(c.time) === dateStr)
      if (checkInJson) outsideCheckInTime = checkInJson.time
    }
    if (employee.check_out && employee.check_out.length > 0) {
      const checkOutJson = employee.check_out.find(c => toLocalDateStr(c.time) === dateStr)
      if (checkOutJson) outsideCheckOutTime = checkOutJson.time
    }

    const outsideCheckIn = outsideCheckInTime ? formatTime(outsideCheckInTime) : '-'
    const outsideCheckOut = outsideCheckOutTime ? formatTime(outsideCheckOutTime) : '-'
    const outsideTotalHours = (outsideCheckInTime && outsideCheckOutTime)
      ? calculateOutsideHours(outsideCheckInTime, outsideCheckOutTime) : '-'

    const displayCheckIn = isOnLeave ? '-' : (checkInLog ? formatTime(checkInLog.timestamp) : '-')
    const displayCheckOut = isOnLeave ? '-' : (checkOutLog ? formatTime(checkOutLog.timestamp) : '-')
    const displayTotalHours = isOnLeave ? '-' : calculateTotalHours(checkInLog?.timestamp || '', checkOutLog?.timestamp || '')
    const displayCheckInLocation = isOnLeave ? '-' : (checkInLog?.branch_code || '-')
    const displayCheckOutLocation = isOnLeave ? '-' : (checkOutLog?.branch_code || '-')

    const totalHoursWithOS = calculateTotalHoursWithOS(displayTotalHours, outsideTotalHours)

    let source = employee.source || 'K'
    if (!employee.source) {
      source = (checkInLog?.source || checkOutLog?.source || 'K') as 'K' | 'PQ'
    }

    return {
      employeeId: employee.employee_id || '',
      name: employee.full_name || '',
      fatherName: employee.father_name || '-',
      cnic: employee.cnic_number || '-',
      phoneNumber: employee.phone_number || '-',
      emergencyContact: employee.emergency_contact || '-',
      dob: formatDate(employee.date_of_birth || ''),
      maritalStatus: employee.marital_status || '-',
      address: employee.residential_address || '-',
      department: employee.department || '',
      designation: employee.position || '',
      joiningDate: formatDate(employee.joining_date || ''),
      date: formatDate(dateStr),
      day: dayName,
      checkIn: displayCheckIn,
      checkOut: displayCheckOut,
      checkInTime: checkInLog?.timestamp || '',
      checkOutTime: checkOutLog?.timestamp || '',
      totalHours: displayTotalHours,
      checkInLocation: displayCheckInLocation,
      checkOutLocation: displayCheckOutLocation,
      status,
      leaveType,
      leaveReason,
      qualifications: getQualificationsString(employee.qualifications),
      experience: getExperienceString(employee.experience),
      isOnLeave,
      hasCheckIn,
      hasCheckOut,
      outsideCheckIn,
      outsideCheckOut,
      outsideTotalHours,
      outsideCheckInTime,
      outsideCheckOutTime,
      branch: getBranchDisplayName(source),
      branchCode: source as 'K' | 'PQ',
      totalHoursWithOS,
      shift: employee.shift || undefined,
      shiftTiming: employee.shift_timing || undefined
    }
  }, [formatDate, getDayName, formatTime, calculateTotalHours, calculateOutsideHours, calculateTotalHoursWithOS, getQualificationsString, getExperienceString])

  const getSelectedEmployeeName = useCallback(() => {
    if (selectedEmployee === 'all') return 'All Employees'
    const emp = employees.find(e => e.employee_id === selectedEmployee)
    return emp?.full_name || 'Selected Employee'
  }, [employees, selectedEmployee])

  const getRowColor = useCallback((checkInTime: string, day: string, isOnLeave: boolean, status: string) => {
    if (status === 'Off' || day === 'Sunday') return '#E5E7EB'
    if (isOnLeave) return 'transparent'
    if (!checkInTime || checkInTime === '-') return 'transparent'
    try {
      const timeStr = checkInTime.replace(/\s/g, '')
      const isPM = timeStr.includes('PM')
      let hours = parseInt(timeStr.split(':')[0])
      const minutes = parseInt(timeStr.split(':')[1]?.replace(/[AP]M/g, ''))
      if (isPM && hours !== 12) hours += 12
      if (!isPM && hours === 12) hours = 0
      const totalMinutes = hours * 60 + (minutes || 0)
      if (totalMinutes < 600) return '#4A90D9'
      if (totalMinutes >= 600 && totalMinutes < 630) return '#27AE60'
      if (totalMinutes >= 630 && totalMinutes < 690) return '#F1C40F'
      if (totalMinutes >= 690) return '#E74C3C'
      return 'transparent'
    } catch { return 'transparent' }
  }, [])

  // =====================================================
  // fetchData — FINAL FIX
  //   ✅ Pagination (1000-row Supabase limit handle)
  //   ✅ K logs: .in() with employee IDs
  //   ✅ PQ logs: NO .in() — fetch all, filter client-side
  //   ✅ String-safe user_id comparison
  // =====================================================

  const fetchData = useCallback(async () => {
    if (!isMounted.current) return
    try {
      setLoading(true)
      setError(null)

      // ---------------------------------------------------
      // 1. Fetch employees
      // ---------------------------------------------------
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .order('full_name', { ascending: true })

      if (employeeError) throw new Error(employeeError.message)

      if (!employeeData || employeeData.length === 0) {
        setError('No employees found')
        setEmployees([])
        setDepartments([])
        setEmployeeNames([])
        setAttendanceLogs([])
        setDataSource({ K: 0, PQ: 0 })
        setLoading(false)
        return
      }

      // ---------------------------------------------------
      // 2. Build employee ID Set (string, trimmed)
      // ---------------------------------------------------
      const employeeIdSet = new Set<string>(
        employeeData
          .map((e: any) => String(e.employee_id ?? '').trim())
          .filter(Boolean)
      )

      const employeeIdsArray = Array.from(employeeIdSet)

      console.log('======================================')
      console.log('👥 Employees:', employeeData.length)
      console.log('🆔 Unique IDs:', employeeIdsArray.length)
      console.log('🆔 Sample IDs:', employeeIdsArray.slice(0, 20))
      console.log('======================================')

      // ---------------------------------------------------
      // 3. Paginated fetch helper
      // ---------------------------------------------------
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

          if (error) {
            throw new Error(`${tableName}: ${error.message}`)
          }

          if (!data || data.length === 0) break

          all = all.concat(data)

          console.log(
            `📡 ${tableName}: +${data.length} rows (total ${all.length})`
          )

          if (data.length < PAGE_SIZE) break

          from += PAGE_SIZE
        }

        return all
      }

      // ---------------------------------------------------
      // 4. Fetch K + PQ in parallel
      // ---------------------------------------------------
      console.log('📡 Fetching K logs (filtered by employee IDs)...')
      console.log('📡 Fetching ALL PQ logs (no .in() filter)...')

      const [mainLogsData, pqLogsData] = await Promise.all([
        fetchAllRows('attendance_logs', true),
        fetchAllRows('pq_attendance_logs', false)
      ])

      console.log('✅ K fetched:', mainLogsData.length)
      console.log('✅ PQ fetched:', pqLogsData.length)

      // ---------------------------------------------------
      // 5. Build allLogs
      // ---------------------------------------------------
      const allLogs: AttendanceLog[] = []

      // 5a. K logs
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
          raw_log_key: String(log.raw_log_key ?? ''),
          created_at: log.created_at,
          source: 'K'
        })
      })

      // 5b. PQ logs
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
          raw_log_key: String(log.raw_log_key ?? ''),
          created_at: log.created_at,
          source: 'PQ'
        })
      })

      // ---------------------------------------------------
      // 6. Sort
      // ---------------------------------------------------
      allLogs.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      )

      // ---------------------------------------------------
      // 7. Counts
      // ---------------------------------------------------
      const kCount = allLogs.filter(l => l.source === 'K').length
      const pqCount = allLogs.filter(l => l.source === 'PQ').length

      console.log('======================================')
      console.log('📊 FINAL LOG COUNTS')
      console.log('   K  :', kCount)
      console.log('   PQ :', pqCount)
      console.log('   TOT:', allLogs.length)
      console.log('======================================')

      // ---------------------------------------------------
      // 8. Attach source to each employee
      // ---------------------------------------------------
      const employeesWithSource = employeeData.map((emp: any) => {
        const empId = String(emp.employee_id ?? '').trim()

        const hasPQLogs = allLogs.some(
          log => log.user_id === empId && log.source === 'PQ'
        )
        const hasMainLogs = allLogs.some(
          log => log.user_id === empId && log.source === 'K'
        )

        let source: 'K' | 'PQ' = 'K'
        if (hasPQLogs) source = 'PQ'
        else if (hasMainLogs) source = 'K'
        else if (emp.source === 'PQ') source = 'PQ'
        else if (emp.source === 'K') source = 'K'

        return { ...emp, employee_id: empId, source }
      })

      // ---------------------------------------------------
      // 9. Update state
      // ---------------------------------------------------
      setDataSource({ K: kCount, PQ: pqCount })

      setDepartments(
        [
          ...new Set(
            employeesWithSource
              .map((e: any) => e.department)
              .filter(Boolean)
          )
        ] as string[]
      )

      setBranches(
        [
          ...new Set(
            employeesWithSource
              .map((e: any) => e.source)
              .filter(Boolean)
          )
        ] as string[]
      )

      setEmployeeNames(
        employeesWithSource
          .map((emp: any) => ({
            id: emp.employee_id || '',
            name: emp.full_name || '',
            department: emp.department || '',
            source: emp.source || 'K'
          }))
          .filter((n: any) => n.id && n.name)
      )

      setEmployees(employeesWithSource)
      setAttendanceLogs(allLogs)
      setLoading(false)

      console.log('🎉 Attendance data loaded successfully.')
    } catch (err: any) {
      console.error('❌ Attendance fetch error:', err)
      if (isMounted.current) {
        setError(err?.message || 'Failed to load attendance data')
        setLoading(false)
      }
    }
  }, [])

  const generateAttendanceSheet = useCallback(() => {
    if (!fromDate || !toDate || employees.length === 0) return

    const startDate = new Date(fromDate + 'T00:00:00')
    const endDate = new Date(toDate + 'T00:00:00')
    const dateArray: string[] = []

    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      dateArray.push(`${year}-${month}-${day}`)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    let filteredEmployees = employees
    if (selectedDepartment !== 'all') filteredEmployees = filteredEmployees.filter(emp => emp.department === selectedDepartment)
    if (selectedBranch !== 'all') filteredEmployees = filteredEmployees.filter(emp => emp.source === selectedBranch)
    if (selectedEmployee !== 'all') filteredEmployees = filteredEmployees.filter(emp => emp.employee_id === selectedEmployee)

    const allRecords: AttendanceRecord[] = []
    filteredEmployees.forEach(employee => {
      dateArray.forEach(date => {
        allRecords.push(getEmployeeAttendance(employee, date, attendanceLogs))
      })
    })

    setAttendanceData(allRecords)
    setFilteredData(allRecords)
  }, [employees, fromDate, toDate, selectedDepartment, selectedBranch, selectedEmployee, attendanceLogs, getEmployeeAttendance])

  // =====================================================
  // ✅ Status filter apply (Present / Absent / Leave / Half Day / Off)
  // =====================================================
  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredData(attendanceData)
    } else {
      setFilteredData(attendanceData.filter(r => r.status === selectedStatus))
    }
  }, [attendanceData, selectedStatus])

  const getSummary = useCallback(() => {
    const total = filteredData.length
    const present = filteredData.filter(r => r.status === 'Present').length
    const absent = filteredData.filter(r => r.status === 'Absent').length
    const leave = filteredData.filter(r => r.status === 'Leave').length
    const halfDay = filteredData.filter(r => r.status === 'Half Day').length
    const off = filteredData.filter(r => r.status === 'Off').length    
    return { total, present, absent, leave, halfDay, off }
  }, [filteredData])

  // =====================================================
  // EXPORT: CSV
  // =====================================================

  const handleExportCSV = useCallback(() => {
    if (filteredData.length === 0) { alert('No data to export'); return }

    const headers = [
      'User ID', 'Name', 'Dept', 'Designation', 'Shift', 'Date', 'Day',
      'Check In', 'Check Out', 'Hours', 'Total Hours',
      'OS Check In', 'OS Check Out', 'OS Hours',
      'Company', 'Status', 'Leave Type', 'Leave Reason'
    ]

    const rows = filteredData.map(r => [
      r.employeeId,
      r.name,
      r.department,
      r.designation,
      getShiftDisplay(r.shiftTiming, r.shift),
      r.date,
      r.day,
      r.checkIn,
      r.checkOut,
      r.totalHours,
      r.totalHoursWithOS,
      r.outsideCheckIn,
      r.outsideCheckOut,
      r.outsideTotalHours,
      r.branch,
      r.status,
      r.leaveType || '',
      r.leaveReason || ''
    ])

    const escapeCSV = (val: any) => {
      const s = String(val ?? '')
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`
      }
      return s
    }

    const csv = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `attendance_sheet_${fromDate}_to_${toDate}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setShowExportMenu(false)
    setExportSuccess('CSV downloaded successfully')
    setTimeout(() => setExportSuccess(null), 3000)
  }, [filteredData, fromDate, toDate])

  // =====================================================
  // EXPORT: PDF
  // =====================================================

  const handleExportPDF = useCallback(() => {
    if (filteredData.length === 0) { alert('No data to export'); return }

    const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
    const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
    const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

    let tableRows = ''
    filteredData.forEach((record, index) => {
      const isSunday = record.day === 'Sunday'
      const rowColor = getRowColor(record.checkIn, record.day, record.isOnLeave, record.status)
      const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
      const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)

      tableRows += `
        <tr style="${bgStyle}">
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${index + 1}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.employeeId}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.name}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.department}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.designation}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${shiftDisplay}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.date}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; ${isSunday ? 'font-weight: bold; color: #FF0000;' : ''}">${record.day}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.checkIn}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.checkOut}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.totalHours}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.outsideCheckIn}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.outsideCheckOut}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.outsideTotalHours}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.branch}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.status}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.leaveType || '-'}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.leaveReason || '-'}</td>
        </tr>
      `
    })

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Sheet</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
          <style>
            @page { size: A4 landscape; margin: 8mm 6mm; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #000; font-size: 11px; }
            .print-container { width: 100%; }
            .print-header { text-align: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid #000; }
            .print-header .company-name { font-size: 13px; font-weight: 700; text-transform: uppercase; }
            .print-header .title { font-size: 11px; font-weight: 700; margin-top: 2px; }
            .print-header .sub-info { font-size: 8px; margin-top: 3px; font-weight: 500; }
            .print-header .date-range { font-size: 8px; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; font-size: 8px; margin-top: 3px; }
            table thead th { background: #C4BD97; font-weight: 700; text-align: center; padding: 4px 3px; border: 1px solid #000; text-transform: uppercase; font-size: 7px; white-space: nowrap; }
            table tbody td { padding: 3px 4px; border: 1px solid #000; vertical-align: middle; text-align: center; font-size: 8px; }
            .print-footer { margin-top: 8px; padding-top: 5px; border-top: 1px solid #000; text-align: center; font-size: 7px; }
            @media print {
              table thead th { background: #C4BD97 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              tr[style*="background-color"] td { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              tr[style*="background-color"] { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="print-header">
              <div class="company-name">A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</div>
              <div class="title">EMPLOYEE ATTENDANCE SHEET</div>
              <div class="sub-info">${employeeName} | ${deptName} | ${branchName}</div>
              <div class="date-range">${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width:1%">#</th>
                  <th style="width:2%">Emp ID</th>
                  <th style="width:5%">Name</th>
                  <th style="width:3%">Dept</th>
                  <th style="width:4%">Designation</th>
                  <th style="width:5%">Shift</th>
                  <th style="width:3%">Date</th>
                  <th style="width:3%">Day</th>
                  <th style="width:3%">Check In</th>
                  <th style="width:3%">Check Out</th>
                  <th style="width:3%">Hours</th>
                  <th style="width:3%">Total Hours</th>
                  <th style="width:3%">OS Check In</th>
                  <th style="width:3%">OS Check Out</th>
                  <th style="width:3%">OS Hours</th>
                  <th style="width:3%">Company</th>
                  <th style="width:3%">Status</th>
                  <th style="width:3%">Leave Type</th>
                  <th style="width:4%">Leave Reason</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
            <div class="print-footer">
              <span>This sheet is generated by system software | A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</span>
            </div>
          </div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (!printWindow) { alert('Please allow popups for PDF'); return }
    printWindow.document.write(html)
    printWindow.document.close()
    setShowExportMenu(false)
    setExportSuccess('PDF ready — use "Save as PDF" in print dialog')
    setTimeout(() => setExportSuccess(null), 4000)
  }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getRowColor, fromDate, toDate, formatDateForDisplay])

  // =====================================================
  // Monthly Summary Calculator — SHIFT-BASED LATE HOURS
  // =====================================================

  const calculateMonthlySummaries = useCallback((): MonthlySummary[] => {
    if (filteredData.length === 0) return []

    const groups: Record<string, AttendanceRecord[]> = {}

    filteredData.forEach(r => {
      const isoDate = displayDateToISO(r.date)
      if (!isoDate) return
      const monthKey = isoDate.substring(0, 7)
      const key = `${r.employeeId}__${monthKey}`
      if (!groups[key]) groups[key] = []
      groups[key].push(r)
    })

    const summaries: MonthlySummary[] = []

    Object.entries(groups).forEach(([, records]) => {
      if (records.length === 0) return

      const first = records[0]
      const isoDate = displayDateToISO(first.date)
      const monthKey = isoDate.substring(0, 7)

      const [yearStr, monthStr] = monthKey.split('-')
      const year = parseInt(yearStr)
      const month = parseInt(monthStr)
      const totalMonthDays = new Date(year, month, 0).getDate()

      let presentDays = 0
      let absentDays = 0
      let approvedLeaves = 0
      let lateHoursTotal = 0
      let overtimeHoursTotal = 0

      const shiftHours = getShiftTotalHours(first.shiftTiming)

      records.forEach(r => {
        if (r.status === 'Absent') absentDays += 1
        else if (r.status === 'Leave') approvedLeaves += 1
        else presentDays += 1

        if (
          r.day !== 'Sunday' &&
          r.status !== 'Off' &&
          r.status !== 'Leave' &&
          r.status !== 'Absent'
        ) {
          const workedHours = parseHoursToDecimal(r.totalHoursWithOS)

          if (workedHours > 0 && workedHours < shiftHours) {
            lateHoursTotal += (shiftHours - workedHours)
          }

          if (workedHours > shiftHours) {
            overtimeHoursTotal += (workedHours - shiftHours)
          }
        }
      })

      summaries.push({
        user_id: first.employeeId,
        name: first.name,
        department: first.department || null,
        designation: first.designation || null,
        shift: getShiftDisplay(first.shiftTiming, first.shift),
        month: monthKey,
        total_month_days: totalMonthDays,
        total_present: Math.round(presentDays * 100) / 100,
        total_absent: Math.round(absentDays * 100) / 100,
        approved_leaves: Math.round(approvedLeaves * 100) / 100,
        late_hours: Math.round(lateHoursTotal * 100) / 100,
        overtime_hours: Math.round(overtimeHoursTotal * 100) / 100,
        company: first.branch || 'Korangi'
      })
    })

    return summaries
  }, [filteredData, displayDateToISO, parseHoursToDecimal])

  // =====================================================
  // EXPORT: FOR PAYROLL
  // =====================================================

  const handleExportForPayroll = useCallback(async () => {
    if (filteredData.length === 0) {
      alert('No data to submit')
      return
    }

    const summaries = calculateMonthlySummaries()

    console.log('📊 Monthly Summaries to submit:', summaries)
    console.log('ℹ️ Late hours = shift timing se kam kaam')

    if (summaries.length === 0) {
      alert('Could not calculate summaries — check date range')
      return
    }

    if (!confirm(
      `Submit ${summaries.length} monthly summary record(s) to attendance_sheet?\n\n` +
      `Late hours = shift timing se kam kaam karne par\n` +
      `Existing records with same (user_id + month + company) will be UPDATED.`
    )) {
      return
    }

    try {
      setSubmittingPayroll(true)
      setError(null)

      const { data, error: upsertError } = await supabase
        .from('attendance_sheet')
        .upsert(summaries, {
          onConflict: 'user_id,month,company',
          ignoreDuplicates: false
        })
        .select()

      if (upsertError) throw new Error(upsertError.message)

      setShowExportMenu(false)
      setExportSuccess(`✅ ${data?.length || summaries.length} monthly record(s) submitted to attendance_sheet`)
      setTimeout(() => setExportSuccess(null), 5000)
    } catch (err: any) {
      console.error('❌ Payroll submit error:', err)
      setError(err.message || 'Failed to submit to attendance_sheet')
    } finally {
      setSubmittingPayroll(false)
    }
  }, [filteredData, calculateMonthlySummaries])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false)
      }
    }
    if (showExportMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportMenu])

  // =====================================================
  // handlePrintWithColor
  // =====================================================

  const handlePrintWithColor = useCallback((withColor: boolean) => {
    setShowPrintOptions(false)

    const data = filteredData
    const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
    const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
    const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

    const getRowColorForPrint = (record: AttendanceRecord) => {
      if (!withColor) return 'transparent'
      return getRowColor(record.checkIn, record.day, record.isOnLeave, record.status)
    }

    let tableRows = ''
    data.forEach((record, index) => {
      const isSunday = record.day === 'Sunday'
      const rowColor = getRowColorForPrint(record)
      const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
      const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)

      tableRows += `
        <tr style="${bgStyle}">
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${index + 1}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.employeeId}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.name}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.department}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.designation}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${shiftDisplay}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.date}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; ${isSunday ? 'font-weight: bold; color: #FF0000;' : ''}">${record.day}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.checkIn}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.checkOut}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.totalHours}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.outsideCheckIn}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.outsideCheckOut}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.outsideTotalHours}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.branch}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.status}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.leaveType || '-'}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.leaveReason || '-'}</td>
        </tr>
      `
    })

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Sheet - ${employeeName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
          <style>
            @page { size: A4 landscape; margin: 5mm 4mm; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #000; font-size: 11px; }
            .print-container { width: 100%; padding: 0; }
            .print-header { text-align: center; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 2px solid #000; }
            .print-header .company-name { font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .print-header .title { font-size: 10px; font-weight: 700; margin-top: 1px; }
            .print-header .sub-info { font-size: 7px; margin-top: 2px; font-weight: 500; }
            .print-header .date-range { font-size: 7px; margin-top: 1px; }
            table { width: 100%; border-collapse: collapse; font-size: 7px; margin-top: 2px; }
            table thead th { background: #C4BD97; font-weight: 700; text-align: center; padding: 3px 2px; border: 1px solid #000; text-transform: uppercase; font-size: 6px; white-space: nowrap; }
            table tbody td { padding: 2px 3px; border: 1px solid #000; vertical-align: middle; text-align: center; font-size: 7px; }
            .print-footer { margin-top: 6px; padding-top: 4px; border-top: 1px solid #000; text-align: center; font-size: 6px; }
            @media print {
              table thead th { background: #C4BD97 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              tr[style*="background-color"] td { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              tr[style*="background-color"] { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="print-header">
              <div class="company-name">A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</div>
              <div class="title">EMPLOYEE ATTENDANCE SHEET</div>
              <div class="sub-info">${employeeName} | ${deptName} | ${branchName}</div>
              <div class="date-range">${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width:1%">#</th>
                  <th style="width:2%">Emp ID</th>
                  <th style="width:5%">Name</th>
                  <th style="width:3%">Dept</th>
                  <th style="width:4%">Designation</th>
                  <th style="width:5%">Shift</th>
                  <th style="width:3%">Date</th>
                  <th style="width:3%">Day</th>
                  <th style="width:3%">Check In</th>
                  <th style="width:3%">Check Out</th>
                  <th style="width:3%">Hours</th>
                  <th style="width:3%">Total Hours</th>
                  <th style="width:3%">OS Check In</th>
                  <th style="width:3%">OS Check Out</th>
                  <th style="width:3%">OS Hours</th>
                  <th style="width:3%">Company</th>
                  <th style="width:3%">Status</th>
                  <th style="width:3%">Leave Type</th>
                  <th style="width:4%">Leave Reason</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
            <div class="print-footer">
              <span>This sheet is generated by system software | A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</span>
            </div>
          </div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (!printWindow) { alert('Please allow popups for printing'); return }
    printWindow.document.write(printHTML)
    printWindow.document.close()
  }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getRowColor, fromDate, toDate, formatDateForDisplay])

  useEffect(() => {
    isMounted.current = true
    fetchData()
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    setFromDate(firstDay.toISOString().split('T')[0])
    setToDate(lastDay.toISOString().split('T')[0])
    return () => { isMounted.current = false }
  }, [fetchData])

  useEffect(() => {
    if (employees.length > 0 && fromDate && toDate) generateAttendanceSheet()
  }, [employees, fromDate, toDate, selectedDepartment, selectedBranch, selectedEmployee, generateAttendanceSheet])

  const summary = getSummary()

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
        <Loader className="w-12 h-12 animate-spin text-[#0071BD]" />
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
          <button onClick={fetchData} className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] tracking-wider">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <ProtectedRoute allowedUser='hr'>
        <NavbarDropdown />
        <div className={`min-h-screen bg-gray-50 p-2 ${roboto.className}`}>
          <div className="max-w-full mx-auto">
            <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h1 className="text-lg font-bold text-[#0071BD] tracking-wider">Attendance Sheet</h1>
                <p className="text-[10px] text-gray-500 tracking-wide">
                  {selectedEmployee === 'all' ? 'All employees' : getSelectedEmployeeName()}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">K: {dataSource.K}</span>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">PQ: {dataSource.PQ}</span>

                <button onClick={fetchData} className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 flex items-center gap-1 tracking-wider">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>

                <div className="relative" ref={exportMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={submittingPayroll || filteredData.length === 0}
                    className="px-2 py-1 text-xs bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingPayroll ? <Loader className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                    {submittingPayroll ? 'Submitting...' : 'Export'}
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showExportMenu && (
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 shadow-lg rounded z-50">
                      <button onClick={handleExportCSV}
                        className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
                        <span>Export as CSV</span>
                      </button>
                      <button onClick={handleExportPDF}
                        className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100">
                        <FileText className="w-3.5 h-3.5 text-red-600" />
                        <span>Export as PDF</span>
                      </button>
                      <button onClick={handleExportForPayroll}
                        className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100">
                        <Calculator className="w-3.5 h-3.5 text-blue-600" />
                        <span>For Payroll</span>
                      </button>
                    </div>
                  )}
                </div>

                <button onClick={() => setShowPrintOptions(true)} className="px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 tracking-wider">
                  <Printer className="w-3 h-3" /> Print
                </button>
              </div>
            </div>

            {exportSuccess && (
              <div className="mb-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4" /> {exportSuccess}
              </div>
            )}

            {error && (
              <div className="mb-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {showPrintOptions && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wider flex items-center gap-2">
                      <Printer className="w-5 h-5 text-[#0071BD]" /> Print Options
                    </h2>
                    <button onClick={() => setShowPrintOptions(false)} className="p-1 hover:bg-gray-200 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 tracking-wide mb-4">Select print style:</p>
                  <div className="space-y-3">
                    <button onClick={() => handlePrintWithColor(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 border-2 border-blue-600 rounded-lg hover:bg-blue-50">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Palette className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800 tracking-wide">With Colors</p>
                        <p className="text-xs text-gray-500">Show time-based colors + gray for Off days</p>
                      </div>
                    </button>
                    <button onClick={() => handlePrintWithColor(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800 tracking-wide">Without Colors</p>
                        <p className="text-xs text-gray-500">Plain white background</p>
                      </div>
                    </button>
                  </div>
                  <button onClick={() => setShowPrintOptions(false)}
                    className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 tracking-wider text-sm rounded-lg">Cancel</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-6 gap-1.5 mb-2">
              <div className="bg-white shadow-sm p-1.5">
                <div className="text-[10px] text-[#0071BD] tracking-wide">Total</div>
                <div className="text-base font-bold text-[#0071BD] tracking-wider">{summary.total}</div>
              </div>
              <div className="bg-white shadow-sm p-1.5">
                <div className="text-[10px] text-green-600 tracking-wide flex items-center gap-0.5">
                  <UserCheck className="w-2.5 h-2.5" /> P
                </div>
                <div className="text-base font-bold text-green-700 tracking-wider">{summary.present}</div>
              </div>
              <div className="bg-white shadow-sm p-1.5">
                <div className="text-[10px] text-red-600 tracking-wide flex items-center gap-0.5">
                  <UserX className="w-2.5 h-2.5" /> A
                </div>
                <div className="text-base font-bold text-red-700 tracking-wider">{summary.absent}</div>
              </div>
              <div className="bg-white shadow-sm p-1.5">
                <div className="text-[10px] text-blue-600 tracking-wide flex items-center gap-0.5">
                  <UserMinus className="w-2.5 h-2.5" /> L
                </div>
                <div className="text-base font-bold text-blue-700 tracking-wider">{summary.leave}</div>
              </div>
              <div className="bg-white shadow-sm p-1.5">
                <div className="text-[10px] text-yellow-600 tracking-wide flex items-center gap-0.5">
                  <UserPlus className="w-2.5 h-2.5" /> H
                </div>
                <div className="text-base font-bold text-yellow-700 tracking-wider">{summary.halfDay}</div>
              </div>
              <div className="bg-white shadow-sm p-1.5">
                <div className="text-[10px] text-gray-600 tracking-wide flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" /> OFF
                </div>
                <div className="text-base font-bold text-gray-700 tracking-wider">{summary.off}</div>
              </div>
            </div>

            <div className="bg-white text-black shadow-sm p-1.5 mb-2">
              <button onClick={() => setExpandedFilters(!expandedFilters)}
                className="flex items-center gap-1 text-gray-700 hover:text-[#0071BD] tracking-wider text-xs">
                <Filter className="w-3 h-3" />
                {expandedFilters ? 'Hide Filters' : 'Show Filters'}
                {expandedFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {expandedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mt-2">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">From Date</label>
                    <div className="relative">
                      <Calendar className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                        className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">To Date</label>
                    <div className="relative">
                      <Calendar className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                        className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Department</label>
                    <div className="relative">
                      <Building className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
                        <option value="all">All Departments</option>
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Branch</label>
                    <div className="relative">
                      <MapPin className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
                        <option value="all">All Branches</option>
                        {branches.map(b => <option key={b} value={b}>{getBranchDisplayName(b)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Employee</label>
                    <div className="relative">
                      <User className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
                        <option value="all">All Employees</option>
                        {employeeNames.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.id}) - {getBranchDisplayName(emp.source)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* ✅ NEW: Status filter */}
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Status</label>
                    <div className="relative">
                      <Filter className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
                        <option value="all">All Status</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">Leave</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Off">Off</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['#','Emp ID','Name','Dept','Designation','Shift','Date','Day','Check In','Check Out','Hours','Total Hours','OS Check In','OS Check Out','OS Hours','Company','Status','Leave Type','Leave Reason'].map(h => (
                        <th key={h} className="px-1.5 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={19} className="px-2 py-3 text-center text-gray-500 text-xs">
                          <div className="flex flex-col items-center gap-1">
                            <Users className="w-6 h-6 text-gray-300" />
                            <p className="tracking-wide">No data found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((record, index) => {
                        const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)
                        return (
                          <tr key={index} className={`transition ${record.status === 'Off' ? 'bg-gray-200' : 'hover:bg-gray-50'}`}>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-500 whitespace-nowrap">{index + 1}</td>
                            <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap">{record.employeeId}</td>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-700 whitespace-nowrap">{record.name}</td>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.department}</td>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.designation}</td>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-700 whitespace-nowrap font-medium">
                              {shiftDisplay !== '-' ? (
                                <span className="px-1 py-0.5 text-[9px] font-bold tracking-wide rounded bg-blue-100 text-blue-700">
                                  {shiftDisplay}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.date}</td>
                            <td className={`px-1.5 py-0.5 text-[10px] whitespace-nowrap ${record.day === 'Sunday' ? 'font-bold text-red-600' : 'text-gray-600'}`}>{record.day}</td>
                            <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
                              {record.hasCheckIn ? (
                                <div className="flex items-center gap-0.5">
                                  <LogIn className="w-3 h-3 text-green-500 flex-shrink-0" />
                                  <span className="text-gray-700 font-medium">{record.checkIn}</span>
                                </div>
                              ) : <span className="text-gray-400">-</span>}
                            </td>
                            <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
                              {record.hasCheckOut ? (
                                <div className="flex items-center gap-0.5">
                                  <LogOut className="w-3 h-3 text-red-500 flex-shrink-0" />
                                  <span className="text-gray-700 font-medium">{record.checkOut}</span>
                                </div>
                              ) : <span className="text-gray-400">-</span>}
                            </td>
                            <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap text-center">{record.totalHours}</td>
                            <td className="px-1.5 py-0.5 text-[10px] font-bold text-blue-700 whitespace-nowrap text-center">{record.totalHoursWithOS}</td>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.outsideCheckIn}</td>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.outsideCheckOut}</td>
                            <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap text-center">{record.outsideTotalHours}</td>
                            <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
                              <span className={`px-1 py-0.5 text-[9px] font-medium tracking-wide rounded-full ${
                                record.branchCode === 'PQ'
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : 'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}>
                                {record.branch}
                              </span>
                            </td>
                            <td className="px-1.5 py-0.5 whitespace-nowrap">
                              <span className={`px-1 py-0.5 text-[9px] font-medium tracking-wide rounded-full ${
                                record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                record.status === 'Leave' ? 'bg-blue-100 text-blue-700' :
                                record.status === 'Off' ? 'bg-gray-300 text-gray-800 font-bold' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.leaveType || '-'}</td>
                            <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.leaveReason || '-'}</td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredData.length > 0 && (
              <div className="mt-1.5 bg-white shadow-sm p-1.5">
                <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-600 tracking-wide">
                  <div>{filteredData.length} records</div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-green-500 rounded"></span> P: {summary.present}</span>
                    <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-red-500 rounded"></span> A: {summary.absent}</span>
                    <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-blue-500 rounded"></span> L: {summary.leave}</span>
                    <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-yellow-500 rounded"></span> H: {summary.halfDay}</span>
                    <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-gray-400 rounded"></span> OFF: {summary.off}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              <div className="bg-white shadow-sm p-1.5">
                <div className="flex items-center gap-1 text-[10px] text-gray-600">
                  <Users className="w-3 h-3 text-[#0071BD]" />
                  <span className="font-medium">Employees</span>
                </div>
                <div className="text-base font-bold text-[#0071BD]">{employees.length}</div>
              </div>
              <div className="bg-white shadow-sm p-1.5">
                <div className="flex items-center gap-1 text-[10px] text-gray-600">
                  <Calendar className="w-3 h-3 text-[#0071BD]" />
                  <span className="font-medium">Range</span>
                </div>
                <div className="text-[10px] font-medium text-gray-700">
                  {formatDate(fromDate)} - {formatDate(toDate)}
                </div>
              </div>
              <div className="bg-white shadow-sm p-1.5">
                <div className="flex items-center gap-1 text-[10px] text-gray-600">
                  <Building className="w-3 h-3 text-[#0071BD]" />
                  <span className="font-medium">Depts</span>
                </div>
                <div className="text-base font-medium text-gray-700">{departments.length}</div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    </>
  )
}