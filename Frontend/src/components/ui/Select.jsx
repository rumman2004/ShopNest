import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, className = '', ...props },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full appearance-none rounded-xl px-4 py-2.5 pr-10 text-sm
            bg-white/5 backdrop-blur-sm
            border transition-all duration-200
            text-white
            focus:outline-none focus:ring-2
            ${error
              ? 'border-red-400/50 focus:ring-red-400/30'
              : 'border-white/8 hover:border-white/15 focus:border-blue-400/50 focus:ring-blue-400/20'
            }
          `}
          {...props}
        >
          {placeholder && (
            <option value="" style={{ background: '#0a1020' }}>{placeholder}</option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ background: '#0a1020' }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
      </div>
      {error && <p className="text-xs text-red-400">⚠ {error}</p>}
    </div>
  )
})

export default Select