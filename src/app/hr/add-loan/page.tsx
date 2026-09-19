// app/hr/add-loan/page.tsx
'use client'

import { useState, useEffect } from 'react'
import NavbarDropdown from '@/components/navbar'
import Footer from '@/components/footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import {
  User, Building, Briefcase, Globe, Calendar,
  Save, X, AlertCircle, Check, RefreshCw, IdCard, Plus, Trash2,
  Wallet, TrendingDown, Clock
} from 'lucide-react'
import { Roboto } from 'next/font/google'
import { createClient } from '@supabase/supabase-js'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

// Client-side supabase (same pattern as payroll page)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// =====================================================
// Types
// =====================================================
interface Employee {
  employee_id: string
  full_name: string
  department: string | null
  position: string | null
  source: string | null
  cnic_number: string | null
}

interface TimePeriodRow {
  month: string      // 'YYYY-MM'
  amount: number
}

export default function AddLoanPage() {
  const router = useRouter()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const [totalLoan, setTotalLoan] = useState('')
  const [timePeriods, setTimePeriods] = useState<TimePeriodRow[]>([])
  const [currentMonth, setCurrentMonth] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // =====================================================
  // Load all employees on mount (DIRECT from Supabase)
  // =====================================================
  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true)
      setError('')
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('employee_id, full_name, department, position, source, cnic_number')
          .order('employee_id', { ascending: true })

        if (error) {
          console.error('Supabase error:', error)
          setError(`Failed to load employees: ${error.message}`)
          return
        }

        setEmployees(data || [])
      } catch (err: any) {
        console.error(err)
        setError(`Failed to load employees: ${err.message || 'Unknown error'}`)
      } finally {
        setLoadingEmployees(false)
      }
    }
    loadEmployees()
  }, [])

  // =====================================================
  // When employee selected → auto-fill
  // =====================================================
  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId)
    const emp = employees.find(e => e.employee_id === employeeId) || null
    setSelectedEmployee(emp)
  }

  // =====================================================
  // Calculations
  // =====================================================
  const totalLoanNum = parseFloat(totalLoan) || 0
  const monthlyInstallment =
    timePeriods.length > 0 && totalLoanNum > 0
      ? Math.round(totalLoanNum / timePeriods.length)
      : 0

  // =====================================================
  // Time Period handlers
  // =====================================================
  const addTimePeriod = () => {
    if (!currentMonth) return
    if (timePeriods.some(tp => tp.month === currentMonth)) {
      setError('This month is already added')
      setTimeout(() => setError(''), 2500)
      return
    }
    setTimePeriods(prev =>
      [...prev, { month: currentMonth, amount: 0 }].sort((a, b) =>
        a.month.localeCompare(b.month)
      )
    )
    setCurrentMonth('')
  }

  const removeTimePeriod = (month: string) => {
    setTimePeriods(prev => prev.filter(tp => tp.month !== month))
  }

  const updateTimePeriodAmount = (month: string, amount: number) => {
    setTimePeriods(prev =>
      prev.map(tp => (tp.month === month ? { ...tp, amount } : tp))
    )
  }

  // Auto-fill months with monthly installment when totalLoan or count changes
  useEffect(() => {
    if (totalLoanNum > 0 && timePeriods.length > 0) {
      const perMonth = Math.round(totalLoanNum / timePeriods.length)
      setTimePeriods(prev =>
        prev.map(tp => ({
          ...tp,
          amount: tp.amount === 0 ? perMonth : tp.amount
        }))
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalLoanNum, timePeriods.length])

  // =====================================================
  // Validate + Submit (DIRECT to Supabase)
  // =====================================================
  const validate = () => {
    if (!selectedEmployeeId) { setError('Please select an employee'); return false }
    if (!totalLoanNum || totalLoanNum <= 0) { setError('Please enter a valid total loan amount'); return false }
    if (timePeriods.length === 0) { setError('Please add at least one time period month'); return false }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validate()) return

    try {
      setLoading(true)

      const payload = {
        user_id: selectedEmployeeId,
        employee_name: selectedEmployee?.full_name || '',
        department: selectedEmployee?.department || null,
        designation: selectedEmployee?.position || null,
        branch: selectedEmployee?.source || null,
        total_loan: totalLoanNum,
        amount_recovered: 0,
        amount_remaining: totalLoanNum,
        monthly_installment: monthlyInstallment,
        time_period: timePeriods.map(tp => ({
          month: tp.month,
          amount: Number(tp.amount) || 0
        }))
      }

      const { data, error } = await supabase
        .from('employee_loans')
        .insert(payload)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      console.log('✅ Loan created:', data)
      setSuccess('✅ Loan added successfully!')

      // Reset form
      setSelectedEmployeeId('')
      setSelectedEmployee(null)
      setTotalLoan('')
      setTimePeriods([])
      setCurrentMonth('')

      setTimeout(() => router.push('/hr/loans'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add loan')
    } finally {
      setLoading(false)
    }
  }

  const fmt = (n: number) =>
    Number.isFinite(n) ? Math.round(n).toLocaleString('en-PK') : '0'

  // =====================================================
  // Render
  // =====================================================
  return (
    <>
      <ProtectedRoute allowedUser='hr'>
        <NavbarDropdown />
        <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#0071BD] tracking-wider">Add Employee Loan</h1>
                  <p className="text-sm text-gray-500 tracking-wide mt-1">
                    Create a new loan record with monthly installments
                  </p>
                </div>
                <button
                  onClick={() => router.push('/hr/dashboard')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition tracking-wider flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 flex items-start gap-3 bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1"><p className="text-sm text-red-700 tracking-wide">{error}</p></div>
                <button onClick={() => setError('')} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 flex items-start gap-3 bg-green-50 border border-green-200">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1"><p className="text-sm text-green-700 tracking-wide">{success}</p></div>
                <button onClick={() => setSuccess('')} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="bg-white shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">

                  {/* ============ SECTION 1: EMPLOYEE ============ */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-wider mb-4">Employee Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                          Select Employee *
                        </label>
                        <div className="relative">
                          <IdCard className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            value={selectedEmployeeId}
                            onChange={(e) => handleEmployeeSelect(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                          >
                            <option value="">
                              {loadingEmployees ? 'Loading employees...' : '-- Select Employee --'}
                            </option>
                            {employees.map(emp => (
                              <option key={emp.employee_id} value={emp.employee_id}>
                                {emp.employee_id} — {emp.full_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">Employee Name</label>
                        <div className="relative">
                          <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={selectedEmployee?.full_name || ''}
                            readOnly
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-100 text-gray-700 outline-none shadow-sm tracking-wide cursor-not-allowed"
                            placeholder="Auto-filled"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">Department</label>
                        <div className="relative">
                          <Building className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={selectedEmployee?.department || ''}
                            readOnly
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-100 text-gray-700 outline-none shadow-sm tracking-wide cursor-not-allowed"
                            placeholder="Auto-filled"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">Designation</label>
                        <div className="relative">
                          <Briefcase className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={selectedEmployee?.position || ''}
                            readOnly
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-100 text-gray-700 outline-none shadow-sm tracking-wide cursor-not-allowed"
                            placeholder="Auto-filled"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">Branch</label>
                        <div className="relative">
                          <Globe className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={
                              selectedEmployee?.source === 'K' ? 'Korangi'
                              : selectedEmployee?.source === 'PQ' ? 'Port Qasim'
                              : selectedEmployee?.source || ''
                            }
                            readOnly
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-100 text-gray-700 outline-none shadow-sm tracking-wide cursor-not-allowed"
                            placeholder="Auto-filled"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ============ SECTION 2: LOAN AMOUNT ============ */}
                  <div className="pt-4 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wider mb-4">Loan Amount</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                          Total Loan Amount (PKR) *
                        </label>
                        <div className="relative">
                          <Wallet className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            inputMode="decimal"
                            value={totalLoan}
                            onChange={(e) => {
                              const cleaned = e.target.value.replace(/[^0-9.]/g, '')
                              const parts = cleaned.split('.')
                              const finalValue = parts.length > 2
                                ? parts[0] + '.' + parts.slice(1).join('')
                                : cleaned
                              setTotalLoan(finalValue)
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                            placeholder="e.g., 120000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                          Monthly Installment (Auto)
                        </label>
                        <div className="relative">
                          <TrendingDown className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={monthlyInstallment ? fmt(monthlyInstallment) : ''}
                            readOnly
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-100 text-gray-700 outline-none shadow-sm tracking-wide cursor-not-allowed font-medium"
                            placeholder="Auto-calculated"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 tracking-wide">
                          Total loan ÷ number of months
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ============ SECTION 3: TIME PERIOD ============ */}
                  <div className="pt-4 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wider mb-4">
                      Time Period (Installment Months)
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <div className="relative flex-1">
                        <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="month"
                          value={currentMonth}
                          onChange={(e) => setCurrentMonth(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addTimePeriod}
                        disabled={!currentMonth}
                        className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" /> Add Month
                      </button>
                    </div>

                    {timePeriods.length > 0 ? (
                      <div className="overflow-x-auto border border-gray-200">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (PKR)</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {timePeriods.map((tp, idx) => (
                              <tr key={tp.month} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                                <td className="px-3 py-2 text-sm text-gray-800 font-medium tracking-wide">
                                  {new Date(tp.month + '-01').toLocaleString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <input
                                    type="number"
                                    value={tp.amount}
                                    onChange={(e) =>
                                      updateTimePeriodAmount(
                                        tp.month,
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-32 px-2 py-1 text-sm text-right border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none text-black bg-yellow-50"
                                    placeholder="0"
                                  />
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeTimePeriod(tp.month)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-400 tracking-wide">No time period months added yet</p>
                        <p className="text-xs text-gray-400 tracking-wide mt-1">
                          Add months to define the loan installment schedule
                        </p>
                      </div>
                    )}

                    {totalLoanNum > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-blue-50 border border-blue-200 p-3">
                          <div className="text-xs text-blue-600 tracking-wide uppercase">Total Loan</div>
                          <div className="text-lg font-bold text-blue-700 tracking-wider">
                            Rs. {fmt(totalLoanNum)}
                          </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 p-3">
                          <div className="text-xs text-yellow-700 tracking-wide uppercase">Months</div>
                          <div className="text-lg font-bold text-yellow-800 tracking-wider">
                            {timePeriods.length}
                          </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 p-3">
                          <div className="text-xs text-green-700 tracking-wide uppercase">Monthly Installment</div>
                          <div className="text-lg font-bold text-green-800 tracking-wider">
                            Rs. {fmt(monthlyInstallment)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 p-6">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-2 bg-blue-800 text-white hover:bg-blue-900 transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {loading ? 'Saving...' : 'Save Loan'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    </>
  )
}