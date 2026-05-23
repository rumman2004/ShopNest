import { Minus, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import { useCart } from '../../hooks/useCart'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="group flex items-center gap-3 py-3.5 px-2 -mx-2 border-b border-[#ebe6dc] last:border-0 hover:bg-[#f7f4ed] transition-all rounded-lg cursor-default">

      {/* --- Thumbnail --- */}
      <div className="w-12 h-12 rounded-lg bg-[#f0ede5] border border-[#d9d4c8] flex items-center justify-center shrink-0 overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.product_name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <ImageIcon size={20} className="text-[#9aa39f]" />
        )}
      </div>

      {/* --- Product Details --- */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-bold text-[#182321] truncate tracking-wide leading-tight">
          {item.product_name}
        </p>
        <p className="text-xs text-[#697773] font-semibold mt-0.5">
          {formatCurrency(item.price)}
        </p>
      </div>

      {/* --- Quantity Controls Pill --- */}
      <div className="flex items-center gap-1 bg-[#f7f4ed] rounded-lg p-1 border border-[#d9d4c8]">
        <button
          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
          className="w-6 h-6 rounded-md hover:bg-[#e5f2f1] text-[#004643] flex items-center justify-center transition-all focus:outline-none"
          title="Decrease quantity"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        
        <span className="text-sm font-mono font-bold w-6 text-center text-[#182321]">
          {item.quantity}
        </span>
        
        <button
          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
          disabled={item.quantity >= item.stock_quantity}
          className="w-6 h-6 rounded-md hover:bg-[#e5f2f1] text-[#004643] flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed focus:outline-none"
          title={item.quantity >= item.stock_quantity ? 'Max stock reached' : 'Increase quantity'}
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* --- Line Total --- */}
      <div className="w-16 sm:w-20 text-right shrink-0">
        <p className="text-sm font-extrabold text-[#182321] tracking-wide">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>

      {/* --- Remove Action --- */}
      <button
        onClick={() => removeItem(item.product_id)}
        className="p-2 text-rose-600/70 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all focus:outline-none shrink-0"
        title="Remove item"
      >
        <Trash2 size={16} strokeWidth={2} />
      </button>
      
    </div>
  )
}
