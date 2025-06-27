import React, { useState } from 'react';
import axios from 'axios';

const RegisterSupervisor = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    centerName: '',
    password: ''
  });

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/supervisor/register', form);
      alert(res.data.message || 'Supervisor registered successfully ✅');
      setForm({ name: '', email: '', phone: '', centerName: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed ❌');
    }
  };

  return (
    <div>
      <h3>Supervisor Registration</h3>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        placeholder="Center Name"
        value={form.centerName}
        onChange={(e) => setForm({ ...form, centerName: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterSupervisor;
