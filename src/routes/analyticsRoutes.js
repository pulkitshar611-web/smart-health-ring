const express = require('express');
const router = express.Router();
const {
    getRevenueStats,
    getSubscriptionStats,
    getDashboardOverview
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// All routes protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/revenue', getRevenueStats);
router.get('/subscriptions', getSubscriptionStats);
router.get('/dashboard', getDashboardOverview);

module.exports = router;
