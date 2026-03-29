import Badge  from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Store, Edit2, Trash2, Users, Package, CheckCircle2 } from 'lucide-react'

export default function ShopCard({ shop, onSelect, onEdit, onDelete, isActive }) {
  return (
    <div 
      className={`
        group relative flex flex-col p-5 bg-[#085558]/20 backdrop-blur-xl 
        rounded-2xl transition-all duration-300 ease-out
        ${isActive 
          ? 'border-2 border-[#006F73] shadow-[0_0_25px_rgba(0,111,115,0.25)] bg-[#006F73]/10 scale-[1.02]' 
          : 'border border-[#84BABF]/20 hover:border-[#84BABF]/40 hover:shadow-[0_8px_30px_rgba(0,111,115,0.15)] hover:-translate-y-1'
        }
      `}
    >
      {/* 🌟 Floating "Selected" Checkmark */}
      {isActive && (
        <div className="absolute -top-3 -right-3 bg-[#006F73] text-[#E0EDE9] rounded-full p-0.5 shadow-[0_0_15px_rgba(0,111,115,0.5)] animate-fade-in">
          <CheckCircle2 size={24} className="fill-[#006F73] text-[#06363D]" />
        </div>
      )}

      {/* --- Shop Header --- */}
      <div className="flex gap-4 items-start">
        {/* Logo Container with background glow */}
        <div className="relative shrink-0">
          <div className={`absolute inset-0 rounded-xl blur-md transition-opacity duration-300 ${isActive ? 'bg-[#006F73] opacity-60' : 'bg-[#84BABF] opacity-10 group-hover:opacity-30'}`} />
          {shop.logo_url ? (
            <img
              src={shop.logo_url}
              alt={shop.shop_name}
              className="relative w-16 h-16 rounded-xl object-cover border border-[#84BABF]/20 shadow-sm"
            />
          ) : (
            <div className={`relative w-16 h-16 rounded-xl border border-[#84BABF]/20 flex items-center justify-center shadow-sm transition-colors duration-300 ${isActive ? 'bg-gradient-to-br from-[#006F73] to-[#085558]' : 'bg-gradient-to-br from-[#085558] to-[#06363D]'}`}>
              <Store size={28} className={isActive ? 'text-[#E0EDE9]' : 'text-[#84BABF] group-hover:text-[#E0EDE9] transition-colors'} />
            </div>
          )}
        </div>

        {/* Title & Status */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[10px] font-bold text-[#84BABF] uppercase tracking-widest mb-1 truncate">
            {shop.category || 'General Store'}
          </p>
          <h3 className="text-lg font-bold text-[#E0EDE9] leading-tight truncate mb-2">
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
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#84BABF]/20 to-transparent my-5" />

      {/* --- Stats Pills --- */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 text-[#E0EDE9] bg-[#06363D]/40 rounded-lg px-3 py-1.5 border border-[#84BABF]/10 shadow-inner">
          <Users size={14} className="text-[#006F73]" />
          <span className="text-xs font-semibold">{shop.cashier_count ?? 0}</span>
          <span className="text-[10px] text-[#84BABF] uppercase tracking-wide">Staff</span>
        </div>
        
        <div className="flex items-center gap-2 text-[#E0EDE9] bg-[#06363D]/40 rounded-lg px-3 py-1.5 border border-[#84BABF]/10 shadow-inner">
          <Package size={14} className="text-[#006F73]" />
          <span className="text-xs font-semibold">{shop.product_count ?? 0}</span>
          <span className="text-[10px] text-[#84BABF] uppercase tracking-wide">Items</span>
        </div>
      </div>

      {/* --- Bottom Actions --- */}
      <div className="mt-auto flex gap-2">
        <Button
          variant={isActive ? 'ghost' : 'primary'} 
          size="sm"
          onClick={() => onSelect(shop)}
          className={`flex-1 rounded-xl shadow-lg transition-transform active:scale-95 ${isActive ? 'pointer-events-none opacity-80 border-[#006F73] bg-[#006F73]/20 text-[#006F73] shadow-none' : ''}`}
          disabled={isActive}
        >
          {isActive ? 'Managing Now' : 'Select Store'}
        </Button>
        
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(shop); }}
          className="p-2.5 rounded-xl bg-[#085558]/30 border border-[#84BABF]/20 text-[#84BABF] hover:text-[#E0EDE9] hover:bg-[#006F73]/40 hover:border-[#006F73]/60 hover:shadow-[0_0_15px_rgba(0,111,115,0.3)] transition-all"
          title="Edit shop"
        >
          <Edit2 size={16} strokeWidth={2.5} />
        </button>
        
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(shop); }}
          className="p-2.5 rounded-xl bg-[#085558]/30 border border-[#84BABF]/20 text-[#84BABF] hover:text-red-300 hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all"
          title="Delete shop"
        >
          <Trash2 size={16} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  )
}