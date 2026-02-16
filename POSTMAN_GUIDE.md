# 📮 Postman Collection - Usage Guide

## 🎯 Files Created

1. **`Smart_Health_API.postman_collection.json`** - Complete API collection
2. **`Smart_Health_Dev.postman_environment.json`** - Development environment

---

## 🚀 How to Import in Postman

### Step 1: Open Postman
Download from: https://www.postman.com/downloads/

### Step 2: Import Collection
1. Click **"Import"** button (top left)
2. Click **"Upload Files"**
3. Select `Smart_Health_API.postman_collection.json`
4. Click **"Import"**

### Step 3: Import Environment
1. Click **"Import"** button again
2. Select `Smart_Health_Dev.postman_environment.json`
3. Click **"Import"**

### Step 4: Select Environment
1. Click environment dropdown (top right)
2. Select **"Smart Health - Development"**

---

## 📁 Collection Structure

```
Smart Health App API/
├── 🏥 Health Check
│   └── Server Health Check
│
├── 🔐 Authentication
│   ├── Register User
│   ├── Login User (Auto-saves token)
│   ├── Get Current User
│   └── Logout User (Auto-clears token)
│
├── 💓 Biometric Data
│   ├── Add Biometric Data - Manual
│   ├── Add Biometric Data - Device
│   ├── Add Biometric Data - Heart Rate Only
│   ├── Get Latest Biometric Data
│   ├── Get Biometric History - All
│   ├── Get Biometric History - Date Range
│   └── Get Biometric History - Last 7 Days
│
└── 🧪 Test Scenarios
    ├── Complete Flow - Register to Data
    │   ├── 1. Register New User
    │   ├── 2. Login User
    │   ├── 3. Add Biometric Data
    │   └── 4. Get Latest Data
    │
    └── Error Scenarios
        ├── Register - Duplicate Email
        ├── Login - Invalid Credentials
        ├── Get Data - No Token
        └── Get Data - Invalid Token
```

---

## 🎯 Quick Start Testing

### Option 1: Automatic Flow (Recommended)
Run the **"Complete Flow - Register to Data"** folder:

1. Right-click on **"Complete Flow - Register to Data"**
2. Click **"Run folder"**
3. Click **"Run Smart Health App API"**
4. Watch all tests pass! ✅

This will:
- ✅ Register a new user
- ✅ Login automatically
- ✅ Save token automatically
- ✅ Add biometric data
- ✅ Retrieve data

### Option 2: Manual Testing
Follow these steps in order:

#### 1. Health Check
```
GET /health
```
Expected: `200 OK` - Server is running

#### 2. Register User
```
POST /auth/register
Body: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
Expected: `201 Created` - User registered

#### 3. Login
```
POST /auth/login
Body: {
  "identifier": "john@example.com",
  "password": "SecurePass123!"
}
```
Expected: `200 OK` - Token automatically saved to environment

#### 4. Add Biometric Data
```
POST /biometrics
Headers: Authorization: Bearer {{token}}
Body: {
  "heartRate": 72,
  "oxygenLevel": 98,
  "source": "manual"
}
```
Expected: `201 Created` - Data added

#### 5. Get Latest Data
```
GET /biometrics/latest
Headers: Authorization: Bearer {{token}}
```
Expected: `200 OK` - Latest data returned

---

## 🔑 Environment Variables

The collection uses these variables (automatically managed):

| Variable | Description | Auto-Set |
|----------|-------------|----------|
| `{{baseUrl}}` | API base URL | ❌ Manual |
| `{{token}}` | JWT access token | ✅ On login |
| `{{refreshToken}}` | Refresh token | ✅ On login |
| `{{userId}}` | User ID | ✅ On register/login |

**Note:** Token is automatically saved when you login and cleared when you logout!

---

## 📝 Request Examples

### Register User
```json
POST {{baseUrl}}/auth/register

{
  "fullName": "Sarah Johnson",
  "email": "sarah@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "dateOfBirth": "1995-05-15",
  "gender": "female"
}
```

### Login
```json
POST {{baseUrl}}/auth/login

{
  "identifier": "sarah@example.com",
  "password": "SecurePass123!"
}
```

### Add Biometric Data (Manual)
```json
POST {{baseUrl}}/biometrics
Authorization: Bearer {{token}}

{
  "heartRate": 72,
  "oxygenLevel": 98,
  "hrvRmssd": 42,
  "recoveryScore": 84,
  "circadianState": "peak_performance",
  "source": "manual"
}
```

### Add Biometric Data (Device - Future)
```json
POST {{baseUrl}}/biometrics
Authorization: Bearer {{token}}

{
  "heartRate": 75,
  "oxygenLevel": 97,
  "source": "device",
  "deviceId": "google_fit",
  "timestamp": "2024-02-09T14:30:00Z"
}
```

### Get Biometric History with Filters
```
GET {{baseUrl}}/biometrics/history?startDate=2024-02-01&endDate=2024-02-09&limit=50&page=1
Authorization: Bearer {{token}}
```

---

## 🧪 Test Scripts

The collection includes **automatic test scripts** that:

### On Login:
```javascript
// Automatically saves token to environment
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set('token', response.data.token);
    pm.environment.set('refreshToken', response.data.refreshToken);
}
```

### On Logout:
```javascript
// Automatically clears token from environment
if (pm.response.code === 200) {
    pm.environment.set('token', '');
    pm.environment.set('refreshToken', '');
}
```

### On Register:
```javascript
// Automatically saves userId
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set('userId', response.data.userId);
}
```

---

## ⚠️ Common Issues

### ❌ "Could not get response"
**Problem:** Server not running  
**Solution:**
```bash
cd smart-health-backend
npm run dev
```

### ❌ "401 Unauthorized"
**Problem:** Token missing or expired  
**Solution:**
1. Run **"Login User"** request
2. Token will be automatically saved
3. Try again

### ❌ "404 Not Found"
**Problem:** Wrong URL or route  
**Solution:**
- Check `baseUrl` in environment: `http://localhost:5000/api/v1`
- Ensure server is running on port 5000

### ❌ "409 Conflict - User already exists"
**Problem:** Email already registered  
**Solution:**
- Use different email
- Or login with existing credentials

---

## 🎯 Testing Checklist

Use this checklist to test all endpoints:

### Health Check
- [ ] Server health check works

### Authentication
- [ ] Register new user
- [ ] Login with email
- [ ] Login with phone (if provided)
- [ ] Get current user profile
- [ ] Logout user

### Biometric Data
- [ ] Add manual biometric data
- [ ] Add device biometric data (future)
- [ ] Add partial data (only heart rate)
- [ ] Get latest biometric data
- [ ] Get all biometric history
- [ ] Get biometric history with date range
- [ ] Get biometric history with pagination

### Error Handling
- [ ] Register with duplicate email (409)
- [ ] Login with wrong password (401)
- [ ] Access protected route without token (401)
- [ ] Access protected route with invalid token (401)

---

## 📊 Expected Responses

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": [
      {
        "field": "fieldName",
        "message": "Field error message"
      }
    ]
  }
}
```

---

## 🚀 Advanced Usage

### Run Collection with Newman (CLI)
```bash
# Install Newman
npm install -g newman

# Run collection
newman run Smart_Health_API.postman_collection.json \
  -e Smart_Health_Dev.postman_environment.json
```

### Export Test Results
1. Click **"Runner"** in Postman
2. Select collection
3. Click **"Run"**
4. Click **"Export Results"**

---

## 📝 Notes

1. **Token Management:** Tokens are automatically saved and used in subsequent requests
2. **Timestamps:** Use `{{$timestamp}}` for unique emails in testing
3. **Date Formats:** Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
4. **Pagination:** Default limit is 100, max is 1000

---

## 🎉 You're Ready!

Import the collection and start testing your API! 🚀

**Files to Import:**
1. `Smart_Health_API.postman_collection.json`
2. `Smart_Health_Dev.postman_environment.json`

**Happy Testing! 💚**
