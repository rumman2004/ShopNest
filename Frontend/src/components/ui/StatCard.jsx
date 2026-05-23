import Card from './Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'blue',
  loading = false,
}) {
  const colorMap = {
    blue:    { bg: 'bg-[#e5f2f1]',      icon: 'text-[#004643]',    border: 'border-[#c8ddda]' },
    teal:    { bg: 'bg-[#e5f2f1]',      icon: 'text-[#004643]',    border: 'border-[#c8ddda]' },
    emerald: { bg: 'bg-emerald-50',     icon: 'text-emerald-700',  border: 'border-emerald-200' },
    green:   { bg: 'bg-emerald-50',     icon: 'text-emerald-700',  border: 'border-emerald-200' },
    purple:  { bg: 'bg-violet-50',      icon: 'text-violet-700',   border: 'border-violet-200' },
    indigo:  { bg: 'bg-indigo-50',      icon: 'text-indigo-700',   border: 'border-indigo-200' },
    amber:   { bg: 'bg-amber-50',       icon: 'text-amber-700',    border: 'border-amber-200' },
    red:     { bg: 'bg-red-50',         icon: 'text-red-700',      border: 'border-red-200' },
  }

  const c = colorMap[color] ?? colorMap.blue

  if (loading) {
    return (
      <Card>
        <div className="shimmer h-4 w-24 rounded mb-4" />
        <div className="shimmer h-8 w-36 rounded mb-2" />
        <div className="shimmer h-3 w-20 rounded" />
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-[#182321] mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {trendValue !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up'   && <TrendingUp  size={14} className="text-emerald-600" />}
              {trend === 'down' && <TrendingDown size={14} className="text-red-600" />}
              {trend === 'flat' && <Minus        size={14} className="text-slate-500" />}
              <span className={`text-xs font-medium ${
                trend === 'up'   ? 'text-emerald-600' :
                trend === 'down' ? 'text-red-600' : 'text-slate-500'
              }`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`
            p-3 rounded-xl border
            ${c.bg} ${c.border} ${c.icon}
          `}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
