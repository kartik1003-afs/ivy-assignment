import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('demo1@ivy.homes');
  const [password, setPassword] = useState('69674142f0');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/listings');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('69674142f0');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-md mb-3">
          🌿
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Ivy<span className="text-emerald-600">Homes</span> Property Portal
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Gurgaon City • Base URL: <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">solve.ivy.homes</code>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-2xl border border-gray-200 sm:px-10">
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="demo1@ivy.homes"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="69674142f0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>

          </form>

          {/* Quick Fill Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-3 text-center uppercase tracking-wider">
              Quick Select Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['demo1@ivy.homes', 'demo2@ivy.homes', 'demo3@ivy.homes'].map((demo) => (
                <button
                  key={demo}
                  type="button"
                  onClick={() => handleDemoFill(demo)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors ${
                    email === demo
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {demo.split('@')[0]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              Shared password: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">69674142f0</code>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
