import React, { useState } from 'react';
import axios from 'axios';

const SupervisorLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const login = async () => {
    try {
      const trimmedEmail = email.trim();
      const res = await axios.post('http://localhost:5000/api/supervisor/login', {
        email: trimmedEmail,
        password
      });
      alert(res.data.message);
      onLogin(res.data.supervisorId);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert('Invalid credentials');
    }
  };

  const handleForgotPassword = async () => {
    try {
      const trimmedEmail = email.trim();
      const res = await axios.post('http://localhost:5000/api/supervisor/forgot', {
        email: trimmedEmail
      });
      alert(res.data.message || 'OTP sent to your email');
      setOtpSent(true);
    } catch (err) {
      console.error('Forgot Password Error:', err.response?.data || err.message);
      alert('Error sending OTP');
    }
  };

  const handleResetPassword = async () => {
    try {
      const trimmedEmail = email.trim();
      const res = await axios.post('http://localhost:5000/api/supervisor/reset-password', {
        email: trimmedEmail,
        otp,
        newPassword
      });
      alert(res.data.message || 'Password reset successful');
      setShowForgot(false);
      setOtpSent(false);
      setOtp('');
      setNewPassword('');
    } catch (err) {
      console.error('Reset Password Error:', err.response?.data || err.message);
      alert('Invalid OTP or reset failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h3>Supervisor Login</h3>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <button onClick={login} style={{ width: '100%', padding: '10px' }}>
        Login
      </button>

      <button
        onClick={() => setShowForgot(true)}
        style={{
          background: 'none',
          border: 'none',
          color: 'blue',
          textDecoration: 'underline',
          cursor: 'pointer',
          marginTop: '10px',
          display: 'block',
        }}
      >
        Forgot Password?
      </button>

      {showForgot && (
        <div style={{ marginTop: '20px' }}>
          {!otpSent ? (
            <>
              <input
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />
              <button onClick={handleForgotPassword} style={{ width: '100%', padding: '10px' }}>
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />
              <input
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />
              <button onClick={handleResetPassword} style={{ width: '100%', padding: '10px' }}>
                Reset Password
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SupervisorLogin;
