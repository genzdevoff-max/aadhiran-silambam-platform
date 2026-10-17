import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await adminApi.login({ email, password });
      if (data && data.token && data.user) {
        login(data.token, data.user);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid response from authentication server.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.message || 'Invalid credentials or inactive account.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(#020ee3_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson-600 to-crimson-900 text-gold-400 border border-gold-500/40 shadow-glow-crimson mb-4">
            <Shield className="w-8 h-8 text-gold-300" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-wider">
            AADHIRAN CMS
          </h2>
          <p className="mt-1 text-xs font-mono font-semibold text-gold-400 uppercase tracking-widest">
            Persatuan Aadhiran Silambam Pulau Pinang
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Secure Administrator & Content Management Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-crimson-950/80 border border-crimson-700/60 text-crimson-300 text-xs flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-crimson-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aadhiran.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-crimson-900/50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Admin CMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-charcoal-800 text-center">
            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-gold-400 transition-colors"
            >
              ← Return to Public Website
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-600 font-mono">
          Authorized personnel only. Access sessions and IP actions are audited.
        </p>
      </div>
    </div>
  );
};
