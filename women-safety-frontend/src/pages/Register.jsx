import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/register', formData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.role === 'admin') navigate('/admin');
        else if (response.data.role === 'verifiedHelper') navigate('/helper');
<<<<<<< Updated upstream
=======
        else if (response.data.role === 'trustedContact') navigate('/trusted-contact');
>>>>>>> Stashed changes
        else navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create fresh account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
=======
    <div className="min-h-screen flex bg-white animate-fade-in">
      {/* Left Pane - Brand/Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-brand-dark to-gray-800 text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-brand-red">Safety Shield</h1>
          <p className="text-lg text-gray-300 max-w-md">
            Join the network. Whether you are looking for protection, or stepping up to help others, your presence makes a difference.
          </p>
        </div>
        <div className="space-y-6">
          <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-md border border-white border-opacity-5">
            <h3 className="font-bold text-lg text-white mb-2">Role Descriptions</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><span className="text-brand-red font-bold">User (Victim):</span> Triggers emergencies and alerts network.</li>
              <li><span className="text-brand-purple font-bold">Trusted Contact:</span> Instantly receives alerts from users.</li>
              <li><span className="text-brand-blue font-bold">Verified Helper:</span> Receives nearby alerts after 3 minutes.</li>
              <li><span className="text-gray-400 font-bold">Admin:</span> Central command dispatch and monitoring.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your details to join the safety network</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-brand-red p-4 rounded-r-md animate-slide-up">
                <p className="text-sm text-red-700 font-medium">{error}</p>
>>>>>>> Stashed changes
              </div>
            )}

            <div>
<<<<<<< Updated upstream
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={onChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={onChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-1">
                <select
                  name="role"
                  value={role}
                  onChange={onChange}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                >
                  <option value="user">User (Victim)</option>
                  <option value="trustedContact">Trusted Contact</option>
                  <option value="verifiedHelper">Verified Helper</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                {loading ? 'Registering...' : 'Register'}
=======
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={name}
                onChange={onChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-all sm:text-sm bg-white"
                placeholder="Jane Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-all sm:text-sm bg-white"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={onChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-all sm:text-sm bg-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Your Role
              </label>
              <select
                name="role"
                value={role}
                onChange={onChange}
                className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red sm:text-sm font-medium text-gray-700 cursor-pointer"
              >
                <option value="user">User (Victim)</option>
                <option value="trustedContact">Trusted Contact</option>
                <option value="verifiedHelper">Verified Helper</option>
                <option value="admin">Admin / Police Monitor</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white transition-all transform hover:-translate-y-0.5 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : 'Create Account'}
>>>>>>> Stashed changes
              </button>
            </div>
          </form>

<<<<<<< Updated upstream
          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                    Sign in here
                  </Link>
                </span>
              </div>
            </div>
=======
          <div className="text-center pt-4 pb-8">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-red hover:text-red-700 transition-colors">
                Sign in here
              </Link>
            </p>
>>>>>>> Stashed changes
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
