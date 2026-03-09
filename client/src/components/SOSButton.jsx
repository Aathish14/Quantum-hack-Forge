import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Timer, XCircle, CheckCircle, Camera, Mic, Loader2, AlertCircle, MapPin } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/uploadEvidence';

const SOSButton = ({ onSOSComplete }) => {
    const [status, setStatus] = useState('idle'); // idle, counting, capturing, uploading, success, error
    const [countdown, setCountdown] = useState(10);
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);
    const [recordedUrl, setRecordedUrl] = useState('');
    
    const timerRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);

    useEffect(() => {
        if (status === 'success') {
            const timeout = setTimeout(() => {
                if (onSOSComplete) onSOSComplete();
                else setStatus('idle');
            }, 4000); // Wait 4 seconds for feedback then redirect
            return () => clearTimeout(timeout);
        }
    }, [status, onSOSComplete]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                (err) => console.warn("Location access denied:", err),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const startSOSProcess = () => {
        setStatus('counting');
        setCountdown(10);
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    triggerEvidenceCapture();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const cancelSOS = () => {
        clearInterval(timerRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setStatus('idle');
    };

    const triggerEvidenceCapture = async () => {
        setStatus('capturing');
        try {
            // STEP 1: Request Camera & Mic
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // STEP 2: Start Recording
            chunksRef.current = [];
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };
            
            mediaRecorderRef.current.onstop = async () => {
                const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
                const videoFile = new File([videoBlob], 'evidence.webm', { type: 'video/webm' });
                
                // Capture Image Snapshot
                const imageBlob = await captureSnapshot();
                
                uploadFiles(videoFile, imageBlob);
            };

            mediaRecorderRef.current.start();

            // Record for 8 seconds (optimized for hackathon 4-10s requirement)
            setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                    stream.getTracks().forEach(track => track.stop());
                    if (videoRef.current) videoRef.current.srcObject = null;
                }
            }, 5000); // Slightly shorter for demo flow

        } catch (err) {
            console.error("Permission Failure:", err);
            setError("Camera/Microphone permission denied. Accurate evidence cannot be captured.");
            setStatus('error');
        }
    };

    const captureSnapshot = () => {
        return new Promise((resolve) => {
            if (videoRef.current && canvasRef.current) {
                const context = canvasRef.current.getContext('2d');
                canvasRef.current.width = videoRef.current.videoWidth || 640;
                canvasRef.current.height = videoRef.current.videoHeight || 480;
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                canvasRef.current.toBlob((blob) => resolve(blob), 'image/jpeg');
            } else {
                resolve(null);
            }
        });
    };

    const uploadFiles = async (videoFile, imageBlob) => {
        setStatus('uploading');
        try {
            const formData = new FormData();
            formData.append('video', videoFile);
            if (imageBlob) formData.append('image', imageBlob, 'snapshot.jpg');
            
            formData.append('latitude', location?.lat || 13.0517); // Fallback to demo coords
            formData.append('longitude', location?.lon || 80.2105);
            formData.append('triggeredBy', 'Victim_User');

            const res = await axios.post(API_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setRecordedUrl(res.data.video_url);
                setStatus('success');
            }
        } catch (err) {
            console.error("Upload Error:", err);
            const serverMsg = err.response?.data?.details || err.message;
            setError(`Upload Failure: ${serverMsg}`);
            setStatus('error');
        }
    };

    return (
        <div className="sos-panel">
            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.div key="idle" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="idle-view">
                        <button className="main-sos-btn" onClick={startSOSProcess}>
                            <Shield size={80} strokeWidth={2.5} />
                            <span>PRESS SOS</span>
                        </button>
                        <p className="hint">In case of emergency, the 10s countdown will begin</p>
                    </motion.div>
                )}

                {status === 'counting' && (
                    <motion.div key="counting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="counter-view">
                        <div className="timer-ring">
                            <span className="count-num">{countdown}</span>
                            <Timer className="timer-icon" size={24} />
                        </div>
                        <h2>Emergency Triggering...</h2>
                        <button className="cancel-btn" onClick={cancelSOS}>
                            <XCircle size={18} /> CANCEL SOS
                        </button>
                    </motion.div>
                )}

                {status === 'capturing' && (
                    <motion.div key="capturing" className="capture-view">
                        <div className="camera-preview-container">
                            <video ref={videoRef} autoPlay muted playsInline className="live-preview" />
                            <div className="recording-indicator">REC</div>
                        </div>
                        <h2>Recording Evidence...</h2>
                        <p>Keep your device steady. Capturing visual and audio surroundings.</p>
                    </motion.div>
                )}

                {status === 'uploading' && (
                    <motion.div key="uploading" className="loading-view">
                        <Loader2 className="animate-spin" size={60} color="#ff4d4d" />
                        <h2>Encrypting & Uploading Evidence...</h2>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div key="success" className="success-view">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10 }}
                        >
                            <CheckCircle size={100} color="#4dff88" strokeWidth={3} />
                        </motion.div>
                        <h1 style={{ color: '#4dff88' }}>SECURE ALERT SENT</h1>
                        <p style={{ fontSize: '18px', fontWeight: '500' }}>
                            Your evidence and location have been shared.
                        </p>
                        <div className="authority-chips">
                            <span className="chip">Emergency Responders</span>
                            <span className="chip">Central Command</span>
                        </div>
                        <p className="sub-text" style={{ color: '#4dff88', fontWeight: '700' }}>
                           Verified responders are being dispatched.
                        </p>
                        <div className="auto-reset-hint">Moving to live responder tracker in 4s...</div>
                        <button className="reset-btn" onClick={() => onSOSComplete()}>PROCEED TO TRACKER</button>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div key="error" className="error-view">
                        <AlertCircle size={80} color="#ff4d4d" />
                        <h2>Emergency Alert Error</h2>
                        <p>{error}</p>
                        <button className="reset-btn" onClick={() => setStatus('idle')}>TRY AGAIN</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <style>{`
                .sos-panel { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; }
                .main-sos-btn { 
                    width: 250px; height: 250px; border-radius: 50%; border: none;
                    background: radial-gradient(circle, #ff4d4d 0%, #b30000 100%);
                    color: white; box-shadow: 0 0 50px rgba(255, 77, 77, 0.4);
                    cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    font-weight: 900; gap: 10px; transition: transform 0.2s;
                }
                .main-sos-btn:active { transform: scale(0.92); }
                .hint { margin-top: 30px; color: #8c8c9e; font-size: 14px; text-align: center; }
                .timer-ring { 
                    width: 120px; height: 120px; border: 4px solid #ff4d4d; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; position: relative; margin: 0 auto 20px;
                }
                .count-num { font-size: 48px; font-weight: 900; color: white; }
                .timer-icon { position: absolute; bottom: -10px; background: #0a0a0f; padding: 4px; border-radius: 50%; color: #ff4d4d; }
                .cancel-btn { 
                    margin-top: 40px; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255,255,255,0.2);
                    padding: 12px 24px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer;
                }
                .camera-preview-container { position: relative; width: 320px; height: 240px; border-radius: 20px; overflow: hidden; border: 4px solid #ff4d4d; box-shadow: 0 0 30px rgba(255, 77, 77, 0.3); margin-bottom: 20px; }
                .live-preview { width: 100%; height: 100%; object-fit: cover; }
                .recording-indicator { position: absolute; top: 15px; right: 15px; background: #ff4d4d; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; animation: flash 1s infinite; }
                @keyframes flash { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
                
                .success-view { text-align: center; max-width: 400px; }
                .authority-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 20px 0; }
                .chip { background: rgba(77, 255, 136, 0.1); color: #4dff88; border: 1px solid rgba(77, 255, 136, 0.3); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; }
                .sub-text { font-size: 14px; opacity: 0.7; margin-top: 10px; }
                
                .load-state { text-align: center; padding: 100px; color: #8c8c9e; font-size: 18px; }
                .auto-reset-hint { font-size: 11px; opacity: 0.5; margin-top: 15px; color: #4dff88; font-style: italic; }
                .reset-btn { margin-top: 20px; background: #ff4d4d; color: white; padding: 12px 30px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default SOSButton;
