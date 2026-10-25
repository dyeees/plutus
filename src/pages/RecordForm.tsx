import { useState } from 'react'


function RecordForm () {
  const [name, setName] = useState('')

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8860A]">
            Ledger Entry
          </span>
          <h2 className="font-serif text-2xl font-medium tracking-tight text-[#1E2D26] mt-0.5">
            Record New Commitment
          </h2>
        </div>
      </div>

      {/* Form Card */}
      <form className="border border-black/10 bg-[#EFECE4] rounded-sm p-5 sm:p-6 space-y-5">
        {/* Obligation Name */}
        <div className="space-y-1.5">
          <label htmlFor="record-name" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
            <span>Payee or Obligation Name <strong className="text-[#C8860A]">*</strong></span>
            {/*<span className="text-[10px] text-[#7A9488]">e.g. BDO Personal Loan, Home Loan</span>*/}
          </label>
          <input
            id="record-name"
            type="text"
            required
            placeholder="e.g. Personal Loan — BDO, Car Loan, HDMF"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white border border-black/12 font-mono px-3.5 py-2.5 text-sm text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
          />
        </div>
      </form>
    </div>
  )
}

export default RecordForm