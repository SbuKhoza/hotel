import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './Admin/AdminLogin';


function App() {
  return (
    <Router>
      <Routes>
     <div className='App'>
     <Route path="admin/login" element={<AdminLogin/>} />
     <Route path="admin/dashboard" element={<AdminDashboard/>} />
     </div>
     </Routes>
    </Router>
  )
}

export default App
