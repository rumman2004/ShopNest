import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/formatters'
import CartItem from './CartItem'
import EmptyState from '../../components/ui/EmptyState'
import { ShoppingCart } from 'lucide-react'

export default function CartSummary() {
  const { items, totals } = useCart()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart size={36} />}
            title="Cart is empty"
            message="Add products from the left panel."
          />
        ) : (
          <div className="px-1">
            {/* ✅ FIX: key must use product_id, not id */}
            {items.map((item) => <CartItem key={item.product_id} item={item} />)}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-white/8 pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Items ({totals.itemCount})</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-white">
            <span>Total</span>
            <span className="gradient-text-blue">{formatCurrency(totals.total)}</span>
          </div>
        </div>
      )}
    </div>
  )
}