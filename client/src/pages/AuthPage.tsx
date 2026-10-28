import { useState } from 'react'
import peonies from '../assets/peonies.svg'

function AuthPage() {
  const [entryOpen, setEntryOpen] = useState(false)

  return (
    <div className={`relative min-h-screen flex flex-col lg:flex-row text-[#1E2D26] font-sans overflow-hidden lg:overflow-visible ${entryOpen ? 'bg-[#F7F4EE]' : 'bg-[#386D59]'} lg:bg-[#F7F4EE]`}>
      {/* Left Panel */}
      <aside className={`absolute inset-0 z-0 ${entryOpen ? 'hidden' : 'flex'} h-full w-full flex-col justify-start overflow-hidden bg-[#386D59] px-5 pt-4 sm:px-8 sm:pt-5 lg:relative lg:inset-auto lg:top-auto lg:z-10 lg:flex lg:h-auto lg:min-h-0 lg:justify-between lg:border-r lg:border-black/20 lg:w-[46%] lg:p-9 xl:w-[43%] xl:p-12`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10] lg:opacity-[0.12] bg-repeat"
          style={{ backgroundImage: `url(${peonies})`, backgroundSize: '360px' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#386D59]/60 via-transparent to-[#285041]/80" />
      </aside>
    </div>
  )
}

export default AuthPage