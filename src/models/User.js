const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Basic Info
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true,
        trim: true,
        match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    avatar: {
        type: String, // Base64 string for now
        default: ''
    },

    // Profile
    dateOfBirth: Date,
    age: Number,
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    height: Number, // in cm
    weight: Number, // in kg

    // Settings
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: String,

    // Preferences
    stepGoal: {
        type: Number,
        default: 12000
    },
    sleepGoal: {
        type: Number,
        default: 8 // hours
    },
    chronotype: {
        type: String,
        enum: ['bear', 'lion', 'wolf', 'dolphin'],
        default: 'bear'
    },

    // Membership
    membershipType: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    membershipExpiresAt: Date,

    // Privacy
    dataConsent: {
        type: Boolean,
        default: false
    },
    privacySettings: {
        shareData: {
            type: Boolean,
            default: false
        },
        analyticsEnabled: {
            type: Boolean,
            default: true
        }
    },

    // Metadata
    lastLoginAt: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
    const user = this.toObject();
    delete user.password;
    delete user.twoFactorSecret;
    delete user.__v;
    return user;
};

module.exports = mongoose.model('User', userSchema);
