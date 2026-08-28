import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PortfolioDetail from './pages/PortfolioDetail';
import Guestbook from './pages/Guestbook';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main portfolio list page */}
        <Route path="/" element={<Home />} />

        {/* Portfolio detail page with dynamic id parameter */}
        <Route path="/portfolio/:id" element={<PortfolioDetail />} />
        
        {/* Guestbook page */}
        <Route path="/guestbook" element={<Guestbook />} />

        {/* Admin login page */}
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;