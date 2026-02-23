const express = require('express');
const router = express.Router();
const {
    addBiometricData, getLatestBiometrics, getBiometricHistory, getBatteryLevel,
    getDashboardData, getRealtimeBiometrics,
    getSleepData, getActivityData, getCycleData, saveCycleData, getWellnessData
} = require('../controllers/biometricController');
const { protect } = require('../middleware/auth');

// Protected routes
router.use(protect);

router.post('/', addBiometricData);
router.get('/latest', getLatestBiometrics);
router.get('/history', getBiometricHistory);
router.get('/battery', getBatteryLevel);
router.get('/dashboard', getDashboardData);
router.get('/realtime', getRealtimeBiometrics);
router.get('/sleep', getSleepData);
router.get('/activity', getActivityData);
router.get('/cycle', getCycleData);
router.post('/cycle', saveCycleData);
router.get('/wellness', getWellnessData);

module.exports = router;
