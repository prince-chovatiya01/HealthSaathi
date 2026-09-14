import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, Phone, Lock, ArrowRight, Stethoscope, Shield, FileText } from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useHealthSaathi();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post('/users/login', { phoneNumber, password });
      localStorage.setItem('token', data.token);
      login({ _id: data._id, phoneNumber: data.phoneNumber, role: data.role, name: data.name });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Stethoscope, text: 'Book appointments with verified doctors' },
    { icon: FileText,    text: 'Manage your health records securely' },
    { icon: Shield,      text: 'Your data is encrypted and private' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-teal-900 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <div>
              <p className="text-white text-xl font-bold">HealthSaathi</p>
              <p className="text-white/60 text-xs font-medium tracking-wider uppercase">Healthcare Portal</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your health,<br />our priority.
          </h1>
          <p className="text-white/70 text-lg mb-12">
            Access world-class healthcare services from the comfort of your home.
          </p>
          <div className="space-y-5">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/80 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/40 text-sm">© 2025 HealthSaathi. All rights reserved.</p>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 gradient-health rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-primary-700">HealthSaathi</span>
          </div>

          <div className="bg-white rounded-3xl shadow-card-lg border border-slate-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 mt-1">Sign in to your healthcare portal</p>
            </div>

            {error && (
              <div className="hs-alert-error mb-6">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="hs-label">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="hs-input pl-10"
                    placeholder="Enter your 10-digit phone number"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="hs-label">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="hs-input pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-700">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center text-base py-3">
                {isLoading ? (
                  <span className="flex items-center gap-2"><span className="hs-spinner w-4 h-4" />Signing in...</span>
                ) : (
                  <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
                )}
              </button>
            </form>

            {/* ── Demo Credentials ── */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 text-center">Quick Demo Login</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '🛡 Admin',     phone: '9000000001', password: 'Admin@123' },
                  { label: '👤 Patient 1', phone: '9111111111', password: 'Patient@1' },
                  { label: '👤 Patient 2', phone: '9222222222', password: 'Patient@2' },
                  { label: '👤 Patient 3', phone: '9333333333', password: 'Patient@3' },
                ].map(({ label, phone, password: pw }) => (
                  <button
                    key={phone}
                    type="button"
                    onClick={() => { setPhoneNumber(phone); setPassword(pw); }}
                    className="text-left px-3 py-2 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <p className="text-xs font-semibold text-slate-700">{label}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{phone}</p>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-5">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">Create account</Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
