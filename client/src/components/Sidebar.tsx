import {
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Sliders,
  Plus,
  LogOut,
  LoaderCircle,
} from 'lucide-react'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'finances', label: 'Finances', icon: Receipt },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'settings', label: 'Settings', icon: Sliders },
]

type SidebarProps = {
  activeTab: string
  navigate: (screen: string) => void
  user: {
    name: string
    email: string
  } | null
  signOut: () => void
  isLoggingOut: boolean
}

function Sidebar({ activeTab, navigate, user, signOut, isLoggingOut  }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#386D59] border-r border-black/10 p-5 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Brand */}
        <div className="px-1.5 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#F6C163]/50 bg-[#285041] flex items-center justify-center text-[#F6C163] font-serif font-medium text-lg tracking-wider rounded-sm shadow-inner">
              <span className="translate-y-0.5">P</span>
            </div>
            <div>
              <h1 className="font-serif font-medium text-xl uppercase tracking-wide text-[#FAF8F2] leading-tight">
                Plutus
              </h1>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A8CABD]">
                Bill Tracker
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate('add-record')}
            className="w-full group flex items-center justify-between px-3.5 py-2.5 bg-[#2F5C4A] hover:bg-[#285041] border border-white/15 hover:border-[#F6C163]/60 text-[#FAF8F2] font-medium text-xs tracking-wide rounded-sm transition-all duration-150"
          >
            <span className="flex items-center gap-2">
              <Plus className="translate-y-px w-3.5 h-3.5 text-[#F6C163] group-hover:rotate-90 transition-transform duration-200" />
              <span className="text-[13px]">Record Bill</span>
            </span>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-1">
          <div className="pt-4 border-t border-white/15 space-y-3 px-1"/>
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.key
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium tracking-wide rounded-sm transition-all duration-150 text-left ${
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

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/15 space-y-3 px-1">
          <div className="flex items-center gap-2.5 p-2 bg-[#2F5C4A] border border-white/10 rounded-sm">
            <div className="w-7 h-7 shrink-0 rounded-sm bg-[#285041] border border-[#F6C163]/40 flex items-center justify-center text-[#F6C163] font-serif text-sm leading-none">
              {(user?.name || 'F').trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-[#FAF8F2] truncate">
                {user?.name || 'Ledger Owner'}
              </p>
              <p className="font-mono text-[9px] text-[#A8CABD] truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              disabled={isLoggingOut}
              title={isLoggingOut ? 'Logging out...' : 'Sign out'}
              aria-label={isLoggingOut ? 'Logging out' : 'Sign out'}
              className="p-1.5 shrink-0 text-[#A8CABD] hover:text-[#F6C163] hover:bg-[#285041] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>       
      </div>
    </aside>
  )
}

export default Sidebar