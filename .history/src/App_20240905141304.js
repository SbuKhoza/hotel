import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import adm


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
