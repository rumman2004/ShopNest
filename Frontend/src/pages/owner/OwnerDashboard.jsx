import { useState, useEffect } from 'react'
import { useShop }  from '../../hooks/useShop'
import { useFetch } from '../../hooks/useFetch'
import { useAuth }  from '../../hooks/useAuth'
import salesService from '../../services/salesService'
import shopService  from '../../services/shopService'
import StatCard             from '../../components/ui/StatCard'
import RevenueChart         from '../../features/dashboard/RevenueChart'
import TopProductsChart     from '../../features/dashboard/TopProductsChart'
import RecentTransactions   from '../../features/dashboard/RecentTransactions'
import EmptyState           from '../../components/ui/EmptyState'
import Spinner              from '../../components/ui/Spinner'
import Button               from '../../components/ui/Button'
import { Store, BarChart3, TrendingUp, ShoppingBag, RefreshCw } from 'lucide-react'
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

export default function OwnerDashboard() {
  const { activeShop } = useShop()
  const { user }       = useAuth()
  const shopId         = activeShop?.shop_id ?? null

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
        icon={<Store size={56} className="text-[#84BABF]" />}
        title="No Shop Selected"
        message="Go to Manage Shops and click 'Select Store' on a shop to see your dashboard."
      />
    )
  }

  const isSyncing = loading && tick > 0

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in relative z-10 w-full pb-8">
      
      {/* --- Premium Glass Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-[#0B2B26]/20 border border-[#84BABF]/20 p-6 sm:px-8 rounded-[2rem] backdrop-blur-xl shadow-lg shadow-[#06363D]/50">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E0EDE9] tracking-tight flex items-center gap-2">
            Good {getTimeOfDay()},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0EDE9] to-[#84BABF]">
              {user?.full_name?.split(' ')[0] ?? 'Owner'}
            </span> 👋
          </h2>
          <div className="flex items-center gap-2.5 mt-2 text-[#84BABF] text-sm sm:text-base font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[#E0EDE9] drop-shadow-sm">{activeShop?.shop_name}</span>
            <span className="text-[#006F73] opacity-60">•</span>
            <span>Last 30 days overview</span>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          size="md" 
          icon={<RefreshCw size={18} className={isSyncing ? "animate-spin text-[#E0EDE9]" : ""} />} 
          onClick={() => setTick(t => t + 1)}
          disabled={loading}
          className="shadow-md shrink-0"
        >
          {isSyncing ? 'Syncing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* --- Key Metrics Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} loading={loading && tick === 0} />
        ))}
      </div>

      {/* --- Loading State OR Dashboard Content --- */}
      {loading && tick === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#085558]/10 border border-[#84BABF]/10 rounded-[2rem] backdrop-blur-sm shadow-inner">
          <Spinner size="lg" className="text-[#006F73] mb-5" />
          <p className="text-[#84BABF] font-medium animate-pulse tracking-wide">
            Gathering your store insights...
          </p>
        </div>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart data={reports?.daily_revenue ?? []} />
            </div>
            <div className="lg:col-span-1">
              <TopProductsChart data={reports?.top_products ?? []} />
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="w-full">
            <RecentTransactions transactions={reports?.recent_sales ?? []} />
          </div>
        </>
      )}
    </div>
  )
}