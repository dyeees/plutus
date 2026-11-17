import { useState } from 'react'
import { 
  ArrowLeft, Edit3, Trash2, Repeat, Check, Clock, AlertCircle, 
  Calendar, Layers, FileText, TrendingDown, ShieldCheck, Hash 
} from "lucide-react"

import { formatMoney, formatCategory, formatLongDate } from '../lib/format'
import { payBillOccurrence } from '../services/bills'
import { payLoanInstallment } from '../services/loans'

export default function RecordDetail({ record, navigate }: any) {
  const categoryKey = (record?.classification || 'Housing') as keyof typeof formatCategory
  const catConfig = formatCategory[categoryKey] ?? formatCategory.Housing
  
  const [isPaid, setIsPaid] = useState(record?.status === 'paid' || Boolean(record?.isPaid))
  const [isUpdating, setIsUpdating] = useState(false)
  const isOverdue = !isPaid && record?.dueDate && new Date(record.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
  
  const loan = record?.type === 'loan' ? {
    total: record.installmentCount || 1,
    paid: isPaid ? 1 : 0,
    amount: Number(record.amount || 0),
    totalRepayment: Number(record.totalRepayment || 0),
  } : null

  async function togglePaid() {
    try {
      setIsUpdating(true)
      const nextStatus = !isPaid

      if (record?.type === 'bill') {
        await payBillOccurrence(record.id, record.occurrenceId)
      } else {
        await payLoanInstallment(record.id, record.installmentId)
      }

      setIsPaid(nextStatus)
    } catch (error) {
      console.error('Failed to toggle status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!record) return null
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
        <button
          onClick={() => navigate('finances')}
          className="text-xs font-mono text-[#4A6358] hover:text-[#1E2D26] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Finances</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            /*onClick={}*/
            className="text-xs font-mono text-[#1E2D26] hover:text-[#C8860A] px-3 py-1.5 rounded-sm border border-black/10 bg-[#EFECE4] hover:bg-[#E8E4DA] flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Entry</span>
          </button>
          <button
            /*onClick={}*/
            className="text-xs font-mono text-[#C0392B] hover:text-white px-3 py-1.5 rounded-sm border border-[#C0392B]/30 bg-[#C0392B]/8 hover:bg-[#C0392B] flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      <div className="border border-black/10 bg-[#EFECE4] rounded-sm divide-y divide-black/8 shadow-sm">
        {/* Header Strip */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#7A9488]">
            <span>STATEMENT ID: {record?.type === 'loan' ? 'LN' : 'BL'}-{String(record?.id || 0).padStart(4, '0')}</span>
            <span>CYCLE: OCTOBER 2026</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded-xs border"
                  style={{
                    color: catConfig.color,
                    backgroundColor: catConfig.bg,
                    borderColor: catConfig.border,
                  }}
                >
                  {catConfig.label}
                </span>
                <span className="font-mono text-xs text-[#4A6358] flex items-center gap-1">
                  <Repeat className="w-3 h-3 text-[#C8860A]" />
                  {record?.recurrence}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2D26]">
                {record?.name}
              </h2>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-black/8">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A9488] block">
                Total Amount To Pay
              </span>
              <span className="font-mono text-3xl sm:text-4xl font-semibold tabular-numbers text-[#1E2D26]">
                {formatMoney(Number(record?.amount || 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Settlement Status Banner */}
        <div className="p-4 sm:p-5 bg-[#E8E4DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className={`w-9 h-9 rounded-sm border flex items-center justify-center shrink-0 ${
              isPaid 
                ? 'bg-[#2E7D52]/12 text-[#2E7D52] border-[#2E7D52]/30' 
                : isOverdue
                  ? 'bg-[#C0392B]/12 text-[#C0392B] border-[#C0392B]/30'  
                  : 'bg-[#C8860A]/12 text-[#C8860A] border-[#C8860A]/30'
              }`}
            >
              {isPaid ? (
                <Check className="w-5 h-5 stroke-[2.5]" />
              ) : isOverdue ? (
                <AlertCircle className="w-5 h-5 stroke-2" />
              ) : (
                <Clock className="w-5 h-5 stroke-2" />
              )}
            </div>

            <div>
              <div className="font-serif text-base text-[#1E2D26]">
                {isPaid ? 'Settled & Cleared' : isOverdue ? 'Overdue Payment' : 'Outstanding Amount'}
              </div>
              <p className="font-mono text-xs text-[#4A6358]">
                {isPaid
                  ? `Marked paid on ${formatLongDate(record?.paidAt || record?.dueDate)}`
                  : isOverdue
                    ? `Not paid since ${formatLongDate(record?.dueDate)}`
                    : `Payment scheduled for ${formatLongDate(record?.dueDate)}`
                }
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isUpdating}
            onClick={togglePaid}
            className={`font-mono text-xs font-semibold px-4 py-2.5 rounded-sm border transition-all duration-150 flex items-center justify-center gap-1.5 shrink-0 ${
              isPaid
                ? 'border-black/15 bg-white text-[#4A6358] hover:text-[#1E2D26] hover:border-black/25'
                : 'border-[#2E7D52] bg-[#2E7D52] text-white hover:bg-[#256645]'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>
              {isUpdating ? 'Updating...' : isPaid ? 'Reopen as Unpaid' : 'Settle This Bill'}
            </span>
          </button>
        </div>

        {/* Specifications */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-white border border-black/10 rounded-xs space-y-1 shadow-sm">
            <span className="text-[#7A9488] block uppercase tracking-wider text-[10px]">
              Due Date / Scheduled Date
            </span>
            <div className="text-sm font-semibold text-[#1E2D26] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C8860A]" />
              <span>{formatLongDate(record.dueDate)}</span>
            </div>
            <p className="text-[11px] text-[#7A9488]">
              {isPaid 
                ? 'Payment completed' 
                : (() => {
                    const diffDays = Math.ceil((new Date(record.dueDate).getTime() - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))
                    if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} past due`
                    if (diffDays === 0) return 'Due today'
                    return `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`
                  })()}
            </p>
          </div>
          
          <div className="p-3 bg-white border border-black/10 rounded-xs space-y-1 shadow-sm">
            <span className="text-[#7A9488] block uppercase tracking-wider text-[10px]">
              Classification
            </span>
            <div className="text-sm font-semibold text-[#1E2D26] flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#C8860A]" />
              <span>{record.classification}</span>
            </div>
            <p className="text-[11px] text-[#7A9488]">Recurrence: {record.recurrence}</p>
          </div>
        </div>

        {/* Loan Installment Progress */}
        {loan && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#7A9488] flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-[#0F766E]" />
                Loan Installment Tracker
              </span>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-xs border flex items-center gap-1 ${
                  loan.total - loan.paid === 0
                    ? 'text-[#2E7D52] bg-[#2E7D52]/10 border-[#2E7D52]/25'
                    : 'text-[#C8860A] bg-[#C8860A]/10 border-[#C8860A]/25'
                }`}
              >
                {loan.total - loan.paid === 0 ? (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    Fully Settled
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    {loan.total - loan.paid} Remaining
                  </>
                )}
              </span>
            </div>

            
          </div>
        )}

        {/* Optional Notes & Instructions */}
        {record.notes && (
          <div className="p-5 sm:p-6 space-y-2">
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#7A9488] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#C8860A]" />
              Payment Notes &amp; Instructions
            </span>
            <p className="font-mono text-xs text-[#1E2D26] bg-white border border-black/10 p-3.5 rounded-xs whitespace-pre-line leading-relaxed shadow-sm">
              {record.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}