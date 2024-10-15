// src/components/Header.js
import React, { useEffect, useState } from 'react';
import '../css/Header.css';
import images from '../utils/images';

function Header() {
  const [inventory, setInventory] = useState(() => {
    // Retrieve inventory from localStorage
    const storedInventory = localStorage.getItem("inventory");
    return storedInventory ? JSON.parse(storedInventory) : [];
  });

  const [lowStock, setLowStock] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    inventory.forEach((item) => {
      if (item.itemsRemaining <= item.reorderLevel) {
        setLowStock((prev) => [...prev, item]);
        setHighlight(true);
      }
    });
  }, [inventory]);

  const closeModal = () => {
    setShowLowStock(false);
  }

  useEffect(() => {
    const handleClick = (event) => {
      if (showLowStock && !event.target.closest('.notification-modal-content') && !event.target.closest('.notification')) {
        closeModal();
      }
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [showLowStock]);

  return (
    <header className="header">
      <h1>Inventory Management</h1>
      <div onClick={() => {setShowLowStock(!showLowStock); setHighlight(false)}} className={`notification ${highlight ? 'highlight':''}`}>
        <img src={images.notification} alt='notification-bell'/>
      </div>
      {showLowStock && (
        <div className='notification-modal'>
          <div className='notification-modal-content'>
            <div><img src={images.warninig}/></div>
            <div className='content-ctn'>
              {lowStock.map((stock, index) =>(
                <div key={index}>
                  {stock.name} is running Low !!
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
    </header>
  );
}

export default Header;
