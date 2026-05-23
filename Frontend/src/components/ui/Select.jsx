import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, className = '', ...props },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-[#34413e]">{label}</label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full appearance-none rounded-lg px-4 py-2.5 pr-10 text-sm
            bg-white
            border transition-colors duration-200 shadow-sm
            text-[#182321]
            focus:outline-none focus:ring-2
            ${error
              ? 'border-red-400 focus:ring-red-100'
              : 'border-[#d9d4c8] hover:border-[#8ca9a4] focus:border-[#004643] focus:ring-[#004643]/10'
            }
          `}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#697773] pointer-events-none"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
})

export default Select
