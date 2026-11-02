import { Receipt, Plus } from "lucide-react";

type DashboardProps = {
  navigate: (screen: string, params?: { returnTo?: string }) => void;
};

export default function Dashboard({ navigate }: DashboardProps) {
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

      {/* Empty State */}
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
    </div>
  );
}