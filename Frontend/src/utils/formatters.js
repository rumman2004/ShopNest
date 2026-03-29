import { CURRENCY } from './constants'

export const formatCurrency = (value) => {
  // ✅ FIX: guard against undefined/null/NaN
  const num = parseFloat(value)
  if (isNaN(num)) return '₹0.00'
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
  }).format(num)
}

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  }).format(new Date(date))

export const formatDateTime = (value) => {
  // ✅ FIX: guard against undefined, null, or unparseable values
  if (!value) return '—'
  const date = new Date(value)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-IN', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

export const formatNumber = (num = 0) =>
  new Intl.NumberFormat('en-IN').format(num)

export const formatPercent = (value = 0, decimals = 1) =>
  `${Number(value).toFixed(decimals)}%`

export const truncate = (str = '', max = 30) =>
  str.length > max ? str.slice(0, max) + '…' : str

export const formatTime = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    hour:   '2-digit',
    minute: '2-digit',
  }).format(new Date(date))