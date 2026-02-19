const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("No MONGO_URI");
    process.exit(1);
}

const resetPassword = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`DB Connected`);

        const email = 'arav@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found: ${email}`);
            process.exit(1);
        }

        console.log(`Email: ${user.email}`);
        console.log(`Phone: '${user.phone}'`);
        console.log(`Type of Phone: ${typeof user.phone}`);

        user.password = '123456';

        // If phone is missing for some reason, set it to avoid validation error
        if (!user.phone) {
            console.log('Phone missing, setting default');
            user.phone = '9876543210';
        }

        await user.save();
        console.log(`Password reset DONE`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.errors) {
            console.log(JSON.stringify(error.errors, null, 2));
        }
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

resetPassword();
