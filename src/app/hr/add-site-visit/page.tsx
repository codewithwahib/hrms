// // src/app/admin/attendance/site-visit/page.tsx
// 'use client'

// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
// import NavbarDropdown from '@/components/navbar'
// import Footer from '@/components/footer'
// import { createClient } from '@supabase/supabase-js'
// import { Roboto } from 'next/font/google'
// import {
//   Loader,
//   AlertCircle,
//   CheckCircle,
//   User,
//   Calendar,
//   Clock,
//   MapPin,
//   ChevronDown,
//   Plus,
//   Hash,
//   Building,
//   Briefcase,
//   PlusCircle,
//   Lock,
//   RefreshCw,
//   Mail,
//   ShieldCheck,
//   CalendarDays,
//   Users,
//   FileText,
//   Phone,
//   Crosshair,
//   Pencil,
// } from 'lucide-react'

// const roboto = Roboto({
//   weight: ['100', '300', '400', '500', '700', '900'],
//   style: ['normal', 'italic'],
//   subsets: ['latin'],
//   display: 'swap',
// })

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// const supabase = createClient(supabaseUrl, supabaseAnonKey)

// interface Employee {
//   employee_id: string
//   full_name: string
//   department: string | null
//   position: string | null
//   source: string | null
//   site_visits?: any
// }

// interface LiveLocation {
//   address: string
//   accuracy: number
//   latitude: number
//   longitude: number
//   timestamp: string
// }

// interface SiteVisitEntry {
//   _key: string
//   _type: 'siteVisit'
//   notes: string
//   toTime: string
//   fromTime: string
//   location: string
//   followUps: string
//   visitDate: string
//   companyName: string
//   projectName: string
//   salesPerson: string
//   customerName: string
//   liveLocation: LiveLocation
// }

// const getDayNameFromDate = (dateStr: string): string => {
//   if (!dateStr) return ''
//   try {
//     const [y, m, d] = dateStr.split('-').map(Number)
//     if (!y || !m || !d) return ''
//     const date = new Date(y, m - 1, d)
//     if (isNaN(date.getTime())) return ''
//     return date.toLocaleDateString('en-US', { weekday: 'long' })
//   } catch {
//     return ''
//   }
// }

// const generateVisitKey = (): string => {
//   const ts = Date.now()
//   const rand = Math.random().toString(36).substring(2, 9)
//   return `visit_${ts}_${rand}`
// }

// const safeParseArray = (raw: any): any[] => {
//   if (!raw) return []
//   try {
//     let val = raw
//     if (typeof val === 'string') val = JSON.parse(val)
//     if (Array.isArray(val)) return val
//     if (val && typeof val === 'object') {
//       if (Array.isArray(val.visits)) return val.visits
//       if (Array.isArray(val.data)) return val.data
//       if (Array.isArray(val.items)) return val.items
//     }
//     return []
//   } catch {
//     return []
//   }
// }

// export default function AddSiteVisitPage() {
//   const router = useRouter()

//   const [employees, setEmployees] = useState<Employee[]>([])
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
//   const [isLoadingEmployees, setIsLoadingEmployees] = useState(true)

//   const [selectedDate, setSelectedDate] = useState('')
//   const [fromTime, setFromTime] = useState('')
//   const [toTime, setToTime] = useState('')
//   const [companyName, setCompanyName] = useState('')
//   const [location, setLocation] = useState('')
//   const [customerName, setCustomerName] = useState('')
//   const [projectName, setProjectName] = useState('')
//   const [salesPerson, setSalesPerson] = useState('')
//   const [notes, setNotes] = useState('')
//   const [followUps, setFollowUps] = useState('')
//   const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null)
//   const [isFetchingLocation, setIsFetchingLocation] = useState(false)
//   const [locationError, setLocationError] = useState('')

//   // ✅ Track edit mode + existing visit key
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [existingVisitKey, setExistingVisitKey] = useState<string | null>(null)

//   const [isLoading, setIsLoading] = useState(false)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   const [otpCode, setOtpCode] = useState('')
//   const [isSendingOtp, setIsSendingOtp] = useState(false)
//   const [otpSentTo, setOtpSentTo] = useState('')
//   const [otpCountdown, setOtpCountdown] = useState(0)

//   const dayName = useMemo(() => getDayNameFromDate(selectedDate), [selectedDate])

//   useEffect(() => {
//     const now = new Date()
//     const year = now.getFullYear()
//     const month = String(now.getMonth() + 1).padStart(2, '0')
//     const day = String(now.getDate()).padStart(2, '0')
//     setSelectedDate(`${year}-${month}-${day}`)
//   }, [])

//   useEffect(() => {
//     if (otpCountdown <= 0) return
//     const t = setTimeout(() => setOtpCountdown((c) => c - 1), 1000)
//     return () => clearTimeout(t)
//   }, [otpCountdown])

//   const fetchEmployees = useCallback(async () => {
//     try {
//       setIsLoadingEmployees(true)
//       const { data, error } = await supabase
//         .from('employees')
//         .select('employee_id, full_name, department, position, source, site_visits')
//         .order('employee_id', { ascending: true })
//       if (error) throw new Error(error.message)
//       setEmployees(data || [])
//     } catch (err) {
//       console.error('Error fetching employees:', err)
//       setError('Failed to load employees')
//     } finally {
//       setIsLoadingEmployees(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchEmployees()
//   }, [fetchEmployees])

//   const resetForm = () => {
//     setFromTime('')
//     setToTime('')
//     setCompanyName('')
//     setLocation('')
//     setCustomerName('')
//     setProjectName('')
//     setSalesPerson('')
//     setNotes('')
//     setFollowUps('')
//     setLiveLocation(null)
//     setLocationError('')
//     setIsEditMode(false)
//     setExistingVisitKey(null)
//   }

//   // =====================================================
//   // ✅ WHEN EMPLOYEE OR DATE CHANGES
//   //    - if existing visit on same date → prefill + edit mode
//   //    - else → empty form + new visit mode
//   // =====================================================
//   useEffect(() => {
//     if (!selectedEmployeeId) {
//       setSelectedEmployee(null)
//       setOtpCode('')
//       setOtpSentTo('')
//       setOtpCountdown(0)
//       resetForm()
//       return
//     }

//     const emp = employees.find((e) => e.employee_id === selectedEmployeeId)
//     setSelectedEmployee(emp || null)

//     setOtpCode('')
//     setOtpSentTo('')
//     setOtpCountdown(0)
//     resetForm()

//     if (!emp) return

//     const arr = safeParseArray(emp.site_visits)

//     // ✅ Check if a visit already exists for the SELECTED DATE
//     const existing = arr.find(
//       (v: any) => String(v.visitDate || '') === String(selectedDate || '')
//     )

//     if (existing) {
//       // Prefill from existing visit for THIS date
//       setCompanyName(existing.companyName || '')
//       setCustomerName(existing.customerName || '')
//       setProjectName(existing.projectName || '')
//       setSalesPerson(existing.salesPerson || emp.full_name || '')
//       setLocation(existing.location || '')
//       setFromTime(existing.fromTime || '')
//       setToTime(existing.toTime || '')
//       setNotes(existing.notes || '')
//       setFollowUps(existing.followUps || '')
//       if (existing.liveLocation) {
//         setLiveLocation(existing.liveLocation)
//       }

//       setIsEditMode(true)
//       setExistingVisitKey(existing._key || null)

//       setSuccess(
//         `✏️ A site visit already exists for ${selectedDate}. Edit the fields below and submit to update.`
//       )
//       setTimeout(() => setSuccess(''), 5000)
//     } else {
//       // No visit for this date — new visit, only salesPerson = full name
//       setSalesPerson(emp.full_name || '')
//       setIsEditMode(false)
//       setExistingVisitKey(null)
//     }
//   }, [selectedEmployeeId, selectedDate, employees])

//   const handleRefresh = useCallback(async () => {
//     if (isRefreshing) return
//     setIsRefreshing(true)
//     setError('')
//     setSuccess('')

//     try {
//       await fetchEmployees()
//       setSuccess('Data refreshed!')
//       setTimeout(() => setSuccess(''), 2000)
//     } catch (err) {
//       console.error('Refresh error:', err)
//       setError('Failed to refresh data')
//     } finally {
//       setIsRefreshing(false)
//     }
//   }, [fetchEmployees, isRefreshing])

//   const handleGetLiveLocation = useCallback(() => {
//     if (!navigator.geolocation) {
//       setLocationError('Geolocation not supported by this browser.')
//       return
//     }
//     setIsFetchingLocation(true)
//     setLocationError('')

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const loc: LiveLocation = {
//           address: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
//           accuracy: pos.coords.accuracy,
//           latitude: pos.coords.latitude,
//           longitude: pos.coords.longitude,
//           timestamp: new Date().toISOString(),
//         }
//         setLiveLocation(loc)
//         if (!location.trim()) setLocation(loc.address)
//         setIsFetchingLocation(false)
//       },
//       (err) => {
//         console.error('Geolocation error:', err)
//         setLocationError(
//           err.code === 1 ? 'Location permission denied.' : 'Failed to fetch location.'
//         )
//         setIsFetchingLocation(false)
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
//     )
//   }, [location])

//   const handleSendOtp = useCallback(async () => {
//     if (!selectedEmployee) {
//       setError('Please select an employee first.')
//       return
//     }
//     if (isSendingOtp) return

//     setIsSendingOtp(true)
//     setError('')
//     setSuccess('')

//     try {
//       const response = await fetch('/api/hr/send-site-visit-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           employee_id: selectedEmployee.employee_id,
//           employee_name: selectedEmployee.full_name,
//         }),
//       })
//       const data = await response.json()

//       if (!response.ok || !data.success) {
//         setError(data.message || 'Failed to send verification code.')
//         return
//       }

//       setOtpSentTo(data.email_masked || '')
//       setSuccess(data.message || 'Verification code sent to HR email!')
//       setOtpCountdown(60)
//       setTimeout(() => setSuccess(''), 4000)
//     } catch (err) {
//       console.error('Send OTP error:', err)
//       setError('Failed to send verification code.')
//     } finally {
//       setIsSendingOtp(false)
//     }
//   }, [selectedEmployee, isSendingOtp])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')

//     if (!selectedEmployee) {
//       setError('Please select an employee ID')
//       return
//     }
//     if (!selectedDate) {
//       setError('Please select a date')
//       return
//     }
//     if (!fromTime.trim() || !toTime.trim() || !companyName.trim()) {
//       setError('From Time, To Time and Company Name are required.')
//       return
//     }
//     if (!otpCode || otpCode.trim().length !== 6) {
//       setError('Please enter the 6-digit verification code sent to HR email.')
//       return
//     }

//     setIsLoading(true)

//     try {
//       const liveLoc: LiveLocation = liveLocation || {
//         address: location.trim() || '',
//         accuracy: 0,
//         latitude: 0,
//         longitude: 0,
//         timestamp: new Date().toISOString(),
//       }

//       const siteVisitPayload: SiteVisitEntry = {
//         _key: existingVisitKey || generateVisitKey(),
//         _type: 'siteVisit',
//         notes: notes.trim(),
//         toTime: toTime.trim(),
//         fromTime: fromTime.trim(),
//         location: location.trim(),
//         followUps: followUps.trim(),
//         visitDate: selectedDate,
//         companyName: companyName.trim(),
//         projectName: projectName.trim(),
//         salesPerson: salesPerson.trim(),
//         customerName: customerName.trim(),
//         liveLocation: liveLoc,
//       }

//       const response = await fetch('/api/hr/add-site-visit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           employee_id: selectedEmployee.employee_id,
//           site_visit: siteVisitPayload,
//           otp_code: otpCode.trim(),
//           mode: isEditMode ? 'update' : 'insert', // ✅ mode flag
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok || !data.success) {
//         setError(data.message || 'Failed to add site visit')
//         setIsLoading(false)
//         return
//       }

//       setSuccess(
//         data.message ||
//           (isEditMode
//             ? `Site visit updated for ${selectedEmployee.full_name}!`
//             : `Site visit added for ${selectedEmployee.full_name}!`)
//       )

//       setOtpCode('')
//       setOtpSentTo('')
//       setOtpCountdown(0)
//       resetForm()
//       setTimeout(() => setSuccess(''), 4000)

//       await fetchEmployees()
//     } catch (err) {
//       console.error('Error adding site visit:', err)
//       setError('An error occurred. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <>
//       <NavbarDropdown />
//       <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
//         <div className="w-full">
//           <div className="mb-6 flex items-center justify-between gap-3">
//             <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
//               Add Site Visit
//             </h1>
//             <button
//               type="button"
//               onClick={handleRefresh}
//               disabled={isRefreshing || isLoading || !selectedEmployeeId}
//               className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
//               {isRefreshing ? 'Refreshing...' : 'Refresh'}
//             </button>
//           </div>

//           <div className="bg-white shadow-sm p-6 md:p-8 mb-6 w-full">
//             <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
//               <Plus className="w-5 h-5 text-[#0071BD]" />
//               <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">
//                 {isEditMode ? 'Edit Site Visit Entry' : 'New Site Visit Entry'}
//               </h2>
//               {isEditMode && (
//                 <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded tracking-wide uppercase flex items-center gap-1">
//                   <Pencil className="w-2.5 h-2.5" />
//                   edit mode
//                 </span>
//               )}
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* ROW 1 — Employee Info */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
//                     Employee ID *
//                   </label>
//                   <div className="relative">
//                     <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                     <select
//                       value={selectedEmployeeId}
//                       onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                       disabled={isLoadingEmployees}
//                       className="w-full pl-10 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 appearance-none"
//                     >
//                       <option value="">
//                         {isLoadingEmployees ? 'Loading...' : 'Select ID'}
//                       </option>
//                       {employees.map((emp) => (
//                         <option key={emp.employee_id} value={emp.employee_id}>
//                           {emp.employee_id}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
//                     Full Name
//                   </label>
//                   <div className="relative">
//                     <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={selectedEmployee?.full_name || ''}
//                       readOnly
//                       placeholder="Auto-filled"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
//                     Department
//                   </label>
//                   <div className="relative">
//                     <Building className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={selectedEmployee?.department || ''}
//                       readOnly
//                       placeholder="Auto-filled"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
//                     Designation
//                   </label>
//                   <div className="relative">
//                     <Briefcase className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={selectedEmployee?.position || ''}
//                       readOnly
//                       placeholder="Auto-filled"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* ROW 2 — Date + Day + From + To */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
//                     Visit Date *
//                   </label>
//                   <div className="relative">
//                     <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="date"
//                       value={selectedDate}
//                       onChange={(e) => setSelectedDate(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
//                       required
//                       disabled={isLoading}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <CalendarDays className="w-4 h-4 text-[#0071BD]" />
//                     Day
//                     <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded tracking-wide uppercase">
//                       auto
//                     </span>
//                   </label>
//                   <div className="relative">
//                     <CalendarDays className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={dayName}
//                       readOnly
//                       placeholder="Auto-filled"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm font-medium"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <Clock className="w-4 h-4 text-[#0071BD]" />
//                     From Time *
//                   </label>
//                   <div className="relative">
//                     <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="time"
//                       value={fromTime}
//                       onChange={(e) => setFromTime(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
//                       disabled={isLoading}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <Clock className="w-4 h-4 text-[#0071BD]" />
//                     To Time *
//                   </label>
//                   <div className="relative">
//                     <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="time"
//                       value={toTime}
//                       onChange={(e) => setToTime(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
//                       disabled={isLoading}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* ROW 3 — Company / Customer / Project / Sales Person */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <Briefcase className="w-4 h-4 text-[#0071BD]" />
//                     Company Name *
//                   </label>
//                   <div className="relative">
//                     <Briefcase className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={companyName}
//                       onChange={(e) => setCompanyName(e.target.value)}
//                       placeholder="e.g. Plastic"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
//                       disabled={isLoading || !selectedEmployeeId}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <Users className="w-4 h-4 text-[#0071BD]" />
//                     Customer Name
//                   </label>
//                   <div className="relative">
//                     <Users className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={customerName}
//                       onChange={(e) => setCustomerName(e.target.value)}
//                       placeholder="e.g. Daniyal"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
//                       disabled={isLoading || !selectedEmployeeId}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <FileText className="w-4 h-4 text-[#0071BD]" />
//                     Project Name
//                   </label>
//                   <div className="relative">
//                     <FileText className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={projectName}
//                       onChange={(e) => setProjectName(e.target.value)}
//                       placeholder="e.g. L T panel"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
//                       disabled={isLoading || !selectedEmployeeId}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <User className="w-4 h-4 text-[#0071BD]" />
//                     Sales Person
//                   </label>
//                   <div className="relative">
//                     <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={salesPerson}
//                       onChange={(e) => setSalesPerson(e.target.value)}
//                       placeholder="e.g. Gul Sher"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
//                       disabled={isLoading || !selectedEmployeeId}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* ROW 4 — Location + GPS */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div className="md:col-span-3">
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <MapPin className="w-4 h-4 text-[#0071BD]" />
//                     Location / Address
//                   </label>
//                   <div className="relative">
//                     <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       value={location}
//                       onChange={(e) => setLocation(e.target.value)}
//                       placeholder="e.g. Shan chowragi"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
//                       disabled={isLoading || !selectedEmployeeId}
//                     />
//                   </div>
//                   {liveLocation && (
//                     <p className="text-[10px] text-green-600 mt-1 tracking-wide flex items-center gap-1">
//                       <CheckCircle className="w-3 h-3" />
//                       GPS: {liveLocation.latitude.toFixed(5)}, {liveLocation.longitude.toFixed(5)} (±
//                       {liveLocation.accuracy.toFixed(0)}m)
//                     </p>
//                   )}
//                   {locationError && (
//                     <p className="text-[10px] text-red-600 mt-1 tracking-wide flex items-center gap-1">
//                       <AlertCircle className="w-3 h-3" />
//                       {locationError}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex items-end">
//                   <button
//                     type="button"
//                     onClick={handleGetLiveLocation}
//                     disabled={isFetchingLocation || isLoading || !selectedEmployeeId}
//                     className="w-full py-3 border border-blue-400 text-[#0071BD] bg-blue-50 hover:bg-blue-100 transition flex items-center justify-center gap-2 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isFetchingLocation ? (
//                       <Loader className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Crosshair className="w-4 h-4" />
//                     )}
//                     {isFetchingLocation ? 'Getting...' : 'Get Live Location'}
//                   </button>
//                 </div>
//               </div>

//               {/* ROW 5 — Notes + Follow Ups */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <FileText className="w-4 h-4 text-[#0071BD]" />
//                     Notes
//                   </label>
//                   <textarea
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     rows={3}
//                     placeholder="Any notes about the visit..."
//                     className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 resize-none"
//                     disabled={isLoading || !selectedEmployeeId}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
//                     <Phone className="w-4 h-4 text-[#0071BD]" />
//                     Follow Ups
//                   </label>
//                   <textarea
//                     value={followUps}
//                     onChange={(e) => setFollowUps(e.target.value)}
//                     rows={3}
//                     placeholder="Follow-up details..."
//                     className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 resize-none"
//                     disabled={isLoading || !selectedEmployeeId}
//                   />
//                 </div>
//               </div>

//               {/* OTP */}
//               <div className="bg-blue-50 border border-blue-200 p-4">
//                 <div className="flex items-center gap-2 mb-3">
//                   <ShieldCheck className="w-4 h-4 text-[#0071BD]" />
//                   <h3 className="text-xs font-bold text-gray-800 tracking-wide uppercase">
//                     HR Email Verification Required
//                   </h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <button
//                       type="button"
//                       onClick={handleSendOtp}
//                       disabled={isSendingOtp || isLoading || !selectedEmployee || otpCountdown > 0}
//                       className={`w-full py-3 border transition flex items-center justify-center gap-2 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
//                         otpSentTo
//                           ? 'border-green-300 bg-green-50 text-green-700'
//                           : 'border-[#0071BD] bg-white text-[#0071BD] hover:bg-blue-50'
//                       }`}
//                     >
//                       {isSendingOtp ? (
//                         <>
//                           <Loader className="w-4 h-4 animate-spin" />
//                           <span>Sending...</span>
//                         </>
//                       ) : otpCountdown > 0 ? (
//                         <>
//                           <CheckCircle className="w-4 h-4" />
//                           <span>Resend in {otpCountdown}s</span>
//                         </>
//                       ) : otpSentTo ? (
//                         <>
//                           <RefreshCw className="w-4 h-4" />
//                           <span>Resend Code</span>
//                         </>
//                       ) : (
//                         <>
//                           <Mail className="w-4 h-4" />
//                           <span>Send Code to HR Email</span>
//                         </>
//                       )}
//                     </button>
//                     {otpSentTo && (
//                       <p className="text-[10px] text-green-600 mt-1 tracking-wide">
//                         Code sent to HR: {otpSentTo}
//                       </p>
//                     )}
//                   </div>

//                   <div className="md:col-span-2">
//                     <div className="relative">
//                       <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input
//                         type="text"
//                         inputMode="numeric"
//                         maxLength={6}
//                         value={otpCode}
//                         onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                         placeholder="● ● ● ● ● ●"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 tracking-[0.5em] font-bold text-lg text-center"
//                         disabled={isLoading}
//                       />
//                     </div>
//                     <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
//                       Code expires in 10 minutes. Check HR email inbox (and spam folder).
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-50 border border-red-200 p-3 flex items-start gap-2">
//                   <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                   <p className="text-sm text-red-700 tracking-wide">{error}</p>
//                 </div>
//               )}

//               {success && (
//                 <div className="bg-green-50 border border-green-200 p-3 flex items-start gap-2">
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <p className="text-sm text-green-700 tracking-wide">{success}</p>
//                 </div>
//               )}

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => router.back()}
//                   disabled={isLoading}
//                   className="flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isLoading || !selectedEmployee || otpCode.trim().length !== 6}
//                   className={`flex-1 py-3 text-white transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${
//                     isEditMode
//                       ? 'bg-yellow-600 hover:bg-yellow-700'
//                       : 'bg-[#0071BD] hover:bg-[#005a96]'
//                   }`}
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader className="w-5 h-5 animate-spin" />
//                       <span>{isEditMode ? 'Updating...' : 'Saving...'}</span>
//                     </>
//                   ) : isEditMode ? (
//                     <>
//                       <Pencil className="w-4 h-4" />
//                       <span>Update Site Visit</span>
//                     </>
//                   ) : (
//                     <>
//                       <PlusCircle className="w-4 h-4" />
//                       <span>Add Site Visit</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   )
// }


// src/app/admin/attendance/site-visit/page.tsx
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
  Users,
  FileText,
  Phone,
  Crosshair,
  Pencil,
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

interface Employee {
  employee_id: string
  full_name: string
  department: string | null
  position: string | null
  source: string | null
  site_visits?: any
}

interface LiveLocation {
  address: string
  accuracy: number
  latitude: number
  longitude: number
  timestamp: string
}

interface SiteVisitEntry {
  _key: string
  _type: 'siteVisit'
  notes: string
  toTime: string
  fromTime: string
  location: string
  followUps: string
  visitDate: string
  companyName: string
  projectName: string
  salesPerson: string
  customerName: string
  liveLocation: LiveLocation
}

const getDayNameFromDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const [y, m, d] = dateStr.split('-').map(Number)
    if (!y || !m || !d) return ''
    const date = new Date(y, m - 1, d)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  } catch {
    return ''
  }
}

// ✅ Get current time in HH:MM format
const getCurrentTime = (): string => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const generateVisitKey = (): string => {
  const ts = Date.now()
  const rand = Math.random().toString(36).substring(2, 9)
  return `visit_${ts}_${rand}`
}

const safeParseArray = (raw: any): any[] => {
  if (!raw) return []
  try {
    let val = raw
    if (typeof val === 'string') val = JSON.parse(val)
    if (Array.isArray(val)) return val
    if (val && typeof val === 'object') {
      if (Array.isArray(val.visits)) return val.visits
      if (Array.isArray(val.data)) return val.data
      if (Array.isArray(val.items)) return val.items
    }
    return []
  } catch {
    return []
  }
}

export default function AddSiteVisitPage() {
  const router = useRouter()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true)

  const [selectedDate, setSelectedDate] = useState('')
  // ✅ Single submission time (auto-filled, editable)
  const [submissionTime, setSubmissionTime] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [location, setLocation] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [salesPerson, setSalesPerson] = useState('')
  const [notes, setNotes] = useState('')
  const [followUps, setFollowUps] = useState('')
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null)
  const [isFetchingLocation, setIsFetchingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')

  // ✅ Track edit mode + existing visit key
  const [isEditMode, setIsEditMode] = useState(false)
  const [existingVisitKey, setExistingVisitKey] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [otpCode, setOtpCode] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [otpSentTo, setOtpSentTo] = useState('')
  const [otpCountdown, setOtpCountdown] = useState(0)

  const dayName = useMemo(() => getDayNameFromDate(selectedDate), [selectedDate])

  // ✅ Set current date AND current time on initial load
  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    setSelectedDate(`${year}-${month}-${day}`)
    setSubmissionTime(getCurrentTime())
  }, [])

  useEffect(() => {
    if (otpCountdown <= 0) return
    const t = setTimeout(() => setOtpCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [otpCountdown])

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoadingEmployees(true)
      const { data, error } = await supabase
        .from('employees')
        .select('employee_id, full_name, department, position, source, site_visits')
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

  const resetForm = () => {
    // ✅ Reset submission time to current time
    setSubmissionTime(getCurrentTime())
    setCompanyName('')
    setLocation('')
    setCustomerName('')
    setProjectName('')
    setSalesPerson('')
    setNotes('')
    setFollowUps('')
    setLiveLocation(null)
    setLocationError('')
    setIsEditMode(false)
    setExistingVisitKey(null)
  }

  // =====================================================
  // ✅ WHEN EMPLOYEE OR DATE CHANGES
  //    - if existing visit on same date → prefill + edit mode
  //    - else → empty form + new visit mode
  // =====================================================
  useEffect(() => {
    if (!selectedEmployeeId) {
      setSelectedEmployee(null)
      setOtpCode('')
      setOtpSentTo('')
      setOtpCountdown(0)
      resetForm()
      return
    }

    const emp = employees.find((e) => e.employee_id === selectedEmployeeId)
    setSelectedEmployee(emp || null)

    setOtpCode('')
    setOtpSentTo('')
    setOtpCountdown(0)
    resetForm()

    if (!emp) return

    const arr = safeParseArray(emp.site_visits)

    // ✅ Check if a visit already exists for the SELECTED DATE
    const existing = arr.find(
      (v: any) => String(v.visitDate || '') === String(selectedDate || '')
    )

    if (existing) {
      // Prefill from existing visit for THIS date
      setCompanyName(existing.companyName || '')
      setCustomerName(existing.customerName || '')
      setProjectName(existing.projectName || '')
      setSalesPerson(existing.salesPerson || emp.full_name || '')
      setLocation(existing.location || '')
      // ✅ Prefill submission time from existing record (fallback to current)
      setSubmissionTime(existing.fromTime || getCurrentTime())
      setNotes(existing.notes || '')
      setFollowUps(existing.followUps || '')
      if (existing.liveLocation) {
        setLiveLocation(existing.liveLocation)
      }

      setIsEditMode(true)
      setExistingVisitKey(existing._key || null)

      setSuccess(
        `✏️ A site visit already exists for ${selectedDate}. Edit the fields below and submit to update.`
      )
      setTimeout(() => setSuccess(''), 5000)
    } else {
      // No visit for this date — new visit, only salesPerson = full name
      setSalesPerson(emp.full_name || '')
      setIsEditMode(false)
      setExistingVisitKey(null)
    }
  }, [selectedEmployeeId, selectedDate, employees])

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setError('')
    setSuccess('')

    try {
      await fetchEmployees()
      setSuccess('Data refreshed!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      console.error('Refresh error:', err)
      setError('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchEmployees, isRefreshing])

  const handleGetLiveLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by this browser.')
      return
    }
    setIsFetchingLocation(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: LiveLocation = {
          address: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
          accuracy: pos.coords.accuracy,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timestamp: new Date().toISOString(),
        }
        setLiveLocation(loc)
        if (!location.trim()) setLocation(loc.address)
        setIsFetchingLocation(false)
      },
      (err) => {
        console.error('Geolocation error:', err)
        setLocationError(
          err.code === 1 ? 'Location permission denied.' : 'Failed to fetch location.'
        )
        setIsFetchingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }, [location])

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
      const response = await fetch('/api/hr/send-site-visit-otp', {
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
    // ✅ Only submission time + company name are required
    if (!submissionTime.trim() || !companyName.trim()) {
      setError('Submission Time and Company Name are required.')
      return
    }
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to HR email.')
      return
    }

    setIsLoading(true)

    try {
      const liveLoc: LiveLocation = liveLocation || {
        address: location.trim() || '',
        accuracy: 0,
        latitude: 0,
        longitude: 0,
        timestamp: new Date().toISOString(),
      }

      // ✅ Use same submissionTime for both fromTime and toTime
      const siteVisitPayload: SiteVisitEntry = {
        _key: existingVisitKey || generateVisitKey(),
        _type: 'siteVisit',
        notes: notes.trim(),
        toTime: submissionTime.trim(),
        fromTime: submissionTime.trim(),
        location: location.trim(),
        followUps: followUps.trim(),
        visitDate: selectedDate,
        companyName: companyName.trim(),
        projectName: projectName.trim(),
        salesPerson: salesPerson.trim(),
        customerName: customerName.trim(),
        liveLocation: liveLoc,
      }

      const response = await fetch('/api/hr/add-site-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: selectedEmployee.employee_id,
          site_visit: siteVisitPayload,
          otp_code: otpCode.trim(),
          mode: isEditMode ? 'update' : 'insert',
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to add site visit')
        setIsLoading(false)
        return
      }

      setSuccess(
        data.message ||
          (isEditMode
            ? `Site visit updated for ${selectedEmployee.full_name}!`
            : `Site visit added for ${selectedEmployee.full_name}!`)
      )

      setOtpCode('')
      setOtpSentTo('')
      setOtpCountdown(0)
      resetForm()
      setTimeout(() => setSuccess(''), 4000)

      await fetchEmployees()
    } catch (err) {
      console.error('Error adding site visit:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <NavbarDropdown />
      <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
        <div className="w-full">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
              Add Site Visit
            </h1>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading || !selectedEmployeeId}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="bg-white shadow-sm p-6 md:p-8 mb-6 w-full">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Plus className="w-5 h-5 text-[#0071BD]" />
              <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">
                {isEditMode ? 'Edit Site Visit Entry' : 'New Site Visit Entry'}
              </h2>
              {isEditMode && (
                <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded tracking-wide uppercase flex items-center gap-1">
                  <Pencil className="w-2.5 h-2.5" />
                  edit mode
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ROW 1 — Employee Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
                    Employee ID *
                  </label>
                  <div className="relative">
                    <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      disabled={isLoadingEmployees}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 appearance-none"
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
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={selectedEmployee?.full_name || ''}
                      readOnly
                      placeholder="Auto-filled"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <Building className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={selectedEmployee?.department || ''}
                      readOnly
                      placeholder="Auto-filled"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
                    Designation
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={selectedEmployee?.position || ''}
                      readOnly
                      placeholder="Auto-filled"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* ROW 2 — Date + Day + Submission Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2">
                    Visit Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-[#0071BD]" />
                    Day
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded tracking-wide uppercase">
                      auto
                    </span>
                  </label>
                  <div className="relative">
                    <CalendarDays className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={dayName}
                      readOnly
                      placeholder="Auto-filled"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-800 cursor-not-allowed outline-none shadow-sm font-medium"
                    />
                  </div>
                </div>

                {/* ✅ Single Submission Time (auto-filled, editable) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#0071BD]" />
                    Submission Time *
                    <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded tracking-wide uppercase">
                      auto
                    </span>
                  </label>
                  <div className="relative">
                    <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={submissionTime}
                      onChange={(e) => setSubmissionTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
                    Auto-set to current time. Edit if needed.
                  </p>
                </div>
              </div>

              {/* ROW 3 — Company / Customer / Project / Sales Person */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#0071BD]" />
                    Company Name *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Plastic"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
                      disabled={isLoading || !selectedEmployeeId}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#0071BD]" />
                    Customer Name
                  </label>
                  <div className="relative">
                    <Users className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Daniyal"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
                      disabled={isLoading || !selectedEmployeeId}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0071BD]" />
                    Project Name
                  </label>
                  <div className="relative">
                    <FileText className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. L T panel"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
                      disabled={isLoading || !selectedEmployeeId}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#0071BD]" />
                    Sales Person
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={salesPerson}
                      onChange={(e) => setSalesPerson(e.target.value)}
                      placeholder="e.g. Gul Sher"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
                      disabled={isLoading || !selectedEmployeeId}
                    />
                  </div>
                </div>
              </div>

              {/* ROW 4 — Location + GPS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#0071BD]" />
                    Location / Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Shan chowragi"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900"
                      disabled={isLoading || !selectedEmployeeId}
                    />
                  </div>
                  {liveLocation && (
                    <p className="text-[10px] text-green-600 mt-1 tracking-wide flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      GPS: {liveLocation.latitude.toFixed(5)}, {liveLocation.longitude.toFixed(5)} (±
                      {liveLocation.accuracy.toFixed(0)}m)
                    </p>
                  )}
                  {locationError && (
                    <p className="text-[10px] text-red-600 mt-1 tracking-wide flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {locationError}
                    </p>
                  )}
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleGetLiveLocation}
                    disabled={isFetchingLocation || isLoading || !selectedEmployeeId}
                    className="w-full py-3 border border-blue-400 text-[#0071BD] bg-blue-50 hover:bg-blue-100 transition flex items-center justify-center gap-2 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchingLocation ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Crosshair className="w-4 h-4" />
                    )}
                    {isFetchingLocation ? 'Getting...' : 'Get Live Location'}
                  </button>
                </div>
              </div>

              {/* ROW 5 — Notes + Follow Ups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0071BD]" />
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Any notes about the visit..."
                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 resize-none"
                    disabled={isLoading || !selectedEmployeeId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#0071BD]" />
                    Follow Ups
                  </label>
                  <textarea
                    value={followUps}
                    onChange={(e) => setFollowUps(e.target.value)}
                    rows={3}
                    placeholder="Follow-up details..."
                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 resize-none"
                    disabled={isLoading || !selectedEmployeeId}
                  />
                </div>
              </div>

              {/* OTP */}
              <div className="bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#0071BD]" />
                  <h3 className="text-xs font-bold text-gray-800 tracking-wide uppercase">
                    HR Email Verification Required
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || isLoading || !selectedEmployee || otpCountdown > 0}
                      className={`w-full py-3 border transition flex items-center justify-center gap-2 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                        otpSentTo
                          ? 'border-green-300 bg-green-50 text-green-700'
                          : 'border-[#0071BD] bg-white text-[#0071BD] hover:bg-blue-50'
                      }`}
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
                    <div className="relative">
                      <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="● ● ● ● ● ●"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 tracking-[0.5em] font-bold text-lg text-center"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 tracking-wide">
                      Code expires in 10 minutes. Check HR email inbox (and spam folder).
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 tracking-wide">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 tracking-wide">{success}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !selectedEmployee || otpCode.trim().length !== 6}
                  className={`flex-1 py-3 text-white transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${
                    isEditMode
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-[#0071BD] hover:bg-[#005a96]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>{isEditMode ? 'Updating...' : 'Saving...'}</span>
                    </>
                  ) : isEditMode ? (
                    <>
                      <Pencil className="w-4 h-4" />
                      <span>Update Site Visit</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Site Visit</span>
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