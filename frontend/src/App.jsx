import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PortfolioDetail from './pages/PortfolioDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main portfolio list page */}
        <Route path="/" element={<Home />} />
        
        {/* Portfolio detail page with dynamic id parameter */}
        <Route path="/portfolio/:id" element={<PortfolioDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;