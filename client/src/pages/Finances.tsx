import { useState, useRef, useEffect } from 'react'
import { Search, X } from "lucide-react";

import { CLASSIFICATIONS } from './RecordForm'
import Dropdown from '../components/Dropdown';

import { getBills } from '../services/bills'
import { getLoans } from '../services/loans'
import { formatMoney } from '../lib/format'

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
  const [statusFilter, setStatusFilter] = useState('all')
  const searchInputRef = useRef(null)
  
  const sortLabel = (v: string) => 
    SORT_OPTIONS.find(o => o.value === v)?.label ?? SORT_OPTIONS[0].label

  const sortValue = (label: string) =>
    SORT_OPTIONS.find(o => o.label === label)?.value ?? SORT_OPTIONS[0].value

  const [bills, setBills] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])

  useEffect(() => {
    async function fetchRecords() {
      try {
        const [billsData, loansData] = await Promise.all([
          getBills(),
          getLoans(),
        ])
        setBills(billsData)
        setLoans(loansData)
      } catch (error) {
        console.error('Failed to fetch records:', error)
      }
    }
    fetchRecords()
  }, [])

  const records = [
    ...bills.map(bill => ({ ...bill, type: 'bill', dueDate: bill.dueDate, amount: bill.amount, })),
    ...loans.map(loan => ({ ...loan, type: 'loan', dueDate: loan.firstDueDate, amount: loan.totalRepayment, classification: 'Loans', })),
  ]
  
  const filteredRecords = records.filter(record => {
    if (categoryFilter === 'all') return true
    if (categoryFilter === 'Loans') return record.type === 'loan'
    return record.type === 'bill' &&
      record.classification === categoryFilter
  })

  const searchedRecords = filteredRecords.filter(record =>
    record.name.toLowerCase().includes(search.toLowerCase()) ||
    (record.notes || '').toLowerCase().includes(search.toLowerCase()) ||
    (record.classification || 'Loans').toLowerCase().includes(search.toLowerCase())
  )

  const sortedRecords = [...searchedRecords].sort((a, b) => {
    if (sortBy === 'due_asc') return a.dueDate.localeCompare(b.dueDate)
    if (sortBy === 'due_desc') return b.dueDate.localeCompare(a.dueDate)
    if (sortBy === 'amount_desc') return b.amount - a.amount
    if (sortBy === 'amount_asc') return a.amount - b.amount
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-end justify-between gap-1 sm:gap-3 pb-2 border-b border-black/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8860A]">
              General Register
            </span>
            <span className="font-mono text-xs text-[#4A6358]">
              {bills.length + loans.length} Total Commitments
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2D26]">
            Commitments
          </h2>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="border border-black/10 bg-[#EFECE4] rounded-sm p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 mb-3.5">
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
              className="flex-1 min-w-0 sm:flex-none sm:w-48 [&>button]:gap-2 [&>button]:px-3 [&>button]:py-2 [&>button]:text-xs [&>button>svg]:size-3.5 [&>button>span]:min-w-0 [&>button>span]:truncate [&>ul>li]:px-3 [&>ul>li]:py-1.5 [&>ul>li]:text-xs"
            />

            <Dropdown
              id="sort-by"
              value={sortLabel(sortBy)}
              options={SORT_LABELS}
              onChange={label => setSortBy(sortValue(label))}
              className="flex-1 min-w-0 sm:flex-none sm:w-48 [&>button]:gap-2 [&>button]:px-3 [&>button]:py-2 [&>button]:text-xs [&>button>svg]:size-3.5 [&>button>span]:min-w-0 [&>button>span]:truncate [&>ul>li]:px-3 [&>ul>li]:py-1.5 [&>ul>li]:text-xs"
            />
          </div>
        </div>

        {/* Status Filter Tabs & Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-black/8 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[10px] text-[#4A6358] uppercase tracking-wider mr-1">
              Filter:
            </span>

            {[
              { id: 'all', label: 'All(0)' },
              { id: 'unpaid', label: 'Pending(0)' },
              { id: 'paid', label: 'Settled(0)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`font-mono text-xs px-2.5 py-1 rounded-sm transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-[#386D59] text-white font-medium'
                    : 'bg-[#E8E4DA] text-[#4A6358] hover:text-[#1E2D26] border border-black/8'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="font-mono text-xs text-[#4A6358] flex items-center gap-1.5">
            <span>Filtered Total:</span>
            <span className="text-[#1E2D26] font-semibold tabular-numbers">
              00.00
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
    </div>
  )
}