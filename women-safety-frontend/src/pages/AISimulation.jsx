import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AISimulation = () => {
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  // HR features needed by the model
  const [hrData, setHrData] = useState({
    MEAN_RR: '', SDRR: '', RMSSD: '', MEDIAN_RR: '',
    SDRR_RMSSD: '', HR: '', KURT: '', SKEW: '', MEAN_REL_RR: ''
  });
  
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMSG, setErrorMSG] = useState('');

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setHrData({ ...hrData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const autofillHighRisk = () => {
    setHrData({
      MEAN_RR: '650', SDRR: '25', RMSSD: '15', MEDIAN_RR: '640',
      SDRR_RMSSD: '1.6', HR: '120', KURT: '2.5', SKEW: '0.8', MEAN_REL_RR: '0.04'
    });
  };

  const triggerSOS = async () => {
    try {
      if (!navigator.geolocation) {
        alert("Geolocation not supported by this browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await API.post("/emergency", {
          location: { lat: latitude, lng: longitude },
          deviceId: "AI_SIMULATOR_001"
        });
        alert("AI DETECTED ABUSE: Autonomous SOS Dispatched Successfully!");
        navigate('/dashboard', { state: { incomingIncident: { _id: res.data.incidentId, status: 'ACTIVE' } } });
      }, () => {
        // Fallback if location fails
        API.post("/emergency", {
          location: { lat: 0, lng: 0 },
          deviceId: "AI_SIMULATOR_001_NO_LOC"
        }).then((res) => {
           alert("AI DETECTED ABUSE: Autonomous SOS Dispatched (No Location).");
           navigate('/dashboard', { state: { incomingIncident: { _id: res.data.incidentId, status: 'ACTIVE' } } });
        });
      });
    } catch (err) {
      console.error("Auto SOS Failed", err);
      alert("Auto SOS Failed to dispatch to backend.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      setErrorMSG("Please select an audio file.");
      return;
    }

    setLoading(true);
    setErrorMSG('');
    setResult(null);

    const formData = new FormData();
    formData.append('audio', audioFile);
    Object.keys(hrData).forEach(key => {
      formData.append(key, hrData[key]);
    });

    try {
      // Send directly to the Python Flask ML Microservice
      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }

      setResult(data);

      if (data.trigger_sos) {
         await triggerSOS();
      }

    } catch (err) {
      setErrorMSG(err.message || "Failed to connect to ML Model on port 5001");
    } finally {
      setLoading(false);
    }
  };

  if(!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        <div className="text-center space-y-4 mb-10 w-full">
           <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-brand-red tracking-tight">
             AI Trigger Simulation
           </h1>
           <p className="text-gray-400 text-lg">
             Upload a 3-second audio snippet and input simulated heart rate data to test the autonomous TensorFlow emergency predictor.
           </p>
        </div>

        <div className="w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
           
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Simulation Parameters</h2>
              <button 
                onClick={autofillHighRisk}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold transition text-sm shadow-lg"
              >
                Autofill High-Risk Data
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Audio Upload */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">1. Audio Environment (WAV/MP3)</label>
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-bold
                    file:bg-brand-red file:text-white
                    hover:file:bg-red-600 file:cursor-pointer cursor-pointer"
                />
              </div>

              {/* Heart Rate Data */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                 <label className="block text-sm font-bold text-gray-300 mb-5 uppercase tracking-wider">2. Biometric Vitals (Smartwatch)</label>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.keys(hrData).map((key) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-400 mb-1">{key}</label>
                        <input
                          type="number"
                          step="any"
                          name={key}
                          value={hrData[key]}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                        />
                      </div>
                    ))}
                 </div>
              </div>

              {errorMSG && (
                <div className="bg-red-900 bg-opacity-50 text-red-200 p-4 rounded-xl border border-red-800">
                  <p className="font-bold">Error: {errorMSG}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-brand-red to-purple-600 hover:from-red-600 hover:to-purple-500 text-white rounded-xl font-black text-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform hover:scale-[1.01]"
              >
                {loading ? 'ANALYZING THREAT LEVEL...' : 'RUN AI PREDICTION CORE'}
              </button>

           </form>

        </div>

        {/* Results Box */}
        {result && (
          <div className="mt-8 w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl animate-slide-up text-center">
             <h3 className="text-xl font-bold text-gray-400 mb-4 tracking-widest uppercase">Analysis Result</h3>
             
             <div className="flex justify-center items-center space-x-6 mb-6">
               <div className="text-left">
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Threat Probability</p>
                  <p className={`text-4xl font-black ${result.risk_score > 0.85 ? 'text-brand-red' : 'text-green-500'}`}>
                    {(result.risk_score * 100).toFixed(2)}%
                  </p>
               </div>
               <div className="h-12 w-px bg-slate-600"></div>
               <div className="text-left">
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">System Action</p>
                  <p className={`text-2xl font-black ${result.trigger_sos ? 'text-brand-red animate-pulse' : 'text-slate-300'}`}>
                    {result.status}
                  </p>
               </div>
             </div>

             {result.trigger_sos && (
               <div className="bg-red-900/40 border border-red-500/50 p-4 rounded-xl text-red-200">
                 <p className="font-bold">⚠️ CRITICAL THREAT DETECTED</p>
                 <p className="text-sm mt-1">The system has autonomously dispatched an SOS to your Trusted Contacts along with your live coordinates.</p>
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AISimulation;
