import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ImageIcon, Search, ExternalLink, Cloud, LayoutGrid } from 'lucide-react';

const AdminEvidence = () => {
    const [evidence, setEvidence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/admin/evidence');
            setEvidence(response.data || []);
        } catch (err) {
            console.error("Fetch Evidence Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const filteredEvidence = evidence.filter(e => 
        e.triggered_by?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && !evidence.length) {
        return (
            <div className="load-state">
                <Cloud className="animate-pulse" size={40} color="#ff4d4d" />
                <p>Retrieving Data Vault...</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-page-content">
            <div className="admin-header-strip">
                <div>
                    <h2>Data Evidence Locker</h2>
                    <p>Aggregated immutable media logs from active incident response.</p>
                </div>
                <div className="search-bar-wrapper">
                    <Search size={18} color="#5d5d6d" />
                    <input 
                        type="text" placeholder="Filter by source ID..." 
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                    <div className="search-tag">S.O.S ADDR</div>
                </div>
            </div>

            <div className="evidence-masonry">
                <AnimatePresence mode="popLayout">
                {filteredEvidence.map(item => (
                    <motion.div 
                        key={item._id} layout
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="evidence-card-alt"
                    >
                        <div className="ev-media-container">
                            {item.video_url && <video src={item.video_url} controls className="ev-video" />}
                            {!item.video_url && item.image_url && <img src={item.image_url} alt="Evidence" className="ev-image" />}
                            {!item.video_url && !item.image_url && (
                                <div className="ev-null-state">
                                    <LayoutGrid size={40} strokeWidth={1} />
                                    <span>MEDIA OFFLINE</span>
                                </div>
                            )}
                            <div className="ev-type-pill">
                                {item.video_url ? <Video size={10} /> : <ImageIcon size={10} />}
                                {item.video_url ? 'SECURED VIDEO' : 'SECURED IMAGE'}
                            </div>
                        </div>
                        <div className="ev-details">
                            <div className="ev-header">
                                <span className="ev-source">ID: {item.triggered_by.substring(0, 12)}...</span>
                                <span className="ev-timestamp">{new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="ev-footer-actions">
                                <a 
                                    href={`https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}`} 
                                    target="_blank" rel="noreferrer" className="ev-location-btn"
                                >
                                    <ExternalLink size={14} /> VIEW COORDINATES
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>

                {filteredEvidence.length === 0 && (
                    <div className="empty-state full-width">
                        <Cloud size={60} color="#222" strokeWidth={1} />
                        <h3>Vault Empty</h3>
                        <p>No evidence matching your current query was found in the central server.</p>
                    </div>
                )}
            </div>

            <style>{`
                .evidence-masonry { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
                .evidence-card-alt { 
                    background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); 
                    border-radius: 28px; overflow: hidden; transition: 0.4s;
                }
                .evidence-card-alt:hover { border-color: rgba(255, 77, 77, 0.4); background: rgba(255,77,77,0.01); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); }
                
                .ev-media-container { height: 240px; background: #000; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
                .ev-video, .ev-image { width: 100%; height: 100%; object-fit: cover; }
                .ev-null-state { color: #1a1a1a; display: flex; flex-direction: column; align-items: center; gap: 12px; font-weight: 800; font-size: 10px; }
                .ev-type-pill { 
                    position: absolute; top: 16px; left: 16px; background: rgba(10, 10, 15, 0.8); 
                    padding: 6px 14px; border-radius: 50px; font-size: 9px; font-weight: 900; 
                    color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.2); 
                    display: flex; align-items: center; gap: 8px; backdrop-filter: blur(10px);
                }

                .ev-details { padding: 24px; }
                .ev-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .ev-source { font-size: 13px; font-weight: 800; color: white; font-family: monospace; }
                .ev-timestamp { font-size: 11px; color: #5d5d6d; font-weight: 700; }
                
                .ev-location-btn { 
                    display: flex; align-items: center; justify-content: center; gap: 10px; 
                    color: #8c8c9e; text-decoration: none; font-size: 11px; font-weight: 900; 
                    letter-spacing: 1px; border: 1px solid rgba(255,255,255,0.03); 
                    padding: 12px; border-radius: 14px; transition: 0.3s;
                }
                .ev-location-btn:hover { color: white; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }

                .search-bar-wrapper { 
                    display: flex; align-items: center; background: rgba(10, 10, 15, 0.4); 
                    border: 1px solid rgba(255,255,255,0.05); padding: 5px 5px 5px 20px; 
                    border-radius: 18px; min-width: 400px; gap: 15px; position: relative;
                }
                .search-bar-wrapper input { background: transparent; border: none; outline: none; color: white; width: 100%; font-size: 14px; font-family: 'Outfit', sans-serif; height: 44px; }
                .search-tag { background: rgba(255,255,255,0.03); color: #5d5d6d; padding: 10px 14px; border-radius: 14px; font-size: 10px; font-weight: 900; letter-spacing: 1px; }
            `}</style>
        </motion.div>
    );
};

export default AdminEvidence;
