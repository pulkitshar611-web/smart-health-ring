const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Body parser
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/biometrics', require('./routes/biometricRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));


// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Health API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Route not found'
        }
    });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
