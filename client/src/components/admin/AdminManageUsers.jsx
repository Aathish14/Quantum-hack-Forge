import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trash2, ShieldCheck, Mail, Phone, Calendar, Search, UserCheck } from 'lucide-react';

const AdminManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/admin/users');
            setUsers(res.data || []);
        } catch (err) {
            console.error("Fetch Users Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this user from the system?')) return;
        try {
            setActionLoading(userId);
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
            await fetchData();
        } catch (err) {
            console.error("Delete User Failed:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-page-content">
            <div className="admin-header-strip">
                <div>
                    <h2>Central Registry</h2>
                    <p>Secured database of active system users and response personnel.</p>
                </div>
                <div className="search-box-system">
                    <Search size={16} color="#5d5d6d" />
                    <input 
                        type="text" placeholder="Search accounts..." 
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                    <div className="search-keyboard-hint">⌘ F</div>
                </div>
            </div>

            <div className="user-grid-system">
                <AnimatePresence mode="popLayout">
                    {filteredUsers.map(user => (
                        <motion.div 
                            key={user._id} layout
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="premium-member-card"
                        >
                            <div className="card-top-accent"></div>
                            <div className="card-inner">
                                <div className="member-identity">
                                    <div className="member-avatar-box">
                                        {user.name.charAt(0)}
                                        {user.verified && <div className="verification-badge"><ShieldCheck size={10} /></div>}
                                    </div>
                                    <div className="member-core">
                                        <h3>{user.name}</h3>
                                        <div className={`role-pill-alt ${user.role.toLowerCase()}`}>
                                            <UserCheck size={10} />
                                            {user.role}
                                        </div>
                                    </div>
                                    <button 
                                        className="member-purge-btn" 
                                        onClick={() => deleteUser(user._id)} 
                                        disabled={actionLoading === user._id || user.role === 'Admin'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                
                                <div className="member-contact-grid">
                                    <div className="contact-item">
                                        <Mail size={12} />
                                        <span>{user.email || 'N/A'}</span>
                                    </div>
                                    <div className="contact-item">
                                        <Phone size={12} />
                                        <span>{user.phone || 'N/A'}</span>
                                    </div>
                                    <div className="contact-item date">
                                        <Calendar size={12} />
                                        <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredUsers.length === 0 && (
                    <div className="empty-state-placeholder">
                        <Users size={60} strokeWidth={1} />
                        <p>Accessing the vault... No records found.</p>
                    </div>
                )}
            </div>

            <style>{`
                .user-grid-system { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
                .premium-member-card { 
                    background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); 
                    border-radius: 28px; position: relative; overflow: hidden; transition: 0.4s;
                }
                .premium-member-card:hover { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); transform: translateY(-5px); }
                .card-top-accent { height: 4px; background: rgba(255,255,255,0.05); width: 100%; transition: 0.4s; }
                .premium-member-card:hover .card-top-accent { background: #ff4d4d; box-shadow: 0 0 15px rgba(255, 77, 77, 0.4); }

                .card-inner { padding: 30px; }
                .member-identity { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; position: relative; }
                
                .member-avatar-box { 
                    width: 56px; height: 56px; background: rgba(255,255,255,0.03); 
                    border-radius: 18px; display: flex; align-items: center; justify-content: center; 
                    font-size: 22px; font-weight: 900; color: white; border: 1px solid rgba(255,255,255,0.05); position: relative; 
                }
                .verification-badge { position: absolute; -right: 6px; -bottom: 6px; background: #4dff88; color: black; border-radius: 50%; padding: 4px; display: flex; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }

                .member-core h3 { margin: 0 0 6px 0; font-size: 18px; font-weight: 800; color: white; letter-spacing: -0.5px; }
                .role-pill-alt { 
                    display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 900; 
                    text-transform: uppercase; padding: 4px 10px; border-radius: 6px; 
                    background: rgba(255,255,255,0.03); color: #5d5d6d; border: 1px solid rgba(255,255,255,0.05);
                }
                .role-pill-alt.admin { color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2); }
                .role-pill-alt.volunteer { color: #4d88ff; border-color: rgba(77, 136, 255, 0.2); }

                .member-purge-btn { 
                    position: absolute; top: 0; right: 0; background: rgba(255,255,255,0.02); 
                    border: 1px solid rgba(255,255,255,0.05); color: #333; width: 36px; height: 36px; 
                    border-radius: 12px; cursor: pointer; display: flex; align-items: center; 
                    justify-content: center; transition: 0.3s; 
                }
                .member-purge-btn:hover:not(:disabled) { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2); }
                .member-purge-btn:disabled { opacity: 0.1; cursor: not-allowed; }

                .member-contact-grid { display: flex; flex-direction: column; gap: 14px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.03); }
                .contact-item { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #8c8c9e; font-weight: 600; }
                .contact-item.date { font-size: 11px; color: #5d5d6d; margin-top: 5px; }

                .search-box-system { 
                    display: flex; align-items: center; background: rgba(10, 10, 15, 0.4); 
                    border: 1px solid rgba(255,255,255,0.05); padding: 5px 5px 5px 20px; 
                    border-radius: 18px; min-width: 350px; gap: 15px; position: relative;
                }
                .search-box-system input { background: transparent; border: none; outline: none; color: white; width: 100%; font-size: 14px; height: 44px; }
                .search-keyboard-hint { background: rgba(255,255,255,0.03); color: #333; padding: 10px 14px; border-radius: 14px; font-size: 10px; font-weight: 900; }
                .empty-state-placeholder { text-align: center; grid-column: 1 / -1; padding: 100px 0; color: #222; font-weight: 800; font-size: 14px; }
            `}</style>
        </motion.div>
    );
};

export default AdminManageUsers;
