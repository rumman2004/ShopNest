import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import Card, { CardHeader, CardTitle } from '../../components/ui/Card'
import { Package } from 'lucide-react'

// ─── Custom Teal Palette for the Chart ───
const THEME_COLORS = ['#004643', '#0f766e', '#2563eb', '#d97706', '#7c3aed']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  return (
    <div className="bg-white border border-[#d9d4c8] rounded-lg px-3 py-2.5 shadow-xl">
      <p className="text-[#182321] font-semibold text-sm mb-1">{item?.name}</p>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#004643]" />
        <p className="text-[#697773] text-xs font-medium">{payload[0]?.value} units sold</p>
      </div>
    </div>
  )
}

export default function TopProductsChart({ data = [] }) {
  const safeData = Array.isArray(data) ? data : []

  const chartData = safeData.slice(0, 5).map((item) => ({
    name:          item.product_name ?? item.name ?? 'Unknown',
    quantity_sold: Number(item.quantity_sold ?? item.total_quantity ?? item.quantity ?? 0),
  }))

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="border-b border-[#ebe6dc] pb-4 mb-4">
        <CardTitle className="flex items-center gap-2">
          <Package size={18} className="text-[#004643]" />
          Top Products
        </CardTitle>
      </CardHeader>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[260px]">
          <p className="text-[#697773] text-sm opacity-70">No sales data yet.</p>
        </div>
      ) : (
        <div className="h-[280px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, left: -10, right: 16, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: '#697773', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#34413e', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={85}
                tickMargin={8}
                tickFormatter={(v) => v.length > 12 ? `${v.slice(0, 11)}…` : v}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: '#f0ede5', radius: [0, 8, 8, 0] }} 
              />
              <Bar 
                dataKey="quantity_sold" 
                radius={[0, 6, 6, 0]} 
                maxBarSize={28}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {chartData.map((_, i) => (
                  <Cell 
                    key={i} 
                    fill={THEME_COLORS[i % THEME_COLORS.length]} 
                    className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
