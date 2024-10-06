import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Accommodations from './pages/Accommodations';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Rates from './pages/Rates';
import Specials from './pages/Specials';
import Users from './pages/Users';
import Reservations from './pages/Reservations';
import Login from './pages/Login'
import Loader from './components/Loader'; // Import the Loader component

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading scenario (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      
      <AdminDashboard/>
      <Routes>
      
        <Route path="/" element={<Dashboard />} />
        <Route path="/guests" element={<Guests />} />
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/specials" element={<Specials />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </Router>
  );
}

export default App;