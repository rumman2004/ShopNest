import { useState, useEffect, useMemo, useRef } from 'react'
import { useShop }  from '../../hooks/useShop'
import { useFetch } from '../../hooks/useFetch'
import { useAuth }  from '../../hooks/useAuth'
import { useGsapReveal } from '../../hooks/useGsapReveal'
import salesService from '../../services/salesService'
import shopService  from '../../services/shopService'
import StatCard             from '../../components/ui/StatCard'
import RevenueChart         from '../../features/dashboard/RevenueChart'
import TopProductsChart     from '../../features/dashboard/TopProductsChart'
import RecentTransactions   from '../../features/dashboard/RecentTransactions'
import ActivityFeed         from '../../features/dashboard/ActivityFeed'
import EmptyState           from '../../components/ui/EmptyState'
import Spinner              from '../../components/ui/Spinner'
import Button               from '../../components/ui/Button'
import { Store, BarChart3, TrendingUp, ShoppingBag, RefreshCw, Percent, ReceiptText, PackageCheck, Wallet } from 'lucide-react'
import { formatCurrency }   from '../../utils/formatters'

// ✅ Helper to get CORRECT local date string, preventing UTC timezone bugs
const getLocalDate = (d = new Date()) => {
  const offset = d.getTimezoneOffset()
  const localDate = new Date(d.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function InsightTile({ icon, label, value, helper }) {
  return (
    <div className="rounded-lg border border-[#d9d4c8] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8ddda] bg-[#e5f2f1] text-[#004643]">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#697773]">{label}</p>
          <p className="mt-1 truncate text-base font-bold text-[#182321]">{value}</p>
          {helper && <p className="mt-0.5 text-xs text-[#697773]">{helper}</p>}
        </div>
      </div>
    </div>
  )
}

export default function OwnerDashboard() {
  const { activeShop } = useShop()
  const { user }       = useAuth()
  const shopId         = activeShop?.shop_id ?? null
  const pageRef        = useRef(null)

  // ✅ Auto-refresh mechanism (Polling) to make it "Real-Time"
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 10000) // Refreshes every 10 seconds
    return () => clearInterval(timer)
  }, [])

  const { data: shopsData } = useFetch(() => shopService.getAll(), [])
  const allShops = shopsData?.data?.data ?? shopsData?.data ?? shopsData ?? []
  const activeShopsCount = Array.isArray(allShops) ? allShops.filter((s) => s.is_active).length : 0

  // ✅ THE FIX: Verify the shop saved in Context/LocalStorage actually belongs to this user!
  const isShopOwnedByCurrentUser = allShops.some(s => s.shop_id === activeShop?.shop_id)
  
  // If the saved shop doesn't belong to them (Ghost State), force it to null
  const safeShopId = isShopOwnedByCurrentUser ? activeShop.shop_id : null;

  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const endDate   = getLocalDate(today)
  const startDate = getLocalDate(thirtyDaysAgo)

  // ✅ Added `tick` to dependency array to force re-fetch
  const { data: reportsRaw, loading } = useFetch(
    () => safeShopId
      ? salesService.getReports(safeShopId, { start_date: startDate, end_date: endDate })
      : Promise.resolve(null),
    [safeShopId, startDate, endDate, tick] 
  )

  const reports = reportsRaw?.data?.data ?? reportsRaw?.data ?? reportsRaw ?? {}

  useGsapReveal(pageRef, [safeShopId, loading])

  const reportSummary = useMemo(() => {
    const revenue = Number(reports?.total_revenue ?? 0)
    const profit = Number(reports?.total_profit ?? 0)
    const sales = Number(reports?.total_sales ?? 0)
    const margin = revenue ? `${((profit / revenue) * 100).toFixed(1)}%` : '0.0%'
    const topProduct = reports?.top_products?.[0]
    const lastSale = reports?.recent_sales?.[0]

    return {
      margin,
      avgTicket: formatCurrency(reports?.avg_sale ?? 0),
      topProduct: topProduct?.product_name ?? 'No sales yet',
      topProductHelper: topProduct ? `${topProduct.quantity_sold} units sold` : 'Waiting for product movement',
      lastSale: lastSale ? formatCurrency(lastSale.total_amount) : 'No transaction',
      lastSaleHelper: lastSale?.cashier_name ? `By ${lastSale.cashier_name}` : 'Latest sale will appear here',
      sales,
    }
  }, [reports])

  const stats = [
    {
      title:      'Total Revenue (30 days)',
      value:      formatCurrency(reports?.total_revenue ?? 0),
      icon:       <TrendingUp size={20} />,
      color:      'blue', // Assuming StatCard handles these colors
      trend:      'up',
      trendValue: reports?.revenue_trend ?? null,
    },
    {
      title:      'Total Sales (30 days)',
      value:      reports?.total_sales ?? 0,
      icon:       <ShoppingBag size={20} />,
      color:      'green',
      trend:      'up',
      trendValue: reports?.sales_trend ?? null,
    },
    {
      title:      'Total Profit (30 days)',
      value:      formatCurrency(reports?.total_profit ?? 0),
      icon:       <BarChart3 size={20} />,
      color:      'purple',
      trend:      'up',
      trendValue: reports?.profit_trend ?? null,
    },
    {
      title: 'Active Shops',
      value: activeShopsCount,
      icon:  <Store size={20} />,
      color: 'amber',
    },
  ]

  if (!shopId) {
    return (
      <EmptyState
        icon={<Store size={56} className="text-[#697773]" />}
        title="No Shop Selected"
        message="Go to Manage Shops and click 'Select Store' on a shop to see your dashboard."
      />
    )
  }

  const isSyncing = loading && tick > 0

  return (
    <div ref={pageRef} className="space-y-6 sm:space-y-8 relative z-10 w-full pb-8">
      
      {/* --- Premium Glass Header --- */}
      <div data-gsap-reveal className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 bg-white border border-[#d9d4c8] p-5 sm:px-6 rounded-lg shadow-sm">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#697773]">Owner Overview</p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#182321] tracking-tight flex items-center gap-2">
            Good {getTimeOfDay()},{' '}
            <span className="text-[#004643]">
              {user?.full_name?.split(' ')[0] ?? 'Owner'}
            </span>
          </h2>
          <div className="flex items-center gap-2.5 mt-2 text-[#697773] text-sm sm:text-base font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[#182321] drop-shadow-sm">{activeShop?.shop_name}</span>
            <span className="text-[#004643] opacity-60">•</span>
            <span>Last 30 days overview</span>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          size="md" 
          icon={<RefreshCw size={18} className={isSyncing ? "animate-spin text-[#182321]" : ""} />} 
          onClick={() => setTick(t => t + 1)}
          disabled={loading}
          className="shrink-0 w-full sm:w-auto"
        >
          {isSyncing ? 'Syncing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* --- Key Metrics Grid --- */}
      <div data-gsap-reveal className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} loading={loading && tick === 0} />
        ))}
      </div>

      {/* --- Loading State OR Dashboard Content --- */}
      {loading && tick === 0 ? (
        <div data-gsap-reveal className="flex flex-col items-center justify-center py-24 bg-white border border-[#ebe6dc] rounded-lg shadow-sm">
          <Spinner size="lg" className="text-[#004643] mb-5" />
          <p className="text-[#697773] font-medium animate-pulse tracking-wide">
            Gathering your store insights...
          </p>
        </div>
      ) : (
        <>
          <div data-gsap-reveal className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <InsightTile
              icon={<Percent size={18} />}
              label="Profit Margin"
              value={reportSummary.margin}
              helper="Gross profit divided by revenue"
            />
            <InsightTile
              icon={<Wallet size={18} />}
              label="Average Ticket"
              value={reportSummary.avgTicket}
              helper={`${reportSummary.sales} sale${reportSummary.sales === 1 ? '' : 's'} in period`}
            />
            <InsightTile
              icon={<PackageCheck size={18} />}
              label="Best Seller"
              value={reportSummary.topProduct}
              helper={reportSummary.topProductHelper}
            />
            <InsightTile
              icon={<ReceiptText size={18} />}
              label="Latest Sale"
              value={reportSummary.lastSale}
              helper={reportSummary.lastSaleHelper}
            />
          </div>

          {/* Charts Section */}
          <div data-gsap-reveal className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart data={reports?.daily_revenue ?? []} />
            </div>
            <div className="lg:col-span-1">
              <TopProductsChart data={reports?.top_products ?? []} />
            </div>
          </div>

          {/* Recent Transactions + Activity Feed */}
          <div data-gsap-reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactions transactions={reports?.recent_sales ?? []} />
            <ActivityFeed />
          </div>
        </>
      )}
    </div>
  )
}
