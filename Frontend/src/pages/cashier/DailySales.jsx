import { useState, useEffect } from 'react'
import { useShop }     from '../../hooks/useShop'
import { useFetch }    from '../../hooks/useFetch'
import salesService    from '../../services/salesService'
import SalesTable      from '../../features/sales/SalesTable'
import StatCard        from '../../components/ui/StatCard'
import Button          from '../../components/ui/Button'
import EmptyState      from '../../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { TrendingUp, ShoppingBag, Clock, RefreshCw, Store } from 'lucide-react'

// ✅ Helper to prevent UTC bugs (for "today" YYYY-MM-DD)
const getLocalDate = (d = new Date()) => {
  const offset = d.getTimezoneOffset()
  const localDate = new Date(d.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

// ✅ Robust parsing to avoid UTC/local mismatches
const parseBackendDateTime = (value) => {
  if (!value) return null
  const raw = String(value)

  const candidates = []

  // Normal parse (handles ISO with Z / offset correctly)
  const d0 = new Date(raw)
  if (!Number.isNaN(d0.getTime())) candidates.push(d0)

  // If backend sends ISO WITHOUT timezone, try interpreting it as UTC
  const looksIsoNoTz =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/.test(raw) &&
    !/([zZ]|[+-]\d{2}:\d{2})$/.test(raw)

  if (looksIsoNoTz) {
    const dUtc = new Date(raw + 'Z')
    if (!Number.isNaN(dUtc.getTime())) candidates.push(dUtc)
  }

  // If backend incorrectly appends Z to a local time, try parsing as local (remove Z)
  if (/[zZ]$/.test(raw)) {
    const dLocal = new Date(raw.replace(/[zZ]$/, ''))
    if (!Number.isNaN(dLocal.getTime())) candidates.push(dLocal)
  }

  if (!candidates.length) return null

  // Pick the most plausible candidate for a "daily" timestamp (within last ~36h, not in the future)
  const now = Date.now()
  const WINDOW_PAST = 36 * 60 * 60 * 1000
  const WINDOW_FUTURE = 5 * 60 * 1000

  const plausible = candidates
    .map((d) => ({ d, diff: d.getTime() - now }))
    .filter(({ diff }) => diff <= WINDOW_FUTURE && diff >= -WINDOW_PAST)

  const pool = plausible.length ? plausible : candidates.map((d) => ({ d, diff: d.getTime() - now }))
  pool.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))

  return pool[0].d
}

// ✅ Local display formatter (no forced UTC)
const formatLocalDateTime = (date) => {
  if (!date) return '—'
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export default function DailySales() {
  const { shopId } = useShop()
  const today      = getLocalDate()

  // ✅ Auto-refresh mechanism
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 10000)
    return () => clearInterval(timer)
  }, [])

  const { data, loading } = useFetch(
    () => shopId
      ? salesService.getDailySummary(shopId, today)
      : Promise.resolve(null),
    [shopId, today, tick]
  )

  const summary = data?.data ?? {}
  const sales   = summary.sales         ?? []
  const revenue = summary.total_revenue ?? 0
  const count   = summary.total_sales   ?? 0

  // ✅ FIX: parse + format using local time
  const lastSaleDate = parseBackendDateTime(summary.last_sale_time)
  const lastSale = formatLocalDateTime(lastSaleDate)

  const stats = [
    {
      title: "Today's Revenue",
      value: formatCurrency(revenue),
      icon:  <TrendingUp size={20} />,
      color: 'emerald',
    },
    {
      title: 'Total Transactions',
      value: count,
      icon:  <ShoppingBag size={20} />,
      color: 'teal',
    },
    {
      title: 'Last Sale Time',
      value: lastSale,
      icon:  <Clock size={20} />,
      color: 'indigo',
    },
  ]

  if (!shopId) {
    return (
      <div className="animate-fade-in py-10">
        <EmptyState
          icon={<Store size={56} className="text-[#84BABF]" />}
          title="No Shop Selected"
          message="Please select a shop to view the daily sales data."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in relative z-10 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-[#0B2B26]/20 border border-[#84BABF]/20 p-6 sm:px-8 rounded-[2rem] backdrop-blur-xl shadow-lg shadow-[#06363D]/50">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E0EDE9] tracking-tight flex items-center gap-3">
            <TrendingUp size={28} className="text-[#84BABF] hidden sm:block" />
            Daily Sales Activity
          </h2>
          <p className="text-[#84BABF] text-sm sm:text-base font-medium mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Live Data • {formatDate(today)}
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
          onClick={() => setTick((t) => t + 1)}
          className="border-[#006F73]/50 text-[#E0EDE9] hover:bg-[#006F73]/20 shadow-md shrink-0 w-full sm:w-auto"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} loading={loading && tick === 0} />
        ))}
      </div>

      <div className="bg-[#085558]/10 border border-[#84BABF]/20 rounded-[2rem] p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-[#06363D]/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#006F73]/20 rounded-xl border border-[#006F73]/30">
            <ShoppingBag size={20} className="text-[#84BABF]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#E0EDE9] tracking-wide">Today's Transactions</h3>
            <p className="text-sm text-[#84BABF] mt-0.5">Detailed breakdown of all items sold today.</p>
          </div>
        </div>

        <SalesTable sales={sales} loading={loading && tick === 0} />
      </div>
    </div>
  )
}