import api from './api'

const cashierService = {
  getAll:        (shopId)       => api.get(`/cashiers/shop/${shopId}`),
  getById:       (id)           => api.get(`/cashiers/${id}`),
  create:        (shopId, data) => api.post(`/cashiers/shop/${shopId}`, data),
  update:        (id, data)     => api.put(`/cashiers/${id}`, data),
  deactivate:    (id)           => api.patch(`/cashiers/${id}/status`, { is_active: false }),
  resetPassword: (id, data)     => api.patch(`/cashiers/${id}/password`, data),
}

export default cashierService