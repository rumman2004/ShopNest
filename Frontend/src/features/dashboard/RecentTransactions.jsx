import Card, { CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { FileText } from 'lucide-react'

export default function RecentTransactions({ transactions = [] }) {
  const validTransactions = Array.isArray(transactions) ? transactions : []

  return (
    <Card className="flex flex-col h-full border-[#84BABF]/20 shadow-[0_0_30px_rgba(8,85,88,0.2)]">
      <CardHeader className="border-b border-[#84BABF]/10 pb-4">
        <CardTitle className="text-[#E0EDE9] flex items-center gap-2">
          <FileText size={18} className="text-[#84BABF]" />
          Recent Transactions
        </CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-0 -mx-6 mb-2">
        {validTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center opacity-70">
            <FileText size={32} className="text-[#006F73] mb-3" />
            <p className="text-sm text-[#84BABF]">
              No transactions yet.
            </p>
          </div>
        ) : (
          validTransactions.map((t, i) => {
            const saleId    = t.sale_id ?? t.id ?? i
            const displayId = String(saleId).slice(-8).toUpperCase()
            const amount    = Number(t.total_amount ?? t.amount ?? 0)

            return (
              <div
                key={saleId}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#085558]/30 transition-all duration-200 border-b border-[#84BABF]/5 last:border-0 group cursor-default"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#E0EDE9] group-hover:text-white transition-colors">
                    <span className="text-[10px] font-mono font-medium text-[#006F73] mr-1.5 bg-[#06363D] px-1.5 py-0.5 rounded-md border border-[#085558]">
                      #{displayId}
                    </span>
                  </p>
                  <p className="text-[11px] text-[#84BABF] mt-1 font-medium tracking-wide">
                    {formatDateTime(t.sale_date ?? t.created_at)}
                  </p>
                </div>

                {t.cashier_name && (
                  <div className="hidden sm:flex flex-col items-end shrink-0 mr-2">
                    <span className="text-[10px] text-[#006F73] uppercase tracking-wider mb-0.5">Cashier</span>
                    <p className="text-xs text-[#E0EDE9] font-medium">
                      {t.cashier_name}
                    </p>
                  </div>
                )}

                <div className="shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Badge variant={amount > 0 ? 'green' : 'red'}>
                    {formatCurrency(amount)}
                  </Badge>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}