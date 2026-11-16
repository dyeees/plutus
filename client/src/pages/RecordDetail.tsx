import { ArrowLeft, Edit3, Trash2, Repeat } from "lucide-react"

import { formatMoney, formatCategory } from '../lib/format'

export default function RecordDetail({ record, navigate }: any) {
  const categoryKey = (record?.classification || 'Housing') as keyof typeof formatCategory
  const catConfig = formatCategory[categoryKey] ?? formatCategory.Housing
  
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
      </div>
    </div>
  )
}