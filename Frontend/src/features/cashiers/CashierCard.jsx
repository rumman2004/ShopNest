import Card   from '../../components/ui/Card'
import Badge  from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { Edit, Power, User } from 'lucide-react'

export default function CashierCard({ cashier, onEdit, onDeactivate }) {
  return (
    <Card className="group border-[#d9d4c8] hover:border-[#d9d4c8] hover:bg-[#e5f2f1] hover:shadow-lg hover:shadow-[#d9d4c8]/40 transition-all duration-300 ease-out flex flex-col h-full">
      
      {/* ─── CARD HEADER & INFO ─── */}
      <div className="flex items-start gap-4">
        
        {/* Avatar with Hover Glow */}
        <div className="relative shrink-0 mt-1">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#004643] to-[#0f766e] opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-sm" />
          <div className="relative">
            <Avatar name={cashier.full_name} size="lg" className="border-2 border-[#d9d4c8] group-hover:border-[#004643]/50 transition-colors" />
          </div>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <p className="text-base font-bold text-[#182321] truncate leading-tight mt-1">
              {cashier.full_name}
            </p>
            <div className="shrink-0 mt-0.5">
              {cashier.is_active
                ? <Badge variant="green">Active</Badge>
                : <Badge variant="red">Inactive</Badge>
              }
            </div>
          </div>
          
          {/* Username Tag */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#faf8f2]/80 border border-[#d9d4c8] text-[10px] font-mono text-[#697773] tracking-wide shadow-sm">
            <User size={10} className="text-[#004643]" />
            @{cashier.username}
          </div>
        </div>
      </div>

      {/* ─── CARD ACTIONS (Pushed to bottom) ─── */}
      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#ebe6dc]">
        <Button 
          variant="secondary" 
          size="sm" 
          icon={<Edit size={14} />} 
          onClick={() => onEdit(cashier)} 
          fullWidth
          className="hover:bg-[#e5f2f1] hover:text-[#182321] hover:border-[#004643]/50 transition-all"
        >
          Edit Profile
        </Button>
        
        <Button 
          variant={cashier.is_active ? "danger" : "secondary"} 
          size="sm" 
          icon={<Power size={14} />} 
          onClick={() => onDeactivate(cashier)} 
          title={cashier.is_active ? "Deactivate Account" : "Reactivate Account"}
          className={`shrink-0 transition-all ${
            cashier.is_active 
              ? 'opacity-80 hover:opacity-100 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
              : 'hover:text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/30'
          }`}
        />
      </div>

    </Card>
  )
}