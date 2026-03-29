import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Layouts
import PublicLayout  from '../components/layout/PublicLayout'
import OwnerLayout   from '../components/layout/OwnerLayout'
import CashierLayout from '../components/layout/CashierLayout'

// Guards
import ProtectedRoute from './ProtectedRoute'
import RoleRoute      from './RoleRoute'

// Public pages
import LandingPage  from '../pages/public/LandingPage'
import LoginPage    from '../pages/public/LoginPage'
import RegisterPage from '../pages/public/RegisterPage'
import NotFoundPage from '../pages/public/NotFoundPage'
import Privacy      from '../pages/public/Privacy'
import Terms        from '../pages/public/Terms'
import Support      from '../pages/public/Support'

// Owner pages
import OwnerDashboard  from '../pages/owner/OwnerDashboard'
import ManageShops     from '../pages/owner/ManageShops'
import Inventory       from '../pages/owner/Inventory'
import ManageCashiers  from '../pages/owner/ManageCashiers'
import FinanceReports  from '../pages/owner/FinanceReports'

// Cashier pages
import PosTerminal from '../pages/cashier/PosTerminal'
import DailySales  from '../pages/cashier/DailySales'
import StockCheck  from '../pages/cashier/StockCheck'

// Root redirect component: Redirects based on auth status at root /
function RootRedirect() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  if (!user) {
    // User not logged in: show landing page (next route) at `/`
    // Return null so router continues to next matching route for `/`
    return null
  }
  
  if (user.type === 'owner') {
    return <Navigate to="/owner/dashboard" replace />
  }
  
  if (user.type === 'cashier') {
    return <Navigate to="/cashier/pos" replace />
  }

  // Fallback to login if unknown
  return <Navigate to="/login" replace />
}

// Public route guard - redirects authenticated user away from public pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // If logged in, redirect user to their dashboard
  if (user) {
    if (user.type === 'owner') {
      return <Navigate to="/owner/dashboard" replace />
    }
    if (user.type === 'cashier') {
      return <Navigate to="/cashier/pos" replace />
    }
  }

  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },       // Landing page at '/'
      { path: 'login', element: <PublicRoute><LoginPage /></PublicRoute> },
      { path: 'register', element: <PublicRoute><RegisterPage /></PublicRoute> },
      { path: 'privacy', element: <PublicRoute><Privacy /></PublicRoute>},
      { path: 'terms', element: <PublicRoute><Terms /></PublicRoute>},
      { path: 'support', element: <PublicRoute><Support /></PublicRoute>},
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/owner',
    element: (
      <ProtectedRoute>
        <RoleRoute role="owner">
          <OwnerLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <OwnerDashboard /> },
      { path: 'shops', element: <ManageShops /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'cashiers', element: <ManageCashiers /> },
      { path: 'finance', element: <FinanceReports /> },
    ],
  },
  {
    path: '/cashier',
    element: (
      <ProtectedRoute>
        <RoleRoute role="cashier">
          <CashierLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="pos" replace /> },
      { path: 'pos', element: <PosTerminal /> },
      { path: 'sales', element: <DailySales /> },
      { path: 'stock', element: <StockCheck /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}