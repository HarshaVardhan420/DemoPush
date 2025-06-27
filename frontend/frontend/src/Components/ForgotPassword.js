import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState(1);

  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/supervisor/forgot', { email });
      alert('OTP sent to your email');
      setStage(2);
    } catch (err) {
      alert('Failed to send OTP');
      console.error(err);
    }
  };

  // const resetPassword = async () => {
  //   try {
  //     await axios.post('http://localhost:5000/api/supervisor/reset-password', {
  //       email,
  //       otp,
  //       newPassword
  //     });
  //     alert('Password reset successful');
  //     setStage(1);
  //     setEmail('');
  //     setOtp('');
  //     setNewPassword('');
  //     if (onClose) onClose(); // Close the forgot password view
  //   } catch (err) {
  //     alert('Failed to reset password');
  //     console.error(err);
  //   }
  // };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Forgot Password</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '80%', padding: '8px', marginBottom: '10px' }}
      />

      {stage === 1 ? (
        <button onClick={sendOtp} style={{ padding: '10px 20px' }}>
          Send OTP
        </button>
      ) : (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            style={{ width: '80%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            style={{ width: '80%', padding: '8px', marginBottom: '10px' }}
          />
          <button onClick={resetPassword} style={{ padding: '10px 20px' }}>
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
