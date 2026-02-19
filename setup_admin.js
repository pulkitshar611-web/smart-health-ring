const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found");
    process.exit(1);
}

const setupAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`✅ MongoDB Connected`);

        const email = 'admin@gmail.com';
        const password = '123456';

        let user = await User.findOne({ email });

        if (user) {
            console.log(`User ${email} found. Updating password...`);
            user.password = password;
            // Ensure phone is present if logic requires it
            if (!user.phone) user.phone = '0000000000';
            await user.save();
            console.log(`✅ Password updated for ${email}`);
        } else {
            console.log(`User ${email} not found. Creating new user...`);
            user = await User.create({
                fullName: 'Admin User',
                email: email,
                password: password,
                phone: '0000000000', // Dummy phone for validation
                membershipType: 'premium'
            });
            console.log(`✅ Created new user: ${email}`);
        }

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        if (error.errors) {
            console.log(JSON.stringify(error.errors, null, 2));
        }
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

setupAdmin();
