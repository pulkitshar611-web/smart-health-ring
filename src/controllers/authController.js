const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE
    });
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { fullName, email, phone, password, dateOfBirth, gender } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Please provide fullName, email, and password',
                    details: [
                        { field: 'fullName', message: 'Full name is required' },
                        { field: 'email', message: 'Email is required' },
                        { field: 'password', message: 'Password is required' }
                    ]
                }
            });
        }

        // Check if user already exists
        const query = { $or: [] };
        if (email) query.$or.push({ email });
        if (phone) query.$or.push({ phone });

        const existingUser = await User.findOne(query);
        if (existingUser) {
            console.log(`⚠️ Register attempt: User already exists for [${email}] or [${phone}]`);
            return res.status(409).json({
                success: false,
                error: {
                    code: 'CONFLICT',
                    message: 'User already exists with this email or phone'
                }
            });
        }

        // Create user
        console.log(`📝 Registering user: [${fullName}] with [${email}]`);
        const user = await User.create({
            fullName,
            email,
            phone,
            password,
            dateOfBirth,
            gender
        });

        console.log(`✅ User registered successfully: ${user.email} (${user._id})`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                userId: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;

        // Validation
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Please provide email/phone and password'
                }
            });
        }

        // Find user by email or phone
        let searchIdentifier = identifier;
        const isEmail = /^\S+@\S+\.\S+$/.test(identifier);

        if (isEmail) {
            searchIdentifier = identifier.toLowerCase();
            console.log(`🔍 Login attempt (Email detected): [${identifier}] -> normalized to [${searchIdentifier}]`);
        } else {
            console.log(`🔍 Login attempt (Phone/ID detected): [${identifier}]`);
        }

        const user = await User.findOne({
            $or: [{ email: searchIdentifier }, { phone: searchIdentifier }]
        }).select('+password');

        if (!user) {
            console.log(`❌ Auth Failure: User not found for identifier [${searchIdentifier}]`);
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid credentials'
                }
            });
        }

        console.log(`✅ Auth Step 1: User found [${user.email}] (${user._id})`);

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            console.log(`❌ Auth Failure: Password mismatch for user [${user.email}]`);
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid credentials'
                }
            });
        }

        console.log(`✅ Auth Step 2: Password verified for [${user.email}]`);

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    userId: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    membershipType: user.membershipType
                },
                token,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: user.getPublicProfile()
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        // In a production app, you would invalidate the token here
        // For now, we'll just send a success response
        // Client should delete the token from storage

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Update user profile
// @route   PUT /api/v1/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { fullName, email, dateOfBirth, age, gender, height, weight, stepGoal, sleepGoal, avatar } = req.body;

        const fieldsToUpdate = {};
        if (fullName) fieldsToUpdate.fullName = fullName;
        if (email) fieldsToUpdate.email = email;
        if (dateOfBirth) fieldsToUpdate.dateOfBirth = dateOfBirth;
        if (age) fieldsToUpdate.age = age;
        if (gender) fieldsToUpdate.gender = gender;
        if (height) fieldsToUpdate.height = height;
        if (weight) fieldsToUpdate.weight = weight;
        if (stepGoal) fieldsToUpdate.stepGoal = stepGoal;
        if (sleepGoal) fieldsToUpdate.sleepGoal = sleepGoal;
        if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user.getPublicProfile()
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email'
            });
        }

        // Dummy implementation - simulate success
        res.status(200).json({
            success: true,
            message: 'Reset link sent to your email'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and new password'
            });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        console.log(`✅ Password reset successfully for: [${normalizedEmail}]`);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/v1/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: { /* wrapped in error object for consistency with error handler */
                    code: 'AUTH_ERROR',
                    message: 'Incorrect current password'
                }
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user account
// @route   DELETE /api/v1/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
    try {
        // In a real app, you might find and remove the user or mark as deleted
        // For dummy, we just return success

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
