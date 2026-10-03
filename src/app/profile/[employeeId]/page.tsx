// app/profile/[employeeId]/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Footer from '@/components/footer'
import ProtectedEmployeeRoute from '@/components/ProtectedEmployeeRoute'
import NavbarDropdown from '@/app/Navbar/page'
import { createClient } from '@supabase/supabase-js'
import { Roboto } from 'next/font/google'
import {
  Loader,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  Heart,
  Users,
  CreditCard,
  Clock,
  FileText,
  GraduationCap,
  BadgeCheck,
  Wallet,
  ArrowLeft,
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

interface Qualification {
  degree?: string
  institute?: string
  year?: string
  [key: string]: string | undefined
}

interface Experience {
  company?: string
  position?: string
  duration?: string
  [key: string]: string | undefined
}

interface Employee {
  id: string
  employee_id: string
  full_name: string
  father_name: string | null
  phone_number: string
  emergency_contact: string | null
  marital_status: string | null
  joining_date: string | null
  department: string | null
  position: string | null
  cv_url: string | null
  qualifications: Qualification[] | null
  experience: Experience[] | null
  username: string | null
  cnic_number: string | null
  date_of_birth: string | null
  residential_address: string | null
  enable_attendance: boolean
  enable_site_visits: boolean
  shift: string | null
  remaining_leaves: number | null
  used_leaves: number | null
  gross_salary: number | null
  basic_salary: number | null
  shift_timing: string | null
  source: string | null
  email: string | null
  created_at: string
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.employeeId as string

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployee = useCallback(async () => {
    if (!employeeId) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', employeeId)
        .maybeSingle()

      if (error) throw new Error(error.message)

      if (!data) {
        setError('Employee not found')
        setLoading(false)
        return
      }

      setEmployee(data as Employee)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching employee:', err)
      setError('Failed to load profile data')
      setLoading(false)
    }
  }, [employeeId])

  useEffect(() => {
    fetchEmployee()
  }, [fetchEmployee])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    try {
      const date = new Date(dateStr + 'T00:00:00')
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'N/A'
    return `PKR ${amount.toLocaleString('en-PK')}`
  }

  const getBranchName = (source: string | null) => {
    if (source === 'PQ') return 'Port Qasim'
    if (source === 'K') return 'Korangi'
    return 'N/A'
  }

  const getShiftLabel = (shift: string | null) => {
    if (shift === 'A') return 'Shift A'
    if (shift === 'B') return 'Shift B'
    return 'N/A'
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
        <Loader className="w-12 h-12 animate-spin text-[#0071BD]" />
      </div>
    )
  }

  if (error || !employee) {
    return (
      <>
        <ProtectedEmployeeRoute allowedRole="employee">
          <NavbarDropdown />
          <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white shadow-sm p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className={`text-xl font-bold text-gray-800 mb-2 tracking-wide ${roboto.className}`}>
                  {error || 'Employee Not Found'}
                </h2>
                <p className={`text-sm text-gray-600 mb-6 tracking-wide ${roboto.className}`}>
                  Unable to load profile data. Please try again.
                </p>
                <button
                  onClick={() => router.back()}
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition tracking-wide ${roboto.className}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className={roboto.className}>Go Back</span>
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </ProtectedEmployeeRoute>
      </>
    )
  }

  return (
    <>
      <ProtectedEmployeeRoute allowedRole="employee">
        <NavbarDropdown />
        <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
          <div className="max-w-5xl mx-auto">

            <div className="mb-6 flex items-center gap-3">
              <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
                My Profile
              </h1>
            </div>

            {/* PROFILE HEADER CARD */}
            <div className="bg-white shadow-sm mb-6">
              <div className="bg-gradient-to-r from-[#0071BD] to-[#005a96] h-32 relative">
                <div className="absolute -bottom-16 left-8">
                  <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
                    <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-[#0071BD]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className={`text-2xl font-bold text-gray-800 tracking-wide ${roboto.className}`}>
                      {employee.full_name}
                    </h2>
                    <p className={`text-sm text-gray-500 mt-1 tracking-wide ${roboto.className}`}>
                      {employee.position || 'Employee'} • {employee.department || 'N/A'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${roboto.className} ${
                        employee.source === 'PQ'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        <MapPin className="w-3 h-3" />
                        {getBranchName(employee.source)}
                      </span>

                      {employee.shift && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 ${roboto.className}`}>
                          <Clock className="w-3 h-3" />
                          {getShiftLabel(employee.shift)}
                        </span>
                      )}

                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 ${roboto.className}`}>
                        <BadgeCheck className="w-3 h-3" />
                        Active
                      </span>
                    </div>
                  </div>

                  <div className={`text-right ${roboto.className}`}>
                    <p className="text-xs text-gray-400 tracking-wide">Employee ID</p>
                    <p className={`text-lg font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
                      {employee.employee_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <User className="w-5 h-5 text-[#0071BD]" />
                  <h3 className={`text-sm font-bold text-gray-800 tracking-wide uppercase ${roboto.className}`}>
                    Personal Information
                  </h3>
                </div>

                <div className="space-y-3">
                  <InfoRow label="Full Name" value={employee.full_name} icon={<User className="w-4 h-4" />} />
                  <InfoRow label="Father Name" value={employee.father_name || 'N/A'} />
                  <InfoRow label="CNIC Number" value={employee.cnic_number || 'N/A'} icon={<CreditCard className="w-4 h-4" />} />
                  <InfoRow label="Date of Birth" value={formatDate(employee.date_of_birth)} icon={<Calendar className="w-4 h-4" />} />
                  <InfoRow label="Marital Status" value={employee.marital_status || 'N/A'} icon={<Heart className="w-4 h-4" />} />
                  <InfoRow label="Username" value={employee.username || 'N/A'} />
                </div>
              </div>

              <div className="bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Phone className="w-5 h-5 text-[#0071BD]" />
                  <h3 className={`text-sm font-bold text-gray-800 tracking-wide uppercase ${roboto.className}`}>
                    Contact Information
                  </h3>
                </div>

                <div className="space-y-3">
                  <InfoRow label="Email Address" value={employee.email || 'N/A'} icon={<Mail className="w-4 h-4" />} />
                  <InfoRow label="Phone Number" value={employee.phone_number || 'N/A'} icon={<Phone className="w-4 h-4" />} />
                  <InfoRow label="Emergency Contact" value={employee.emergency_contact || 'N/A'} icon={<Users className="w-4 h-4" />} />
                  <InfoRow label="Residential Address" value={employee.residential_address || 'N/A'} icon={<MapPin className="w-4 h-4" />} />
                </div>
              </div>

              <div className="bg-white shadow-sm p-6 md:col-span-2">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Briefcase className="w-5 h-5 text-[#0071BD]" />
                  <h3 className={`text-sm font-bold text-gray-800 tracking-wide uppercase ${roboto.className}`}>
                    Employment Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <InfoRow label="Department" value={employee.department || 'N/A'} icon={<Building className="w-4 h-4" />} />
                  <InfoRow label="Position" value={employee.position || 'N/A'} icon={<Briefcase className="w-4 h-4" />} />
                  <InfoRow label="Joining Date" value={formatDate(employee.joining_date)} icon={<Calendar className="w-4 h-4" />} />
                  <InfoRow label="Branch" value={getBranchName(employee.source)} icon={<MapPin className="w-4 h-4" />} />
                  <InfoRow label="Shift" value={getShiftLabel(employee.shift)} icon={<Clock className="w-4 h-4" />} />
                  <InfoRow label="Shift Timing" value={employee.shift_timing || 'N/A'} icon={<Clock className="w-4 h-4" />} />
                </div>
              </div>
            </div>

            {/* SALARY INFORMATION */}
            <div className="bg-white shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <Wallet className="w-5 h-5 text-[#0071BD]" />
                <h3 className={`text-sm font-bold text-gray-800 tracking-wide uppercase ${roboto.className}`}>
                  Salary Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className={`text-sm text-gray-600 tracking-wide ${roboto.className}`}>
                    Basic Salary
                  </span>
                  <span className={`text-base font-semibold text-gray-800 ${roboto.className}`}>
                    {formatCurrency(employee.basic_salary)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 md:border-l md:border-gray-100 md:pl-8">
                  <span className={`text-sm text-gray-600 tracking-wide ${roboto.className}`}>
                    Gross Salary
                  </span>
                  <span className={`text-base font-bold text-[#0071BD] ${roboto.className}`}>
                    {formatCurrency(employee.gross_salary)}
                  </span>
                </div>
              </div>
            </div>

            {/* QUALIFICATIONS */}
            {employee.qualifications && employee.qualifications.length > 0 && (
              <div className="bg-white shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <GraduationCap className="w-5 h-5 text-[#0071BD]" />
                  <h3 className={`text-sm font-bold text-gray-800 tracking-wide uppercase ${roboto.className}`}>
                    Qualifications
                  </h3>
                </div>

                <div className="space-y-3">
                  {employee.qualifications.map((qual, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-100 p-4">
                      <p className={`text-sm font-semibold text-gray-800 tracking-wide ${roboto.className}`}>
                        {qual.degree || 'N/A'}
                      </p>
                      <p className={`text-xs text-gray-500 mt-1 tracking-wide ${roboto.className}`}>
                        {qual.institute || 'N/A'} {qual.year ? `• ${qual.year}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCE */}
            {employee.experience && employee.experience.length > 0 && (
              <div className="bg-white shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Briefcase className="w-5 h-5 text-[#0071BD]" />
                  <h3 className={`text-sm font-bold text-gray-800 tracking-wide uppercase ${roboto.className}`}>
                    Experience
                  </h3>
                </div>

                <div className="space-y-3">
                  {employee.experience.map((exp, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-100 p-4">
                      <p className={`text-sm font-semibold text-gray-800 tracking-wide ${roboto.className}`}>
                        {exp.position || 'N/A'}
                      </p>
                      <p className={`text-xs text-gray-500 mt-1 tracking-wide ${roboto.className}`}>
                        {exp.company || 'N/A'} {exp.duration ? `• ${exp.duration}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CV / RESUME */}
            {employee.cv_url && (
              <div className="bg-white shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <FileText className="w-5 h-5 text-[#0071BD]" />
                  <h3 className={`text-sm font-bold text-gray-800 tracking-wide uppercase ${roboto.className}`}>
                    Resume / CV
                  </h3>
                </div>

                <a
                  href={employee.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition tracking-wide ${roboto.className}`}
                >
                  <FileText className="w-4 h-4" />
                  <span className={roboto.className}>View / Download CV</span>
                </a>
              </div>
            )}

          </div>
        </div>
        <Footer />
      </ProtectedEmployeeRoute>
    </>
  )
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
        <span className={`text-sm text-gray-600 tracking-wide ${roboto.className}`}>
          {label}
        </span>
      </div>

      <span className={`text-sm font-medium text-gray-800 text-right break-words max-w-[60%] ${roboto.className}`}>
        {value}
      </span>
    </div>
  )
}