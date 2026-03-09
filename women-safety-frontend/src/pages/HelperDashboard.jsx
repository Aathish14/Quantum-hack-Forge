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
        const interval = setInterval(fetchEmergencies, 10000);
        return () => clearInterval(interval);
    }, [navigate]);

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
};

export default HelperDashboard;