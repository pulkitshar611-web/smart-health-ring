const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

// @desc    Subscribe to a plan
// @route   POST /api/v1/subscriptions
// @access  Private
exports.subscribe = async (req, res, next) => {
    try {
        const { planId, paymentMethod } = req.body;
        const userId = req.user._id;

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        // Calculate end date based on plan type
        const startDate = new Date();
        const endDate = new Date(startDate);
        if (plan.type === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.type === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        // Add trial days if any
        if (plan.trialDays > 0) {
            endDate.setDate(endDate.getDate() + plan.trialDays);
        }

        // Create Subscription
        const subscription = await Subscription.create({
            user: userId,
            plan: planId,
            startDate,
            endDate,
            status: 'active'
        });

        // NOTE: Payment recording should happen here or be triggered separately depending on the flow (e.g. Stripe Webhook)
        // For this implementation, we assume payment is handled on client/stripe and we just record subscription here
        // OR client calls this endpoint after successful payment.

        res.status(201).json({
            success: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all subscriptions (Admin)
// @route   GET /api/v1/subscriptions
// @access  Private/Admin
exports.getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find()
            .populate('user', 'fullName email')
            .populate('plan', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my active subscription
// @route   GET /api/v1/subscriptions/me
// @access  Private
exports.getMySubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user._id,
            status: 'active'
        }).populate('plan');

        if (!subscription) {
            return res.status(200).json({ success: true, data: null });
        }

        res.status(200).json({
            success: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel subscription
// @route   PATCH /api/v1/subscriptions/cancel
// @access  Private
exports.cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            { user: req.user._id, status: 'active' },
            { status: 'cancelled', autoRenewal: false },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'No active subscription found' });
        }

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};
