const activityService  = require('./activity.service');
const { asyncHandler } = require('../../utils/asyncHandler');

// GET /shops/:shop_id/activity
const getActivity = asyncHandler(async (req, res) => {
  const { shop_id } = req.params;
  const { page = 1, limit = 30 } = req.query;

  const result = await activityService.getActivityByShop({
    shop_id,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.status(200).json({
    success: true,
    message: 'Activity logs retrieved successfully',
    data: result,
  });
});

module.exports = { getActivity };
