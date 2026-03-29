import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import Card, { CardHeader, CardTitle } from '../../components/ui/Card'
import { Package } from 'lucide-react'

// ─── Custom Teal Palette for the Chart ───
const THEME_COLORS = ['#84BABF', '#4A9A9E', '#006F73', '#055C60', '#085558']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  return (
    <div className="bg-[#06363D]/90 backdrop-blur-xl border border-[#84BABF]/30 rounded-xl px-3 py-2.5 shadow-xl shadow-[#085558]/50">
      <p className="text-[#E0EDE9] font-semibold text-sm mb-1">{item?.name}</p>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#84BABF]" />
        <p className="text-[#84BABF] text-xs font-medium">{payload[0]?.value} units sold</p>
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
    <Card className="col-span-full lg:col-span-1 border-[#84BABF]/20 shadow-[0_0_30px_rgba(8,85,88,0.2)]">
      <CardHeader className="border-b border-[#84BABF]/10 pb-4 mb-4">
        <CardTitle className="text-[#E0EDE9] flex items-center gap-2">
          <Package size={18} className="text-[#84BABF]" />
          Top Products
        </CardTitle>
      </CardHeader>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[260px]">
          <p className="text-[#84BABF] text-sm opacity-70">No sales data yet.</p>
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
                tick={{ fill: '#84BABF', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#E0EDE9', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={85}
                tickMargin={8}
                tickFormatter={(v) => v.length > 12 ? `${v.slice(0, 11)}…` : v}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'rgba(132,186,191,0.1)', radius: [0, 8, 8, 0] }} 
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