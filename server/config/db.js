const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("--- Connecting to MongoDB ---");
        const uri = process.env.MONGO_URI;
        
        // Help identify if URI is empty
        if (!uri) {
            console.error("FATAL ERROR: MONGO_URI is not defined in .env");
            return;
        }

        console.log("Target Cluster:", uri.split('@')[1] ? uri.split('@')[1].split('/')[0] : "Check URI Format");

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Reduced for fast feedback
            connectTimeoutMS: 10000,
            dbName: 'sos_evidence'
        });
        
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("--- MongoDB Connection Failed ---");
        console.error(`Error Logic: ${error.message}`);
        
        if (error.name === 'MongooseServerSelectionError' || error.message.includes('timeout')) {
            console.error('\n⚠️ ACTION REQUIRED: Update MongoDB Firewall ⚠️');
            console.error('The server is being blocked. Choose ONE path to fix it:');
            console.error('\nOption A (Recommended for Hackathon):');
            console.error('1. Go to: https://cloud.mongodb.com/v2/69aebddb105f5cb819902610#/security/network/whitelist');
            console.error('2. Click "Add IP Address" -> Select "Allow Access from Anywhere" (0.0.0.0/0)');
            console.error('3. Click Confirm.');
            console.error('\nOption B (Current IP only):');
            console.error('1. Add this current system IP: 106.192.67.119');
            console.error('\nOnce updated, the server will connect instantly.');
        } else {
            console.error("Please verify your credentials or URI format in .env");
        }
    }
};

module.exports = connectDB;
