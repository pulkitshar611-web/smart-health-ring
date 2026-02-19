# 🔧 MongoDB Setup Guide

## ❌ Current Error Fixed!

**Error:** `options usenewurlparser, useunifiedtopology are not supported`  
**Status:** ✅ **FIXED!** (Removed deprecated options)

---

## 🗄️ MongoDB Installation & Setup

### **Option 1: Local MongoDB (Recommended for Development)**

#### **Windows:**

**Step 1: Download MongoDB**
1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0+)
   - Platform: Windows
   - Package: MSI
3. Click **"Download"**

**Step 2: Install MongoDB**
1. Run the downloaded `.msi` file
2. Choose **"Complete"** installation
3. ✅ Check **"Install MongoDB as a Service"**
4. ✅ Check **"Install MongoDB Compass"** (GUI tool)
5. Click **"Install"**

**Step 3: Start MongoDB**

MongoDB should start automatically as a service. To verify:

```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# If not running, start it:
Start-Service -Name MongoDB

# Or use mongod command:
mongod
```

**Step 4: Verify Installation**
```powershell
# Open new terminal and run:
mongosh

# You should see:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017
# Using MongoDB: 7.0.x
```

Type `exit` to quit mongosh.

---

### **Option 2: MongoDB Atlas (Cloud - Free Tier)**

If you don't want to install MongoDB locally:

**Step 1: Create Account**
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)

**Step 2: Create Cluster**
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select region (closest to you)
4. Click **"Create"**

**Step 3: Create Database User**
1. Click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Username: `smarthealth`
4. Password: `SmartHealth123!` (save this!)
5. User Privileges: **"Read and write to any database"**
6. Click **"Add User"**

**Step 4: Whitelist IP**
1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

**Step 5: Get Connection String**
1. Click **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Click **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://smarthealth:<password>@cluster0.xxxxx.mongodb.net/
   ```

**Step 6: Update `.env` File**
```env
# Replace this line in .env:
MONGODB_URI=mongodb+srv://smarthealth:SmartHealth123!@cluster0.xxxxx.mongodb.net/smart-health-app?retryWrites=true&w=majority
```

**Important:** Replace `<password>` with your actual password and update the cluster URL!

---

## 🚀 Quick Start

### **If Using Local MongoDB:**

**Terminal 1: Start MongoDB (if not running as service)**
```bash
mongod
```

**Terminal 2: Start Backend**
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

### **If Using MongoDB Atlas:**

Just update `.env` and run:
```bash
npm run dev
```

---

## ✅ Verify MongoDB Connection

### **Test 1: Check Server Health**
```bash
curl https://smart-health-ring-production.up.railway.app/health
```

**Expected:**
```json
{
  "success": true,
  "message": "Smart Health API is running",
  "timestamp": "2024-02-09T..."
}
```

### **Test 2: Register a User**
```bash
curl -X POST https://smart-health-ring-production.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Test123!@#\"}"
```

**Expected:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "...",
    "email": "test@example.com",
    "fullName": "Test User"
  }
}
```

If this works, MongoDB is connected! ✅

---

## 🔍 Check MongoDB Data

### **Using MongoDB Compass (GUI):**
1. Open **MongoDB Compass**
2. Connection String: `mongodb://localhost:27017`
3. Click **"Connect"**
4. You should see `smart-health-app` database
5. Click on it to see collections: `users`, `biometricdatas`, etc.

### **Using mongosh (CLI):**
```bash
mongosh

# Switch to database
use smart-health-app

# Show collections
show collections

# View users
db.users.find().pretty()

# View biometric data
db.biometricdatas.find().pretty()

# Count documents
db.users.countDocuments()
```

---

## ⚠️ Common Issues

### ❌ "MongoServerError: connect ECONNREFUSED"
**Problem:** MongoDB not running  
**Solution:**
```bash
# Windows (as service)
Start-Service -Name MongoDB

# Or start manually
mongod
```

### ❌ "MongooseServerSelectionError: connect ETIMEDOUT"
**Problem:** MongoDB Atlas - Wrong connection string or IP not whitelisted  
**Solution:**
1. Check connection string in `.env`
2. Verify IP is whitelisted in Atlas (Network Access)
3. Check username/password

### ❌ "Authentication failed"
**Problem:** Wrong username/password in Atlas  
**Solution:**
- Verify credentials in Atlas
- Update `.env` with correct password
- Make sure to URL-encode special characters in password

### ❌ Port 27017 already in use
**Problem:** Another MongoDB instance running  
**Solution:**
```bash
# Windows
Get-Process -Name mongod
Stop-Process -Name mongod

# Then restart
mongod
```

---

## 📝 MongoDB Connection Strings

### **Local MongoDB:**
```env
# Default (no authentication)
MONGODB_URI=mongodb://localhost:27017/smart-health-app

# With authentication
MONGODB_URI=mongodb://username:password@localhost:27017/smart-health-app
```

### **MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smart-health-app?retryWrites=true&w=majority
```

---

## 🎯 Current Status

✅ **Code Fixed:** Removed deprecated Mongoose options  
⏳ **MongoDB:** Need to install/configure  
⏳ **Connection:** Waiting for MongoDB to be running

---

## 🚀 Next Steps

1. **Choose Option:**
   - [ ] Install Local MongoDB (recommended for dev)
   - [ ] Use MongoDB Atlas (cloud, easier setup)

2. **Start MongoDB:**
   - [ ] Local: Run `mongod` or start service
   - [ ] Atlas: Update `.env` with connection string

3. **Test Connection:**
   - [ ] Run `npm run dev`
   - [ ] Should see: `✅ MongoDB Connected`

4. **Test API:**
   - [ ] Register a user
   - [ ] Check data in MongoDB Compass

---

## 💡 Recommendation

**For Development:** Use **Local MongoDB**  
**For Production:** Use **MongoDB Atlas**

**Why Local for Dev?**
- ✅ Faster (no network latency)
- ✅ Works offline
- ✅ Free forever
- ✅ Easy to reset/test

---

**Need Help?** Check:
- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/

**Happy Coding! 🚀**
