const express  = require('express');
const { authenticate } = require('../../middleware/authenticate');
const activityController = require('./activity.controller');

const router = express.Router({ mergeParams: true });

// GET /shops/:shop_id/activity
router.get('/', authenticate, activityController.getActivity);

module.exports = router;
