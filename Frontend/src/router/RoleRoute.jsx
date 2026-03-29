import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RoleRoute({ role, children }) {
  const { user } = useAuth()

  // Check if user has the required role/type
  if (user.type !== role) {
    // Redirect to appropriate dashboard based on actual user type
    if (user.type === 'owner') {
      return <Navigate to="/owner/dashboard" replace />
    }
    if (user.type === 'cashier') {
      return <Navigate to="/cashier/pos" replace />
    }
    // Fallback to login if unknown type
    return <Navigate to="/login" replace />
  }

  return children
}