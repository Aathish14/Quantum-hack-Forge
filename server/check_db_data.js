const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await User.countDocuments();
        console.log(`Database Check: Found ${count} users.`);
        process.exit(0);
    } catch (err) {
        console.error("Check failed:", err.message);
        process.exit(1);
    }
}

checkData();
