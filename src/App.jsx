import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setCurrentPage('dashboard');
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
    }

    if (user && currentPage === 'dashboard') {
      return <Dashboard user={user} onLogout={handleLogout} />;
    }

    if (currentPage === 'login') {
      return <Login onNavigate={setCurrentPage} onLogin={handleLogin} />;
    }

    if (currentPage === 'signup') {
      return <Signup onNavigate={setCurrentPage} onSignup={handleSignup} />;
    }

    return <Home onNavigate={setCurrentPage} />;
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {renderPage()}
    </Box>
  );
}

export default App;