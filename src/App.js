import React, { useState, useEffect } from "react";
import './App.css';
import './css/Sidebar.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Dashboard from "./components/dashboard";
import InventoryList from "./components/inventory";
import Footer from "./components/footer";
import Settings from "./components/settings";
import Reports from "./components/reports";
import Suppliers from "./components/suppliers";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Header />
        <div className="content-container">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
