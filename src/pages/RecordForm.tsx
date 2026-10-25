import { useState } from 'react'

const CLASSIFICATIONS = [
  'Housing',
  'Utilities',
  'Subscriptions',
  'Loans',
]

function RecordForm () {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [classification, setClassification] = useState('Utilities')

  function adjustAmount(delta) {
    const current = parseFloat(amount) || 0
    const next = Math.max(0, current + delta)
    setAmount(next.toFixed(2))
  }

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Amount */}
          <div className="space-y-1.5">
            <label htmlFor="record-amount" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
              <span>Installment Amount <strong className="text-[#C8860A]">*</strong></span>
              <span className="text-[10px] text-[#7A9488] font-mono mr-2">PHP</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-[0.54rem] font-mono text-[#C8860A]">
                ₱
              </span>
              <input
                id="record-amount"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white border border-black/12 rounded-sm pl-8 pr-3.5 py-2.5 text-sm font-mono font-semibold tabular-numbers text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
              />
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              {[100, 500, 1000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => adjustAmount(val)}
                  className="font-mono text-[10px] px-2 py-0.5 bg-[#E8E4DA] hover:bg-[#E2DED4] border border-black/8 text-[#4A6358] hover:text-[#1E2D26] rounded-xs transition-colors"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/*Classification */}
          <div className="space-y-1.5">
            <label htmlFor="record-classification" className="text-xs font-mono text-[#4A6358] flex items-center justify-between">
              Expense Classification
            </label>
            <select
              id="record-classification"
              value={classification}
              onChange={e => setClassification(e.target.value)}
              className="w-full bg-white border border-black/12 rounded-sm px-3.5 py-2.5 text-sm font-mono text-[#1E2D26] focus:outline-none focus:border-[#C8860A] shadow-sm"
            >
              {CLASSIFICATIONS.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RecordForm