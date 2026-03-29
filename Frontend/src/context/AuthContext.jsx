import { createContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token,   setToken]   = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    // Call backend logout (silent fail)
    authService.logout().catch((error) => {
      console.warn('Logout API call failed:', error)
    })
    
    // Redirect to login page
    window.location.href = '/login'
  }, [])

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) { 
        setLoading(false)
        return 
      }
      
      try {
        const response = await authService.getMe()
        
        // Handle different response structures from backend
        const userData = response.data?.user || response.user || response.data
        
        if (!userData) {
          throw new Error('No user data received')
        }
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        
      } catch (error) {
        console.error('Token verification failed:', error)
        
        // If token verification fails, logout user
        logout()
        
      } finally {
        setLoading(false)
      }
    }
    
    verify()
  }, [logout]) // Include logout in dependencies

  const login = useCallback((userData, tokenData) => {
    if (!userData || !tokenData) {
      console.error('Invalid login data:', { userData, tokenData })
      return
    }
    
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('user',  JSON.stringify(userData))
    localStorage.setItem('token', tokenData)
    
    console.log('User logged in:', userData)
  }, [])

  // Token refresh function
  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken()
      const newToken = response.data?.accessToken || response.accessToken
      
      if (newToken) {
        setToken(newToken)
        localStorage.setItem('token', newToken)
        return newToken
      }
      
      throw new Error('No token received from refresh')
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return null
    }
  }, [logout])

  // Check if user roles match
  const isOwner   = user?.type === 'owner'
  const isCashier = user?.type === 'cashier'
  const isAuthenticated = !!user && !!token

  // Function to check if user can access a route
  const canAccess = useCallback((requiredRole) => {
    if (!isAuthenticated) return false
    if (!requiredRole) return true
    return user?.type === requiredRole
  }, [user, isAuthenticated])

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshToken,
    isOwner,
    isCashier,
    isAuthenticated,
    canAccess
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}