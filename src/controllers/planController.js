const Plan = require('../models/Plan');

// @desc    Create a new plan
// @route   POST /api/v1/plans
// @access  Private/Admin
exports.createPlan = async (req, res, next) => {
    try {
        const plan = await Plan.create(req.body);

        res.status(201).json({
            success: true,
            data: plan
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Plan with this name already exists' });
        }
        next(error);
    }
};

// @desc    Get all plans (Public/Admin)
// @route   GET /api/v1/plans
// @access  Public
exports.getPlans = async (req, res, next) => {
    try {
        // If query has isAdmin=true, return all, else return only active
        const query = req.query.isAdmin === 'true' ? {} : { isActive: true };

        const plans = await Plan.find(query).sort({ price: 1 });

        res.status(200).json({
            success: true,
            count: plans.length,
            data: plans
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single plan
// @route   GET /api/v1/plans/:id
// @access  Public
exports.getPlan = async (req, res, next) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        res.status(200).json({
            success: true,
            data: plan
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update plan
// @route   PUT /api/v1/plans/:id
// @access  Private/Admin
exports.updatePlan = async (req, res, next) => {
    try {
        let plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: plan
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete plan
// @route   DELETE /api/v1/plans/:id
// @access  Private/Admin
exports.deletePlan = async (req, res, next) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        await plan.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Plan deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update plan status
// @route   PATCH /api/v1/plans/:id/status
// @access  Private/Admin
exports.updatePlanStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;

        const plan = await Plan.findByIdAndUpdate(req.params.id, { isActive }, {
            new: true,
            runValidators: true
        });

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        res.status(200).json({
            success: true,
            data: plan
        });
    } catch (error) {
        next(error);
    }
};
