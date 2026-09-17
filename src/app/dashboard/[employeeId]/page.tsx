// 'use client'

// import { useState, useEffect, useMemo, useCallback } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import Footer from '@/components/footer'
// import AttendancePopup from '@/components/popup'
// import NavbarDropdown from '@/app/Navbar/page'
// import ProtectedEmployeeRoute from '@/components/ProtectedEmployeeRoute'
// import { createClient } from '@supabase/supabase-js'
// import {
//   Users,
//   UserCheck,
//   UserX,
//   Calendar,
//   Clock,
//   Building,
//   TrendingUp,
//   TrendingDown,
//   RefreshCw,
//   AlertCircle,
//   Loader,
//   CheckCircle,
//   XCircle,
//   Clock as ClockIcon,
//   Eye,
//   UserPlus,
//   Briefcase,
//   UserMinus,
//   User as UserIcon,
//   FileSpreadsheet,
//   LogIn,
//   LogOut as LogOutIcon,
//   Activity,
//   ArrowLeft,
//   Timer
// } from 'lucide-react'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   RadialBarChart,
//   RadialBar,
//   PolarGrid,
//   PolarRadiusAxis,
//   Label,
//   Cell,
//   Rectangle
// } from 'recharts'

// import { Roboto } from 'next/font/google'

// const roboto = Roboto({
//   weight: ['100', '300', '400', '500', '700', '900'],
//   style: ['normal', 'italic'],
//   subsets: ['latin'],
//   display: 'swap',
// })

// interface DashboardData {
//   employees: any[]
//   leaveRequests: any[]
// }

// interface Stats {
//   totalEmployees: number
//   presentToday: number
//   absentToday: number
//   onLeave: number
//   pendingLeaves: number
//   approvedLeaves: number
//   rejectedLeaves: number
//   departments: string[]
//   departmentCount: { [key: string]: number }
//   attendanceRate: number
//   employeeName: string
//   employeeId: string
//   employeeDepartment: string
//   employeePosition: string
// }

// interface RecentActivity {
//   id: string
//   employeeName: string
//   employeeId: string
//   type: 'check-in' | 'check-out'
//   time: string
//   location: string
//   department: string
// }

// interface DailyAttendanceStatus {
//   date: string
//   day: number
//   status: 'present' | 'half-day' | 'absent'
//   statusValue: number
//   hours: number
//   checkIn: string | null
//   checkOut: string | null
//   color: string
// }

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

// function DashboardContent() {
//   const params = useParams()
//   const router = useRouter()
//   const employeeId = params.employeeId as string

//   const [data, setData] = useState<DashboardData>({ employees: [], leaveRequests: [] })
//   const [currentEmployee, setCurrentEmployee] = useState<any>(null)
//   const [stats, setStats] = useState<Stats>({
//     totalEmployees: 0,
//     presentToday: 0,
//     absentToday: 0,
//     onLeave: 0,
//     pendingLeaves: 0,
//     approvedLeaves: 0,
//     rejectedLeaves: 0,
//     departments: [],
//     departmentCount: {},
//     attendanceRate: 0,
//     employeeName: '',
//     employeeId: '',
//     employeeDepartment: '',
//     employeePosition: ''
//   })
//   const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [activeChart, setActiveChart] = useState<'present' | 'absent'>('present')
//   const [dailyAttendanceStatus, setDailyAttendanceStatus] = useState<DailyAttendanceStatus[]>([])

//   // =====================================================
//   // getRecentActivities - useCallback
//   // =====================================================

//   const getRecentActivities = useCallback((dashboardData: DashboardData) => {
//     const activities: RecentActivity[] = []
//     const now = new Date()
//     const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

//     dashboardData.employees.forEach((emp: any) => {
//       const checkIns = emp.check_in || []
//       const checkOuts = emp.check_out || []
      
//       checkIns.forEach((check: any) => {
//         const checkTime = new Date(check.time)
//         if (checkTime > oneHourAgo) {
//           activities.push({
//             id: `in_${emp.id}_${check.time}`,
//             employeeName: emp.full_name || 'Unknown',
//             employeeId: emp.employee_id || 'N/A',
//             type: 'check-in',
//             time: check.time,
//             location: check.location || 'Unknown location',
//             department: emp.department || 'N/A'
//           })
//         }
//       })

//       checkOuts.forEach((check: any) => {
//         const checkTime = new Date(check.time)
//         if (checkTime > oneHourAgo) {
//           activities.push({
//             id: `out_${emp.id}_${check.time}`,
//             employeeName: emp.full_name || 'Unknown',
//             employeeId: emp.employee_id || 'N/A',
//             type: 'check-out',
//             time: check.time,
//             location: check.location || 'Unknown location',
//             department: emp.department || 'N/A'
//           })
//         }
//       })
//     })

//     activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
//     setRecentActivities(activities.slice(0, 20))
//   }, [])

//   // =====================================================
//   // calculateDailyAttendanceStatus - useCallback
//   // =====================================================

//   const calculateDailyAttendanceStatus = useCallback((dashboardData: DashboardData) => {
//     const employees = dashboardData.employees || []
//     const today = new Date()
//     const year = today.getFullYear()
//     const month = today.getMonth()
//     const daysInMonth = new Date(year, month + 1, 0).getDate()
    
//     const dailyData: DailyAttendanceStatus[] = []
    
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day)
//       const dateStr = date.toISOString().split('T')[0]
      
//       let totalHours = 0
//       let checkInTime: string | null = null
//       let checkOutTime: string | null = null
//       let status: 'present' | 'half-day' | 'absent' = 'absent'
      
//       employees.forEach((emp: any) => {
//         const checkIns = emp.check_in || []
//         const checkOuts = emp.check_out || []
        
//         const checkIn = checkIns.find((check: any) => {
//           const checkDate = new Date(check.time).toISOString().split('T')[0]
//           return checkDate === dateStr
//         })
        
//         const checkOut = checkOuts.find((check: any) => {
//           const checkDate = new Date(check.time).toISOString().split('T')[0]
//           return checkDate === dateStr
//         })
        
//         if (checkIn) {
//           checkInTime = checkIn.time
//           const checkInDate = new Date(checkIn.time)
          
//           if (checkOut) {
//             checkOutTime = checkOut.time
//             const checkOutDate = new Date(checkOut.time)
//             const diffMs = checkOutDate.getTime() - checkInDate.getTime()
//             const diffHours = diffMs / (1000 * 60 * 60)
//             totalHours = Math.round(diffHours * 100) / 100
//           } else {
//             const now = new Date()
//             if (dateStr === today.toISOString().split('T')[0]) {
//               const diffMs = now.getTime() - checkInDate.getTime()
//               const diffHours = diffMs / (1000 * 60 * 60)
//               totalHours = Math.round(diffHours * 100) / 100
//             }
//           }
//         }
//       })
      
//       if (totalHours === 0) {
//         status = 'absent'
//       } else if (totalHours < 5) {
//         status = 'half-day'
//       } else {
//         status = 'present'
//       }
      
//       let color = '#EF4444'
//       let statusValue = 1
//       if (status === 'present') {
//         color = '#3B82F6'
//         statusValue = 3
//       } else if (status === 'half-day') {
//         color = '#F59E0B'
//         statusValue = 2
//       }
      
//       dailyData.push({
//         date: dateStr,
//         day: day,
//         status: status,
//         statusValue: statusValue,
//         hours: totalHours,
//         checkIn: checkInTime,
//         checkOut: checkOutTime,
//         color: color
//       })
//     }
    
//     setDailyAttendanceStatus(dailyData)
//   }, [])

//   // =====================================================
//   // calculateStats - useCallback
//   // =====================================================

//   const calculateStats = useCallback((dashboardData: DashboardData) => {
//     const employees = dashboardData.employees || []
//     const leaves = (dashboardData.leaveRequests || []).filter((leave: any) => leave !== null && leave !== undefined)

//     const totalEmployees = employees.length
//     const today = new Date().toISOString().split('T')[0]

//     let presentToday = 0
//     let absentToday = 0

//     employees.forEach((emp: any) => {
//       const checkIns = emp.check_in || []
//       const hasCheckIn = checkIns.some((check: any) => {
//         const checkDate = new Date(check.time).toISOString().split('T')[0]
//         return checkDate === today
//       })
      
//       if (hasCheckIn) {
//         presentToday++
//       } else {
//         absentToday++
//       }
//     })

//     const pendingLeaves = leaves.filter((l: any) => l && l.status === 'pending').length
//     const approvedLeaves = leaves.filter((l: any) => l && l.status === 'approved').length
//     const rejectedLeaves = leaves.filter((l: any) => l && l.status === 'rejected').length
//     const onLeave = leaves.filter((l: any) => {
//       if (!l) return false
//       const todayDate = new Date(today)
//       const fromDate = new Date(l.fromDate)
//       const toDate = new Date(l.toDate)
//       return fromDate <= todayDate && toDate >= todayDate && l.status === 'approved'
//     }).length

//     const deptMap: { [key: string]: number } = {}
//     employees.forEach((emp: any) => {
//       const dept = emp.department || 'Unknown'
//       deptMap[dept] = (deptMap[dept] || 0) + 1
//     })

//     const departments = Object.keys(deptMap)
//     const attendanceRate = totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0

//     const employee = employees[0] || {}

//     setStats({
//       totalEmployees,
//       presentToday,
//       absentToday,
//       onLeave,
//       pendingLeaves,
//       approvedLeaves,
//       rejectedLeaves,
//       departments,
//       departmentCount: deptMap,
//       attendanceRate,
//       employeeName: employee.full_name || '',
//       employeeId: employee.employee_id || '',
//       employeeDepartment: employee.department || '',
//       employeePosition: employee.position || ''
//     })

//     getRecentActivities(dashboardData)
//   }, [getRecentActivities])

//   // =====================================================
//   // fetchDashboardData - useCallback (FIXED)
//   // =====================================================

//   const fetchDashboardData = useCallback(async () => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       const { data: employeeData, error: fetchError } = await supabase
//         .from('employees')
//         .select('*')
//         .eq('employee_id', employeeId)
//         .maybeSingle()

//       if (fetchError) {
//         throw new Error(fetchError.message)
//       }

//       console.log('Employee Data:', employeeData)

//       let leaveRequests: any[] = []
//       if (employeeData) {
//         leaveRequests = employeeData.leaves || []
//         setCurrentEmployee(employeeData)
//       }

//       const result = {
//         employees: employeeData ? [employeeData] : [],
//         leaveRequests: leaveRequests || []
//       }

//       console.log('Dashboard Data:', result)

//       setData(result)
//       calculateStats(result)
//       calculateDailyAttendanceStatus(result)

//     } catch (err) {
//       console.error('Error fetching dashboard data:', err)
//       setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
//     } finally {
//       setLoading(false)
//     }
//   }, [employeeId, calculateStats, calculateDailyAttendanceStatus])

//   // =====================================================
//   // USE EFFECT
//   // =====================================================

//   useEffect(() => {
//     if (employeeId) {
//       fetchDashboardData()
//     }
//   }, [employeeId, fetchDashboardData])

//   // =====================================================
//   // getAttendanceLineData - useCallback
//   // =====================================================

//   const getAttendanceLineData = useCallback(() => {
//     const last30Days = []
//     for (let i = 29; i >= 0; i--) {
//       const date = new Date()
//       date.setDate(date.getDate() - i)
//       const dateStr = date.toISOString().split('T')[0]
      
//       let present = 0
//       let absent = 0
      
//       data.employees.forEach((emp: any) => {
//         const checkIns = emp.check_in || []
//         const hasCheckIn = checkIns.some((check: any) => {
//           const checkDate = new Date(check.time).toISOString().split('T')[0]
//           return checkDate === dateStr
//         })
        
//         if (hasCheckIn) {
//           present++
//         } else {
//           absent++
//         }
//       })
      
//       last30Days.push({
//         date: dateStr,
//         present,
//         absent,
//         total: data.employees.length || 0
//       })
//     }
//     return last30Days
//   }, [data.employees])

//   // =====================================================
//   // formatTime - useCallback
//   // =====================================================

//   const formatTime = useCallback((timestamp: string) => {
//     try {
//       const date = new Date(timestamp)
//       const now = new Date()
//       const diffMs = now.getTime() - date.getTime()
//       const diffMins = Math.floor(diffMs / 60000)
//       const diffHours = Math.floor(diffMs / 3600000)

//       if (diffMins < 1) return 'Just now'
//       if (diffMins < 60) return `${diffMins}m ago`
//       if (diffHours < 24) return `${diffHours}h ago`
//       return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
//     } catch {
//       return 'Unknown'
//     }
//   }, [])

//   // =====================================================
//   // CustomTooltip
//   // =====================================================

//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className={`${roboto.className} bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 text-xs tracking-wide`}>
//           <p className="font-medium text-gray-800 tracking-wide">{label}</p>
//           {payload.map((item: any, index: number) => (
//             <p key={index} className="text-gray-600 tracking-wide" style={{ color: item.color }}>
//               {item.name}: {item.value}
//             </p>
//           ))}
//         </div>
//       )
//     }
//     return null
//   }

//   const lineChartData = getAttendanceLineData()
//   const lineTotalPresent = useMemo(() => lineChartData.reduce((acc, curr) => acc + curr.present, 0), [lineChartData])
//   const lineTotalAbsent = useMemo(() => lineChartData.reduce((acc, curr) => acc + curr.absent, 0), [lineChartData])

//   const pendingData = [{ name: 'Pending', value: stats.pendingLeaves, fill: '#F59E0B' }]
//   const approvedData = [{ name: 'Approved', value: stats.approvedLeaves, fill: '#10B981' }]
//   const rejectedData = [{ name: 'Rejected', value: stats.rejectedLeaves, fill: '#EF4444' }]

//   const LeaveRadialChart = ({ data, title, color, valueColor }: { data: any[], title: string, color: string, valueColor: string }) => {
//     const value = data[0]?.value || 0
    
//     return (
//       <div className="flex-1">
//         <div className="h-24">
//           <ResponsiveContainer width="100%" height="100%">
//             <RadialBarChart
//               data={data}
//               endAngle={100}
//               innerRadius={30}
//               outerRadius={44}
//               barSize={8}
//               margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
//             >
//               <PolarGrid
//                 gridType="circle"
//                 radialLines={false}
//                 stroke="#e5e7eb"
//                 polarRadius={[36, 30]}
//               />
//               <RadialBar
//                 dataKey="value"
//                 background
//                 cornerRadius={3}
//                 fill={color}
//               />
//               <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//                 <Label
//                   content={({ viewBox }) => {
//                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                       return (
//                         <text
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           textAnchor="middle"
//                           dominantBaseline="middle"
//                           className={`${roboto.className}`}
//                         >
//                           <tspan
//                             x={viewBox.cx}
//                             y={viewBox.cy}
//                             className={`${valueColor} text-base font-bold tracking-wide`}
//                           >
//                             {value}
//                           </tspan>
//                           <tspan
//                             x={viewBox.cx}
//                             y={(viewBox.cy || 0) + 14}
//                             className="fill-gray-500 text-[6px] tracking-wide"
//                           >
//                             {title}
//                           </tspan>
//                         </text>
//                       )
//                     }
//                   }}
//                 />
//               </PolarRadiusAxis>
//             </RadialBarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     )
//   }

//   const formatHours = (hours: number) => {
//     if (hours === 0) return '0h'
//     const h = Math.floor(hours)
//     const m = Math.round((hours - h) * 60)
//     if (h === 0) return `${m}m`
//     if (m === 0) return `${h}h`
//     return `${h}h ${m}m`
//   }

//   const AttendanceStatusTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload
//       const statusColors = {
//         'present': 'text-blue-600',
//         'half-day': 'text-yellow-600',
//         'absent': 'text-red-600'
//       }
//       const statusLabels = {
//         'present': '✅ Present',
//         'half-day': '🌓 Half Day',
//         'absent': '❌ Absent'
//       }
//       return (
//         <div className={`${roboto.className} bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 text-xs tracking-wide max-w-xs`}>
//           <p className="font-medium text-gray-800 tracking-wide">
//             {new Date(data.date).toLocaleDateString('en-US', { 
//               weekday: 'short',
//               month: 'short', 
//               day: 'numeric',
//               year: 'numeric'
//             })}
//           </p>
//           <p className={`font-semibold tracking-wide mt-1 ${statusColors[data.status as keyof typeof statusColors]}`}>
//             {statusLabels[data.status as keyof typeof statusLabels]}
//           </p>
//           {data.hours > 0 && (
//             <p className="text-xs text-gray-500 tracking-wide mt-0.5">
//               Hours: {formatHours(data.hours)}
//             </p>
//           )}
//           {data.checkIn && (
//             <p className="text-xs text-gray-500 tracking-wide mt-0.5">
//               Check In: {new Date(data.checkIn).toLocaleTimeString('en-US', { 
//                 hour: '2-digit', 
//                 minute: '2-digit',
//                 hour12: true 
//               })}
//             </p>
//           )}
//           {data.checkOut && (
//             <p className="text-xs text-gray-500 tracking-wide">
//               Check Out: {new Date(data.checkOut).toLocaleTimeString('en-US', { 
//                 hour: '2-digit', 
//                 minute: '2-digit',
//                 hour12: true 
//               })}
//             </p>
//           )}
//           {data.status === 'absent' && (
//             <p className="text-xs text-gray-400 tracking-wide mt-0.5">No attendance recorded</p>
//           )}
//         </div>
//       )
//     }
//     return null
//   }

//   const RoundedBar = (props: any) => {
//     const { x, y, width, height, fill } = props
//     const radius = 4
    
//     return (
//       <rect
//         x={x}
//         y={y}
//         width={width}
//         height={height}
//         fill={fill}
//         rx={radius}
//         ry={radius}
//       />
//     )
//   }

//   // ✅ ONLY ONE LOADING SCREEN - DashboardContent ka apna loading
//   if (loading) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
//         <div className="text-center">
//           <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto mb-4" />
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
//         <div className="text-center bg-white shadow-sm p-8 max-w-md rounded-lg">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wider">Error</h3>
//           <p className="text-gray-600 mb-4 tracking-wide">{error}</p>
//           <button
//             onClick={fetchDashboardData}
//             className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition tracking-wider rounded"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const dailyTotalPresent = dailyAttendanceStatus.filter(d => d.status === 'present').length
//   const dailyTotalHalfDay = dailyAttendanceStatus.filter(d => d.status === 'half-day').length
//   const dailyTotalAbsent = dailyAttendanceStatus.filter(d => d.status === 'absent').length

//   return (
//     <>
//       <NavbarDropdown/>
//       <AttendancePopup employeeId={employeeId} />
//       <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <div>
//                   <h1 className="text-3xl font-bold text-[#0071BD] tracking-wider">
//                     Employee Dashboard
//                   </h1>
//                 </div>
//               </div>
              
//               <div className="flex gap-3">
//                 <button
//                   onClick={fetchDashboardData}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center gap-2 tracking-wider rounded"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   Refresh
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
//             <div className="bg-white shadow-sm p-4 rounded">
//               <div className="text-sm text-[#0071BD] tracking-wide">Employee ID</div>
//               <div className="text-2xl font-bold text-[#0071BD] tracking-wider">{stats.employeeId || 'N/A'}</div>
//             </div>

//             <div className="bg-white shadow-sm p-4 rounded">
//               <div className="text-sm text-green-600 tracking-wide flex items-center gap-1">
//                 <UserCheck className="w-4 h-4" /> Present
//               </div>
//               <div className="text-2xl font-bold text-green-700 tracking-wider">{stats.presentToday}</div>
//             </div>

//             <div className="bg-white shadow-sm p-4 rounded">
//               <div className="text-sm text-red-600 tracking-wide flex items-center gap-1">
//                 <UserX className="w-4 h-4" /> Absent
//               </div>
//               <div className="text-2xl font-bold text-red-700 tracking-wider">{stats.absentToday}</div>
//             </div>

//             <div className="bg-white shadow-sm p-4 rounded">
//               <div className="text-sm text-yellow-600 tracking-wide flex items-center gap-1">
//                 <UserMinus className="w-4 h-4" /> On Leave
//               </div>
//               <div className="text-2xl font-bold text-yellow-700 tracking-wider">{stats.onLeave}</div>
//             </div>

//             <div className="bg-white shadow-sm p-4 rounded">
//               <div className="text-sm text-orange-600 tracking-wide flex items-center gap-1">
//                 <ClockIcon className="w-4 h-4" /> Pending
//               </div>
//               <div className="text-2xl font-bold text-orange-700 tracking-wider">{stats.pendingLeaves}</div>
//             </div>

//             <div className="bg-white shadow-sm p-4 rounded">
//               <div className="text-sm text-blue-600 tracking-wide flex items-center gap-1">
//                 <Building className="w-4 h-4" /> Department
//               </div>
//               <div className="text-2xl font-bold text-blue-700 tracking-wider">{stats.employeeDepartment || 'N/A'}</div>
//             </div>

//             <div className="bg-white shadow-sm p-4 rounded">
//               <div className="text-sm text-indigo-600 tracking-wide flex items-center gap-1">
//                 {stats.attendanceRate > 70 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
//                 Rate
//               </div>
//               <div className={`text-2xl font-bold tracking-wider ${
//                 stats.attendanceRate > 70 ? 'text-green-700' : 'text-red-700'
//               }`}>
//                 {stats.attendanceRate.toFixed(1)}%
//               </div>
//             </div>
//           </div>

//           {/* Quick Action Buttons */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             <button
//               onClick={() => router.push(`/attendance/${employeeId}`)}
//               className="bg-white shadow-sm p-4 hover:shadow-md transition text-center rounded"
//             >
//               <div className="flex items-center justify-center gap-2 text-[#0071BD]">
//                 <Clock className="w-5 h-5" />
//                 <span className="font-semibold tracking-wide">Mark Attendance</span>
//               </div>
//             </button>
//             <button
//               onClick={() => router.push(`/leave-request/${employeeId}`)}
//               className="bg-white shadow-sm p-4 hover:shadow-md transition text-center rounded"
//             >
//               <div className="flex items-center justify-center gap-2 text-[#0071BD]">
//                 <Calendar className="w-5 h-5" />
//                 <span className="font-semibold tracking-wide">Apply Leave</span>
//               </div>
//             </button>
//             <button
//               onClick={() => router.push(`/settings/${employeeId}`)}
//               className="bg-white shadow-sm p-4 hover:shadow-md transition text-center rounded"
//             >
//               <div className="flex items-center justify-center gap-2 text-[#0071BD]">
//                 <UserIcon className="w-5 h-5" />
//                 <span className="font-semibold tracking-wide">My Profile</span>
//               </div>
//             </button>
//             <button
//               onClick={() => router.push(`/attendance/${employeeId}`)}
//               className="bg-white shadow-sm p-4 hover:shadow-md transition text-center rounded"
//             >
//               <div className="flex items-center justify-center gap-2 text-[#0071BD]">
//                 <FileSpreadsheet className="w-5 h-5" />
//                 <span className="font-semibold tracking-wide">My Attendance</span>
//               </div>
//             </button>
//           </div>

//           {/* Daily Attendance Status Chart */}
//           <div className="bg-white shadow-sm p-4 rounded mb-6">
//             <div className="flex items-center justify-between mb-3">
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800 tracking-wide flex items-center gap-2">
//                   <Calendar className="w-4 h-4 text-blue-600" />
//                   Daily Attendance Status - {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
//                 </h3>
//                 <p className="text-[10px] text-gray-500 tracking-wide mt-0.5">
//                   Showing daily attendance status (Present ≥ 5hrs | Half Day &lt; 5hrs | Absent 0hrs)
//                 </p>
//               </div>
//               <div className="flex text-black items-center gap-3 text-[10px]">
//                 <span className="flex items-center gap-1 tracking-wide">
//                   <span className="w-3 h-3 bg-blue-500 rounded"></span>
//                   Present
//                 </span>
//                 <span className="flex items-center gap-1 tracking-wide">
//                   <span className="w-3 h-3 bg-yellow-500 rounded"></span>
//                   Half Day
//                 </span>
//                 <span className="flex items-center gap-1 tracking-wide">
//                   <span className="w-3 h-3 bg-red-500 rounded"></span>
//                   Absent
//                 </span>
//               </div>
//             </div>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart 
//                   data={dailyAttendanceStatus} 
//                   barGap={2}
//                   margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
//                   <XAxis 
//                     dataKey="day" 
//                     tickLine={false}
//                     tickMargin={6}
//                     axisLine={false}
//                     fontSize={9}
//                     tick={{ className: `text-[9px] ${roboto.className} tracking-wide` }}
//                     label={{
//                       value: `Date (${new Date().toLocaleString('default', { month: 'long' })})`,
//                       position: 'insideBottom',
//                       offset: -5,
//                       fontSize: 9,
//                       className: `text-gray-500 ${roboto.className} tracking-wide`,
//                       fill: '#6B7280'
//                     }}
//                   />
//                   <YAxis 
//                     fontSize={9} 
//                     axisLine={false} 
//                     tickLine={false}
//                     tick={{ className: `text-[9px] ${roboto.className} tracking-wide` }}
//                     label={{
//                       value: 'Status',
//                       angle: -90,
//                       position: 'insideLeft',
//                       fontSize: 9,
//                       className: `text-gray-500 ${roboto.className} tracking-wide`,
//                       fill: '#6B7280'
//                     }}
//                     domain={[0, 4]}
//                     tickFormatter={(value) => {
//                       if (value === 1) return 'Absent'
//                       if (value === 2) return 'Half Day'
//                       if (value === 3) return 'Present'
//                       return ''
//                     }}
//                     ticks={[1, 2, 3]}
//                   />
//                   <Tooltip content={<AttendanceStatusTooltip />} />
//                   <Bar 
//                     dataKey="statusValue" 
//                     name="Attendance Status"
//                     shape={<RoundedBar />}
//                   >
//                     {dailyAttendanceStatus.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 tracking-wide">
//               <span>
//                 Total Days: {dailyAttendanceStatus.length} | 
//                 <span className="text-blue-600 ml-1">Present: {dailyTotalPresent}</span> | 
//                 <span className="text-yellow-600 ml-1">Half Day: {dailyTotalHalfDay}</span> | 
//                 <span className="text-red-600 ml-1">Absent: {dailyTotalAbsent}</span>
//               </span>
//               <span className="flex items-center gap-1 text-blue-600 tracking-wide">
//                 <TrendingUp className="w-3 h-3" />
//                 {dailyAttendanceStatus.length > 0 ? ((dailyTotalPresent / dailyAttendanceStatus.length) * 100).toFixed(1) : 0}% present
//               </span>
//             </div>
//           </div>

//           {/* Leave Status Distribution */}
//           <div className="bg-white shadow-sm p-2 rounded mb-6">
//             <h3 className="text-xs font-semibold text-gray-800 mb-0.5 tracking-wide text-center">Leave Status Distribution</h3>
//             <div className="flex">
//               <div className="flex-1">
//                 <LeaveRadialChart 
//                   data={pendingData} 
//                   title="Pending" 
//                   color="#F59E0B"
//                   valueColor="text-yellow-600"
//                 />
//               </div>
//               <div className="flex-1">
//                 <LeaveRadialChart 
//                   data={approvedData} 
//                   title="Approved" 
//                   color="#10B981"
//                   valueColor="text-green-600"
//                 />
//               </div>
//               <div className="flex-1">
//                 <LeaveRadialChart 
//                   data={rejectedData} 
//                   title="Rejected" 
//                   color="#EF4444"
//                   valueColor="text-red-600"
//                 />
//               </div>
//             </div>
//             <div className="mt-0.5 flex flex-wrap items-center justify-center gap-2 text-[9px]">
//               <span className="flex items-center gap-1 tracking-wide">
//                 <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
//                 Pending: {stats.pendingLeaves}
//               </span>
//               <span className="flex items-center gap-1 tracking-wide">
//                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
//                 Approved: {stats.approvedLeaves}
//               </span>
//               <span className="flex items-center gap-1 tracking-wide">
//                 <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
//                 Rejected: {stats.rejectedLeaves}
//               </span>
//             </div>
//           </div>

//           {/* Attendance Trends */}
//           <div className="bg-white shadow-sm p-4 rounded mb-6">
//             <div className="flex flex-col items-stretch border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800 tracking-wide">Attendance Trends</h3>
//                 <p className="text-[10px] text-gray-500 tracking-wide mt-0.5">Showing daily attendance for the last 30 days</p>
//               </div>
//               <div className="flex mt-2 sm:mt-0">
//                 <button
//                   data-active={activeChart === 'present'}
//                   className={`flex flex-col px-3 py-1.5 text-left border rounded-l-lg ${
//                     activeChart === 'present' 
//                       ? 'bg-blue-50 border-blue-500' 
//                       : 'bg-white border-gray-200 hover:bg-gray-50'
//                   }`}
//                   onClick={() => setActiveChart('present')}
//                 >
//                   <span className="text-[9px] text-gray-500 tracking-wide">Present</span>
//                   <span className="text-xs font-bold text-green-600 tracking-wider">{lineTotalPresent.toLocaleString()}</span>
//                 </button>
//                 <button
//                   data-active={activeChart === 'absent'}
//                   className={`flex flex-col px-3 py-1.5 text-left border rounded-r-lg ${
//                     activeChart === 'absent' 
//                       ? 'bg-blue-50 border-blue-500' 
//                       : 'bg-white border-gray-200 hover:bg-gray-50'
//                   }`}
//                   onClick={() => setActiveChart('absent')}
//                 >
//                   <span className="text-[9px] text-gray-500 tracking-wide">Absent</span>
//                   <span className="text-xs font-bold text-red-600 tracking-wider">{lineTotalAbsent.toLocaleString()}</span>
//                 </button>
//               </div>
//             </div>
//             <div className="h-56 mt-2">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={lineChartData}
//                   margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
//                 >
//                   <CartesianGrid vertical={false} stroke="#e5e7eb" />
//                   <XAxis
//                     dataKey="date"
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={6}
//                     minTickGap={32}
//                     fontSize={9}
//                     tick={{ className: `${roboto.className} tracking-wide` }}
//                     tickFormatter={(value) => {
//                       const date = new Date(value)
//                       return date.toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                       })
//                     }}
//                   />
//                   <YAxis 
//                     fontSize={9} 
//                     axisLine={false} 
//                     tickLine={false}
//                     tick={{ className: `${roboto.className} tracking-wide` }}
//                   />
//                   <Tooltip 
//                     content={({ active, payload, label }) => {
//                       if (active && payload && payload.length) {
//                         return (
//                           <div className={`${roboto.className} bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-2 text-[10px] tracking-wide`}>
//                             <p className="font-medium text-gray-800 tracking-wide">
//                               {label
//                                 ? new Date(label).toLocaleDateString('en-US', {
//                                     month: 'short',
//                                     day: 'numeric',
//                                     year: 'numeric',
//                                   })
//                                 : 'N/A'}
//                             </p>
//                             {payload.map((item: any, index: number) => (
//                               <p key={index} className="text-gray-600 tracking-wide" style={{ color: item.color }}>
//                                 {item.name}: {item.value}
//                               </p>
//                             ))}
//                           </div>
//                         )
//                       }
//                       return null
//                     }}
//                   />
//                   <Line
//                     dataKey={activeChart}
//                     type="monotone"
//                     stroke="#3B82F6"
//                     strokeWidth={2}
//                     dot={false}
//                     activeDot={{ r: 3, fill: '#3B82F6' }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Recent Activity Section */}
//           <div className="bg-white shadow-sm rounded-lg mb-6 overflow-hidden">
//             <div className="p-2.5 border-b border-gray-200 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Activity className="w-4 h-4 text-[#0071BD]" />
//                   <h3 className="font-semibold text-gray-800 tracking-wide text-xs">Recent Activity</h3>
//                   <span className="text-[10px] text-gray-400 tracking-wide">(Last Hour)</span>
//                 </div>
//                 <span className="text-[10px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 tracking-wide">
//                   {recentActivities.length} activities
//                 </span>
//               </div>
//             </div>

//             {recentActivities.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gray-50 border-b border-gray-200">
//                       <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Employee</th>
//                       <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                       <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Dept</th>
//                       <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                       <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {recentActivities.slice(0, 5).map((activity) => (
//                       <tr key={activity.id} className="hover:bg-gray-50 transition">
//                         <td className="px-2.5 py-1.5">
//                           <div className="flex items-center gap-1.5">
//                             <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
//                               activity.type === 'check-in' ? 'bg-green-100' : 'bg-orange-100'
//                             }`}>
//                               <UserIcon className={`w-3 h-3 ${
//                                 activity.type === 'check-in' ? 'text-green-600' : 'text-orange-600'
//                               }`} />
//                             </div>
//                             <span className="text-xs font-medium text-gray-800 tracking-wide">
//                               {activity.employeeName}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-2.5 py-1.5 text-[10px] text-gray-600 tracking-wide">
//                           {activity.employeeId}
//                         </td>
//                         <td className="px-2.5 py-1.5 text-[10px] text-gray-600 tracking-wide">
//                           <span className="px-1 py-0.5 bg-gray-100 rounded text-[9px] tracking-wide">
//                             {activity.department}
//                           </span>
//                         </td>
//                         <td className="px-2.5 py-1.5">
//                           <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium tracking-wide ${
//                             activity.type === 'check-in' 
//                               ? 'bg-green-100 text-green-700' 
//                               : 'bg-orange-100 text-orange-700'
//                           }`}>
//                             {activity.type === 'check-in' ? (
//                               <LogIn className="w-2.5 h-2.5" />
//                             ) : (
//                               <LogOutIcon className="w-2.5 h-2.5" />
//                             )}
//                             {activity.type === 'check-in' ? 'In' : 'Out'}
//                           </span>
//                         </td>
//                         <td className="px-2.5 py-1.5 text-[10px] text-gray-500 tracking-wide">
//                           {formatTime(activity.time)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-3 text-gray-500">
//                 <Activity className="w-6 h-6 text-gray-300 mx-auto mb-0.5" />
//                 <p className="text-[10px] tracking-wide">No recent activity in the last hour</p>
//               </div>
//             )}
//           </div>

//           {/* Footer Stats */}
//           {data.employees.length > 0 && (
//             <div className="mt-6 bg-white shadow-sm p-2.5 rounded">
//               <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-600 tracking-wide">
//                 <div className="tracking-wide">
//                   Welcome back, {stats.employeeName || 'Employee'}!
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="flex items-center gap-1 tracking-wide">
//                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                     Present: {stats.presentToday}
//                   </span>
//                   <span className="flex items-center gap-1 tracking-wide">
//                     <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
//                     Absent: {stats.absentToday}
//                   </span>
//                   <span className="flex items-center gap-1 tracking-wide">
//                     <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
//                     On Leave: {stats.onLeave}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer/>
//     </>
//   )
// }

// // ============================================
// // MAIN EXPORT - ProtectedRoute OUTSIDE the dashboard content
// // ============================================
// export default function EmployeeDashboardPage() {
//   return (
//     <ProtectedEmployeeRoute allowedRole='employee'>
//       <DashboardContent />
//     </ProtectedEmployeeRoute>
//   )
// }


'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Footer from '@/components/footer'
import AttendancePopup from '@/components/popup'
import NavbarDropdown from '@/app/Navbar/page'
import ProtectedEmployeeRoute from '@/components/ProtectedEmployeeRoute'
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
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Eye,
  UserPlus,
  Briefcase,
  UserMinus,
  User as UserIcon,
  FileSpreadsheet,
  LogIn,
  LogOut as LogOutIcon,
  Activity,
  ArrowLeft,
  Timer
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarRadiusAxis,
  Label,
  Cell,
  Rectangle
} from 'recharts'

import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

interface DashboardData {
  employees: any[]
  leaveRequests: any[]
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

interface Stats {
  totalEmployees: number
  presentToday: number
  absentToday: number
  halfDayToday: number
  onLeave: number
  pendingLeaves: number
  approvedLeaves: number
  rejectedLeaves: number
  departments: string[]
  departmentCount: { [key: string]: number }
  attendanceRate: number
  employeeName: string
  employeeId: string
  employeeDepartment: string
  employeePosition: string
}

interface RecentActivity {
  id: string
  employeeName: string
  employeeId: string
  type: 'check-in' | 'check-out'
  time: string
  location: string
  department: string
}

interface DailyAttendanceStatus {
  date: string
  day: number
  dayName: string
  isSunday: boolean
  status: 'present' | 'half-day' | 'absent'
  statusValue: number
  hours: number
  checkIn: string | null
  checkOut: string | null
  color: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function DashboardContent() {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.employeeId as string

  const [data, setData] = useState<DashboardData>({ employees: [], leaveRequests: [] })
  const [currentEmployee, setCurrentEmployee] = useState<any>(null)
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([])
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    halfDayToday: 0,
    onLeave: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    departments: [],
    departmentCount: {},
    attendanceRate: 0,
    employeeName: '',
    employeeId: '',
    employeeDepartment: '',
    employeePosition: ''
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeChart, setActiveChart] = useState<'present' | 'absent'>('present')
  const [dailyAttendanceStatus, setDailyAttendanceStatus] = useState<DailyAttendanceStatus[]>([])

  // =====================================================
  // getRecentActivities
  // =====================================================

  const getRecentActivities = useCallback((logs: AttendanceLog[], emp: any) => {
    const activities: RecentActivity[] = []
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    logs.forEach((log) => {
      const logTime = new Date(log.timestamp)
      if (logTime > oneHourAgo) {
        const logHour = logTime.getHours()
        const type: 'check-in' | 'check-out' = logHour >= 18 ? 'check-out' : 'check-in'

        activities.push({
          id: `log_${log.id}_${log.timestamp}`,
          employeeName: emp?.full_name || log.employee_name || 'Unknown',
          employeeId: log.user_id || 'N/A',
          type: type,
          time: log.timestamp,
          location: log.branch_code || 'Unknown location',
          department: emp?.department || 'N/A'
        })
      }
    })

    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    setRecentActivities(activities.slice(0, 20))
  }, [])

  // =====================================================
  // getDayLogsForDate
  // =====================================================

  const getDayLogsForDate = useCallback((logs: AttendanceLog[], dateStr: string) => {
    const dayLogs = logs.filter(log => {
      const logDate = log.timestamp.split('T')[0]
      return logDate === dateStr
    })

    return [...dayLogs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }, [])

  // =====================================================
  // calculateDayStatus
  // =====================================================

  const calculateDayStatus = useCallback((logs: AttendanceLog[], dateStr: string) => {
    const sortedLogs = getDayLogsForDate(logs, dateStr)

    let checkIn: AttendanceLog | null = null
    let checkOut: AttendanceLog | null = null
    let hasCheckIn = false
    let hasCheckOut = false
    let totalHours = 0
    let status: 'present' | 'half-day' | 'absent' = 'absent'

    if (sortedLogs.length === 1) {
      const singleLog = sortedLogs[0]
      const logHour = new Date(singleLog.timestamp).getHours()

      if (logHour >= 18) {
        checkOut = singleLog
        hasCheckOut = true
        hasCheckIn = false
      } else {
        checkIn = singleLog
        hasCheckIn = true
        hasCheckOut = false
      }
    } else if (sortedLogs.length >= 2) {
      checkIn = sortedLogs[0]
      hasCheckIn = true

      const lastLog = sortedLogs[sortedLogs.length - 1]
      const diffMs = new Date(lastLog.timestamp).getTime() - new Date(checkIn.timestamp).getTime()

      if (diffMs >= 3600000) {
        checkOut = lastLog
        hasCheckOut = true
        totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100
      } else {
        checkOut = null
        hasCheckOut = false
      }
    }

    if (hasCheckIn && hasCheckOut) {
      status = 'present'
    } else if (hasCheckIn && !hasCheckOut) {
      status = 'half-day'
    } else {
      status = 'absent'
    }

    return {
      status,
      hours: totalHours,
      checkIn: checkIn?.timestamp || null,
      checkOut: checkOut?.timestamp || null,
      hasCheckIn,
      hasCheckOut
    }
  }, [getDayLogsForDate])

  // =====================================================
  // calculateDailyAttendanceStatus - Sunday = GREEN
  // =====================================================

  const calculateDailyAttendanceStatus = useCallback((logs: AttendanceLog[]) => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const dailyData: DailyAttendanceStatus[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

      const dayOfWeek = date.getDay()
      const isSunday = dayOfWeek === 0
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

      const result = calculateDayStatus(logs, dateStr)

      let color = '#EF4444'
      let statusValue = 1

      if (isSunday) {
        color = '#10B981'
        statusValue = 1
      } else if (result.status === 'present') {
        color = '#3B82F6'
        statusValue = 3
      } else if (result.status === 'half-day') {
        color = '#F59E0B'
        statusValue = 2
      }

      dailyData.push({
        date: dateStr,
        day: day,
        dayName: dayName,
        isSunday: isSunday,
        status: result.status,
        statusValue: statusValue,
        hours: result.hours,
        checkIn: result.checkIn,
        checkOut: result.checkOut,
        color: color
      })
    }

    setDailyAttendanceStatus(dailyData)
  }, [calculateDayStatus])

  // =====================================================
  // calculateStats
  // =====================================================

  const calculateStats = useCallback((emp: any, logs: AttendanceLog[], leaveRequests: any[]) => {
    const today = new Date().toISOString().split('T')[0]

    const result = calculateDayStatus(logs, today)

    let presentToday = 0
    let absentToday = 0
    let halfDayToday = 0

    if (result.status === 'present') presentToday = 1
    else if (result.status === 'half-day') halfDayToday = 1
    else absentToday = 1

    const leaves = (leaveRequests || []).filter((l: any) => l !== null && l !== undefined)

    const pendingLeaves = leaves.filter((l: any) => l && l.status === 'pending').length
    const approvedLeaves = leaves.filter((l: any) => l && l.status === 'approved').length
    const rejectedLeaves = leaves.filter((l: any) => l && l.status === 'rejected').length
    const onLeave = leaves.filter((l: any) => {
      if (!l) return false
      const todayDate = new Date(today)
      const fromDate = new Date(l.fromDate)
      const toDate = new Date(l.toDate)
      return fromDate <= todayDate && toDate >= todayDate && l.status === 'approved'
    }).length

    const attendanceRate = (presentToday + halfDayToday * 0.5) * 100

    setStats({
      totalEmployees: 1,
      presentToday,
      absentToday,
      halfDayToday,
      onLeave,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      departments: emp?.department ? [emp.department] : [],
      departmentCount: emp?.department ? { [emp.department]: 1 } : {},
      attendanceRate,
      employeeName: emp?.full_name || '',
      employeeId: emp?.employee_id || '',
      employeeDepartment: emp?.department || '',
      employeePosition: emp?.position || ''
    })

    getRecentActivities(logs, emp)
  }, [calculateDayStatus, getRecentActivities])

  // =====================================================
  // fetchDashboardData
  // =====================================================

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: employeeData, error: fetchError } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', employeeId)
        .maybeSingle()

      if (fetchError) throw new Error(fetchError.message)

      if (!employeeData) {
        setError('Employee not found')
        setLoading(false)
        return
      }

      setCurrentEmployee(employeeData)

      const [mainLogsResult, pqLogsResult] = await Promise.all([
        supabase
          .from('attendance_logs')
          .select('*')
          .eq('user_id', employeeId)
          .order('timestamp', { ascending: true }),
        supabase
          .from('pq_attendance_logs')
          .select('*')
          .eq('user_id', employeeId)
          .order('timestamp', { ascending: true })
      ])

      if (mainLogsResult.error) {
        console.warn('Error fetching main attendance logs:', mainLogsResult.error)
      }

      if (pqLogsResult.error) {
        console.warn('Error fetching PQ attendance logs:', pqLogsResult.error)
      }

      const allLogs: AttendanceLog[] = []

      if (mainLogsResult.data) {
        allLogs.push(...mainLogsResult.data.map((log: any) => ({
          ...log,
          punch_type: log.punch_type as 'CHECK_IN' | 'CHECK_OUT' | null,
          source: 'K' as 'K'
        })))
      }

      if (pqLogsResult.data) {
        allLogs.push(...pqLogsResult.data.map((log: any) => ({
          ...log,
          punch_type: log.punch_type as 'CHECK_IN' | 'CHECK_OUT' | null,
          source: 'PQ' as 'PQ'
        })))
      }

      allLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

      setAttendanceLogs(allLogs)

      const dashboardData: DashboardData = {
        employees: [employeeData],
        leaveRequests: employeeData.leaves || []
      }
      setData(dashboardData)

      calculateStats(employeeData, allLogs, employeeData.leaves || [])
      calculateDailyAttendanceStatus(allLogs)

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [employeeId, calculateStats, calculateDailyAttendanceStatus])

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {
    if (employeeId) {
      fetchDashboardData()
    }
  }, [employeeId, fetchDashboardData])

  // =====================================================
  // getAttendanceLineData
  // =====================================================

  const getAttendanceLineData = useCallback(() => {
    const last30Days = []

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const result = calculateDayStatus(attendanceLogs, dateStr)

      last30Days.push({
        date: dateStr,
        present: result.status === 'present' ? 1 : 0,
        absent: result.status === 'absent' ? 1 : 0,
        halfDay: result.status === 'half-day' ? 1 : 0,
        total: 1
      })
    }
    return last30Days
  }, [attendanceLogs, calculateDayStatus])

  // =====================================================
  // formatTime
  // =====================================================

  const formatTime = useCallback((timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return 'Unknown'
    }
  }, [])

  // =====================================================
  // CustomTooltip
  // =====================================================

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

  const lineChartData = getAttendanceLineData()
  const lineTotalPresent = useMemo(() => lineChartData.reduce((acc, curr) => acc + curr.present, 0), [lineChartData])
  const lineTotalAbsent = useMemo(() => lineChartData.reduce((acc, curr) => acc + curr.absent, 0), [lineChartData])

  const pendingData = [{ name: 'Pending', value: stats.pendingLeaves, fill: '#F59E0B' }]
  const approvedData = [{ name: 'Approved', value: stats.approvedLeaves, fill: '#10B981' }]
  const rejectedData = [{ name: 'Rejected', value: stats.rejectedLeaves, fill: '#EF4444' }]

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
              <RadialBar
                dataKey="value"
                background
                cornerRadius={3}
                fill={color}
              />
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

  const formatHours = (hours: number) => {
    if (hours === 0) return '0h'
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  }

  // =====================================================
  // AttendanceStatusTooltip
  // =====================================================

  const AttendanceStatusTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const statusColors = {
        'present': 'text-blue-600',
        'half-day': 'text-yellow-600',
        'absent': 'text-red-600'
      }
      const statusLabels = {
        'present': '✅ Present',
        'half-day': '🌓 Half Day',
        'absent': '❌ Absent'
      }
      return (
        <div className={`${roboto.className} bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 text-xs tracking-wide max-w-xs`}>
          <p className="font-medium text-gray-800 tracking-wide">
            {new Date(data.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          {data.isSunday && (
            <p className="font-bold text-green-600 tracking-wide mt-1">
              🌴 SUNDAY (Weekly Off)
            </p>
          )}
          {!data.isSunday && (
            <p className={`font-semibold tracking-wide mt-1 ${statusColors[data.status as keyof typeof statusColors]}`}>
              {statusLabels[data.status as keyof typeof statusLabels]}
            </p>
          )}
          {data.hours > 0 && (
            <p className="text-xs text-gray-500 tracking-wide mt-0.5">
              Hours: {formatHours(data.hours)}
            </p>
          )}
          {data.checkIn && (
            <p className="text-xs text-gray-500 tracking-wide mt-0.5">
              Check In: {new Date(data.checkIn).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          )}
          {data.checkOut && (
            <p className="text-xs text-gray-500 tracking-wide">
              Check Out: {new Date(data.checkOut).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          )}
          {data.status === 'absent' && !data.isSunday && (
            <p className="text-xs text-gray-400 tracking-wide mt-0.5">No attendance recorded</p>
          )}
        </div>
      )
    }
    return null
  }

  // =====================================================
  // CustomXAxisTick - Simple day number (Sunday = green)
  // =====================================================

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload, data } = props
    const item = data?.find((d: DailyAttendanceStatus) => d.day === payload.value)

    return (
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        fontSize={9}
        fill={item?.isSunday ? '#059669' : '#6B7280'}
        fontWeight={item?.isSunday ? 'bold' : 'normal'}
        className={roboto.className}
      >
        {payload.value}
      </text>
    )
  }

  // =====================================================
  // RoundedBar - Sunday = GREEN
  // =====================================================

  const RoundedBar = (props: any) => {
    const { x, y, width, height, fill, payload } = props
    const radius = 4
    const isSunday = payload?.isSunday

    return (
      <g>
        {isSunday && (
          <rect
            x={x - 1}
            y={0}
            width={width + 2}
            height={240}
            fill="#ECFDF5"
            opacity={0.8}
          />
        )}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={radius}
          ry={radius}
          stroke={isSunday ? '#10B981' : 'none'}
          strokeWidth={isSunday ? 1.5 : 0}
        />
      </g>
    )
  }

  // ✅ LOADING SCREEN
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
        <div className="text-center bg-white shadow-sm p-8 max-w-md rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wider">Error</h3>
          <p className="text-gray-600 mb-4 tracking-wide">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition tracking-wider rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const dailyTotalPresent = dailyAttendanceStatus.filter(d => d.status === 'present').length
  const dailyTotalHalfDay = dailyAttendanceStatus.filter(d => d.status === 'half-day').length
  const dailyTotalAbsent = dailyAttendanceStatus.filter(d => d.status === 'absent' && !d.isSunday).length

  return (
    <>
      <NavbarDropdown/>
      <AttendancePopup employeeId={employeeId} />
      <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-[#0071BD] tracking-wider">
                    Employee Dashboard
                  </h1>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={fetchDashboardData}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center gap-2 tracking-wider rounded"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-sm text-[#0071BD] tracking-wide">Employee ID</div>
              <div className="text-2xl font-bold text-[#0071BD] tracking-wider">{stats.employeeId || 'N/A'}</div>
            </div>

            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-sm text-green-600 tracking-wide flex items-center gap-1">
                <UserCheck className="w-4 h-4" /> Present
              </div>
              <div className="text-2xl font-bold text-green-700 tracking-wider">{stats.presentToday}</div>
            </div>

            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-sm text-red-600 tracking-wide flex items-center gap-1">
                <UserX className="w-4 h-4" /> Absent
              </div>
              <div className="text-2xl font-bold text-red-700 tracking-wider">{stats.absentToday}</div>
            </div>

            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-sm text-orange-600 tracking-wide flex items-center gap-1">
                <ClockIcon className="w-4 h-4" /> Half Day
              </div>
              <div className="text-2xl font-bold text-orange-700 tracking-wider">{stats.halfDayToday}</div>
            </div>

            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-sm text-yellow-600 tracking-wide flex items-center gap-1">
                <UserMinus className="w-4 h-4" /> On Leave
              </div>
              <div className="text-2xl font-bold text-yellow-700 tracking-wider">{stats.onLeave}</div>
            </div>

            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-sm text-blue-600 tracking-wide flex items-center gap-1">
                <Building className="w-4 h-4" /> Department
              </div>
              <div className="text-lg font-bold text-blue-700 tracking-wider truncate">{stats.employeeDepartment || 'N/A'}</div>
            </div>

            <div className="bg-white shadow-sm p-4 rounded">
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

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => router.push(`/attendance/${employeeId}`)}
              className="bg-white shadow-sm p-4 hover:shadow-md transition text-center rounded"
            >
              <div className="flex items-center justify-center gap-2 text-[#0071BD]">
                <Clock className="w-5 h-5" />
                <span className="font-semibold tracking-wide">Mark Attendance</span>
              </div>
            </button>
            <button
              onClick={() => router.push(`/leave-request/${employeeId}`)}
              className="bg-white shadow-sm p-4 hover:shadow-md transition text-center rounded"
            >
              <div className="flex items-center justify-center gap-2 text-[#0071BD]">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold tracking-wide">Apply Leave</span>
              </div>
            </button>
            <button
              onClick={() => router.push(`/settings/${employeeId}`)}
              className="bg-white shadow-sm p-4 hover:shadow-md transition text-center rounded"
            >
              <div className="flex items-center justify-center gap-2 text-[#0071BD]">
                <UserIcon className="w-5 h-5" />
                <span className="font-semibold tracking-wide">My Profile</span>
              </div>
            </button>
            <button
              onClick={() => router.push(`/attendance-history/${employeeId}`)}
              className="bg-white shadow-sm p-4 hover:shadow-md transition text-center rounded"
            >
              <div className="flex items-center justify-center gap-2 text-[#0071BD]">
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-semibold tracking-wide">My Attendance</span>
              </div>
            </button>
          </div>

          {/* Daily Attendance Status Chart */}
          <div className="bg-white shadow-sm p-4 rounded mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 tracking-wide flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Daily Attendance Status - {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <p className="text-[10px] text-gray-500 tracking-wide mt-0.5">
                  Present = Check-in + Check-out ≥ 1hr | Half Day = Check-in only | Absent = No valid attendance
                </p>
              </div>
              <div className="flex text-black items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 tracking-wide">
                  <span className="w-3 h-3 bg-blue-500 rounded"></span>
                  Present
                </span>
                <span className="flex items-center gap-1 tracking-wide">
                  <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                  Half Day
                </span>
                <span className="flex items-center gap-1 tracking-wide">
                  <span className="w-3 h-3 bg-red-500 rounded"></span>
                  Absent
                </span>
                <span className="flex items-center gap-1 tracking-wide">
                  <span className="w-3 h-3 bg-green-500 rounded"></span>
                  <span className="text-green-600 font-bold">Sunday</span>
                </span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyAttendanceStatus}
                  barGap={2}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={6}
                    axisLine={false}
                    fontSize={9}
                    interval={0}
                    tick={<CustomXAxisTick data={dailyAttendanceStatus} />}
                    height={40}
                    label={{
                      value: `Date (${new Date().toLocaleString('default', { month: 'long' })})`,
                      position: 'insideBottom',
                      offset: -5,
                      fontSize: 9,
                      className: `text-gray-500 ${roboto.className} tracking-wide`,
                      fill: '#6B7280'
                    }}
                  />
                  <YAxis
                    fontSize={9}
                    axisLine={false}
                    tickLine={false}
                    tick={{ className: `text-[9px] ${roboto.className} tracking-wide` }}
                    label={{
                      value: 'Status',
                      angle: -90,
                      position: 'insideLeft',
                      fontSize: 9,
                      className: `text-gray-500 ${roboto.className} tracking-wide`,
                      fill: '#6B7280'
                    }}
                    domain={[0, 4]}
                    tickFormatter={(value) => {
                      if (value === 1) return 'Absent'
                      if (value === 2) return 'Half Day'
                      if (value === 3) return 'Present'
                      return ''
                    }}
                    ticks={[1, 2, 3]}
                  />
                  <Tooltip content={<AttendanceStatusTooltip />} />
                  <Bar
                    dataKey="statusValue"
                    name="Attendance Status"
                    shape={<RoundedBar />}
                  >
                    {dailyAttendanceStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 tracking-wide">
              <span>
                Total Days: {dailyAttendanceStatus.length} |
                <span className="text-blue-600 ml-1">Present: {dailyTotalPresent}</span> |
                <span className="text-yellow-600 ml-1">Half Day: {dailyTotalHalfDay}</span> |
                <span className="text-red-600 ml-1">Absent: {dailyTotalAbsent}</span> |
                <span className="text-green-700 ml-1 font-bold">Sundays: {dailyAttendanceStatus.filter(d => d.isSunday).length}</span>
              </span>
              <span className="flex items-center gap-1 text-blue-600 tracking-wide">
                <TrendingUp className="w-3 h-3" />
                {dailyAttendanceStatus.length > 0 ? ((dailyTotalPresent / dailyAttendanceStatus.length) * 100).toFixed(1) : 0}% present
              </span>
            </div>
          </div>

          {/* Leave Status Distribution */}
          <div className="bg-white shadow-sm p-2 rounded mb-6">
            <h3 className="text-xs font-semibold text-gray-800 mb-0.5 tracking-wide text-center">Leave Status Distribution</h3>
            <div className="flex">
              <div className="flex-1">
                <LeaveRadialChart
                  data={pendingData}
                  title="Pending"
                  color="#F59E0B"
                  valueColor="text-yellow-600"
                />
              </div>
              <div className="flex-1">
                <LeaveRadialChart
                  data={approvedData}
                  title="Approved"
                  color="#10B981"
                  valueColor="text-green-600"
                />
              </div>
              <div className="flex-1">
                <LeaveRadialChart
                  data={rejectedData}
                  title="Rejected"
                  color="#EF4444"
                  valueColor="text-red-600"
                />
              </div>
            </div>
            <div className="mt-0.5 text-black flex flex-wrap items-center justify-center gap-2 text-[9px]">
              <span className="flex items-center gap-1 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full text-black bg-yellow-500"></span>
                Pending: {stats.pendingLeaves}
              </span>
              <span className="flex items-center gap-1 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full text-black bg-green-500"></span>
                Approved: {stats.approvedLeaves}
              </span>
              <span className="flex items-center gap-1 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full text-black bg-red-500"></span>
                Rejected: {stats.rejectedLeaves}
              </span>
            </div>
          </div>

          {/* Attendance Trends */}
          <div className="bg-white shadow-sm p-4 rounded mb-6">
            <div className="flex flex-col items-stretch border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 tracking-wide">Attendance Trends</h3>
                <p className="text-[10px] text-gray-500 tracking-wide mt-0.5">Showing daily attendance for the last 30 days</p>
              </div>
              <div className="flex mt-2 sm:mt-0">
                <button
                  data-active={activeChart === 'present'}
                  className={`flex flex-col px-3 py-1.5 text-left border rounded-l-lg ${
                    activeChart === 'present'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveChart('present')}
                >
                  <span className="text-[9px] text-gray-500 tracking-wide">Present</span>
                  <span className="text-xs font-bold text-green-600 tracking-wider">{lineTotalPresent.toLocaleString()}</span>
                </button>
                <button
                  data-active={activeChart === 'absent'}
                  className={`flex flex-col px-3 py-1.5 text-left border rounded-r-lg ${
                    activeChart === 'absent'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveChart('absent')}
                >
                  <span className="text-[9px] text-gray-500 tracking-wide">Absent</span>
                  <span className="text-xs font-bold text-red-600 tracking-wider">{lineTotalAbsent.toLocaleString()}</span>
                </button>
              </div>
            </div>
            <div className="h-56 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    minTickGap={32}
                    fontSize={9}
                    tick={{ className: `${roboto.className} tracking-wide` }}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <YAxis
                    fontSize={9}
                    axisLine={false}
                    tickLine={false}
                    tick={{ className: `${roboto.className} tracking-wide` }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className={`${roboto.className} bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-2 text-[10px] tracking-wide`}>
                            <p className="font-medium text-gray-800 tracking-wide">
                              {label
                                ? new Date(label).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : 'N/A'}
                            </p>
                            {payload.map((item: any, index: number) => (
                              <p key={index} className="text-gray-600 tracking-wide" style={{ color: item.color }}>
                                {item.name}: {item.value}
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    dataKey={activeChart}
                    type="monotone"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3, fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white shadow-sm rounded-lg mb-6 overflow-hidden">
            <div className="p-2.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#0071BD]" />
                  <h3 className="font-semibold text-gray-800 tracking-wide text-xs">Recent Activity</h3>
                  <span className="text-[10px] text-gray-400 tracking-wide">(Last Hour)</span>
                </div>
                <span className="text-[10px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 tracking-wide">
                  {recentActivities.length} activities
                </span>
              </div>
            </div>

            {recentActivities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Dept</th>
                      <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-2.5 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50 transition">
                        <td className="px-2.5 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              activity.type === 'check-in' ? 'bg-green-100' : 'bg-orange-100'
                            }`}>
                              <UserIcon className={`w-3 h-3 ${
                                activity.type === 'check-in' ? 'text-green-600' : 'text-orange-600'
                              }`} />
                            </div>
                            <span className="text-xs font-medium text-gray-800 tracking-wide">
                              {activity.employeeName}
                            </span>
                          </div>
                        </td>
                        <td className="px-2.5 py-1.5 text-[10px] text-gray-600 tracking-wide">
                          {activity.employeeId}
                        </td>
                        <td className="px-2.5 py-1.5 text-[10px] text-gray-600 tracking-wide">
                          <span className="px-1 py-0.5 bg-gray-100 rounded text-[9px] tracking-wide">
                            {activity.department}
                          </span>
                        </td>
                        <td className="px-2.5 py-1.5">
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium tracking-wide ${
                            activity.type === 'check-in'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {activity.type === 'check-in' ? (
                              <LogIn className="w-2.5 h-2.5" />
                            ) : (
                              <LogOutIcon className="w-2.5 h-2.5" />
                            )}
                            {activity.type === 'check-in' ? 'In' : 'Out'}
                          </span>
                        </td>
                        <td className="px-2.5 py-1.5 text-[10px] text-gray-500 tracking-wide">
                          {formatTime(activity.time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-3 text-gray-500">
                <Activity className="w-6 h-6 text-gray-300 mx-auto mb-0.5" />
                <p className="text-[10px] tracking-wide">No recent activity in the last hour</p>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          {data.employees.length > 0 && (
            <div className="mt-6 bg-white shadow-sm p-2.5 rounded">
              <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-600 tracking-wide">
                <div className="tracking-wide">
                  Welcome back, {stats.employeeName || 'Employee'}!
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 tracking-wide">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Present: {stats.presentToday}
                  </span>
                  <span className="flex items-center gap-1 tracking-wide">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Absent: {stats.absentToday}
                  </span>
                  <span className="flex items-center gap-1 tracking-wide">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    On Leave: {stats.onLeave}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  )
}

// ============================================
// MAIN EXPORT
// ============================================
export default function EmployeeDashboardPage() {
  return (
    <ProtectedEmployeeRoute allowedRole='employee'>
      <DashboardContent />
    </ProtectedEmployeeRoute>
  )
}