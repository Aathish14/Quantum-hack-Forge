import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, User2, MapPin, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SOSButton from './components/SOSButton';
import HelperRegister from './components/HelperRegister';
import HelperDashboard from './components/HelperDashboard';
import AuthorityDashboard from './components/AuthorityDashboard';

function App() {
  const [activeRole, setActiveRole] = useState('victim'); // 'victim', 'helper', 'admin'
  const [user, setUser] = useState(null);

  // Auto-login from local storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const id = localStorage.getItem('id');
    if (token && role) {
      setUser({ token, role, name, id });
      setActiveRole(role === 'Admin' ? 'admin' : 'helper');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('name', userData.name);
    localStorage.setItem('id', userData.id);
    setActiveRole(userData.role === 'Admin' ? 'admin' : 'helper');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    setUser(null);
    setActiveRole('victim');
  };

  return (
    <div className="equalguard-app">
      {/* Role Navigation Bar */}
      <nav className="role-nav">
        <div className="nav-container">
          <div className="logo">
            <Shield size={24} color="#ff4d4d" />
            <span>EqualGuard</span>
          </div>
          <div className="role-switcher">
            <button 
              className={activeRole === 'victim' ? 'active' : ''} 
              onClick={() => setActiveRole('victim')}
            >
              <Ghost size={16} /> Victim
            </button>
            <button 
              className={activeRole === 'helper' || activeRole === 'admin' ? 'active' : ''} 
              onClick={() => setActiveRole(user ? (user.role === 'Admin' ? 'admin' : 'helper') : 'helper')}
            >
              <ShieldCheck size={16} /> Responder
            </button>
          </div>
        </div>
      </nav>

      <main className="main-viewport">
        <AnimatePresence mode="wait">
          {activeRole === 'victim' && (
            <motion.div 
              key="victim-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="view-container"
            >
              <SOSButton onSOSComplete={() => setActiveRole('helper')} />
            </motion.div>
          )}

          {activeRole === 'helper' && (
            <motion.div 
              key="helper-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="view-container"
            >
              {!user ? (
                <HelperRegister onLogin={handleLogin} />
              ) : (
                <HelperDashboard user={user} onLogout={handleLogout} />
              )}
            </motion.div>
          )}

          {activeRole === 'admin' && (
            <motion.div 
              key="admin-view"
              className="view-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
                <div className="status-badge" style={{marginBottom: '0', background: 'rgba(77, 136, 255, 0.1)', color: '#4d88ff'}}>
                    CENTRAL COMMAND ACCESS
                </div>
                <AuthorityDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        :root {
          --primary: #ff4d4d;
          --bg: #0a0a0f;
          --card-bg: rgba(255, 255, 255, 0.03);
          --nav-bg: rgba(10, 10, 15, 0.8);
        }
        .equalguard-app {
          min-height: 100vh;
          background: var(--bg);
          color: white;
          font-family: 'Outfit', sans-serif;
        }
        .role-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--nav-bg);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 16px 24px;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
        .role-switcher {
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
          display: flex;
          gap: 4px;
        }
        .role-switcher button {
          background: transparent;
          border: none;
          color: #8c8c9e;
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .role-switcher button.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
        }
        .main-viewport {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .view-container { width: 100%; }
        .map-demo-btn { background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; margin-top: 24px; cursor: pointer; }
        
        /* Global SOS Button Style */
        .status-badge { 
          display: inline-flex; align-items: center; padding: 6px 12px; background: rgba(255, 77, 77, 0.1); border-radius: 20px; color: #ff4d4d; font-size: 11px; font-weight: 800; letter-spacing: 1px; margin-bottom: 16px;
        }
        .description { color: #8c8c9e; font-size: 15px; margin-bottom: 30px; }
        .controls { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 30px; padding: 30px; text-align: center; max-width: 500px; margin: 0 auto; position: relative; }
        .location-info { display: flex; align-items: center; justify-content: center; gap: 8px; color: #8c8c9e; font-size: 13px; margin-bottom: 20px; }
        
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}

export default App;
