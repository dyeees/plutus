import './index.css'

function App() {

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans selection:bg-[#C8860A]/20 selection:text-ink">
      {/* ── Sidebar ──*/}
      <aside className="hidden md:flex flex-col w-64 bg-[#386D59] border-r border-black/10 p-5 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Brand */}
          <div className="px-1.5 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-[#F6C163]/50 bg-[#285041] flex items-center justify-center text-[#F6C163] font-serif font-medium text-lg tracking-wider rounded-sm shadow-inner">
                <span className="translate-y-0.5">P</span>
              </div>
              <div>
                <h1 className="font-serif font-medium text-lg uppercase tracking-wide text-[#FAF8F2] leading-tight">
                  Plutus
                </h1>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A8CABD]">
                  Bill Tracker
                </p>
              </div>
            </div>
          </div>
        
        </div>
      </aside>
    </div>
  )
}

export default App
