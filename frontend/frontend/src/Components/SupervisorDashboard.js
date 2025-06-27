import React, { useState } from 'react';
import axios from 'axios';

const SupervisorDashboard = ({ supervisorId, onLogout }) => {
  const [workers, setWorkers] = useState([]);
  const [showWorkers, setShowWorkers] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [csvFile, setCsvFile] = useState(null);

  // Fetch workers from backend
  const handleViewWorkers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/supervisor/${supervisorId}/workers`);
      setWorkers(res.data);
      setShowWorkers(true);
    } catch (err) {
      alert('Failed to fetch workers');
    }
  };

  // Add a new worker
  const handleAddWorker = async () => {
    if (!newWorker.name || !newWorker.email || !newWorker.phone) {
      alert('Please fill all fields');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/supervisor/${supervisorId}/workers`, newWorker);
      alert('Worker added successfully');
      setNewWorker({ name: '', email: '', phone: '' });
      handleViewWorkers(); // refresh list
    } catch (err) {
      alert('Failed to add worker');
    }
  };

  // Upload CSV file
  const handleCsvUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('supervisorId', supervisorId);

    try {
      await axios.post('http://localhost:5000/api/supervisor/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('CSV uploaded successfully');
      setCsvFile(null);
      handleViewWorkers(); // refresh list
    } catch (error) {
      alert('Failed to upload CSV');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Supervisor Dashboard</h2>
      <button onClick={onLogout} style={{ marginBottom: '20px' }}>Logout</button>

      {/* Add Worker Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Add New Worker</h3>
        <input
          type="text"
          placeholder="Name"
          value={newWorker.name}
          onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newWorker.email}
          onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={newWorker.phone}
          onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
        />
        <button onClick={handleAddWorker}>Add Worker</button>
      </div>

      {/* Upload CSV Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Upload Workers via CSV</h3>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
        />
        <button onClick={handleCsvUpload}>Upload CSV</button>
      </div>

      {/* View Workers Section */}
      <div>
        <button onClick={handleViewWorkers}>View Workers</button>
        {showWorkers && (
          <div style={{ marginTop: '20px' }}>
            <h3>Registered Workers</h3>
            {workers.length === 0 ? (
              <p>No workers registered under you yet.</p>
            ) : (
              <ul>
                {workers.map((worker) => (
                  <li key={worker._id}>
                    {worker.name} | {worker.email} 
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorDashboard;
