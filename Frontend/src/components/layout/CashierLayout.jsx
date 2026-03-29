import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar  from './Navbar'

// Assume these hooks exist based on your project structure
import { useAuth } from '../../hooks/useAuth'
import { useShop } from '../../hooks/useShop'

// Icons for the dynamic greeting
import { Sun, CloudSun, Moon, Store } from 'lucide-react'

const PAGE_TITLES = {
  '/cashier/pos':   'POS Terminal',
  '/cashier/sales': 'Daily Sales',
  '/cashier/stock': 'Stock Check',
}

// --- Stunning Welcome Overlay Component ---
function WelcomeOverlay() {
  const [isExiting, setIsExiting]   = useState(false)
  const [isUnmounted, setIsUnmounted] = useState(false)
  
  // Safely grab user and shop data (fallback to defaults if still loading)
  const auth = useAuth()
  const shopCtx = useShop()
  
  const cashierName = auth?.user?.name || auth?.user?.full_name || 'Cashier'
  const shopName    = shopCtx?.shop?.shop_name || shopCtx?.shop?.name || 'ShopNest POS'

  // Calculate dynamic greeting and icon
  const hour = new Date().getHours()
  let greeting = 'Good Evening'
  let TimeIcon = Moon
  let iconColor = 'text-indigo-400'

  if (hour < 12) {
    greeting = 'Good Morning'
    TimeIcon = Sun
    iconColor = 'text-amber-400'
  } else if (hour < 17) {
    greeting = 'Good Afternoon'
    TimeIcon = CloudSun
    iconColor = 'text-orange-400'
  }

  // Format date
  const dateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())

  // Handle the smooth fade-out sequence
  useEffect(() => {
    // Hold the screen for 2.2 seconds, then trigger fade out
    const exitTimer = setTimeout(() => setIsExiting(true), 2200)
    
    // Fully unmount after the transition finishes (800ms transition)
    const unmountTimer = setTimeout(() => setIsUnmounted(true), 3000)
    
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(unmountTimer)
    }
  }, [])

  if (isUnmounted) return null

  return (
    <div 
      className={`
        fixed inset-0 z-[99999] flex flex-col items-center justify-center
        bg-[#06363D]/80 backdrop-blur-3xl transition-all duration-700 ease-out
        ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}
      `}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0B2B26]/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        
        {/* Animated Greeting & Icon */}
        <div className="flex items-center gap-3 mb-4 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <TimeIcon size={28} className={`${iconColor} drop-shadow-lg`} strokeWidth={2.5} />
          <span className="text-xl font-bold text-[#84BABF] tracking-widest uppercase">
            {greeting}
          </span>
        </div>

        {/* Cashier Name */}
        <h1 
          className="text-5xl md:text-6xl font-black text-[#E0EDE9] tracking-tight drop-shadow-xl animate-fade-in"
          style={{ animationDelay: '300ms', animationFillMode: 'both' }}
        >
          {cashierName}
        </h1>

        {/* Shop Info */}
        <div 
          className="mt-6 flex items-center gap-2 bg-[#0B2B26]/50 border border-[#84BABF]/20 px-5 py-2.5 rounded-full shadow-lg animate-fade-in"
          style={{ animationDelay: '500ms', animationFillMode: 'both' }}
        >
          <Store size={18} className="text-emerald-400" />
          <span className="font-bold text-emerald-400 tracking-wide">
            {shopName}
          </span>
        </div>

        {/* Date Badge */}
        <div 
          className="mt-12 text-sm font-semibold text-[#84BABF] tracking-wider uppercase animate-fade-in"
          style={{ animationDelay: '700ms', animationFillMode: 'both' }}
        >
          {dateStr}
        </div>

      </div>
    </div>
  )
}

// --- Main Layout Component ---
export default function CashierLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  
  const title = PAGE_TITLES[pathname] || 'ShopNest POS'

  return (
    <>
      {/* 🌟 Injects the smooth welcome animation on initial load */}
      <WelcomeOverlay />

      <div className="flex h-screen overflow-hidden bg-[#0B2B26]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            title={title}
          />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in relative z-0">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}