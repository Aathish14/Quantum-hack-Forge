# 🛡️ SOS Evidence Saver

A full-stack evidence capture system that records video with audio, tracks GPS location, and securely uploads to the cloud.

## 🚀 Features
- **One-Touch SOS**: Immediate video/audio recording initialization.
- **GPS Tracking**: Captures real-time latitude and longitude.
- **Cloud Hosting**: Securely uploads evidence to Cloudinary.
- **Data Persistence**: Saves metadata (URLs and coordinates) in MongoDB Atlas.
- **Premium UI**: Modern dark-themed design with smooth animations.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account

### 2. Backend Configuration
1. Navigate to the `server` folder.
2. Rename `env.example` to `.env`.
3. Fill in your credentials:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name.
   - `CLOUDINARY_API_KEY`: Your Cloudinary API Key.
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API Secret.

### 3. Installation
From the root directory, run:
```bash
npm install
npm run install:all
```

### 4. Running the Application
Open two terminal windows:

**Terminal 1 (Server):**
```bash
npm run start:server
```

**Terminal 2 (Client):**
```bash
npm run start:client
```

---

## 📂 Project Structure
- `client/`: React frontend (Vite).
- `server/`: Node.js Express backend.
- `server/models/`: MongoDB schemas.

## 🛠️ Tech Stack
- **Frontend**: React, Framer Motion, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Multer, Cloudinary API.
- **Database**: MongoDB (Mongoose).
