# Smart Health App - Backend API

Backend REST API for Smart Health wellness tracking application built with Node.js, Express, and MongoDB.

## 🚀 Features

- ✅ User Authentication (JWT)
- ✅ Biometric Data Tracking
- ✅ Activity & Workout Logging
- ✅ Sleep Analysis
- ✅ Cycle Tracking
- ✅ AI-Powered Insights
- ✅ Hardware Integration Ready
- ✅ GDPR Compliant

## 📋 Prerequisites

- Node.js (v18+ LTS)
- MongoDB (v6.x) - Local or Atlas
- npm or yarn

## 🛠️ Installation

### 1. Clone & Navigate
```bash
cd smart-health-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-health-app
JWT_SECRET=your-secret-key
```

### 4. Start MongoDB
Make sure MongoDB is running:
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### 5. Run Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start at: `https://smart-health-ring-production.up.railway.app`

## 📡 API Endpoints

### Base URL
```
https://smart-health-ring-production.up.railway.app/api/v1
```

### Health Check
```
GET /health
```

### Authentication
```
POST /api/v1/auth/register    - Register new user
POST /api/v1/auth/login       - Login user
GET  /api/v1/auth/me          - Get current user (Protected)
POST /api/v1/auth/logout      - Logout user (Protected)
```

### Biometric Data
```
POST /api/v1/biometrics         - Add biometric data (Protected)
GET  /api/v1/biometrics/latest  - Get latest data (Protected)
GET  /api/v1/biometrics/history - Get history (Protected)
```

## 🧪 Testing API

### Using cURL

**Register User:**
```bash
curl -X POST https://smart-health-ring-production.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Login:**
```bash
curl -X POST https://smart-health-ring-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Add Biometric Data:**
```bash
curl -X POST https://smart-health-ring-production.up.railway.app/api/v1/biometrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "heartRate": 72,
    "oxygenLevel": 98,
    "source": "manual"
  }'
```

## 📁 Project Structure

```
smart-health-backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── BiometricData.js   # Biometric data model
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── biometricController.js
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   └── biometricRoutes.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── errorHandler.js    # Error handling
│   └── app.js                 # Express app setup
├── server.js                  # Entry point
├── .env                       # Environment variables
├── .env.example               # Environment template
├── package.json
└── README.md
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-health-app` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | `1h` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:8081` |

## 🗄️ Database Schema

### User Collection
- fullName, email, phone, password (hashed)
- Profile: dateOfBirth, gender, height, weight
- Preferences: stepGoal, sleepGoal, chronotype
- Membership: membershipType, membershipExpiresAt

### BiometricData Collection
- userId (ref: User)
- heartRate, oxygenLevel, hrvRmssd
- recoveryScore, circadianState
- source (manual/device/estimated)
- timestamp

## 🔄 Data Sources

The API supports three data sources:

1. **Manual** - User enters data manually
2. **Device** - Data from hardware devices (future)
3. **Estimated** - Calculated by backend

## 🚧 Roadmap

- [x] Authentication & User Management
- [x] Biometric Data Tracking
- [ ] Activity & Workout Endpoints
- [ ] Sleep Analysis Endpoints
- [ ] Cycle Tracking Endpoints
- [ ] Dashboard Aggregation
- [ ] AI Insights Generation
- [ ] Hardware Integration (Google Fit, Apple Health)
- [ ] Email Notifications
- [ ] Data Export (GDPR)

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill process using port 5000

### JWT Token Error
```
Error: Invalid or expired token
```
**Solution:** Login again to get a new token

## 📝 License

ISC

## 👥 Team

Smart Health Development Team

---

**Status:** ✅ Phase 1 Complete (Auth + Biometrics)  
**Next:** Activity & Sleep Endpoints
