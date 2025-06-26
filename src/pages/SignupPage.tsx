import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import translations from '../utils/translations';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, language } = useHealthSaathi();
  type LanguageKey = keyof typeof translations;
  const t = translations[language as LanguageKey];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ✅ Validate phone number
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // ✅ Confirm password check
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);

      // ✅ Call login() with full user object
      login({
        _id: data._id,
        phoneNumber: data.phoneNumber,
        role: data.role,
        name: data.name,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-6">
            <Heart className="h-12 w-12 text-indigo-600 mx-auto" />
            <h1 className="text-2xl font-bold mt-4 text-gray-800">{t.signupHeader}</h1>
            <p className="text-gray-600 mt-2">Create a new account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                {t.phoneNumber}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  +91
                </span>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="block w-full pl-12 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={10}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">Sign up as:</span>
              <div className="flex space-x-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === 'user'}
                    onChange={() => setRole('user')}
                    className="form-radio text-indigo-600"
                    disabled={isLoading}
                  />
                  <span className="ml-2">User</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                    className="form-radio text-indigo-600"
                    disabled={isLoading}
                  />
                  <span className="ml-2">Admin</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
              className="mt-2"
            >
              {t.submit}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm space-y-2">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
              disabled={isLoading}
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
