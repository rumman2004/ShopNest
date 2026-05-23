import { useState, useMemo, useEffect } from 'react'
import { useShop }        from '../../hooks/useShop'
import { useFetch }       from '../../hooks/useFetch'
import { useToast }       from '../../hooks/useToast'
import salesService       from '../../services/salesService'
import SalesTable         from '../../features/sales/SalesTable'
import RevenueChart       from '../../features/dashboard/RevenueChart'
import TopProductsChart   from '../../features/dashboard/TopProductsChart'
import StatCard           from '../../components/ui/StatCard'
import Select             from '../../components/ui/Select'
import Button             from '../../components/ui/Button'
import Pagination         from '../../components/ui/Pagination'
import EmptyState         from '../../components/ui/EmptyState'
import { formatCurrency } from '../../utils/formatters'
import { TrendingUp, ShoppingBag, BarChart3, Download, Store, RefreshCw, PieChart as PieIcon } from 'lucide-react'
import { PAGINATION_LIMIT } from '../../utils/constants'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

// ✅ Helper to prevent UTC bugs
const getLocalDate = (d = new Date()) => {
  const offset = d.getTimezoneOffset()
  const localDate = new Date(d.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

const PERIOD_OPTIONS = [
  { value: '7d',  label: 'Last 7 days'  },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y',  label: 'This year'    },
]

const CHART_COLORS = ['#004643', '#0f766e', '#2563eb', '#d97706', '#7c3aed', '#dc2626']

function ChartCard({ title, icon, children, empty }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#ebe6dc]">
        <span className="text-[#004643]">{icon}</span>
        <h3 className="text-base font-bold text-[#182321]">{title}</h3>
      </div>
      {empty ? (
        <div className="h-[280px] flex items-center justify-center text-sm text-[#697773]">
          No chart data available yet.
        </div>
      ) : children}
    </div>
  )
}

function ProductMixChart({ data = [] }) {
  const chartData = data.slice(0, 6).map((item) => ({
    name: item.product_name ?? 'Unknown',
    value: Number(item.quantity_sold ?? item.total_sold ?? 0),
  })).filter((item) => item.value > 0)

  return (
    <ChartCard title="Sales Mix" icon={<PieIcon size={18} />} empty={!chartData.length}>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} sold`, name]}
              contentStyle={{ borderRadius: 8, borderColor: '#d9d4c8' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-xs text-[#34413e] min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}

function ProfitRevenueChart({ reports }) {
  const data = [
    { name: 'Revenue', value: Number(reports?.total_revenue ?? 0), fill: '#004643' },
    { name: 'Profit', value: Number(reports?.total_profit ?? 0), fill: '#0f766e' },
    { name: 'Average Sale', value: Number(reports?.avg_sale ?? 0), fill: '#2563eb' },
  ]

  return (
    <ChartCard title="Revenue Breakdown" icon={<BarChart3 size={18} />} empty={data.every((item) => item.value === 0)}>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ebe6dc" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#697773', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: '#697773', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 8, borderColor: '#d9d4c8' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={74}>
              {data.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export default function FinanceReports() {
  const { shopId } = useShop()
  const { toast }  = useToast()
  const [period,   setPeriod] = useState('30d')
  const [page,     setPage]   = useState(1)

  // ✅ Auto-refresh mechanism
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 10000)
    return () => clearInterval(timer)
  }, [])

  const dateParams = useMemo(() => {
    const end   = new Date()
    const start = new Date()
    if (period === '7d')  start.setDate(end.getDate() - 7)
    if (period === '30d') start.setDate(end.getDate() - 30)
    if (period === '90d') start.setDate(end.getDate() - 90)
    if (period === '1y')  start.setFullYear(end.getFullYear() - 1)
    
    return {
      start_date: getLocalDate(start),
      end_date:   getLocalDate(end)
    }
  }, [period])

  // Get Reports data (added tick)
  const { data: rawReports, loading: rLoading } = useFetch(
    () => shopId ? salesService.getReports(shopId, dateParams) : Promise.resolve(null),
    [shopId, dateParams, tick]
  )
  const reports = rawReports?.data?.data ?? rawReports?.data ?? rawReports ?? {}

  // Get Table data (added tick)
  const { data: rawSales, loading: sLoading } = useFetch(
    () => shopId ? salesService.getAll(shopId, { page, limit: PAGINATION_LIMIT }) : Promise.resolve(null),
    [shopId, page, tick]
  )
  const salesData       = rawSales?.data?.data ?? rawSales?.data ?? rawSales ?? {}
  const salesList       = salesData.sales ?? []
  const totalSalesCount = salesData.pagination?.totalItems ?? 0

  const handleExport = async () => {
    if (!shopId) return

    try {
      const response = await salesService.exportSales(shopId, dateParams)
      const content = response?.data?.data?.content || response?.data?.content || response?.content;
      const filename = response?.data?.data?.filename || response?.data?.filename || response?.filename || `finance-report-${Date.now()}.csv`;

      if (!content) {
        toast.error('Export failed: No content received from server.')
        return
      }

      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
      const url  = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href     = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Finance report downloaded.')
    } catch (err) {
      toast.error(`Export failed: ${err.response?.data?.message ?? err.message}`)
    }
  }

  if (!shopId) {
    return (
      <EmptyState 
        icon={<Store size={56} className="text-[#004643]" />} 
        title="No Shop Selected" 
        message="Please select a shop first from the Manage Shops page to view finance reports." 
      />
    )
  }

  const stats = [
    { title: 'Revenue',      value: formatCurrency(reports?.total_revenue ?? 0), icon: <TrendingUp size={20} />,  color: 'blue'   },
    { title: 'Total Sales',  value: reports?.total_sales ?? 0,                   icon: <ShoppingBag size={20} />, color: 'green'  },
    { title: 'Gross Profit', value: formatCurrency(reports?.total_profit ?? 0),  icon: <BarChart3 size={20} />,   color: 'purple' },
    { title: 'Avg. Sale',    value: formatCurrency(reports?.avg_sale ?? 0),      icon: <BarChart3 size={20} />,   color: 'amber'  },
  ]

  const isSyncing = rLoading && tick > 0

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in relative z-10 w-full pb-8">
      
      {/* --- Premium Glass Header --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 glass-card p-6 sm:px-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182321] tracking-tight flex items-center gap-3">
            Finance Reports
          </h2>
          <p className="text-[#697773] text-sm sm:text-base font-medium mt-1">
            Revenue, profit, and comprehensive sales analytics
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Button 
            variant="ghost" 
            size="md" 
            icon={<RefreshCw size={18} className={isSyncing ? "animate-spin text-[#004643]" : ""} />} 
            onClick={() => setTick(t=>t+1)}
            disabled={rLoading}
            className="hidden sm:flex shrink-0"
          >
            Refresh
          </Button>
          
          <div className="w-40 sm:w-48 flex-grow sm:flex-grow-0 shrink-0">
            <Select
              options={PERIOD_OPTIONS}
              value={period}
              onChange={(e) => { setPeriod(e.target.value); setPage(1) }}
            />
          </div>
          
          <Button 
            variant="primary" 
            size="md"
            icon={<Download size={18} />} 
            onClick={handleExport}
            className="flex-grow sm:flex-grow-0 shrink-0"
          >
            Export
          </Button>
        </div>
      </div>

      {/* --- Key Metrics Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} loading={rLoading && tick === 0} />
        ))}
      </div>

      {/* --- Revenue Chart Section --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <RevenueChart data={reports?.daily_revenue ?? []} />
        </div>
        <ProductMixChart data={reports?.top_products ?? []} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ProfitRevenueChart reports={reports} />
        <TopProductsChart data={reports?.top_products ?? []} />
      </div>

      {/* --- All Transactions Table Section --- */}
      <div className="glass-card p-6 sm:p-8">
        
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-[#182321] tracking-tight">
            All Transactions
          </h3>
          <span className="text-sm font-semibold text-[#004643] bg-[#e5f2f1] px-3 py-1.5 rounded-lg border border-[#c8ddda] shrink-0">
            {totalSalesCount} Records Found
          </span>
        </div>
        
        {/* Table Content */}
        <SalesTable sales={salesList} loading={sLoading && tick === 0} />
        
        {/* Pagination Footer */}
        {totalSalesCount > 0 && (
          <div className="mt-6 pt-6 border-t border-[#ebe6dc] flex justify-center">
            <Pagination
              page={page}
              total={totalSalesCount}
              limit={PAGINATION_LIMIT}
              onChange={setPage}
            />
          </div>
        )}

      </div>
    </div>
  )
}
