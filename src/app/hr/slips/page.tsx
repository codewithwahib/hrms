// app/hr/payroll-slips/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Footer from '@/components/footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import NavbarDropdown from '@/components/navbar'
import { createClient } from '@supabase/supabase-js'
import {
  Loader, Printer, Download, AlertCircle, CheckCircle2, Database, Search, FileText
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
// Types (matches payroll table columns)
// =====================================================
interface PayrollRow {
  id: number
  employee_id: string
  name: string
  designation: string
  cnic: string
  total_increase: number
  gross: number
  total_gross_after_increa: number
  basic_salary: number
  per_month_salary: number
  per_day: number
  present_day: number
  present_amount: number
  absent_day: number
  absent_amount: number
  approvl_lvn: number
  total_salary_days: number
  duty_hours: number
  pr_hours: number
  total_month_hours: number
  late_hours: number
  late_hour_amount: number
  salary_exp: number
  approvl_lvn_2: number
  over_time_hour: number
  over_time: number
  hold_salary: number
  deduct_health_insurance: number
  total_salary: number
  loan: number
  adv_salary: number
  income_tax: number
  net_salary_payable: number
  month_year: string
  created_at: string
  updated_at: string
}

// =====================================================
// Helpers
// =====================================================
const round2 = (n: number) => (!Number.isFinite(n) ? 0 : Math.round(n))

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const YEAR_OPTIONS = ['2022', '2023', '2024', '2025', '2026', '2027']

// =====================================================
// Page
// =====================================================
export default function PayrollSlipsPage() {
  const [month, setMonth] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [designation, setDesignation] = useState<string>('')
  const [designations, setDesignations] = useState<string[]>([])

  const [rows, setRows] = useState<PayrollRow[]>([])
  const [loading, setLoading] = useState(false)
  const [printingAll, setPrintingAll] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Default to current month + year
  useEffect(() => {
    const now = new Date()
    setMonth(String(now.getMonth() + 1))
    setYear(String(now.getFullYear()))
  }, [])

  // ============ LOAD DESIGNATIONS (filter dropdown) ============
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('payroll').select('designation')
        if (data) {
          const unique = [...new Set(data.map(d => d.designation).filter(Boolean))] as string[]
          setDesignations(unique.sort())
        }
      } catch (err) {
        console.error('Designation load error:', err)
      }
    }
    load()
  }, [])

  // ============ FETCH PUBLISHED SLIPS ============
  const fetchSlips = useCallback(async () => {
    if (!month || !year) {
      setMessage('❌ Please select Month and Year')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const monthYear = `${year}-${String(month).padStart(2, '0')}-01`

      let query = supabase
        .from('payroll')
        .select('*')
        .eq('month_year', monthYear)
        .order('employee_id', { ascending: true })

      if (designation) query = query.eq('designation', designation)

      const { data, error } = await query
      if (error) throw new Error(error.message)

      let filtered = (data as PayrollRow[]) || []

      if (search.trim()) {
        const s = search.trim().toLowerCase()
        filtered = filtered.filter(r =>
          r.employee_id?.toLowerCase().includes(s) ||
          r.name?.toLowerCase().includes(s) ||
          r.cnic?.toLowerCase().includes(s)
        )
      }

      setRows(filtered)
      setMessage(
        filtered.length > 0
          ? `✅ Loaded ${filtered.length} payroll slips`
          : `ℹ️ No payroll slips found for this filter`
      )
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Fetch failed'}`)
    } finally {
      setLoading(false)
    }
  }, [month, year, designation, search])

  // Auto-load on mount when month/year ready
  useEffect(() => {
    if (month && year) fetchSlips()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year])

  // ============ SINGLE PRINT (SAME AS PAYROLL PAGE) ============
  const handlePrint = (row: PayrollRow) => {
    const totalDeductions =
      row.hold_salary + row.deduct_health_insurance +
      row.loan + row.adv_salary + row.income_tax

    const fmtPlain = (n: number) => `${round2(n ?? 0)}`
    const fmtDeduct = (n: number) => `(${Math.abs(round2(n ?? 0))})`

    // Month label from month_year
    let monthYearLabel = '-'
    if (row.month_year) {
      const d = new Date(row.month_year + 'T00:00:00')
      if (!isNaN(d.getTime())) {
        monthYearLabel = `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`
      }
    }

    const logoUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/logo.png`
      : '/logo.png'

    const html = `<!DOCTYPE html><html><head><title>Pay Slip - ${row.name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
    <style>
      @page { size: A4 portrait; margin: 8mm; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'DM Sans', Arial, sans-serif; background: #fff; color: #000; font-size: 11px; }
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
          <tr><td class="label">Month Days</td><td class="center">${row.total_salary_days || '-'}</td><td class="center">-</td><td class="right">-</td></tr>
          <tr><td class="label">Present Days</td><td class="center">${row.present_day}</td><td class="center">-</td><td class="right">${fmtPlain(row.present_amount)}</td></tr>
          <tr><td class="label">Absent Days</td><td class="center">${row.absent_day}</td><td class="center">-</td><td class="right">${fmtDeduct(row.absent_amount)}</td></tr>
          <tr><td class="label">Approved LVN</td><td class="center">${row.approvl_lvn}</td><td class="center">-</td><td class="right">${fmtPlain(row.approvl_lvn_2)}</td></tr>
          <tr><td class="label">Late Hours</td><td class="center">-</td><td class="center">${row.late_hours}</td><td class="right">${fmtDeduct(row.late_hour_amount)}</td></tr>
          <tr><td class="label">Overtime Hours</td><td class="center">-</td><td class="center">${row.over_time_hour}</td><td class="right">${fmtPlain(row.over_time)}</td></tr>
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
    <script>
      window.onload = function() {
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(function() {
            setTimeout(function() { window.print() }, 300)
          })
        } else {
          setTimeout(function() { window.print() }, 600)
        }
      }
    </script>
    </body></html>`

    const w = window.open('', '_blank')
    if (!w) { alert('Please allow popups'); return }
    w.document.write(html)
    w.document.close()
  }

  // ============ PRINT ALL (opens one document with all slips, page-broken) ============
  const handlePrintAll = () => {
    if (rows.length === 0) {
      setMessage('ℹ️ Nothing to print')
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setPrintingAll(true)

    const logoUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/logo.png`
      : '/logo.png'

    const fmtPlain = (n: number) => `${round2(n ?? 0)}`
    const fmtDeduct = (n: number) => `(${Math.abs(round2(n ?? 0))})`

    const buildSlip = (row: PayrollRow, isLast: boolean) => {
      const totalDeductions =
        row.hold_salary + row.deduct_health_insurance +
        row.loan + row.adv_salary + row.income_tax

      let monthYearLabel = '-'
      if (row.month_year) {
        const d = new Date(row.month_year + 'T00:00:00')
        if (!isNaN(d.getTime())) {
          monthYearLabel = `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`
        }
      }

      return `
      <div class="slip ${isLast ? '' : 'page-break'}">
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
            <tr><td class="label">Month Days</td><td class="center">${row.total_salary_days || '-'}</td><td class="center">-</td><td class="right">-</td></tr>
            <tr><td class="label">Present Days</td><td class="center">${row.present_day}</td><td class="center">-</td><td class="right">${fmtPlain(row.present_amount)}</td></tr>
            <tr><td class="label">Absent Days</td><td class="center">${row.absent_day}</td><td class="center">-</td><td class="right">${fmtDeduct(row.absent_amount)}</td></tr>
            <tr><td class="label">Approved LVN</td><td class="center">${row.approvl_lvn}</td><td class="center">-</td><td class="right">${fmtPlain(row.approvl_lvn_2)}</td></tr>
            <tr><td class="label">Late Hours</td><td class="center">-</td><td class="center">${row.late_hours}</td><td class="right">${fmtDeduct(row.late_hour_amount)}</td></tr>
            <tr><td class="label">Overtime Hours</td><td class="center">-</td><td class="center">${row.over_time_hour}</td><td class="right">${fmtPlain(row.over_time)}</td></tr>
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
      `
    }

    const slipsHtml = rows.map((r, i) => buildSlip(r, i === rows.length - 1)).join('')

    const html = `<!DOCTYPE html><html><head><title>Pay Slips</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
    <style>
      @page { size: A4 portrait; margin: 8mm; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'DM Sans', Arial, sans-serif; background: #fff; color: #000; font-size: 11px; }
      .slip { width: 100%; max-width: 200mm; margin: 0 auto; padding: 0 12mm; }
      .page-break { page-break-after: always; break-after: page; }

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
    </style></head><body>
      ${slipsHtml}
      <script>
        window.onload = function() {
          if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function() {
              setTimeout(function() { window.print() }, 500)
            })
          } else {
            setTimeout(function() { window.print() }, 800)
          }
        }
      </script>
    </body></html>`

    const w = window.open('', '_blank')
    if (!w) {
      alert('Please allow popups')
      setPrintingAll(false)
      return
    }
    w.document.write(html)
    w.document.close()
    setTimeout(() => setPrintingAll(false), 1000)
  }

  // =====================================================
  // RENDER
  // =====================================================
  const totalNet = rows.reduce((s, r) => s + Number(r.net_salary_payable || 0), 0)

  return (
    <>
      <ProtectedRoute allowedUser='hr'>
        <NavbarDropdown />
        <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
          <div className="max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#0071BD] tracking-wider">
                  Payroll Slips
                </h1>
                <p className="text-sm text-gray-500 tracking-wide mt-1">
                  View, filter and print published payroll slips
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={fetchSlips}
                  disabled={loading || !month || !year}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {loading ? 'Loading...' : 'Refresh'}
                </button>

                {rows.length > 0 && (
                  <button
                    onClick={handlePrintAll}
                    disabled={printingAll}
                    className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {printingAll ? <Loader className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    {printingAll ? 'Preparing...' : `Print All (${rows.length})`}
                  </button>
                )}
              </div>
            </div>

            {/* MESSAGE */}
            {message && (
              <div className={`mb-6 p-4 flex items-start gap-3 border rounded ${
                message.startsWith('✅') ? 'bg-green-50 border-green-200' :
                message.startsWith('ℹ️') ? 'bg-blue-50 border-blue-200' :
                'bg-red-50 border-red-200'
              }`}>
                {message.startsWith('✅') ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /> :
                 <AlertCircle className={`w-5 h-5 mt-0.5 ${message.startsWith('ℹ️') ? 'text-blue-500' : 'text-red-500'}`} />}
                <div className="flex-1">
                  <p className={`text-sm tracking-wide ${
                    message.startsWith('✅') ? 'text-green-700' :
                    message.startsWith('ℹ️') ? 'text-blue-700' : 'text-red-700'
                  }`}>{message}</p>
                </div>
                <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
                  <XIcon />
                </button>
              </div>
            )}

            {/* FILTERS */}
            <div className="bg-white shadow-sm p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                  >
                    <option value="">-- Month --</option>
                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                  >
                    <option value="">-- Year --</option>
                    {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Designation</label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                  >
                    <option value="">All Designations</option>
                    {designations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Search</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchSlips()}
                      placeholder="Emp ID / Name / CNIC"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={fetchSlips}
                  className="px-4 py-2 bg-[#0071BD] text-white hover:bg-[#005a97] transition tracking-wider text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* STATS */}
            {rows.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow-sm p-4">
                  <div className="text-sm text-gray-500 tracking-wide">Total Slips</div>
                  <div className="text-2xl font-bold text-[#0071BD] tracking-wider">{rows.length}</div>
                </div>
                <div className="bg-white shadow-sm p-4">
                  <div className="text-sm text-gray-500 tracking-wide">Total Net Payable</div>
                  <div className="text-xl font-bold text-blue-700 tracking-wider">
                    Rs. {totalNet.toLocaleString('en-PK')}
                  </div>
                </div>
                <div className="bg-white shadow-sm p-4">
                  <div className="text-sm text-gray-500 tracking-wide">Month</div>
                  <div className="text-xl font-bold text-gray-800 tracking-wider">
                    {month && year ? `${MONTHS.find(m => m.value === month)?.label} ${year}` : '-'}
                  </div>
                </div>
              </div>
            )}

            {/* TABLE */}
            {rows.length === 0 ? (
              !loading && (
                <div className="bg-white shadow-sm p-8 text-center">
                  <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 tracking-wide">
                    No published payroll slips for this filter
                  </p>
                  <p className="text-xs text-gray-400 tracking-wide mt-2">
                    Select a month / year to load payroll slips
                  </p>
                </div>
              )
            ) : (
              <div className="bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">#</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Emp ID</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Designation</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CNIC</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Gross</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Basic</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Present</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Absent</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Deductions</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Salary</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Net Payable</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rows.map((row, idx) => {
                        const deductions =
                          Number(row.hold_salary || 0) +
                          Number(row.deduct_health_insurance || 0) +
                          Number(row.loan || 0) +
                          Number(row.adv_salary || 0) +
                          Number(row.income_tax || 0)
                        return (
                          <tr key={row.id} className="hover:bg-gray-50 transition">
                            <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">{idx + 1}</td>
                            <td className="px-3 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{row.employee_id}</td>
                            <td className="px-3 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{row.name}</td>
                            <td className="px-3 py-3 text-sm text-gray-600 whitespace-nowrap">{row.designation || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-600 whitespace-nowrap">{row.cnic || '-'}</td>
                            <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{round2(row.gross).toLocaleString('en-PK')}</td>
                            <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{round2(row.basic_salary).toLocaleString('en-PK')}</td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded tracking-wide">
                                {row.present_day}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded tracking-wide">
                                {row.absent_day}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm text-right text-red-700 whitespace-nowrap">
                              ({round2(deductions).toLocaleString('en-PK')})
                            </td>
                            <td className="px-3 py-3 text-sm text-right font-bold text-gray-800 whitespace-nowrap">
                              {round2(row.total_salary).toLocaleString('en-PK')}
                            </td>
                            <td className="px-3 py-3 text-sm text-right font-bold text-blue-700 whitespace-nowrap">
                              {round2(row.net_salary_payable).toLocaleString('en-PK')}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <button
                                onClick={() => handlePrint(row)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                                title="Print Payslip"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-500 tracking-wide">
                    Showing {rows.length} payroll slips
                  </div>
                  <div className="text-sm font-bold text-blue-700 tracking-wide">
                    Total Net Payable: Rs. {totalNet.toLocaleString('en-PK')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    </>
  )
}

function XIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}