const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SOS_Event = require('./models/SOS_Event');

dotenv.config();

async function testGeo() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const lon = 80.2105;
        const lat = 13.0517;
        const radius = 6000;
        
        console.log(`Searching near [Lon: ${lon}, Lat: ${lat}] with radius ${radius}m...`);
        
        const alerts = await SOS_Event.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lon, lat]
                    },
                    $maxDistance: radius
                }
            }
        });
        
        console.log(`Found ${alerts.length} alerts.`);
        if (alerts.length > 0) {
            alerts.forEach(a => console.log(`- Alert ID: ${a._id}, Coordinates: ${a.location.coordinates}`));
        } else {
            console.log("Try searching globally...");
            const all = await SOS_Event.find();
            console.log(`Total events in DB: ${all.length}`);
            all.forEach(a => console.log(`- ID: ${a._id}, Coordinates: ${a.location.coordinates}`));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testGeo();
