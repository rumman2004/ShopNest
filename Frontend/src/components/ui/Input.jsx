import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon,
    iconRight,
    className  = '',
    inputClass = '',
    type       = 'text',
    ...props
  },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      
      {/* Label */}
      {label && (
        <label className="text-sm font-semibold text-[#34413e] tracking-wide select-none">
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative group">
        
        {/* Left Icon */}
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697773] pointer-events-none transition-colors duration-200 group-focus-within:text-[#004643]">
            {icon}
          </span>
        )}

        {/* Input Element */}
        <input
          ref={ref}
          type={type}
          className={`
            w-full rounded-lg px-4 py-3 text-sm
            bg-white shadow-sm
            border transition-colors duration-200 ease-out
            text-[#182321] font-medium placeholder:text-[#9aa39f]
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:hover:border-[#d9d4c8]
            ${error
              ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500 text-rose-900'
              : 'border-[#d9d4c8] hover:border-[#8ca9a4] focus:border-[#004643] focus:ring-[#004643]/10'
            }
            ${icon      ? 'pl-11' : ''}
            ${iconRight ? 'pr-11' : ''}
            ${inputClass}
          `}
          {...props}
        />

        {/* Right Icon / Button */}
        {iconRight && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697773] transition-colors duration-200 group-focus-within:text-[#004643]">
            {iconRight}
          </span>
        )}
      </div>

      {/* Error & Hint Messages */}
      {error && (
        <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 tracking-wide animate-fade-in">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs font-medium text-[#697773] tracking-wide pl-1">
          {hint}
        </p>
      )}
      
    </div>
  )
})

export default Input
