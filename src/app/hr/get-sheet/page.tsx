// // // app/hr/get-sheet/page.tsx
// // 'use client'

// // import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react'
// // import Footer from '@/components/footer'
// // import ProtectedRoute from '@/components/ProtectedRoute'
// // import { createClient } from '@supabase/supabase-js'
// // import NavbarDropdown from '@/components/navbar'
// // import {
// //   RefreshCw,
// //   Calendar,
// //   Users,
// //   Building,
// //   Filter,
// //   ChevronDown,
// //   ChevronUp,
// //   User,
// //   Loader,
// //   UserCheck,
// //   UserX,
// //   UserMinus,
// //   UserPlus,
// //   Printer,
// //   MapPin,
// //   AlertCircle,
// //   Palette,
// //   FileText,
// //   LogIn,
// //   LogOut,
// //   Clock,
// //   Download,
// //   FileSpreadsheet,
// //   Calculator,
// //   CheckCircle2
// // } from 'lucide-react'

// // import { Roboto } from 'next/font/google'

// // const roboto = Roboto({
// //   weight: ['100', '300', '400', '500', '700', '900'],
// //   style: ['normal', 'italic'],
// //   subsets: ['latin'],
// //   display: 'swap',
// // })

// // interface Employee {
// //   id: string
// //   employee_id: string
// //   full_name: string
// //   department: string
// //   position: string
// //   father_name?: string
// //   cnic_number?: string
// //   phone_number?: string
// //   emergency_contact?: string
// //   date_of_birth?: string
// //   marital_status?: string
// //   residential_address?: string
// //   joining_date?: string
// //   source?: 'K' | 'PQ'
// //   enable_attendance?: boolean
// //   enable_site_visits?: boolean
// //   shift?: 'A' | 'B' | null
// //   shift_timing?: string | null
// //   check_in?: any
// //   check_out?: any
// //   site_visits?: any
// //   qualifications?: any
// //   experience?: any
// //   leaves?: any
// // }

// // interface AttendanceLog {
// //   id: number
// //   user_id: string
// //   employee_name: string
// //   timestamp: string
// //   punch_type: 'CHECK_IN' | 'CHECK_OUT' | null
// //   device_id: string
// //   branch_code: string
// //   raw_log_key: string
// //   created_at: string
// //   source?: 'K' | 'PQ'
// // }

// // interface AttendanceRecord {
// //   employeeId: string
// //   name: string
// //   fatherName: string
// //   cnic: string
// //   phoneNumber: string
// //   emergencyContact: string
// //   dob: string
// //   maritalStatus: string
// //   address: string
// //   department: string
// //   designation: string
// //   joiningDate: string
// //   date: string
// //   day: string
// //   checkIn: string
// //   checkOut: string
// //   checkInTime: string
// //   checkOutTime: string
// //   totalHours: string
// //   checkInLocation: string
// //   checkOutLocation: string
// //   status: 'Present' | 'Absent' | 'Leave' | 'Half Day' | 'Off'
// //   leaveType?: string
// //   leaveReason?: string
// //   qualifications: string
// //   experience: string
// //   isOnLeave: boolean
// //   hasCheckIn: boolean
// //   hasCheckOut: boolean
// //   outsideCheckIn: string
// //   outsideCheckOut: string
// //   outsideTotalHours: string
// //   outsideCheckInTime: string
// //   outsideCheckOutTime: string
// //   branch: string
// //   branchCode: 'K' | 'PQ'
// //   totalHoursWithOS: string
// //   shift?: string
// //   shiftTiming?: string
// //   siteVisitCount: number
// //   siteVisitDetails: string
// //   svCheckIn: string
// //   svCheckOut: string
// // }

// // interface MonthlySummary {
// //   user_id: string
// //   name: string
// //   department: string | null
// //   designation: string | null
// //   shift: string | null
// //   month: string
// //   total_month_days: number
// //   total_present: number
// //   total_absent: number
// //   approved_leaves: number
// //   late_hours: number
// //   overtime_hours: number
// //   company: string
// // }

// // const supabase = createClient(
// //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// // )

// // const getBranchDisplayName = (source: string | undefined) => {
// //   if (source === 'PQ') return 'Port Qasim'
// //   if (source === 'K') return 'Korangi'
// //   return 'Korangi'
// // }

// // const to12HourFormat = (time24: string): string => {
// //   if (!time24) return ''
// //   const trimmed = time24.trim()
// //   if (/AM|PM/i.test(trimmed)) return trimmed.toUpperCase()
// //   const match = trimmed.match(/^(\d{1,2}):(\d{2})/)
// //   if (!match) return trimmed
// //   let hours = parseInt(match[1])
// //   const minutes = match[2]
// //   const ampm = hours >= 12 ? 'PM' : 'AM'
// //   hours = hours % 12
// //   if (hours === 0) hours = 12
// //   return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
// // }

// // const getShiftDisplay = (shiftTiming: string | null | undefined, _shift?: string | null) => {
// //   if (!shiftTiming || !String(shiftTiming).trim()) return '-'
// //   const raw = String(shiftTiming).trim()
// //   const parts = raw.split(/\s*-\s*/)
// //   if (parts.length === 2) {
// //     const start = to12HourFormat(parts[0])
// //     const end = to12HourFormat(parts[1])
// //     return `${start} - ${end}`
// //   }
// //   return to12HourFormat(raw)
// // }

// // const getShiftTotalHours = (shiftTiming: string | null | undefined): number => {
// //   if (!shiftTiming) return 8
// //   const raw = String(shiftTiming).trim()
// //   const parts = raw.split(/\s*-\s*/)
// //   if (parts.length !== 2) return 8

// //   const parseTime = (t: string): number => {
// //     const trimmed = t.trim().toUpperCase()
// //     const ampmMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
// //     if (ampmMatch) {
// //       let h = parseInt(ampmMatch[1])
// //       const m = parseInt(ampmMatch[2])
// //       const ampm = ampmMatch[3]
// //       if (ampm === 'PM' && h !== 12) h += 12
// //       if (ampm === 'AM' && h === 12) h = 0
// //       return h * 60 + m
// //     }
// //     const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/)
// //     if (match24) {
// //       return parseInt(match24[1]) * 60 + parseInt(match24[2])
// //     }
// //     return -1
// //   }

// //   const startMin = parseTime(parts[0])
// //   const endMin = parseTime(parts[1])
// //   if (startMin < 0 || endMin < 0) return 8

// //   let diffMin = endMin - startMin
// //   if (diffMin < 0) diffMin += 24 * 60

// //   return diffMin / 60
// // }

// // const toLocalDateStr = (isoTimestamp: string): string => {
// //   if (!isoTimestamp) return ''
// //   try {
// //     const d = new Date(isoTimestamp)
// //     if (isNaN(d.getTime())) return ''
// //     const y = d.getFullYear()
// //     const m = String(d.getMonth() + 1).padStart(2, '0')
// //     const day = String(d.getDate()).padStart(2, '0')
// //     return `${y}-${m}-${day}`
// //   } catch {
// //     return ''
// //   }
// // }

// // const safeParseArray = (raw: any): any[] => {
// //   if (!raw) return []
// //   try {
// //     let val = raw
// //     if (typeof val === 'string') {
// //       val = JSON.parse(val)
// //     }
// //     if (Array.isArray(val)) return val
// //     if (val && typeof val === 'object') {
// //       if (Array.isArray(val.visits)) return val.visits
// //       if (Array.isArray(val.data)) return val.data
// //       if (Array.isArray(val.items)) return val.items
// //       const keys = Object.keys(val)
// //       if (keys.length > 0) {
// //         return keys.map(k => ({ ...val[k], _key: k }))
// //       }
// //     }
// //     return []
// //   } catch {
// //     return []
// //   }
// // }

// // const parseTimeToMinutes = (val: string): number | null => {
// //   if (!val || val === '-') return null
// //   const s = String(val).trim()

// //   if (s.length > 10 && /T\d/.test(s)) {
// //     const d = new Date(s)
// //     if (!isNaN(d.getTime())) return d.getHours() * 60 + d.getMinutes()
// //   }

// //   const ampmMatch = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i)
// //   if (ampmMatch) {
// //     let h = parseInt(ampmMatch[1])
// //     const m = parseInt(ampmMatch[2])
// //     const ampm = ampmMatch[4].toUpperCase()
// //     if (ampm === 'PM' && h !== 12) h += 12
// //     if (ampm === 'AM' && h === 12) h = 0
// //     return h * 60 + m
// //   }

// //   const m24 = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
// //   if (m24) {
// //     const h = parseInt(m24[1])
// //     const m = parseInt(m24[2])
// //     if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
// //       return h * 60 + m
// //     }
// //   }

// //   return null
// // }

// // const formatSiteVisitTime = (val: string): string => {
// //   if (!val || !String(val).trim()) return '-'
// //   const s = String(val).trim()
// //   if (s === '-') return '-'

// //   if (s.length > 10 && /T\d/.test(s)) {
// //     const d = new Date(s)
// //     if (!isNaN(d.getTime())) {
// //       return d.toLocaleTimeString('en-US', {
// //         hour: '2-digit',
// //         minute: '2-digit',
// //         hour12: true,
// //       })
// //     }
// //   }

// //   if (/AM|PM/i.test(s)) return s.toUpperCase()

// //   const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
// //   if (m) {
// //     let h = parseInt(m[1])
// //     const min = m[2]
// //     const ampm = h >= 12 ? 'PM' : 'AM'
// //     h = h % 12
// //     if (h === 0) h = 12
// //     return `${String(h).padStart(2, '0')}:${min} ${ampm}`
// //   }

// //   return s
// // }

// // function useDebounce<T>(value: T, delay: number): T {
// //   const [debouncedValue, setDebouncedValue] = useState<T>(value)
// //   useEffect(() => {
// //     const handler = setTimeout(() => setDebouncedValue(value), delay)
// //     return () => clearTimeout(handler)
// //   }, [value, delay])
// //   return debouncedValue
// // }

// // const AttendanceRow = memo(({ record, index, shiftDisplay }: {
// //   record: AttendanceRecord
// //   index: number
// //   shiftDisplay: string
// // }) => {
// //   const svIn = record.svCheckIn !== '-' ? formatSiteVisitTime(record.svCheckIn) : '-'
// //   const svOut = record.svCheckOut !== '-' ? formatSiteVisitTime(record.svCheckOut) : '-'

// //   return (
// //     <tr className={`transition ${record.status === 'Off' ? 'bg-gray-200' : 'hover:bg-gray-50'}`}>
// //       <td className="px-1.5 py-0.5 text-[10px] text-gray-500 whitespace-nowrap">{index + 1}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap">{record.employeeId}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] text-gray-700 whitespace-nowrap">{record.name}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.department}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.designation}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] text-gray-700 whitespace-nowrap font-medium">
// //         {shiftDisplay !== '-' ? (
// //           <span className="px-1 py-0.5 text-[9px] font-bold tracking-wide rounded bg-blue-100 text-blue-700">
// //             {shiftDisplay}
// //           </span>
// //         ) : (
// //           <span className="text-gray-400">-</span>
// //         )}
// //       </td>
// //       <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.date}</td>
// //       <td className={`px-1.5 py-0.5 text-[10px] whitespace-nowrap ${record.day === 'Sunday' ? 'font-bold text-red-600' : 'text-gray-600'}`}>{record.day}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
// //         {record.hasCheckIn ? (
// //           <div className="flex items-center gap-0.5">
// //             <LogIn className="w-3 h-3 text-green-500 flex-shrink-0" />
// //             <span className="text-gray-700 font-medium">{record.checkIn}</span>
// //           </div>
// //         ) : <span className="text-gray-400">-</span>}
// //       </td>
// //       <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
// //         {record.hasCheckOut ? (
// //           <div className="flex items-center gap-0.5">
// //             <LogOut className="w-3 h-3 text-red-500 flex-shrink-0" />
// //             <span className="text-gray-700 font-medium">{record.checkOut}</span>
// //           </div>
// //         ) : <span className="text-gray-400">-</span>}
// //       </td>
// //       <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap text-center">{record.totalHours}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] font-bold text-blue-700 whitespace-nowrap text-center">{record.totalHoursWithOS}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] font-bold text-orange-600 whitespace-nowrap text-center">{svIn}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] font-bold text-orange-600 whitespace-nowrap text-center">{svOut}</td>
// //       <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
// //         <span className={`px-1 py-0.5 text-[9px] font-medium tracking-wide rounded-full ${
// //           record.branchCode === 'PQ'
// //             ? 'bg-purple-100 text-purple-700 border border-purple-200'
// //             : 'bg-blue-100 text-blue-700 border border-blue-200'
// //         }`}>
// //           {record.branch}
// //         </span>
// //       </td>
// //       <td className="px-1.5 py-0.5 whitespace-nowrap">
// //         <span className={`px-1 py-0.5 text-[9px] font-medium tracking-wide rounded-full ${
// //           record.status === 'Present' ? 'bg-green-100 text-green-700' :
// //           record.status === 'Absent' ? 'bg-red-100 text-red-700' :
// //           record.status === 'Leave' ? 'bg-blue-100 text-blue-700' :
// //           record.status === 'Off' ? 'bg-gray-300 text-gray-800 font-bold' :
// //           'bg-yellow-100 text-yellow-700'
// //         }`}>
// //           {record.status}
// //         </span>
// //       </td>
// //       <td className="px-1.5 py-0.5 text-[10px] text-center whitespace-nowrap">
// //         {record.siteVisitCount > 0 ? (
// //           <span className="px-1 py-0.5 text-[9px] font-bold rounded bg-orange-100 text-orange-700">
// //             {record.siteVisitCount}
// //           </span>
// //         ) : (
// //           <span className="text-gray-400">-</span>
// //         )}
// //       </td>
// //       <td className="px-1.5 py-0.5 text-[9px] text-gray-600 max-w-[320px] truncate" title={record.siteVisitDetails}>
// //         {record.siteVisitDetails}
// //       </td>
// //     </tr>
// //   )
// // })

// // AttendanceRow.displayName = 'AttendanceRow'

// // export default function GetSheetPage() {
// //   const [employees, setEmployees] = useState<Employee[]>([])
// //   const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState<string | null>(null)
// //   const [fromDate, setFromDate] = useState('')
// //   const [toDate, setToDate] = useState('')
// //   const [selectedDepartment, setSelectedDepartment] = useState('all')
// //   const [departments, setDepartments] = useState<string[]>([])
// //   const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
// //   const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([])
// //   const [expandedFilters, setExpandedFilters] = useState(false)
// //   const [selectedEmployee, setSelectedEmployee] = useState<string>('all')
// //   const [employeeNames, setEmployeeNames] = useState<{ id: string, name: string, department: string, source: string }[]>([])
// //   const [showPrintOptions, setShowPrintOptions] = useState(false)
// //   const [dataSource, setDataSource] = useState<{ K: number; PQ: number }>({ K: 0, PQ: 0 })

// //   const [showExportMenu, setShowExportMenu] = useState(false)
// //   const [submittingPayroll, setSubmittingPayroll] = useState(false)
// //   const [exportSuccess, setExportSuccess] = useState<string | null>(null)

// //   const [selectedBranch, setSelectedBranch] = useState<string>('all')
// //   const [branches, setBranches] = useState<string[]>(['K', 'PQ'])
// //   const [selectedStatus, setSelectedStatus] = useState<string>('all')

// //   const debouncedFromDate = useDebounce(fromDate, 300)
// //   const debouncedToDate = useDebounce(toDate, 300)

// //   const isMounted = useRef(true)
// //   const exportMenuRef = useRef<HTMLDivElement | null>(null)

// //   // =====================================================
// //   // Helpers
// //   // =====================================================

// //   const getDayName = useCallback((dateStr: string) => {
// //     const date = new Date(dateStr + 'T00:00:00')
// //     return date.toLocaleDateString('en-US', { weekday: 'long' })
// //   }, [])

// //   const formatTime = useCallback((timestamp: string) => {
// //     if (!timestamp) return '-'
// //     try {
// //       const date = new Date(timestamp)
// //       return date.toLocaleTimeString('en-US', {
// //         hour: '2-digit',
// //         minute: '2-digit',
// //         second: '2-digit',
// //         hour12: true
// //       })
// //     } catch {
// //       return '-'
// //     }
// //   }, [])

// //   const formatDate = useCallback((dateStr: string) => {
// //     if (!dateStr) return '-'
// //     try {
// //       const date = new Date(dateStr + 'T00:00:00')
// //       return date.toLocaleDateString('en-US', {
// //         year: 'numeric',
// //         month: 'short',
// //         day: 'numeric'
// //       })
// //     } catch {
// //       return '-'
// //     }
// //   }, [])

// //   const formatDateForDisplay = useCallback((dateStr: string) => {
// //     if (!dateStr) return '-'
// //     try {
// //       const date = new Date(dateStr + 'T00:00:00')
// //       return date.toLocaleDateString('en-US', {
// //         year: 'numeric',
// //         month: 'long',
// //         day: 'numeric'
// //       })
// //     } catch {
// //       return '-'
// //     }
// //   }, [])

// //   const displayDateToISO = useCallback((displayDate: string): string => {
// //     if (!displayDate || displayDate === '-') return ''
// //     try {
// //       const d = new Date(displayDate)
// //       if (isNaN(d.getTime())) return ''
// //       const y = d.getFullYear()
// //       const m = String(d.getMonth() + 1).padStart(2, '0')
// //       const day = String(d.getDate()).padStart(2, '0')
// //       return `${y}-${m}-${day}`
// //     } catch {
// //       return ''
// //     }
// //   }, [])

// //   const calculateTotalHours = useCallback((checkIn: string, checkOut: string) => {
// //     if (!checkIn || !checkOut) return '-'
// //     try {
// //       const inTime = new Date(checkIn)
// //       const outTime = new Date(checkOut)
// //       const diffMs = outTime.getTime() - inTime.getTime()
// //       if (diffMs < 0) return '-'
// //       const totalSeconds = Math.floor(diffMs / 1000)
// //       const hours = Math.floor(totalSeconds / 3600)
// //       const minutes = Math.floor((totalSeconds % 3600) / 60)
// //       const seconds = totalSeconds % 60
// //       return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
// //     } catch {
// //       return '-'
// //     }
// //   }, [])

// //   const calculateOutsideHours = useCallback((inTime: string, outTime: string) => {
// //     if (!outTime || !inTime) return '-'
// //     try {
// //       const diffMs = new Date(outTime).getTime() - new Date(inTime).getTime()
// //       if (diffMs < 0) return '-'
// //       const s = Math.floor(diffMs / 1000)
// //       return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
// //     } catch { return '-' }
// //   }, [])

// //   const addThreeDurations = useCallback((a: string, b: string, c: string): string => {
// //     const parse = (h: string): number => {
// //       if (!h || h === '-') return 0
// //       const parts = h.split(':')
// //       const hours = parseInt(parts[0] || '0')
// //       const minutes = parseInt(parts[1] || '0')
// //       const seconds = parseInt(parts[2] || '0')
// //       return hours * 3600 + minutes * 60 + seconds
// //     }
// //     const total = parse(a) + parse(b) + parse(c)
// //     if (total <= 0) return '-'
// //     return `${String(Math.floor(total / 3600)).padStart(2, '0')}:${String(Math.floor((total % 3600) / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
// //   }, [])

// //   const calculateSVHours = useCallback((fromTime: string, toTime: string): string => {
// //     if (!fromTime || !toTime || fromTime === '-' || toTime === '-') return '-'
// //     try {
// //       const fromMin = parseTimeToMinutes(fromTime)
// //       const toMin = parseTimeToMinutes(toTime)
// //       if (fromMin === null || toMin === null) return '-'

// //       let diff = toMin - fromMin
// //       if (diff < 0) diff += 24 * 60

// //       const h = Math.floor(diff / 60)
// //       const mn = diff % 60
// //       return `${String(h).padStart(2, '0')}:${String(mn).padStart(2, '0')}:00`
// //     } catch {
// //       return '-'
// //     }
// //   }, [])

// //   const parseHoursToDecimal = useCallback((h: string): number => {
// //     if (!h || h === '-') return 0
// //     const parts = h.split(':')
// //     const hours = parseInt(parts[0] || '0')
// //     const minutes = parseInt(parts[1] || '0')
// //     const seconds = parseInt(parts[2] || '0')
// //     return hours + minutes / 60 + seconds / 3600
// //   }, [])

// //   const getQualificationsString = useCallback((qualifications: any) => {
// //     const arr = safeParseArray(qualifications)
// //     if (arr.length === 0) return '-'
// //     return arr.map((q: any) => `${q.degree} (${q.institution}, ${q.year}) - ${q.grade}`).join('; ')
// //   }, [])

// //   const getExperienceString = useCallback((experience: any) => {
// //     const arr = safeParseArray(experience)
// //     if (arr.length === 0) return '-'
// //     return arr.map((exp: any) => `${exp.position} at ${exp.company}`).join('; ')
// //   }, [])

// //   // =====================================================
// //   // SITE VISITS
// //   // =====================================================
// //   const getSiteVisitsForDate = useCallback((employee: Employee, dateStr: string) => {
// //     const visits = safeParseArray(employee.site_visits)

// //     if (visits.length === 0) {
// //       return {
// //         count: 0,
// //         entries: [] as string[],
// //         svCheckIn: '-',
// //         svCheckOut: '-',
// //       }
// //     }

// //     const dayVisits = visits.filter((v: any) => {
// //       if (!v) return false

// //       const visitDateRaw =
// //         v.visitDate ||
// //         v.visit_date ||
// //         v.fromTime ||
// //         v.from_time ||
// //         v.from ||
// //         v.time ||
// //         v.date ||
// //         v.timestamp ||
// //         v._key ||
// //         ''

// //       if (!visitDateRaw) return false

// //       const visitDate = toLocalDateStr(String(visitDateRaw))
// //       return visitDate === dateStr
// //     })

// //     const entries = dayVisits.map((v: any) => {
// //       const fromRaw = v.fromTime || v.from_time || v.from || v.time || ''
// //       const toRaw = v.toTime || v.to_time || v.to || ''
// //       const company = v.companyName || v.company_name || v.company || v.site || v.name || ''

// //       const fromFmt = fromRaw ? formatSiteVisitTime(String(fromRaw)) : ''
// //       const toFmt = toRaw ? formatSiteVisitTime(String(toRaw)) : ''

// //       const timeRange = fromFmt && toFmt
// //         ? `${fromFmt} - ${toFmt}`
// //         : fromFmt || toFmt || ''

// //       if (company && timeRange) return `${company} (${timeRange})`
// //       if (company) return company
// //       if (timeRange) return timeRange
// //       return '-'
// //     })

// //     let earliestFrom: string | null = null
// //     let earliestFromMs = Infinity
// //     let latestTo: string | null = null
// //     let latestToMs = -Infinity

// //     dayVisits.forEach((v: any) => {
// //       const fromRaw = v.fromTime || v.from_time || v.from || v.time || ''
// //       const toRaw = v.toTime || v.to_time || v.to || ''

// //       const fromStr = String(fromRaw || '').trim()
// //       const toStr = String(toRaw || '').trim()

// //       if (fromStr) {
// //         const mins = parseTimeToMinutes(fromStr)
// //         if (mins !== null && mins < earliestFromMs) {
// //           earliestFromMs = mins
// //           earliestFrom = fromStr
// //         }
// //       }

// //       if (toStr) {
// //         const mins = parseTimeToMinutes(toStr)
// //         if (mins !== null && mins > latestToMs) {
// //           latestToMs = mins
// //           latestTo = toStr
// //         }
// //       }
// //     })

// //     return {
// //       count: dayVisits.length,
// //       entries,
// //       svCheckIn: earliestFrom || '-',
// //       svCheckOut: latestTo || '-',
// //     }
// //   }, [])

// //   const getEmployeeAttendance = useCallback((employee: Employee, date: string, logs: AttendanceLog[]): AttendanceRecord => {
// //     const dateStr = date
// //     const dayName = getDayName(dateStr)

// //     const siteVisitData = getSiteVisitsForDate(employee, dateStr)
// //     const siteVisitCount = siteVisitData.count
// //     const siteVisitDetails = siteVisitData.entries.length > 0
// //       ? siteVisitData.entries.join(' | ')
// //       : '-'

// //     const svDuration = calculateSVHours(siteVisitData.svCheckIn, siteVisitData.svCheckOut)

// //     if (dayName === 'Sunday') {
// //       return {
// //         employeeId: employee.employee_id || '',
// //         name: employee.full_name || '',
// //         fatherName: employee.father_name || '-',
// //         cnic: employee.cnic_number || '-',
// //         phoneNumber: employee.phone_number || '-',
// //         emergencyContact: employee.emergency_contact || '-',
// //         dob: formatDate(employee.date_of_birth || ''),
// //         maritalStatus: employee.marital_status || '-',
// //         address: employee.residential_address || '-',
// //         department: employee.department || '',
// //         designation: employee.position || '',
// //         joiningDate: formatDate(employee.joining_date || ''),
// //         date: formatDate(dateStr),
// //         day: dayName,
// //         checkIn: '-',
// //         checkOut: '-',
// //         checkInTime: '',
// //         checkOutTime: '',
// //         totalHours: '-',
// //         checkInLocation: '-',
// //         checkOutLocation: '-',
// //         status: 'Off',
// //         leaveType: '',
// //         leaveReason: '',
// //         qualifications: getQualificationsString(employee.qualifications),
// //         experience: getExperienceString(employee.experience),
// //         isOnLeave: false,
// //         hasCheckIn: false,
// //         hasCheckOut: false,
// //         outsideCheckIn: '-',
// //         outsideCheckOut: '-',
// //         outsideTotalHours: '-',
// //         outsideCheckInTime: '',
// //         outsideCheckOutTime: '',
// //         branch: getBranchDisplayName(employee.source),
// //         branchCode: (employee.source || 'K') as 'K' | 'PQ',
// //         totalHoursWithOS: '-',
// //         shift: employee.shift || undefined,
// //         shiftTiming: employee.shift_timing || undefined,
// //         siteVisitCount,
// //         siteVisitDetails,
// //         svCheckIn: siteVisitData.svCheckIn,
// //         svCheckOut: siteVisitData.svCheckOut,
// //       }
// //     }

// //     const dayLogs = logs.filter(log => {
// //       const logDate = toLocalDateStr(log.timestamp)
// //       const logUserId = String(log.user_id).trim()
// //       const empId = String(employee.employee_id).trim()
// //       return logDate === dateStr && logUserId === empId
// //     })

// //     const sortedLogs = [...dayLogs].sort(
// //       (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
// //     )

// //     let checkInLog: AttendanceLog | null = null
// //     let checkOutLog: AttendanceLog | null = null
// //     let hasCheckIn = false
// //     let hasCheckOut = false

// //     if (sortedLogs.length === 1) {
// //       const singleLog = sortedLogs[0]
// //       const logHour = new Date(singleLog.timestamp).getHours()
// //       if (logHour >= 18) {
// //         checkOutLog = singleLog
// //         hasCheckOut = true
// //       } else {
// //         checkInLog = singleLog
// //         hasCheckIn = true
// //       }
// //     } else if (sortedLogs.length >= 2) {
// //       checkInLog = sortedLogs[0]
// //       hasCheckIn = true
// //       const lastLog = sortedLogs[sortedLogs.length - 1]
// //       const diffMs = new Date(lastLog.timestamp).getTime() - new Date(checkInLog.timestamp).getTime()
// //       if (diffMs >= 3600000) {
// //         checkOutLog = lastLog
// //         hasCheckOut = true
// //       }
// //     }

// //     const leavesArr = safeParseArray(employee.leaves)
// //     const leave = leavesArr.find(
// //       (l: any) => l.fromDate <= dateStr && l.toDate >= dateStr && l.status === 'approved'
// //     )

// //     let status: 'Present' | 'Absent' | 'Leave' | 'Half Day' | 'Off' = 'Absent'
// //     let leaveType = ''
// //     let leaveReason = ''
// //     let isOnLeave = false

// //     if (leave) {
// //       status = 'Leave'
// //       leaveType = leave.leaveType || ''
// //       leaveReason = leave.reason || ''
// //       isOnLeave = true
// //     } else if (hasCheckIn) {
// //       const checkInDate = new Date(checkInLog!.timestamp)
// //       const checkInHour = checkInDate.getHours()
// //       const checkInMinute = checkInDate.getMinutes()
// //       const isAfterNoon = checkInHour > 12 || (checkInHour === 12 && checkInMinute > 0)
// //       if (isAfterNoon) status = 'Half Day'
// //       else status = 'Present'
// //     }

// //     let outsideCheckInTime = ''
// //     let outsideCheckOutTime = ''

// //     const checkInArr = safeParseArray(employee.check_in)
// //     const checkOutArr = safeParseArray(employee.check_out)

// //     if (checkInArr.length > 0) {
// //       const checkInJson = checkInArr.find((c: any) => toLocalDateStr(c.time) === dateStr)
// //       if (checkInJson) outsideCheckInTime = checkInJson.time
// //     }
// //     if (checkOutArr.length > 0) {
// //       const checkOutJson = checkOutArr.find((c: any) => toLocalDateStr(c.time) === dateStr)
// //       if (checkOutJson) outsideCheckOutTime = checkOutJson.time
// //     }

// //     const outsideCheckIn = outsideCheckInTime ? formatTime(outsideCheckInTime) : '-'
// //     const outsideCheckOut = outsideCheckOutTime ? formatTime(outsideCheckOutTime) : '-'
// //     const outsideTotalHours = (outsideCheckInTime && outsideCheckOutTime)
// //       ? calculateOutsideHours(outsideCheckInTime, outsideCheckOutTime) : '-'

// //     const displayCheckIn = isOnLeave ? '-' : (checkInLog ? formatTime(checkInLog.timestamp) : '-')
// //     const displayCheckOut = isOnLeave ? '-' : (checkOutLog ? formatTime(checkOutLog.timestamp) : '-')

// //     // Hours = ONLY attendance
// //     const attendanceHours = isOnLeave
// //       ? '-'
// //       : calculateTotalHours(checkInLog?.timestamp || '', checkOutLog?.timestamp || '')

// //     // Total Hours = attendance + SV + OS
// //     const totalHoursCombined = isOnLeave
// //       ? '-'
// //       : addThreeDurations(
// //           attendanceHours,
// //           svDuration,
// //           outsideTotalHours === '-' ? '00:00:00' : outsideTotalHours
// //         )

// //     const displayCheckInLocation = isOnLeave ? '-' : (checkInLog?.branch_code || '-')
// //     const displayCheckOutLocation = isOnLeave ? '-' : (checkOutLog?.branch_code || '-')

// //     let source = employee.source || 'K'
// //     if (!employee.source) {
// //       source = (checkInLog?.source || checkOutLog?.source || 'K') as 'K' | 'PQ'
// //     }

// //     return {
// //       employeeId: employee.employee_id || '',
// //       name: employee.full_name || '',
// //       fatherName: employee.father_name || '-',
// //       cnic: employee.cnic_number || '-',
// //       phoneNumber: employee.phone_number || '-',
// //       emergencyContact: employee.emergency_contact || '-',
// //       dob: formatDate(employee.date_of_birth || ''),
// //       maritalStatus: employee.marital_status || '-',
// //       address: employee.residential_address || '-',
// //       department: employee.department || '',
// //       designation: employee.position || '',
// //       joiningDate: formatDate(employee.joining_date || ''),
// //       date: formatDate(dateStr),
// //       day: dayName,
// //       checkIn: displayCheckIn,
// //       checkOut: displayCheckOut,
// //       checkInTime: checkInLog?.timestamp || '',
// //       checkOutTime: checkOutLog?.timestamp || '',
// //       totalHours: attendanceHours,
// //       checkInLocation: displayCheckInLocation,
// //       checkOutLocation: displayCheckOutLocation,
// //       status,
// //       leaveType,
// //       leaveReason,
// //       qualifications: getQualificationsString(employee.qualifications),
// //       experience: getExperienceString(employee.experience),
// //       isOnLeave,
// //       hasCheckIn,
// //       hasCheckOut,
// //       outsideCheckIn,
// //       outsideCheckOut,
// //       outsideTotalHours,
// //       outsideCheckInTime,
// //       outsideCheckOutTime,
// //       branch: getBranchDisplayName(source),
// //       branchCode: source as 'K' | 'PQ',
// //       totalHoursWithOS: totalHoursCombined,
// //       shift: employee.shift || undefined,
// //       shiftTiming: employee.shift_timing || undefined,
// //       siteVisitCount,
// //       siteVisitDetails,
// //       svCheckIn: siteVisitData.svCheckIn,
// //       svCheckOut: siteVisitData.svCheckOut,
// //     }
// //   }, [formatDate, getDayName, formatTime, calculateTotalHours, calculateOutsideHours, getQualificationsString, getExperienceString, getSiteVisitsForDate, addThreeDurations, calculateSVHours])

// //   const getSelectedEmployeeName = useCallback(() => {
// //     if (selectedEmployee === 'all') return 'All Employees'
// //     const emp = employees.find(e => e.employee_id === selectedEmployee)
// //     return emp?.full_name || 'Selected Employee'
// //   }, [employees, selectedEmployee])

// //   const getPrintRowColorByStatus = useCallback((status: string): string => {
// //     switch (status) {
// //       case 'Present': return '#C6EFCE'
// //       case 'Absent': return '#FFC7CE'
// //       case 'Half Day': return '#FFEB9C'
// //       case 'Leave': return '#F8CBAD'
// //       case 'Off': return '#E5E7EB'
// //       default: return 'transparent'
// //     }
// //   }, [])

// //   // =====================================================
// //   // fetchData
// //   // =====================================================
// //   const fetchData = useCallback(async () => {
// //     if (!isMounted.current) return
// //     try {
// //       setLoading(true)
// //       setError(null)

// //       const { data: employeeData, error: employeeError } = await supabase
// //         .from('employees')
// //         .select('*')
// //         .order('full_name', { ascending: true })

// //       if (employeeError) throw new Error(employeeError.message)

// //       if (!employeeData || employeeData.length === 0) {
// //         setError('No employees found')
// //         setEmployees([])
// //         setDepartments([])
// //         setEmployeeNames([])
// //         setAttendanceLogs([])
// //         setDataSource({ K: 0, PQ: 0 })
// //         setLoading(false)
// //         return
// //       }

// //       const employeeIdSet = new Set<string>(
// //         employeeData
// //           .map((e: any) => String(e.employee_id ?? '').trim())
// //           .filter(Boolean)
// //       )

// //       const employeeIdsArray = Array.from(employeeIdSet)

// //       const PAGE_SIZE = 1000

// //       const fetchAllRows = async (
// //         tableName: 'attendance_logs' | 'pq_attendance_logs',
// //         applyEmployeeFilter: boolean
// //       ): Promise<any[]> => {
// //         let all: any[] = []
// //         let from = 0
// //         const MAX_PAGES = 200

// //         for (let page = 0; page < MAX_PAGES; page++) {
// //           let query = supabase
// //             .from(tableName)
// //             .select('*')
// //             .order('timestamp', { ascending: true })
// //             .range(from, from + PAGE_SIZE - 1)

// //           if (applyEmployeeFilter) {
// //             query = query.in('user_id', employeeIdsArray)
// //           }

// //           const { data, error } = await query

// //           if (error) {
// //             throw new Error(`${tableName}: ${error.message}`)
// //           }

// //           if (!data || data.length === 0) break

// //           all = all.concat(data)

// //           if (data.length < PAGE_SIZE) break

// //           from += PAGE_SIZE
// //         }

// //         return all
// //       }

// //       const [mainLogsData, pqLogsData] = await Promise.all([
// //         fetchAllRows('attendance_logs', true),
// //         fetchAllRows('pq_attendance_logs', false)
// //       ])

// //       const allLogs: AttendanceLog[] = []

// //       mainLogsData.forEach((log: any) => {
// //         const uid = String(log.user_id ?? '').trim()
// //         if (!employeeIdSet.has(uid)) return

// //         allLogs.push({
// //           id: Number(log.id),
// //           user_id: uid,
// //           employee_name: String(log.employee_name ?? ''),
// //           timestamp: log.timestamp,
// //           punch_type:
// //             log.punch_type === 'CHECK_OUT'
// //               ? 'CHECK_OUT'
// //               : log.punch_type === 'CHECK_IN'
// //                 ? 'CHECK_IN'
// //                 : null,
// //           device_id: String(log.device_id ?? ''),
// //           branch_code: String(log.branch_code ?? 'K'),
// //           raw_log_key: String(log.raw_log_key ?? ''),
// //           created_at: log.created_at,
// //           source: 'K'
// //         })
// //       })

// //       pqLogsData.forEach((log: any) => {
// //         const uid = String(log.user_id ?? '').trim()
// //         if (!employeeIdSet.has(uid)) return

// //         allLogs.push({
// //           id: Number(log.id),
// //           user_id: uid,
// //           employee_name: String(log.employee_name ?? ''),
// //           timestamp: log.timestamp,
// //           punch_type:
// //             log.punch_type === 'CHECK_OUT'
// //               ? 'CHECK_OUT'
// //               : log.punch_type === 'CHECK_IN'
// //                 ? 'CHECK_IN'
// //                 : null,
// //           device_id: String(log.device_id ?? ''),
// //           branch_code: String(log.branch_code ?? 'PQ'),
// //           raw_log_key: String(log.raw_log_key ?? ''),
// //           created_at: log.created_at,
// //           source: 'PQ'
// //         })
// //       })

// //       allLogs.sort(
// //         (a, b) =>
// //           new Date(a.timestamp).getTime() -
// //           new Date(b.timestamp).getTime()
// //       )

// //       const kCount = allLogs.filter(l => l.source === 'K').length
// //       const pqCount = allLogs.filter(l => l.source === 'PQ').length

// //       const employeesWithSource = employeeData.map((emp: any) => {
// //         const empId = String(emp.employee_id ?? '').trim()

// //         const hasPQLogs = allLogs.some(
// //           log => log.user_id === empId && log.source === 'PQ'
// //         )
// //         const hasMainLogs = allLogs.some(
// //           log => log.user_id === empId && log.source === 'K'
// //         )

// //         let source: 'K' | 'PQ' = 'K'
// //         if (hasPQLogs) source = 'PQ'
// //         else if (hasMainLogs) source = 'K'
// //         else if (emp.source === 'PQ') source = 'PQ'
// //         else if (emp.source === 'K') source = 'K'

// //         return { ...emp, employee_id: empId, source }
// //       })

// //       setDataSource({ K: kCount, PQ: pqCount })

// //       setDepartments(
// //         [
// //           ...new Set(
// //             employeesWithSource
// //               .map((e: any) => e.department)
// //               .filter(Boolean)
// //           )
// //         ] as string[]
// //       )

// //       setBranches(
// //         [
// //           ...new Set(
// //             employeesWithSource
// //               .map((e: any) => e.source)
// //               .filter(Boolean)
// //           )
// //         ] as string[]
// //       )

// //       setEmployeeNames(
// //         employeesWithSource
// //           .map((emp: any) => ({
// //             id: emp.employee_id || '',
// //             name: emp.full_name || '',
// //             department: emp.department || '',
// //             source: emp.source || 'K'
// //           }))
// //           .filter((n: any) => n.id && n.name)
// //       )

// //       setEmployees(employeesWithSource)
// //       setAttendanceLogs(allLogs)
// //       setLoading(false)
// //     } catch (err: any) {
// //       console.error('❌ Attendance fetch error:', err)
// //       if (isMounted.current) {
// //         setError(err?.message || 'Failed to load attendance data')
// //         setLoading(false)
// //       }
// //     }
// //   }, [])

// //   const generateAttendanceSheet = useCallback(() => {
// //     if (!debouncedFromDate || !debouncedToDate || employees.length === 0) return

// //     const startDate = new Date(debouncedFromDate + 'T00:00:00')
// //     const endDate = new Date(debouncedToDate + 'T00:00:00')
// //     const dateArray: string[] = []

// //     const currentDate = new Date(startDate)
// //     while (currentDate <= endDate) {
// //       const year = currentDate.getFullYear()
// //       const month = String(currentDate.getMonth() + 1).padStart(2, '0')
// //       const day = String(currentDate.getDate()).padStart(2, '0')
// //       dateArray.push(`${year}-${month}-${day}`)
// //       currentDate.setDate(currentDate.getDate() + 1)
// //     }

// //     let filteredEmployees = employees
// //     if (selectedDepartment !== 'all') filteredEmployees = filteredEmployees.filter(emp => emp.department === selectedDepartment)
// //     if (selectedBranch !== 'all') filteredEmployees = filteredEmployees.filter(emp => emp.source === selectedBranch)
// //     if (selectedEmployee !== 'all') filteredEmployees = filteredEmployees.filter(emp => emp.employee_id === selectedEmployee)

// //     const allRecords: AttendanceRecord[] = []
// //     filteredEmployees.forEach(employee => {
// //       dateArray.forEach(date => {
// //         allRecords.push(getEmployeeAttendance(employee, date, attendanceLogs))
// //       })
// //     })

// //     setAttendanceData(allRecords)
// //   }, [employees, debouncedFromDate, debouncedToDate, selectedDepartment, selectedBranch, selectedEmployee, attendanceLogs, getEmployeeAttendance])

// //   useEffect(() => {
// //     if (selectedStatus === 'all') {
// //       setFilteredData(attendanceData)
// //     } else {
// //       setFilteredData(attendanceData.filter(r => r.status === selectedStatus))
// //     }
// //   }, [attendanceData, selectedStatus])

// //   useEffect(() => {
// //     if (employees.length > 0 && debouncedFromDate && debouncedToDate) {
// //       generateAttendanceSheet()
// //     }
// //   }, [employees, debouncedFromDate, debouncedToDate, selectedDepartment, selectedBranch, selectedEmployee, generateAttendanceSheet])

// //   useEffect(() => {
// //     isMounted.current = true
// //     fetchData()
// //     const now = new Date()
// //     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
// //     const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
// //     setFromDate(firstDay.toISOString().split('T')[0])
// //     setToDate(lastDay.toISOString().split('T')[0])
// //     return () => { isMounted.current = false }
// //   }, [fetchData])

// //   const summary = useMemo(() => {
// //     const total = filteredData.length
// //     const present = filteredData.filter(r => r.status === 'Present').length
// //     const absent = filteredData.filter(r => r.status === 'Absent').length
// //     const leave = filteredData.filter(r => r.status === 'Leave').length
// //     const halfDay = filteredData.filter(r => r.status === 'Half Day').length
// //     const off = filteredData.filter(r => r.status === 'Off').length
// //     const totalSiteVisits = filteredData.reduce((sum, r) => sum + r.siteVisitCount, 0)
// //     return { total, present, absent, leave, halfDay, off, totalSiteVisits }
// //   }, [filteredData])

// //   // =====================================================
// //   // Summary calculation (used by export + payroll)
// //   // =====================================================
// //   const calculateSummariesForDateRange = useCallback((): any[] => {
// //     if (filteredData.length === 0) return []

// //     const groups: Record<string, AttendanceRecord[]> = {}

// //     filteredData.forEach(r => {
// //       const key = `${r.employeeId}__${r.branchCode}`
// //       if (!groups[key]) groups[key] = []
// //       groups[key].push(r)
// //     })

// //     const summaries: any[] = []

// //     Object.entries(groups).forEach(([, records]) => {
// //       if (records.length === 0) return

// //       const first = records[0]

// //       let presentDays = 0
// //       let absentDays = 0
// //       let leaveDays = 0
// //       let halfDays = 0
// //       let offDays = 0
// //       let totalAttendanceHours = 0
// //       let totalSVHours = 0
// //       let totalHours = 0
// //       let totalSiteVisits = 0
// //       let lateHours = 0
// //       let overtimeHours = 0

// //       const shiftHours = getShiftTotalHours(first.shiftTiming)

// //       records.forEach(r => {
// //         if (r.status === 'Present') presentDays++
// //         else if (r.status === 'Absent') absentDays++
// //         else if (r.status === 'Leave') leaveDays++
// //         else if (r.status === 'Half Day') halfDays++
// //         else if (r.status === 'Off') offDays++

// //         const attHrs = parseHoursToDecimal(r.totalHours)
// //         totalAttendanceHours += attHrs

// //         const svDur = calculateSVHours(r.svCheckIn, r.svCheckOut)
// //         const svHrs = parseHoursToDecimal(svDur)
// //         totalSVHours += svHrs

// //         const totalHrs = parseHoursToDecimal(r.totalHoursWithOS)
// //         totalHours += totalHrs

// //         totalSiteVisits += r.siteVisitCount

// //         if (
// //           r.day !== 'Sunday' &&
// //           r.status !== 'Off' &&
// //           r.status !== 'Leave' &&
// //           r.status !== 'Absent'
// //         ) {
// //           if (totalHrs > 0 && totalHrs < shiftHours) {
// //             lateHours += (shiftHours - totalHrs)
// //           }
// //           if (totalHrs > shiftHours) {
// //             overtimeHours += (totalHrs - shiftHours)
// //           }
// //         }
// //       })

// //       summaries.push({
// //         employee_id: first.employeeId,
// //         employee_name: first.name,
// //         department: first.department || null,
// //         designation: first.designation || null,
// //         shift: getShiftDisplay(first.shiftTiming, first.shift),
// //         branch: first.branch || 'Korangi',
// //         from_date: fromDate,
// //         to_date: toDate,
// //         total_days: records.length,
// //         present_days: presentDays,
// //         absent_days: absentDays,
// //         leave_days: leaveDays,
// //         half_days: halfDays,
// //         off_days: offDays,
// //         total_working_hours: Math.round(totalAttendanceHours * 100) / 100,
// //         total_sv_hours: Math.round(totalSVHours * 100) / 100,
// //         total_hours: Math.round(totalHours * 100) / 100,
// //         total_site_visits: totalSiteVisits,
// //         late_hours: Math.round(lateHours * 100) / 100,
// //         overtime_hours: Math.round(overtimeHours * 100) / 100,
// //       })
// //     })

// //     return summaries
// //   }, [filteredData, fromDate, toDate, parseHoursToDecimal, calculateSVHours])

// //   // =====================================================
// //   // EXPORT: CSV (raw only)
// //   // =====================================================
// //   const handleExportCSV = useCallback(() => {
// //     if (filteredData.length === 0) { alert('No data to export'); return }

// //     const headers = [
// //       'User ID', 'Name', 'Dept', 'Designation', 'Shift', 'Date', 'Day',
// //       'Check In', 'Check Out', 'Hours', 'Total Hours',
// //       'SV Check In', 'SV Check Out',
// //       'Company', 'Status',
// //       'Site Visit Count', 'Site Visits (Company - From - To)'
// //     ]

// //     const rows = filteredData.map(r => [
// //       r.employeeId,
// //       r.name,
// //       r.department,
// //       r.designation,
// //       getShiftDisplay(r.shiftTiming, r.shift),
// //       r.date,
// //       r.day,
// //       r.checkIn,
// //       r.checkOut,
// //       r.totalHours,
// //       r.totalHoursWithOS,
// //       r.svCheckIn !== '-' ? formatSiteVisitTime(r.svCheckIn) : '-',
// //       r.svCheckOut !== '-' ? formatSiteVisitTime(r.svCheckOut) : '-',
// //       r.branch,
// //       r.status,
// //       r.siteVisitCount > 0 ? String(r.siteVisitCount) : '0',
// //       r.siteVisitDetails
// //     ])

// //     const escapeCSV = (val: any) => {
// //       const s = String(val ?? '')
// //       if (s.includes(',') || s.includes('"') || s.includes('\n')) {
// //         return `"${s.replace(/"/g, '""')}"`
// //       }
// //       return s
// //     }

// //     const csv = [
// //       headers.map(escapeCSV).join(','),
// //       ...rows.map(row => row.map(escapeCSV).join(','))
// //     ].join('\n')

// //     const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
// //     const url = URL.createObjectURL(blob)
// //     const link = document.createElement('a')
// //     link.href = url
// //     link.download = `attendance_sheet_${fromDate}_to_${toDate}.csv`
// //     document.body.appendChild(link)
// //     link.click()
// //     document.body.removeChild(link)
// //     URL.revokeObjectURL(url)

// //     setShowExportMenu(false)
// //     setExportSuccess(`✅ Raw CSV downloaded`)
// //     setTimeout(() => setExportSuccess(null), 3000)
// //   }, [filteredData, fromDate, toDate])

// //   // =====================================================
// //   // EXPORT: PDF (raw only)
// //   // =====================================================
// //   const handleExportPDF = useCallback(() => {
// //     if (filteredData.length === 0) { alert('No data to export'); return }

// //     const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
// //     const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
// //     const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

// //     let tableRows = ''
// //     filteredData.forEach((record, index) => {
// //       const isSunday = record.day === 'Sunday'
// //       const rowColor = getPrintRowColorByStatus(record.status)
// //       const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
// //       const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)
// //       const svIn = record.svCheckIn !== '-' ? formatSiteVisitTime(record.svCheckIn) : '-'
// //       const svOut = record.svCheckOut !== '-' ? formatSiteVisitTime(record.svCheckOut) : '-'

// //       tableRows += `
// //         <tr style="${bgStyle}">
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${index + 1}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.employeeId}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.name}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.department}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.designation}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${shiftDisplay}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.date}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; ${isSunday ? 'font-weight: bold; color: #FF0000;' : ''}">${record.day}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.checkIn}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.checkOut}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.totalHours}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; color: #ea580c; font-weight: bold;">${svIn}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; color: #ea580c; font-weight: bold;">${svOut}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.branch}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.status}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.siteVisitCount > 0 ? record.siteVisitCount : '-'}</td>
// //           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 7px; text-align: left; max-width: 180px; word-break: break-word;">${record.siteVisitDetails}</td>
// //         </tr>
// //       `
// //     })

// //     const html = `
// //       <!DOCTYPE html>
// //       <html>
// //         <head>
// //           <title>Attendance Sheet</title>
// //           <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
// //           <style>
// //             @page { size: A4 landscape; margin: 8mm 6mm; }
// //             * { box-sizing: border-box; margin: 0; padding: 0; }
// //             body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #000; font-size: 11px; }
// //             .print-container { width: 100%; }
// //             .print-header { text-align: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid #000; }
// //             .print-header .company-name { font-size: 13px; font-weight: 700; text-transform: uppercase; }
// //             .print-header .title { font-size: 11px; font-weight: 700; margin-top: 2px; }
// //             .print-header .sub-info { font-size: 8px; margin-top: 3px; font-weight: 500; }
// //             .print-header .date-range { font-size: 8px; margin-top: 2px; }
// //             table { width: 100%; border-collapse: collapse; font-size: 8px; margin-top: 3px; }
// //             table thead th { background: #C4BD97; font-weight: 700; text-align: center; padding: 4px 3px; border: 1px solid #000; text-transform: uppercase; font-size: 7px; white-space: nowrap; }
// //             table tbody td { padding: 3px 4px; border: 1px solid #000; vertical-align: middle; text-align: center; font-size: 8px; }
// //             .print-footer { margin-top: 8px; padding-top: 5px; border-top: 1px solid #000; text-align: center; font-size: 7px; }
// //             @media print {
// //               table thead th { background: #C4BD97 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
// //               tr[style*="background-color"] td { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
// //               tr[style*="background-color"] { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
// //             }
// //           </style>
// //         </head>
// //         <body>
// //           <div class="print-container">
// //             <div class="print-header">
// //               <div class="company-name">A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</div>
// //               <div class="title">EMPLOYEE ATTENDANCE SHEET</div>
// //               <div class="sub-info">${employeeName} | ${deptName} | ${branchName}</div>
// //               <div class="date-range">${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}</div>
// //             </div>
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th style="width:1%">#</th>
// //                   <th style="width:2%">Emp ID</th>
// //                   <th style="width:5%">Name</th>
// //                   <th style="width:3%">Dept</th>
// //                   <th style="width:4%">Designation</th>
// //                   <th style="width:5%">Shift</th>
// //                   <th style="width:3%">Date</th>
// //                   <th style="width:3%">Day</th>
// //                   <th style="width:3%">Check In</th>
// //                   <th style="width:3%">Check Out</th>
// //                   <th style="width:3%">Hours</th>
// //                   <th style="width:3%">Total Hours</th>
// //                   <th style="width:3%">SV Check In</th>
// //                   <th style="width:3%">SV Check Out</th>
// //                   <th style="width:3%">Company</th>
// //                   <th style="width:3%">Status</th>
// //                   <th style="width:2%">SV</th>
// //                   <th style="width:14%">Site Visits (Company - From - To)</th>
// //                 </tr>
// //               </thead>
// //               <tbody>${tableRows}</tbody>
// //             </table>
// //             <div class="print-footer">
// //               <span>This sheet is generated by system software | A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</span>
// //             </div>
// //           </div>
// //           <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
// //         </body>
// //       </html>
// //     `

// //     const printWindow = window.open('', '_blank')
// //     if (!printWindow) { alert('Please allow popups for PDF'); return }
// //     printWindow.document.write(html)
// //     printWindow.document.close()
// //     setShowExportMenu(false)
// //     setExportSuccess(`✅ Raw PDF ready`)
// //     setTimeout(() => setExportSuccess(null), 4000)
// //   }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getPrintRowColorByStatus, fromDate, toDate, formatDateForDisplay])

// //   // =====================================================
// //   // NEW: EXPORT SUMMARY as CSV (+ save to DB)
// //   // =====================================================
// //   const handleExportSummaryCSV = useCallback(async () => {
// //     if (filteredData.length === 0) { alert('No data to export'); return }

// //     const summaries = calculateSummariesForDateRange()

// //     if (summaries.length === 0) {
// //       alert('Could not generate summary')
// //       return
// //     }

// //     let summarySaved = false
// //     try {
// //       const { error: upsertError } = await supabase
// //         .from('attendance_summaries')
// //         .upsert(summaries, {
// //           onConflict: 'employee_id,from_date,to_date,branch',
// //           ignoreDuplicates: false,
// //         })

// //       if (upsertError) {
// //         console.error('Summary save error:', upsertError)
// //       } else {
// //         summarySaved = true
// //       }
// //     } catch (err) {
// //       console.error('Summary save exception:', err)
// //     }

// //     const headers = [
// //       'Employee ID', 'Employee Name', 'Department', 'Designation',
// //       'Shift', 'Branch', 'From Date', 'To Date',
// //       'Total Days', 'Present', 'Absent', 'Leave', 'Half Days', 'Off',
// //       'Working Hours', 'SV Hours', 'Total Hours',
// //       'Site Visits', 'Late Hours', 'Overtime Hours'
// //     ]

// //     const rows = summaries.map(s => [
// //       s.employee_id,
// //       s.employee_name,
// //       s.department || '',
// //       s.designation || '',
// //       s.shift || '',
// //       s.branch || '',
// //       s.from_date,
// //       s.to_date,
// //       s.total_days,
// //       s.present_days,
// //       s.absent_days,
// //       s.leave_days,
// //       s.half_days,
// //       s.off_days,
// //       s.total_working_hours,
// //       s.total_sv_hours,
// //       s.total_hours,
// //       s.total_site_visits,
// //       s.late_hours,
// //       s.overtime_hours,
// //     ])

// //     const escapeCSV = (val: any) => {
// //       const s = String(val ?? '')
// //       if (s.includes(',') || s.includes('"') || s.includes('\n')) {
// //         return `"${s.replace(/"/g, '""')}"`
// //       }
// //       return s
// //     }

// //     const csv = [
// //       headers.map(escapeCSV).join(','),
// //       ...rows.map(row => row.map(escapeCSV).join(','))
// //     ].join('\n')

// //     const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
// //     const url = URL.createObjectURL(blob)
// //     const link = document.createElement('a')
// //     link.href = url
// //     link.download = `attendance_summary_${fromDate}_to_${toDate}.csv`
// //     document.body.appendChild(link)
// //     link.click()
// //     document.body.removeChild(link)
// //     URL.revokeObjectURL(url)

// //     setShowExportMenu(false)
// //     setExportSuccess(
// //       summarySaved
// //         ? `✅ Summary CSV downloaded + ${summaries.length} summaries saved`
// //         : `✅ Summary CSV downloaded (${summaries.length} records)`
// //     )
// //     setTimeout(() => setExportSuccess(null), 5000)
// //   }, [filteredData, fromDate, toDate, calculateSummariesForDateRange])

// //   // =====================================================
// //   // NEW: EXPORT SUMMARY as PDF (+ save to DB)
// //   // =====================================================
// //   const handleExportSummaryPDF = useCallback(async () => {
// //     if (filteredData.length === 0) { alert('No data to export'); return }

// //     const summaries = calculateSummariesForDateRange()

// //     if (summaries.length === 0) {
// //       alert('Could not generate summary')
// //       return
// //     }

// //     let summarySaved = false
// //     try {
// //       const { error: upsertError } = await supabase
// //         .from('attendance_summaries')
// //         .upsert(summaries, {
// //           onConflict: 'employee_id,from_date,to_date,branch',
// //           ignoreDuplicates: false,
// //         })

// //       if (upsertError) {
// //         console.error('Summary save error:', upsertError)
// //       } else {
// //         summarySaved = true
// //       }
// //     } catch (err) {
// //       console.error('Summary save exception:', err)
// //     }

// //     const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
// //     const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
// //     const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

// //     let tableRows = ''
// //     summaries.forEach((s, index) => {
// //       tableRows += `
// //         <tr>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${index + 1}</td>
// //           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.employee_id}</td>
// //           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.employee_name}</td>
// //           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.department || '-'}</td>
// //           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.designation || '-'}</td>
// //           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.branch || '-'}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.from_date}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.to_date}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.total_days}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: green; font-weight: bold;">${s.present_days}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: red; font-weight: bold;">${s.absent_days}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: blue; font-weight: bold;">${s.leave_days}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: orange; font-weight: bold;">${s.half_days}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.off_days}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${Number(s.total_working_hours).toFixed(2)}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: #ea580c; font-weight: bold;">${Number(s.total_sv_hours).toFixed(2)}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; font-weight: bold; color: #1D4ED8;">${Number(s.total_hours).toFixed(2)}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.total_site_visits}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${Number(s.late_hours).toFixed(2)}</td>
// //           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${Number(s.overtime_hours).toFixed(2)}</td>
// //         </tr>
// //       `
// //     })

// //     const html = `
// //       <!DOCTYPE html>
// //       <html>
// //         <head>
// //           <title>Attendance Summary Report</title>
// //           <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
// //           <style>
// //             @page { size: A4 landscape; margin: 8mm 6mm; }
// //             * { box-sizing: border-box; margin: 0; padding: 0; }
// //             body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #000; }
// //             .header { text-align: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #000; }
// //             .company { font-size: 14px; font-weight: 700; text-transform: uppercase; }
// //             .title { font-size: 12px; font-weight: 700; margin-top: 3px; }
// //             .sub-info { font-size: 9px; margin-top: 4px; font-weight: 500; }
// //             .range { font-size: 9px; margin-top: 3px; }
// //             table { width: 100%; border-collapse: collapse; font-size: 8px; margin-top: 6px; }
// //             th { background: #C4BD97; padding: 5px 3px; border: 1px solid #000; text-transform: uppercase; font-size: 7px; text-align: center; }
// //             td { padding: 4px; border: 1px solid #000; }
// //             .footer { margin-top: 10px; text-align: center; font-size: 7px; border-top: 1px solid #000; padding-top: 6px; }
// //             @media print {
// //               th { background: #C4BD97 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
// //             }
// //           </style>
// //         </head>
// //         <body>
// //           <div class="header">
// //             <div class="company">A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</div>
// //             <div class="title">ATTENDANCE SUMMARY REPORT</div>
// //             <div class="sub-info">${employeeName} | ${deptName} | ${branchName}</div>
// //             <div class="range">${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}</div>
// //           </div>
// //           <table>
// //             <thead>
// //               <tr>
// //                 <th>#</th>
// //                 <th>Emp ID</th>
// //                 <th>Name</th>
// //                 <th>Dept</th>
// //                 <th>Designation</th>
// //                 <th>Branch</th>
// //                 <th>From</th>
// //                 <th>To</th>
// //                 <th>Days</th>
// //                 <th>P</th>
// //                 <th>A</th>
// //                 <th>L</th>
// //                 <th>H</th>
// //                 <th>Off</th>
// //                 <th>Work Hrs</th>
// //                 <th>SV Hrs</th>
// //                 <th>Total Hrs</th>
// //                 <th>SV</th>
// //                 <th>Late</th>
// //                 <th>OT</th>
// //               </tr>
// //             </thead>
// //             <tbody>${tableRows}</tbody>
// //           </table>
// //           <div class="footer">
// //             This summary is generated by system software | A to Zee Switchgear Engineering (SMC) Pvt. Ltd.
// //           </div>
// //           <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
// //         </body>
// //       </html>
// //     `

// //     const w = window.open('', '_blank')
// //     if (!w) { alert('Please allow popups'); return }
// //     w.document.write(html)
// //     w.document.close()
// //     setShowExportMenu(false)
// //     setExportSuccess(
// //       summarySaved
// //         ? `✅ Summary PDF ready + ${summaries.length} summaries saved`
// //         : `✅ Summary PDF ready (${summaries.length} records)`
// //     )
// //     setTimeout(() => setExportSuccess(null), 5000)
// //   }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, fromDate, toDate, formatDateForDisplay, calculateSummariesForDateRange])

// //   // =====================================================
// //   // Monthly Summary (for Payroll)
// //   // =====================================================
// //   const calculateMonthlySummaries = useCallback((): MonthlySummary[] => {
// //     if (filteredData.length === 0) return []

// //     const groups: Record<string, AttendanceRecord[]> = {}

// //     filteredData.forEach(r => {
// //       const isoDate = displayDateToISO(r.date)
// //       if (!isoDate) return
// //       const monthKey = isoDate.substring(0, 7)
// //       const key = `${r.employeeId}__${monthKey}`
// //       if (!groups[key]) groups[key] = []
// //       groups[key].push(r)
// //     })

// //     const summaries: MonthlySummary[] = []

// //     Object.entries(groups).forEach(([, records]) => {
// //       if (records.length === 0) return

// //       const first = records[0]
// //       const isoDate = displayDateToISO(first.date)
// //       const monthKey = isoDate.substring(0, 7)

// //       const [yearStr, monthStr] = monthKey.split('-')
// //       const year = parseInt(yearStr)
// //       const month = parseInt(monthStr)
// //       const totalMonthDays = new Date(year, month, 0).getDate()

// //       let presentDays = 0
// //       let absentDays = 0
// //       let approvedLeaves = 0
// //       let lateHoursTotal = 0
// //       let overtimeHoursTotal = 0

// //       const shiftHours = getShiftTotalHours(first.shiftTiming)

// //       records.forEach(r => {
// //         if (r.status === 'Absent') absentDays += 1
// //         else if (r.status === 'Leave') approvedLeaves += 1
// //         else presentDays += 1

// //         if (
// //           r.day !== 'Sunday' &&
// //           r.status !== 'Off' &&
// //           r.status !== 'Leave' &&
// //           r.status !== 'Absent'
// //         ) {
// //           const workedHours = parseHoursToDecimal(r.totalHoursWithOS)

// //           if (workedHours > 0 && workedHours < shiftHours) {
// //             lateHoursTotal += (shiftHours - workedHours)
// //           }

// //           if (workedHours > shiftHours) {
// //             overtimeHoursTotal += (workedHours - shiftHours)
// //           }
// //         }
// //       })

// //       summaries.push({
// //         user_id: first.employeeId,
// //         name: first.name,
// //         department: first.department || null,
// //         designation: first.designation || null,
// //         shift: getShiftDisplay(first.shiftTiming, first.shift),
// //         month: monthKey,
// //         total_month_days: totalMonthDays,
// //         total_present: Math.round(presentDays * 100) / 100,
// //         total_absent: Math.round(absentDays * 100) / 100,
// //         approved_leaves: Math.round(approvedLeaves * 100) / 100,
// //         late_hours: Math.round(lateHoursTotal * 100) / 100,
// //         overtime_hours: Math.round(overtimeHoursTotal * 100) / 100,
// //         company: first.branch || 'Korangi'
// //       })
// //     })

// //     return summaries
// //   }, [filteredData, displayDateToISO, parseHoursToDecimal])

// //   const handleExportForPayroll = useCallback(async () => {
// //     if (filteredData.length === 0) {
// //       alert('No data to submit')
// //       return
// //     }

// //     const monthlySummaries = calculateMonthlySummaries()
// //     const dateRangeSummaries = calculateSummariesForDateRange()

// //     if (monthlySummaries.length === 0) {
// //       alert('Could not calculate summaries — check date range')
// //       return
// //     }

// //     if (!confirm(
// //       `Submit to database:\n` +
// //       `• ${monthlySummaries.length} monthly summary (attendance_sheet)\n` +
// //       `• ${dateRangeSummaries.length} date-range summary (attendance_summaries)\n\n` +
// //       `Existing records will be UPDATED.`
// //     )) {
// //       return
// //     }

// //     try {
// //       setSubmittingPayroll(true)
// //       setError(null)

// //       const { data: monthlyData, error: monthlyErr } = await supabase
// //         .from('attendance_sheet')
// //         .upsert(monthlySummaries, {
// //           onConflict: 'user_id,month,company',
// //           ignoreDuplicates: false
// //         })
// //         .select()

// //       if (monthlyErr) throw new Error(monthlyErr.message)

// //       let rangeSaved = 0
// //       if (dateRangeSummaries.length > 0) {
// //         const { data: rangeData, error: rangeErr } = await supabase
// //           .from('attendance_summaries')
// //           .upsert(dateRangeSummaries, {
// //             onConflict: 'employee_id,from_date,to_date,branch',
// //             ignoreDuplicates: false
// //           })
// //           .select()

// //         if (rangeErr) {
// //           console.error('Date-range summary error:', rangeErr)
// //         } else {
// //           rangeSaved = rangeData?.length || dateRangeSummaries.length
// //         }
// //       }

// //       setShowExportMenu(false)
// //       setExportSuccess(
// //         `✅ ${monthlyData?.length || monthlySummaries.length} monthly + ${rangeSaved} range summaries saved`
// //       )
// //       setTimeout(() => setExportSuccess(null), 6000)
// //     } catch (err: any) {
// //       console.error('❌ Payroll submit error:', err)
// //       setError(err.message || 'Failed to submit summaries')
// //     } finally {
// //       setSubmittingPayroll(false)
// //     }
// //   }, [filteredData, calculateMonthlySummaries, calculateSummariesForDateRange])

// //   useEffect(() => {
// //     const handleClickOutside = (e: MouseEvent) => {
// //       if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
// //         setShowExportMenu(false)
// //       }
// //     }
// //     if (showExportMenu) document.addEventListener('mousedown', handleClickOutside)
// //     return () => document.removeEventListener('mousedown', handleClickOutside)
// //   }, [showExportMenu])

// //   // =====================================================
// //   // Print
// //   // =====================================================
// //   const handlePrintWithColor = useCallback((withColor: boolean) => {
// //     setShowPrintOptions(false)

// //     const data = filteredData
// //     const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
// //     const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
// //     const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

// //     const getRowColorForPrint = (record: AttendanceRecord) => {
// //       if (!withColor) return 'transparent'
// //       return getPrintRowColorByStatus(record.status)
// //     }

// //     let tableRows = ''
// //     data.forEach((record, index) => {
// //       const isSunday = record.day === 'Sunday'
// //       const rowColor = getRowColorForPrint(record)
// //       const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
// //       const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)
// //       const svIn = record.svCheckIn !== '-' ? formatSiteVisitTime(record.svCheckIn) : '-'
// //       const svOut = record.svCheckOut !== '-' ? formatSiteVisitTime(record.svCheckOut) : '-'

// //       tableRows += `
// //         <tr style="${bgStyle}">
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${index + 1}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.employeeId}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.name}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.department}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.designation}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${shiftDisplay}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.date}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; ${isSunday ? 'font-weight: bold; color: #FF0000;' : ''}">${record.day}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.checkIn}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.checkOut}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.totalHours}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; color: #ea580c; font-weight: bold;">${svIn}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; color: #ea580c; font-weight: bold;">${svOut}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.branch}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.status}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.siteVisitCount > 0 ? record.siteVisitCount : '-'}</td>
// //           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 6px; text-align: left; max-width: 150px; word-break: break-word;">${record.siteVisitDetails}</td>
// //         </tr>
// //       `
// //     })

// //     const printHTML = `
// //       <!DOCTYPE html>
// //       <html>
// //         <head>
// //           <title>Attendance Sheet - ${employeeName}</title>
// //           <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
// //           <style>
// //             @page { size: A4 landscape; margin: 5mm 4mm; }
// //             * { box-sizing: border-box; margin: 0; padding: 0; }
// //             body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #000; font-size: 11px; }
// //             .print-container { width: 100%; padding: 0; }
// //             .print-header { text-align: center; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 2px solid #000; }
// //             .print-header .company-name { font-size: 11px; font-weight: 700; text-transform: uppercase; }
// //             .print-header .title { font-size: 10px; font-weight: 700; margin-top: 1px; }
// //             .print-header .sub-info { font-size: 7px; margin-top: 2px; font-weight: 500; }
// //             .print-header .date-range { font-size: 7px; margin-top: 1px; }
// //             table { width: 100%; border-collapse: collapse; font-size: 7px; margin-top: 2px; }
// //             table thead th { background: #C4BD97; font-weight: 700; text-align: center; padding: 3px 2px; border: 1px solid #000; text-transform: uppercase; font-size: 6px; white-space: nowrap; }
// //             table tbody td { padding: 2px 3px; border: 1px solid #000; vertical-align: middle; text-align: center; font-size: 7px; }
// //             .print-footer { margin-top: 6px; padding-top: 4px; border-top: 1px solid #000; text-align: center; font-size: 6px; }
// //             @media print {
// //               table thead th { background: #C4BD97 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
// //               tr[style*="background-color"] td { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
// //               tr[style*="background-color"] { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
// //             }
// //           </style>
// //         </head>
// //         <body>
// //           <div class="print-container">
// //             <div class="print-header">
// //               <div class="company-name">A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</div>
// //               <div class="title">EMPLOYEE ATTENDANCE SHEET</div>
// //               <div class="sub-info">${employeeName} | ${deptName} | ${branchName}</div>
// //               <div class="date-range">${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}</div>
// //             </div>
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th style="width:1%">#</th>
// //                   <th style="width:2%">Emp ID</th>
// //                   <th style="width:5%">Name</th>
// //                   <th style="width:3%">Dept</th>
// //                   <th style="width:4%">Designation</th>
// //                   <th style="width:5%">Shift</th>
// //                   <th style="width:3%">Date</th>
// //                   <th style="width:3%">Day</th>
// //                   <th style="width:3%">Check In</th>
// //                   <th style="width:3%">Check Out</th>
// //                   <th style="width:3%">Hours</th>
// //                   <th style="width:3%">Total Hours</th>
// //                   <th style="width:3%">SV Check In</th>
// //                   <th style="width:3%">SV Check Out</th>
// //                   <th style="width:3%">Company</th>
// //                   <th style="width:3%">Status</th>
// //                   <th style="width:2%">SV</th>
// //                   <th style="width:14%">Site Visits (Company - From - To)</th>
// //                 </tr>
// //               </thead>
// //               <tbody>${tableRows}</tbody>
// //             </table>
// //             <div class="print-footer">
// //               <span>This sheet is generated by system software | A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</span>
// //             </div>
// //           </div>
// //           <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
// //         </body>
// //       </html>
// //     `

// //     const printWindow = window.open('', '_blank')
// //     if (!printWindow) { alert('Please allow popups for printing'); return }
// //     printWindow.document.write(printHTML)
// //     printWindow.document.close()
// //   }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getPrintRowColorByStatus, fromDate, toDate, formatDateForDisplay])

// //   if (loading) {
// //     return (
// //       <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
// //         <Loader className="w-12 h-12 animate-spin text-[#0071BD]" />
// //       </div>
// //     )
// //   }

// //   if (error) {
// //     return (
// //       <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
// //         <div className="text-center bg-white shadow-sm p-8 max-w-md">
// //           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
// //           <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wider">Error</h3>
// //           <p className="text-gray-600 mb-4 tracking-wide">{error}</p>
// //           <button onClick={fetchData} className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] tracking-wider">Retry</button>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <>
// //       <ProtectedRoute allowedUser='hr'>
// //         <NavbarDropdown />
// //         <div className={`min-h-screen bg-gray-50 p-2 ${roboto.className}`}>
// //           <div className="max-w-full mx-auto">
// //             <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
// //               <div>
// //                 <h1 className="text-lg font-bold text-[#0071BD] tracking-wider">Attendance Sheet</h1>
// //                 <p className="text-[10px] text-gray-500 tracking-wide">
// //                   {selectedEmployee === 'all' ? 'All employees' : getSelectedEmployeeName()}
// //                 </p>
// //               </div>
// //               <div className="flex gap-2 flex-wrap items-center">
// //                 <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">K: {dataSource.K}</span>
// //                 <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">PQ: {dataSource.PQ}</span>
// //                 <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">SV: {summary.totalSiteVisits}</span>

// //                 <button onClick={fetchData} className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 flex items-center gap-1 tracking-wider">
// //                   <RefreshCw className="w-3 h-3" /> Refresh
// //                 </button>

// //                 <div className="relative" ref={exportMenuRef}>
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowExportMenu(!showExportMenu)}
// //                     disabled={submittingPayroll || filteredData.length === 0}
// //                     className="px-2 py-1 text-xs bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
// //                   >
// //                     {submittingPayroll ? <Loader className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
// //                     {submittingPayroll ? 'Submitting...' : 'Export'}
// //                     <ChevronDown className="w-3 h-3" />
// //                   </button>

// //                   {showExportMenu && (
// //                     <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 shadow-lg rounded z-50">
// //                       {/* RAW DATA EXPORTS */}
// //                       <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
// //                         Raw Data
// //                       </div>
// //                       <button onClick={handleExportCSV}
// //                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2">
// //                         <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
// //                         <span>Export as CSV</span>
// //                       </button>
// //                       <button onClick={handleExportPDF}
// //                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100">
// //                         <FileText className="w-3.5 h-3.5 text-red-600" />
// //                         <span>Export as PDF</span>
// //                       </button>

// //                       {/* SUMMARY EXPORTS */}
// //                       <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
// //                         Summary (saves to DB)
// //                       </div>
// //                       <button onClick={handleExportSummaryCSV}
// //                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2">
// //                         <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
// //                         <span>Summary as CSV</span>
// //                       </button>
// //                       <button onClick={handleExportSummaryPDF}
// //                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100">
// //                         <FileText className="w-3.5 h-3.5 text-purple-600" />
// //                         <span>Summary as PDF</span>
// //                       </button>

// //                       {/* PAYROLL */}
// //                       <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
// //                         Payroll
// //                       </div>
// //                       <button onClick={handleExportForPayroll}
// //                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2">
// //                         <Calculator className="w-3.5 h-3.5 text-orange-600" />
// //                         <span>For Payroll (monthly + range)</span>
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>

// //                 <button onClick={() => setShowPrintOptions(true)} className="px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 tracking-wider">
// //                   <Printer className="w-3 h-3" /> Print
// //                 </button>
// //               </div>
// //             </div>

// //             {exportSuccess && (
// //               <div className="mb-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded flex items-center gap-2 text-xs">
// //                 <CheckCircle2 className="w-4 h-4" /> {exportSuccess}
// //               </div>
// //             )}

// //             {error && (
// //               <div className="mb-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded flex items-center gap-2 text-xs">
// //                 <AlertCircle className="w-4 h-4" /> {error}
// //               </div>
// //             )}

// //             {showPrintOptions && (
// //               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
// //                 <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
// //                   <div className="flex items-center justify-between mb-4">
// //                     <h2 className="text-xl font-bold text-gray-800 tracking-wider flex items-center gap-2">
// //                       <Printer className="w-5 h-5 text-[#0071BD]" /> Print Options
// //                     </h2>
// //                     <button onClick={() => setShowPrintOptions(false)} className="p-1 hover:bg-gray-200 rounded-lg">
// //                       <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                       </svg>
// //                     </button>
// //                   </div>
// //                   <p className="text-sm text-gray-600 tracking-wide mb-4">Select print style:</p>
// //                   <div className="space-y-3">
// //                     <button onClick={() => handlePrintWithColor(true)}
// //                       className="w-full flex items-center gap-3 px-4 py-3 border-2 border-blue-600 rounded-lg hover:bg-blue-50">
// //                       <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-lg flex items-center justify-center">
// //                         <Palette className="w-5 h-5 text-white" />
// //                       </div>
// //                       <div className="flex-1 text-left">
// //                         <p className="font-semibold text-gray-800 tracking-wide">With Colors</p>
// //                         <p className="text-xs text-gray-500">Status-based colors (P/A/H/L/Off)</p>
// //                       </div>
// //                     </button>
// //                     <button onClick={() => handlePrintWithColor(false)}
// //                       className="w-full flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
// //                       <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
// //                         <FileText className="w-5 h-5 text-gray-600" />
// //                       </div>
// //                       <div className="flex-1 text-left">
// //                         <p className="font-semibold text-gray-800 tracking-wide">Without Colors</p>
// //                         <p className="text-xs text-gray-500">Plain white background</p>
// //                       </div>
// //                     </button>
// //                   </div>
// //                   <button onClick={() => setShowPrintOptions(false)}
// //                     className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 tracking-wider text-sm rounded-lg">Cancel</button>
// //                 </div>
// //               </div>
// //             )}

// //             <div className="grid grid-cols-7 gap-1.5 mb-2">
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="text-[10px] text-[#0071BD] tracking-wide">Total</div>
// //                 <div className="text-base font-bold text-[#0071BD] tracking-wider">{summary.total}</div>
// //               </div>
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="text-[10px] text-green-600 tracking-wide flex items-center gap-0.5">
// //                   <UserCheck className="w-2.5 h-2.5" /> P
// //                 </div>
// //                 <div className="text-base font-bold text-green-700 tracking-wider">{summary.present}</div>
// //               </div>
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="text-[10px] text-red-600 tracking-wide flex items-center gap-0.5">
// //                   <UserX className="w-2.5 h-2.5" /> A
// //                 </div>
// //                 <div className="text-base font-bold text-red-700 tracking-wider">{summary.absent}</div>
// //               </div>
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="text-[10px] text-blue-600 tracking-wide flex items-center gap-0.5">
// //                   <UserMinus className="w-2.5 h-2.5" /> L
// //                 </div>
// //                 <div className="text-base font-bold text-blue-700 tracking-wider">{summary.leave}</div>
// //               </div>
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="text-[10px] text-yellow-600 tracking-wide flex items-center gap-0.5">
// //                   <UserPlus className="w-2.5 h-2.5" /> H
// //                 </div>
// //                 <div className="text-base font-bold text-yellow-700 tracking-wider">{summary.halfDay}</div>
// //               </div>
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="text-[10px] text-gray-600 tracking-wide flex items-center gap-0.5">
// //                   <Clock className="w-2.5 h-2.5" /> OFF
// //                 </div>
// //                 <div className="text-base font-bold text-gray-700 tracking-wider">{summary.off}</div>
// //               </div>
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="text-[10px] text-orange-600 tracking-wide flex items-center gap-0.5">
// //                   <MapPin className="w-2.5 h-2.5" /> SV
// //                 </div>
// //                 <div className="text-base font-bold text-orange-700 tracking-wider">{summary.totalSiteVisits}</div>
// //               </div>
// //             </div>

// //             <div className="bg-white text-black shadow-sm p-1.5 mb-2">
// //               <button onClick={() => setExpandedFilters(!expandedFilters)}
// //                 className="flex items-center gap-1 text-gray-700 hover:text-[#0071BD] tracking-wider text-xs">
// //                 <Filter className="w-3 h-3" />
// //                 {expandedFilters ? 'Hide Filters' : 'Show Filters'}
// //                 {expandedFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
// //               </button>
// //               {expandedFilters && (
// //                 <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mt-2">
// //                   <div>
// //                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">From Date</label>
// //                     <div className="relative">
// //                       <Calendar className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
// //                       <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
// //                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none" />
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">To Date</label>
// //                     <div className="relative">
// //                       <Calendar className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
// //                       <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
// //                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none" />
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Department</label>
// //                     <div className="relative">
// //                       <Building className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
// //                       <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}
// //                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
// //                         <option value="all">All Departments</option>
// //                         {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
// //                       </select>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Branch</label>
// //                     <div className="relative">
// //                       <MapPin className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
// //                       <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}
// //                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
// //                         <option value="all">All Branches</option>
// //                         {branches.map(b => <option key={b} value={b}>{getBranchDisplayName(b)}</option>)}
// //                       </select>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Employee</label>
// //                     <div className="relative">
// //                       <User className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
// //                       <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}
// //                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
// //                         <option value="all">All Employees</option>
// //                         {employeeNames.map(emp => (
// //                           <option key={emp.id} value={emp.id}>
// //                             {emp.name} ({emp.id}) - {getBranchDisplayName(emp.source)}
// //                           </option>
// //                         ))}
// //                       </select>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Status</label>
// //                     <div className="relative">
// //                       <Filter className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
// //                       <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
// //                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
// //                         <option value="all">All Status</option>
// //                         <option value="Present">Present</option>
// //                         <option value="Absent">Absent</option>
// //                         <option value="Leave">Leave</option>
// //                         <option value="Half Day">Half Day</option>
// //                         <option value="Off">Off</option>
// //                       </select>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="bg-white shadow-sm overflow-hidden">
// //               <div className="overflow-x-auto">
// //                 <table className="w-full text-[10px]">
// //                   <thead>
// //                     <tr className="bg-gray-50 border-b border-gray-200">
// //                       {['#','Emp ID','Name','Dept','Designation','Shift','Date','Day','Check In','Check Out','Hours','Total Hours','SV Check In','SV Check Out','Company','Status','SV','Site Visits (Company - From - To)'].map(h => (
// //                         <th key={h} className="px-1.5 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-gray-200">
// //                     {filteredData.length === 0 ? (
// //                       <tr>
// //                         <td colSpan={18} className="px-2 py-3 text-center text-gray-500 text-xs">
// //                           <div className="flex flex-col items-center gap-1">
// //                             <Users className="w-6 h-6 text-gray-300" />
// //                             <p className="tracking-wide">No data found</p>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ) : (
// //                       filteredData.map((record, index) => (
// //                         <AttendanceRow
// //                           key={`${record.employeeId}_${record.date}_${index}`}
// //                           record={record}
// //                           index={index}
// //                           shiftDisplay={getShiftDisplay(record.shiftTiming, record.shift)}
// //                         />
// //                       ))
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>

// //             {filteredData.length > 0 && (
// //               <div className="mt-1.5 bg-white shadow-sm p-1.5">
// //                 <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-600 tracking-wide">
// //                   <div>{filteredData.length} records</div>
// //                   <div className="flex items-center gap-2">
// //                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-green-500 rounded"></span> P: {summary.present}</span>
// //                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-red-500 rounded"></span> A: {summary.absent}</span>
// //                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-blue-500 rounded"></span> L: {summary.leave}</span>
// //                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-yellow-500 rounded"></span> H: {summary.halfDay}</span>
// //                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-gray-400 rounded"></span> OFF: {summary.off}</span>
// //                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-orange-500 rounded"></span> SV: {summary.totalSiteVisits}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             <div className="mt-1.5 grid grid-cols-3 gap-1.5">
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="flex items-center gap-1 text-[10px] text-gray-600">
// //                   <Users className="w-3 h-3 text-[#0071BD]" />
// //                   <span className="font-medium">Employees</span>
// //                 </div>
// //                 <div className="text-base font-bold text-[#0071BD]">{employees.length}</div>
// //               </div>
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="flex items-center gap-1 text-[10px] text-gray-600">
// //                   <Calendar className="w-3 h-3 text-[#0071BD]" />
// //                   <span className="font-medium">Range</span>
// //                 </div>
// //                 <div className="text-[10px] font-medium text-gray-700">
// //                   {formatDate(fromDate)} - {formatDate(toDate)}
// //                 </div>
// //               </div>
// //               <div className="bg-white shadow-sm p-1.5">
// //                 <div className="flex items-center gap-1 text-[10px] text-gray-600">
// //                   <Building className="w-3 h-3 text-[#0071BD]" />
// //                   <span className="font-medium">Depts</span>
// //                 </div>
// //                 <div className="text-base font-medium text-gray-700">{departments.length}</div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <Footer />
// //       </ProtectedRoute>
// //     </>
// //   )
// // }


// // app/hr/get-sheet/page.tsx
// 'use client'

// import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react'
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
//   enable_site_visits?: boolean
//   shift?: 'A' | 'B' | null
//   shift_timing?: string | null
//   check_in?: any
//   check_out?: any
//   site_visits?: any
//   qualifications?: any
//   experience?: any
//   leaves?: any
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
//   siteVisitCount: number
//   siteVisitDetails: string
//   svCheckIn: string
//   svCheckOut: string
//   // ✅ Manual (HR_MANUAL_) flags
//   isManualCheckIn: boolean
//   isManualCheckOut: boolean
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

// const safeParseArray = (raw: any): any[] => {
//   if (!raw) return []
//   try {
//     let val = raw
//     if (typeof val === 'string') {
//       val = JSON.parse(val)
//     }
//     if (Array.isArray(val)) return val
//     if (val && typeof val === 'object') {
//       if (Array.isArray(val.visits)) return val.visits
//       if (Array.isArray(val.data)) return val.data
//       if (Array.isArray(val.items)) return val.items
//       const keys = Object.keys(val)
//       if (keys.length > 0) {
//         return keys.map(k => ({ ...val[k], _key: k }))
//       }
//     }
//     return []
//   } catch {
//     return []
//   }
// }

// const parseTimeToMinutes = (val: string): number | null => {
//   if (!val || val === '-') return null
//   const s = String(val).trim()

//   if (s.length > 10 && /T\d/.test(s)) {
//     const d = new Date(s)
//     if (!isNaN(d.getTime())) return d.getHours() * 60 + d.getMinutes()
//   }

//   const ampmMatch = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i)
//   if (ampmMatch) {
//     let h = parseInt(ampmMatch[1])
//     const m = parseInt(ampmMatch[2])
//     const ampm = ampmMatch[4].toUpperCase()
//     if (ampm === 'PM' && h !== 12) h += 12
//     if (ampm === 'AM' && h === 12) h = 0
//     return h * 60 + m
//   }

//   const m24 = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
//   if (m24) {
//     const h = parseInt(m24[1])
//     const m = parseInt(m24[2])
//     if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
//       return h * 60 + m
//     }
//   }

//   return null
// }

// const formatSiteVisitTime = (val: string): string => {
//   if (!val || !String(val).trim()) return '-'
//   const s = String(val).trim()
//   if (s === '-') return '-'

//   if (s.length > 10 && /T\d/.test(s)) {
//     const d = new Date(s)
//     if (!isNaN(d.getTime())) {
//       return d.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       })
//     }
//   }

//   if (/AM|PM/i.test(s)) return s.toUpperCase()

//   const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
//   if (m) {
//     let h = parseInt(m[1])
//     const min = m[2]
//     const ampm = h >= 12 ? 'PM' : 'AM'
//     h = h % 12
//     if (h === 0) h = 12
//     return `${String(h).padStart(2, '0')}:${min} ${ampm}`
//   }

//   return s
// }

// function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value)
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay)
//     return () => clearTimeout(handler)
//   }, [value, delay])
//   return debouncedValue
// }

// // ✅ AttendanceRow — now shows yellow color for HR_MANUAL logs
// const AttendanceRow = memo(({ record, index, shiftDisplay }: {
//   record: AttendanceRecord
//   index: number
//   shiftDisplay: string
// }) => {
//   const svIn = record.svCheckIn !== '-' ? formatSiteVisitTime(record.svCheckIn) : '-'
//   const svOut = record.svCheckOut !== '-' ? formatSiteVisitTime(record.svCheckOut) : '-'

//   return (
//     <tr className={`transition ${record.status === 'Off' ? 'bg-gray-200' : 'hover:bg-gray-50'}`}>
//       <td className="px-1.5 py-0.5 text-[10px] text-gray-500 whitespace-nowrap">{index + 1}</td>
//       <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap">{record.employeeId}</td>
//       <td className="px-1.5 py-0.5 text-[10px] text-gray-700 whitespace-nowrap">{record.name}</td>
//       <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.department}</td>
//       <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.designation}</td>
//       <td className="px-1.5 py-0.5 text-[10px] text-gray-700 whitespace-nowrap font-medium">
//         {shiftDisplay !== '-' ? (
//           <span className="px-1 py-0.5 text-[9px] font-bold tracking-wide rounded bg-blue-100 text-blue-700">
//             {shiftDisplay}
//           </span>
//         ) : (
//           <span className="text-gray-400">-</span>
//         )}
//       </td>
//       <td className="px-1.5 py-0.5 text-[10px] text-gray-600 whitespace-nowrap">{record.date}</td>
//       <td className={`px-1.5 py-0.5 text-[10px] whitespace-nowrap ${record.day === 'Sunday' ? 'font-bold text-red-600' : 'text-gray-600'}`}>{record.day}</td>
//       <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
//         {record.hasCheckIn ? (
//           <div className="flex items-center gap-0.5">
//             <LogIn className={`w-3 h-3 flex-shrink-0 ${record.isManualCheckIn ? 'text-yellow-500' : 'text-green-500'}`} />
//             <span className={`font-medium ${record.isManualCheckIn ? 'text-yellow-600' : 'text-gray-700'}`}>
//               {record.checkIn}
//             </span>
//           </div>
//         ) : <span className="text-gray-400">-</span>}
//       </td>
//       <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
//         {record.hasCheckOut ? (
//           <div className="flex items-center gap-0.5">
//             <LogOut className={`w-3 h-3 flex-shrink-0 ${record.isManualCheckOut ? 'text-yellow-500' : 'text-red-500'}`} />
//             <span className={`font-medium ${record.isManualCheckOut ? 'text-yellow-600' : 'text-gray-700'}`}>
//               {record.checkOut}
//             </span>
//           </div>
//         ) : <span className="text-gray-400">-</span>}
//       </td>
//       <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap text-center">{record.totalHours}</td>
//       <td className="px-1.5 py-0.5 text-[10px] font-bold text-blue-700 whitespace-nowrap text-center">{record.totalHoursWithOS}</td>
//       <td className="px-1.5 py-0.5 text-[10px] font-bold text-orange-600 whitespace-nowrap text-center">{svIn}</td>
//       <td className="px-1.5 py-0.5 text-[10px] font-bold text-orange-600 whitespace-nowrap text-center">{svOut}</td>
//       <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
//         <span className={`px-1 py-0.5 text-[9px] font-medium tracking-wide rounded-full ${
//           record.branchCode === 'PQ'
//             ? 'bg-purple-100 text-purple-700 border border-purple-200'
//             : 'bg-blue-100 text-blue-700 border border-blue-200'
//         }`}>
//           {record.branch}
//         </span>
//       </td>
//       <td className="px-1.5 py-0.5 whitespace-nowrap">
//         <span className={`px-1 py-0.5 text-[9px] font-medium tracking-wide rounded-full ${
//           record.status === 'Present' ? 'bg-green-100 text-green-700' :
//           record.status === 'Absent' ? 'bg-red-100 text-red-700' :
//           record.status === 'Leave' ? 'bg-blue-100 text-blue-700' :
//           record.status === 'Off' ? 'bg-gray-300 text-gray-800 font-bold' :
//           'bg-yellow-100 text-yellow-700'
//         }`}>
//           {record.status}
//         </span>
//       </td>
//       <td className="px-1.5 py-0.5 text-[10px] text-center whitespace-nowrap">
//         {record.siteVisitCount > 0 ? (
//           <span className="px-1 py-0.5 text-[9px] font-bold rounded bg-orange-100 text-orange-700">
//             {record.siteVisitCount}
//           </span>
//         ) : (
//           <span className="text-gray-400">-</span>
//         )}
//       </td>
//       <td className="px-1.5 py-0.5 text-[9px] text-gray-600 max-w-[320px] truncate" title={record.siteVisitDetails}>
//         {record.siteVisitDetails}
//       </td>
//     </tr>
//   )
// })

// AttendanceRow.displayName = 'AttendanceRow'

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
//   const [selectedStatus, setSelectedStatus] = useState<string>('all')

//   const debouncedFromDate = useDebounce(fromDate, 300)
//   const debouncedToDate = useDebounce(toDate, 300)

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

//   const addThreeDurations = useCallback((a: string, b: string, c: string): string => {
//     const parse = (h: string): number => {
//       if (!h || h === '-') return 0
//       const parts = h.split(':')
//       const hours = parseInt(parts[0] || '0')
//       const minutes = parseInt(parts[1] || '0')
//       const seconds = parseInt(parts[2] || '0')
//       return hours * 3600 + minutes * 60 + seconds
//     }
//     const total = parse(a) + parse(b) + parse(c)
//     if (total <= 0) return '-'
//     return `${String(Math.floor(total / 3600)).padStart(2, '0')}:${String(Math.floor((total % 3600) / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
//   }, [])

//   const calculateSVHours = useCallback((fromTime: string, toTime: string): string => {
//     if (!fromTime || !toTime || fromTime === '-' || toTime === '-') return '-'
//     try {
//       const fromMin = parseTimeToMinutes(fromTime)
//       const toMin = parseTimeToMinutes(toTime)
//       if (fromMin === null || toMin === null) return '-'

//       let diff = toMin - fromMin
//       if (diff < 0) diff += 24 * 60

//       const h = Math.floor(diff / 60)
//       const mn = diff % 60
//       return `${String(h).padStart(2, '0')}:${String(mn).padStart(2, '0')}:00`
//     } catch {
//       return '-'
//     }
//   }, [])

//   const parseHoursToDecimal = useCallback((h: string): number => {
//     if (!h || h === '-') return 0
//     const parts = h.split(':')
//     const hours = parseInt(parts[0] || '0')
//     const minutes = parseInt(parts[1] || '0')
//     const seconds = parseInt(parts[2] || '0')
//     return hours + minutes / 60 + seconds / 3600
//   }, [])

//   const getQualificationsString = useCallback((qualifications: any) => {
//     const arr = safeParseArray(qualifications)
//     if (arr.length === 0) return '-'
//     return arr.map((q: any) => `${q.degree} (${q.institution}, ${q.year}) - ${q.grade}`).join('; ')
//   }, [])

//   const getExperienceString = useCallback((experience: any) => {
//     const arr = safeParseArray(experience)
//     if (arr.length === 0) return '-'
//     return arr.map((exp: any) => `${exp.position} at ${exp.company}`).join('; ')
//   }, [])

//   // =====================================================
//   // SITE VISITS
//   // =====================================================
//   const getSiteVisitsForDate = useCallback((employee: Employee, dateStr: string) => {
//     const visits = safeParseArray(employee.site_visits)

//     if (visits.length === 0) {
//       return {
//         count: 0,
//         entries: [] as string[],
//         svCheckIn: '-',
//         svCheckOut: '-',
//       }
//     }

//     const dayVisits = visits.filter((v: any) => {
//       if (!v) return false

//       const visitDateRaw =
//         v.visitDate ||
//         v.visit_date ||
//         v.fromTime ||
//         v.from_time ||
//         v.from ||
//         v.time ||
//         v.date ||
//         v.timestamp ||
//         v._key ||
//         ''

//       if (!visitDateRaw) return false

//       const visitDate = toLocalDateStr(String(visitDateRaw))
//       return visitDate === dateStr
//     })

//     const entries = dayVisits.map((v: any) => {
//       const fromRaw = v.fromTime || v.from_time || v.from || v.time || ''
//       const toRaw = v.toTime || v.to_time || v.to || ''
//       const company = v.companyName || v.company_name || v.company || v.site || v.name || ''

//       const fromFmt = fromRaw ? formatSiteVisitTime(String(fromRaw)) : ''
//       const toFmt = toRaw ? formatSiteVisitTime(String(toRaw)) : ''

//       const timeRange = fromFmt && toFmt
//         ? `${fromFmt} - ${toFmt}`
//         : fromFmt || toFmt || ''

//       if (company && timeRange) return `${company} (${timeRange})`
//       if (company) return company
//       if (timeRange) return timeRange
//       return '-'
//     })

//     let earliestFrom: string | null = null
//     let earliestFromMs = Infinity
//     let latestTo: string | null = null
//     let latestToMs = -Infinity

//     dayVisits.forEach((v: any) => {
//       const fromRaw = v.fromTime || v.from_time || v.from || v.time || ''
//       const toRaw = v.toTime || v.to_time || v.to || ''

//       const fromStr = String(fromRaw || '').trim()
//       const toStr = String(toRaw || '').trim()

//       if (fromStr) {
//         const mins = parseTimeToMinutes(fromStr)
//         if (mins !== null && mins < earliestFromMs) {
//           earliestFromMs = mins
//           earliestFrom = fromStr
//         }
//       }

//       if (toStr) {
//         const mins = parseTimeToMinutes(toStr)
//         if (mins !== null && mins > latestToMs) {
//           latestToMs = mins
//           latestTo = toStr
//         }
//       }
//     })

//     return {
//       count: dayVisits.length,
//       entries,
//       svCheckIn: earliestFrom || '-',
//       svCheckOut: latestTo || '-',
//     }
//   }, [])

//   const getEmployeeAttendance = useCallback((employee: Employee, date: string, logs: AttendanceLog[]): AttendanceRecord => {
//     const dateStr = date
//     const dayName = getDayName(dateStr)

//     const siteVisitData = getSiteVisitsForDate(employee, dateStr)
//     const siteVisitCount = siteVisitData.count
//     const siteVisitDetails = siteVisitData.entries.length > 0
//       ? siteVisitData.entries.join(' | ')
//       : '-'

//     const svDuration = calculateSVHours(siteVisitData.svCheckIn, siteVisitData.svCheckOut)

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
//         shiftTiming: employee.shift_timing || undefined,
//         siteVisitCount,
//         siteVisitDetails,
//         svCheckIn: siteVisitData.svCheckIn,
//         svCheckOut: siteVisitData.svCheckOut,
//         isManualCheckIn: false,
//         isManualCheckOut: false,
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

//     const leavesArr = safeParseArray(employee.leaves)
//     const leave = leavesArr.find(
//       (l: any) => l.fromDate <= dateStr && l.toDate >= dateStr && l.status === 'approved'
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

//     const checkInArr = safeParseArray(employee.check_in)
//     const checkOutArr = safeParseArray(employee.check_out)

//     if (checkInArr.length > 0) {
//       const checkInJson = checkInArr.find((c: any) => toLocalDateStr(c.time) === dateStr)
//       if (checkInJson) outsideCheckInTime = checkInJson.time
//     }
//     if (checkOutArr.length > 0) {
//       const checkOutJson = checkOutArr.find((c: any) => toLocalDateStr(c.time) === dateStr)
//       if (checkOutJson) outsideCheckOutTime = checkOutJson.time
//     }

//     const outsideCheckIn = outsideCheckInTime ? formatTime(outsideCheckInTime) : '-'
//     const outsideCheckOut = outsideCheckOutTime ? formatTime(outsideCheckOutTime) : '-'
//     const outsideTotalHours = (outsideCheckInTime && outsideCheckOutTime)
//       ? calculateOutsideHours(outsideCheckInTime, outsideCheckOutTime) : '-'

//     const displayCheckIn = isOnLeave ? '-' : (checkInLog ? formatTime(checkInLog.timestamp) : '-')
//     const displayCheckOut = isOnLeave ? '-' : (checkOutLog ? formatTime(checkOutLog.timestamp) : '-')

//     const attendanceHours = isOnLeave
//       ? '-'
//       : calculateTotalHours(checkInLog?.timestamp || '', checkOutLog?.timestamp || '')

//     const totalHoursCombined = isOnLeave
//       ? '-'
//       : addThreeDurations(
//           attendanceHours,
//           svDuration,
//           outsideTotalHours === '-' ? '00:00:00' : outsideTotalHours
//         )

//     const displayCheckInLocation = isOnLeave ? '-' : (checkInLog?.branch_code || '-')
//     const displayCheckOutLocation = isOnLeave ? '-' : (checkOutLog?.branch_code || '-')

//     let source = employee.source || 'K'
//     if (!employee.source) {
//       source = (checkInLog?.source || checkOutLog?.source || 'K') as 'K' | 'PQ'
//     }

//     // ✅ Detect if the check-in / check-out logs are HR manual
//     const isManualCheckIn =
//       !!checkInLog?.raw_log_key &&
//       String(checkInLog.raw_log_key).toUpperCase().startsWith('HR_MANUAL')

//     const isManualCheckOut =
//       !!checkOutLog?.raw_log_key &&
//       String(checkOutLog.raw_log_key).toUpperCase().startsWith('HR_MANUAL')

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
//       totalHours: attendanceHours,
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
//       totalHoursWithOS: totalHoursCombined,
//       shift: employee.shift || undefined,
//       shiftTiming: employee.shift_timing || undefined,
//       siteVisitCount,
//       siteVisitDetails,
//       svCheckIn: siteVisitData.svCheckIn,
//       svCheckOut: siteVisitData.svCheckOut,
//       isManualCheckIn,
//       isManualCheckOut,
//     }
//   }, [formatDate, getDayName, formatTime, calculateTotalHours, calculateOutsideHours, getQualificationsString, getExperienceString, getSiteVisitsForDate, addThreeDurations, calculateSVHours])

//   const getSelectedEmployeeName = useCallback(() => {
//     if (selectedEmployee === 'all') return 'All Employees'
//     const emp = employees.find(e => e.employee_id === selectedEmployee)
//     return emp?.full_name || 'Selected Employee'
//   }, [employees, selectedEmployee])

//   const getPrintRowColorByStatus = useCallback((status: string): string => {
//     switch (status) {
//       case 'Present': return '#C6EFCE'
//       case 'Absent': return '#FFC7CE'
//       case 'Half Day': return '#FFEB9C'
//       case 'Leave': return '#F8CBAD'
//       case 'Off': return '#E5E7EB'
//       default: return 'transparent'
//     }
//   }, [])

//   // =====================================================
//   // fetchData
//   // =====================================================
//   const fetchData = useCallback(async () => {
//     if (!isMounted.current) return
//     try {
//       setLoading(true)
//       setError(null)

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

//       const employeeIdSet = new Set<string>(
//         employeeData
//           .map((e: any) => String(e.employee_id ?? '').trim())
//           .filter(Boolean)
//       )

//       const employeeIdsArray = Array.from(employeeIdSet)

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

//           if (data.length < PAGE_SIZE) break

//           from += PAGE_SIZE
//         }

//         return all
//       }

//       const [mainLogsData, pqLogsData] = await Promise.all([
//         fetchAllRows('attendance_logs', true),
//         fetchAllRows('pq_attendance_logs', false)
//       ])

//       const allLogs: AttendanceLog[] = []

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

//       allLogs.sort(
//         (a, b) =>
//           new Date(a.timestamp).getTime() -
//           new Date(b.timestamp).getTime()
//       )

//       const kCount = allLogs.filter(l => l.source === 'K').length
//       const pqCount = allLogs.filter(l => l.source === 'PQ').length

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
//     } catch (err: any) {
//       console.error('❌ Attendance fetch error:', err)
//       if (isMounted.current) {
//         setError(err?.message || 'Failed to load attendance data')
//         setLoading(false)
//       }
//     }
//   }, [])

//   const generateAttendanceSheet = useCallback(() => {
//     if (!debouncedFromDate || !debouncedToDate || employees.length === 0) return

//     const startDate = new Date(debouncedFromDate + 'T00:00:00')
//     const endDate = new Date(debouncedToDate + 'T00:00:00')
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
//   }, [employees, debouncedFromDate, debouncedToDate, selectedDepartment, selectedBranch, selectedEmployee, attendanceLogs, getEmployeeAttendance])

//   useEffect(() => {
//     if (selectedStatus === 'all') {
//       setFilteredData(attendanceData)
//     } else {
//       setFilteredData(attendanceData.filter(r => r.status === selectedStatus))
//     }
//   }, [attendanceData, selectedStatus])

//   useEffect(() => {
//     if (employees.length > 0 && debouncedFromDate && debouncedToDate) {
//       generateAttendanceSheet()
//     }
//   }, [employees, debouncedFromDate, debouncedToDate, selectedDepartment, selectedBranch, selectedEmployee, generateAttendanceSheet])

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

//   const summary = useMemo(() => {
//     const total = filteredData.length
//     const present = filteredData.filter(r => r.status === 'Present').length
//     const absent = filteredData.filter(r => r.status === 'Absent').length
//     const leave = filteredData.filter(r => r.status === 'Leave').length
//     const halfDay = filteredData.filter(r => r.status === 'Half Day').length
//     const off = filteredData.filter(r => r.status === 'Off').length
//     const totalSiteVisits = filteredData.reduce((sum, r) => sum + r.siteVisitCount, 0)
//     return { total, present, absent, leave, halfDay, off, totalSiteVisits }
//   }, [filteredData])

//   // =====================================================
//   // Summary calculation (used by export + payroll)
//   // =====================================================
//   const calculateSummariesForDateRange = useCallback((): any[] => {
//     if (filteredData.length === 0) return []

//     const groups: Record<string, AttendanceRecord[]> = {}

//     filteredData.forEach(r => {
//       const key = `${r.employeeId}__${r.branchCode}`
//       if (!groups[key]) groups[key] = []
//       groups[key].push(r)
//     })

//     const summaries: any[] = []

//     Object.entries(groups).forEach(([, records]) => {
//       if (records.length === 0) return

//       const first = records[0]

//       let presentDays = 0
//       let absentDays = 0
//       let leaveDays = 0
//       let halfDays = 0
//       let offDays = 0
//       let totalAttendanceHours = 0
//       let totalSVHours = 0
//       let totalHours = 0
//       let totalSiteVisits = 0
//       let lateHours = 0
//       let overtimeHours = 0

//       const shiftHours = getShiftTotalHours(first.shiftTiming)

//       records.forEach(r => {
//         if (r.status === 'Present') presentDays++
//         else if (r.status === 'Absent') absentDays++
//         else if (r.status === 'Leave') leaveDays++
//         else if (r.status === 'Half Day') halfDays++
//         else if (r.status === 'Off') offDays++

//         const attHrs = parseHoursToDecimal(r.totalHours)
//         totalAttendanceHours += attHrs

//         const svDur = calculateSVHours(r.svCheckIn, r.svCheckOut)
//         const svHrs = parseHoursToDecimal(svDur)
//         totalSVHours += svHrs

//         const totalHrs = parseHoursToDecimal(r.totalHoursWithOS)
//         totalHours += totalHrs

//         totalSiteVisits += r.siteVisitCount

//         if (
//           r.day !== 'Sunday' &&
//           r.status !== 'Off' &&
//           r.status !== 'Leave' &&
//           r.status !== 'Absent'
//         ) {
//           if (totalHrs > 0 && totalHrs < shiftHours) {
//             lateHours += (shiftHours - totalHrs)
//           }
//           if (totalHrs > shiftHours) {
//             overtimeHours += (totalHrs - shiftHours)
//           }
//         }
//       })

//       summaries.push({
//         employee_id: first.employeeId,
//         employee_name: first.name,
//         department: first.department || null,
//         designation: first.designation || null,
//         shift: getShiftDisplay(first.shiftTiming, first.shift),
//         branch: first.branch || 'Korangi',
//         from_date: fromDate,
//         to_date: toDate,
//         total_days: records.length,
//         present_days: presentDays,
//         absent_days: absentDays,
//         leave_days: leaveDays,
//         half_days: halfDays,
//         off_days: offDays,
//         total_working_hours: Math.round(totalAttendanceHours * 100) / 100,
//         total_sv_hours: Math.round(totalSVHours * 100) / 100,
//         total_hours: Math.round(totalHours * 100) / 100,
//         total_site_visits: totalSiteVisits,
//         late_hours: Math.round(lateHours * 100) / 100,
//         overtime_hours: Math.round(overtimeHours * 100) / 100,
//       })
//     })

//     return summaries
//   }, [filteredData, fromDate, toDate, parseHoursToDecimal, calculateSVHours])

//   // =====================================================
//   // EXPORT: CSV (raw only)
//   // =====================================================
//   const handleExportCSV = useCallback(() => {
//     if (filteredData.length === 0) { alert('No data to export'); return }

//     const headers = [
//       'User ID', 'Name', 'Dept', 'Designation', 'Shift', 'Date', 'Day',
//       'Check In', 'Check Out', 'Hours', 'Total Hours',
//       'SV Check In', 'SV Check Out',
//       'Company', 'Status',
//       'Site Visit Count', 'Site Visits (Company - From - To)'
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
//       r.svCheckIn !== '-' ? formatSiteVisitTime(r.svCheckIn) : '-',
//       r.svCheckOut !== '-' ? formatSiteVisitTime(r.svCheckOut) : '-',
//       r.branch,
//       r.status,
//       r.siteVisitCount > 0 ? String(r.siteVisitCount) : '0',
//       r.siteVisitDetails
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
//     setExportSuccess(`✅ Raw CSV downloaded`)
//     setTimeout(() => setExportSuccess(null), 3000)
//   }, [filteredData, fromDate, toDate])

//   // =====================================================
//   // EXPORT: PDF (raw only) — HR_MANUAL yellow color
//   // =====================================================
//   const handleExportPDF = useCallback(() => {
//     if (filteredData.length === 0) { alert('No data to export'); return }

//     const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
//     const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
//     const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

//     let tableRows = ''
//     filteredData.forEach((record, index) => {
//       const isSunday = record.day === 'Sunday'
//       const rowColor = getPrintRowColorByStatus(record.status)
//       const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
//       const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)
//       const svIn = record.svCheckIn !== '-' ? formatSiteVisitTime(record.svCheckIn) : '-'
//       const svOut = record.svCheckOut !== '-' ? formatSiteVisitTime(record.svCheckOut) : '-'

//       // ✅ Yellow color for HR_MANUAL check-in / check-out
//       const checkInStyle = record.isManualCheckIn ? 'color: #ca8a04; font-weight: bold;' : ''
//       const checkOutStyle = record.isManualCheckOut ? 'color: #ca8a04; font-weight: bold;' : ''

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
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; ${checkInStyle}">${record.checkIn}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; ${checkOutStyle}">${record.checkOut}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.totalHours}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; color: #ea580c; font-weight: bold;">${svIn}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; color: #ea580c; font-weight: bold;">${svOut}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.branch}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.status}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.siteVisitCount > 0 ? record.siteVisitCount : '-'}</td>
//           <td style="padding: 3px 4px; border: 1px solid #000; font-size: 7px; text-align: left; max-width: 180px; word-break: break-word;">${record.siteVisitDetails}</td>
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
//                   <th style="width:3%">SV Check In</th>
//                   <th style="width:3%">SV Check Out</th>
//                   <th style="width:3%">Company</th>
//                   <th style="width:3%">Status</th>
//                   <th style="width:2%">SV</th>
//                   <th style="width:14%">Site Visits (Company - From - To)</th>
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
//     setExportSuccess(`✅ Raw PDF ready`)
//     setTimeout(() => setExportSuccess(null), 4000)
//   }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getPrintRowColorByStatus, fromDate, toDate, formatDateForDisplay])

//   // =====================================================
//   // NEW: EXPORT SUMMARY as CSV (+ save to DB)
//   // =====================================================
//   const handleExportSummaryCSV = useCallback(async () => {
//     if (filteredData.length === 0) { alert('No data to export'); return }

//     const summaries = calculateSummariesForDateRange()

//     if (summaries.length === 0) {
//       alert('Could not generate summary')
//       return
//     }

//     let summarySaved = false
//     try {
//       const { error: upsertError } = await supabase
//         .from('attendance_summaries')
//         .upsert(summaries, {
//           onConflict: 'employee_id,from_date,to_date,branch',
//           ignoreDuplicates: false,
//         })

//       if (upsertError) {
//         console.error('Summary save error:', upsertError)
//       } else {
//         summarySaved = true
//       }
//     } catch (err) {
//       console.error('Summary save exception:', err)
//     }

//     const headers = [
//       'Employee ID', 'Employee Name', 'Department', 'Designation',
//       'Shift', 'Branch', 'From Date', 'To Date',
//       'Total Days', 'Present', 'Absent', 'Leave', 'Half Days', 'Off',
//       'Working Hours', 'SV Hours', 'Total Hours',
//       'Site Visits', 'Late Hours', 'Overtime Hours'
//     ]

//     const rows = summaries.map(s => [
//       s.employee_id,
//       s.employee_name,
//       s.department || '',
//       s.designation || '',
//       s.shift || '',
//       s.branch || '',
//       s.from_date,
//       s.to_date,
//       s.total_days,
//       s.present_days,
//       s.absent_days,
//       s.leave_days,
//       s.half_days,
//       s.off_days,
//       s.total_working_hours,
//       s.total_sv_hours,
//       s.total_hours,
//       s.total_site_visits,
//       s.late_hours,
//       s.overtime_hours,
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
//     link.download = `attendance_summary_${fromDate}_to_${toDate}.csv`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     URL.revokeObjectURL(url)

//     setShowExportMenu(false)
//     setExportSuccess(
//       summarySaved
//         ? `✅ Summary CSV downloaded + ${summaries.length} summaries saved`
//         : `✅ Summary CSV downloaded (${summaries.length} records)`
//     )
//     setTimeout(() => setExportSuccess(null), 5000)
//   }, [filteredData, fromDate, toDate, calculateSummariesForDateRange])

//   // =====================================================
//   // NEW: EXPORT SUMMARY as PDF (+ save to DB)
//   // =====================================================
//   const handleExportSummaryPDF = useCallback(async () => {
//     if (filteredData.length === 0) { alert('No data to export'); return }

//     const summaries = calculateSummariesForDateRange()

//     if (summaries.length === 0) {
//       alert('Could not generate summary')
//       return
//     }

//     let summarySaved = false
//     try {
//       const { error: upsertError } = await supabase
//         .from('attendance_summaries')
//         .upsert(summaries, {
//           onConflict: 'employee_id,from_date,to_date,branch',
//           ignoreDuplicates: false,
//         })

//       if (upsertError) {
//         console.error('Summary save error:', upsertError)
//       } else {
//         summarySaved = true
//       }
//     } catch (err) {
//       console.error('Summary save exception:', err)
//     }

//     const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
//     const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
//     const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

//     let tableRows = ''
//     summaries.forEach((s, index) => {
//       tableRows += `
//         <tr>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${index + 1}</td>
//           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.employee_id}</td>
//           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.employee_name}</td>
//           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.department || '-'}</td>
//           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.designation || '-'}</td>
//           <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.branch || '-'}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.from_date}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.to_date}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.total_days}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: green; font-weight: bold;">${s.present_days}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: red; font-weight: bold;">${s.absent_days}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: blue; font-weight: bold;">${s.leave_days}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: orange; font-weight: bold;">${s.half_days}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.off_days}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${Number(s.total_working_hours).toFixed(2)}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: #ea580c; font-weight: bold;">${Number(s.total_sv_hours).toFixed(2)}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; font-weight: bold; color: #1D4ED8;">${Number(s.total_hours).toFixed(2)}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.total_site_visits}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${Number(s.late_hours).toFixed(2)}</td>
//           <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${Number(s.overtime_hours).toFixed(2)}</td>
//         </tr>
//       `
//     })

//     const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Attendance Summary Report</title>
//           <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
//           <style>
//             @page { size: A4 landscape; margin: 8mm 6mm; }
//             * { box-sizing: border-box; margin: 0; padding: 0; }
//             body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #000; }
//             .header { text-align: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #000; }
//             .company { font-size: 14px; font-weight: 700; text-transform: uppercase; }
//             .title { font-size: 12px; font-weight: 700; margin-top: 3px; }
//             .sub-info { font-size: 9px; margin-top: 4px; font-weight: 500; }
//             .range { font-size: 9px; margin-top: 3px; }
//             table { width: 100%; border-collapse: collapse; font-size: 8px; margin-top: 6px; }
//             th { background: #C4BD97; padding: 5px 3px; border: 1px solid #000; text-transform: uppercase; font-size: 7px; text-align: center; }
//             td { padding: 4px; border: 1px solid #000; }
//             .footer { margin-top: 10px; text-align: center; font-size: 7px; border-top: 1px solid #000; padding-top: 6px; }
//             @media print {
//               th { background: #C4BD97 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div class="company">A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</div>
//             <div class="title">ATTENDANCE SUMMARY REPORT</div>
//             <div class="sub-info">${employeeName} | ${deptName} | ${branchName}</div>
//             <div class="range">${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}</div>
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Emp ID</th>
//                 <th>Name</th>
//                 <th>Dept</th>
//                 <th>Designation</th>
//                 <th>Branch</th>
//                 <th>From</th>
//                 <th>To</th>
//                 <th>Days</th>
//                 <th>P</th>
//                 <th>A</th>
//                 <th>L</th>
//                 <th>H</th>
//                 <th>Off</th>
//                 <th>Work Hrs</th>
//                 <th>SV Hrs</th>
//                 <th>Total Hrs</th>
//                 <th>SV</th>
//                 <th>Late</th>
//                 <th>OT</th>
//               </tr>
//             </thead>
//             <tbody>${tableRows}</tbody>
//           </table>
//           <div class="footer">
//             This summary is generated by system software | A to Zee Switchgear Engineering (SMC) Pvt. Ltd.
//           </div>
//           <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
//         </body>
//       </html>
//     `

//     const w = window.open('', '_blank')
//     if (!w) { alert('Please allow popups'); return }
//     w.document.write(html)
//     w.document.close()
//     setShowExportMenu(false)
//     setExportSuccess(
//       summarySaved
//         ? `✅ Summary PDF ready + ${summaries.length} summaries saved`
//         : `✅ Summary PDF ready (${summaries.length} records)`
//     )
//     setTimeout(() => setExportSuccess(null), 5000)
//   }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, fromDate, toDate, formatDateForDisplay, calculateSummariesForDateRange])

//   // =====================================================
//   // Monthly Summary (for Payroll)
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

//   const handleExportForPayroll = useCallback(async () => {
//     if (filteredData.length === 0) {
//       alert('No data to submit')
//       return
//     }

//     const monthlySummaries = calculateMonthlySummaries()
//     const dateRangeSummaries = calculateSummariesForDateRange()

//     if (monthlySummaries.length === 0) {
//       alert('Could not calculate summaries — check date range')
//       return
//     }

//     if (!confirm(
//       `Submit to database:\n` +
//       `• ${monthlySummaries.length} monthly summary (attendance_sheet)\n` +
//       `• ${dateRangeSummaries.length} date-range summary (attendance_summaries)\n\n` +
//       `Existing records will be UPDATED.`
//     )) {
//       return
//     }

//     try {
//       setSubmittingPayroll(true)
//       setError(null)

//       const { data: monthlyData, error: monthlyErr } = await supabase
//         .from('attendance_sheet')
//         .upsert(monthlySummaries, {
//           onConflict: 'user_id,month,company',
//           ignoreDuplicates: false
//         })
//         .select()

//       if (monthlyErr) throw new Error(monthlyErr.message)

//       let rangeSaved = 0
//       if (dateRangeSummaries.length > 0) {
//         const { data: rangeData, error: rangeErr } = await supabase
//           .from('attendance_summaries')
//           .upsert(dateRangeSummaries, {
//             onConflict: 'employee_id,from_date,to_date,branch',
//             ignoreDuplicates: false
//           })
//           .select()

//         if (rangeErr) {
//           console.error('Date-range summary error:', rangeErr)
//         } else {
//           rangeSaved = rangeData?.length || dateRangeSummaries.length
//         }
//       }

//       setShowExportMenu(false)
//       setExportSuccess(
//         `✅ ${monthlyData?.length || monthlySummaries.length} monthly + ${rangeSaved} range summaries saved`
//       )
//       setTimeout(() => setExportSuccess(null), 6000)
//     } catch (err: any) {
//       console.error('❌ Payroll submit error:', err)
//       setError(err.message || 'Failed to submit summaries')
//     } finally {
//       setSubmittingPayroll(false)
//     }
//   }, [filteredData, calculateMonthlySummaries, calculateSummariesForDateRange])

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
//   // Print — HR_MANUAL yellow color
//   // =====================================================
//   const handlePrintWithColor = useCallback((withColor: boolean) => {
//     setShowPrintOptions(false)

//     const data = filteredData
//     const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
//     const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
//     const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

//     const getRowColorForPrint = (record: AttendanceRecord) => {
//       if (!withColor) return 'transparent'
//       return getPrintRowColorByStatus(record.status)
//     }

//     let tableRows = ''
//     data.forEach((record, index) => {
//       const isSunday = record.day === 'Sunday'
//       const rowColor = getRowColorForPrint(record)
//       const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
//       const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)
//       const svIn = record.svCheckIn !== '-' ? formatSiteVisitTime(record.svCheckIn) : '-'
//       const svOut = record.svCheckOut !== '-' ? formatSiteVisitTime(record.svCheckOut) : '-'

//       // ✅ Yellow color for HR_MANUAL
//       const checkInStyle = record.isManualCheckIn ? 'color: #ca8a04; font-weight: bold;' : ''
//       const checkOutStyle = record.isManualCheckOut ? 'color: #ca8a04; font-weight: bold;' : ''

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
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; ${checkInStyle}">${record.checkIn}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; ${checkOutStyle}">${record.checkOut}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.totalHours}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; color: #ea580c; font-weight: bold;">${svIn}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; color: #ea580c; font-weight: bold;">${svOut}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.branch}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.status}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.siteVisitCount > 0 ? record.siteVisitCount : '-'}</td>
//           <td style="padding: 2px 3px; border: 1px solid #000; font-size: 6px; text-align: left; max-width: 150px; word-break: break-word;">${record.siteVisitDetails}</td>
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
//                   <th style="width:3%">SV Check In</th>
//                   <th style="width:3%">SV Check Out</th>
//                   <th style="width:3%">Company</th>
//                   <th style="width:3%">Status</th>
//                   <th style="width:2%">SV</th>
//                   <th style="width:14%">Site Visits (Company - From - To)</th>
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
//   }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getPrintRowColorByStatus, fromDate, toDate, formatDateForDisplay])

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
//                 <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">SV: {summary.totalSiteVisits}</span>

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
//                     <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 shadow-lg rounded z-50">
//                       {/* RAW DATA EXPORTS */}
//                       <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
//                         Raw Data
//                       </div>
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

//                       {/* SUMMARY EXPORTS */}
//                       <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
//                         Summary (saves to DB)
//                       </div>
//                       <button onClick={handleExportSummaryCSV}
//                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2">
//                         <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
//                         <span>Summary as CSV</span>
//                       </button>
//                       <button onClick={handleExportSummaryPDF}
//                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100">
//                         <FileText className="w-3.5 h-3.5 text-purple-600" />
//                         <span>Summary as PDF</span>
//                       </button>

//                       {/* PAYROLL */}
//                       <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
//                         Payroll
//                       </div>
//                       <button onClick={handleExportForPayroll}
//                         className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2">
//                         <Calculator className="w-3.5 h-3.5 text-orange-600" />
//                         <span>For Payroll (monthly + range)</span>
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
//                         <p className="text-xs text-gray-500">Status-based colors (P/A/H/L/Off)</p>
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

//             <div className="grid grid-cols-7 gap-1.5 mb-2">
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
//               <div className="bg-white shadow-sm p-1.5">
//                 <div className="text-[10px] text-orange-600 tracking-wide flex items-center gap-0.5">
//                   <MapPin className="w-2.5 h-2.5" /> SV
//                 </div>
//                 <div className="text-base font-bold text-orange-700 tracking-wider">{summary.totalSiteVisits}</div>
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
//                 <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mt-2">
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
//                   <div>
//                     <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Status</label>
//                     <div className="relative">
//                       <Filter className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
//                         className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
//                         <option value="all">All Status</option>
//                         <option value="Present">Present</option>
//                         <option value="Absent">Absent</option>
//                         <option value="Leave">Leave</option>
//                         <option value="Half Day">Half Day</option>
//                         <option value="Off">Off</option>
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
//                       {['#','Emp ID','Name','Dept','Designation','Shift','Date','Day','Check In','Check Out','Hours','Total Hours','SV Check In','SV Check Out','Company','Status','SV','Site Visits (Company - From - To)'].map(h => (
//                         <th key={h} className="px-1.5 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {filteredData.length === 0 ? (
//                       <tr>
//                         <td colSpan={18} className="px-2 py-3 text-center text-gray-500 text-xs">
//                           <div className="flex flex-col items-center gap-1">
//                             <Users className="w-6 h-6 text-gray-300" />
//                             <p className="tracking-wide">No data found</p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredData.map((record, index) => (
//                         <AttendanceRow
//                           key={`${record.employeeId}_${record.date}_${index}`}
//                           record={record}
//                           index={index}
//                           shiftDisplay={getShiftDisplay(record.shiftTiming, record.shift)}
//                         />
//                       ))
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
//                     <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-orange-500 rounded"></span> SV: {summary.totalSiteVisits}</span>
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

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react'
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
  enable_site_visits?: boolean
  shift?: 'A' | 'B' | null
  shift_timing?: string | null
  check_in?: any
  check_out?: any
  site_visits?: any
  qualifications?: any
  experience?: any
  leaves?: any
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
  siteVisitCount: number
  siteVisitDetails: string
  svCheckIn: string
  svCheckOut: string
  isManualCheckIn: boolean
  isManualCheckOut: boolean
  isSVCheckIn: boolean
  isSVCheckOut: boolean
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

const safeParseArray = (raw: any): any[] => {
  if (!raw) return []
  try {
    let val = raw
    if (typeof val === 'string') {
      val = JSON.parse(val)
    }
    if (Array.isArray(val)) return val
    if (val && typeof val === 'object') {
      if (Array.isArray(val.visits)) return val.visits
      if (Array.isArray(val.data)) return val.data
      if (Array.isArray(val.items)) return val.items
      const keys = Object.keys(val)
      if (keys.length > 0) {
        return keys.map(k => ({ ...val[k], _key: k }))
      }
    }
    return []
  } catch {
    return []
  }
}

const parseTimeToMinutes = (val: string): number | null => {
  if (!val || val === '-') return null
  const s = String(val).trim()

  if (s.length > 10 && /T\d/.test(s)) {
    const d = new Date(s)
    if (!isNaN(d.getTime())) return d.getHours() * 60 + d.getMinutes()
  }

  const ampmMatch = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i)
  if (ampmMatch) {
    let h = parseInt(ampmMatch[1])
    const m = parseInt(ampmMatch[2])
    const ampm = ampmMatch[4].toUpperCase()
    if (ampm === 'PM' && h !== 12) h += 12
    if (ampm === 'AM' && h === 12) h = 0
    return h * 60 + m
  }

  const m24 = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (m24) {
    const h = parseInt(m24[1])
    const m = parseInt(m24[2])
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return h * 60 + m
    }
  }

  return null
}

const formatSiteVisitTime = (val: string): string => {
  if (!val || !String(val).trim()) return '-'
  const s = String(val).trim()
  if (s === '-') return '-'

  if (s.length > 10 && /T\d/.test(s)) {
    const d = new Date(s)
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    }
  }

  if (/AM|PM/i.test(s)) return s.toUpperCase()

  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (m) {
    let h = parseInt(m[1])
    const min = m[2]
    const ampm = h >= 12 ? 'PM' : 'AM'
    h = h % 12
    if (h === 0) h = 12
    return `${String(h).padStart(2, '0')}:${min} ${ampm}`
  }

  return s
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

// ✅ AttendanceRow
const AttendanceRow = memo(({ record, index, shiftDisplay }: {
  record: AttendanceRecord
  index: number
  shiftDisplay: string
}) => {
  const checkInColor = record.isSVCheckIn
    ? 'text-orange-600'
    : record.isManualCheckIn
      ? 'text-yellow-600'
      : 'text-gray-700'

  const checkInIconColor = record.isSVCheckIn
    ? 'text-orange-500'
    : record.isManualCheckIn
      ? 'text-yellow-500'
      : 'text-green-500'

  const checkOutColor = record.isSVCheckOut
    ? 'text-orange-600'
    : record.isManualCheckOut
      ? 'text-yellow-600'
      : 'text-gray-700'

  const checkOutIconColor = record.isSVCheckOut
    ? 'text-orange-500'
    : record.isManualCheckOut
      ? 'text-yellow-500'
      : 'text-red-500'

  const showCheckIn = record.checkIn && record.checkIn !== '-'
  const showCheckOut = record.checkOut && record.checkOut !== '-'

  return (
    <tr className={`transition ${record.status === 'Off' ? 'bg-gray-200' : 'hover:bg-gray-50'}`}>
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

      {/* Check In column */}
      <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
        {showCheckIn ? (
          <div className="flex items-center gap-0.5">
            <LogIn className={`w-3 h-3 flex-shrink-0 ${checkInIconColor}`} />
            <span className={`font-medium ${checkInColor}`}>
              {record.checkIn}
            </span>
            {record.isSVCheckIn && (
              <span className="text-[8px] px-1 bg-orange-100 text-orange-700 rounded font-bold">SV</span>
            )}
            {record.isManualCheckIn && !record.isSVCheckIn && (
              <span className="text-[8px] px-1 bg-yellow-100 text-yellow-700 rounded font-bold">M</span>
            )}
          </div>
        ) : <span className="text-gray-400">-</span>}
      </td>

      {/* Check Out column */}
      <td className="px-1.5 py-0.5 text-[10px] whitespace-nowrap">
        {showCheckOut ? (
          <div className="flex items-center gap-0.5">
            <LogOut className={`w-3 h-3 flex-shrink-0 ${checkOutIconColor}`} />
            <span className={`font-medium ${checkOutColor}`}>
              {record.checkOut}
            </span>
            {record.isSVCheckOut && (
              <span className="text-[8px] px-1 bg-orange-100 text-orange-700 rounded font-bold">SV</span>
            )}
            {record.isManualCheckOut && !record.isSVCheckOut && (
              <span className="text-[8px] px-1 bg-yellow-100 text-yellow-700 rounded font-bold">M</span>
            )}
          </div>
        ) : <span className="text-gray-400">-</span>}
      </td>

      <td className="px-1.5 py-0.5 text-[10px] font-medium text-gray-800 whitespace-nowrap text-center">{record.totalHours}</td>
      <td className="px-1.5 py-0.5 text-[10px] font-bold text-blue-700 whitespace-nowrap text-center">{record.totalHoursWithOS}</td>

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
      <td className="px-1.5 py-0.5 text-[10px] text-center whitespace-nowrap">
        {record.siteVisitCount > 0 ? (
          <span className="px-1 py-0.5 text-[9px] font-bold rounded bg-orange-100 text-orange-700">
            {record.siteVisitCount}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-1.5 py-0.5 text-[9px] text-gray-600 max-w-[320px] truncate" title={record.siteVisitDetails}>
        {record.siteVisitDetails}
      </td>
    </tr>
  )
})

AttendanceRow.displayName = 'AttendanceRow'

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
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const debouncedFromDate = useDebounce(fromDate, 300)
  const debouncedToDate = useDebounce(toDate, 300)

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

  const addThreeDurations = useCallback((a: string, b: string, c: string): string => {
    const parse = (h: string): number => {
      if (!h || h === '-') return 0
      const parts = h.split(':')
      const hours = parseInt(parts[0] || '0')
      const minutes = parseInt(parts[1] || '0')
      const seconds = parseInt(parts[2] || '0')
      return hours * 3600 + minutes * 60 + seconds
    }
    const total = parse(a) + parse(b) + parse(c)
    if (total <= 0) return '-'
    return `${String(Math.floor(total / 3600)).padStart(2, '0')}:${String(Math.floor((total % 3600) / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
  }, [])

  const calculateSVHours = useCallback((fromTime: string, toTime: string): string => {
    if (!fromTime || !toTime || fromTime === '-' || toTime === '-') return '-'
    try {
      const fromMin = parseTimeToMinutes(fromTime)
      const toMin = parseTimeToMinutes(toTime)
      if (fromMin === null || toMin === null) return '-'

      let diff = toMin - fromMin
      if (diff < 0) diff += 24 * 60

      const h = Math.floor(diff / 60)
      const mn = diff % 60
      return `${String(h).padStart(2, '0')}:${String(mn).padStart(2, '0')}:00`
    } catch {
      return '-'
    }
  }, [])

  const parseHoursToDecimal = useCallback((h: string): number => {
    if (!h || h === '-') return 0
    const parts = h.split(':')
    const hours = parseInt(parts[0] || '0')
    const minutes = parseInt(parts[1] || '0')
    const seconds = parseInt(parts[2] || '0')
    return hours + minutes / 60 + seconds / 3600
  }, [])

  const getQualificationsString = useCallback((qualifications: any) => {
    const arr = safeParseArray(qualifications)
    if (arr.length === 0) return '-'
    return arr.map((q: any) => `${q.degree} (${q.institution}, ${q.year}) - ${q.grade}`).join('; ')
  }, [])

  const getExperienceString = useCallback((experience: any) => {
    const arr = safeParseArray(experience)
    if (arr.length === 0) return '-'
    return arr.map((exp: any) => `${exp.position} at ${exp.company}`).join('; ')
  }, [])

  // =====================================================
  // SITE VISITS
  // =====================================================
  const getSiteVisitsForDate = useCallback((employee: Employee, dateStr: string) => {
    const visits = safeParseArray(employee.site_visits)

    if (visits.length === 0) {
      return {
        count: 0,
        entries: [] as string[],
        svCheckIn: '-',
        svCheckOut: '-',
      }
    }

    const dayVisits = visits.filter((v: any) => {
      if (!v) return false

      const visitDateRaw =
        v.visitDate ||
        v.visit_date ||
        v.fromTime ||
        v.from_time ||
        v.from ||
        v.time ||
        v.date ||
        v.timestamp ||
        v._key ||
        ''

      if (!visitDateRaw) return false

      const visitDate = toLocalDateStr(String(visitDateRaw))
      return visitDate === dateStr
    })

    const entries = dayVisits.map((v: any) => {
      const fromRaw = v.fromTime || v.from_time || v.from || v.time || ''
      const toRaw = v.toTime || v.to_time || v.to || ''
      const company = v.companyName || v.company_name || v.company || v.site || v.name || ''

      const fromFmt = fromRaw ? formatSiteVisitTime(String(fromRaw)) : ''
      const toFmt = toRaw ? formatSiteVisitTime(String(toRaw)) : ''

      const timeRange = fromFmt && toFmt
        ? `${fromFmt} - ${toFmt}`
        : fromFmt || toFmt || ''

      if (company && timeRange) return `${company} (${timeRange})`
      if (company) return company
      if (timeRange) return timeRange
      return '-'
    })

    let earliestFrom: string | null = null
    let earliestFromMs = Infinity
    let latestTo: string | null = null
    let latestToMs = -Infinity

    dayVisits.forEach((v: any) => {
      const fromRaw = v.fromTime || v.from_time || v.from || v.time || ''
      const toRaw = v.toTime || v.to_time || v.to || ''

      const fromStr = String(fromRaw || '').trim()
      const toStr = String(toRaw || '').trim()

      if (fromStr) {
        const mins = parseTimeToMinutes(fromStr)
        if (mins !== null && mins < earliestFromMs) {
          earliestFromMs = mins
          earliestFrom = fromStr
        }
      }

      if (toStr) {
        const mins = parseTimeToMinutes(toStr)
        if (mins !== null && mins > latestToMs) {
          latestToMs = mins
          latestTo = toStr
        }
      }
    })

    return {
      count: dayVisits.length,
      entries,
      svCheckIn: earliestFrom || '-',
      svCheckOut: latestTo || '-',
    }
  }, [])

  const getEmployeeAttendance = useCallback((employee: Employee, date: string, logs: AttendanceLog[]): AttendanceRecord => {
    const dateStr = date
    const dayName = getDayName(dateStr)

    const siteVisitData = getSiteVisitsForDate(employee, dateStr)
    const siteVisitCount = siteVisitData.count
    const siteVisitDetails = siteVisitData.entries.length > 0
      ? siteVisitData.entries.join(' | ')
      : '-'

    const svDuration = calculateSVHours(siteVisitData.svCheckIn, siteVisitData.svCheckOut)

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
        shiftTiming: employee.shift_timing || undefined,
        siteVisitCount,
        siteVisitDetails,
        svCheckIn: siteVisitData.svCheckIn,
        svCheckOut: siteVisitData.svCheckOut,
        isManualCheckIn: false,
        isManualCheckOut: false,
        isSVCheckIn: false,
        isSVCheckOut: false,
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

    const leavesArr = safeParseArray(employee.leaves)
    const leave = leavesArr.find(
      (l: any) => l.fromDate <= dateStr && l.toDate >= dateStr && l.status === 'approved'
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

    const checkInArr = safeParseArray(employee.check_in)
    const checkOutArr = safeParseArray(employee.check_out)

    if (checkInArr.length > 0) {
      const checkInJson = checkInArr.find((c: any) => toLocalDateStr(c.time) === dateStr)
      if (checkInJson) outsideCheckInTime = checkInJson.time
    }
    if (checkOutArr.length > 0) {
      const checkOutJson = checkOutArr.find((c: any) => toLocalDateStr(c.time) === dateStr)
      if (checkOutJson) outsideCheckOutTime = checkOutJson.time
    }

    const outsideCheckIn = outsideCheckInTime ? formatTime(outsideCheckInTime) : '-'
    const outsideCheckOut = outsideCheckOutTime ? formatTime(outsideCheckOutTime) : '-'
    const outsideTotalHours = (outsideCheckInTime && outsideCheckOutTime)
      ? calculateOutsideHours(outsideCheckInTime, outsideCheckOutTime) : '-'

    // =====================================================
    // ✅ SV LOGIC — EARLIEST / LATEST APPROACH
    // =====================================================

    let displayCheckIn = isOnLeave ? '-' : (checkInLog ? formatTime(checkInLog.timestamp) : '-')
    let displayCheckOut = isOnLeave ? '-' : (checkOutLog ? formatTime(checkOutLog.timestamp) : '-')

    let isSVCheckIn = false
    let isSVCheckOut = false

    if (!isOnLeave) {
      const machineInMin = checkInLog
        ? (() => {
            const d = new Date(checkInLog!.timestamp)
            return d.getHours() * 60 + d.getMinutes()
          })()
        : null

      const machineOutMin = checkOutLog
        ? (() => {
            const d = new Date(checkOutLog!.timestamp)
            return d.getHours() * 60 + d.getMinutes()
          })()
        : null

      const svInMin = siteVisitData.svCheckIn !== '-'
        ? parseTimeToMinutes(siteVisitData.svCheckIn)
        : null

      const svOutMin = siteVisitData.svCheckOut !== '-'
        ? parseTimeToMinutes(siteVisitData.svCheckOut)
        : null

      type Candidate = { min: number; source: 'machine' | 'sv'; raw: string }

      const inCandidates: Candidate[] = []
      if (machineInMin !== null && checkInLog) {
        inCandidates.push({ min: machineInMin, source: 'machine', raw: formatTime(checkInLog.timestamp) })
      }
      if (svInMin !== null && siteVisitData.svCheckIn !== '-') {
        inCandidates.push({ min: svInMin, source: 'sv', raw: formatSiteVisitTime(siteVisitData.svCheckIn) })
      }

      const outCandidates: Candidate[] = []
      if (machineOutMin !== null && checkOutLog) {
        outCandidates.push({ min: machineOutMin, source: 'machine', raw: formatTime(checkOutLog.timestamp) })
      }
      if (svOutMin !== null && siteVisitData.svCheckOut !== '-') {
        outCandidates.push({ min: svOutMin, source: 'sv', raw: formatSiteVisitTime(siteVisitData.svCheckOut) })
      }

      if (inCandidates.length > 0) {
        const earliest = inCandidates.reduce((a, b) => (a.min <= b.min ? a : b))
        displayCheckIn = earliest.raw
        isSVCheckIn = earliest.source === 'sv'
      }

      if (outCandidates.length > 0) {
        const latest = outCandidates.reduce((a, b) => (a.min >= b.min ? a : b))
        displayCheckOut = latest.raw
        isSVCheckOut = latest.source === 'sv'
      }

      if (
        !hasCheckOut &&
        isSVCheckIn &&
        isSVCheckOut &&
        svInMin !== null &&
        svOutMin !== null &&
        svInMin === svOutMin
      ) {
        displayCheckOut = '-'
        isSVCheckOut = false
      }
    }

    const attendanceHours = isOnLeave
      ? '-'
      : calculateTotalHours(checkInLog?.timestamp || '', checkOutLog?.timestamp || '')

    const totalHoursCombined = isOnLeave
      ? '-'
      : addThreeDurations(
          attendanceHours,
          svDuration,
          outsideTotalHours === '-' ? '00:00:00' : outsideTotalHours
        )

    const displayCheckInLocation = isOnLeave ? '-' : (checkInLog?.branch_code || '-')
    const displayCheckOutLocation = isOnLeave ? '-' : (checkOutLog?.branch_code || '-')

    let source = employee.source || 'K'
    if (!employee.source) {
      source = (checkInLog?.source || checkOutLog?.source || 'K') as 'K' | 'PQ'
    }

    const isManualCheckIn =
      !!checkInLog?.raw_log_key &&
      String(checkInLog.raw_log_key).toUpperCase().startsWith('HR_MANUAL')

    const isManualCheckOut =
      !!checkOutLog?.raw_log_key &&
      String(checkOutLog.raw_log_key).toUpperCase().startsWith('HR_MANUAL')

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
      totalHours: attendanceHours,
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
      totalHoursWithOS: totalHoursCombined,
      shift: employee.shift || undefined,
      shiftTiming: employee.shift_timing || undefined,
      siteVisitCount,
      siteVisitDetails,
      svCheckIn: siteVisitData.svCheckIn,
      svCheckOut: siteVisitData.svCheckOut,
      isManualCheckIn,
      isManualCheckOut,
      isSVCheckIn,
      isSVCheckOut,
    }
  }, [formatDate, getDayName, formatTime, calculateTotalHours, calculateOutsideHours, getQualificationsString, getExperienceString, getSiteVisitsForDate, addThreeDurations, calculateSVHours])

  const getSelectedEmployeeName = useCallback(() => {
    if (selectedEmployee === 'all') return 'All Employees'
    const emp = employees.find(e => e.employee_id === selectedEmployee)
    return emp?.full_name || 'Selected Employee'
  }, [employees, selectedEmployee])

  const getPrintRowColorByStatus = useCallback((status: string): string => {
    switch (status) {
      case 'Present': return '#C6EFCE'
      case 'Absent': return '#FFC7CE'
      case 'Half Day': return '#FFEB9C'
      case 'Leave': return '#F8CBAD'
      case 'Off': return '#E5E7EB'
      default: return 'transparent'
    }
  }, [])

  // =====================================================
  // fetchData
  // =====================================================
  const fetchData = useCallback(async () => {
    if (!isMounted.current) return
    try {
      setLoading(true)
      setError(null)

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

      const employeeIdSet = new Set<string>(
        employeeData
          .map((e: any) => String(e.employee_id ?? '').trim())
          .filter(Boolean)
      )

      const employeeIdsArray = Array.from(employeeIdSet)

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

          if (data.length < PAGE_SIZE) break

          from += PAGE_SIZE
        }

        return all
      }

      const [mainLogsData, pqLogsData] = await Promise.all([
        fetchAllRows('attendance_logs', true),
        fetchAllRows('pq_attendance_logs', false)
      ])

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
          raw_log_key: String(log.raw_log_key ?? ''),
          created_at: log.created_at,
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
          raw_log_key: String(log.raw_log_key ?? ''),
          created_at: log.created_at,
          source: 'PQ'
        })
      })

      allLogs.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      )

      const kCount = allLogs.filter(l => l.source === 'K').length
      const pqCount = allLogs.filter(l => l.source === 'PQ').length

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
    } catch (err: any) {
      console.error('❌ Attendance fetch error:', err)
      if (isMounted.current) {
        setError(err?.message || 'Failed to load attendance data')
        setLoading(false)
      }
    }
  }, [])

  const generateAttendanceSheet = useCallback(() => {
    if (!debouncedFromDate || !debouncedToDate || employees.length === 0) return

    const startDate = new Date(debouncedFromDate + 'T00:00:00')
    const endDate = new Date(debouncedToDate + 'T00:00:00')
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
  }, [employees, debouncedFromDate, debouncedToDate, selectedDepartment, selectedBranch, selectedEmployee, attendanceLogs, getEmployeeAttendance])

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredData(attendanceData)
    } else {
      setFilteredData(attendanceData.filter(r => r.status === selectedStatus))
    }
  }, [attendanceData, selectedStatus])

  useEffect(() => {
    if (employees.length > 0 && debouncedFromDate && debouncedToDate) {
      generateAttendanceSheet()
    }
  }, [employees, debouncedFromDate, debouncedToDate, selectedDepartment, selectedBranch, selectedEmployee, generateAttendanceSheet])

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

  const summary = useMemo(() => {
    const total = filteredData.length
    const present = filteredData.filter(r => r.status === 'Present').length
    const absent = filteredData.filter(r => r.status === 'Absent').length
    const leave = filteredData.filter(r => r.status === 'Leave').length
    const halfDay = filteredData.filter(r => r.status === 'Half Day').length
    const off = filteredData.filter(r => r.status === 'Off').length
    const totalSiteVisits = filteredData.reduce((sum, r) => sum + r.siteVisitCount, 0)
    return { total, present, absent, leave, halfDay, off, totalSiteVisits }
  }, [filteredData])

  const calculateSummariesForDateRange = useCallback((): any[] => {
    if (filteredData.length === 0) return []

    const groups: Record<string, AttendanceRecord[]> = {}

    filteredData.forEach(r => {
      const key = `${r.employeeId}__${r.branchCode}`
      if (!groups[key]) groups[key] = []
      groups[key].push(r)
    })

    const summaries: any[] = []

    Object.entries(groups).forEach(([, records]) => {
      if (records.length === 0) return

      const first = records[0]

      let presentDays = 0
      let absentDays = 0
      let leaveDays = 0
      let halfDays = 0
      let offDays = 0
      let totalAttendanceHours = 0
      let totalSVHours = 0
      let totalHours = 0
      let totalSiteVisits = 0
      let lateHours = 0
      let overtimeHours = 0

      const shiftHours = getShiftTotalHours(first.shiftTiming)

      records.forEach(r => {
        if (r.status === 'Present') presentDays++
        else if (r.status === 'Absent') absentDays++
        else if (r.status === 'Leave') leaveDays++
        else if (r.status === 'Half Day') halfDays++
        else if (r.status === 'Off') offDays++

        const attHrs = parseHoursToDecimal(r.totalHours)
        totalAttendanceHours += attHrs

        const svDur = calculateSVHours(r.svCheckIn, r.svCheckOut)
        const svHrs = parseHoursToDecimal(svDur)
        totalSVHours += svHrs

        const totalHrs = parseHoursToDecimal(r.totalHoursWithOS)
        totalHours += totalHrs

        totalSiteVisits += r.siteVisitCount

        if (
          r.day !== 'Sunday' &&
          r.status !== 'Off' &&
          r.status !== 'Leave' &&
          r.status !== 'Absent'
        ) {
          if (totalHrs > 0 && totalHrs < shiftHours) {
            lateHours += (shiftHours - totalHrs)
          }
          if (totalHrs > shiftHours) {
            overtimeHours += (totalHrs - shiftHours)
          }
        }
      })

      summaries.push({
        employee_id: first.employeeId,
        employee_name: first.name,
        department: first.department || null,
        designation: first.designation || null,
        shift: getShiftDisplay(first.shiftTiming, first.shift),
        branch: first.branch || 'Korangi',
        from_date: fromDate,
        to_date: toDate,
        total_days: records.length,
        present_days: presentDays,
        absent_days: absentDays,
        leave_days: leaveDays,
        half_days: halfDays,
        off_days: offDays,
        total_working_hours: Math.round(totalAttendanceHours * 100) / 100,
        total_sv_hours: Math.round(totalSVHours * 100) / 100,
        total_hours: Math.round(totalHours * 100) / 100,
        total_site_visits: totalSiteVisits,
        late_hours: Math.round(lateHours * 100) / 100,
        overtime_hours: Math.round(overtimeHours * 100) / 100,
      })
    })

    return summaries
  }, [filteredData, fromDate, toDate, parseHoursToDecimal, calculateSVHours])

  // =====================================================
  // EXPORT: CSV (raw only)
  // =====================================================
  const handleExportCSV = useCallback(() => {
    if (filteredData.length === 0) { alert('No data to export'); return }

    const headers = [
      'User ID', 'Name', 'Dept', 'Designation', 'Shift', 'Date', 'Day',
      'Check In', 'Check Out', 'Hours', 'Total Hours',
      'Company', 'Status',
      'Site Visit Count', 'Site Visits (Company - From - To)'
    ]

    const rows = filteredData.map(r => [
      r.employeeId,
      r.name,
      r.department,
      r.designation,
      getShiftDisplay(r.shiftTiming, r.shift),
      r.date,
      r.day,
      r.isSVCheckIn ? `${r.checkIn} (SV)` : r.checkIn,
      r.isSVCheckOut ? `${r.checkOut} (SV)` : r.checkOut,
      r.totalHours,
      r.totalHoursWithOS,
      r.branch,
      r.status,
      r.siteVisitCount > 0 ? String(r.siteVisitCount) : '0',
      r.siteVisitDetails
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
    setExportSuccess(`✅ Raw CSV downloaded`)
    setTimeout(() => setExportSuccess(null), 3000)
  }, [filteredData, fromDate, toDate])

  // =====================================================
  // EXPORT: PDF (raw only)
  // =====================================================
  const handleExportPDF = useCallback(() => {
    if (filteredData.length === 0) { alert('No data to export'); return }

    const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
    const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
    const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

    let tableRows = ''
    filteredData.forEach((record, index) => {
      const isSunday = record.day === 'Sunday'
      const rowColor = getPrintRowColorByStatus(record.status)
      const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
      const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)

      const checkInStyle = record.isSVCheckIn
        ? 'color: #ea580c; font-weight: bold;'
        : record.isManualCheckIn
          ? 'color: #ca8a04; font-weight: bold;'
          : ''

      const checkOutStyle = record.isSVCheckOut
        ? 'color: #ea580c; font-weight: bold;'
        : record.isManualCheckOut
          ? 'color: #ca8a04; font-weight: bold;'
          : ''

      const checkInLabel = record.isSVCheckIn ? ' (SV)' : ''
      const checkOutLabel = record.isSVCheckOut ? ' (SV)' : ''

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
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; ${checkInStyle}">${record.checkIn}${checkInLabel}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; ${checkOutStyle}">${record.checkOut}${checkOutLabel}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.totalHours}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.branch}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.status}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 8px; text-align: center;">${record.siteVisitCount > 0 ? record.siteVisitCount : '-'}</td>
          <td style="padding: 3px 4px; border: 1px solid #000; font-size: 7px; text-align: left; max-width: 180px; word-break: break-word;">${record.siteVisitDetails}</td>
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
                  <th style="width:4%">Check In</th>
                  <th style="width:4%">Check Out</th>
                  <th style="width:3%">Hours</th>
                  <th style="width:4%">Total Hours</th>
                  <th style="width:4%">Company</th>
                  <th style="width:3%">Status</th>
                  <th style="width:2%">SV</th>
                  <th style="width:16%">Site Visits (Company - From - To)</th>
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
    setExportSuccess(`✅ Raw PDF ready`)
    setTimeout(() => setExportSuccess(null), 4000)
  }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getPrintRowColorByStatus, fromDate, toDate, formatDateForDisplay])

  // =====================================================
  // EXPORT SUMMARY as CSV (+ save to DB)
  // =====================================================
  const handleExportSummaryCSV = useCallback(async () => {
    if (filteredData.length === 0) { alert('No data to export'); return }

    const summaries = calculateSummariesForDateRange()

    if (summaries.length === 0) {
      alert('Could not generate summary')
      return
    }

    let summarySaved = false
    try {
      const { error: upsertError } = await supabase
        .from('attendance_summaries')
        .upsert(summaries, {
          onConflict: 'employee_id,from_date,to_date,branch',
          ignoreDuplicates: false,
        })

      if (upsertError) {
        console.error('Summary save error:', upsertError)
      } else {
        summarySaved = true
      }
    } catch (err) {
      console.error('Summary save exception:', err)
    }

    const headers = [
      'Employee ID', 'Employee Name', 'Department', 'Designation',
      'Shift', 'Company', 'From Date', 'To Date',
      'Total Days', 'Present', 'Absent', 'Leave', 'Half Days', 'Off',
      'Working Hours', 'SV Hours', 'Total Hours',
      'Site Visits', 'Late Hours', 'Overtime Hours'
    ]

    const rows = summaries.map(s => [
      s.employee_id,
      s.employee_name,
      s.department || '',
      s.designation || '',
      s.shift || '',
      s.branch || '',
      s.from_date,
      s.to_date,
      s.total_days,
      s.present_days,
      s.absent_days,
      s.leave_days,
      s.half_days,
      s.off_days,
      s.total_working_hours,
      s.total_sv_hours,
      s.total_hours,
      s.total_site_visits,
      s.late_hours,
      s.overtime_hours,
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
    link.download = `attendance_summary_${fromDate}_to_${toDate}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setShowExportMenu(false)
    setExportSuccess(
      summarySaved
        ? `✅ Summary CSV downloaded + ${summaries.length} summaries saved`
        : `✅ Summary CSV downloaded (${summaries.length} records)`
    )
    setTimeout(() => setExportSuccess(null), 5000)
  }, [filteredData, fromDate, toDate, calculateSummariesForDateRange])

  // =====================================================
  // EXPORT SUMMARY as PDF (+ save to DB)
  // =====================================================
  const handleExportSummaryPDF = useCallback(async () => {
    if (filteredData.length === 0) { alert('No data to export'); return }

    const summaries = calculateSummariesForDateRange()

    if (summaries.length === 0) {
      alert('Could not generate summary')
      return
    }

    let summarySaved = false
    try {
      const { error: upsertError } = await supabase
        .from('attendance_summaries')
        .upsert(summaries, {
          onConflict: 'employee_id,from_date,to_date,branch',
          ignoreDuplicates: false,
        })

      if (upsertError) {
        console.error('Summary save error:', upsertError)
      } else {
        summarySaved = true
      }
    } catch (err) {
      console.error('Summary save exception:', err)
    }

    const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
    const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
    const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

    let tableRows = ''
    summaries.forEach((s, index) => {
      tableRows += `
        <tr>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${index + 1}</td>
          <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.employee_id}</td>
          <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.employee_name}</td>
          <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.department || '-'}</td>
          <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.designation || '-'}</td>
          <td style="padding: 4px; border: 1px solid #000; font-size: 8px;">${s.branch || '-'}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.from_date}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.to_date}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.total_days}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: green; font-weight: bold;">${s.present_days}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: red; font-weight: bold;">${s.absent_days}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: blue; font-weight: bold;">${s.leave_days}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: orange; font-weight: bold;">${s.half_days}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.off_days}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${Number(s.total_working_hours).toFixed(2)}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; color: #ea580c; font-weight: bold;">${Number(s.total_sv_hours).toFixed(2)}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px; font-weight: bold; color: #1D4ED8;">${Number(s.total_hours).toFixed(2)}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${s.total_site_visits}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${Number(s.late_hours).toFixed(2)}</td>
          <td style="padding: 4px; border: 1px solid #000; text-align: center; font-size: 8px;">${Number(s.overtime_hours).toFixed(2)}</td>
        </tr>
      `
    })

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Summary Report</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
          <style>
            @page { size: A4 landscape; margin: 8mm 6mm; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #000; }
            .header { text-align: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #000; }
            .company { font-size: 14px; font-weight: 700; text-transform: uppercase; }
            .title { font-size: 12px; font-weight: 700; margin-top: 3px; }
            .sub-info { font-size: 9px; margin-top: 4px; font-weight: 500; }
            .range { font-size: 9px; margin-top: 3px; }
            table { width: 100%; border-collapse: collapse; font-size: 8px; margin-top: 6px; }
            th { background: #C4BD97; padding: 5px 3px; border: 1px solid #000; text-transform: uppercase; font-size: 7px; text-align: center; }
            td { padding: 4px; border: 1px solid #000; }
            .footer { margin-top: 10px; text-align: center; font-size: 7px; border-top: 1px solid #000; padding-top: 6px; }
            @media print {
              th { background: #C4BD97 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">A to Zee Switchgear Engineering (SMC) Pvt. Ltd.</div>
            <div class="title">ATTENDANCE SUMMARY REPORT</div>
            <div class="sub-info">${employeeName} | ${deptName} | ${branchName}</div>
            <div class="range">${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Dept</th>
                <th>Designation</th>
                <th>Company</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>P</th>
                <th>A</th>
                <th>L</th>
                <th>H</th>
                <th>Off</th>
                <th>Work Hrs</th>
                <th>SV Hrs</th>
                <th>Total Hrs</th>
                <th>SV</th>
                <th>Late</th>
                <th>OT</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
          <div class="footer">
            This summary is generated by system software | A to Zee Switchgear Engineering (SMC) Pvt. Ltd.
          </div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
        </body>
      </html>
    `

    const w = window.open('', '_blank')
    if (!w) { alert('Please allow popups'); return }
    w.document.write(html)
    w.document.close()
    setShowExportMenu(false)
    setExportSuccess(
      summarySaved
        ? `✅ Summary PDF ready + ${summaries.length} summaries saved`
        : `✅ Summary PDF ready (${summaries.length} records)`
    )
    setTimeout(() => setExportSuccess(null), 5000)
  }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, fromDate, toDate, formatDateForDisplay, calculateSummariesForDateRange])

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

  const handleExportForPayroll = useCallback(async () => {
    if (filteredData.length === 0) {
      alert('No data to submit')
      return
    }

    const monthlySummaries = calculateMonthlySummaries()
    const dateRangeSummaries = calculateSummariesForDateRange()

    if (monthlySummaries.length === 0) {
      alert('Could not calculate summaries — check date range')
      return
    }

    if (!confirm(
      `Submit to database:\n` +
      `• ${monthlySummaries.length} monthly summary (attendance_sheet)\n` +
      `• ${dateRangeSummaries.length} date-range summary (attendance_summaries)\n\n` +
      `Existing records will be UPDATED.`
    )) {
      return
    }

    try {
      setSubmittingPayroll(true)
      setError(null)

      const { data: monthlyData, error: monthlyErr } = await supabase
        .from('attendance_sheet')
        .upsert(monthlySummaries, {
          onConflict: 'user_id,month,company',
          ignoreDuplicates: false
        })
        .select()

      if (monthlyErr) throw new Error(monthlyErr.message)

      let rangeSaved = 0
      if (dateRangeSummaries.length > 0) {
        const { data: rangeData, error: rangeErr } = await supabase
          .from('attendance_summaries')
          .upsert(dateRangeSummaries, {
            onConflict: 'employee_id,from_date,to_date,branch',
            ignoreDuplicates: false
          })
          .select()

        if (rangeErr) {
          console.error('Date-range summary error:', rangeErr)
        } else {
          rangeSaved = rangeData?.length || dateRangeSummaries.length
        }
      }

      setShowExportMenu(false)
      setExportSuccess(
        `✅ ${monthlyData?.length || monthlySummaries.length} monthly + ${rangeSaved} range summaries saved`
      )
      setTimeout(() => setExportSuccess(null), 6000)
    } catch (err: any) {
      console.error('❌ Payroll submit error:', err)
      setError(err.message || 'Failed to submit summaries')
    } finally {
      setSubmittingPayroll(false)
    }
  }, [filteredData, calculateMonthlySummaries, calculateSummariesForDateRange])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false)
      }
    }
    if (showExportMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportMenu])

  const handlePrintWithColor = useCallback((withColor: boolean) => {
    setShowPrintOptions(false)

    const data = filteredData
    const employeeName = selectedEmployee === 'all' ? 'All Employees' : getSelectedEmployeeName()
    const deptName = selectedDepartment !== 'all' ? selectedDepartment : 'All Departments'
    const branchName = selectedBranch !== 'all' ? getBranchDisplayName(selectedBranch) : 'All Branches'

    const getRowColorForPrint = (record: AttendanceRecord) => {
      if (!withColor) return 'transparent'
      return getPrintRowColorByStatus(record.status)
    }

    let tableRows = ''
    data.forEach((record, index) => {
      const isSunday = record.day === 'Sunday'
      const rowColor = getRowColorForPrint(record)
      const bgStyle = rowColor !== 'transparent' ? `background-color: ${rowColor};` : ''
      const shiftDisplay = getShiftDisplay(record.shiftTiming, record.shift)

      const checkInStyle = record.isSVCheckIn
        ? 'color: #ea580c; font-weight: bold;'
        : record.isManualCheckIn
          ? 'color: #ca8a04; font-weight: bold;'
          : ''

      const checkOutStyle = record.isSVCheckOut
        ? 'color: #ea580c; font-weight: bold;'
        : record.isManualCheckOut
          ? 'color: #ca8a04; font-weight: bold;'
          : ''

      const checkInLabel = record.isSVCheckIn ? ' (SV)' : ''
      const checkOutLabel = record.isSVCheckOut ? ' (SV)' : ''

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
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; ${checkInStyle}">${record.checkIn}${checkInLabel}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; ${checkOutStyle}">${record.checkOut}${checkOutLabel}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.totalHours}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center; font-weight: bold; color: #1D4ED8;">${record.totalHoursWithOS}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.branch}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.status}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 7px; text-align: center;">${record.siteVisitCount > 0 ? record.siteVisitCount : '-'}</td>
          <td style="padding: 2px 3px; border: 1px solid #000; font-size: 6px; text-align: left; max-width: 150px; word-break: break-word;">${record.siteVisitDetails}</td>
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
                  <th style="width:4%">Check In</th>
                  <th style="width:4%">Check Out</th>
                  <th style="width:3%">Hours</th>
                  <th style="width:4%">Total Hours</th>
                  <th style="width:4%">Company</th>
                  <th style="width:3%">Status</th>
                  <th style="width:2%">SV</th>
                  <th style="width:16%">Site Visits (Company - From - To)</th>
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
  }, [filteredData, selectedEmployee, selectedDepartment, selectedBranch, getSelectedEmployeeName, getPrintRowColorByStatus, fromDate, toDate, formatDateForDisplay])

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
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">SV: {summary.totalSiteVisits}</span>

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
                    <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 shadow-lg rounded z-50">
                      <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                        Raw Data
                      </div>
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

                      <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
                        Summary (saves to DB)
                      </div>
                      <button onClick={handleExportSummaryCSV}
                        className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                        <span>Summary as CSV</span>
                      </button>
                      <button onClick={handleExportSummaryPDF}
                        className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>Summary as PDF</span>
                      </button>

                      <div className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
                        Payroll
                      </div>
                      <button onClick={handleExportForPayroll}
                        className="w-full px-3 py-2 text-left text-xs text-black hover:bg-gray-100 flex items-center gap-2">
                        <Calculator className="w-3.5 h-3.5 text-orange-600" />
                        <span>For Payroll (monthly + range)</span>
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
                        <p className="text-xs text-gray-500">Status-based colors (P/A/H/L/Off)</p>
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

            <div className="grid grid-cols-7 gap-1.5 mb-2">
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
              <div className="bg-white shadow-sm p-1.5">
                <div className="text-[10px] text-orange-600 tracking-wide flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" /> SV
                </div>
                <div className="text-base font-bold text-orange-700 tracking-wider">{summary.totalSiteVisits}</div>
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
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Company</label>
                    <div className="relative">
                      <MapPin className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full pl-6 pr-1.5 py-1 text-xs border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none">
                        <option value="all">All Companies</option>
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
                      {['#','Emp ID','Name','Dept','Designation','Shift','Date','Day','Check In','Check Out','Hours','Total Hours','Company','Status','SV','Site Visits (Company - From - To)'].map(h => (
                        <th key={h} className="px-1.5 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={16} className="px-2 py-3 text-center text-gray-500 text-xs">
                          <div className="flex flex-col items-center gap-1">
                            <Users className="w-6 h-6 text-gray-300" />
                            <p className="tracking-wide">No data found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((record, index) => (
                        <AttendanceRow
                          key={`${record.employeeId}_${record.date}_${index}`}
                          record={record}
                          index={index}
                          shiftDisplay={getShiftDisplay(record.shiftTiming, record.shift)}
                        />
                      ))
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
                    <span className="flex items-center gap-0.5"><span className="w-2 h-2 bg-orange-500 rounded"></span> SV: {summary.totalSiteVisits}</span>
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