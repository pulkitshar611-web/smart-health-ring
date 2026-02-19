const Payment = require('../models/Payment');

// @desc    Log a new payment
// @route   POST /api/v1/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
    try {
        // Automatically attach user ID from token
        req.body.user = req.user._id;

        const payment = await Payment.create(req.body);

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all payments (Admin)
// @route   GET /api/v1/payments
// @access  Private/Admin
exports.getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate('user', 'fullName email')
            .populate('plan', 'name')
            .sort({ paidAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get payments for a specific user
// @route   GET /api/v1/payments/user/:userId
// @access  Private
exports.getUserPayments = async (req, res, next) => {
    try {
        // Ensure user can only view their own payments unless admin
        // if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') { ... }

        const payments = await Payment.find({ user: req.params.userId })
            .populate('plan', 'name')
            .sort({ paidAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};
