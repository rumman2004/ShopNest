import axios from 'axios'
import { API_BASE } from '../utils/constants' // ← Make sure this import works

console.log('API_BASE:', API_BASE); // ← Add this for debugging

const api = axios.create({
  baseURL: API_BASE, // ← Should be 'http://localhost:5000/api/v1'
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor — attach JWT ───────────────────────────
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url); // ← Debug log
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle 401 ─────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log('API Error:', error.response?.status, error.config?.url); // ← Debug log
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(
      error.response?.data || { message: 'Network error. Please try again.' }
    )
  }
)

export default api