// app/hr/payroll/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Footer from '@/components/footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import NavbarDropdown from '@/components/navbar'
import { createClient } from '@supabase/supabase-js'
import {
  Loader, Printer, Download, AlertCircle, CheckCircle2, Upload,
  UploadCloud, Database, Trash2
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
interface BulkPayrollRow {
  employee_id: string
  name: string
  designation: string
  cnic: string
  shift: string
  branch: string
  gross: number
  basic_salary: number
  total_month_days: number
  present_day: number
  absent_day: number
  approvl_lvn: number
  late_hours: number
  over_time_hour: number
  per_month_salary: number
  per_day: number
  present_amount: number
  absent_amount: number
  total_salary_days: number
  duty_hours: number
  total_month_hours: number
  pr_hours: number
  late_hour_amount: number
  salary_exp: number
  approvl_lvn_2: number
  over_time: number
  hold_salary: number
  deduct_health_insurance: number
  total_salary: number
  loan: number
  adv_salary: number
  income_tax: number
  net_salary_payable: number
  from_date: string
  to_date: string
  publishing?: boolean
  published?: boolean
  deleting?: boolean
}

// =====================================================
// Helpers
// =====================================================
const round2 = (n: number) => (!Number.isFinite(n) ? 0 : Math.round(n))
const fmt = (n: number) => round2(n ?? 0).toString()

const calcDaysBetween = (fromDate: string, toDate: string): number => {
  if (!fromDate || !toDate) return 0
  const start = new Date(fromDate + 'T00:00:00')
  const end = new Date(toDate + 'T00:00:00')
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
  if (end < start) return 0
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

const buildMonthKey = (month: string, year: string) => {
  if (!month || !year) return ''
  return `${year}-${String(month).padStart(2, '0')}`
}

const getMonthDateRange = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number)
  const fromDate = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const toDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { fromDate, toDate }
}

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
export default function PayrollPage() {
  const [bulkMonth, setBulkMonth] = useState<string>('')
  const [bulkYear, setBulkYear] = useState<string>('')
  const [bulkDepartment, setBulkDepartment] = useState<string>('')
  const [bulkCompany, setBulkCompany] = useState<string>('')

  const [departments, setDepartments] = useState<string[]>([])
  const [companies, setCompanies] = useState<string[]>([])

  const [rows, setRows] = useState<BulkPayrollRow[]>([])
  const [loading, setLoading] = useState(false)
  const [publishingAll, setPublishingAll] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const now = new Date()
    setBulkMonth(String(now.getMonth() + 1))
    setBulkYear(String(now.getFullYear()))
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('attendance_sheet').select('department, company')
        if (data) {
          const depts = [...new Set(data.map(d => d.department).filter(Boolean))] as string[]
          const comps = [...new Set(data.map(d => d.company).filter(Boolean))] as string[]
          setDepartments(depts.sort())
          setCompanies(comps.sort())
        }
      } catch (err) {
        console.error('Filter load error:', err)
      }
    }
    load()
  }, [])

  // ============ IMPORT ============
  const handleImport = useCallback(async () => {
    if (!bulkMonth || !bulkYear) {
      setMessage('❌ Please select Month and Year')
      return
    }

    setLoading(true)
    setMessage(null)
    setRows([])

    try {
      const monthKey = buildMonthKey(bulkMonth, bulkYear)

      let query = supabase.from('attendance_sheet').select('*').eq('month', monthKey)
      if (bulkDepartment) query = query.eq('department', bulkDepartment)
      if (bulkCompany) query = query.eq('company', bulkCompany)

      const { data: sheetData, error: sheetErr } = await query
      if (sheetErr) throw new Error(sheetErr.message)
      if (!sheetData || sheetData.length === 0) {
        setMessage(`❌ No records found for ${monthKey}`)
        setLoading(false)
        return
      }

      const { fromDate, toDate } = getMonthDateRange(monthKey)
      const userIds = sheetData.map(s => s.user_id)

      const { data: empData } = await supabase
        .from('employees').select('*').in('employee_id', userIds)

      const empMap = new Map((empData || []).map(e => [e.employee_id, e]))

      const monthYear = monthKey + '-01'
      const { data: existingPayrolls } = await supabase
        .from('payroll')
        .select('employee_id')
        .eq('month_year', monthYear)

      const publishedSet = new Set((existingPayrolls || []).map(p => p.employee_id))

      const newRows: BulkPayrollRow[] = sheetData.map(sheet => {
        const emp = empMap.get(sheet.user_id)
        const empGross = Number(emp?.gross_salary) || 0
        const empBasic = Number(emp?.basic_salary) || 0
        const basicSalary = empBasic > 0 ? empBasic : round2(empGross / 2)

        const totalMonthDays = Number(sheet.total_month_days) || calcDaysBetween(fromDate, toDate)
        const perMonthSalary = round2(basicSalary / totalMonthDays)
        const perDay = round2((basicSalary / totalMonthDays) * 2)
        const presentDay = Number(sheet.total_present) || 0
        const absentDay = Number(sheet.total_absent) || 0
        const approvlLvn = Number(sheet.approved_leaves) || 0
        const lateHours = Number(sheet.late_hours) || 0
        const overTimeHour = Number(sheet.overtime_hours) || 0

        const presentAmount = round2(perDay * presentDay)
        const absentAmount = round2(perDay * absentDay)
        const totalSalaryDays = presentDay + approvlLvn
        const dutyHours = 8
        const totalMonthHours = round2(dutyHours * totalMonthDays)
        const prHours = totalMonthHours > 0 ? round2(empGross / totalMonthHours) : 0
        const lateHourAmount = round2(prHours * lateHours)
        const salaryExp = round2(presentAmount - lateHourAmount)
        const approvlLvn2 = round2(approvlLvn * perDay)
        const overTime = round2(prHours * overTimeHour)
        const holdSalary = round2(basicSalary * 0.025)
        const deductHealthInsurance = 0
        const totalSalary = round2(salaryExp + approvlLvn2 + overTime - holdSalary - deductHealthInsurance)

        const isPublished = publishedSet.has(sheet.user_id)

        return {
          employee_id: sheet.user_id,
          name: sheet.name || emp?.full_name || '',
          designation: sheet.designation || emp?.position || '',
          cnic: emp?.cnic_number || '',
          shift: sheet.shift || emp?.shift_timing || emp?.shift || '',
          branch: sheet.company || emp?.branch || emp?.department || '',
          gross: empGross,
          basic_salary: basicSalary,
          total_month_days: totalMonthDays,
          present_day: presentDay,
          absent_day: absentDay,
          approvl_lvn: approvlLvn,
          late_hours: lateHours,
          over_time_hour: overTimeHour,
          per_month_salary: perMonthSalary,
          per_day: perDay,
          present_amount: presentAmount,
          absent_amount: absentAmount,
          total_salary_days: totalSalaryDays,
          duty_hours: dutyHours,
          total_month_hours: totalMonthHours,
          pr_hours: prHours,
          late_hour_amount: lateHourAmount,
          salary_exp: salaryExp,
          approvl_lvn_2: approvlLvn2,
          over_time: overTime,
          hold_salary: holdSalary,
          deduct_health_insurance: deductHealthInsurance,
          total_salary: totalSalary,
          loan: 0,
          adv_salary: 0,
          income_tax: 0,
          net_salary_payable: totalSalary,
          from_date: fromDate,
          to_date: toDate,
          publishing: false,
          published: isPublished
        }
      })

      setRows(newRows)
      setMessage(`✅ Imported ${newRows.length} employees for ${monthKey}`)
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Import failed'}`)
    } finally {
      setLoading(false)
    }
  }, [bulkMonth, bulkYear, bulkDepartment, bulkCompany])

  // ============ UPDATE ROW ============
  const updateRow = (index: number, field: keyof BulkPayrollRow, value: number) => {
    setRows(prev => {
      const updated = [...prev]
      const row = { ...updated[index], [field]: value }

      row.total_salary = round2(
        row.salary_exp + row.approvl_lvn_2 + row.over_time -
        row.hold_salary - row.deduct_health_insurance
      )
      row.net_salary_payable = round2(
        row.total_salary - row.loan - row.adv_salary - row.income_tax
      )

      updated[index] = row
      return updated
    })
  }

  // ============ BUILD PAYLOAD ============
  const buildPayload = (row: BulkPayrollRow, monthYear: string) => ({
    employee_id: row.employee_id,
    name: row.name,
    designation: row.designation,
    cnic: row.cnic,
    total_increase: 0,
    gross: row.gross,
    total_gross_after_increa: row.gross,
    basic_salary: row.basic_salary,
    per_month_salary: row.per_month_salary,
    per_day: row.per_day,
    present_day: row.present_day,
    present_amount: row.present_amount,
    absent_day: row.absent_day,
    absent_amount: row.absent_amount,
    approvl_lvn: row.approvl_lvn,
    total_salary_days: row.total_salary_days,
    duty_hours: row.duty_hours,
    pr_hours: row.pr_hours,
    total_month_hours: row.total_month_hours,
    late_hours: row.late_hours,
    late_hour_amount: row.late_hour_amount,
    salary_exp: row.salary_exp,
    approvl_lvn_2: row.approvl_lvn_2,
    over_time_hour: row.over_time_hour,
    over_time: row.over_time,
    hold_salary: row.hold_salary,
    deduct_health_insurance: row.deduct_health_insurance,
    total_salary: row.total_salary,
    loan: row.loan,
    adv_salary: row.adv_salary,
    income_tax: row.income_tax,
    net_salary_payable: row.net_salary_payable,
    month_year: monthYear,
    updated_at: new Date().toISOString()
  })

  // ============ PUBLISH SINGLE ============
  const handlePublish = async (index: number) => {
    const row = rows[index]
    if (!row) return

    setRows(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], publishing: true }
      return updated
    })

    try {
      const monthYear = buildMonthKey(bulkMonth, bulkYear) + '-01'
      const payload = buildPayload(row, monthYear)

      const { data: existing } = await supabase
        .from('payroll')
        .select('id')
        .eq('employee_id', row.employee_id)
        .eq('month_year', monthYear)
        .maybeSingle()

      if (existing) {
        const { error } = await supabase.from('payroll').update(payload).eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('payroll').insert(payload)
        if (error) throw error
      }

      setRows(prev => {
        const updated = [...prev]
        updated[index] = { ...updated[index], publishing: false, published: true }
        return updated
      })

      setMessage(`✅ ${row.name} payroll published successfully!`)
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setRows(prev => {
        const updated = [...prev]
        updated[index] = { ...updated[index], publishing: false }
        return updated
      })
      setMessage(`❌ Publish failed: ${err.message || 'Unknown error'}`)
      setTimeout(() => setMessage(null), 4000)
    }
  }

  // ============ DELETE SINGLE ============
  const handleDelete = async (index: number) => {
    const row = rows[index]
    if (!row) return

    if (!confirm(`Are you sure you want to delete payroll for ${row.name} (${row.employee_id})?`)) {
      return
    }

    setRows(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], deleting: true }
      return updated
    })

    try {
      const monthYear = buildMonthKey(bulkMonth, bulkYear) + '-01'

      const { error } = await supabase
        .from('payroll')
        .delete()
        .eq('employee_id', row.employee_id)
        .eq('month_year', monthYear)

      if (error) throw error

      setRows(prev => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          deleting: false,
          published: false,
          loan: 0,
          adv_salary: 0,
          income_tax: 0,
          deduct_health_insurance: 0,
          net_salary_payable: updated[index].total_salary
        }
        return updated
      })

      setMessage(`✅ Payroll deleted for ${row.name}`)
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      console.error('Delete error:', err)
      setRows(prev => {
        const updated = [...prev]
        updated[index] = { ...updated[index], deleting: false }
        return updated
      })
      setMessage(`❌ Delete failed: ${err.message || 'Unknown error'}`)
      setTimeout(() => setMessage(null), 4000)
    }
  }

  // ============ PUBLISH ALL ============
  const handlePublishAll = async () => {
    const unpublishedRows = rows.map((r, i) => ({ row: r, idx: i })).filter(x => !x.row.published)
    if (unpublishedRows.length === 0) {
      setMessage('ℹ️ All rows already published')
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setPublishingAll(true)
    setMessage(`⏳ Publishing ${unpublishedRows.length} employees...`)

    const monthYear = buildMonthKey(bulkMonth, bulkYear) + '-01'
    setRows(prev => prev.map(r => r.published ? r : { ...r, publishing: true }))

    try {
      const employeeIds = unpublishedRows.map(x => x.row.employee_id)
      const { data: existingRecords } = await supabase
        .from('payroll')
        .select('id, employee_id')
        .eq('month_year', monthYear)
        .in('employee_id', employeeIds)

      const existingMap = new Map((existingRecords || []).map(r => [r.employee_id, r.id]))

      let successCount = 0
      let failCount = 0
      const successIds: string[] = []

      for (const { row } of unpublishedRows) {
        try {
          const payload = buildPayload(row, monthYear)
          const existingId = existingMap.get(row.employee_id)

          if (existingId) {
            const { error } = await supabase.from('payroll').update(payload).eq('id', existingId)
            if (error) throw error
          } else {
            const { error } = await supabase.from('payroll').insert(payload)
            if (error) throw error
          }
          successCount++
          successIds.push(row.employee_id)
        } catch (err) {
          console.error(`Publish failed for ${row.employee_id}:`, err)
          failCount++
        }
      }

      setRows(prev => prev.map(r => {
        if (r.published) return r
        if (successIds.includes(r.employee_id)) {
          return { ...r, publishing: false, published: true }
        }
        return { ...r, publishing: false }
      }))

      if (failCount === 0) {
        setMessage(`✅ Published ${successCount} payrolls successfully!`)
      } else {
        setMessage(`⚠️ Published: ${successCount}, Failed: ${failCount}`)
      }
      setTimeout(() => setMessage(null), 5000)
    } catch (err: any) {
      setRows(prev => prev.map(r => r.published ? r : { ...r, publishing: false }))
      setMessage(`❌ Publish All failed: ${err.message || 'Unknown error'}`)
      setTimeout(() => setMessage(null), 4000)
    } finally {
      setPublishingAll(false)
    }
  }

  // ============ PRINT (SINGLE SLIP - NO DUPLICATE) ============
  const handlePrint = (row: BulkPayrollRow) => {
    const totalDeductions =
      row.hold_salary + row.deduct_health_insurance +
      row.loan + row.adv_salary + row.income_tax

    const fmtPlain = (n: number) => `${round2(n ?? 0)}`
    const fmtDeduct = (n: number) => `(${Math.abs(round2(n ?? 0))})`

    let monthYearLabel = '-'
    if (row.from_date) {
      const d = new Date(row.from_date + 'T00:00:00')
      if (!isNaN(d.getTime())) {
        const monthName = d.toLocaleString('en-US', { month: 'long' })
        monthYearLabel = `${monthName} ${d.getFullYear()}`
      }
    }

    const logoUrl = typeof window !== 'undefined'
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
        <div class="item"><span class="lbl">Branch:</span><span class="val">${row.branch || '-'}</span></div>
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
          <tr><td class="label">Month Days</td><td class="center">${row.total_month_days}</td><td class="center">-</td><td class="right">-</td></tr>
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
    <script>window.onload = function() { setTimeout(function() { window.print() }, 600) }</script>
    </body></html>`

    const w = window.open('', '_blank')
    if (!w) { alert('Please allow popups'); return }
    w.document.write(html)
    w.document.close()
  }

  // =====================================================
  // RENDER
  // =====================================================
  const publishedCount = rows.filter(r => r.published).length
  const unpublishedCount = rows.length - publishedCount
  const totalNetPayable = rows.reduce((sum, r) => sum + r.net_salary_payable, 0)

  if (loading && rows.length === 0) {
    return (
      <ProtectedRoute allowedUser='hr'>
        <NavbarDropdown />
        <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${roboto.className}`}>
          <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto" />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <>
      <ProtectedRoute allowedUser='hr'>
        <NavbarDropdown />
        <div className={`min-h-screen bg-gray-50 p-6 ${roboto.className}`}>
          <div className="max-w-7xl mx-auto">

            {/* ============= HEADER ============= */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider`}>
                    Payroll Sheet
                  </h1>
                  <p className={`text-sm text-gray-500 tracking-wide mt-1`}>
                    Import attendance data, review, edit and publish payroll
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleImport}
                    disabled={loading || !bulkMonth || !bulkYear}
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {loading ? 'Importing...' : 'Import'}
                  </button>

                  {rows.length > 0 && unpublishedCount > 0 && (
                    <button
                      onClick={handlePublishAll}
                      disabled={publishingAll}
                      className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {publishingAll ? <Loader className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      {publishingAll ? 'Publishing...' : `Publish All (${unpublishedCount})`}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ============= MESSAGES ============= */}
            {message && (
              <div className={`mb-6 p-4 flex items-start gap-3 border rounded ${
                message.startsWith('✅') ? 'bg-green-50 border-green-200' :
                message.startsWith('⏳') ? 'bg-blue-50 border-blue-200' :
                message.startsWith('ℹ️') ? 'bg-blue-50 border-blue-200' :
                message.startsWith('⚠️') ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }`}>
                {message.startsWith('✅') ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /> :
                 message.startsWith('❌') ? <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" /> :
                 <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <p className={`text-sm tracking-wide ${
                    message.startsWith('✅') ? 'text-green-700' :
                    message.startsWith('❌') ? 'text-red-700' :
                    message.startsWith('⚠️') ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>{message}</p>
                </div>
                <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
                  <XIcon />
                </button>
              </div>
            )}

            {/* ============= FILTERS ============= */}
            <div className="bg-white shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-xs font-medium text-gray-700 tracking-wide mb-1`}>Month</label>
                    <select
                      value={bulkMonth}
                      onChange={(e) => setBulkMonth(e.target.value)}
                      className={`w-full px-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black`}
                    >
                      <option value="">-- Month --</option>
                      {MONTHS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium text-gray-700 tracking-wide mb-1`}>Year</label>
                    <select
                      value={bulkYear}
                      onChange={(e) => setBulkYear(e.target.value)}
                      className={`w-full px-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black`}
                    >
                      <option value="">-- Year --</option>
                      {YEAR_OPTIONS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium text-gray-700 tracking-wide mb-1`}>Department</label>
                    <select
                      value={bulkDepartment}
                      onChange={(e) => setBulkDepartment(e.target.value)}
                      className={`w-full px-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black`}
                    >
                      <option value="">All Departments</option>
                      {departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium text-gray-700 tracking-wide mb-1`}>Company</label>
                    <select
                      value={bulkCompany}
                      onChange={(e) => setBulkCompany(e.target.value)}
                      className={`w-full px-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm tracking-wide text-black`}
                    >
                      <option value="">All Companies</option>
                      {companies.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ============= STATS ============= */}
            {rows.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white shadow-sm p-4">
                  <div className={`text-sm text-gray-500 tracking-wide`}>Total Records</div>
                  <div className={`text-2xl font-bold text-[#0071BD] tracking-wider`}>{rows.length}</div>
                </div>
                <div className="bg-white shadow-sm p-4">
                  <div className={`text-sm text-gray-500 tracking-wide`}>Published</div>
                  <div className={`text-2xl font-bold text-green-600 tracking-wider`}>{publishedCount}</div>
                </div>
                <div className="bg-white shadow-sm p-4">
                  <div className={`text-sm text-gray-500 tracking-wide`}>Pending</div>
                  <div className={`text-2xl font-bold text-yellow-600 tracking-wider`}>{unpublishedCount}</div>
                </div>
                <div className="bg-white shadow-sm p-4">
                  <div className={`text-sm text-gray-500 tracking-wide`}>Total Net Payable</div>
                  <div className={`text-xl font-bold text-blue-700 tracking-wider`}>
                    Rs. {totalNetPayable.toLocaleString('en-PK')}
                  </div>
                </div>
              </div>
            )}

            {/* ============= EMPLOYEES TABLE ============= */}
            {rows.length === 0 ? (
              !loading && (
                <div className="bg-white shadow-sm p-8 text-center">
                  <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className={`text-gray-500 tracking-wide`}>
                    Select Month + Year and click <span className="text-green-600 font-bold">Import</span> to load payroll data
                  </p>
                  <p className={`text-xs text-gray-400 tracking-wide mt-2`}>
                    All attendance_sheet records will load with full payroll calculations
                  </p>
                </div>
              )
            ) : (
              <div className="bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>#</th>
                        <th className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Emp ID</th>
                        <th className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Name</th>
                        <th className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Designation</th>
                        <th className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Shift</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Gross</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Basic</th>
                        <th className={`px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>M.Days</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Per Month</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Per Day</th>
                        <th className={`px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Present</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Pr. Amt</th>
                        <th className={`px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Absent</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Ab. Amt</th>
                        <th className={`px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>LVN</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>LVN Amt</th>
                        <th className={`px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Late Hr</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Late Amt</th>
                        <th className={`px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>OT Hr</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>OT Amt</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Salary Exp</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Hold</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Health Ins</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Loan</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Adv Sal</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Inc Tax</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Total Salary</th>
                        <th className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Net Payable</th>
                        <th className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rows.map((row, idx) => (
                        <tr
                          key={`${row.employee_id}-${idx}`}
                          className={`transition ${row.published ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">{idx + 1}</td>
                          <td className="px-3 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{row.employee_id}</td>
                          <td className="px-3 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{row.name}</td>
                          <td className="px-3 py-3 text-sm text-gray-600 whitespace-nowrap">{row.designation || '-'}</td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {row.shift ? (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded tracking-wide">
                                {row.shift}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.gross)}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.basic_salary)}</td>
                          <td className="px-3 py-3 text-sm text-center text-gray-800 whitespace-nowrap">{row.total_month_days}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.per_month_salary)}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.per_day)}</td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded tracking-wide">
                              {row.present_day}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.present_amount)}</td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded tracking-wide">
                              {row.absent_day}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.absent_amount)}</td>
                          <td className="px-3 py-3 text-sm text-center text-gray-800 whitespace-nowrap">{row.approvl_lvn}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.approvl_lvn_2)}</td>
                          <td className="px-3 py-3 text-sm text-center text-gray-800 whitespace-nowrap">{row.late_hours}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.late_hour_amount)}</td>
                          <td className="px-3 py-3 text-sm text-center text-gray-800 whitespace-nowrap">{row.over_time_hour}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.over_time)}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.salary_exp)}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-800 whitespace-nowrap">{fmt(row.hold_salary)}</td>

                          <td className="px-2 py-2 whitespace-nowrap">
                            <input
                              type="number"
                              value={row.deduct_health_insurance}
                              onChange={(e) => updateRow(idx, 'deduct_health_insurance', parseFloat(e.target.value) || 0)}
                              disabled={row.published}
                              className="w-20 px-2 py-1 text-sm text-right border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none text-black bg-yellow-50 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </td>

                          <td className="px-2 py-2 whitespace-nowrap">
                            <input
                              type="number"
                              value={row.loan}
                              onChange={(e) => updateRow(idx, 'loan', parseFloat(e.target.value) || 0)}
                              disabled={row.published}
                              className="w-20 px-2 py-1 text-sm text-right border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none text-black bg-yellow-50 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </td>

                          <td className="px-2 py-2 whitespace-nowrap">
                            <input
                              type="number"
                              value={row.adv_salary}
                              onChange={(e) => updateRow(idx, 'adv_salary', parseFloat(e.target.value) || 0)}
                              disabled={row.published}
                              className="w-20 px-2 py-1 text-sm text-right border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none text-black bg-yellow-50 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </td>

                          <td className="px-2 py-2 whitespace-nowrap">
                            <input
                              type="number"
                              value={row.income_tax}
                              onChange={(e) => updateRow(idx, 'income_tax', parseFloat(e.target.value) || 0)}
                              disabled={row.published}
                              className="w-20 px-2 py-1 text-sm text-right border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none text-black bg-yellow-50 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </td>

                          <td className="px-3 py-3 text-sm text-right font-bold text-gray-800 whitespace-nowrap">
                            {fmt(row.total_salary)}
                          </td>
                          <td className="px-3 py-3 text-sm text-right font-bold text-blue-700 whitespace-nowrap">
                            {fmt(row.net_salary_payable)}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handlePrint(row)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                                title="Print Payslip"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handlePublish(idx)}
                                disabled={row.publishing || row.published}
                                className={`p-1.5 rounded transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                  row.published
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-purple-600 hover:bg-purple-50'
                                }`}
                                title={row.published ? 'Published' : 'Publish'}
                              >
                                {row.publishing ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : row.published ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                onClick={() => handleDelete(idx)}
                                disabled={!row.published || row.deleting}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                                title={row.published ? 'Delete from database' : 'Publish first to enable delete'}
                              >
                                {row.deleting ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className={`text-sm text-gray-500 tracking-wide`}>
                    Showing {rows.length} records
                    {publishedCount > 0 && (
                      <span className="ml-2 text-green-700 font-medium">
                        • {publishedCount} published
                      </span>
                    )}
                    {unpublishedCount > 0 && (
                      <span className="ml-2 text-yellow-700 font-medium">
                        • {unpublishedCount} pending
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-bold text-blue-700 tracking-wide`}>
                    Total Net Payable: Rs. {totalNetPayable.toLocaleString('en-PK')}
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