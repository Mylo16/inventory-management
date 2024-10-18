import React, { useEffect, useState } from 'react';
import '../css/Dashboard.css';
import images from '../utils/images';
import Header from './header';

function Dashboard() {
  const [inventory, setInventory] = useState(() => {
    // Retrieve inventory from localStorage
    const storedInventory = localStorage.getItem("inventory");
    return storedInventory ? JSON.parse(storedInventory) : [];
  });
  const [numberOfInventories, setNumberOfInventories] = useState(0);
  const [remainingInventories, setRemainingInventories] = useState(0);
  const [lowStocks, setLowStocks] = useState([]);

  useEffect(() => {
    let total = 0;
    let remaining = 0;
    inventory.forEach((item) => {
      total += Number(item.itemsBought);
      remaining += Number(item.balance);
    });
    setNumberOfInventories(total);
    setRemainingInventories(remaining);
  }, [inventory]);

  useEffect(() => {
    const lowStockItems = inventory.filter(item => item.balance <= item.reorderLevel);
    setLowStocks(lowStockItems);
  }, [inventory]);

  return (
    <>
    <Header header={'Dashboard Overview'}/>
    <div className="dashboard">
      <div className="dashboard-widgets">
        <div className="inventory-widget">
          <div className='inventory-header'>Total Inventory</div>
          <img className='inventory-pic' src={images.inventory} alt="Inventory Icon" />
          <div className='inventory-value'>{numberOfInventories}</div>
        </div>
        <div className="inventory-widget">
          <div className='inventory-header'>Remaining Inventory</div>
          <img className='inventory-pic' src={images.inventory} alt="Inventory Icon" />
          <div className='inventory-value'>{remainingInventories}</div>
        </div>
      </div>
      <div className="low-stock-widget">
          <div className="low-stock-header">Low Stocks</div>
          <img className='low-pic' src={images.low} alt="Low Stock Icon" />
          <div className='stock head'>
            <div className='stock-prop'>Stock</div>
            <div className='stock-value'>Remaining</div>
          </div>
          {lowStocks.length > 0 ? (
            lowStocks.map((stock, index) => (
              <div className='stock details' key={index}>
                <div className='stock-prop'>{stock.name}</div>
                <div className='stock-value'>{stock.balance}</div>
              </div>
            ))
          ) : (
            <div>Stocks are Enough</div>
          )}
        </div>
    </div>
    </>
  );
}

export default Dashboard;
