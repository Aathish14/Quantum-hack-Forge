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
          </button>
        </div>
      </header>
      
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
          </button>
        </div>
        
        {loading ? (
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
                          allowFullScreen
                        ></iframe>
                      </div>

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
              </div>
            )}

            {activeTab === 'users' && (
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
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
