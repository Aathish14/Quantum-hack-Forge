import { useState } from "react";
import API from "../services/api";

const EmergencyButton = ({ onTriggered }) => {
  const [loading, setLoading] = useState(false);

  const triggerEmergency = () => {
    if (loading) return;
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log("User Location:", lat, lng);

          const loggedInUser = JSON.parse(localStorage.getItem('user'));
          if (!loggedInUser) throw new Error("No user found");

          const res = await API.post("/emergency", {
            userId: loggedInUser._id,
            location: { lat, lng },
            deviceId: "web-browser"
          });

          // Pass the mock incident object back to UserDashboard so it renders the ACTIVE state
          onTriggered({ _id: res.data.incidentId, status: 'ACTIVE' });

        } catch (error) {
          console.error("Emergency error:", error);
          alert("Failed to trigger emergency");
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      }
    );
  };

  return (
<<<<<<< Updated upstream
    <div>
      <button
        onClick={triggerEmergency}
        style={{
          background: "red",
          color: "white",
          padding: "20px",
          fontSize: "20px",
          borderRadius: "8px",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Triggering..." : "Trigger Emergency"}
      </button>
=======
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative group cursor-pointer">
        {/* Outer glowing pulse */}
        {!loading && (
          <div className="absolute -inset-4 bg-brand-red opacity-30 rounded-full blur-xl group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        )}
        
        {/* Radar ping effect */}
        {!loading && (
          <div className="absolute inset-0 rounded-full border-4 border-brand-red opacity-20 animate-ping-slow"></div>
        )}

        <button
          onClick={triggerEmergency}
          disabled={loading}
          className={`relative z-10 flex flex-col items-center justify-center w-64 h-64 md:w-80 md:h-80 rounded-full shadow-2xl transition-all duration-300 transform outline-none focus:outline-none focus:ring-8 focus:ring-red-400 focus:ring-opacity-50 ${
            loading
              ? "bg-red-800 scale-95 cursor-not-allowed shadow-inner"
              : "bg-gradient-to-br from-red-500 to-brand-red hover:from-red-400 hover:to-red-600 hover:scale-105 active:scale-95 active:shadow-inner"
          }`}
          style={{
            boxShadow: loading 
              ? 'inset 0 10px 20px rgba(0,0,0,0.5)' 
              : '0 20px 40px -10px rgba(220, 38, 38, 0.7), inset 0 2px 0 rgba(255,255,255,0.4)',
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin mb-4 h-12 w-12 text-white opacity-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-white text-2xl font-black tracking-widest uppercase">Transmitting...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 md:h-24 md:w-24 text-white mb-2 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-white text-4xl md:text-5xl font-black tracking-widest uppercase drop-shadow-lg">SOS</span>
              <span className="text-red-100 text-sm md:text-base font-bold tracking-widest uppercase mt-4 opacity-80">Tap to Trigger</span>
            </>
          )}
        </button>
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default EmergencyButton;