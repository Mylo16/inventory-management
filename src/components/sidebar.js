import React, { useEffect, useState } from 'react';
import '../css/Sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const links = ['/', '/inventory', '/reports', '/suppliers', '/settings'];
  const [activeLink, setActiveLink] = useState(links.indexOf(location.pathname));


  const handleLinkClicked = (index) => {
    setActiveLink(index);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    // Check if the click was inside the menu icon or links container
    if (isOpen && !event.target.closest('.nav') && !event.target.closest('.side-links')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className='nav'>
    <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
      <span className={`icon-bar ${isOpen ? 'rotate' : ''}`}></span>
      <span className={`icon-bar ${isOpen ? 'fade-out' : ''}`}></span>
      <span className={`icon-bar ${isOpen ? 'rotate-reverse' : ''}`}></span>
    </div>
    
      <div className={`links ${isOpen ? 'open' : ''}`}>
      <ul className='side-links'>
        <li className={`side-link ${activeLink === 0 ? 'active' : ''}`} onClick={() => handleLinkClicked(0)}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={`side-link ${activeLink === 1 ? 'active' : ''}`} onClick={() => handleLinkClicked(1)}>
          <Link to="/inventory">Inventoy</Link>
        </li>
        <li className={`side-link ${activeLink === 2 ? 'active' : ''}`} onClick={() => handleLinkClicked(2)}>
          <Link to="/reports">Reports</Link>
        </li>
        <li className={`side-link ${activeLink === 3 ? 'active' : ''}`} onClick={() => handleLinkClicked(3)}>
          <Link to="/suppliers">Suppliers</Link>
        </li>
        <li className={`side-link ${activeLink === 4 ? 'active' : ''}`} onClick={() => handleLinkClicked(4)}>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
      </div>
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </nav>

  );
}

export default Sidebar;
