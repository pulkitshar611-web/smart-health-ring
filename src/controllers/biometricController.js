const BiometricData = require('../models/BiometricData');

// @desc    Add biometric data
// @route   POST /api/v1/biometrics
// @access  Private
exports.addBiometricData = async (req, res, next) => {
    try {
        const { heartRate, oxygenLevel, hrvRmssd, recoveryScore, circadianState, source, deviceId, timestamp } = req.body;

        const biometricData = await BiometricData.create({
            userId: req.user._id,
            heartRate,
            oxygenLevel,
            hrvRmssd,
            recoveryScore,
            circadianState,
            source: source || 'manual',
            deviceId,
            timestamp: timestamp || new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Biometric data added successfully',
            data: {
                biometricId: biometricData._id,
                timestamp: biometricData.timestamp
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get latest biometric data
// @route   GET /api/v1/biometrics/latest
// @access  Private
exports.getLatestBiometrics = async (req, res, next) => {
    try {
        const biometricData = await BiometricData.findOne({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .select('-userId -__v');

        if (!biometricData) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'No biometric data found'
                }
            });
        }

        res.status(200).json({
            success: true,
            data: biometricData
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get biometric history
// @route   GET /api/v1/biometrics/history
// @access  Private
exports.getBiometricHistory = async (req, res, next) => {
    try {
        const { startDate, endDate, limit = 100, page = 1 } = req.query;

        const query = { userId: req.user._id };

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const biometricData = await BiometricData.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .select('-userId -__v');

        const total = await BiometricData.countDocuments(query);

        res.status(200).json({
            success: true,
            data: biometricData,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard summary data
// @route   GET /api/v1/biometrics/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
    try {
        // Return dummy dashboard data
        res.status(200).json({
            success: true,
            data: {
                steps: { current: 7540, goal: 10000 },
                calories: { current: 450, goal: 600 },
                sleep: { current: 7.5, goal: 8 },
                water: { current: 1.5, goal: 2.5 },
                activity: { current: 45, goal: 60 }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get realtime biometrics (random live values)
// @route   GET /api/v1/biometrics/realtime
// @access  Private
exports.getRealtimeBiometrics = async (req, res, next) => {
    try {
        // Generate random realistic values
        const randomHeartRate = Math.floor(Math.random() * (85 - 65 + 1)) + 65;
        const randomOxygen = (Math.random() * (99.5 - 97.0) + 97.0).toFixed(1);
        const randomHRV = Math.floor(Math.random() * (75 - 45 + 1)) + 45;

        res.status(200).json({
            success: true,
            data: {
                heartRate: randomHeartRate,
                oxygenLevel: parseFloat(randomOxygen),
                hrvRmssd: randomHRV,
                recoveryScore: 82,
                circadianState: 'Optimal',
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dummy battery level
// @route   GET /api/v1/biometrics/battery
// @access  Private
exports.getBatteryLevel = async (req, res, next) => {
    try {
        // Return a dummy battery level
        res.status(200).json({
            success: true,
            data: {
                level: 72,
                isCharging: true,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        next(error);
    }
};
