import { useEffect, useState } from 'react'
import { Receipt, Plus, Check, ShieldCheck } from "lucide-react";

import { getBills, payBillOccurrence } from '../services/bills'
import { getLoans, payLoanInstallment } from '../services/loans'
import { formatMoney, formatLongDate } from '../lib/format'

type DashboardProps = {
  navigate: (screen: string, params?: { returnTo?: string; record?: any }) => void;
};

export default function Dashboard({ navigate }: DashboardProps) {
  const [bills, setBills] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchRecords() {
      try {
        const [billData, loanData] = await Promise.all([
          getBills(),
          getLoans(),
        ])

        setBills(billData)
        setLoans(loanData)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load records.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecords()
  }, [])

  const hasRecords = bills.length > 0 || loans.length > 0

  const records = [
    ...bills.map(b => ({
      amount: Number(b.amount || 0),
      isPaid: b.status === 'paid',
    })),
    ...loans.map(l => ({
      amount: Number(l.amountDue || (l.totalRepayment / (l.installmentCount || 1)) || 0),
      isPaid: l.status === 'paid',
    })),
  ]

  const [isSettling, setIsSettling] = useState(false)

  async function handleSettle(item: any) {
    try {
      setIsSettling(true)
      if (item.type === 'bill') {
        await payBillOccurrence(item.id, item.occurrenceId)
      } else {
        await payLoanInstallment(item.id, item.installmentId)
      }
      const [billData, loanData] = await Promise.all([getBills(), getLoans()])
      setBills(billData)
      setLoans(loanData)
    } catch (err) {
      console.error('Failed to settle bill:', err)
    } finally {
      setIsSettling(false)
    }
  }

  const totalCommitted = records.reduce((sum, r) => sum + r.amount, 0)
  const settledRecords = records.filter(r => r.isPaid)
  const pendingRecords = records.filter(r => !r.isPaid)
  const settledAmount = settledRecords.reduce((sum, r) => sum + r.amount, 0)
  const outstandingAmount = pendingRecords.reduce((sum, r) => sum + r.amount, 0)
  const percentSettled = totalCommitted > 0 ? Math.round((settledAmount / totalCommitted) * 100) : 0

  const allUnpaid = [
    ...bills.filter(b => b.status !== 'paid').map(b => ({
      ...b,
      type: 'bill',
      amount: Number(b.amount || 0),
      category: b.classification || 'Utilities',
    })),
    ...loans.filter(l => l.status !== 'paid').map(l => ({
      ...l,
      type: 'loan',
      amount: Number(l.amountDue || (l.totalRepayment / (l.installmentCount || 1)) || 0),
      category: 'Loans',
      dueDate: l.dueDate || l.firstDueDate,
    })),
  ].sort((a, b) => String(a.dueDate || '').localeCompare(String(b.dueDate || '')))
  const nextBill = allUnpaid[0]

  const nextBillStatus = nextBill ? (() => {
    const diffDays = Math.ceil((new Date(nextBill.dueDate).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return { label: `${Math.abs(diffDays)}d Overdue`, isUrgent: true }
    if (diffDays === 0) return { label: 'Due Today', isUrgent: true }
    if (diffDays <= 3) return { label: `Due in ${diffDays}d`, isUrgent: true }
    return { label: `Due in ${diffDays}d`, isUrgent: false }
  })() : null

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-end justify-between gap-1 sm:gap-3 pb-2 border-b border-black/10">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2D26]">
          Monthly Overview
        </h2>

        <div className="flex flex-row items-center text-left sm:flex-col sm:items-end sm:text-right gap-2 sm:gap-1">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8860A] bg-[#C8860A]/10 px-2 py-0.5 rounded-sm border border-[#C8860A]/25">
            Billing Cycle
          </span>
          <span className="font-mono text-xs text-[#4A6358]">
            October 1 – 31, 2026
          </span>
        </div>
      </div>

      {isLoading && (<p className="text-xs font-mono text-[#4A6358]"> Loading records... </p>)}
      {!isLoading && error && (<p className="text-sm text-red-700"> {error} </p>)}

      {/* Empty State */}
      {!isLoading && !error && !hasRecords && (
        <div className="border border-black/10 bg-[#EFECE4] rounded-sm p-10 text-center space-y-4">
          <div className="w-12 h-12 border border-black/10 bg-[#E8E4DA] text-[#4A6358] rounded-sm flex items-center justify-center mx-auto">
            <Receipt className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-serif text-lg text-[#1E2D26]">No commitments recorded</h3>
            <p className="font-mono text-xs text-[#4A6358] leading-relaxed">
              Your ledger is currently clear. Record your monthly obligations to start tracking due dates.
            </p>
          </div>
          <button
            onClick={() => navigate('add-record', { returnTo: 'dashboard' })}
            className="inline-flex items-center gap-1.5 bg-[#386D59] hover:bg-[#2F5C4A] text-white text-xs font-semibold px-4 py-2 rounded-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Record First Bill
          </button>
        </div>
      )}

      {/* Records exist */}
      {!isLoading && !error && hasRecords && (
        <>
        <div className="border border-black/10 bg-[#EFECE4] rounded-sm divide-y sm:divide-y-0 sm:divide-x divide-black/8 grid grid-cols-1 sm:grid-cols-3">
          {/* Column 1: Total Committed */}
          <div className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase text-[#4A6358]">
              <span>Total Commitment</span>
              <span className="text-[#7A9488]">{bills.length + loans.length} bills</span>
            </div>
              <div className="font-mono text-2xl sm:text-3xl font-medium tabular-numbers text-[#1E2D26]">
                {formatMoney(totalCommitted)}
              </div>
            <p className="text-[11px] text-[#7A9488] font-mono">Full monthly obligation</p>
          </div>

          {/* Column 2: Settled to Date */}
          <div className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase text-[#4A6358]">
              <span className="text-[#2E7D52] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D52]" />
                Settled
              </span>
                <span className="text-[#2E7D52] font-mono">{percentSettled}%</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-medium tabular-numbers text-[#2E7D52]">
              {formatMoney(settledAmount)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#7A9488] font-mono">
              <span>{settledRecords.length} cleared</span>
              <span>{pendingRecords.length} pending</span>
            </div>
          </div>

          {/* Column 3: Remaining Outflow */}
          <div className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase text-[#4A6358]">
              <span className="text-[#C8860A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8860A]" />
                Outstanding
              </span>
                <span className="text-[#C8860A] font-mono">{pendingRecords.length} due</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-medium tabular-numbers text-[#1E2D26]">
              {formatMoney(outstandingAmount)}
            </div>
            <p className="text-[11px] text-[#7A9488] font-mono">Remaining to clear this cycle</p>
          </div>
        </div>
        
          {nextBill ? (
            <div className="relative border border-[#C8860A]/30 bg-linear-to-r from-[#FDF8F0] to-[#FAF5E8] rounded-sm p-5 sm:p-6 shadow-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden opacity-10">
                <div className="rotate-45 transform origin-bottom-left translate-x-8 -translate-y-4 font-mono text-[10px] tracking-widest text-[#C8860A] uppercase border-b border-[#C8860A] py-1 text-center">
                  PAYMENT SLIP
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-xs bg-[#C8860A]/12 text-[#C8860A] border border-[#C8860A]/30 font-medium">
                      Next Due Obligation
                    </span>
                    {nextBillStatus && (
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded-xs ${
                          nextBillStatus.isUrgent
                            ? 'bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/30'
                            : 'bg-[#EFECE4] text-[#4A6358] border border-black/10'
                        }`}
                      >
                        {nextBillStatus.label}
                      </span>
                    )}
                    <span className="font-mono text-xs text-[#7A9488]">
                      Due {formatLongDate(nextBill.dueDate)}
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => navigate('record-detail', { record: nextBill, returnTo: 'dashboard' })}
                      className="font-serif text-xl sm:text-2xl text-[#1E2D26] hover:text-[#C8860A] transition-colors cursor-pointer"
                    >
                      {nextBill.name}     
                    </h3>
                    <p className="text-xs text-[#4A6358] mt-0.5 font-mono">
                      Category: <span className="text-[#1E2D26]">{nextBill.category}</span> · Recurrence: {nextBill.recurrence}
                      {nextBill.notes && <span className="text-[#7A9488]"> — {nextBill.notes}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-4 sm:pt-0 border-black/10">
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A9488] block">
                      Amount Due
                    </span>
                    <span className="font-mono text-2xl sm:text-3xl font-semibold tabular-numbers text-[#1E2D26]">
                      {formatMoney(nextBill.amount)}
                    </span>
                  </div>

                  <button
                    disabled={isSettling}
                    onClick={() => handleSettle(nextBill)}
                    className="bg-[#386D59] hover:bg-[#2F5C4A] active:bg-[#285041] disabled:opacity-50 text-white font-semibold text-xs tracking-wide px-4 py-2.5 rounded-sm flex items-center gap-1.5 shadow-sm transition-all duration-150 shrink-0"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{isSettling ? 'Settling...' : 'Settle Bill'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-[#2E7D52]/30 bg-[#2E7D52]/10 rounded-sm p-4 sm:p-5 flex items-center gap-3.5 text-[#2E7D52]">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div className="text-xs font-mono">
                <span className="font-semibold block text-sm text-[#1E2D26]">Ledger Balanced &amp; Fully Settled</span>
                <span className="text-[#4A6358]">
                  All recorded obligations for this cycle have been cleared. No outstanding liabilities remain.
                </span>     
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}