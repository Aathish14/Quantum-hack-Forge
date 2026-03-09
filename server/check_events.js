const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SOS_Event = require('./models/SOS_Event');

dotenv.config();

async function checkEvents() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");
        const events = await SOS_Event.find().sort({ timestamp: -1 }).limit(5);
        console.log(`Found ${events.length} recent events.`);
        events.forEach(e => {
            console.log(`- ID: ${e._id}, Triggered: ${e.triggered_by}, Pos: [${e.location.coordinates}], Time: ${e.timestamp}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkEvents();
