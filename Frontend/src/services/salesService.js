import api from './api'

const salesService = {
  checkout: (shopId, data) =>
    api.post('/sales', { shop_id: shopId, ...data }),

  getAll: (shopId, params) =>
    api.get(`/sales/shop/${shopId}`, { params }),

  getById: (shopId, id) =>
    api.get(`/sales/${id}`),

  getDailySummary: (shopId, date) =>
    api.get(`/sales/shop/${shopId}/date-range`, {
      params: { start_date: date, end_date: date }
    }),

  getSalesByCashier: (cashierId, params) =>
    api.get(`/sales/cashier/${cashierId}`, { params }),

  getReports: (shopId, params) =>
    api.get(`/reports/dashboard/${shopId}`, { params }),

  exportSales: (shopId, params) =>
    api.get(`/reports/export/sales/${shopId}`, { 
        params: { ...params, format: 'csv' }
    }),
}

export default salesService