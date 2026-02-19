const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('./src/models/User');

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGODB_URI;
const outputFile = path.join(__dirname, 'users_list.txt');

if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

const listUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const users = await User.find({}, 'email fullName phone');

        fs.appendFileSync(outputFile, `Found ${users.length} users.\n\n`);

        users.forEach((user, index) => {
            const info = `User ${index + 1}:\nID: ${user._id}\nEmail: ${user.email}\nName: ${user.fullName}\nPhone: ${user.phone}\n-----------------\n`;
            fs.appendFileSync(outputFile, info);
        });

        console.log(`Users listed to ${outputFile}`);

    } catch (error) {
        fs.appendFileSync(outputFile, `Error: ${error.message}\n`);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

listUsers();
