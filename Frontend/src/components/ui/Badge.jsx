const variants = {
  default:  'bg-white/10 text-slate-300 border-white/15',
  blue:     'bg-blue-500/15 text-blue-300 border-blue-400/25',
  green:    'bg-emerald-500/15 text-emerald-300 border-emerald-400/25',
  red:      'bg-red-500/15 text-red-300 border-red-400/25',
  yellow:   'bg-amber-500/15 text-amber-300 border-amber-400/25',
  purple:   'bg-violet-500/15 text-violet-300 border-violet-400/25',
  cyan:     'bg-cyan-500/15 text-cyan-300 border-cyan-400/25',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5
        text-xs font-medium rounded-full border
        ${variants[variant] ?? variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  )
}