// app/hr/add-loan/page.tsx
'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import NavbarDropdown from '@/components/navbar'
import Footer from '@/components/footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import {
  User, Building, Briefcase, Globe, Calendar,
  Save, X, AlertCircle, Check, RefreshCw, IdCard, Plus, Trash2,
  Wallet, TrendingDown, Clock, Search
} from 'lucide-react'
import { Roboto } from 'next/font/google'
import { createClient } from '@supabase/supabase-js'

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
interface Employee {
  employee_id: string
  full_name: string
  department: string | null
  position: string | null
  source: string | null
  cnic_number: string | null
}

interface TimePeriodRow {
  month: string      // 'YYYY-MM' (kept for ordering/storage)
  amount: number
}

// =====================================================
// Helper: Generate all months between fromMonth and toMonth (inclusive)
// =====================================================
const generateMonthsRange = (fromMonth: string, toMonth: string): string[] => {
  if (!fromMonth || !toMonth) return []
  if (fromMonth > toMonth) return []

  const [fromY, fromM] = fromMonth.split('-').map(Number)
  const [toY, toM] = toMonth.split('-').map(Number)

  const months: string[] = []
  let y = fromY
  let m = fromM

  while (y < toY || (y === toY && m <= toM)) {
    months.push(`${y}-${String(m).padStart(2, '0')}`)
    m++
    if (m > 12) {
      m = 1
      y++
    }
  }
  return months
}

// =====================================================
// Helper: Split total amount equally across N months
// =====================================================
const splitAmountEvenly = (total: number, months: number): number[] => {
  if (months <= 0 || total <= 0) return new Array(Math.max(months, 0)).fill(0)

  const totalPaisa = Math.round(total * 100)
  const basePaisa = Math.floor(totalPaisa / months)
  const remainderPaisa = totalPaisa - basePaisa * months

  const result: number[] = []
  for (let i = 0; i < months; i++) {
    const paisa = basePaisa + (i < remainderPaisa ? 1 : 0)
    result.push(paisa / 100)
  }
  return result
}

// =====================================================
// Helper: Convert number to ordinal (1st, 2nd, 3rd, 4th, 5th...)
// =====================================================
const toOrdinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function AddLoanPage() {
  const router = useRouter()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)

  // ✅ Search state for employee picker
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const [totalLoan, setTotalLoan] = useState('')
  const [fromMonth, setFromMonth] = useState('')
  const [toMonth, setToMonth] = useState('')
  const [timePeriods, setTimePeriods] = useState<TimePeriodRow[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const skipAutoFillRef = useRef(false)

  // =====================================================
  // Load all employees on mount
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
  // Close dropdown when clicking outside
  // =====================================================
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // =====================================================
  // Filtered employees based on search (ID or Name)
  // =====================================================
  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.trim().toLowerCase()
    if (!q) return employees
    return employees.filter(emp =>
      emp.employee_id.toLowerCase().includes(q) ||
      (emp.full_name || '').toLowerCase().includes(q)
    )
  }, [employees, employeeSearch])

  // =====================================================
  // When employee selected → auto-fill ALL details
  // =====================================================
  const handleEmployeeSelect = (emp: Employee) => {
    setSelectedEmployeeId(emp.employee_id)
    setSelectedEmployee(emp)
    setEmployeeSearch(`${emp.employee_id} — ${emp.full_name}`)
    setShowDropdown(false)
  }

  const handleClearEmployee = () => {
    setSelectedEmployeeId('')
    setSelectedEmployee(null)
    setEmployeeSearch('')
  }

  // =====================================================
  // Calculations
  // =====================================================
  const totalLoanNum = parseFloat(totalLoan) || 0
  const monthlyInstallment =
    timePeriods.length > 0 && totalLoanNum > 0
      ? Math.round((totalLoanNum / timePeriods.length) * 100) / 100
      : 0

  // =====================================================
  // AUTO-GENERATE MONTHS when fromMonth / toMonth changes
  // =====================================================
  useEffect(() => {
    if (!fromMonth || !toMonth) {
      setTimePeriods([])
      return
    }

    if (fromMonth > toMonth) {
      setError('From month cannot be after To month')
      setTimeout(() => setError(''), 2500)
      setTimePeriods([])
      return
    }

    const months = generateMonthsRange(fromMonth, toMonth)
    const amounts = splitAmountEvenly(totalLoanNum, months.length)
    const rows: TimePeriodRow[] = months.map((m, idx) => ({
      month: m,
      amount: amounts[idx] ?? 0
    }))

    skipAutoFillRef.current = true
    setTimePeriods(rows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromMonth, toMonth])

  // =====================================================
  // AUTO-FILL: when total loan changes, re-split across months
  // =====================================================
  useEffect(() => {
    if (skipAutoFillRef.current) {
      skipAutoFillRef.current = false
      return
    }

    if (timePeriods.length === 0) return

    if (totalLoanNum > 0) {
      setTimePeriods(prev => {
        const amounts = splitAmountEvenly(totalLoanNum, prev.length)
        return prev.map((tp, idx) => ({ ...tp, amount: amounts[idx] ?? 0 }))
      })
    } else {
      setTimePeriods(prev => prev.map(tp => ({ ...tp, amount: 0 })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalLoanNum])

  const removeTimePeriod = (month: string) => {
    const newList = timePeriods.filter(tp => tp.month !== month)
    const amounts = splitAmountEvenly(totalLoanNum, newList.length)
    const filled = newList.map((tp, idx) => ({ ...tp, amount: amounts[idx] ?? 0 }))

    skipAutoFillRef.current = true
    setTimePeriods(filled)
  }

  const updateTimePeriodAmount = (month: string, amount: number) => {
    skipAutoFillRef.current = true
    setTimePeriods(prev =>
      prev.map(tp => (tp.month === month ? { ...tp, amount } : tp))
    )
  }

  // =====================================================
  // Validate + Submit
  // =====================================================
  const validate = () => {
    if (!selectedEmployeeId) { setError('Please select an employee'); return false }
    if (!totalLoanNum || totalLoanNum <= 0) { setError('Please enter a valid total loan amount'); return false }
    if (!fromMonth || !toMonth) { setError('Please select From and To month'); return false }
    if (fromMonth > toMonth) { setError('From month cannot be after To month'); return false }
    if (timePeriods.length === 0) { setError('No installments generated'); return false }

    const sumPaisa = Math.round(
      timePeriods.reduce((s, tp) => s + (Number(tp.amount) || 0), 0) * 100
    )
    const totalPaisa = Math.round(totalLoanNum * 100)

    if (sumPaisa !== totalPaisa) {
      setError(
        `Installment sum (Rs. ${(sumPaisa / 100).toFixed(2)}) must equal total loan (Rs. ${totalLoanNum.toFixed(2)})`
      )
      return false
    }
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
        time_period: timePeriods.map((tp, idx) => ({
          installment: toOrdinal(idx + 1),
          month: tp.month,
          amount: Number(tp.amount) || 0
        }))
      }

      const { data, error } = await supabase
        .from('employee_loans')
        .insert(payload)
        .select()
        .single()

      if (error) throw new Error(error.message)

      console.log('✅ Loan created:', data)
      setSuccess('✅ Loan added successfully!')

      setSelectedEmployeeId('')
      setSelectedEmployee(null)
      setEmployeeSearch('')
      setTotalLoan('')
      setFromMonth('')
      setToMonth('')
      setTimePeriods([])

      setTimeout(() => router.push('/hr/loans'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add loan')
    } finally {
      setLoading(false)
    }
  }

  const fmt = (n: number) =>
    Number.isFinite(n)
      ? n.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '0.00'

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

                      {/* ✅ Searchable employee picker */}
                      <div className="md:col-span-2" ref={dropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                          Search Employee (by ID or Name) *
                        </label>
                        <div className="relative">
                          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={employeeSearch}
                            onChange={(e) => {
                              setEmployeeSearch(e.target.value)
                              setShowDropdown(true)
                              if (!e.target.value) handleClearEmployee()
                            }}
                            onFocus={() => setShowDropdown(true)}
                            placeholder={loadingEmployees ? 'Loading employees...' : 'Type employee ID or name...'}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                          />
                          {employeeSearch && (
                            <button
                              type="button"
                              onClick={handleClearEmployee}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {showDropdown && (
                          <div className="relative">
                            <div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto bg-white border border-gray-200 shadow-lg">
                              {filteredEmployees.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500">
                                  No employees found
                                </div>
                              ) : (
                                filteredEmployees.slice(0, 200).map(emp => (
                                  <button
                                    key={emp.employee_id}
                                    type="button"
                                    onClick={() => handleEmployeeSelect(emp)}
                                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition border-b border-gray-100 last:border-b-0 ${
                                      selectedEmployeeId === emp.employee_id ? 'bg-blue-50' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-medium text-gray-800">
                                          {emp.employee_id} — {emp.full_name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                          {emp.department || '-'} • {emp.position || '-'}
                                        </div>
                                      </div>
                                      {selectedEmployeeId === emp.employee_id && (
                                        <Check className="w-4 h-4 text-[#0071BD]" />
                                      )}
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">Employee ID</label>
                        <div className="relative">
                          <IdCard className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={selectedEmployee?.employee_id || ''}
                            readOnly
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-100 text-gray-700 outline-none shadow-sm tracking-wide cursor-not-allowed"
                            placeholder="Auto-filled"
                          />
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">CNIC</label>
                        <div className="relative">
                          <IdCard className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={selectedEmployee?.cnic_number || ''}
                            readOnly
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-100 text-gray-700 outline-none shadow-sm tracking-wide cursor-not-allowed"
                            placeholder="Auto-filled"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ============ SECTION 2: LOAN AMOUNT + TIME RANGE ============ */}
                  <div className="pt-4 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wider mb-4">Loan Amount & Time Period</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
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
                          From Month *
                        </label>
                        <div className="relative">
                          <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="month"
                            value={fromMonth}
                            onChange={(e) => setFromMonth(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 tracking-wide mb-1">
                          To Month *
                        </label>
                        <div className="relative">
                          <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="month"
                            value={toMonth}
                            min={fromMonth || undefined}
                            onChange={(e) => setToMonth(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
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
                          Total loan ÷ number of installments
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ============ SECTION 3: GENERATED INSTALLMENTS ============ */}
                  <div className="pt-4 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wider mb-4">
                      Installments
                    </h2>

                    {timePeriods.length > 0 ? (
                      <div className="overflow-x-auto border border-gray-200">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Installment</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (PKR)</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {timePeriods.map((tp, idx) => (
                              <tr key={tp.month} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                                <td className="px-3 py-2 text-sm text-gray-800 font-medium tracking-wide">
                                  {toOrdinal(idx + 1)} Installment
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={tp.amount}
                                    onChange={(e) =>
                                      updateTimePeriodAmount(
                                        tp.month,
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-32 px-2 py-1 text-sm text-right border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none text-black bg-yellow-50"
                                    placeholder="0.00"
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
                        <p className="text-gray-400 tracking-wide">
                          {fromMonth && toMonth
                            ? 'No installments generated — check your range'
                            : 'Select From and To month to generate installments'}
                        </p>
                        <p className="text-xs text-gray-400 tracking-wide mt-1">
                          Installments will be auto-divided across the selected range
                        </p>
                      </div>
                    )}

                    {totalLoanNum > 0 && timePeriods.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-blue-50 border border-blue-200 p-3">
                          <div className="text-xs text-blue-600 tracking-wide uppercase">Total Loan</div>
                          <div className="text-lg font-bold text-blue-700 tracking-wider">
                            Rs. {fmt(totalLoanNum)}
                          </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 p-3">
                          <div className="text-xs text-yellow-700 tracking-wide uppercase">Installments</div>
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