const mongoose = require('mongoose');

const biometricDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Vitals
    heartRate: {
        type: Number,
        min: [30, 'Heart rate too low'],
        max: [220, 'Heart rate too high']
    },
    oxygenLevel: {
        type: Number,
        min: [70, 'Oxygen level too low'],
        max: [100, 'Oxygen level cannot exceed 100%']
    },
    hrvRmssd: {
        type: Number,
        min: [10, 'HRV too low'],
        max: [200, 'HRV too high']
    },

    // Recovery
    recoveryScore: {
        type: Number,
        min: 0,
        max: 100
    },
    hrvBaseline: Number,
    hrvTrend: Number, // percentage change

    // Circadian
    circadianState: {
        type: String,
        enum: ['peak_performance', 'rest', 'recovery', 'active']
    },
    bodyClockTime: String, // HH:mm format

    // Source tracking (for hardware integration)
    source: {
        type: String,
        enum: ['manual', 'device', 'estimated'],
        default: 'manual'
    },
    deviceId: String,

    // Metadata
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
biometricDataSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('BiometricData', biometricDataSchema);
