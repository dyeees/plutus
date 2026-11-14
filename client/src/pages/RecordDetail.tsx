import { ArrowLeft, Edit3, Trash2 } from "lucide-react"

export default function RecordDetail({ navigate }: any) {
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
    </div>
  )
}