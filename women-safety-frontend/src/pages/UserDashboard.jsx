import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import EmergencyButton from '../components/EmergencyButton';
import CameraRecorder from '../components/CameraRecorder';

const UserDashboard = () => {
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [incident, setIncident] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEmergencyTriggered = (newIncident) => {
    setIncident(newIncident);
  };

  const handleEmergencyStopped = async () => {
    if (!incident) return;
    try {
      await API.post("/emergency/stop", { incidentId: incident._id });
      setIncident(null);
    } catch (error) {
      console.error("Failed to stop emergency:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-red-600 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Women Safety Shield
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
        {incident && incident.status === 'ACTIVE' ? (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse border-4 border-red-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-red-600 mb-2">EMERGENCY ACTIVE</h2>
              <p className="text-gray-600">Help is on the way. Contacts have been notified.</p>
              <button
                 onClick={handleEmergencyStopped}
                 className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700"
              >
                Cancel Emergency
              </button>
            </div>
            <CameraRecorder incidentId={incident._id} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Are you in danger?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Press the button below to instantly notify your trusted contacts and nearby verified helpers. Your location and camera will be securely shared.
              </p>
            </div>
            <EmergencyButton onTriggered={handleEmergencyTriggered} />
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
