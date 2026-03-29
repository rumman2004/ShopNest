import { forwardRef } from 'react'
import Spinner from './Spinner'

const variants = {
  // Core theme buttons
  primary:  'bg-[#006F73] hover:bg-[#006F73]/80 text-[#E0EDE9] border border-[#84BABF]/30 shadow-[0_0_15px_rgba(0,111,115,0.25)] hover:shadow-[0_0_25px_rgba(0,111,115,0.45)]',
  secondary:'bg-[#085558]/30 hover:bg-[#085558]/50 text-[#84BABF] hover:text-[#E0EDE9] border border-[#84BABF]/20 hover:border-[#84BABF]/40',
  ghost:    'hover:bg-[#085558]/20 text-[#84BABF] hover:text-[#E0EDE9] border border-transparent hover:border-[#84BABF]/10',
  gradient: 'bg-gradient-to-r from-[#006F73] via-[#085558] to-[#006F73] bg-[length:200%_auto] hover:bg-right text-[#E0EDE9] border border-[#84BABF]/30 shadow-[0_0_20px_rgba(0,111,115,0.3)] hover:shadow-[0_0_30px_rgba(0,111,115,0.5)]',
  
  // Status buttons (Dark-mode optimized glass + glow effects)
  success:  'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]',
  danger:   'bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]',
  warning:  'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 hover:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs gap-1.5',
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
  xl: 'px-8 py-4 text-lg gap-3',
}

const Button = forwardRef(function Button(
  {
    children,
    variant  = 'primary',
    size     = 'md',
    loading  = false,
    disabled = false,
    icon,
    iconRight,
    fullWidth = false,
    className = '',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        backdrop-blur-md
        transition-all duration-300 ease-out
        focus-visible:ring-2 focus-visible:ring-[#006F73] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06363D] focus-visible:outline-none
        active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:shadow-none
        ${variants[variant] ?? variants.primary}
        ${sizes[size] ?? sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Loading Spinner or Left Icon */}
      {loading ? (
        <Spinner size="sm" className="shrink-0 text-current" />
      ) : (
        icon && <span className="shrink-0 transition-transform duration-300">{icon}</span>
      )}
      
      {/* Button Content */}
      {children && <span className="truncate">{children}</span>}
      
      {/* Right Icon */}
      {!loading && iconRight && (
        <span className="shrink-0 transition-transform duration-300">{iconRight}</span>
      )}
    </button>
  )
})

export default Button