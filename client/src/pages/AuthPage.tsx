import { useState } from 'react'
import { Receipt, CalendarDays, Cloud } from 'lucide-react'
import peonies from '../assets/peonies.svg'

function AuthPage() {
  const [entryOpen, setEntryOpen] = useState(false)

  return (
    <div className={`relative min-h-screen flex flex-col lg:flex-row text-[#1E2D26] font-sans overflow-hidden lg:overflow-visible ${entryOpen ? 'bg-[#F7F4EE]' : 'bg-[#386D59]'} lg:bg-[#F7F4EE]`}>
      {/* Left Desktop Panel */}
      <aside className={`absolute inset-0 z-0 ${entryOpen ? 'hidden' : 'flex'} h-full w-full flex-col justify-start overflow-hidden bg-[#386D59] px-5 pt-4 sm:px-8 sm:pt-5 lg:relative lg:inset-auto lg:top-auto lg:z-10 lg:flex lg:h-auto lg:min-h-0 lg:justify-between lg:border-r lg:border-black/20 lg:w-[46%] lg:p-9 xl:w-[43%] xl:p-12`}>
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
          <p className="hidden sm:block font-serif italic text-sm text-[#C8E0D6] max-w-[240px]">
            “A ledger is a promise kept in writing.”
          </p>
          <div className="text-right shrink-0">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#A8CABD]">
              Cloud-based Storage
            </p>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#6FD4A4] flex items-center justify-end gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6FD4A4]" />
              Synced
            </p>
          </div>
        </div>
      </aside>
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

export default AuthPage