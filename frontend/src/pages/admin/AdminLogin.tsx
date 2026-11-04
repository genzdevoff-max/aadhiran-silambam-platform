import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin/dashboard';

  // If already authenticated and not verifying token, redirect directly
  if (!authLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await adminApi.login({ email, password });
      if (data && data.token && data.user) {
        login(data.token, data.user);
        navigate(from, { replace: true });
      } else {
        setError('Invalid response from authentication server.');
      }
    } catch (err: unknown) {
      const errMsg = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message || 'Unable to sign in. Check your credentials and try again.'
        : 'Unable to sign in. Please try again.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login min-h-screen bg-[#FDFBF7] text-[#182332] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Subtle Heritage Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(#C6A04A_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#C6A04A]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#102137]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#102137] via-[#C6A04A] to-[#183B5B] p-0.5 shadow-xl mb-4 hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[14px] bg-white p-1 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Aadhiran Silambam Emblem" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#102137] tracking-tight">
            AADHIRAN CMS
          </h1>
          <p className="mt-1 text-xs font-mono font-semibold text-[#C6A04A] uppercase tracking-widest">
            Persatuan Aadhiran Silambam Pulau Pinang
          </p>
          <p className="mt-2 text-xs text-[#64748B]">
            Administrator & Content Management System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E3D9] rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          {error && (
            <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-[#102137] uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C6A04A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
                <input
                  type="email"
                  id="admin-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aadhiran.com"
                  autoComplete="username"
                  aria-invalid={!!error}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] placeholder-[#64748B] text-xs focus:outline-none focus:border-[#C6A04A] focus:ring-1 focus:ring-[#C6A04A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-[#102137] uppercase tracking-wider mb-2">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#C6A04A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!error}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#F8F5EE] border border-[#E8E3D9] text-[#182332] placeholder-[#64748B] text-xs focus:outline-none focus:border-[#C6A04A] focus:ring-1 focus:ring-[#C6A04A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#102137] transition-colors p-1 shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#102137] hover:bg-[#183B5B] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-md inline-flex items-center justify-center gap-2 border border-[#C6A04A]/60 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#D9B96E]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8E3D9] text-center">
            <Link
              to="/"
              className="text-xs text-[#64748B] hover:text-[#102137] font-medium transition-colors inline-flex items-center gap-1"
            >
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
