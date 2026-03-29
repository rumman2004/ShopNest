/**
 * Generate a random hex color for avatar fallback.
 */
export const stringToColor = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = hash % 360
  return `hsl(${h}, 60%, 55%)`
}

/**
 * Get initials from a full name string.
 */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')

/**
 * Deep clone an object.
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

/**
 * Sleep for ms milliseconds (for testing loading states).
 */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Group an array of objects by a key.
 */
export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const group = item[key]
    acc[group] = acc[group] ? [...acc[group], item] : [item]
    return acc
  }, {})

/**
 * Calculate percentage change between two values.
 */
export const percentChange = (current, previous) => {
  if (!previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Debounce a function call.
 */
export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Download data as an Excel file using XLSX.
 */
export const exportToExcel = async (data, filename = 'export') => {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Format bytes to human readable.
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}