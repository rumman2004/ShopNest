export const ROLES = {
  OWNER:   'owner',
  CASHIER: 'cashier',
}

export const ROUTES = {
  HOME:            '/',
  LOGIN:           '/login',
  REGISTER:        '/register',
  NOT_FOUND:       '/404',
  OWNER_DASHBOARD: '/owner/dashboard',
  MANAGE_SHOPS:    '/owner/shops',
  INVENTORY:       '/owner/inventory',
  MANAGE_CASHIERS: '/owner/cashiers',
  FINANCE_REPORTS: '/owner/finance',
  POS:             '/cashier/pos',
  DAILY_SALES:     '/cashier/sales',
  STOCK_CHECK:     '/cashier/stock',
}

export const API_BASE = import.meta.env.VITE_API_URL

export const SALE_STATUS = {
  COMPLETED: 'completed',
  VOIDED:    'voided',
  REFUNDED:  'refunded',
}

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR:   'error',
  WARNING: 'warning',
  INFO:    'info',
}

export const PAGINATION_LIMIT = 10

export const CURRENCY = {
  SYMBOL: '₹',
  CODE:   'PHP',
  LOCALE: 'en-PH',
}