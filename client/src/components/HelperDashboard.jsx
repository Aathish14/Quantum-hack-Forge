import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, MapPin, User, LogOut, Loader2, AlertCircle, Phone, Clock, Video, Mic, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const HelperDashboard = ({ user, onLogout }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  // Fetch nearby alerts (6 km radius)
  const fetchNearbyAlerts = async (coords) => {
    try {
      const res = await axios.get(`${API_URL}/nearby-alerts`, {
        params: { lat: coords.latitude, lon: coords.longitude, radius: 6000 }
      });
      
      // Play SOS Sound if new alerts are detected
      if (res.data.length > alerts.length) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.warn("Audio play blocked"));
      }
      
      setAlerts(res.data);
    } catch (err) {
      console.error("Alert fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

    // Heartbeat: Update helper location in DB every 15 seconds
    const updateLocationInDB = async (coords) => {
        if (!user?.id) return;
        console.log(`[HEARTBEAT] Updating location for ${user.id}: ${coords.latitude}, ${coords.longitude}`);
        try {
            await axios.post(`${API_URL}/helpers/update-location`, {
                userId: user.id,
                latitude: coords.latitude,
                longitude: coords.longitude
            });
        } catch (err) {
            console.error("Heartbeat failed:", err);
        }
    };

    useEffect(() => {
        let watchId;
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setLocation(coords);
                    fetchNearbyAlerts(coords);
                    updateLocationInDB(coords);
                },
                () => setLoading(false),
                { enableHighAccuracy: true }
            );

            watchId = navigator.geolocation.watchPosition((pos) => {
                const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                setLocation(coords);
            });
        } else {
            setLoading(false);
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [user?.id]);

    // Separate effect for the periodic refresh to avoid stale closures
    useEffect(() => {
        if (!location) return;

        const interval = setInterval(() => {
            fetchNearbyAlerts(location);
            updateLocationInDB(location);
        }, 8000); // 8 seconds refresh

        return () => clearInterval(interval);
    }, [location, user?.id]);

  return (
    <div className="helper-dashboard">
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="profile-icon">
            <User size={24} color="#ff4d4d" />
          </div>
          <div>
            <h3>Welcome, {user.name}</h3>
            <p className="role-badge">{user.role} • Verified</p>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} style={{ marginRight: 8 }} />
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="section-header">
          <h2>Nearby Emergency Alerts (6km)</h2>
          <div className={`status-dot ${location ? 'online' : 'offline'}`}></div>
          <span style={{ fontSize: 13, color: '#8c8c9e' }}>
            {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Wait for GPS...'}
          </span>
        </div>

        {loading ? (
          <div className="loader-container">
            <Loader2 className="animate-spin" size={40} color="#ff4d4d" />
            <p>Scanning surroundings...</p>
          </div>
        ) : alerts.length > 0 ? (
          <div className="alerts-grid">
            <AnimatePresence>
              {alerts.map((alert) => (
                <motion.div 
                  key={alert._id} 
                  className="alert-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="alert-badge">EMERGENCY</div>
                  <div className="alert-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h4>{alert.triggered_by === 'Victim_User' ? 'Emergency Request' : alert.triggered_by}</h4>
                      <div className="time-badge">
                        <Clock size={12} />
                        <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <MapPin size={16} color="#ff4d4d" />
                      <p>Distance: <span style={{color: '#4dff88'}}>WITHIN 6KM</span></p>
                    </div>
                    
                    <div className="evidence-grid-mini">
                        {alert.video_url && <a href={alert.video_url} target="_blank" rel="noreferrer" className="ev-btn vid"><Video size={14}/> VIDEO</a>}
                        {alert.image_url && <a href={alert.image_url} target="_blank" rel="noreferrer" className="ev-btn img"><ImageIcon size={14}/> PHOTO</a>}
                    </div>

                    <button className="respond-btn" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${alert.latitude},${alert.longitude}`)}>
                      START NAVIGATION
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="no-alerts">
            <Shield size={60} color="#333" style={{ marginBottom: 16 }} />
            <p>No active emergencies nearby. Stay alert!</p>
          </div>
        )}
      </div>

      <style>{`
        .helper-dashboard {
          padding: 24px;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 30px;
        }
        .profile-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 77, 77, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 16px;
        }
        .role-badge {
          font-size: 13px;
          color: #ff4d4d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .logout-btn {
          background: rgba(255,255,255,0.05);
          color: #8c8c9e;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          font-size: 14px;
        }
        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin: 0 12px;
        }
        .status-dot.online { background: #4dff88; box-shadow: 0 0 10px #4dff88; }
        .status-dot.offline { background: #555; }
        .alerts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .alert-card {
          background: rgba(40, 40, 60, 0.8);
          border: 1px solid rgba(255, 77, 77, 0.3);
          border-radius: 20px;
          padding: 20px;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .alert-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          background: #ff4d4d;
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .respond-btn {
          width: 100%;
          background: #ff4d4d;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-weight: 700;
          margin-top: 16px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .respond-btn:hover {
          transform: translateY(-2px);
          background: #ff3333;
        }
        .loader-container, .no-alerts {
          text-align: center;
          padding: 60px 20px;
          color: #8c8c9e;
        }
        .detail-row {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          color: #8c8c9e;
          font-size: 14px;
        }
        .time-badge { display: flex; align-items: center; gap: 4px; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px; font-size: 11px; color: #8c8c9e; }
        .evidence-grid-mini { display: flex; gap: 8px; margin: 15px 0; }
        .ev-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: 800; text-decoration: none; }
        .ev-btn.vid { background: rgba(77, 255, 136, 0.1); color: #4dff88; border: 1px solid rgba(77, 255, 136, 0.3); }
        .ev-btn.img { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3); }
      `}</style>
    </div>
  );
};

export default HelperDashboard;
