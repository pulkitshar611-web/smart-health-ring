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
        enum: ['peak_performance', 'rest', 'recovery', 'active', 'Unknown', 'Normal', 'Optimal']
    },
    bodyClockTime: String, // HH:mm format

    // Daily Metrics (added for ring sync)
    steps: {
        type: Number,
        default: 0
    },
    calories: {
        type: Number,
        default: 0
    },
    sleepDuration: {
        type: Number, // in hours
        default: 0
    },
    waterIntake: {
        type: Number, // in liters
        default: 0
    },
    activityDuration: {
        type: Number, // in minutes
        default: 0
    },

    // Source tracking (for hardware integration)
    source: {
        type: String,
        enum: ['manual', 'device', 'estimated', 'computed'],
        default: 'manual'
    },
    deviceId: String,
    batteryLevel: Number,
    isCharging: {
        type: Boolean,
        default: false
    },

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
