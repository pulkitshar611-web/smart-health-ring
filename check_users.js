const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found");
    process.exit(1);
}

const listUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const users = await User.find({}, 'email fullName phone');
        console.log(`\nFound ${users.length} users.`);

        users.forEach((user, index) => {
            console.log(`\nUser ${index + 1}:`);
            console.log(`ID: ${user._id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Name: ${user.fullName}`);
            console.log(`Phone: ${user.phone}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

listUsers();
