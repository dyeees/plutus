import { LogOut, LoaderCircle } from 'lucide-react'

type SettingsProps = {
  user: {
    name: string
    email: string
  } | null
  signOut: () => void
  isLoggingOut: boolean
}

function Settings({ user, signOut, isLoggingOut }: SettingsProps) {
  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="pb-2 border-b border-black/10">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2D26]">
          Settings
        </h2>
      </div>

      {/* Account Card */}
      <div className="border border-black/10 bg-[#EFECE4] rounded-sm p-5 sm:p-6 space-y-4">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8860A]">
          Account
        </span>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 rounded-sm bg-[#285041] border border-[#F6C163]/40 flex items-center justify-center text-[#F6C163] font-serif text-sm leading-none">
            {(user?.name || 'F').trim().charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#1E2D26] truncate">
              {user?.name || 'Ledger Owner'}
            </p>
            <p className="font-mono text-[11px] text-[#4A6358] truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-black/10">
          <button
            type="button"
            onClick={signOut}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 bg-[#386D59] hover:bg-[#2F5C4A] active:bg-[#285041] disabled:opacity-60 disabled:cursor-not-allowed text-white font-mono font-semibold text-xs tracking-wide px-4 py-3 rounded-sm shadow-sm transition-colors duration-150"
          >
            {isLoggingOut ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                <span>Signing out…</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
