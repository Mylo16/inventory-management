import React, { useEffect, useState } from 'react';
import '../css/Dashboard.css';
import images from '../utils/images';

function Dashboard() {
  const [inventory, setInventory] = useState(() => {
    // Retrieve inventory from localStorage
    const storedInventory = localStorage.getItem("inventory");
    return storedInventory ? JSON.parse(storedInventory) : [];
  });
  const [numberOfInventories, setNumberOfInventories] = useState(0);
  const [lowStocks, setLowStocks] = useState([]);

  useEffect(() => {
    let num = 0;
    inventory.forEach((item) => {
      num += Number(item.itemsBought);
    });
    setNumberOfInventories(num);
  }, [inventory]);

  useEffect(() => {
    const lowStockItems = inventory.filter(item => item.itemsRemaining <= item.reorderLevel);
    setLowStocks(lowStockItems);
  }, [inventory]);

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="dashboard-widgets">
        <div className="inventory-widget">
          <div className='inventory-header'>Total Inventory</div>
          <img className='inventory-pic' src={images.inventory} alt="Inventory Icon" />
          <div className='inventory-value'>{numberOfInventories}</div>
        </div>
        <div className="low-stock-widget">
          <div>Low Stocks</div>
          <img className='low-pic' src={images.low} alt="Low Stock Icon" />
          {lowStocks.length > 0 ? (
            lowStocks.map((stock, index) => (
              <div key={index}>
                <div>{stock.name}</div>
                <div>{stock.itemsRemaining}</div>
              </div>
            ))
          ) : (
            <div>Stocks are Enough</div>
          )}
        </div>
        <div className="widget">Recent Orders</div>
      </div>
    </div>
  );
}

export default Dashboard;
