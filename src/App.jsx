import { useState } from 'react'
import {
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Sliders,
} from 'lucide-react'
import './index.css'

const NAV_ITEMS = [
  { key: 'home', label: 'Overview', icon: LayoutDashboard},
  { key: 'bills', label: 'Bills', icon: Receipt},
  { key: 'calendar', label: 'Calendar', icon: CalendarDays},
  { key: 'settings', label: 'Settings', icon: Sliders},
]

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [screenParams, setScreenParams] = useState({})

  const activeTab = ['add-bill', 'edit-bill', 'bill-detail'].includes(currentScreen)
    ? 'bills'
    : currentScreen

  function navigate(screen, params = {}) {
    setCurrentScreen(screen)
    setScreenParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans selection:bg-[#C8860A]/20 selection:text-ink">
      {/* ── Desktop Nav ──*/}
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

          {/* Sidebar Navigation */}
          <nav className="space-y-1">
            <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#A8CABD]">
              Navigation
            </div>
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.key
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium tracking-wide rounded-sm transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-[#285041] text-[#FAF8F2] border-l-2 border-[#F6C163] pl-2.5 shadow-sm'
                      : 'text-[#C8E0D6] hover:text-[#FAF8F2] hover:bg-[#2F5C4A]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F6C163]' : 'text-[#A8CABD]'}`} />
                    <span>{item.label}</span>
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* ── Mobile Nav ──*/}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="md:hidden sticky top-0 z-30 bg-[#386D59] backdrop-blur border-b border-black/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 border border-[#F6C163]/40 bg-[#285041] flex items-center justify-center text-[#F6C163] font-serif text-sm leading-none">
              <span className="translate-y-0.5">P</span>
            </div>
            <div>
              <span className="font-serif font-medium text-base tracking-wide text-[#FAF8F2]">Plutus</span>
              <span className="font-mono text-[9px] text-[#A8CABD] ml-2 tracking-widest uppercase">(Tracker?)</span>
            </div>
          </div>
        </header>

        {/* Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#386D59] border-t border-black/10 grid grid-cols-4 safe-area-bottom">
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.key
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-medium transition-colors relative ${
                  isActive ? 'text-[#FAF8F2]' : 'text-[#A8CABD] hover:text-[#C8E0D6]'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#F6C163]" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F6C163]' : 'text-[#A8CABD]'}`} />
                <span className="tracking-wide">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default App
