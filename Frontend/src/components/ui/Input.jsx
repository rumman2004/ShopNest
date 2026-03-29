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
        <label className="text-sm font-bold text-[#84BABF] tracking-wide select-none">
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative group">
        
        {/* Left Icon */}
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#84BABF]/60 pointer-events-none transition-colors duration-300 group-focus-within:text-[#E0EDE9]">
            {icon}
          </span>
        )}

        {/* Input Element */}
        <input
          ref={ref}
          type={type}
          className={`
            w-full rounded-xl px-4 py-3 text-sm
            bg-[#06363D]/40 backdrop-blur-md shadow-inner
            border transition-all duration-300 ease-out
            text-[#E0EDE9] font-medium placeholder:text-[#84BABF]/30
            focus:outline-none focus:ring-4 focus:bg-[#06363D]/70
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#06363D]/20 disabled:hover:border-[#84BABF]/20
            ${error
              ? 'border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500/80 text-rose-100 placeholder:text-rose-400/30'
              : 'border-[#84BABF]/20 hover:border-[#006F73]/60 focus:border-[#84BABF]/60 focus:ring-[#006F73]/20'
            }
            ${icon      ? 'pl-11' : ''}
            ${iconRight ? 'pr-11' : ''}
            ${inputClass}
          `}
          {...props}
        />

        {/* Right Icon / Button */}
        {iconRight && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#84BABF]/60 transition-colors duration-300 group-focus-within:text-[#E0EDE9]">
            {iconRight}
          </span>
        )}
      </div>

      {/* Error & Hint Messages */}
      {error && (
        <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5 tracking-wide animate-fade-in">
          <span className="text-[10px]">⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs font-medium text-[#006F73] tracking-wide pl-1">
          {hint}
        </p>
      )}
      
    </div>
  )
})

export default Input