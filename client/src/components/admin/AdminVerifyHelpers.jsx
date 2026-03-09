import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, CheckSquare, XSquare, RefreshCw, Activity, Phone, MoreHorizontal } from 'lucide-react';

const AdminVerifyHelpers = () => {
    const [helpers, setHelpers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/admin/helpers');
            setHelpers(res.data || []);
        } catch (err) {
            console.error("Fetch Helpers Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleVerification = async (helperId, currentStatus) => {
        try {
            setActionLoading(helperId);
            await axios.patch(`http://localhost:5000/api/admin/helpers/${helperId}/verify`, {
                verified: !currentStatus
            });
            await fetchData();
        } catch (err) {
            console.error("Verification Toggle Failed:", err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && !helpers.length) {
        return (
            <div className="load-state">
                <Shield className="animate-spin" size={40} color="#ff4d4d" />
                <p>Authenticating Field Staff...</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-page-content">
            <div className="admin-header-strip">
                <div>
                    <h2>Vetting & Compliance</h2>
                    <p>Credential verification for first responders and field surgeons.</p>
                </div>
                <div className="header-actions">
                    <div className="live-status-pill">
                        <Activity size={12} />
                        <span>LIVE DATABASE</span>
                    </div>
                </div>
            </div>

            <div className="glass-table-container">
                <table className="command-table">
                    <thead>
                        <tr>
                            <th>IDENTIFIER / SOURCE</th>
                            <th>CLINICAL ROLE</th>
                            <th>SECURE STATUS</th>
                            <th>FIELD COORDINATES</th>
                            <th className="action-col">COMMAND</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                        {helpers.map(helper => (
                            <motion.tr 
                                key={helper._id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <td>
                                    <div className="staff-cell">
                                        <div className="staff-avatar">{helper.name.charAt(0)}</div>
                                        <div className="staff-meta">
                                            <div className="staff-name">{helper.name}</div>
                                            <div className="staff-contact"><Phone size={10} /> {helper.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={`specialty-tag ${helper.role.toLowerCase()}`}>
                                        {helper.role.toUpperCase()}
                                    </div>
                                </td>
                                <td>
                                    <div className={`compliance-indicator ${helper.verified ? 'v' : 'p'}`}>
                                        <div className="ind-dot"></div>
                                        {helper.verified ? 'SECURE_ACCESS' : 'PENDING_VET'}
                                    </div>
                                </td>
                                <td>
                                    <div className="grid-gps">
                                        <MapPin size={12} />
                                        <span>{helper.location?.coordinates?.[1].toFixed(4)}N / {helper.location?.coordinates?.[0].toFixed(4)}E</span>
                                    </div>
                                </td>
                                <td className="action-col">
                                    <button 
                                        className={`access-toggle ${helper.verified ? 'revoke' : 'grant'}`}
                                        disabled={actionLoading === helper._id}
                                        onClick={() => toggleVerification(helper._id, helper.verified)}
                                    >
                                        {actionLoading === helper._id ? (
                                            <RefreshCw size={14} className="animate-spin" />
                                        ) : helper.verified ? (
                                            <><XSquare size={14}/> REVOKE ACCESS</>
                                        ) : (
                                            <><CheckSquare size={14}/> GRANT ACCESS</>
                                        )}
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            <style>{`
                .glass-table-container { 
                    background: rgba(255,255,255,0.01); border-radius: 30px; 
                    border: 1px solid rgba(255,255,255,0.05); overflow: hidden; 
                    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5);
                }
                .command-table { width: 100%; border-collapse: collapse; text-align: left; }
                .command-table th { 
                    padding: 24px 30px; font-size: 10px; font-weight: 900; 
                    text-transform: uppercase; color: #5d5d6d; letter-spacing: 2px;
                    border-bottom: 1px solid rgba(255,255,255,0.05); 
                }
                .command-table td { padding: 20px 30px; border-bottom: 1px solid rgba(255,255,255,0.02); }
                .command-table tr:hover { background: rgba(255,255,255,0.01); }

                .staff-cell { display: flex; align-items: center; gap: 18px; }
                .staff-avatar { 
                    width: 44px; height: 44px; background: rgba(255,255,255,0.03); 
                    color: white; border-radius: 14px; display: flex; align-items: center; 
                    justify-content: center; font-weight: 900; border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .staff-name { font-size: 14px; font-weight: 800; color: white; margin-bottom: 4px; }
                .staff-contact { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #5d5d6d; font-weight: 700; }

                .specialty-tag { 
                    background: rgba(255,255,255,0.03); color: #8c8c9e; 
                    padding: 6px 12px; border-radius: 8px; font-size: 9px; 
                    font-weight: 900; letter-spacing: 1px; width: fit-content;
                }
                .specialty-tag.doctor { background: rgba(77, 255, 136, 0.05); color: #4dff88; border: 1px solid rgba(77, 255, 136, 0.1); }
                .specialty-tag.volunteer { background: rgba(77, 136, 255, 0.05); color: #4d88ff; border: 1px solid rgba(77, 136, 255, 0.1); }

                .compliance-indicator { display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 900; letter-spacing: 1px; }
                .compliance-indicator.v { color: #4dff88; }
                .compliance-indicator.p { color: #5d5d6d; }
                .ind-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
                
                .grid-gps { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #5d5d6d; font-family: monospace; font-weight: 700; }
                
                .access-toggle { 
                    border: none; padding: 10px 18px; border-radius: 14px; 
                    font-size: 10px; font-weight: 900; cursor: pointer; 
                    display: flex; align-items: center; gap: 10px; transition: 0.3s; 
                    letter-spacing: 1px; font-family: 'Outfit', sans-serif;
                }
                .access-toggle.grant { background: #ff4d4d; color: white; box-shadow: 0 4px 15px rgba(255, 77, 77, 0.3); }
                .access-toggle.revoke { background: rgba(255,255,255,0.03); color: #5d5d6d; border: 1px solid rgba(255,255,255,0.05); }
                .access-toggle:hover { transform: translateY(-3px); }
                .action-col { text-align: right; }

                .live-status-pill { 
                    display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.02); 
                    padding: 8px 18px; border-radius: 50px; font-size: 10px; font-weight: 900; 
                    color: #5d5d6d; border: 1px solid rgba(255,255,255,0.05);
                }
            `}</style>
        </motion.div>
    );
};

export default AdminVerifyHelpers;
