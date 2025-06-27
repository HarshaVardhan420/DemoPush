import React, { useState } from 'react';
import axios from 'axios';

const WorkerLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/worker/login', { email, password });
      alert('Login successful');
      onLogin(res.data.workerId, res.data.supervisorId); // pass both if needed
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h3>Worker Login</h3>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default WorkerLogin;
