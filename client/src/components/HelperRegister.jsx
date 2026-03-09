import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Mail, Lock, User, Briefcase, MapPin, Loader2, ArrowRight, Phone, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api/auth';

const HelperRegister = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Volunteer',
    latitude: 0,
    longitude: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setFormData(prev => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
        (err) => console.error(err)
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationPending(false);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const res = await axios.post(`${API_URL}${endpoint}`, formData);
      
      if (isLogin) {
        // Successful login
        localStorage.setItem('token', res.data.token);
        onLogin(res.data.user);
      } else {
        // Successful registration, now waiting for verification
        setVerificationPending(true);
        setIsLogin(true); // Switch to login view for when they get verified
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Authentication failed. Please check details.';
      setError(errorMessage);
      
      // If the error indicates not verified, show a clear message
      if (err.response?.status === 403) {
        setError("Account not verified. Your helper account is waiting for admin verification.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        <div className="auth-header">
          <Shield size={40} color="#ff4d4d" style={{ marginBottom: 16 }} />
          <h1>{isLogin ? 'Helper Login' : 'Register as Helper'}</h1>
          <p>{isLogin ? 'Access your community safety dashboard' : 'Join the network of verified responders'}</p>
        </div>

        {verificationPending && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-box"
            >
                Registration successful! Your account is waiting for admin verification. You can login once approved.
            </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <User size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
              <div className="input-group">
                <Phone size={18} />
                <input 
                  type="tel" 
                  placeholder="Phone Number (e.g. 9876543210)" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required={!isLogin}
                />
              </div>
              <div className="input-group">
                <Briefcase size={18} />
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required={!isLogin}
                >
                  <option value="Volunteer">Volunteer</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Ex-Military">Ex-Military</option>
                  <option value="Social Worker">Social Worker</option>
                  <option value="Police">Night-duty Traffic Police</option>
                </select>
              </div>
            </>
          )}

          <div className="input-group">
            <Mail size={18} />
            <input 
              type="email" 
              placeholder="Email (Gmail preferred)" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {!isLogin && (
            <div className="location-box">
              <MapPin size={16} color="#ff4d4d" />
              <span>Base: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
            </div>
          )}

          {error && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`error-box ${error.includes('verified') ? 'warning' : ''}`}
            >
                {error.includes('verified') && <AlertTriangle size={14} style={{ marginRight: 8 }} />}
                {error}
            </motion.div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isLogin ? 'Login to Dashboard' : 'Complete Registration'}
                <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Want to join our network?" : "Already a verified helper?"}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); setVerificationPending(false); }}>{isLogin ? ' Join Now' : ' Login here'}</span>
        </p>
      </motion.div>

      <style>{`
        .auth-container { display: flex; justify-content: center; padding: 40px 20px; }
        .auth-card { background: rgba(20, 20, 35, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 28px; padding: 40px; width: 100%; max-width: 450px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .auth-header { text-align: center; margin-bottom: 30px; }
        .auth-header h1 { font-size: 26px; color: white; margin-bottom: 8px; font-weight: 800; }
        .auth-header p { color: #8c8c9e; font-size: 14px; }
        .input-group { position: relative; margin-bottom: 16px; }
        .input-group svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #5d5d6d; }
        .input-group input, .input-group select { width: 100%; padding: 14px 14px 14px 44px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: white; font-size: 15px; outline: none; transition: all 0.2s; appearance: none; }
        .input-group input:focus, .input-group select:focus { border-color: #ff4d4d; background: rgba(255,255,255,0.08); box-shadow: 0 0 0 4px rgba(255, 77, 77, 0.1); }
        .input-group select { 
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238c8c9e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 18px;
          cursor: pointer;
        }
        .input-group select option {
          background-color: #161625;
          color: white;
        }
        /* Style for selected and hovered options for browsers that support it */
        .input-group select:focus option:checked {
          background-color: #ff4d4d;
          color: white;
        }
        .location-box { background: rgba(255, 77, 77, 0.05); padding: 10px; border-radius: 10px; font-size: 12px; color: #8c8c9e; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .submit-btn { width: 100%; background: #ff4d4d; color: white; border: none; padding: 14px; border-radius: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s, transform 0.2s; display: flex; justify-content: center; align-items: center; }
        .submit-btn:hover { background: #ff3333; transform: translateY(-2px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-switch { text-align: center; margin-top: 24px; font-size: 14px; color: #8c8c9e; }
        .auth-switch span { color: #ff4d4d; font-weight: 700; cursor: pointer; }
        .error-box { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; padding: 12px; border-radius: 10px; margin-bottom: 16px; font-size: 13px; text-align: center; border: 1px solid rgba(255, 77, 77, 0.2); line-height: 1.4; display: flex; align-items: center; justify-content: center; }
        .error-box.warning { background: rgba(255, 170, 0, 0.1); color: #ffaa00; border-color: rgba(255, 170, 0, 0.2); }
        .success-box { background: rgba(77, 255, 136, 0.1); color: #4dff88; border: 1px solid rgba(77, 255, 136, 0.2); padding: 12px; border-radius: 10px; margin-bottom: 20px; font-size: 13px; text-align: center; line-height: 1.4; }
      `}</style>
    </div>
  );
};

export default HelperRegister;
