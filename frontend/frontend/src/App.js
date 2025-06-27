import React, { useState } from 'react';
import AdminLogin from './Components/LoginPage';
import SupervisorLogin from './Components/SupervisorLogin';
import SupervisorRegister from './Components/RegisterSupervisor';
import AdminDashboard from './Components/AdminDashboard';
import SupervisorDashboard from './Components/SupervisorDashboard';
import WorkerLogin from './Components/WorkerLogin';
import WorkerRegister from './Components/WorkerRegister';
import ForgotPassword from './Components/ForgotPassword'; // ✅ Added

function App() {
  const [userRole, setUserRole] = useState(null); // 'admin', 'supervisor', or 'worker'
  const [supervisorId, setSupervisorId] = useState(null);
  const [workerId, setWorkerId] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // ✅ Added

  const handleAdminLogin = () => {
    setUserRole('admin');
  };

  const handleSupervisorLogin = (id) => {
    setUserRole('supervisor');
    setSupervisorId(id);
  };

  const handleWorkerLogin = (id) => {
    setUserRole('worker');
    setWorkerId(id);
  };

  const handleLogout = () => {
    setUserRole(null);
    setSupervisorId(null);
    setWorkerId(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>NGO Management System</h1>

      {/* Admin Dashboard */}
      {userRole === 'admin' && <AdminDashboard onLogout={handleLogout} />}

      {/* Supervisor Dashboard */}
      {userRole === 'supervisor' && supervisorId && (
        <SupervisorDashboard supervisorId={supervisorId} onLogout={handleLogout} />
      )}

      {/* Worker Dashboard Placeholder */}
      {userRole === 'worker' && workerId && (
        <div style={{ textAlign: 'center' }}>
          <h2>Welcome, Worker</h2>
          <p>Your ID: <strong>{workerId}</strong></p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {/* Login/Register Section */}
      {!userRole && !showForgotPassword && (
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>

          {/* Admin */}
          <div style={{ border: '1px solid #ccc', padding: '20px', width: '300px', margin: '10px' }}>
            <h3>Admin Login</h3>
            <AdminLogin onLogin={handleAdminLogin} />
          </div>

          {/* Supervisor */}
          <div style={{ border: '1px solid #ccc', padding: '20px', width: '300px', margin: '10px' }}>
            <h3>Supervisor Login</h3>
            <SupervisorLogin onLogin={handleSupervisorLogin} />
            <button 
              onClick={() => setShowForgotPassword(true)} 
              style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline', marginTop: '5px' }}
            >
              Forgot Password?
            </button>
            <h4 style={{ marginTop: '10px' }}>Register</h4>
            <SupervisorRegister />
          </div>

          {/* Worker */}
          <div style={{ border: '1px solid #ccc', padding: '20px', width: '300px', margin: '10px' }}>
            <h3>Worker Login</h3>
            <WorkerLogin onLogin={handleWorkerLogin} />
            <h4 style={{ marginTop: '10px' }}>Register</h4>
            <WorkerRegister />
          </div>
        </div>
      )}

      {/* Forgot Password View */}
      {!userRole && showForgotPassword && (
        <div style={{ width: '400px', margin: '20px auto', border: '1px solid #ccc', padding: '20px' }}>
          <h3 style={{ textAlign: 'center' }}>Forgot Password</h3>
          <ForgotPassword onClose={() => setShowForgotPassword(false)} />
        </div>
      )}
    </div>
  );
}

export default App;
