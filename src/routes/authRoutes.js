const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/users', require('../controllers/authController').getAllUsers); // Added for dashboard
router.post('/forgot-password', require('../controllers/authController').forgotPassword);
router.post('/reset-password', require('../controllers/authController').resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, require('../controllers/authController').updateProfile);
router.delete('/delete-account', protect, require('../controllers/authController').deleteAccount);
router.put('/update-password', protect, require('../controllers/authController').updatePassword);
router.post('/logout', protect, logout);

// User Management Routes (Admin usually, but using protect for now)
router.put('/users/:id', protect, require('../controllers/authController').updateUserById);
router.delete('/users/:id', protect, require('../controllers/authController').deleteUserById);


module.exports = router;
