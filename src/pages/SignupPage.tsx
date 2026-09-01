import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, Phone, Lock, User, ArrowRight } from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useHealthSaathi();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(phoneNumber)) { setError('Please enter a valid 10-digit phone number'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post('/users/register', { name, phoneNumber, password });
      localStorage.setItem('token', data.token);
      login({ _id: data._id, phoneNumber: data.phoneNumber, role: data.role, name: data.name });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 gradient-health rounded-2xl flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-primary-700">HealthSaathi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-1">Join thousands of patients managing their health</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card-lg border border-slate-100 p-8">
          {error && (
            <div className="hs-alert-error mb-6">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="hs-label">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="hs-input pl-10" placeholder="Enter your full name" required />
              </div>
            </div>

            <div>
              <label className="hs-label">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                  className="hs-input pl-10" placeholder="10-digit mobile number" maxLength={10} required />
              </div>
            </div>

            <div>
              <label className="hs-label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="hs-input pl-10 pr-10" placeholder="Minimum 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="hs-label">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="hs-input pl-10" placeholder="Re-enter your password" required />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center text-base py-3 mt-2">
              {isLoading
                ? <span className="flex items-center gap-2"><span className="hs-spinner w-4 h-4" />Creating account...</span>
                : <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
