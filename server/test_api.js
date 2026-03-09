const axios = require('axios');

async function testApi() {
    try {
        console.log("Testing API: http://localhost:5000/api/nearby-alerts");
        const res = await axios.get('http://localhost:5000/api/nearby-alerts', {
            params: { lat: 13.0517, lon: 80.2105, radius: 6000 }
        });
        console.log("Response Status:", res.status);
        console.log("Alerts Found:", res.data.length);
        if (res.data.length > 0) {
            console.log("First Alert ID:", res.data[0]._id);
        }
    } catch (err) {
        console.error("API Error:", err.message);
        if (err.response) {
            console.error("Server Responded with:", err.response.status);
            console.error("Body:", err.response.data);
        }
    }
}

testApi();
