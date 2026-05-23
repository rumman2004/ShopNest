import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar  from './Navbar'

const PAGE_TITLES = {
  '/owner/dashboard': 'Dashboard',
  '/owner/shops':     'Manage Shops',
  '/owner/inventory': 'Inventory',
  '/owner/cashiers':  'Manage Cashiers',
  '/owner/finance':   'Finance Reports',
}

export default function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'ShopNest'

  const handleSidebarToggle = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setSidebarCollapsed((current) => !current)
    } else {
      setSidebarOpen(true)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0EDE5] text-[#182321]">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          onMenuClick={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
          title={title}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
