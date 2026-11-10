import { useState, useRef } from 'react'
import { Search, X } from "lucide-react";

import { CLASSIFICATIONS } from './RecordForm'

type FinancesProps = {
  navigate: (screen: string, params?: { returnTo?: string }) => void;
};

export default function Finances({ navigate }: FinancesProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const searchInputRef = useRef(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse sm:flex-row sm:items-end justify-between gap-1 sm:gap-3 pb-2 border-b border-black/10">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2D26]">
          Commitments
        </h2>
      </div>

      {/* Search & Filter */}
      <div className="border border-black/10 bg-[#EFECE4] rounded-sm p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#7A9488]" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search payees, categories, notes... (Press '/' to focus)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-sm pl-9 pr-8 py-2 text-xs font-mono text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-[#7A9488] hover:text-[#1E2D26]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-white border border-black/10 rounded-sm px-3 py-2 text-xs font-mono text-[#1E2D26] focus:outline-none focus:border-[#C8860A] shadow-sm"
            >
              <option value="all">All Categories</option>

              {CLASSIFICATIONS.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}

              <option value="Loans">Loans</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}