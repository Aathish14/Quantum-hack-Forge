import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminPanel = () => {
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('incidents');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
          navigate('/login');
          return;
        }

        const [incidentsRes, usersRes] = await Promise.all([
          API.get('/admin/incidents'),
          API.get('/admin/users')
        ]);
        
        setIncidents(incidentsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError('Failed to fetch admin data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleVerifyHelper = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/verify`);
      setUsers(users.map(u => u._id === userId ? { ...u, role: 'verifiedHelper' } : u));
    } catch (err) {
      console.error("Verification failed", err);
      alert("Failed to verify user");
    }
  };

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen bg-gray-100 flex flex-col">
       <header className="bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Central Command (Admin)
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gray-700 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-600 transition-colors"
          >
            Logout
=======
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-300">
      {/* Central Command Header */}
      <header className="bg-black border-b border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle grid background for tech feel */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Central Command
            </h1>
            <span className="hidden sm:inline-block px-3 py-1 bg-slate-800 rounded text-xs font-mono text-slate-400 border border-slate-700">ADMINISTRATOR</span>
          </div>
          <button
            onClick={handleLogout}
            className="group flex items-center space-x-2 bg-slate-800 hover:bg-red-900 border border-slate-700 hover:border-red-700 text-slate-300 hover:text-white px-5 py-2 rounded-lg font-bold transition-all duration-300"
          >
            <span>Terminate Session</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
>>>>>>> Stashed changes
          </button>
        </div>
      </header>
      
<<<<<<< Updated upstream
      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setActiveTab('incidents')}
            className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'incidents' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 shadow hover:bg-gray-50'}`}
          >
            Live Incidents
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 shadow hover:bg-gray-50'}`}
          >
            User Management
=======
      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full animate-fade-in">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-black bg-opacity-40 p-1.5 rounded-xl border border-slate-800 w-max shadow-inner">
          <button 
            onClick={() => setActiveTab('incidents')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-300 ${activeTab === 'incidents' ? 'bg-slate-800 text-white shadow-md border border-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 hover:bg-opacity-50'}`}
          >
            Live Global Incidents
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-300 ${activeTab === 'users' ? 'bg-slate-800 text-white shadow-md border border-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 hover:bg-opacity-50'}`}
          >
            Network Roster
>>>>>>> Stashed changes
          </button>
        </div>
        
        {loading ? (
<<<<<<< Updated upstream
          <p className="text-gray-500">Loading system data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            {activeTab === 'incidents' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {incidents.map((incident) => (
                  <div key={incident._id} className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${incident.status === 'ACTIVE' ? 'border-red-500' : 'border-gray-300'}`}>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Incident #{incident._id.slice(-6)}</h3>
                          <p className="text-sm text-gray-500">Victim: {incident.userId?.name || 'Unknown'} ({incident.userId?.email})</p>
                          <p className="text-sm text-gray-500">Time: {new Date(incident.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${incident.status === 'ACTIVE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {incident.status}
                        </span>
                      </div>
                      
                      {/* Map Embed */}
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <iframe
                          title="Map location"
                          width="100%"
                          height="200"
                          frameBorder="0"
                          style={{ border: 0, borderRadius: '8px' }}
                          src={`https://maps.google.com/maps?q=${incident.location?.lat},${incident.location?.lng}&z=15&output=embed`}
=======
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
             <p className="font-mono text-sm tracking-widest uppercase text-slate-500">Decrypting network data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-20 border border-red-900 border-opacity-50 p-6 rounded-xl text-center">
             <p className="text-red-500 font-mono tracking-widest uppercase">{error}</p>
          </div>
        ) : (
          <div className="animate-slide-up">
            {activeTab === 'incidents' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {incidents.map((incident) => (
                  <div key={incident._id} className={`bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border ${incident.status === 'ACTIVE' ? 'border-red-600 shadow-red-900/20' : 'border-slate-800'}`}>
                    
                    {/* Incident Header */}
                    <div className={`p-4 border-b flex justify-between items-center ${incident.status === 'ACTIVE' ? 'bg-red-900 bg-opacity-20 border-red-900 border-opacity-30' : 'bg-black bg-opacity-40 border-slate-800'}`}>
                       <div className="flex items-center space-x-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${incident.status === 'ACTIVE' ? 'text-brand-red animate-pulse' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <h3 className="text-lg font-mono font-bold text-white tracking-widest">INCIDENT_{incident._id.slice(-6).toUpperCase()}</h3>
                       </div>
                       <span className={`px-3 py-1 rounded-sm text-xs font-black tracking-widest uppercase border ${incident.status === 'ACTIVE' ? 'bg-brand-red text-white border-red-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                          {incident.status}
                       </span>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-sm">
                         <div className="bg-black bg-opacity-30 p-3 rounded border border-slate-800">
                            <p className="text-slate-500 mb-1 tracking-wider">VICTIM IDENTITY</p>
                            <p className="text-slate-200 font-bold">{incident.userId?.name || 'UNKNOWN_ENTITY'}</p>
                            <p className="text-slate-400 text-xs mt-1 truncate">{incident.userId?.email || 'N/A'}</p>
                         </div>
                         <div className="bg-black bg-opacity-30 p-3 rounded border border-slate-800">
                            <p className="text-slate-500 mb-1 tracking-wider">TIMESTAMP LOG</p>
                            <p className="text-slate-200">{new Date(incident.createdAt).toLocaleDateString()}</p>
                            <p className="text-slate-400 font-bold mt-1">{new Date(incident.createdAt).toLocaleTimeString()}</p>
                         </div>
                      </div>
                      
                      {/* Map Embed */}
                      <div className="mb-6 border border-slate-700 rounded-xl p-1 bg-black shadow-inner relative group">
                        <div className="absolute top-3 right-3 bg-black bg-opacity-70 px-2 py-1 rounded text-xs font-mono text-brand-blue border border-blue-900 border-opacity-50 z-10 pointer-events-none tracking-widest">Sat_Link: ONLINE</div>
                        <iframe
                          title="Map location"
                          width="100%"
                          height="250"
                          frameBorder="0"
                          style={{ border: 0, borderRadius: '8px', filter: 'contrast(1.2) sepia(0.2) hue-rotate(180deg) invert(0.9) brightness(0.9)' }} // Tech dark map filter hack
                          src={`https://maps.google.com/maps?q=${incident.location?.lat},${incident.location?.lng}&z=16&output=embed`}
>>>>>>> Stashed changes
                          allowFullScreen
                        ></iframe>
                      </div>

<<<<<<< Updated upstream
                      {/* Evidence Viewer */}
                      {incident.evidence && incident.evidence.length > 0 && (
                        <div className="mb-4 bg-gray-50 p-3 rounded-lg border">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Cloudinary Evidence:</h4>
                          {incident.evidence.map(ev => (
                            <div key={ev._id} className="mb-2">
                              {ev.mediaType === 'video' ? (
                                <video controls className="w-full rounded bg-black" src={ev.url} preload="none">
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline">View File</a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {incidents.length === 0 && <p className="text-gray-500">No incidents in the system.</p>}
=======
                      {/* Evidence Viewer (Restricted for Admin) */}
                      <div className="bg-slate-900 bg-opacity-50 p-4 rounded-xl border border-slate-800 shadow-inner flex flex-col items-center justify-center text-center">
                         <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 border border-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                         </div>
                         <h4 className="text-sm font-black font-mono tracking-widest text-slate-400 mb-1">
                           EVIDENCE RESTRICTED
                         </h4>
                         <p className="text-slate-500 font-mono text-xs tracking-wide">
                           Live video feeds are strictly visible only to Trusted Contacts for privacy.
                         </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {incidents.length === 0 && (
                   <div className="col-span-full py-20 text-center border border-slate-800 rounded-2xl bg-black bg-opacity-20 border-dashed">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p className="font-mono text-lg text-slate-500 tracking-widest">NETWORK SECURE</p>
                      <p className="text-slate-600 text-sm mt-2">Zero critical incidents detected globally.</p>
                   </div>
                )}
>>>>>>> Stashed changes
              </div>
            )}

            {activeTab === 'users' && (
<<<<<<< Updated upstream
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                            u.role === 'verifiedHelper' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {u.role !== 'admin' && u.role !== 'verifiedHelper' && (
                            <button 
                              onClick={() => handleVerifyHelper(u._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Verify as Helper
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
=======
              <div className="bg-black bg-opacity-40 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-800 text-left font-sans">
                    <thead className="bg-slate-900 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest w-1/4">Identity</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest w-1/4">Comms Link</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest w-1/4">Clearance</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Directives</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-transparent">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-800 hover:bg-opacity-50 transition-colors duration-150">
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-200">
                             <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 text-slate-400 font-bold text-xs uppercase">
                                   {u.name.substring(0, 2)}
                                </div>
                                <span>{u.name}</span>
                             </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400 font-mono tracking-wider">{u.email}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-black uppercase tracking-widest rounded border ${
                              u.role === 'admin' ? 'bg-red-900 bg-opacity-30 text-brand-red border-red-800' : 
                              u.role === 'verifiedHelper' ? 'bg-blue-900 bg-opacity-30 text-brand-blue border-blue-800' : 
                              u.role === 'trustedContact' ? 'bg-purple-900 bg-opacity-30 text-brand-purple border-purple-800' :
                              'bg-slate-800 text-slate-300 border-slate-600'
                            }`}>
                              {u.role === 'main' ? 'CIVILIAN' : u.role.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                            {(u.role === 'main' || u.role === 'trustedContact') && (
                              <button 
                                onClick={() => handleVerifyHelper(u._id)}
                                className="group inline-flex items-center space-x-1 text-brand-blue hover:text-white border border-transparent hover:border-brand-blue bg-transparent hover:bg-brand-blue bg-opacity-20 hover:bg-opacity-100 px-3 py-1 rounded transition-all tracking-wider text-xs uppercase font-bold"
                              >
                                <span>Grant Helper Status</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
>>>>>>> Stashed changes
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
