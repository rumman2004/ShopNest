import { forwardRef } from 'react'
import Spinner from './Spinner'

const variants = {
  primary:  'bg-[#004643] hover:bg-[#003734] text-white border border-[#004643] shadow-sm',
  secondary:'bg-white hover:bg-[#f8f6f0] text-[#004643] border border-[#cfc8ba] shadow-sm',
  ghost:    'hover:bg-[#e5f2f1] text-[#004643] border border-transparent',
  gradient: 'bg-[#004643] hover:bg-[#003734] text-white border border-[#004643] shadow-sm',
  outline:  'bg-transparent hover:bg-[#e5f2f1] text-[#004643] border border-[#9bb7b2]',
  success:  'bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 text-white shadow-sm',
  danger:   'bg-red-600 hover:bg-red-700 border border-red-600 text-white shadow-sm',
  warning:  'bg-amber-500 hover:bg-amber-600 border border-amber-500 text-[#182321] shadow-sm',
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
        inline-flex items-center justify-center font-semibold rounded-lg
        transition-colors duration-200 ease-out
        focus-visible:ring-2 focus-visible:ring-[#004643] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0EDE5] focus-visible:outline-none
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
