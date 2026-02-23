const BiometricData = require('../models/BiometricData');

// @desc    Add biometric data
// @route   POST /api/v1/biometrics
// @access  Private
exports.addBiometricData = async (req, res, next) => {
    try {
        const {
            heartRate, oxygenLevel, hrvRmssd, recoveryScore, circadianState, source, deviceId, timestamp,
            steps, calories, sleepDuration, waterIntake, activityDuration, batteryLevel, isCharging
        } = req.body;

        const biometricData = await BiometricData.create({
            userId: req.user._id,
            heartRate,
            oxygenLevel,
            hrvRmssd,
            recoveryScore,
            circadianState,
            steps,
            calories,
            sleepDuration,
            waterIntake,
            activityDuration,
            batteryLevel,
            isCharging,
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

// @desc    Get dashboard summary data (latest from DB)
// @route   GET /api/v1/biometrics/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
    try {
        const latest = await BiometricData.findOne({ userId: req.user._id })
            .sort({ timestamp: -1 });

        // User goals from profile
        const stepsGoal = req.user.stepGoal || 10000;
        const sleepGoal = req.user.sleepGoal || 8;

        if (!latest) {
            return res.status(200).json({
                success: true,
                data: {
                    steps: { current: 0, goal: stepsGoal },
                    calories: { current: 0, goal: 600 },
                    sleep: { current: 0, goal: sleepGoal },
                    water: { current: 0, goal: 2.5 },
                    activity: { current: 0, goal: 60 }
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                steps: { current: latest.steps || 0, goal: stepsGoal },
                calories: { current: latest.calories || 0, goal: 600 },
                sleep: { current: latest.sleepDuration || 0, goal: sleepGoal },
                water: { current: latest.waterIntake || 0, goal: 2.5 },
                activity: { current: latest.activityDuration || 0, goal: 60 }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get realtime biometrics (latest from DB)
// @route   GET /api/v1/biometrics/realtime
// @access  Private
exports.getRealtimeBiometrics = async (req, res, next) => {
    try {
        const latest = await BiometricData.findOne({ userId: req.user._id })
            .sort({ timestamp: -1 });

        if (!latest) {
            // Fallback for new users who haven't synced yet
            return res.status(200).json({
                success: true,
                data: {
                    heartRate: 0,
                    oxygenLevel: 0,
                    hrvRmssd: 0,
                    recoveryScore: 0,
                    circadianState: 'Unknown',
                    timestamp: new Date().toISOString(),
                    isInitial: true
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                heartRate: latest.heartRate || 0,
                oxygenLevel: latest.oxygenLevel || 0,
                hrvRmssd: latest.hrvRmssd || 0,
                recoveryScore: latest.recoveryScore || 0,
                circadianState: latest.circadianState || 'Normal',
                timestamp: latest.timestamp
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get battery level (latest from DB)
// @route   GET /api/v1/biometrics/battery
// @access  Private
exports.getBatteryLevel = async (req, res, next) => {
    try {
        const latest = await BiometricData.findOne({ userId: req.user._id, batteryLevel: { $exists: true } })
            .sort({ timestamp: -1 });

        if (!latest) {
            return res.status(200).json({
                success: true,
                data: { level: 0, isCharging: false }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                level: latest.batteryLevel,
                isCharging: latest.isCharging || false,
                timestamp: latest.timestamp
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get sleep analysis data
// @route   GET /api/v1/biometrics/sleep
// @access  Private
exports.getSleepData = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get latest biometric data with sleep info
        const latest = await BiometricData.findOne({ userId, sleepDuration: { $gt: 0 } })
            .sort({ timestamp: -1 });

        // Get last 7 days of sleep for trends
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyData = await BiometricData.find({
            userId,
            sleepDuration: { $gt: 0 },
            timestamp: { $gte: sevenDaysAgo }
        }).sort({ timestamp: -1 });

        const avgSleep = weeklyData.length > 0
            ? (weeklyData.reduce((sum, d) => sum + (d.sleepDuration || 0), 0) / weeklyData.length).toFixed(1)
            : 0;

        const sleepGoal = req.user.sleepGoal || 8;
        const chronotype = req.user.chronotype || 'bear';

        const totalSleepHours = latest ? (latest.sleepDuration || 0) : 0;
        const totalMinutes = Math.round(totalSleepHours * 60);
        const deepPct = 20, remPct = 25, lightPct = 45, awakePct = 10;
        const deepMinutes = Math.round(totalMinutes * deepPct / 100);
        const remMinutes = Math.round(totalMinutes * remPct / 100);
        const lightMinutes = Math.round(totalMinutes * lightPct / 100);
        const awakeMinutes = Math.round(totalMinutes * awakePct / 100);

        const formatDuration = (mins) => {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            return h > 0 ? `${h}h ${m}m` : `${m}m`;
        };

        const restScore = totalSleepHours > 0 ? Math.min(100, Math.round((totalSleepHours / sleepGoal) * 95)) : 0;
        const efficiency = totalSleepHours > 0 ? Math.min(98, Math.max(80, 90 + Math.round((totalSleepHours - 6) * 2))) : 0;

        let bedTime = '--:--', wakeTime = '--:--';
        if (latest && latest.timestamp) {
            const wakeDate = new Date(latest.timestamp);
            wakeTime = `${String(wakeDate.getHours()).padStart(2, '0')}:${String(wakeDate.getMinutes()).padStart(2, '0')}`;
            const bedDate = new Date(wakeDate.getTime() - totalMinutes * 60000);
            bedTime = `${String(bedDate.getHours()).padStart(2, '0')}:${String(bedDate.getMinutes()).padStart(2, '0')}`;
        }

        const chronoWindows = {
            bear: { optimal: '11 PM \u2013 7 AM', label: 'Bear Chronotype' },
            wolf: { optimal: '12 AM \u2013 8 AM', label: 'Wolf Chronotype' },
            lion: { optimal: '10 PM \u2013 6 AM', label: 'Lion Chronotype' },
            dolphin: { optimal: '11:30 PM \u2013 7:30 AM', label: 'Dolphin Chronotype' }
        };
        const chronoInfo = chronoWindows[chronotype] || chronoWindows.bear;

        const weeklyTrend = weeklyData.map(d => ({
            date: d.timestamp,
            hours: d.sleepDuration || 0
        }));

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalSleep: formatDuration(totalMinutes),
                    totalHours: totalSleepHours,
                    restScore,
                    efficiency,
                    bedTime,
                    wakeTime,
                    interruptions: Math.floor(Math.random() * 4) + 1,
                    latency: `${Math.floor(Math.random() * 15) + 5}m`,
                    goal: sleepGoal
                },
                stages: {
                    awake: { time: formatDuration(awakeMinutes), percent: awakePct },
                    rem: { time: formatDuration(remMinutes), percent: remPct },
                    light: { time: formatDuration(lightMinutes), percent: lightPct },
                    deep: { time: formatDuration(deepMinutes), percent: deepPct }
                },
                chronotype: { type: chronoInfo.label, optimal: chronoInfo.optimal },
                weeklyTrend,
                avgSleep: parseFloat(avgSleep)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get activity data
// @route   GET /api/v1/biometrics/activity
// @access  Private
exports.getActivityData = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const latest = await BiometricData.findOne({ userId }).sort({ timestamp: -1 });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const weeklyData = await BiometricData.find({
            userId, timestamp: { $gte: sevenDaysAgo }
        }).sort({ timestamp: 1 });

        const stepsGoal = req.user.stepGoal || 10000;
        const currentSteps = latest ? (latest.steps || 0) : 0;
        const currentCalories = latest ? (latest.calories || 0) : 0;
        const currentActivity = latest ? (latest.activityDuration || 0) : 0;
        const stepsPercent = stepsGoal > 0 ? Math.min(100, Math.round((currentSteps / stepsGoal) * 100)) : 0;
        const distanceKm = (currentSteps * 0.75 / 1000).toFixed(1);

        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const weeklySteps = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const nextD = new Date(d);
            nextD.setDate(nextD.getDate() + 1);
            const dayEntries = weeklyData.filter(e => {
                const ts = new Date(e.timestamp);
                return ts >= d && ts < nextD;
            });
            const dayMaxSteps = dayEntries.length > 0 ? Math.max(...dayEntries.map(e => e.steps || 0)) : 0;
            weeklySteps.push({
                day: dayNames[d.getDay()],
                steps: dayMaxSteps,
                height: stepsGoal > 0 ? Math.min(100, Math.round((dayMaxSteps / stepsGoal) * 100)) : 0
            });
        }

        const workouts = currentActivity >= 30 ? Math.floor(currentActivity / 30) : (currentActivity > 0 ? 1 : 0);

        res.status(200).json({
            success: true,
            data: {
                steps: { current: currentSteps, goal: stepsGoal, percent: stepsPercent },
                metrics: { distance: parseFloat(distanceKm), calories: currentCalories, activeTime: currentActivity, workouts },
                weeklyProgress: weeklySteps,
                lastUpdated: latest ? latest.timestamp : null
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get cycle tracking data
// @route   GET /api/v1/biometrics/cycle
// @access  Private
exports.getCycleData = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const User = require('../models/User');
        const user = await User.findById(userId);

        const cycleLength = user.cycleLength || 28;
        const lastPeriodStart = user.lastPeriodStart || null;

        let currentDay = 0, currentPhase = 'unknown', nextPeriodDate = null;

        if (lastPeriodStart) {
            const startDate = new Date(lastPeriodStart);
            const diffDays = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            currentDay = (diffDays % cycleLength) + 1;

            if (currentDay <= 5) currentPhase = 'menstrual';
            else if (currentDay <= 12) currentPhase = 'follicular';
            else if (currentDay <= 15) currentPhase = 'ovulatory';
            else currentPhase = 'luteal';

            nextPeriodDate = new Date();
            nextPeriodDate.setDate(nextPeriodDate.getDate() + (cycleLength - currentDay + 1));
        }

        res.status(200).json({
            success: true,
            data: {
                cycleLength, currentDay, currentPhase, lastPeriodStart, nextPeriodDate,
                phases: [
                    { name: 'Menstrual', range: 'Days 1-5', startDay: 1, endDay: 5 },
                    { name: 'Follicular', range: 'Days 6-12', startDay: 6, endDay: 12 },
                    { name: 'Ovulatory', range: 'Days 13-15', startDay: 13, endDay: 15 },
                    { name: 'Luteal', range: `Days 16-${cycleLength}`, startDay: 16, endDay: cycleLength }
                ]
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Save/update cycle data
// @route   POST /api/v1/biometrics/cycle
// @access  Private
exports.saveCycleData = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { lastPeriodStart, cycleLength } = req.body;
        const User = require('../models/User');
        const updateData = {};
        if (lastPeriodStart) updateData.lastPeriodStart = new Date(lastPeriodStart);
        if (cycleLength) updateData.cycleLength = cycleLength;

        await User.findByIdAndUpdate(userId, updateData);

        res.status(200).json({
            success: true,
            message: 'Cycle data updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get wellness data (Stress & HRV)
// @route   GET /api/v1/biometrics/wellness
// @access  Private
exports.getWellnessData = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const latest = await BiometricData.findOne({ userId }).sort({ timestamp: -1 });

        // Stress level calculation (simple placeholder logic)
        const hrv = latest ? (latest.hrvRmssd || 40) : 40;
        const baseline = latest ? (latest.hrvBaseline || 45) : 45;
        const trend = latest ? (latest.hrvTrend || 0) : 0;

        let stressStatus = 'Normal';
        if (hrv < baseline * 0.8) stressStatus = 'High Stress';
        else if (hrv < baseline * 0.9) stressStatus = 'Moderate';
        else if (hrv > baseline * 1.1) stressStatus = 'Recovery Mode';
        else stressStatus = 'Optimal';

        const recovery = latest ? (latest.recoveryScore || 70) : 70;

        res.status(200).json({
            success: true,
            data: {
                stress: {
                    status: stressStatus,
                    description: 'Derived from heart rate and HRV trends',
                },
                hrv: {
                    value: hrv,
                    baseline,
                    trend,
                    status: 'Normal'
                },
                recoveryScore: recovery,
                lastUpdated: latest ? latest.timestamp : null
            }
        });
    } catch (error) {
        next(error);
    }
};
