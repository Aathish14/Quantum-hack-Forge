import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

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
      const response = await API.post('/auth/login', formData);
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
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
=======
    <div className="min-h-screen flex bg-white animate-fade-in">
      {/* Left Pane - Brand/Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-red to-brand-dark text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Safety Shield</h1>
          <p className="text-lg text-red-100 max-w-md">
            A real-time emergency response platform connecting victims, trusted contacts, and verified helpers instantly.
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-black bg-opacity-20 p-6 rounded-xl backdrop-blur-sm border border-white border-opacity-10 w-max">
            <p className="font-semibold text-xl">"Security at your fingertips."</p>
            <p className="text-sm text-gray-300 mt-1">Enterprise-grade protection network.</p>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-brand-red p-4 rounded-r-md animate-slide-up">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email address
                </label>
>>>>>>> Stashed changes
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={onChange}
<<<<<<< Updated upstream
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
=======
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-all sm:text-sm bg-white"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
>>>>>>> Stashed changes
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
<<<<<<< Updated upstream
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
=======
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-all sm:text-sm bg-white"
                  placeholder="••••••••"
>>>>>>> Stashed changes
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
<<<<<<< Updated upstream
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
=======
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white transition-all transform hover:-translate-y-0.5 ${
                  loading ? 'bg-red-400 cursor-not-allowed' : 'bg-brand-red hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
>>>>>>> Stashed changes
              </button>
            </div>
          </form>

<<<<<<< Updated upstream
          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                    Register here
                  </Link>
                </span>
              </div>
            </div>
=======
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link gap="2" to="/register" className="font-bold text-brand-red hover:text-red-700 transition-colors">
                Register here
              </Link>
            </p>
>>>>>>> Stashed changes
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
