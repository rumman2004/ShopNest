import StatCard from '../../components/ui/StatCard'

export default function SalesSummaryCard({ 
  label, 
  value, 
  icon, 
  color, 
  trend, 
  trendValue, 
  loading 
}) {
  return (
    <div className="transform hover:-translate-y-1 transition-transform duration-300">
      <StatCard
        title={label}
        value={value}
        icon={icon}
        color={color}
        trend={trend}
        trendValue={trendValue}
        loading={loading}
      />
    </div>
  )
}