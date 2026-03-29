import Card   from '../../components/ui/Card'
import Badge  from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { Edit, Power, User } from 'lucide-react'

export default function CashierCard({ cashier, onEdit, onDeactivate }) {
  return (
    <Card className="group border-[#84BABF]/20 hover:border-[#84BABF]/40 hover:bg-[#085558]/20 hover:shadow-lg hover:shadow-[#06363D]/50 transition-all duration-300 ease-out flex flex-col h-full">
      
      {/* ─── CARD HEADER & INFO ─── */}
      <div className="flex items-start gap-4">
        
        {/* Avatar with Hover Glow */}
        <div className="relative shrink-0 mt-1">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#006F73] to-[#84BABF] opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-sm" />
          <div className="relative">
            <Avatar name={cashier.full_name} size="lg" className="border-2 border-[#085558] group-hover:border-[#84BABF]/50 transition-colors" />
          </div>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <p className="text-base font-bold text-[#E0EDE9] truncate leading-tight mt-1">
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
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#06363D]/80 border border-[#085558] text-[10px] font-mono text-[#84BABF] tracking-wide shadow-inner">
            <User size={10} className="text-[#006F73]" />
            @{cashier.username}
          </div>
        </div>
      </div>

      {/* ─── CARD ACTIONS (Pushed to bottom) ─── */}
      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#84BABF]/10">
        <Button 
          variant="secondary" 
          size="sm" 
          icon={<Edit size={14} />} 
          onClick={() => onEdit(cashier)} 
          fullWidth
          className="hover:bg-[#006F73]/20 hover:text-[#E0EDE9] hover:border-[#006F73]/50 transition-all"
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