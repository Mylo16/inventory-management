import React, { useEffect, useRef, useState } from 'react';
import '../css/Header.css';
import images from '../utils/images';
import Modal from './modal';
import { useSelector } from 'react-redux';

function Header({ header }) {
  const { purchases } = useSelector((store) => store.inventory);
  const [showLowStock, setShowLowStock] = useState(false);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const lowStockItems = purchases.filter(item => item.balance <= item.reorderLevel);
    setHighlight(lowStockItems.length > 0);
  }, [purchases]);

  const closeModal = () => {
    setShowLowStock(false);
  }

  return (
    <header className="header">
      <div className='header-title'>{header}</div>
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
