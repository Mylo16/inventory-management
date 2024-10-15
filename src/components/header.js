// src/components/Header.js
import React from 'react';
import '../css/Header.css';

function Header() {
  return (
    <header className="header">
      <h1>Inventory Management</h1>
      <div className="user-actions">
        <button>Notifications</button>
      </div>
    </header>
  );
}

export default Header;
