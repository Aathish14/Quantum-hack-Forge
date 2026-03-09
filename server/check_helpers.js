const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");
        const users = await User.find({ verified: true });
        console.log(`Found ${users.length} verified users.`);
        users.forEach(u => {
            console.log(`- ${u.name} (${u.role}): Location: [${u.location.coordinates}]`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
