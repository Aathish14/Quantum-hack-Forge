const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

async function verifyAllUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await User.updateMany({}, { $set: { verified: true } });
        console.log(`Success: Verified ${result.modifiedCount} users.`);
        process.exit(0);
    } catch (err) {
        console.error("Verification failed:", err.message);
        process.exit(1);
    }
}

verifyAllUsers();
