const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// @desc    Get revenue stats
// @route   GET /api/v1/analytics/revenue
// @access  Private/Admin
exports.getRevenueStats = async (req, res, next) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

        // Total Revenue
        const payments = await Payment.find({ status: 'success' });
        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        // Monthly Revenue
        const monthlyPayments = await Payment.find({
            status: 'success',
            paidAt: { $gte: firstDayOfMonth }
        });
        const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

        // Yearly Revenue
        const yearlyPayments = await Payment.find({
            status: 'success',
            paidAt: { $gte: firstDayOfYear }
        });
        const yearlyRevenue = yearlyPayments.reduce((sum, p) => sum + p.amount, 0);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                monthlyRevenue,
                yearlyRevenue,
                currency: 'USD'
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get subscription stats
// @route   GET /api/v1/analytics/subscriptions
// @access  Private/Admin
exports.getSubscriptionStats = async (req, res, next) => {
    try {
        const totalSubscriptions = await Subscription.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
        const expiredSubscriptions = await Subscription.countDocuments({ status: 'expired' });
        const cancelledSubscriptions = await Subscription.countDocuments({ status: 'cancelled' });

        res.status(200).json({
            success: true,
            data: {
                total: totalSubscriptions,
                active: activeSubscriptions,
                expired: expiredSubscriptions,
                cancelled: cancelledSubscriptions
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard overview stats
// @route   GET /api/v1/analytics/dashboard
// @access  Private/Admin
exports.getDashboardOverview = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();

        // Subscription breakdown
        const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

        // Revenue
        const payments = await Payment.find({ status: 'success' });
        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        // Active Plans count
        const Plan = require('../models/Plan');
        const activePlans = await Plan.countDocuments({ isActive: true });

        // Growth metrics (mock trends for now or calculate from timestamps)
        const stats = [
            { title: 'Total Users', value: totalUsers.toLocaleString(), trend: 'up', trendValue: '+12%', color: 'blue' },
            { title: 'Total Subscriptions', value: activeSubscriptions.toLocaleString(), trend: 'up', trendValue: '+5%', color: 'indigo' },
            { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, trend: 'up', trendValue: '+18%', color: 'green' },
            { title: 'Active Plans', value: activePlans.toLocaleString(), trend: 'up', trendValue: 'Stable', color: 'purple' },
        ];

        res.status(200).json({
            success: true,
            data: {
                stats,
                userBreakdown: {
                    paid: activeSubscriptions,
                    free: totalUsers - activeSubscriptions
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
