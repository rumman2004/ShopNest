import api from './api'

const activityService = {
  // GET /shops/:shop_id/activity?page=1&limit=30
  getByShop: (shopId, params = {}) =>
    api.get(`/shops/${shopId}/activity`, { params }),
}

export default activityService
