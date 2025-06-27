import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkerRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', supervisorId: '' });
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      const res = await axios.get('http://localhost:5000/api/admin/supervisors');
      setSupervisors(res.data);
    };
    fetchSupervisors();
  }, []);

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/worker/register', form);
      alert('Worker registered successfully');
      setForm({ name: '', email: '', phone: '', password: '', supervisorId: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h3>Worker Registration</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

      <select value={form.supervisorId} onChange={e => setForm({ ...form, supervisorId: e.target.value })}>
        <option value="">Select Supervisor</option>
        {supervisors.map(s => (
          <option key={s._id} value={s._id}>
            {s.name} ({s.centerName})
          </option>
        ))}
      </select>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default WorkerRegister;
