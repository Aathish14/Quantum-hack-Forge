import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  ExternalLink, 
  Trash2, 
  Video, 
  CheckCircle,
  Activity,
  Navigation
} from 'lucide-react';

const AdminIncidents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/admin/events');
            setEvents(res.data || []);
        } catch (err) {
            console.error("Fetch Events Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const deleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this incident record?')) return;
        try {
            setActionLoading(eventId);
            await axios.delete(`http://localhost:5000/api/admin/events/${eventId}`);
            await fetchData();
        } catch (err) {
            console.error("Delete Event Failed:", err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && !events.length) {
        return (
            <div className="load-state">
                <Activity className="animate-spin" size={40} color="#ff4d4d" />
                <p>Syncing Emergency Feed...</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-page-content">
            <div className="admin-header-strip">
                <div>
                    <h2>Emergency Monitor</h2>
                    <p>Sub-millisecond tracking for active SOS triggers.</p>
                </div>
                <div className="live-tag">
                    <span className="dot pulse"></span> LIVE OPERATIONS
                </div>
            </div>

            <div className="event-list-grid">
                <AnimatePresence mode="popLayout">
                {events.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
                        <CheckCircle size={60} color="#4dff88" strokeWidth={1} />
                        <h3>Area Secure</h3>
                        <p>No high-priority SOS alerts detected in the current sector.</p>
                    </motion.div>
                ) : (
                    events.map(event => (
                        <motion.div 
                            key={event._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="incident-card"
                        >
                            <div className="incident-card-top">
                                <div className="incident-badge">
                                    <AlertTriangle size={14} />
                                    <span>CRITICAL SOS</span>
                                </div>
                                <button className="delete-action-btn" onClick={() => deleteEvent(event._id)} disabled={actionLoading === event._id}>
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="incident-media">
                                {event.video_url ? (
                                    <video src={event.video_url} controls className="incident-obj" />
                                ) : event.image_url ? (
                                    <img src={event.image_url} className="incident-obj" alt="Incident Media" />
                                ) : (
                                    <div className="media-unavailable">
                                        <Video size={30} strokeWidth={1} />
                                        <span>No Local Evidence Cached</span>
                                    </div>
                                )}
                                <div className="media-overlay-tag">SECURED FEED</div>
                            </div>

                            <div className="incident-card-info">
                                <div className="incident-meta-row">
                                    <div className="meta-item">
                                        <Navigation size={14} color="#ff4d4d" />
                                        <span>{event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}</span>
                                    </div>
                                    <div className="meta-time">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                                </div>
                                
                                <a href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`} target="_blank" rel="noreferrer" className="dispatch-action">
                                    OPEN DISPATCH MAP <ExternalLink size={14} />
                                </a>
                            </div>
                        </motion.div>
                    ))
                )}
                </AnimatePresence>
            </div>

            <style>{`
                .event-list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 30px; }
                .incident-card { 
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); 
                    border-radius: 24px; overflow: hidden; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex; flex-direction: column;
                }
                .incident-card:hover { transform: translateY(-5px); border-color: rgba(255, 77, 77, 0.3); background: rgba(255, 77, 77, 0.02); }
                
                .incident-card-top { padding: 20px; display: flex; justify-content: space-between; align-items: center; }
                .incident-badge { display: flex; align-items: center; gap: 8px; color: #ff4d4d; font-size: 10px; font-weight: 900; letter-spacing: 1px; }
                .delete-action-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #5d5d6d; width: 36px; height: 36px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .delete-action-btn:hover { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2); }

                .incident-media { height: 220px; background: #000; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
                .incident-obj { width: 100%; height: 100%; object-fit: cover; }
                .media-unavailable { display: flex; flex-direction: column; align-items: center; gap: 10px; color: #333; font-size: 11px; font-weight: 700; }
                .media-overlay-tag { position: absolute; bottom: 12px; left: 12px; background: rgba(255, 77, 77, 0.8); color: white; padding: 4px 10px; border-radius: 6px; font-size: 9px; font-weight: 900; letter-spacing: 1px; backdrop-filter: blur(5px); }

                .incident-card-info { padding: 24px; }
                .incident-meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .meta-item { display: flex; align-items: center; gap: 8px; font-family: monospace; font-size: 13px; color: #8c8c9e; font-weight: 600; }
                .meta-time { font-size: 12px; color: #5d5d6d; font-weight: 800; }

                .dispatch-action { 
                    display: flex; align-items: center; justify-content: center; gap: 10px; 
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); 
                    padding: 14px; border-radius: 16px; color: white; text-decoration: none; 
                    font-size: 12px; font-weight: 800; letter-spacing: 1px; transition: 0.3s;
                }
                .dispatch-action:hover { background: white; color: black; }

                .dot.pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
            `}</style>
        </motion.div>
    );
};

export default AdminIncidents;
