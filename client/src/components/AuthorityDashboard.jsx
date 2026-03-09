import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  MapPin, 
  Clock, 
  Video, 
  Mic, 
  Image as ImageIcon, 
  CheckCircle, 
  ExternalLink, 
  AlertTriangle, 
  Users, 
  Activity, 
  CheckSquare, 
  XSquare,
  Search,
  RefreshCw,
  MoreVertical
} from 'lucide-react';

import AdminIncidents from './admin/AdminIncidents';
import AdminEvidence from './admin/AdminEvidence';
import AdminVerifyHelpers from './admin/AdminVerifyHelpers';
import AdminManageUsers from './admin/AdminManageUsers';

const AdminDashboard = () => {
    const [view, setView] = useState('incidents'); // 'incidents', 'evidence', 'verification', 'users'

    const renderPage = () => {
        switch (view) {
            case 'incidents': return <AdminIncidents />;
            case 'evidence': return <AdminEvidence />;
            case 'verification': return <AdminVerifyHelpers />;
            case 'users': return <AdminManageUsers />;
            default: return <AdminIncidents />;
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon-box">
                        <Shield size={22} color="#ff4d4d" />
                    </div>
                    <div className="brand-text">
                        <h3>EQUALGUARD</h3>
                        <span>Command Central</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {[
                        { id: 'incidents', label: 'Alarms & SOS', icon: Activity, desc: 'Real-time response' },
                        { id: 'evidence', label: 'Secure Evidence', icon: Video, desc: 'Digital vault' },
                        { id: 'verification', label: 'Verify Staff', icon: Shield, desc: 'Credential check' },
                        { id: 'users', label: 'System Registry', icon: Users, desc: 'Member database' },
                    ].map(item => (
                        <button 
                            key={item.id}
                            className={`nav-item ${view === item.id ? 'active' : ''}`}
                            onClick={() => setView(item.id)}
                        >
                            <div className={`nav-icon-box ${view === item.id ? 'active' : ''}`}>
                                <item.icon size={20} />
                            </div>
                            <div className="nav-label">
                                <strong>{item.label}</strong>
                                <span>{item.desc}</span>
                            </div>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="ops-status">
                        <div className="pulse-dot"></div>
                        <span>SYSTEM SECURE</span>
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-main-header">
                    <div className="header-breadcrumbs">
                        <span>ADMIN</span>
                        <span className="sep">/</span>
                        <span className="curr">{view.toUpperCase()}</span>
                    </div>
                    <div className="admin-profile-pill">
                        <div className="p-avatar">AD</div>
                        <span>Administrator</span>
                    </div>
                </header>

                <div className="admin-viewport">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            style={{ height: '100%' }}
                        >
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');

                .admin-layout { 
                    display: flex; 
                    height: calc(100vh - 40px); 
                    background: #000; 
                    border-radius: 40px; 
                    overflow: hidden; 
                    border: 1px solid rgba(255,255,255,0.02); 
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,1);
                    font-family: 'Outfit', sans-serif;
                    margin: 20px;
                }
                
                /* Sidebar Refinement */
                .admin-sidebar { 
                    width: 320px; 
                    background: #050508; 
                    border-right: 1px solid rgba(255,255,255,0.03); 
                    display: flex; 
                    flex-direction: column; 
                    padding: 40px 24px; 
                    position: relative;
                }
                .admin-sidebar::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at 0% 0%, rgba(255, 77, 77, 0.05), transparent 60%);
                    pointer-events: none;
                }
                
                .sidebar-brand { display: flex; align-items: center; gap: 16px; margin-bottom: 60px; padding: 0 10px; z-index: 1; }
                .brand-icon-box { background: rgba(255, 77, 77, 0.05); padding: 12px; border-radius: 16px; border: 1px solid rgba(255, 77, 77, 0.1); color: #ff4d4d; }
                .brand-text h3 { margin: 0; font-size: 18px; font-weight: 900; letter-spacing: 1.5px; color: white; line-height: 1; text-transform: uppercase; }
                .brand-text span { font-size: 10px; font-weight: 800; color: #333; letter-spacing: 4px; text-transform: uppercase; margin-top: 6px; display: block; }

                .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 8px; z-index: 1; }
                .nav-item { 
                    transition: 0.4s; border: 1px solid rgba(255,255,255,0.05);
                }
                .nav-icon-box.active { background: #ff4d4d; color: white; border-color: #ff4d4d; box-shadow: 0 8px 24px rgba(255, 77, 77, 0.4); }
                
                .nav-label { display: flex; flex-direction: column; gap: 2px; }
                .nav-label strong { font-size: 14px; font-weight: 700; letter-spacing: 0.2px; }
                .nav-label span { font-size: 11px; color: #5d5d6d; font-weight: 500; }

                .sidebar-footer { margin-top: auto; padding: 20px 10px 0; }
                .ops-status { 
                    display: flex; align-items: center; gap: 12px; 
                    background: rgba(77, 255, 136, 0.05); border: 1px solid rgba(77, 255, 136, 0.1); 
                    padding: 14px; border-radius: 18px; color: #4dff88; font-size: 11px; font-weight: 900; 
                }
                .pulse-dot { width: 8px; height: 8px; background: #4dff88; border-radius: 50%; box-shadow: 0 0 12px #4dff88; animation: pulse 2s infinite; }
                
                /* Main Viewport Container */
                .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: radial-gradient(circle at top right, rgba(255,77,77,0.03), transparent); }
                .admin-main-header { 
                    height: 90px; padding: 0 50px; border-bottom: 1px solid rgba(255,255,255,0.05); 
                    display: flex; align-items: center; justify-content: space-between; 
                    background: rgba(10, 10, 15, 0.2); backdrop-filter: blur(10px);
                }
                .header-breadcrumbs { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 900; letter-spacing: 2px; color: #5d5d6d; }
                .header-breadcrumbs .sep { content: ''; width: 4px; height: 4px; background: #222; border-radius: 50%; }
                .header-breadcrumbs .curr { color: #ff4d4d; }
                
                .admin-profile-pill { 
                    background: rgba(255,255,255,0.02); padding: 8px 20px 8px 8px; border-radius: 50px; 
                    border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 14px; 
                    font-size: 13px; font-weight: 700; color: white; cursor: pointer; transition: 0.3s;
                }
                .admin-profile-pill:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
                .p-avatar { 
                    width: 32px; height: 32px; background: linear-gradient(135deg, #ff4d4d, #b33636); 
                    border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                    font-size: 11px; font-weight: 900; box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
                }

                .admin-viewport { flex: 1; overflow-y: auto; padding: 50px; scroll-behavior: smooth; }
                .admin-viewport::-webkit-scrollbar { width: 5px; }
                .admin-viewport::-webkit-scrollbar-track { background: transparent; }
                .admin-viewport::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .admin-viewport::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }

                /* Shared Module Headers */
                .admin-header-strip { display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; }
                .admin-header-strip h2 { margin: 0 0 6px 0; font-size: 36px; font-weight: 900; color: white; letter-spacing: -1px; }
                .admin-header-strip p { margin: 0; color: #8c8c9e; font-size: 16px; font-weight: 500; }
                
                .live-tag { 
                    display: flex; align-items: center; gap: 10px; background: rgba(255, 77, 77, 0.05); 
                    border: 1px solid rgba(255, 77, 77, 0.1); padding: 8px 18px; border-radius: 50px; 
                    color: #ff4d4d; font-size: 11px; font-weight: 900; letter-spacing: 1px;
                }

                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1.2s linear infinite; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
