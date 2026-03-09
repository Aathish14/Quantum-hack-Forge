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
    </div>
  );
};

export default EmergencyButton;