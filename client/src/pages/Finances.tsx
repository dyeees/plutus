import { useState, useRef } from 'react'
import { Search, X } from "lucide-react";

import { CLASSIFICATIONS } from './RecordForm'
import Dropdown from '../components/Dropdown';

type FinancesProps = {
  navigate: (screen: string, params?: { returnTo?: string }) => void;
};

const CATEGORY_OPTIONS = ['All Categories', ...CLASSIFICATIONS, 'Loans']
const SORT_OPTIONS = [
  { value: 'due_asc', label: 'Due Date (Earliest)' },
  { value: 'due_desc', label: 'Due Date (Latest)' },
  { value: 'amount_desc', label: 'Amount (Highest)' },
  { value: 'amount_asc', label: 'Amount (Lowest)' },
  { value: 'name_asc', label: 'Payee Name (A-Z)' },
] as const
const SORT_LABELS = SORT_OPTIONS.map(o => o.label)

export default function Finances({ navigate }: FinancesProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('due_asc')
  const searchInputRef = useRef(null)
  
  const sortLabel = (v: string) => 
    SORT_OPTIONS.find(o => o.value === v)?.label ?? SORT_OPTIONS[0].label

  const sortValue = (label: string) =>
    SORT_OPTIONS.find(o => o.label === label)?.value ?? SORT_OPTIONS[0].value

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
            <Dropdown
              id="category-filter"
              value={categoryFilter === 'all' ? 'All Categories' : categoryFilter}
              options={CATEGORY_OPTIONS}
              onChange={value =>
                setCategoryFilter(value === 'All Categories' ? 'all' : value)
              }
              className="w-40 [&>button]:gap-2 [&>button]:px-3 [&>button]:py-2 [&>button]:text-xs [&>ul>li]:px-3 [&>ul>li]:py-1.5 [&>ul>li]:text-xs"
            />

            <Dropdown
              id="sort-by"
              value={sortLabel(sortBy)}
              options={SORT_LABELS}
              onChange={label => setSortBy(sortValue(label))}
              className="w-48 [&>button]:gap-2 [&>button]:px-3 [&>button]:py-2 [&>button]:text-xs [&>ul>li]:px-3 [&>ul>li]:py-1.5 [&>ul>li]:text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}