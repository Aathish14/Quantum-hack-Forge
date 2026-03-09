const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testUpload() {
  try {
    console.log("Testing Cloudinary Upload...");
    console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    
    // Upload a small test image (base64)
    const result = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", {
      folder: "test_verification"
    });
    
    console.log("SUCCESS! Cloudinary connected.");
    console.log("URL:", result.secure_url);
    process.exit(0);
  } catch (error) {
    console.error("FAILURE: Cloudinary connection failed.");
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    process.exit(1);
  }
}

testUpload();
