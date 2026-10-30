import { useState } from 'react'
import { Receipt, CalendarDays, Cloud } from 'lucide-react'
import peonies from '../assets/peonies.svg'

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  
  return (
    <div className={`relative min-h-screen flex flex-col lg:flex-row text-[#1E2D26] font-sans overflow-hidden lg:overflow-visible bg-[#386D59] lg:bg-[#F7F4EE]`}>
      {/* Left Desktop Panel */}
      <aside className={`absolute inset-0 z-0 flex h-full w-full flex-col justify-start overflow-hidden bg-[#386D59] px-5 pt-4 sm:px-8 sm:pt-5 lg:relative lg:inset-auto lg:top-auto lg:z-10 lg:flex lg:h-auto lg:min-h-0 lg:justify-between lg:border-r lg:border-black/20 lg:w-[46%] lg:p-9 xl:w-[43%] xl:p-12`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10] lg:opacity-[0.12] bg-repeat"
          style={{ backgroundImage: `url(${peonies})`, backgroundSize: '360px' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#386D59]/60 via-transparent to-[#285041]/80" />

        <div className="relative hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#F6C163]/50 bg-[#285041] flex items-center justify-center text-[#F6C163] font-serif font-medium text-lg tracking-wider rounded-sm shadow-inner">
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

        <div className="relative max-w-sm my-10 hidden lg:block">
          <div className="hidden lg:inline-flex items-center gap-2 mb-5 px-2.5 py-1 border border-[#F6C163]/30 bg-[#285041]/70 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F6C163]" />
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#F6C163]">
              Private Tracker · Est. 2026
            </span>
          </div>

          <h2 className="font-serif text-[22px] leading-tight sm:text-4xl lg:leading-[1.1] xl:text-[42px] text-[#FAF8F2] tracking-tight">
            Every bill,
            <br className="hidden lg:block" />{' '}accounted for.
          </h2>
          <p className="hidden lg:block mt-4 text-sm text-[#C8E0D6] leading-relaxed">
            Your household bills, all in one place. Track what is due, settle it, and keep the record straight.
          </p>

          <div className="mt-9 space-y-4 hidden lg:block">
            <Feature
              icon={Receipt}
              title="Recurring schedules"
              note="Settled bills roll forward to the next cycle automatically."
            />
            <Feature
              icon={CalendarDays}
              title="Timeline view"
              note="See every due date laid out across the month."
            />
            <Feature
              icon={Cloud}
              title="Cloud storage"
              note="Access your household records across devices."
            />
          </div>
        </div>

        <div className="relative border-t border-white/15 pt-5 hidden lg:flex items-center justify-between gap-4">
          <p className="hidden sm:block font-serif italic text-sm text-[#C8E0D6] max-w-60">
            “A clearer view of every commitment.”
          </p>
          <div className="text-right shrink-0">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#A8CABD]">
              Cloud-based
            </p>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#6FD4A4] flex items-center justify-end gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6FD4A4]" />
              Synced
            </p>
          </div>
        </div>
      </aside>

      {/* Access Column */}
      <main className="relative z-20 flex-1 flex flex-col min-h-screen lg:min-h-0">
        <div className="flex-1 flex flex-col lg:flex-row items-stretch lg:items-center justify-center px-4 py-4 sm:px-8 sm:py-8 lg:p-12">
          <div
            className={`relative w-full max-w-107.5 mx-auto flex flex-1 flex-col rounded-sm border border-black/10 bg-[#F7F4EE]/92 px-4 pb-4 pt-1 shadow-[0_10px_30px_-12px_rgba(30,45,38,0.35)] backdrop-blur-md backdrop-saturate-150 [text-shadow:0_1px_0_rgba(255,255,255,0.6)] sm:px-5 sm:pb-6 sm:pt-2 lg:my-0 lg:block lg:flex-none lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none lg:backdrop-saturate-100 lg:text-shadow:none`}
          >
            <div className="flex flex-1 flex-col justify-center pt-6 lg:block lg:flex-none lg:justify-start">
              <div className="lg:hidden relative mx-auto mb-5 w-14 h-14">
                <div className="absolute -inset-2 rounded-sm bg-[#C8860A]/20 blur-xl" />
                <div className="relative w-full h-full border border-[#C8860A]/60 bg-linear-to-br from-[#386D59] to-[#285041] flex items-center justify-center text-[#F6C163] font-serif font-medium text-2xl leading-none rounded-sm shadow-[0_8px_20px_-8px_rgba(40,80,65,0.6)] ring-1 ring-[#F6C163]/15">
                  <span className="translate-y-0.5">P</span>
                </div>
              </div>
            </div>

            <FormHeading isSignUp={isSignUp} className="mb-6 lg:mb-4" />

          </div>
        </div>
      </main>
    </div>
  )
}

function Feature({ icon: Icon, title, note }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 shrink-0 rounded-sm border border-white/15 bg-[#2F5C4A] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#F6C163]" />
      </div>
      <div className="pt-0.5">
        <p className="text-xs font-semibold text-[#FAF8F2] tracking-wide">{title}</p>
        <p className="text-[11px] text-[#A8CABD] leading-relaxed mt-0.5">{note}</p>
      </div>
    </div>
  )
}

function FormHeading({ isSignUp, className = '' }) {
  return (
    <div className={className}>
      <div className="hidden lg:flex items-center gap-2 mb-2">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8860A] bg-[#C8860A]/10 px-2 py-0.5 rounded-sm border border-[#C8860A]/25">
          {isSignUp ? 'New Account' : 'Access'}
        </span>
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#7A9488]">
          Folio Ledger
        </span>
      </div>
      <h2 className="font-serif text-[24px] sm:text-3xl font-medium tracking-tight text-[#1E2D26] text-center lg:text-left">
        {isSignUp ? 'Register' : 'Sign In'}
      </h2>
      <p className="text-[13px] mt-1.5 lg:mt-1 leading-relaxed text-[#4A6358] text-center lg:text-left">
        {isSignUp ? 'Create an account to get started.' : 'Enter your details to continue.'}
      </p>
    </div>
  )
}

export default AuthPage