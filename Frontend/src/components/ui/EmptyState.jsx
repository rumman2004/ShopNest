import { PackageSearch } from 'lucide-react'

export default function EmptyState({
  icon    = <PackageSearch size={40} />,
  title   = 'Nothing here yet',
  message = 'No records found.',
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="text-slate-600 mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-slate-400 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}