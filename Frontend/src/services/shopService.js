import api from './api'

const shopService = {
  // Backend response shape: { success, message, data: [...] or data: {} }
  getAll:     ()             => api.get('/shops'),
  getById:    (shop_id)      => api.get(`/shops/${shop_id}`),
  create:     (data)         => api.post('/shops', data),
  update:     (shop_id, data) => api.put(`/shops/${shop_id}`, data),
  delete:     (shop_id)      => api.delete(`/shops/${shop_id}`),
  uploadLogo: (shop_id, formData) =>
    api.post(`/shops/${shop_id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  setActive:           (shop_id) => api.patch(`/shops/${shop_id}/active`),
  getActivePreference: ()        => api.get('/shops/preference/active'),
}

export default shopService