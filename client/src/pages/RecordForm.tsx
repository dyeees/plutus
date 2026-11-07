import { useState } from 'react'
import Dropdown from '../components/Dropdown'
import { Check, Receipt, Landmark, Calculator } from 'lucide-react'

import { saveBill } from '../services/bills'
import { saveLoan } from '../services/loans'

const CLASSIFICATIONS = [
  'Housing',
  'Utilities',
  'Subscriptions',
]

const RECURRENCES = [
  { value: 'One-time', label: 'One-time' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Bi-weekly', label: 'Bi-weekly' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Semiannual', label: 'Semiannual' },
  { value: 'Annually', label: 'Annually' },
  { value: 'One-time', label: 'One-time' },
]

function RecordForm({ onCancel }: { onCancel: () => void }) {
  const [recordType, setRecordType] = useState('bill')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [classification, setClassification] = useState('Utilities')
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0])
  const [recurrence, setRecurrence] = useState('Monthly')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [interestRate, setInterestRate] = useState('')
  const [durationMonths, setDurationMonths] = useState('')

  const principal = Number(loanAmount) || 0
  const rate = Number(interestRate) || 0
  const months = Number(durationMonths) || 0
  const totalInterest = principal * (rate / 100) * months
  const totalRepayment = principal + totalInterest

  const installmentCount = {
    'One-time': 1,
    Monthly: months,
    'Bi-weekly': Math.ceil(months * 2),
    Weekly: Math.ceil(months * 4),
    Quarterly: Math.ceil(months / 3),
    Semiannual: Math.ceil(months / 6),
    Annually: Math.ceil(months / 12),
  }[recurrence] ?? 0

  const installmentAmount = installmentCount > 0 ? totalRepayment / installmentCount : 0

  const formatPHP = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      setIsSaving(true)
      setError('')
      if (recordType === 'bill') {
        await saveBill({
          name,
          amount: Number(amount),
          classification,
          dueDate,
          recurrence,
          notes,
        })
      } else {
        await saveLoan({
          name,
          loanAmount: Number(loanAmount),
          interestRate: Number(interestRate),
          durationMonths: Number(durationMonths),
          dueDate,
          recurrence,
          notes,
        })
      }
      onCancel()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save bill.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8860A]">
            Ledger Entry
          </span>
          <h2 className="font-serif text-2xl font-medium tracking-tight text-[#1E2D26] mt-0.5">
            Record New Commitment
          </h2>
        </div>
      </div>

      <div>
        {/* Record Type Tabs*/}
        <div className="relative z-10 -mb-px flex items-end" role="group" aria-label="Record type">
          <button
            type="button"
            aria-pressed={recordType === 'bill'}
            onClick={() => setRecordType('bill')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono rounded-t-sm border border-b-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8860A]/40 ${
              recordType === 'bill'
                ? 'font-bold bg-[#EFECE4] border-black/10 border-t-2 border-t-[#F6C163] text-[#386D59]'
                : 'font-medium bg-[#E2DED4] border-black/8 border-t-2 border-t-transparent text-[#7A9488] hover:text-[#4A6358] hover:bg-[#E8E4DA]'
            }`}
          >
            <Receipt className={`w-3.5 h-3.5 ${recordType === 'bill' ? 'text-[#C8860A]' : 'text-[#7A9488]'}`} />
            <span>Regular Bill</span>
          </button>
          <button
            type="button"
            aria-pressed={recordType === 'loan'}
            onClick={() => setRecordType('loan')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono rounded-t-sm border border-b-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8860A]/40 ${
              recordType === 'loan'
                ? 'font-bold bg-[#EFECE4] border-black/10 border-t-2 border-t-[#F6C163] text-[#386D59]'
                : 'font-medium bg-[#E2DED4] border-black/8 border-t-2 border-t-transparent text-[#7A9488] hover:text-[#4A6358] hover:bg-[#E8E4DA]'
            }`}
          >
            <Landmark className={`w-3.5 h-3.5 ${recordType === 'loan' ? 'text-[#C8860A]' : 'text-[#7A9488]'}`} />
            <span>Loan Payment</span>
          </button>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="relative border border-black/10 bg-[#EFECE4] rounded-sm p-5 sm:p-6 space-y-6 shadow-sm"
        >
          {error && (<p className="text-xs text-red-600 font-mono">{error}</p>)}
          {/* ── Regular Bill Fields ── */}
          {recordType === 'bill' && (
            <div className="space-y-4">
              {/*Payment or Obligation Name */}
              <div className="space-y-1.5">
                <label htmlFor="record-name" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                  <span>Payment or Obligation Name </span>
                </label>
                <input
                  id="record-name"
                  type="text"
                  required
                  placeholder="e.g. Personal Loan — BDO, Car Loan, HDMF"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white border border-black/12 font-mono px-3.5 py-2.5 text-[12px] sm:text-[13px] text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Amount */}
                <div className="space-y-1.5">
                  <label htmlFor="record-amount" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                    <span>Total Amount </span>
                    <span className="text-[10px] text-[#7A9488] font-mono mr-1">PHP</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-[0.54rem] font-mono text-[#C8860A]">
                      ₱
                    </span>
                    <input
                      id="record-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full bg-white border border-black/12 rounded-sm pl-8 pr-3.5 py-2.5 text-[12px] sm:text-[13px] font-mono font-semibold tabular-numbers text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
                    />
                  </div>
                </div>

                {/*Classification */}
                <div className="space-y-1.5">
                  <label htmlFor="record-classification" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                    Expense Classification
                  </label>
                  <Dropdown
                    id="record-classification"
                    value={classification}
                    options={CLASSIFICATIONS}
                    onChange={setClassification}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Due Date */}
                <div className="space-y-1.5">
                  <label htmlFor="bill-due-date" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                    <span>Due Date </span>
                  </label>
                  <input
                    id="bill-due-date"
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-white border border-black/12 rounded-sm px-3.5 py-2.5 text-[12px] sm:text-[13px] font-mono text-[#1E2D26] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
                  />
                </div>

                {/* Recurrence */}
                <div className="space-y-1.5">
                  <label htmlFor="bill-recurrence" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                    Payment Frequency
                  </label>
                  <Dropdown
                    id="bill-recurrence"
                    value={recurrence}
                    options={RECURRENCES.map(r => r.value)}
                    onChange={setRecurrence}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label htmlFor="bill-notes" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                  <span>Payment Notes / Instructions</span>
                  <span className="text-[10px] text-[#7A9488]">Optional</span>
                </label>
                <textarea
                  id="bill-notes"
                  rows={3}
                  placeholder="Account number, portal URL, reference codes, bank details..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-white border border-black/12 rounded-sm px-3.5 py-2.5 text-[12px] sm:text-[13px] font-mono text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors leading-relaxed shadow-sm"
                />
              </div>
            </div>
          )}

          {/* ──  Loan Payment Fields ── */}
          {recordType === 'loan' && (
            <div className="space-y-4">
              {/* Loan Name */}
              <div className="space-y-1.5">
                <label htmlFor="loan-name" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                  <span>Loan Name </span>
                </label>
                <input
                  id="loan-name"
                  type="text"
                  required
                  placeholder="e.g. Personal Loan — BDO, Car Loan, HDMF"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white border border-black/12 font-mono px-3.5 py-2.5 text-[12px] sm:text-[13px] text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
                />
              </div>

              {/* Loan Amount, Interest Rate, Duration*/}
              <div className="grid grid-cols-1 sm:grid-cols-[2.2fr_1fr_1fr] gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="loan-amount" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                    <span>Total Amount </span>
                    <span className="text-[10px] text-[#7A9488] font-mono mr-1">PHP</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-[0.54rem] font-mono text-[#C8860A]">
                      ₱
                    </span>
                    <input
                      id="loan-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      value={loanAmount}
                      onChange={e => setLoanAmount(e.target.value)}
                      className="w-full bg-white border border-black/12 rounded-sm pl-8 pr-3.5 py-2.5 text-[12px] sm:text-[13px] font-mono font-semibold tabular-numbers text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="loan-interest" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                    <span>Interest Rate</span>
                  </label>
                  <div className="relative">
                    <input
                      id="loan-interest" 
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      value={interestRate}
                      onChange={e => setInterestRate(e.target.value)}
                      className="w-full bg-white border border-black/12 rounded-sm pl-3.5 pr-3.5 py-2.5 text-[12px] sm:text-[13px] font-mono tabular-numbers text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
                    />
                    <span className="absolute right-3.5 top-3 font-mono text-xs text-[#7A9488]">
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="loan-duration" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                    <span>Duration</span>
                  </label>
                  <div className="relative">
                    <input
                      id="loan-duration"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={durationMonths}
                      onChange={e => setDurationMonths(e.target.value)}
                      className="w-full bg-white border border-black/12 rounded-sm pl-3.5 pr-3.5 py-2.5 text-[12px] sm:text-[13px] font-mono tabular-numbers text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
                    />
                    <span className="absolute right-3.5 top-3 font-mono text-xs text-[#7A9488]">
                      Month(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Loan Duration, Payment Frequency & First Due Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="bill-due-date" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                    <span>First Due Date </span>
                  </label>
                  <input
                    id="bill-due-date"
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-white border border-black/12 rounded-sm px-3.5 py-2.5 text-[12px] sm:text-[13px] font-mono text-[#1E2D26] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="loan-duration" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                    <span>Payment Frequency</span>
                  </label>
                  <Dropdown
                    id="bill-recurrence"
                    value={recurrence}
                    options={RECURRENCES.map(r => r.value)}
                    onChange={setRecurrence}
                  />
                </div>
              </div>

              {/* —— Visual Summary ——*/}
              <div className="rounded-sm overflow-hidden border border-[#386D59]">
                {/* Header strip */}
                <div className="bg-[#386D59] px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-[#F6C163]" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#C8E0D6] font-semibold">
                      Loan Summary Projection
                    </span>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#F6C163] opacity-90">
                    Estimated
                  </span>
                </div>

                <div className="bg-[#F5F2EA] divide-y divide-dashed divide-black/15">
                  {/* Total Interest */}
                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[11px] font-mono text-[#4A6358] flex-1">
                      Total Interest
                    </span>
                    <div className="flex-1 border-b border-dotted border-black/15 self-end mb-1" />
                    <span className="font-mono text-sm font-semibold tabular-numbers text-[#1E2D26] shrink-0">
                      {formatPHP(totalInterest)}
                    </span>
                  </div>

                  {/* Total Repayment */}
                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[11px] font-mono text-[#4A6358] flex-1">
                      Total Repayment
                    </span>
                    <div className="flex-1 border-b border-dotted border-black/15 self-end mb-1" />
                    <span className="font-mono text-sm font-semibold tabular-numbers text-[#1E2D26] shrink-0">
                      {formatPHP(totalRepayment)}
                    </span>
                  </div>

                  {/* Installment Amount */}
                  <div className="flex items-center justify-between px-4 py-3 gap-4 bg-[#386D59]/8">
                    <div className="flex-1">
                      <span className="text-[11px] font-mono text-[#1E2D26] font-medium block">
                        Per Installment
                      </span>
                      {/*<span className="text-[9px] font-mono text-[#7A9488]">
                        {recurrence} payment
                      </span>*/}
                    </div>
                    <div className="flex-1 border-b border-dotted border-black/15 self-center" />
                    <span className="font-mono text-base font-bold tabular-numbers text-[#386D59] shrink-0">
                      {formatPHP(installmentAmount)}
                    </span>
                  </div>
                </div>

                {/* Footer note */}
                <div className="bg-[#386D59]/8 border-t border-black/10 px-4 py-2">
                  <p className="text-[9px] font-mono text-[#7A9488]">
                    ※ Figures are estimates based on entered fields.
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label htmlFor="bill-notes" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
                  <span>Payment Notes / Instructions</span>
                  <span className="text-[10px] text-[#7A9488]">Optional</span>
                </label>
                <textarea
                  id="bill-notes"
                  rows={3}
                  placeholder="Account number, portal URL, reference codes, bank details..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-white border border-black/12 rounded-sm px-3.5 py-2.5 text-[12px] sm:text-[13px] font-mono text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors leading-relaxed shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-black/8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-mono text-[#4A6358] hover:text-[#1E2D26] border border-black/10 bg-[#E8E4DA] hover:bg-[#E2DED4] rounded-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#386D59] hover:bg-[#2F5C4A] active:bg-[#285041] text-white font-mono text-xs font-semibold rounded-sm transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isSaving ? 'Saving...' : 'Record Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecordForm