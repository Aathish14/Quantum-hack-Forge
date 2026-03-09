import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const HelperDashboard = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
         const user = JSON.parse(localStorage.getItem('user'));
         if (!user || (user.role !== 'verifiedHelper' && user.role !== 'admin')) {
             navigate('/login');
             return;
         }

        const fetchEmergencies = async () => {
<<<<<<< Updated upstream
            try {
                // In a real app, you would pass the helper's current location here
                const response = await API.get('/helper/nearby');
                setEmergencies(response.data.emergencies);
            } catch (error) {
                console.error("Failed to fetch emergencies", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmergencies();
        // Option to add setInterval to poll for new emergencies
=======
            if (!navigator.geolocation) {
                console.error("Geolocation is not supported by this browser.");
                setLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const response = await API.get(`/helper/nearby?lat=${latitude}&lng=${longitude}`);
                        setEmergencies(response.data.emergencies);
                    } catch (error) {
                        console.error("Failed to fetch emergencies", error);
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    alert("Please allow location access to see nearby emergencies.");
                    setLoading(false);
                }
            );
        };

        fetchEmergencies();
>>>>>>> Stashed changes
        const interval = setInterval(fetchEmergencies, 10000);
        return () => clearInterval(interval);
    }, [navigate]);

<<<<<<< Updated upstream
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-red-700 shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Helper Dashboard</h1>
                    <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="text-white hover:text-gray-200">Logout</button>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
                <h2 className="text-xl font-semibold mb-6">Nearby Emergencies</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : emergencies.length === 0 ? (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                        <p>No active emergencies nearby. Stay vigilant.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {emergencies.map(inc => (
                            <div key={inc._id} className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-red-500">
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-red-600 mb-2">Emergency Details</h3>
                                    <p className="text-sm text-gray-600 mb-4">Time: {new Date(inc.createdAt).toLocaleTimeString()}</p>
                                    {/* Google Maps Embed could go here based on inc.location.lat, inc.location.lng */}
                                    <div className="aspect-w-16 aspect-h-9 mb-4">
                                        <iframe
                                            title="Map location"
                                            width="100%"
                                            height="200"
                                            frameBorder="0"
                                            style={{ border: 0, borderRadius: '8px' }}
                                            src={`https://maps.google.com/maps?q=${inc.location?.lat},${inc.location?.lng}&z=15&output=embed`}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    
                                    {inc.evidence && inc.evidence.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Live Evidence:</h4>
                                            {inc.evidence.map(ev => (
                                                <div key={ev._id} className="mb-2">
                                                    {ev.mediaType === 'video' ? (
                                                        <video controls className="w-full rounded-md shadow" src={ev.url} preload="none">
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : (
                                                        <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View Evidence</a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${inc.location?.lat},${inc.location?.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                                    >
                                        Navigate to Victim
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
=======
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-brand-blue shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg bg-opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Verified Helper Network</h1>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} 
            className="text-white hover:bg-blue-800 bg-blue-700 bg-opacity-50 px-5 py-2 rounded-lg font-medium transition-colors border border-blue-500"
          >
            Go Offline
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Nearby Emergencies</h2>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm font-semibold text-slate-600">{loading ? 'Scanning...' : 'System Active'}</span>
          </div>
        </div>

        {emergencies.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Network is Secure</h3>
            <p className="text-slate-500 max-w-md">There are no active emergencies in your vicinity. Thank you for staying vigilant on standby.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
            {emergencies.map(inc => (
              <div key={inc._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col transform transition-transform hover:-translate-y-1">
                {/* Card Header */}
                <div className="bg-brand-red px-5 py-3 flex justify-between items-center">
                   <div className="flex items-center space-x-2 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-bold tracking-wider uppercase text-sm">SOS Alert</span>
                   </div>
                   <span className="text-red-100 text-xs font-medium">{new Date(inc.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="p-5 flex-grow flex flex-col relative">
                  {/* Embedded Map Container */}
                  <div className="rounded-xl overflow-hidden bg-slate-100 mb-4 h-48 relative border border-slate-200">
                    <iframe
                        title="Map location"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?q=${inc.location?.lat},${inc.location?.lng}&z=15&output=embed`}
                        allowFullScreen
                    ></iframe>
                  </div>

                  {/* Evidence Section */}
                  {inc.evidence && inc.evidence.length > 0 && (
                      <div className="mb-4 space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attached Evidence</h4>
                          {inc.evidence.map(ev => (
                              <div key={ev._id} className="rounded-lg overflow-hidden bg-black aspect-video relative group">
                                  {ev.mediaType === 'video' ? (
                                      <video controls className="w-full h-full object-cover" src={ev.url} preload="none">
                                          Your browser does not support the video tag.
                                      </video>
                                  ) : (
                                      <a href={ev.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white font-medium hover:bg-slate-700 transition">
                                          View File
                                      </a>
                                  )}
                              </div>
                          ))}
                      </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${inc.location?.lat},${inc.location?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex justify-center items-center space-x-2 bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Navigate to Victim</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
>>>>>>> Stashed changes
};

export default HelperDashboard;