import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const TrustedContactDashboard = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
         const user = JSON.parse(localStorage.getItem('user'));
         if (!user || (user.role !== 'trustedContact' && user.role !== 'admin')) {
             navigate('/login');
             return;
         }

        const fetchEmergencies = async () => {
            try {
                // Try to get current location for proximity filtering (5km)
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const { latitude, longitude } = position.coords;
                        const response = await API.get(`/helper/trusted?lat=${latitude}&lng=${longitude}`);
                        setEmergencies(response.data.emergencies);
                        setLoading(false);
                    }, async () => {
                        // Fallback without location (won't pass strict 5km filter if enforced, 
                        // but handles permission denied gracefully)
                        const response = await API.get('/helper/trusted');
                        setEmergencies(response.data.emergencies);
                        setLoading(false);
                    });
                } else {
                    const response = await API.get('/helper/trusted');
                    setEmergencies(response.data.emergencies);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch emergencies", error);
                setLoading(false);
            }
        };

        fetchEmergencies();
        const interval = setInterval(fetchEmergencies, 5000); // Poll faster for trusted contacts
        return () => clearInterval(interval);
    }, [navigate]);

    const handleCancelEmergency = async (incidentId) => {
        if (!window.confirm("Are you sure you want to cancel this emergency on behalf of the victim?")) return;
        try {
            await API.post("/emergency/stop", { incidentId });
            setEmergencies(prev => prev.filter(inc => inc._id !== incidentId));
        } catch (error) {
            console.error("Failed to cancel emergency", error);
            alert("Failed to cancel the emergency. Please try again.");
        }
    };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-brand-purple shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="bg-white p-2 rounded-lg bg-opacity-20 backdrop-blur-sm shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
             </div>
             <h1 className="text-2xl font-extrabold text-white tracking-tight">Trusted Contact Network</h1>
          </div>
          <button 
             onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} 
             className="text-white hover:bg-purple-800 bg-purple-700 bg-opacity-50 px-5 py-2 rounded-lg font-medium transition-colors border border-purple-500"
          >
             Go Offline
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full animate-fade-in">
        
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-50 border border-purple-200 rounded-2xl p-6 mb-8 flex items-start space-x-4 shadow-sm">
           <div className="bg-purple-200 p-3 rounded-full flex-shrink-0 mt-1">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
           </div>
           <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Priority Alert Channel</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                As a designated <span className="font-semibold text-brand-purple">Trusted Contact</span>, you bypass the standard 3-minute delay. If a loved one triggers an SOS, you will receive their live video feed and exact GPS coordinates instantaneously.
              </p>
           </div>
        </div>

        <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active SOS Network</h2>
           {loading && <span className="text-sm font-semibold text-slate-500 animate-pulse">Syncing...</span>}
        </div>

        {emergencies.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">All Clear</h3>
            <p className="text-slate-500 max-w-lg text-lg">No active emergencies in your trusted network right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-slide-up">
            {emergencies.map(inc => (
              <div key={inc._id} className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-200 flex flex-col transform transition-all hover:shadow-red-500/20">
                {/* Urgent Header */}
                <div className="bg-gradient-to-r from-red-600 to-brand-red px-6 py-4 flex justify-between items-center shadow-inner">
                   <div className="flex items-center space-x-3 text-white">
                      <div className="w-3 h-3 bg-red-300 rounded-full animate-ping"></div>
                      <span className="font-black tracking-widest uppercase text-base drop-shadow-md">URGENT SOS</span>
                   </div>
                   <span className="bg-red-900 bg-opacity-40 text-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-400">
                     {new Date(inc.createdAt).toLocaleTimeString()}
                   </span>
                </div>

                <div className="p-6 flex-grow flex flex-col relative bg-red-50">
                  {/* Map */}
                  <div className="rounded-xl overflow-hidden bg-slate-200 mb-5 relative border-2 border-white shadow-md aspect-video">
                    <iframe
                        title="Map location"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?q=${inc.location?.lat},${inc.location?.lng}&z=16&output=embed`}
                        allowFullScreen
                    ></iframe>
                  </div>

                  {/* Evidence Section */}
                  {inc.evidence && inc.evidence.length > 0 && (
                      <div className="mb-6 space-y-3">
                          <h4 className="text-xs font-black text-red-800 uppercase tracking-widest flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-600 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Live Streaming Evidence
                          </h4>
                          {inc.evidence.map(ev => (
                              <div key={ev._id} className="rounded-xl overflow-hidden bg-black aspect-video relative shadow-lg border-2 border-slate-800">
                                  {ev.mediaType === 'video' ? (
                                      <video controls autoPlay muted className="w-full h-full object-cover" src={ev.url} preload="none"></video>
                                  ) : (
                                      <a href={ev.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white font-bold hover:bg-slate-800 transition">
                                          View Full File
                                      </a>
                                  )}
                              </div>
                          ))}
                      </div>
                  )}

                  <div className="mt-auto pt-2 flex flex-col space-y-3">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${inc.location?.lat},${inc.location?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex justify-center items-center space-x-2 bg-brand-red text-white py-4 rounded-xl font-black text-lg hover:bg-red-700 transition-colors shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] uppercase tracking-wider hover:scale-[1.02] transform"
                    >
                        <span>Rush TO Location</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                    <button
                        onClick={() => handleCancelEmergency(inc._id)}
                        className="w-full flex justify-center items-center space-x-2 bg-transparent text-slate-500 py-3 rounded-xl font-bold hover:bg-slate-200 hover:text-slate-800 transition-colors uppercase tracking-wider text-sm border-2 border-slate-300"
                    >
                        <span>Cancel Emergency Signal</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TrustedContactDashboard;
