const sizes = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-2',
  xl: 'w-16 h-16 border-4',
}

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      className={`
        inline-block rounded-full
        border-blue-400/20 border-t-blue-400
        animate-spin
        ${sizes[size] ?? sizes.md}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center"
         style={{ background: 'var(--bg-primary)' }}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-slate-500 text-sm animate-pulse">Loading…</p>
      </div>
    </div>
  )
}