// app/hr/payroll/[employeeId]/page.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Footer from '@/components/footer'
import ProtectedEmployeeRoute from '@/components/ProtectedEmployeeRoute'
import NavbarDropdown from '@/app/Navbar/page'
import { createClient } from '@supabase/supabase-js'
import {
  Loader,
  AlertCircle,
  Printer,
  Database,
  X,
  CheckCircle2,
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
interface PayrollRecord {
  id: number
  employee_id: string
  name: string
  designation: string
  cnic: string
  total_increase: number | null
  gross: number | null
  total_gross_after_increa: number | null
  basic_salary: number | null
  per_month_salary: number | null
  per_day: number | null
  present_day: number | null
  present_amount: number | null
  absent_day: number | null
  absent_amount: number | null
  approvl_lvn: number | null
  total_salary_days: number | null
  duty_hours: number | null
  pr_hours: number | null
  total_month_hours: number | null
  late_hours: number | null
  late_hour_amount: number | null
  salary_exp: number | null
  approvl_lvn_2: number | null
  over_time_hour: number | null
  over_time: number | null
  hold_salary: number | null
  deduct_health_insurance: number | null
  total_salary: number | null
  loan: number | null
  adv_salary: number | null
  income_tax: number | null
  net_salary_payable: number | null
  month_year: string | null
  created_at: string
  updated_at: string
}

// =====================================================
// Helpers
// =====================================================
const round2 = (n: number) => (!Number.isFinite(n) ? 0 : Math.round(n))
const fmt = (n: number | null | undefined) => round2(Number(n) ?? 0).toString()

const getMonthLabel = (monthYear: string | null) => {
  if (!monthYear) return 'N/A'
  const d = new Date(monthYear)
  if (isNaN(d.getTime())) return 'Invalid Date'
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// =====================================================
// Page
// =====================================================
export default function EmployeePayrollPage() {
  const params = useParams()
  const employeeId = (params?.employeeId as string) || ''

  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  const fetchedRef = useRef(false)

  // ============ FETCH ============
  const fetchPayrolls = useCallback(async () => {
    if (!employeeId) return
    try {
      setLoading(true)
      setMessage(null)

      const { data, error } = await supabase
        .from('payroll')
        .select('*')
        .eq('employee_id', employeeId)
        .order('month_year', { ascending: false })

      if (error) throw new Error(error.message)

      setPayrolls(data || [])
    } catch (err: any) {
      console.error('Fetch error:', err)
      setMessage(`❌ ${err?.message || 'Failed to load payroll records'}`)
    } finally {
      setLoading(false)
    }
  }, [employeeId])

  useEffect(() => {
    if (employeeId && !fetchedRef.current) {
      fetchedRef.current = true
      fetchPayrolls()
    }
  }, [employeeId, fetchPayrolls])

  // ============ PRINT ============
  const handlePrint = (row: PayrollRecord) => {
    const totalDeductions =
      (row.hold_salary || 0) +
      (row.deduct_health_insurance || 0) +
      (row.loan || 0) +
      (row.adv_salary || 0) +
      (row.income_tax || 0)

    const fmtPlain = (n: number | null | undefined) => `${round2(Number(n) ?? 0)}`
    const fmtDeduct = (n: number | null | undefined) =>
      `(${Math.abs(round2(Number(n) ?? 0))})`

    let monthYearLabel = '-'
    if (row.month_year) {
      const d = new Date(row.month_year)
      if (!isNaN(d.getTime())) {
        const monthName = d.toLocaleString('en-US', { month: 'long' })
        monthYearLabel = `${monthName} ${d.getFullYear()}`
      }
    }

    const logoUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/logo.png`
        : '/logo.png'

    const html = `<!DOCTYPE html><html><head><title>Pay Slip - ${row.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
      @page { size: A4 portrait; margin: 8mm; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Roboto', Arial, sans-serif; background: #fff; color: #000; font-size: 11px; }
      .container { width: 100%; max-width: 200mm; margin: 0 auto; padding: 0 12mm; }

      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #000; }
      .logo { height: 70px; width: auto; max-width: 240px; object-fit: contain; }
      .title { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }

      .emp-block { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; margin-bottom: 10px; padding: 10px 14px; background: #F8F8F8; font-size: 11px; }
      .emp-block .item { display: flex; align-items: baseline; }
      .emp-block .item span.lbl { font-weight: 700; min-width: 95px; }
      .emp-block .item span.val { font-weight: 400; }

      table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 10px; }
      table thead th { font-size: 9px; font-weight: 900; text-transform: uppercase; text-align: left; padding: 5px 8px; border-bottom: 1px solid #000; background: #F0F0F0; letter-spacing: 0.3px; }
      table thead th.center { text-align: center; }
      table thead th.right { text-align: right; }
      table tbody td { padding: 4px 8px; }
      table tbody td.center { text-align: center; }
      table tbody td.right { text-align: right; }
      table tbody td.label { font-weight: 600; color: #333; }
      table tbody tr.total-row td { font-weight: 900; border-top: 1px solid #000; border-bottom: 1px solid #000; background: #F8F8F8; text-transform: uppercase; padding: 5px 8px; }
      table tbody tr.netpay-row td { font-weight: 900; padding: 8px; text-transform: uppercase; border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; font-size: 14px; background: #E8F4FB; }
    </style></head><body><div class="container">

      <div class="header">
        <img src="${logoUrl}" class="logo" alt="Logo" />
        <div class="title">PAY SLIP</div>
      </div>

      <div class="emp-block">
        <div class="item"><span class="lbl">Employee ID:</span><span class="val">${row.employee_id || '-'}</span></div>
        <div class="item"><span class="lbl">Employee Name:</span><span class="val">${row.name || '-'}</span></div>
        <div class="item"><span class="lbl">Designation:</span><span class="val">${row.designation || '-'}</span></div>
        <div class="item"><span class="lbl">Month:</span><span class="val">${monthYearLabel}</span></div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:28%">Description</th>
            <th class="center" style="width:24%">Days</th>
            <th class="center" style="width:24%">Hours</th>
            <th class="right" style="width:24%">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="label">Gross Salary</td><td class="center">-</td><td class="center">-</td><td class="right">${fmtPlain(row.gross)}</td></tr>
          <tr><td class="label">Basic Salary</td><td class="center">-</td><td class="center">-</td><td class="right">${fmtPlain(row.basic_salary)}</td></tr>
          <tr><td class="label">Month Days</td><td class="center">${row.total_salary_days || 30}</td><td class="center">-</td><td class="right">-</td></tr>
          <tr><td class="label">Present Days</td><td class="center">${row.present_day || 0}</td><td class="center">-</td><td class="right">${fmtPlain(row.present_amount)}</td></tr>
          <tr><td class="label">Absent Days</td><td class="center">${row.absent_day || 0}</td><td class="center">-</td><td class="right">${fmtDeduct(row.absent_amount)}</td></tr>
          <tr><td class="label">Approved LVN</td><td class="center">${row.approvl_lvn || 0}</td><td class="center">-</td><td class="right">${fmtPlain(row.approvl_lvn_2)}</td></tr>
          <tr><td class="label">Late Hours</td><td class="center">-</td><td class="center">${row.late_hours || 0}</td><td class="right">${fmtDeduct(row.late_hour_amount)}</td></tr>
          <tr><td class="label">Overtime Hours</td><td class="center">-</td><td class="center">${row.over_time_hour || 0}</td><td class="right">${fmtPlain(row.over_time)}</td></tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th style="width:70%">Deductions</th>
            <th class="right" style="width:30%">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="label">Hold Salary (2.5%)</td><td class="right">${fmtDeduct(row.hold_salary)}</td></tr>
          <tr><td class="label">Health Insurance Policy</td><td class="right">${fmtDeduct(row.deduct_health_insurance)}</td></tr>
          <tr><td class="label">Advance Deduction</td><td class="right">${fmtDeduct(row.adv_salary)}</td></tr>
          <tr><td class="label">Loan</td><td class="right">${fmtDeduct(row.loan)}</td></tr>
          <tr><td class="label">Income Tax</td><td class="right">${fmtDeduct(row.income_tax)}</td></tr>
          <tr class="total-row"><td>Total Deductions</td><td class="right">${fmtDeduct(totalDeductions)}</td></tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr class="netpay-row">
            <td style="width:70%">NET SALARY PAYABLE</td>
            <td class="right" style="width:30%">${fmtDeduct(row.net_salary_payable)}</td>
          </tr>
        </tbody>
      </table>

    </div>
    <script>window.onload = function() { setTimeout(function() { window.print() }, 600) }</script>
    </body></html>`

    const w = window.open('', '_blank')
    if (!w) {
      alert('Please allow popups')
      return
    }
    w.document.write(html)
    w.document.close()
  }

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <ProtectedEmployeeRoute allowedRole='employee'>
      <NavbarDropdown />
      <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
        <div className="max-w-7xl mx-auto">

          {/* ============= HEADER ============= */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-[#0071BD] tracking-wider">
              Payroll Slips
            </h1>
            <p className="text-sm text-gray-500 tracking-wide mt-2">
              {payrolls.length > 0 && payrolls[0]?.name
                ? `${payrolls[0].name} (${employeeId})`
                : `Employee ID: ${employeeId || 'N/A'}`}
            </p>
          </div>

          {/* ============= MESSAGES ============= */}
          {message && (
            <div
              className={`mb-4 text-sm px-4 py-3 rounded font-medium flex items-center gap-2 ${
                message.startsWith('✅')
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message.startsWith('✅') ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message}
              <button
                onClick={() => setMessage(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============= TABLE ============= */}
          {loading && payrolls.length === 0 ? (
            <div className="bg-white shadow-sm flex items-center justify-center h-64 rounded">
              <Loader className="w-12 h-12 animate-spin text-[#0071BD]" />
            </div>
          ) : payrolls.length === 0 ? (
            <div className="bg-white shadow-sm flex items-center justify-center h-64 text-gray-400 rounded">
              <div className="text-center">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-base font-medium tracking-wide">
                  No payroll records found for this employee
                </p>
                <p className="text-sm mt-2 tracking-wide">
                  Published payroll records will appear here
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm overflow-hidden rounded">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payrolls.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-base font-semibold text-gray-800 tracking-wide">
                              {getMonthLabel(row.month_year)}
                            </p>
                            <p className="text-xs text-gray-400 tracking-wide mt-1">
                              {row.designation || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handlePrint(row)}
                            className="p-2 text-[#0071BD] hover:bg-[#0071BD]/10 rounded transition"
                            title="Print Pay Slip"
                          >
                            <Printer className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </ProtectedEmployeeRoute>
  )
}