const express = require('express');
const router = express.Router();
const {
    createPayment,
    getPayments,
    getUserPayments
} = require('../controllers/paymentController');

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(authorize('admin'), getPayments)
    .post(createPayment);

router.get('/user/:userId', getUserPayments);

module.exports = router;
