export default function Dashboard() {
  return (
    <div className="space-y-7">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-black/10">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2D26]">
          Monthly Commitments &amp; Payments
        </h2>

        <div className="flex flex-col items-end text-right gap-1">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8860A] bg-[#C8860A]/10 px-2 py-0.5 rounded-sm border border-[#C8860A]/25">
            Billing Cycle
          </span>
          <span className="font-mono text-xs text-[#4A6358]">
            October 1 – 31, 2026
          </span>
        </div>
      </div>
    </div>
  );
}