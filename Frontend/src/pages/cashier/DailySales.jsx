import { useState, useEffect } from 'react'
import { useShop }     from '../../hooks/useShop'
import { useFetch }    from '../../hooks/useFetch'
import salesService    from '../../services/salesService'
import SalesTable      from '../../features/sales/SalesTable'
import StatCard        from '../../components/ui/StatCard'
import Button          from '../../components/ui/Button'
import EmptyState      from '../../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { TrendingUp, ShoppingBag, Clock, RefreshCw, Store, Package, BarChart3, AlertTriangle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const getLocalDate = (d = new Date()) => {
  const offset = d.getTimezoneOffset()
  const localDate = new Date(d.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

const parseBackendDateTime = (value) => {
  if (!value) return null
  const raw = String(value)
  const candidates = []
  const d0 = new Date(raw)
  if (!Number.isNaN(d0.getTime())) candidates.push(d0)

  const looksIsoNoTz =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/.test(raw) &&
    !/([zZ]|[+-]\d{2}:\d{2})$/.test(raw)

  if (looksIsoNoTz) {
    const dUtc = new Date(raw + 'Z')
    if (!Number.isNaN(dUtc.getTime())) candidates.push(dUtc)
  }

  if (/[zZ]$/.test(raw)) {
    const dLocal = new Date(raw.replace(/[zZ]$/, ''))
    if (!Number.isNaN(dLocal.getTime())) candidates.push(dLocal)
  }

  if (!candidates.length) return null

  const now = Date.now()
  const plausible = candidates
    .map((d) => ({ d, diff: d.getTime() - now }))
    .filter(({ diff }) => diff <= 5 * 60 * 1000 && diff >= -36 * 60 * 60 * 1000)

  const pool = plausible.length ? plausible : candidates.map((d) => ({ d, diff: d.getTime() - now }))
  pool.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))
  return pool[0].d
}

const formatLocalDateTime = (date) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

const getHourLabel = (value) => {
  const date = parseBackendDateTime(value)
  if (!date) return 'Unknown'
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', hour12: true }).format(date)
}

const getHourSortValue = (value) => {
  const date = parseBackendDateTime(value)
  return date ? date.getHours() : 24
}

function DailyBarChart({ sales }) {
  const buckets = new Map()
  sales.forEach((sale) => {
    const label = getHourLabel(sale.sale_date)
    const current = buckets.get(label) || {
      hour: label,
      hourSort: getHourSortValue(sale.sale_date),
      revenue: 0,
      sales: 0,
    }
    current.revenue += Number(sale.total_amount || 0)
    current.sales += 1
    buckets.set(label, current)
  })
  const data = Array.from(buckets.values()).sort((a, b) => a.hourSort - b.hourSort)

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#ebe6dc]">
        <TrendingUp size={18} className="text-[#004643]" />
        <h3 className="text-base font-bold text-[#182321]">Hourly Sales</h3>
      </div>
      {data.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-[#697773]">No sales chart data yet.</div>
      ) : (
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe6dc" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: '#697773', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: '#697773', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value, name) => name === 'revenue' ? formatCurrency(value) : value} contentStyle={{ borderRadius: 8, borderColor: '#d9d4c8' }} />
              <Bar dataKey="revenue" fill="#004643" radius={[8, 8, 0, 0]} maxBarSize={52} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function TopSoldToday({ sales }) {
  const products = new Map()
  sales.forEach((sale) => {
    const items = sale.items || []
    items.forEach((item) => {
      const name = item.product_name || 'Product'
      products.set(name, (products.get(name) || 0) + Number(item.quantity || 0))
    })
  })
  const rows = Array.from(products.entries())
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)
  const maxQty = Math.max(...rows.map((row) => row.qty), 1)

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#ebe6dc]">
        <Package size={18} className="text-[#004643]" />
        <h3 className="text-base font-bold text-[#182321]">Top Items Today</h3>
      </div>
      {rows.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-[#697773]">No item mix available yet.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={row.name} className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#e5f2f1] text-[#004643] font-bold text-xs flex items-center justify-center">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#182321] truncate">{row.name}</p>
                <div className="h-2 mt-2 rounded-full bg-[#f0ede5] overflow-hidden">
                  <div className="h-full bg-[#004643]" style={{ width: `${Math.max(12, (row.qty / maxQty) * 100)}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-[#004643]">{row.qty}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DailySales() {
  const { shopId } = useShop()
  const today      = getLocalDate()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 10000)
    return () => clearInterval(timer)
  }, [])

  const { data, loading, error } = useFetch(
    () => shopId
      ? salesService.getDailySummary(shopId, today)
      : Promise.resolve(null),
    [shopId, today, tick]
  )

  const summary = data?.data ?? {}
  const sales   = summary.sales ?? []
  const revenue = Number(summary.total_revenue ?? 0)
  const count   = Number(summary.total_sales ?? 0)
  const avgSale = count ? revenue / count : 0
  const lastSale = formatLocalDateTime(parseBackendDateTime(summary.last_sale_time))

  const stats = [
    { title: "Today's Revenue", value: formatCurrency(revenue), icon: <TrendingUp size={20} />, color: 'emerald' },
    { title: 'Transactions', value: count, icon: <ShoppingBag size={20} />, color: 'teal' },
    { title: 'Average Sale', value: formatCurrency(avgSale), icon: <BarChart3 size={20} />, color: 'blue' },
    { title: 'Last Sale', value: lastSale, icon: <Clock size={20} />, color: 'indigo' },
  ]

  if (!shopId) {
    return (
      <div className="animate-fade-in py-10">
        <EmptyState
          icon={<Store size={56} className="text-[#004643]" />}
          title="No Shop Selected"
          message="Please select a shop to view the daily sales data."
        />
      </div>
    )
  }

  if (error && !loading && sales.length === 0) {
    return (
      <div className="animate-fade-in py-10">
        <EmptyState
          icon={<AlertTriangle size={56} className="text-red-600" />}
          title="Could Not Load Daily Sales"
          message={error}
          action={(
            <Button
              variant="outline"
              size="md"
              icon={<RefreshCw size={16} />}
              onClick={() => setTick((t) => t + 1)}
            >
              Try Again
            </Button>
          )}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in relative z-10 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 glass-card p-6 sm:px-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182321] tracking-tight flex items-center gap-3">
            <TrendingUp size={28} className="text-[#004643] hidden sm:block" />
            Daily Sales Activity
          </h2>
          <p className="text-[#697773] text-sm sm:text-base font-medium mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Data • {formatDate(today)}
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
          onClick={() => setTick((t) => t + 1)}
          className="shrink-0 w-full sm:w-auto"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} loading={loading && tick === 0} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <DailyBarChart sales={sales} />
        <TopSoldToday sales={sales} />
      </div>

      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#e5f2f1] rounded-lg border border-[#c8ddda]">
            <ShoppingBag size={20} className="text-[#004643]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#182321] tracking-wide">Today's Transactions</h3>
            <p className="text-sm text-[#697773] mt-0.5">Detailed breakdown of all items sold today.</p>
          </div>
        </div>

        <SalesTable sales={sales} loading={loading && tick === 0} />
      </div>
    </div>
  )
}
