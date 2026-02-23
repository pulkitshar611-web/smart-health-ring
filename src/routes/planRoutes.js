const express = require('express');
const router = express.Router();
const {
    createPlan,
    getPlans,
    getPlan,
    updatePlan,
    deletePlan,
    updatePlanStatus
} = require('../controllers/planController');

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getPlans)
    .post(protect, authorize('admin'), createPlan);

router
    .route('/:id')
    .get(getPlan)
    .put(protect, authorize('admin'), updatePlan)
    .delete(protect, authorize('admin'), deletePlan);

router.patch('/:id/status', protect, authorize('admin'), updatePlanStatus);

module.exports = router;
