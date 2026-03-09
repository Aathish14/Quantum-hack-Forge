import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import HelperDashboard from './pages/HelperDashboard';
import AdminPanel from './pages/AdminPanel';
<<<<<<< Updated upstream
=======
import TrustedContactDashboard from './pages/TrustedContactDashboard';
import AISimulation from './pages/AISimulation';
>>>>>>> Stashed changes
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App font-sans min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/helper" element={<HelperDashboard />} />
<<<<<<< Updated upstream
          <Route path="/admin" element={<AdminPanel />} />
=======
          <Route path="/trusted-contact" element={<TrustedContactDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/simulation" element={<AISimulation />} />
>>>>>>> Stashed changes
        </Routes>
      </div>
    </Router>
  );
}

export default App;