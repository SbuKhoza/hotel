import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Accommodations from './pages/Accommodations';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Rates from './pages/Rates';
import Specials from './pages/Specials';

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
        
      </Routes>
    </Router>
  );
}

export default App;