// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Heart, ArrowRight } from 'lucide-react';
// import { useHealthSaathi } from '../context/HealthSaathiContext';
// import translations from '../utils/translations';
// import Button from '../components/common/Button';
// import Card from '../components/common/Card';

// const LoginPage = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const { login, language } = useHealthSaathi();
//   const navigate = useNavigate();
//   const t = translations[language];

//   const handleSendOtp = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
    
//     // Validate phone number (basic validation for demo)
//     if (!phoneNumber || phoneNumber.length < 10) {
//       setError('Please enter a valid phone number');
//       return;
//     }
    
//     setIsLoading(true);
    
//     // Simulate OTP sending
//     setTimeout(() => {
//       setOtpSent(true);
//       setIsLoading(false);
//     }, 1500);
//   };

//   const handleVerifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
    
//     // Validate OTP (basic validation for demo)
//     if (!otp || otp.length < 4) {
//       setError('Please enter a valid OTP');
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       // For demo, we'll accept any OTP
//       await login(phoneNumber);
//       navigate('/dashboard');
//     } catch (error) {
//       setError('Failed to verify OTP. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
//       <Card className="w-full max-w-md">
//         <div className="p-8">
//           <div className="text-center mb-6">
//             <Heart className="h-12 w-12 text-indigo-600 mx-auto" />
//             <h1 className="text-2xl font-bold mt-4 text-gray-800">{t.loginHeader}</h1>
//             <p className="text-gray-600 mt-2">
//               {otpSent ? 'Enter the OTP sent to your phone' : 'Login with your phone number'}
//             </p>
//           </div>
          
//           {error && (
//             <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
//               {error}
//             </div>
//           )}
          
//           {!otpSent ? (
//             <form onSubmit={handleSendOtp}>
//               <div className="mb-4">
//                 <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                   {t.phoneNumber}
//                 </label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                     +91
//                   </span>
//                   <input
//                     type="tel"
//                     id="phoneNumber"
//                     className="block w-full pl-12 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="9876543210"
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     maxLength={10}
//                   />
//                 </div>
//                 <p className="text-gray-500 text-xs mt-1">
//                   We'll send you a one-time password to this number
//                 </p>
//               </div>
              
//               <Button
//                 type="submit"
//                 fullWidth
//                 isLoading={isLoading}
//                 icon={<ArrowRight className="h-4 w-4" />}
//                 iconPosition="right"
//                 className="mt-2"
//               >
//                 {t.submit}
//               </Button>
//             </form>
//           ) : (
//             <form onSubmit={handleVerifyOtp}>
//               <div className="mb-4">
//                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
//                   {t.enterOTP}
//                 </label>
//                 <input
//                   type="text"
//                   id="otp"
//                   className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="• • • •"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   maxLength={6}
//                 />
//                 <p className="text-gray-500 text-xs mt-1">
//                   For demo, enter any OTP to login
//                 </p>
//               </div>
              
//               <Button
//                 type="submit"
//                 fullWidth
//                 isLoading={isLoading}
//                 icon={<ArrowRight className="h-4 w-4" />}
//                 iconPosition="right"
//                 className="mt-2"
//               >
//                 {t.verify}
//               </Button>
              
//               <div className="mt-4 text-center">
//                 <button
//                   type="button"
//                   className="text-indigo-600 text-sm hover:underline"
//                   onClick={() => setOtpSent(false)}
//                 >
//                   Change phone number
//                 </button>
//               </div>
//             </form>
//           )}
          
//           <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
//             By continuing, you agree to our Terms of Service and Privacy Policy
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import translations from '../utils/translations';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  type LanguageKey = keyof typeof translations;
  const { login, language } = useHealthSaathi();
  const navigate = useNavigate();
  const t = translations[language as LanguageKey];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);

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
            <h1 className="text-2xl font-bold mt-4 text-gray-800">{t.loginHeader}</h1>
            <p className="text-gray-600 mt-2">Login with your phone number and password</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
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
                />
              </div>
            </div>

            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="block w-full pr-10 px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
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
              onClick={() => navigate('/signup')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
