const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function testConnection() {
    try {
        console.log("Testing connection to: ", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, { 
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000 
        });
        console.log("SUCCESS: Connection worked!");
        process.exit(0);
    } catch (err) {
        console.error("FAILURE: Connection leaked!");
        console.error("Full Error Body:", JSON.stringify(err, null, 2));
        console.error("Error Name:", err.name);
        console.error("Error Code:", err.code);
        process.exit(1);
    }
}

testConnection();
