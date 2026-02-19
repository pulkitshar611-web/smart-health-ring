# 🚀 Quick Start Guide - Smart Health Backend

## ✅ Setup Complete!

Aapka backend successfully setup ho gaya hai! Ab testing shuru karte hain.

---

## 📋 Step-by-Step Testing

### Step 1: Start MongoDB

**Windows:**
```bash
# Open new terminal and run:
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

**MongoDB Atlas (Cloud):**
- `.env` file mein `MONGODB_URI` update karo with your Atlas connection string

---

### Step 2: Start Backend Server

```bash
cd smart-health-backend
npm run dev
```

**Expected Output:**
```
🚀 Server running in development mode on port 5000
📡 API Base URL: https://smart-health-ring-production.up.railway.app/api/v1
💚 Health Check: https://smart-health-ring-production.up.railway.app/health
✅ MongoDB Connected: localhost
```

---

### Step 3: Test Health Check

**Browser mein open karo:**
```
https://smart-health-ring-production.up.railway.app/health
```

**Ya terminal mein:**
```bash
curl https://smart-health-ring-production.up.railway.app/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Smart Health API is running",
  "timestamp": "2024-02-09T14:30:00.000Z"
}
```

---

### Step 4: Register a Test User

```bash
curl -X POST https://smart-health-ring-production.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Test123!@#\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "65c1234567890abcdef12345",
    "email": "test@example.com",
    "fullName": "Test User"
  }
}
```

---

### Step 5: Login

```bash
curl -X POST https://smart-health-ring-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"test@example.com\",\"password\":\"Test123!@#\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "65c1234567890abcdef12345",
      "fullName": "Test User",
      "email": "test@example.com",
      "membershipType": "free"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANT:** Copy the `token` value - aapko next steps mein chahiye!

---

### Step 6: Add Biometric Data

**Replace `YOUR_TOKEN_HERE` with actual token:**

```bash
curl -X POST https://smart-health-ring-production.up.railway.app/api/v1/biometrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"heartRate\":72,\"oxygenLevel\":98,\"hrvRmssd\":42,\"recoveryScore\":84,\"source\":\"manual\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Biometric data added successfully",
  "data": {
    "biometricId": "65c1234567890abcdef67890",
    "timestamp": "2024-02-09T14:30:00.000Z"
  }
}
```

---

### Step 7: Get Latest Biometric Data

```bash
curl -X GET https://smart-health-ring-production.up.railway.app/api/v1/biometrics/latest \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65c1234567890abcdef67890",
    "heartRate": 72,
    "oxygenLevel": 98,
    "hrvRmssd": 42,
    "recoveryScore": 84,
    "source": "manual",
    "timestamp": "2024-02-09T14:30:00.000Z"
  }
}
```

---

## 🎯 Testing with Postman/Thunder Client

### 1. Import Collection

Create new requests in Postman:

**Base URL:** `https://smart-health-ring-production.up.railway.app/api/v1`

### 2. Create Requests

#### Register
- Method: `POST`
- URL: `{{baseUrl}}/auth/register`
- Body (JSON):
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
- Method: `POST`
- URL: `{{baseUrl}}/auth/login`
- Body (JSON):
```json
{
  "identifier": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Add Biometrics
- Method: `POST`
- URL: `{{baseUrl}}/biometrics`
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):
```json
{
  "heartRate": 72,
  "oxygenLevel": 98,
  "source": "manual"
}
```

---

## 🔧 Common Issues & Solutions

### ❌ MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### ❌ Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Change PORT in .env file
PORT=5001
```

### ❌ Invalid Token
```
Error: Invalid or expired token
```
**Solution:**
- Login again to get new token
- Token expires in 1 hour (default)

### ❌ Validation Error
```
Error: Validation failed
```
**Solution:**
- Check request body format
- Ensure all required fields are present

---

## 📱 Connect Frontend

### Update Frontend API Base URL

In your React Native app:

```javascript
// services/api.js
const API_BASE_URL = 'https://smart-health-ring-production.up.railway.app/api/v1';

// For Android emulator:
const API_BASE_URL = 'http://10.0.2.2:5000/api/v1';

// For physical device (same network):
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:5000/api/v1';
```

### Example API Call

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      identifier: email,
      password: password
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Save token
    await AsyncStorage.setItem('token', data.data.token);
    return data.data;
  } else {
    throw new Error(data.error.message);
  }
};
```

---

## 🎉 Success Checklist

- [ ] MongoDB running
- [ ] Server started successfully
- [ ] Health check working
- [ ] User registration working
- [ ] User login working
- [ ] Token received
- [ ] Biometric data added
- [ ] Biometric data retrieved

---

## 🚀 Next Steps

1. ✅ **Test all endpoints** with Postman
2. ✅ **Add more biometric data** to test history endpoint
3. ✅ **Connect frontend** to backend
4. ✅ **Build Activity endpoints** (next phase)
5. ✅ **Build Sleep endpoints** (next phase)

---

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `BACKEND_PRD.md` - Complete API specifications
- `.env.example` - Environment variables template

---

**Status:** ✅ Backend is Ready!  
**Version:** 1.0.0  
**Phase:** 1 Complete (Auth + Biometrics)
