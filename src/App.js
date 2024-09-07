import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Accommodations from './pages/Accommodations';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Rates from './pages/Rates';
import Specials from './pages/Specials';
import Users from './pages/Users';  // Import the new page
import Reservations from './pages/Reservations';  // Import the reservation page

function App() {
  return (
    <Router>
      <AdminDashboard />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/guests" element={<Guests />} />
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/specials" element={<Specials />} />
        <Route path="/users" element={<Users />} />  {/* Add the user route */}
        <Route path="/reservations" element={<Reservations />} /> {/* Add the reservations route */}
      </Routes>
    </Router>
  );
}

export default App;