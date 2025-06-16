import React, { useState } from 'react';

interface Props {
  phone: string;
  onVerified: (userData: any) => void;
}

const OTPVerification: React.FC<Props> = ({ phone, onVerified }) => {
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, otp }),
      });
      if (!res.ok) throw new Error('Invalid OTP');
      const data = await res.json();
      onVerified(data);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Enter the OTP sent to {phone}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOTP(e.target.value)}
        className="input"
      />
      <button disabled={!otp || loading} onClick={verifyOTP}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default OTPVerification;
