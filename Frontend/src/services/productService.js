import api from './api'

const productService = {
  // GET /shops/:shop_id/products?search=x&category=y
  getAll: (shopId, params = {}) =>
    api.get(`/shops/${shopId}/products`, { params }),

  // GET /shops/:shop_id/products/:product_id
  getById: (shopId, productId) =>
    api.get(`/shops/${shopId}/products/${productId}`),

  // POST /shops/:shop_id/products
  create: (shopId, data) =>
    api.post(`/shops/${shopId}/products`, data),

  // PUT /shops/:shop_id/products/:product_id
  update: (shopId, productId, data) =>
    api.put(`/shops/${shopId}/products/${productId}`, data),

  // DELETE /shops/:shop_id/products/:product_id
  delete: (shopId, productId) =>
    api.delete(`/shops/${shopId}/products/${productId}`),

  // ✅ Removed: getCategories — categories are now a static list in ProductForm

  // Upload image via the existing PUT update route
  // Backend already has upload.single('image') middleware on PUT /:product_id
  uploadImage: (shopId, productId, formData) =>
    api.put(`/shops/${shopId}/products/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export default productService