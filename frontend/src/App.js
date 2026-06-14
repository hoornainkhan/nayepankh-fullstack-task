import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import VolunteerForm from './components/VolunteerForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Reports from './components/Reports';
import './App.css';

function App() {
  const [adminToken, setAdminToken] = React.useState(localStorage.getItem('adminToken'));

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          isAuthenticated={!!adminToken} 
          onLogout={handleLogout} 
        />
        
        <Routes>
          <Route path="/" element={<VolunteerForm />} />
          <Route 
            path="/admin/login" 
            element={
              adminToken ? 
                <Navigate to="/admin/dashboard" /> : 
                <AdminLogin onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              adminToken ? 
                <AdminDashboard token={adminToken} /> : 
                <Navigate to="/admin/login" />
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              adminToken ? 
                <Reports token={adminToken} /> : 
                <Navigate to="/admin/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;