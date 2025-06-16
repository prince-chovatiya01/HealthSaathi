import React, { useState } from 'react';

interface Props {
  onOTPSent: (phone: string) => void;
}

const PhoneNumberInput: React.FC<Props> = ({ onOTPSent }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      onOTPSent(phone);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="input"
      />
      <button disabled={!phone || loading} onClick={sendOTP}>
        {loading ? 'Sending...' : 'Send OTP'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PhoneNumberInput;
