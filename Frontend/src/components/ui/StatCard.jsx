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
    blue:   { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    border: 'border-blue-400/20' },
    green:  { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-400/20' },
    purple: { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'border-violet-400/20' },
    amber:  { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   border: 'border-amber-400/20' },
    red:    { bg: 'bg-red-500/10',     icon: 'text-red-400',     border: 'border-red-400/20' },
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
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {trendValue !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up'   && <TrendingUp  size={14} className="text-emerald-400" />}
              {trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
              {trend === 'flat' && <Minus        size={14} className="text-slate-500" />}
              <span className={`text-xs font-medium ${
                trend === 'up'   ? 'text-emerald-400' :
                trend === 'down' ? 'text-red-400' : 'text-slate-500'
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