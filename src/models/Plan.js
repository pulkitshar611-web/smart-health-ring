const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a plan name'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    type: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: [true, 'Please select a plan type']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    currency: {
        type: String,
        default: 'USD'
    },
    features: {
        type: [String],
        required: true
    },
    trialDays: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isRecommended: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plan', PlanSchema);
