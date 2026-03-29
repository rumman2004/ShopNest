import { createContext, useState, useCallback } from 'react'
import { TOAST_TYPES } from '../utils/constants'

export const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), duration)
    return id
  }, []) // eslint-disable-line

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg, dur) => addToast(msg, TOAST_TYPES.SUCCESS, dur),
    error:   (msg, dur) => addToast(msg, TOAST_TYPES.ERROR,   dur),
    warning: (msg, dur) => addToast(msg, TOAST_TYPES.WARNING, dur),
    info:    (msg, dur) => addToast(msg, TOAST_TYPES.INFO,    dur),
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}