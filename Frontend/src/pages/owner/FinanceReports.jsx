import { useState, useMemo, useEffect } from 'react'
import { useShop }        from '../../hooks/useShop'
import { useFetch }       from '../../hooks/useFetch'
import { useToast }       from '../../hooks/useToast'
import salesService       from '../../services/salesService'
import SalesTable         from '../../features/sales/SalesTable'
import RevenueChart       from '../../features/dashboard/RevenueChart'
import StatCard           from '../../components/ui/StatCard'
import Select             from '../../components/ui/Select'
import Button             from '../../components/ui/Button'
import Pagination         from '../../components/ui/Pagination'
import EmptyState         from '../../components/ui/EmptyState'
import { formatCurrency } from '../../utils/formatters'
import { TrendingUp, ShoppingBag, BarChart3, Download, Store, RefreshCw } from 'lucide-react'
import { PAGINATION_LIMIT } from '../../utils/constants'

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
        icon={<Store size={56} className="text-[#84BABF]" />} 
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 bg-[#0B2B26]/20 border border-[#84BABF]/20 p-6 sm:px-8 rounded-[2rem] backdrop-blur-xl shadow-lg shadow-[#06363D]/50">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E0EDE9] tracking-tight flex items-center gap-3">
            Finance Reports
          </h2>
          <p className="text-[#84BABF] text-sm sm:text-base font-medium mt-1">
            Revenue, profit, and comprehensive sales analytics
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Button 
            variant="ghost" 
            size="md" 
            icon={<RefreshCw size={18} className={isSyncing ? "animate-spin text-[#E0EDE9]" : ""} />} 
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
            className="flex-grow sm:flex-grow-0 shrink-0 shadow-md shadow-[#006F73]/20 hover:shadow-[#006F73]/40"
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
      <div className="w-full">
        <RevenueChart data={reports?.daily_revenue ?? []} />
      </div>

      {/* --- All Transactions Table Section --- */}
      <div className="bg-[#085558]/10 border border-[#84BABF]/20 rounded-[2rem] p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-[#06363D]/30">
        
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-[#E0EDE9] tracking-tight">
            All Transactions
          </h3>
          <span className="text-sm font-semibold text-[#84BABF] bg-[#06363D]/50 px-3 py-1.5 rounded-lg border border-[#84BABF]/20 shadow-inner shrink-0">
            {totalSalesCount} Records Found
          </span>
        </div>
        
        {/* Table Content */}
        <SalesTable sales={salesList} loading={sLoading && tick === 0} />
        
        {/* Pagination Footer */}
        {totalSalesCount > 0 && (
          <div className="mt-6 pt-6 border-t border-[#84BABF]/10 flex justify-center">
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