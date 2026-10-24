import {
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Sliders,
  Plus
} from 'lucide-react'

const NAV_ITEMS = [
  { key: 'home', label: 'Overview', icon: LayoutDashboard},
  { key: 'finances', label: 'Finances', icon: Receipt},
  { key: 'calendar', label: 'Calendar', icon: CalendarDays},
  { key: 'settings', label: 'Settings', icon: Sliders},
]

type NavbarProps = {
  currentScreen: string
  activeTab: string
  navigate: (screen: string) => void
}

function Navbar({ currentScreen, activeTab, navigate }: NavbarProps) {
  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-[#386D59] backdrop-blur border-b border-black/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 border border-[#F6C163]/40 bg-[#285041] flex items-center justify-center text-[#F6C163] font-serif text-base leading-none">
            <span className="translate-y-0.5">P</span>
          </div>
          <span className="italic font-serif font-medium text-base tracking-wide text-[#FAF8F2]">frugalis</span>
        </div>

        {currentScreen !== 'add-record' && (
          <button
            onClick={() => navigate('add-record')}
            className="bg-[#2F5C4A] hover:bg-[#285041] border border-white/15 text-[#FAF8F2] text-xs font-medium px-3 py-1.5 rounded-sm flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#F6C163]" />
            Record
          </button>
        )}
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
              className={`flex flex-col items-center justify-center py-2.5 pb-4.5 gap-1 text-xs font-medium transition-colors relative ${
                isActive ? 'text-[#FAF8F2]' : 'text-[#A8CABD] hover:text-[#C8E0D6]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#F6C163]" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#F6C163]' : 'text-[#A8CABD]'}`} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

export default Navbar