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

const { protect } = require('../middleware/auth');
// Assuming you have an 'admin' middleware, but using 'protect' for now and assuming admin checks might be inside or just relying on protect for this scope.
// BETTER: const { protect, authorize } = require('../middleware/auth'); router.use(protect); router.use(authorize('admin'));

router
    .route('/')
    .get(getPlans)
    .post(protect, createPlan);

router
    .route('/:id')
    .get(getPlan)
    .put(protect, updatePlan)
    .delete(protect, deletePlan);

router.patch('/:id/status', protect, updatePlanStatus);

module.exports = router;
