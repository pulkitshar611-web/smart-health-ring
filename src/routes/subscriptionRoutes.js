const express = require('express');
const router = express.Router();
const {
    subscribe,
    getAllSubscriptions,
    getMySubscription,
    cancelSubscription
} = require('../controllers/subscriptionController');

const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllSubscriptions);
router.post('/', subscribe);
router.get('/me', getMySubscription);
router.patch('/cancel', cancelSubscription);

module.exports = router;
