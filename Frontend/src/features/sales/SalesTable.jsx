import Table  from '../../components/ui/Table'
import Badge  from '../../components/ui/Badge'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

const parseBackendTime = (timeStr) => {
  if (!timeStr) return null
  let safeTime = String(timeStr).trim()

  // Ensure 'T' exists for standard ISO parsing
  if (!safeTime.includes('T')) {
    safeTime = safeTime.replace(' ', 'T')
  }
  
  return safeTime
}

const statusVariant = {
  completed: 'green',
  voided:    'red',
  refunded:  'yellow',
}

export default function SalesTable({ sales = [], loading }) {
  const columns = [
    {
      header: 'Receipt #',
      key:    'sale_id',
      render: (v) => (
        <span className="font-mono text-sm tracking-wide text-[#004643]">
          #{String(v).slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Date/Time',
      key:    'sale_date',          
      render: (v) => (
        <span className="text-sm font-medium text-[#697773]">
          {formatDateTime(parseBackendTime(v))}
        </span>
      ),
    },
    {
      header: 'Cashier',
      key:    'cashier_name',
      render: (v) => (
        <span className="text-[#182321] font-medium">{v || 'System'}</span>
      ),
    },
    {
      header: 'Items',
      key:    'item_count',
      render: (v) => (
        <span className="text-[#697773]">{v} item(s)</span>
      ),
    },
    {
      header: 'Total',
      key:    'total_amount',
      render: (v) => (
        <span className="font-bold text-[#182321]">{formatCurrency(v)}</span>
      ),
    },
    {
      header: 'Status',
      key:    'status',
      render: (v) => (
        <Badge variant={statusVariant[v?.toLowerCase() ?? 'completed'] ?? 'green'}>
          {v ?? 'completed'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="animate-fade-in">
      <Table
        columns={columns}
        data={sales}
        loading={loading}
        emptyMessage="No sales recorded for this timeframe yet."
      />
    </div>
  )
}
