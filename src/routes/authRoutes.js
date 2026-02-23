const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', require('../controllers/authController').forgotPassword);
router.post('/reset-password', require('../controllers/authController').resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, require('../controllers/authController').updateProfile);
router.delete('/delete-account', protect, require('../controllers/authController').deleteAccount);
router.put('/update-password', protect, require('../controllers/authController').updatePassword);
router.post('/logout', protect, logout);

// User Management Routes (Admin Only)
router.get('/users', protect, authorize('admin'), require('../controllers/authController').getAllUsers);
router.put('/users/:id', protect, authorize('admin'), require('../controllers/authController').updateUserById);
router.delete('/users/:id', protect, authorize('admin'), require('../controllers/authController').deleteUserById);


module.exports = router;
