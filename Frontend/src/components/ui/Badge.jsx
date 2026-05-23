const variants = {
  default:  'bg-[#f7f4ed] text-[#34413e] border-[#d9d4c8]',
  blue:     'bg-blue-50 text-blue-700 border-blue-200',
  green:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  red:      'bg-red-50 text-red-700 border-red-200',
  yellow:   'bg-amber-50 text-amber-800 border-amber-200',
  purple:   'bg-violet-50 text-violet-700 border-violet-200',
  cyan:     'bg-cyan-50 text-cyan-700 border-cyan-200',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5
        text-xs font-semibold rounded-full border
        ${variants[variant] ?? variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
