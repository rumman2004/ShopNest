import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useShop } from '../../hooks/useShop'
import {
  LayoutDashboard, Store, Package, Users, BarChart3,
  ShoppingCart, TrendingUp, ClipboardList, X, ChevronRight,
} from 'lucide-react'
import Avatar from '../ui/Avatar'

const OWNER_NAV = [
  { label: 'Dashboard',  href: '/owner/dashboard', icon: LayoutDashboard },
  { label: 'Shops',      href: '/owner/shops',      icon: Store },
  { label: 'Inventory',  href: '/owner/inventory',  icon: Package },
  { label: 'Cashiers',   href: '/owner/cashiers',   icon: Users },
  { label: 'Finance',    href: '/owner/finance',    icon: BarChart3 },
]

const CASHIER_NAV = [
  { label: 'POS Terminal', href: '/cashier/pos',   icon: ShoppingCart },
  { label: 'Daily Sales',  href: '/cashier/sales', icon: TrendingUp },
  { label: 'Stock Check',  href: '/cashier/stock', icon: ClipboardList },
]

export default function Sidebar({ open, onClose }) {
  const { user, isOwner } = useAuth()
  const { activeShop }    = useShop()
  const nav = isOwner ? OWNER_NAV : CASHIER_NAV

  return (
    <>
      {/* --- Mobile Overlay --- */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-[#182321]/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64
          bg-white border-r border-[#d9d4c8]
          flex flex-col shadow-2xl lg:shadow-sm
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* --- Logo Area --- */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ebe6dc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#004643] flex items-center justify-center shadow-sm">
              <Store size={18} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-[#004643] tracking-tight">
              ShopNest
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#697773] hover:text-[#004643] hover:bg-[#e5f2f1] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Active Shop Indicator --- */}
        {isOwner && activeShop && (
          <div className="mx-4 mt-5 px-4 py-3 rounded-lg bg-[#e5f2f1] border border-[#c8ddda] flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#697773] uppercase tracking-widest mb-0.5">
                Active Store
              </p>
              <p className="text-sm font-semibold text-[#004643] truncate">
                {activeShop.shop_name || activeShop.name}
              </p>
            </div>
          </div>
        )}

        {/* --- Navigation Links --- */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar space-y-6">
          <div>
            <p className="text-[10px] font-bold text-[#697773] uppercase tracking-widest px-3 mb-3">
              {isOwner ? 'Management' : 'Operations'}
            </p>
            <ul className="space-y-1.5">
              {nav.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <NavLink
                    to={href}
                    onClick={onClose}
                    className={({ isActive }) => `
                      group flex items-center justify-between gap-3 px-3 py-2.5
                      rounded-xl text-sm font-semibold transition-all duration-200
                      ${isActive
                        ? 'bg-[#004643] text-white border border-[#004643] shadow-sm'
                        : 'text-[#34413e] hover:text-[#004643] hover:bg-[#e5f2f1] border border-transparent'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-3">
                          <Icon 
                            size={18} 
                            className={isActive ? 'text-white' : 'text-[#697773] group-hover:text-[#004643] transition-colors'} 
                          />
                          {label}
                        </span>
                        {isActive && <ChevronRight size={14} className="text-white" />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* --- User Profile Area --- */}
        <div className="p-5 border-t border-[#ebe6dc] bg-[#faf8f2] mt-auto">
          <div className="flex items-center gap-3 px-1">
            <Avatar name={user?.full_name || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#182321] truncate">
                {user?.full_name}
              </p>
              <p className="text-[11px] font-extrabold text-[#004643] uppercase tracking-wider mt-0.5">
                {user?.type}
              </p>
            </div>
          </div>
        </div>
        
      </aside>
    </>
  )
}
