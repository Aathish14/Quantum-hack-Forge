import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api/auth';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/login' : '/register';
            const res = await axios.post(`${API_URL}${endpoint}`, formData);
            localStorage.setItem('token', res.data.token);
            onLogin(res.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card"
            >
                <div className="login-header">
                    <div className="logo-icon">
                        <Shield size={32} color="#ff4d4d" />
                    </div>
                    <h1>{isLogin ? 'Welcome Back' : 'Join EqualGuard'}</h1>
                    <p>{isLogin ? 'Secure your evidence with the vault' : 'Start protection with real-time monitoring'}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <User size={18} />
                            <input 
                                type="text" 
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <Mail size={18} />
                        <input 
                            type="email" 
                            placeholder="Email Address"
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

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                {isLogin ? 'Login to Vault' : 'Create Account'}
                                <ArrowRight size={18} style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <span onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? ' Sign Up' : ' Login'}
                        </span>
                    </p>
                </div>
            </motion.div>

            <style>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                }
                .login-card {
                    background: rgba(15, 15, 25, 0.8);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo-icon {
                    width: 60px;
                    height: 60px;
                    background: rgba(255, 77, 77, 0.1);
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto 15px;
                }
                .login-header h1 {
                    font-size: 24px;
                    color: white;
                    margin-bottom: 8px;
                }
                .login-header p {
                    color: #8c8c9e;
                    font-size: 14px;
                }
                .input-group {
                    position: relative;
                    margin-bottom: 16px;
                }
                .input-group svg {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #5d5d6d;
                }
                .input-group input {
                    width: 100%;
                    padding: 12px 12px 12px 40px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    color: white;
                    font-size: 14px;
                    transition: all 0.3s;
                }
                .input-group input:focus {
                    outline: none;
                    border-color: #ff4d4d;
                    background: rgba(255,255,255,0.08);
                }
                button {
                    width: 100%;
                    padding: 12px;
                    background: #ff4d4d;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: transform 0.2s, background 0.2s;
                    margin-top: 10px;
                }
                button:hover {
                    background: #ff3333;
                    transform: translateY(-2px);
                }
                button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .login-footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 14px;
                    color: #8c8c9e;
                }
                .login-footer span {
                    color: #ff4d4d;
                    cursor: pointer;
                    font-weight: 600;
                }
                .error-msg {
                    background: rgba(255, 77, 77, 0.1);
                    border: 1px solid rgba(255, 77, 77, 0.2);
                    color: #ff4d4d;
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 13px;
                    margin-bottom: 15px;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default Login;
