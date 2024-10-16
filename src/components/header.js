import React, { useEffect, useRef, useState } from 'react';
import '../css/Header.css';
import images from '../utils/images';
import Modal from './modal';

function Header({ header }) {
  const [inventory, setInventory] = useState(() => {
    const storedInventory = localStorage.getItem("inventory");
    return storedInventory ? JSON.parse(storedInventory) : [];
  });

  const [lowStock, setLowStock] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const lowStockItems = inventory.filter(item => item.itemsRemaining <= item.reorderLevel);
    setLowStock(lowStockItems);  // Only set the items that are low in stock
    setHighlight(lowStockItems.length > 0);  // Highlight notification if any item is low in stock
  }, [inventory]);

  const closeModal = () => {
    setShowLowStock(false);
  }

  return (
    <header className="header">
      <h1 className='header-title'>{header}</h1>
      <div onClick={() => {setShowLowStock(!showLowStock); setHighlight(false)}} className={`notification ${highlight ? 'highlight':''}`}>
        <img src={images.notification} alt='notification-bell'/>
      </div>
      {showLowStock && (
        <Modal show={showLowStock} quitModal={closeModal}/>
      )}
    </header>
  );
}

export default Header;
