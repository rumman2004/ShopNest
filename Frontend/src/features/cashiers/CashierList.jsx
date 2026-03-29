import CashierCard from './CashierCard'
import EmptyState  from '../../components/ui/EmptyState'
import { Users }   from 'lucide-react'

// ─── Premium Skeleton Loader ─────────────────────────────────────
// Matches the exact dimensions of CashierCard for a smooth UX
function SkeletonCashierCard() {
  return (
    <div className="bg-[#085558]/10 backdrop-blur-xl border border-[#84BABF]/10 rounded-2xl p-5 flex flex-col h-full animate-pulse">
      <div className="flex items-start gap-4">
        {/* Fake Avatar */}
        <div className="w-12 h-12 rounded-full bg-[#085558]/30 shrink-0" />
        
        {/* Fake Info */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex justify-between items-start gap-2 mb-2.5">
            <div className="w-3/4 h-4 bg-[#84BABF]/20 rounded-full" />
            <div className="w-10 h-4 bg-[#84BABF]/15 rounded-full shrink-0" />
          </div>
          <div className="w-1/2 h-3 bg-[#006F73]/30 rounded-full" />
        </div>
      </div>
      
      {/* Fake Buttons */}
      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#84BABF]/10">
        <div className="h-9 flex-1 bg-[#84BABF]/10 rounded-xl" />
        <div className="h-9 w-10 bg-[#84BABF]/10 rounded-xl shrink-0" />
      </div>
    </div>
  )
}

export default function CashierList({ cashiers = [], loading, onEdit, onDeactivate }) {
  
  // ─── Loading State ───
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-6 animate-fade-in">
        {/* Render 8 skeletons to fill a typical screen */}
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCashierCard key={i} />)}
      </div>
    )
  }

  // ─── Empty State ───
  if (!cashiers.length) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={<Users size={48} className="text-[#84BABF]" />}
          title="No Cashiers Yet"
          message="Create your first cashier account to allow your staff to start selling."
        />
      </div>
    )
  }

  // ─── Data State ───
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-6 animate-fade-in">
      {cashiers.map((c) => (
        <CashierCard
          key={c.cashier_id} 
          cashier={c}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
        />
      ))}
    </div>
  )
}