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

// Robust CORS Configuration
// const allowedOrigins = [
//     "http://localhost:5173",
//     "http://localhost:8081",
//     process.env.FRONTEND_URL
// ];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://192.168.')) {
//             callback(null, true);
//         } else {
//             console.log('BLOCKED BY CORS:', origin);
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true
// }));



const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8081",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ BLOCKED BY CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
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
app.use('/api/v1/plans', require('./routes/planRoutes'));
app.use('/api/v1/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));


// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Health API is running',
        timestamp: new Date().toISOString()
    });
});

// DEBUG ENDPOINT - REMOVE IN PRODUCTION
app.get('/debug-env', (req, res) => {
    const secret = process.env.JWT_SECRET;
    res.json({
        secretLength: secret ? secret.length : 0,
        secretFirstChar: secret ? secret.charAt(0) : null,
        secretLastChar: secret ? secret.charAt(secret.length - 1) : null,
        nodeEnv: process.env.NODE_ENV
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
