import { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { useNavigate } from 'react-router-dom';
=======
import { useNavigate, useLocation } from 'react-router-dom';
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    }
  }, [user, navigate]);

=======
    } else {
      fetchContacts();
    }
  }, [user, navigate]);

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.incomingIncident) {
      setIncident(location.state.incomingIncident);
      // Clear state so reload doesn't keep triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [contacts, setContacts] = useState([]);
  const [newContactEmail, setNewContactEmail] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  const fetchContacts = async () => {
    try {
      const res = await API.get('/auth/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess('');
    try {
      await API.post('/auth/contacts', { email: newContactEmail });
      setContactSuccess('Contact added!');
      setNewContactEmail('');
      fetchContacts();
      setTimeout(() => setContactSuccess(''), 3000);
    } catch (err) {
      setContactError(err.response?.data?.message || 'Failed to add contact');
    } finally {
      setContactLoading(false);
    }
  };

  const handleRemoveContact = async (id) => {
    if(!window.confirm("Are you sure you want to remove this trusted contact?")) return;
    try {
      await API.delete(`/auth/contacts/${id}`);
      fetchContacts();
    } catch (err) {
       console.error(err);
    }
  };

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
    <div className={`min-h-screen flex flex-col transition-colors duration-700 ${incident && incident.status === 'ACTIVE' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Dynamic Header */}
      <header className={`shadow-md transition-colors duration-700 ${incident && incident.status === 'ACTIVE' ? 'bg-red-900 border-b border-red-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${incident && incident.status === 'ACTIVE' ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${incident && incident.status === 'ACTIVE' ? 'text-white' : 'text-gray-900'}`}>
              Safety Shield
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className={`font-medium ${incident && incident.status === 'ACTIVE' ? 'text-red-200' : 'text-gray-600'}`}>
              {user.name}
            </span>
            <button
              onClick={() => navigate('/simulation')}
              className={`px-4 py-2 rounded-lg font-bold transition-all bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200 shadow-sm`}
            >
              AI Tracker
            </button>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                incident && incident.status === 'ACTIVE' 
                  ? 'bg-red-800 text-white hover:bg-red-700 border border-red-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
>>>>>>> Stashed changes
            >
              Logout
            </button>
          </div>
        </div>
      </header>

<<<<<<< Updated upstream
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
=======
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-7xl mx-auto animate-fade-in">
        {incident && incident.status === 'ACTIVE' ? (
          <div className="w-full flex flex-col items-center space-y-8">
             <div className="text-center space-y-2 animate-slide-up">
              <h2 className="text-4xl md:text-6xl font-black text-brand-red tracking-widest uppercase animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
                EMERGENCY ACTIVE
              </h2>
              <p className="text-xl text-red-200 font-medium">
                Live location and A/V evidence is transmitting to your network.
              </p>
            </div>

            <div className="w-full max-w-4xl">
              <CameraRecorder incidentId={incident._id} />
            </div>

            <button
               onClick={handleEmergencyStopped}
               className="mt-8 bg-transparent text-gray-400 border border-gray-600 px-8 py-3 rounded-full font-bold hover:text-white hover:border-gray-400 hover:bg-gray-800 transition-all uppercase tracking-wider text-sm"
            >
              Cancel Emergency
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-12">
            
            {/* Top section: The SOS Button */}
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
              <div className="text-center lg:text-left space-y-4 max-w-sm">
                <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold tracking-wide border border-green-200">
                  SYSTEM ONLINE & READY
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                  Are you in danger?
                </h2>
                <p className="text-lg text-gray-500 font-medium">
                  Press the SOS button. We will instantly broadcast your live location and video feed to your specific trusted contacts within a 5km radius.
                </p>
              </div>
              
              <div className="transform transition-all hover:scale-105">
                <EmergencyButton onTriggered={handleEmergencyTriggered} />
              </div>
            </div>

            {/* Bottom section: Trusted Contacts Manager */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mt-12 animate-slide-up">
              <div className="flex border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  My Trusted Contacts
                </h3>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Add new contact form */}
                <div className="w-full md:w-1/3 space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-700">Add a Contact</h4>
                  <p className="text-sm text-gray-500">Add someone by their registered email address. They will be notified if you trigger an SOS.</p>
                  
                  <form onSubmit={handleAddContact} className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Email address..." 
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={contactLoading}
                      className="w-full bg-brand-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
                    >
                      {contactLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Add to Network'
                      )}
                    </button>
                    {contactError && <p className="text-red-500 text-xs font-bold mt-2">{contactError}</p>}
                    {contactSuccess && <p className="text-green-600 text-xs font-bold mt-2">{contactSuccess}</p>}
                  </form>
                </div>

                {/* List of contacts */}
                <div className="w-full md:w-2/3">
                  {contacts.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-500 font-medium whitespace-pre-line">
                        You have no trusted contacts yet.{"\n"}Add someone to ensure your safety network is active.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {contacts.map(c => (
                        <li key={c._id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-brand-purple border border-purple-200 font-bold uppercase">
                              {c.name.substring(0,2)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{c.name}</p>
                              <p className="text-xs text-gray-500 font-mono">{c.email}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveContact(c._id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 p-2 rounded-lg font-bold text-sm transition-colors border border-red-100 flex items-center space-x-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
>>>>>>> Stashed changes
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
