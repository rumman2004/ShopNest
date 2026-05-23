import Badge  from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Store, Edit2, Trash2, Users, Package, CheckCircle2 } from 'lucide-react'

export default function ShopCard({ shop, onSelect, onEdit, onDelete, isActive }) {
  return (
    <div 
      className={`
        group relative flex flex-col p-5 bg-[#e5f2f1]  
        rounded-2xl transition-all duration-300 ease-out
        ${isActive 
          ? 'border-2 border-[#004643] shadow-lg shadow-[#004643]/15 bg-[#e5f2f1]/60 scale-[1.02]' 
          : 'border border-[#d9d4c8] hover:border-[#d9d4c8] hover:shadow-[0_8px_30px_rgba(0,111,115,0.15)] hover:-translate-y-1'
        }
      `}
    >
      {/* 🌟 Floating "Selected" Checkmark */}
      {isActive && (
        <div className="absolute -top-3 -right-3 bg-[#004643] text-white rounded-full p-0.5 shadow-md animate-fade-in">
          <CheckCircle2 size={24} className="fill-[#004643] text-white" />
        </div>
      )}

      {/* --- Shop Header --- */}
      <div className="flex gap-4 items-start">
        {/* Logo Container with background glow */}
        <div className="relative shrink-0">
          <div className={`absolute inset-0 rounded-xl blur-md transition-opacity duration-300 ${isActive ? 'bg-[#004643]/30 opacity-60' : 'bg-[#004643]/10 opacity-10 group-hover:opacity-20'}`} />
          {shop.logo_url ? (
            <img
              src={shop.logo_url}
              alt={shop.shop_name}
              className="relative w-16 h-16 rounded-xl object-cover border border-[#d9d4c8] shadow-sm"
            />
          ) : (
            <div className={`relative w-16 h-16 rounded-xl border border-[#d9d4c8] flex items-center justify-center shadow-sm transition-colors duration-300 ${isActive ? 'bg-gradient-to-br from-[#004643] to-[#003734]' : 'bg-gradient-to-br from-[#004643] to-[#003734]'}`}>
              <Store size={28} className={isActive ? 'text-white' : 'text-white group-hover:text-[#182321] transition-colors'} />
            </div>
          )}
        </div>

        {/* Title & Status */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[10px] font-bold text-[#697773] uppercase tracking-widest mb-1 truncate">
            {shop.category || 'General Store'}
          </p>
          <h3 className="text-lg font-bold text-[#182321] leading-tight truncate mb-2">
            {shop.shop_name}
          </h3>
          
          <div>
            {shop.is_active ? (
               <Badge variant="green" className="text-[9px] px-2 py-0.5 shadow-sm shadow-emerald-500/10">Active</Badge>
            ) : (
               <Badge variant="red" className="text-[9px] px-2 py-0.5">Inactive</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d9d4c8] to-transparent my-5" />

      {/* --- Stats Pills --- */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 text-[#182321] bg-[#faf8f2]/40 rounded-lg px-3 py-1.5 border border-[#ebe6dc] shadow-sm">
          <Users size={14} className="text-[#004643]" />
          <span className="text-xs font-semibold">{shop.cashier_count ?? 0}</span>
          <span className="text-[10px] text-[#697773] uppercase tracking-wide">Staff</span>
        </div>
        
        <div className="flex items-center gap-2 text-[#182321] bg-[#faf8f2]/40 rounded-lg px-3 py-1.5 border border-[#ebe6dc] shadow-sm">
          <Package size={14} className="text-[#004643]" />
          <span className="text-xs font-semibold">{shop.product_count ?? 0}</span>
          <span className="text-[10px] text-[#697773] uppercase tracking-wide">Items</span>
        </div>
      </div>

      {/* --- Bottom Actions --- */}
      <div className="mt-auto flex gap-2">
        <Button
          variant={isActive ? 'ghost' : 'primary'} 
          size="sm"
          onClick={() => onSelect(shop)}
          className={`flex-1 rounded-xl shadow-lg transition-transform active:scale-95 ${isActive ? 'pointer-events-none opacity-80 border-[#004643] bg-[#e5f2f1] text-[#004643] shadow-none' : ''}`}
          disabled={isActive}
        >
          {isActive ? 'Managing Now' : 'Select Store'}
        </Button>
        
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(shop); }}
          className="p-2.5 rounded-xl bg-[#e5f2f1] border border-[#d9d4c8] text-[#697773] hover:text-[#182321] hover:bg-[#e5f2f1] hover:border-[#004643]/30 hover:shadow-md transition-all"
          title="Edit shop"
        >
          <Edit2 size={16} strokeWidth={2.5} />
        </button>
        
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(shop); }}
          className="p-2.5 rounded-xl bg-[#e5f2f1] border border-[#d9d4c8] text-[#697773] hover:text-red-300 hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all"
          title="Delete shop"
        >
          <Trash2 size={16} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  )
}