const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            console.log('❌ Auth Failed: No token provided in header');
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Not authorized to access this route'
                }
            });
        }

        try {
            // Verify token
            const secret = process.env.JWT_SECRET;
            console.log(`🔐 Verifying Token: ${token.substring(0, 10)}... | Secret Length: ${secret ? secret.length : 'MISSING'}`);
            const decoded = jwt.verify(token, secret);
            console.log(`✅ Token Verified. User ID: ${decoded.userId}`);

            // Get user from token
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                console.log(`❌ Auth Failed: User not found for ID ${decoded.userId}`);
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User not found'
                    }
                });
            }

            if (!req.user.isActive) {
                console.log(`❌ Auth Failed: User ${req.user._id} is deactivated`);
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Account is deactivated'
                    }
                });
            }

            next();
        } catch (error) {
            console.error('❌ Auth Verification Error:', error.message);
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid or expired token'
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Server error during authentication'
            }
        });
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        // 1. Check if user exists (should be handled by protect, but being safe)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Not authorized' }
            });
        }

        // 2. Map role based on project logic
        // In this project, admins are identified by 'admin' role or specific admin emails
        const isAdmin = req.user.role === 'admin' ||
            req.user.email?.toLowerCase().endsWith('@smarthealth.com') && req.user.email?.toLowerCase().includes('admin');

        // 3. Check if user has required role
        const userRole = isAdmin ? 'admin' : 'user';

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `User role [${userRole}] is not authorized to access this route`
                }
            });
        }

        next();
    };
};

module.exports = { protect, authorize };
