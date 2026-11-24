// app/hr/employees/page.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import NavbarDropdown from '@/components/dnavbar'
import Footer from '@/components/footer'
import { useRouter } from 'next/navigation'
import DirectorProtectedRoute from '@/components/DirectorProtectedRoute'
import {
  Search, User, Phone, Briefcase, Eye, Edit, Trash2, RefreshCw, AlertCircle,
  Loader, ChevronLeft, ChevronRight, Users, FileText, UserPlus, Filter, X, Save,
  UserCheck, Download
} from 'lucide-react'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const SHIFT_TIMINGS: Record<string, string> = {
  A: '09:00 AM - 06:00 PM',
  B: '09:00 AM - 05:30 PM',
  C: '06:00 PM - 11:00 PM',
}

interface Employee {
  id: string
  employee_id: string
  full_name: string
  father_name: string
  cnic_number: string
  phone_number: string
  emergency_contact: string
  date_of_birth: string
  marital_status: string
  residential_address: string
  joining_date: string
  department: string
  position: string
  source: string
  shift: string
  shift_timing: string
  gross_salary: string
  basic_salary: string
  username: string
  password: string
  qualifications: Array<{ degree: string; institution: string; year: string; grade: string }>
  experience: Array<{ company: string; position: string; fromDate: string; toDate: string; description: string }>
  cv_url: string
  created_at: string
  updated_at: string
}

export default function EmployeesPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('') // ✅ modal ke andar error
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [editCvFile, setEditCvFile] = useState<File | null>(null)
  const [editCvFileName, setEditCvFileName] = useState('')
  const [editCvUploading, setEditCvUploading] = useState(false)
  const [editCvUploaded, setEditCvUploaded] = useState(false)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const itemsPerPage = 10
  const fetchedRef = useRef(false)

  const getFullCVUrl = (cvUrl: string): string | null => {
    if (!cvUrl) return null
    if (cvUrl.startsWith('http://') || cvUrl.startsWith('https://')) return cvUrl
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) return null
    return `${supabaseUrl}/storage/v1/object/public/CVS/${cvUrl.replace(/^\/+/, '')}`
  }

  const handleViewCV = (employee: Employee) => {
    if (!employee.cv_url) return alert('No CV uploaded for this employee')
    const publicUrl = getFullCVUrl(employee.cv_url)
    if (publicUrl) window.open(publicUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDownloadCV = (employee: Employee) => {
    if (!employee.cv_url) return alert('No CV uploaded for this employee')
    const publicUrl = getFullCVUrl(employee.cv_url)
    if (!publicUrl) return
    const link = document.createElement('a')
    link.href = publicUrl
    link.target = '_blank'
    link.download = employee.full_name
      ? `${employee.full_name.replace(/\s+/g, '_')}_CV.pdf`
      : `employee_${employee.employee_id || 'unknown'}_CV.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const uploadEditCV = async (file: File): Promise<string> => {
    try {
      setEditCvUploading(true)
      setEditCvUploaded(false)
      const formData = new FormData()
      formData.append('file', file)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      const response = await fetch('/api/upload-cv', { method: 'POST', body: formData, signal: controller.signal })
      clearTimeout(timeoutId)
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Server returned invalid response')
      }
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.error || 'Failed to upload CV')
      setEditCvUploaded(true)
      return result.url
    } catch (error) {
      throw error
    } finally {
      setEditCvUploading(false)
    }
  }

  const handleEditCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') { setEditError('Please upload a PDF file'); return }
      if (file.size > 10 * 1024 * 1024) { setEditError('File size must be less than 10MB'); return }
      setEditError('')
      setEditCvFile(file)
      setEditCvFileName(file.name)
      setEditCvUploaded(false)
    }
  }

  const removeEditCV = () => {
    setEditCvFile(null)
    setEditCvFileName('')
    setEditCvUploaded(false)
    if (editFileInputRef.current) editFileInputRef.current.value = ''
  }

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/hr/employees', { cache: 'no-store' })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch employees')
      }

      setEmployees(data.employees || [])
      setFilteredEmployees(data.employees || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true
      fetchEmployees()
    }
  }, [fetchEmployees])

  const departments = ['all', ...Array.from(new Set(employees.map(emp => emp.department).filter(Boolean)))]

  useEffect(() => {
    let filtered = employees
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(emp =>
        emp.full_name?.toLowerCase().includes(term) ||
        emp.employee_id?.toLowerCase().includes(term) ||
        emp.department?.toLowerCase().includes(term) ||
        emp.position?.toLowerCase().includes(term) ||
        emp.phone_number?.includes(term) ||
        emp.cnic_number?.includes(term)
      )
    }
    if (selectedDepartment !== 'all') filtered = filtered.filter(emp => emp.department === selectedDepartment)
    setFilteredEmployees(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedDepartment, employees])

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return 'Invalid Date'
    }
  }

  const handleEditChange = (field: keyof Employee, value: string) => {
    if (!editingEmployee) return
    setEditingEmployee({ ...editingEmployee, [field]: value })
  }

  const handleEditShiftChange = (shift: string) => {
    if (!editingEmployee) return
    setEditingEmployee({
      ...editingEmployee,
      shift,
      shift_timing: shift ? SHIFT_TIMINGS[shift] || '' : '',
    })
  }

  const openEditModal = (employee: Employee) => {
    setEditingEmployee({
      ...employee,
      source: employee.source || 'PQ',
      shift: employee.shift || '',
      shift_timing: employee.shift_timing || (employee.shift ? SHIFT_TIMINGS[employee.shift] || '' : ''),
    })
    setEditCvFile(null)
    setEditCvFileName('')
    setEditCvUploaded(false)
    setEditError('')
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEmployee) return
    try {
      setEditLoading(true)
      setEditError('')
      setSuccess('')

      let cvUrl = editingEmployee.cv_url
      if (editCvFile) cvUrl = await uploadEditCV(editCvFile)

      const res = await fetch('/api/hr/employees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEmployee.id,
          employeeId: editingEmployee.employee_id,
          fullName: editingEmployee.full_name,
          fatherName: editingEmployee.father_name,
          cnicNumber: editingEmployee.cnic_number,
          phoneNumber: editingEmployee.phone_number,
          department: editingEmployee.department,
          position: editingEmployee.position,
          shift: editingEmployee.shift,
          shiftTiming: editingEmployee.shift_timing,
          source: editingEmployee.source,
          cvUrl: cvUrl,
          emergencyContact: editingEmployee.emergency_contact,
          dateOfBirth: editingEmployee.date_of_birth,
          maritalStatus: editingEmployee.marital_status,
          residentialAddress: editingEmployee.residential_address,
          joiningDate: editingEmployee.joining_date,
        }),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to update employee')
      }

      setSuccess('Employee updated successfully!')
      await fetchEmployees()
      setShowEditModal(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      // ✅ error modal ke andar dikhega aur gayab nahi hoga
      setEditError(err instanceof Error ? err.message : 'Failed to update employee')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return
    try {
      setDeleteId(employeeId)
      setDeleteLoading(true)
      setError('')
      setSuccess('')

      const res = await fetch(`/api/hr/employees?id=${employeeId}`, { method: 'DELETE' })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error || 'Failed to delete employee')

      setSuccess('Employee deleted successfully!')
      await fetchEmployees()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee')
      setTimeout(() => setError(''), 5000)
    } finally {
      setDeleteLoading(false)
      setDeleteId(null)
    }
  }

  if (loading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader className="w-12 h-12 animate-spin text-[#0071BD]" />
      </div>
    )
  }

  return (
    <DirectorProtectedRoute allowedUser="director">
      <NavbarDropdown />
      <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
        <div className="max-w-7xl mx-auto">

          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0071BD] tracking-wider">Employee Management</h1>
              <p className="text-sm text-gray-500 tracking-wide mt-1">Manage all employees and their details</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setLoading(true); fetchEmployees() }} className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
              <button onClick={() => router.push('/hr/add-employee')} className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Add Employee
              </button>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 flex items-start gap-3 bg-green-50 border border-green-200">
              <UserCheck className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="flex-1"><p className="text-sm text-green-700">{success}</p></div>
              <button onClick={() => setSuccess('')} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 flex items-start gap-3 bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1"><p className="text-sm text-red-700">{error}</p></div>
              <button onClick={() => setError('')} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
          )}

          <div className="bg-white shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black" />
              </div>
              <div className="flex text-black items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none min-w-[150px]">
                  {departments.map((dept) => <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>)}
                </select>
              </div>
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="bg-white shadow-sm p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No employees found</p>
            </div>
          ) : (
            <div className="bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Position</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Shift</th>
                      <th className="px-4 py-3">CV</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0071BD]/10 flex items-center justify-center"><User className="w-5 h-5 text-[#0071BD]" /></div>
                            <div>
                              <p className="font-medium text-gray-800">{employee.full_name || 'N/A'}</p>
                              <p className="text-xs text-gray-400">Joined: {formatDate(employee.joining_date)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{employee.employee_id || 'N/A'}</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">{employee.department || 'N/A'}</span></td>
                        <td className="px-4 py-3 text-sm text-gray-600">{employee.position || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-gray-600 flex items-center gap-1"><Phone className="w-3 h-3" />{employee.phone_number || 'N/A'}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1"><FileText className="w-3 h-3" />{employee.cnic_number || 'N/A'}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {employee.shift ? (
                            <div>
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded border border-purple-200">Shift {employee.shift}</span>
                              <p className="text-[10px] text-gray-500 mt-1">{employee.shift_timing || '-'}</p>
                            </div>
                          ) : <span className="text-xs text-gray-400">No Shift</span>}
                        </td>

                        <td className="px-4 py-3">
                          {employee.cv_url ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleViewCV(employee)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                              <button onClick={() => handleDownloadCV(employee)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Download className="w-4 h-4" /></button>
                            </div>
                          ) : <span className="text-xs text-gray-400">No CV</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setSelectedEmployee(employee); setShowDetailsModal(true) }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => openEditModal(employee)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteEmployee(employee.id)} disabled={deleteLoading && deleteId === employee.id} className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50">
                              {deleteLoading && deleteId === employee.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                  <div className="text-sm text-gray-500">Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees</div>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="px-4 py-2 text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0071BD]/10 flex items-center justify-center"><User className="w-6 h-6 text-[#0071BD]" /></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 tracking-wider">Employee Details</h2>
                  <p className="text-sm text-gray-500">{selectedEmployee.full_name || 'Employee'}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 tracking-wider mb-4 flex items-center gap-2"><User className="w-5 h-5 text-[#0071BD]" /> Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-lg">
                  <div><p className="text-xs text-gray-500">Employee ID</p><p className="font-medium text-gray-800">{selectedEmployee.employee_id || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Full Name</p><p className="font-medium text-gray-800">{selectedEmployee.full_name || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Father Name</p><p className="font-medium text-gray-800">{selectedEmployee.father_name || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">CNIC</p><p className="font-medium text-gray-800">{selectedEmployee.cnic_number || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium text-gray-800">{selectedEmployee.phone_number || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Emergency Contact</p><p className="font-medium text-gray-800">{selectedEmployee.emergency_contact || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Date of Birth</p><p className="font-medium text-gray-800">{formatDate(selectedEmployee.date_of_birth)}</p></div>
                  <div><p className="text-xs text-gray-500">Marital Status</p><p className="font-medium text-gray-800">{selectedEmployee.marital_status || 'N/A'}</p></div>
                  <div className="md:col-span-2"><p className="text-xs text-gray-500">Residential Address</p><p className="font-medium text-gray-800">{selectedEmployee.residential_address || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Joining Date</p><p className="font-medium text-gray-800">{formatDate(selectedEmployee.joining_date)}</p></div>
                  <div><p className="text-xs text-gray-500">Department</p><p className="font-medium text-gray-800">{selectedEmployee.department || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Position</p><p className="font-medium text-gray-800">{selectedEmployee.position || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Branch</p><p className="font-medium text-gray-800">{selectedEmployee.source === 'K' ? 'Korangi' : selectedEmployee.source === 'PQ' ? 'Port Qasim' : 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Username</p><p className="font-medium text-gray-800">{selectedEmployee.username || 'N/A'}</p></div>

                  <div><p className="text-xs text-gray-500">Shift</p><p className="font-medium text-gray-800">{selectedEmployee.shift || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Shift Timing</p><p className="font-medium text-gray-800">{selectedEmployee.shift_timing || 'N/A'}</p></div>

                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">CV / Resume</p>
                    {selectedEmployee.cv_url ? (
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <button onClick={() => handleViewCV(selectedEmployee)} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 text-sm rounded"><Eye className="w-4 h-4" /> View CV</button>
                        <button onClick={() => handleDownloadCV(selectedEmployee)} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm rounded"><Download className="w-4 h-4" /> Download CV</button>
                      </div>
                    ) : <p className="text-sm text-gray-400 mt-1">No CV uploaded</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center"><Edit className="w-6 h-6 text-green-600" /></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 tracking-wider">Edit Employee</h2>
                  <p className="text-sm text-gray-500">Update employee information</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6 text-gray-500" /></button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="p-6 space-y-4">

                {/* ✅ Error modal ke andar */}
                {editError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <p className="text-sm text-red-700 flex-1">{editError}</p>
                    <button type="button" onClick={() => setEditError('')} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                  </div>
                )}

                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-[#0071BD]" /> Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label><input type="text" value={editingEmployee.employee_id || ''} onChange={(e) => handleEditChange('employee_id', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={editingEmployee.full_name || ''} onChange={(e) => handleEditChange('full_name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Father Name</label><input type="text" value={editingEmployee.father_name || ''} onChange={(e) => handleEditChange('father_name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">CNIC *</label><input type="text" value={editingEmployee.cnic_number || ''} onChange={(e) => handleEditChange('cnic_number', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="text" value={editingEmployee.phone_number || ''} onChange={(e) => handleEditChange('phone_number', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label><input type="text" value={editingEmployee.emergency_contact || ''} onChange={(e) => handleEditChange('emergency_contact', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">DOB</label><input type="date" value={editingEmployee.date_of_birth || ''} onChange={(e) => handleEditChange('date_of_birth', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" /></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                      <select value={editingEmployee.marital_status || ''} onChange={(e) => handleEditChange('marital_status', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded">
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea value={editingEmployee.residential_address || ''} onChange={(e) => handleEditChange('residential_address', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" rows={2} /></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#0071BD]" /> Work Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label><input type="date" value={editingEmployee.joining_date || ''} onChange={(e) => handleEditChange('joining_date', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" /></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select value={editingEmployee.department || ''} onChange={(e) => handleEditChange('department', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded">
                        <option value="">Select</option>
                        {['Assembly', 'Mechanical', 'Electrical', 'Store', 'Copper', 'Office Staff', 'Finance', 'Sales & Marketing', 'IT', 'Other Staff'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Position</label><input type="text" value={editingEmployee.position || ''} onChange={(e) => handleEditChange('position', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded" /></div>

                    {/* ✅ Branch (source) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                      <select value={editingEmployee.source || 'PQ'} onChange={(e) => handleEditChange('source', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded">
                        <option value="K">Korangi</option>
                        <option value="PQ">Port Qasim</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                      <select value={editingEmployee.shift || ''} onChange={(e) => handleEditShiftChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] outline-none text-black rounded">
                        <option value="">Select Shift</option>
                        <option value="A">A (Morning)</option>
                        <option value="B">B (Evening)</option>
                        <option value="C">C (Night)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shift Timing</label>
                      <input type="text" value={editingEmployee.shift_timing || ''} readOnly disabled className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-600 rounded" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-[#0071BD]" /> CV / Resume</h3>
                  <input ref={editFileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleEditCVUpload} className="hidden" />
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => editFileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 flex items-center gap-2 rounded"><FileText className="w-4 h-4" /> Choose PDF</button>
                    {editCvFileName && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700 truncate max-w-[200px]">{editCvFileName}</span>
                        <button type="button" onClick={removeEditCV} className="text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    )}
                    {!editCvFileName && !editingEmployee.cv_url && <span className="text-sm text-gray-500">No file selected</span>}
                  </div>
                  {editCvUploading && <p className="text-sm text-blue-600 mt-2 flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Uploading...</p>}
                </div>
              </div>

              <div className="border-t border-gray-200 p-4 flex justify-end gap-3 bg-gray-50">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={editLoading || editCvUploading} className="px-6 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] flex items-center gap-2 rounded disabled:opacity-50">
                  {editLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </DirectorProtectedRoute>
  )
}