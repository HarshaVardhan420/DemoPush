import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminDashboard = ({ onLogout }) => {
  const [supervisors, setSupervisors] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', centerName: '' });
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [stats, setStats] = useState({ supervisorCount: 0, workerCount: 0 });

  // Fetch all supervisors
  const fetchSupervisors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/supervisors');
      setSupervisors(res.data);
    } catch (err) {
      alert('Error fetching supervisors');
    }
  };

  // Fetch stats for chart
  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      alert('Error fetching stats');
    }
  };

  useEffect(() => {
    fetchSupervisors();
    fetchStats();
  }, []);

 const handleAdd = async () => {
  try {
    const supervisorData = {
      ...form,
      password: 'supervisor'  // 🔒 default password
    };

    await axios.post('http://localhost:5000/api/admin/supervisors', supervisorData);

    setForm({ name: '', email: '', phone: '', centerName: '' });
    fetchSupervisors();
    fetchStats();
  } catch (err) {
    alert('Error adding supervisor');
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/supervisors/${id}`);
      fetchSupervisors();
      fetchStats();
    } catch (err) {
      alert('Error deleting supervisor');
    }
  };

  const handleViewWorkers = async (supervisorId) => {
    setSelectedSupervisorId(supervisorId);
    try {
      const res = await axios.get(`http://localhost:5000/api/supervisor/${supervisorId}/workers`);
      setWorkers(res.data);
    } catch (err) {
      alert('Error fetching workers');
    }
  };

  const chartData = [
    { name: 'Supervisors', count: stats.supervisorCount },
    { name: 'Workers', count: stats.workerCount }
  ];

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={onLogout}>Logout</button>

      {/* 📊 Chart */}
      <h3>Statistics Overview</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Add Anganwadi Supervisor</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Center Name" value={form.centerName} onChange={e => setForm({ ...form, centerName: e.target.value })} />
      <button onClick={handleAdd}>Add Supervisor</button>

      <h3>All Supervisors</h3>
      <ul>
        {supervisors.map((sup) => (
          <li key={sup._id}>
            {sup.name} ({sup.centerName}) - {sup.phone}
            <button onClick={() => handleDelete(sup._id)}>Delete</button>
            <button onClick={() => handleViewWorkers(sup._id)}>View Workers</button>
          </li>
        ))}
      </ul>

      {selectedSupervisorId && (
        <div>
          <h3>Workers under selected Supervisor</h3>
          {workers.length === 0 ? (
            <p>No workers found.</p>
          ) : (
            <ul>
              {workers.map(worker => (
                <li key={worker._id}>
                  {worker.name} - {worker.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

