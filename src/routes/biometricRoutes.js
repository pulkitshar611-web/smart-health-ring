const express = require('express');
const router = express.Router();
const { addBiometricData, getLatestBiometrics, getBiometricHistory, getBatteryLevel } = require('../controllers/biometricController');
const { protect } = require('../middleware/auth');

// Protected routes
router.use(protect);

router.post('/', addBiometricData);
router.get('/latest', getLatestBiometrics);
router.get('/history', getBiometricHistory);
router.get('/battery', getBatteryLevel);
router.get('/dashboard', require('../controllers/biometricController').getDashboardData);
router.get('/realtime', require('../controllers/biometricController').getRealtimeBiometrics);


module.exports = router;
