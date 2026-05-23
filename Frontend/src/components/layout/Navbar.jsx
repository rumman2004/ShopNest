import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, LogOut, ChevronDown, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useShop } from '../../hooks/useShop'
import { useFetch } from '../../hooks/useFetch'
import { useToast } from '../../hooks/useToast'
import { useClickOutside } from '../../hooks/useClickOutside'
import productService from '../../services/productService'
import Avatar from '../ui/Avatar'

const LOW_STOCK_THRESHOLD = 10

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth()
  const { shopId }       = useShop()
  const { toast }        = useToast()
  const navigate         = useNavigate()

  // --- Dropdown States ---
  const [userDropOpen, setUserDropOpen]   = useState(false)
  const [notifDropOpen, setNotifDropOpen] = useState(false)
  
  const userDropRef  = useRef(null)
  const notifDropRef = useRef(null)

  useClickOutside(userDropRef,  () => setUserDropOpen(false))
  useClickOutside(notifDropRef, () => setNotifDropOpen(false))

  // --- Fetch Products & Calculate Notifications ---
  const { data: productData } = useFetch(
    () => shopId ? productService.getAll(shopId) : Promise.resolve(null),
    [shopId]
  )
  
  const lowStockProducts = useMemo(() => {
    const products = productData?.data?.products ?? productData?.data ?? []
    return products.filter((p) => p.stock_quantity <= LOW_STOCK_THRESHOLD)
  }, [productData])

  const notificationCount = lowStockProducts.length

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  return (
    <header className="
      sticky top-0 z-20 h-20 px-4 md:px-8 
      bg-white border-b border-[#d9d4c8] 
      flex items-center justify-between shadow-sm transition-all
    ">
      {/* --- Left Section --- */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[#697773] hover:text-[#004643] transition-colors p-2 rounded-lg hover:bg-[#e5f2f1] focus:outline-none focus:ring-2 focus:ring-[#004643]"
        >
          <Menu size={22} />
        </button>
        {title && (
          <div className="flex items-center gap-3">
            {/* Optional decorative divider on desktop */}
            <div className="hidden lg:block h-6 w-[2px] bg-[#004643]/30 rounded-full" />
            <h1 className="text-lg font-bold text-[#182321] hidden sm:block tracking-wide">
              {title}
            </h1>
          </div>
        )}
      </div>

      {/* --- Right Section --- */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* --- Notifications Dropdown --- */}
        <div ref={notifDropRef} className="relative">
          <button 
            onClick={() => setNotifDropOpen((p) => !p)}
            className={`relative p-2.5 text-[#697773] hover:text-[#004643] hover:bg-[#e5f2f1] rounded-lg transition-all focus:outline-none ${
              notifDropOpen ? 'bg-[#e5f2f1]' : ''
            }`}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Notification Panel */}
          {notifDropOpen && (
            <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-white rounded-lg border border-[#d9d4c8] shadow-xl animate-scale-in overflow-hidden z-50">
              
              <div className="px-5 py-4 border-b border-[#ebe6dc] bg-[#faf8f2] flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-[#182321]">Notifications</p>
                  <p className="text-[10px] font-bold text-[#697773] uppercase tracking-widest mt-0.5">
                    {shopId ? 'Current Shop' : 'No Shop Selected'}
                  </p>
                </div>
                {notificationCount > 0 && (
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
                    {notificationCount} Alerts
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto no-scrollbar p-2 space-y-1">
                {!shopId ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <p className="text-sm font-semibold text-[#697773]">Select a shop to view notifications.</p>
                  </div>
                ) : notificationCount > 0 ? (
                  lowStockProducts.map((product) => (
                    <div 
                      key={product.product_id} 
                      className="flex items-start gap-3 p-3.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-100"
                    >
                      <div className="p-2 bg-white rounded-lg shrink-0 border border-rose-100">
                        <AlertTriangle size={18} className="text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#182321] leading-tight">
                          Low Stock Warning
                        </p>
                        <p className="text-xs text-[#697773] mt-1.5 leading-relaxed">
                          <strong className="text-[#182321]">{product.product_name}</strong> is running low. Only <strong className="text-rose-700">{product.stock_quantity} left</strong> in inventory.
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#182321]">You're all caught up!</p>
                      <p className="text-xs text-[#697773] mt-1">Inventory levels are looking healthy.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="hidden sm:block h-8 w-px bg-[#d9d4c8] mx-1" />

        {/* --- User Dropdown --- */}
        <div ref={userDropRef} className="relative">
          <button
            onClick={() => setUserDropOpen((p) => !p)}
            className={`flex items-center gap-3 px-2 sm:px-3 py-1.5 rounded-xl transition-all duration-200 focus:outline-none ${
              userDropOpen ? 'bg-[#e5f2f1]' : 'hover:bg-[#e5f2f1]'
            }`}
          >
            <Avatar name={user?.full_name || 'User'} size="sm" className="shadow-sm border border-[#c8ddda]" />
            
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-[#182321] leading-tight">
                {user?.full_name}
              </p>
              <p className="text-[11px] font-extrabold text-[#004643] uppercase tracking-wider mt-0.5">
                {user?.type}
              </p>
            </div>
            
            <ChevronDown
              size={16}
              className={`text-[#697773] hidden sm:block transition-transform duration-300 ${userDropOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* User Dropdown Panel */}
          {userDropOpen && (
            <div className="absolute right-0 top-full mt-4 w-60 bg-white rounded-lg border border-[#d9d4c8] shadow-xl animate-scale-in overflow-hidden z-50">
              
              {/* Dropdown Header */}
              <div className="px-5 py-4 border-b border-[#ebe6dc] bg-[#faf8f2]">
                <p className="text-[10px] font-bold text-[#697773] uppercase tracking-widest mb-1.5">
                  Signed in as
                </p>
                <p className="text-sm font-semibold text-[#182321] truncate">
                  {user?.email || user?.username}
                </p>
              </div>

              {/* Dropdown Actions */}
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <LogOut size={16} strokeWidth={2.5} />
                  Secure Sign Out
                </button>
              </div>
              
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
