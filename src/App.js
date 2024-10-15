import React, { useState, useEffect } from "react";
import './App.css';
import './css/Sidebar.css';
import images from "./utils/images";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Sidebar from './components/sidebar';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import Dashboard from "./components/dashboard";
import InventoryList from "./components/inventory";

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
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
