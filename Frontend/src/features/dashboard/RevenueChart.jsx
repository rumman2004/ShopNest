import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import Card, { CardHeader, CardTitle } from '../../components/ui/Card'
import { formatCurrency } from '../../utils/formatters'
import { TrendingUp } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#d9d4c8] rounded-lg px-4 py-3 shadow-xl">
      <p className="text-[#697773] text-xs font-medium uppercase tracking-widest mb-1.5">{label}</p>
      <p className="text-[#182321] text-lg font-bold flex items-center gap-2">
        {formatCurrency(payload[0]?.value ?? 0)}
        <TrendingUp size={14} className="text-[#004643]" />
      </p>
    </div>
  )
}

export default function RevenueChart({ data = [] }) {
  const safeData = Array.isArray(data) ? data : []

  const chartData = safeData.map((item) => ({
    date:    item.date ?? item.sale_date ?? item.day ?? '—',
    revenue: Number(item.revenue ?? item.total_amount ?? item.total_revenue ?? item.total ?? 0),
  }))

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="border-b border-[#ebe6dc] pb-4 mb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp size={18} className="text-[#004643]" />
          Revenue Over Time
        </CardTitle>
      </CardHeader>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[260px]">
          <p className="text-[#697773] text-sm opacity-70">No revenue data yet.</p>
        </div>
      ) : (
        <div className="h-[280px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#004643" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#004643" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe6dc" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => {
                   if (!v || v === '—') return v
                   const d = new Date(v)
                   return isNaN(d) ? v : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                }}
                tick={{ fill: '#697773', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
                tick={{ fill: '#697773', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#004643', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#004643"
                strokeWidth={3}
                fill="url(#revenueGrad)"
                dot={{ r: 0 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#004643', strokeWidth: 3 }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
