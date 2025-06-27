import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        email: email.trim(),
        password: password.trim()
      });

      alert(res.data.message || "Login successful");
      onLogin(); // switch to AdminDashboard
    } catch (err) {
      alert(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Enter admin email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default LoginPage;




