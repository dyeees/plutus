import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronDown } from 'lucide-react'

type DropdownProps<T extends string> = {
  id: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
}

function Dropdown<T extends string>({
  id,
  value,
  options,
  onChange,
  disabled = false,
  className = '',
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom')
  const [menuMaxHeight, setMenuMaxHeight] = useState(240)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown (e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  function openMenu () {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const edge = 12
      const spaceBelow = window.innerHeight - rect.bottom - edge
      const spaceAbove = rect.top - edge
      const nextPlacement =
        spaceBelow < 240 && spaceAbove > spaceBelow ? 'top' : 'bottom'
      setPlacement(nextPlacement)
      setMenuMaxHeight(
        Math.max(96, nextPlacement === 'top' ? spaceAbove : spaceBelow)
      )
    }
    setActive(Math.max(0, options.indexOf(value)))
    setOpen(true)
  }

  function select (option: T) {
    onChange(option)
    setOpen(false)
    buttonRef.current?.focus()
  }

  function onKeyDown (e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) {
        openMenu()
        return
      }
      const delta = e.key === 'ArrowDown' ? 1 : -1
      setActive(i => Math.max(0, Math.min(options.length - 1, i + delta)))
      return
    }

    if (open && e.key === 'Home') {
      e.preventDefault()
      setActive(0)
      return
    }

    if (open && e.key === 'End') {
      e.preventDefault()
      setActive(options.length - 1)
      return
    }

    if (open && e.key === 'Enter') {
      e.preventDefault()
      select(options[active])
    }
  }

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-3 rounded-sm border border-black/12 bg-white px-3.5 py-2.5 text-left font-mono text-sm text-[#1E2D26] shadow-sm focus:border-[#C8860A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{value}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#4A6358] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          aria-labelledby={id}
          className={`absolute z-30 w-full overflow-auto rounded-sm border border-black/12 bg-white py-1 shadow-md ${
            placement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          style={{ maxHeight: menuMaxHeight }}
        >
          {options.map((option, i) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              onMouseDown={e => e.preventDefault()}
              onClick={() => select(option)}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-3.5 py-2 font-mono text-sm ${
                i === active
                  ? 'bg-[#F3F0E8] text-[#C8860A]'
                  : 'text-[#1E2D26]'
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
