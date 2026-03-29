import api from './api'

const authService = {
  registerOwner: (data) => api.post('/auth/register/owner', data), // Fixed route
  loginOwner:    (data) => api.post('/auth/login', data),          // Use generic login
  loginCashier:  (data) => api.post('/auth/login', data),          // Use generic login
  getMe:         ()     => api.get('/auth/me'),                    // Need to create this endpoint
  changePassword:(data) => api.put('/auth/change-password', data), // Need to create this endpoint
  logout:        ()     => api.post('/auth/logout'),               // Add logout
  refreshToken:  ()     => api.post('/auth/refresh'),              // Add refresh
}

export default authService