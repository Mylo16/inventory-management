// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import '../css/Inventory.css';
import ItemCard from "./ItemCard";
import EditFormModal from "./EditFormModal";
import NewItemForm from "./NewItemForm";
import images from '../utils/images';
import Modal from './modal';
import Header from './header';
import { getInventory, sortInventory, updateInventory } from '../utils/localStorage';

function InventoryList() {
  const [inventory, setInventory] = useState(() => getInventory() || []);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [updatedItem, setUpdatedItem] = useState('');
  const [isPurchase, setIsPurchase] = useState(false);

  useEffect(() => {
    setInventory(sortInventory(inventory));
  }, []);

  const handleSave = (updatedItem) => {
    const updatedInventory = inventory.map((item) =>
      item.id === updatedItem.id
        ? { ...updatedItem, lastUpdated: new Date().toLocaleString() }
        : item
    );
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    if(updatedItem.itemsRemaining <= updatedItem.reorderLevel) {
      setUpdatedItem(updatedItem);
      setShowNotification(true);
    }
  };

  const handleDelete = (itemId) => {
    const updatedInventory = inventory.filter((item) => item.id !== itemId);
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
  };

  const handleDistributeItem = (newItem) => {

  }

  // Handle adding a new item
  const handleAddNewItem = (newItem) => {
    const newInventory = [
      ...inventory,
      { ...newItem, id: inventory.length + 1, lastUpdated: new Date().toLocaleString() },
    ];
    setInventory(sortInventory(newInventory));
    updateInventory(sortInventory(newInventory));
  };

  return (
    <div className="App">
      <Header header={'Inventory Overview'}/>
      <div className='toggle-stn-ctn'>
        <div onClick={() => setIsPurchase(true)} className={`purchase-stn ${isPurchase ? 'highlight': ''}`}>Purchase</div>
        <div onClick={() => setIsPurchase(false)} className={`distribution-stn ${!isPurchase ? 'highlight': ''}`}>Distribution</div>
      </div>
      {isPurchase ? (
        <>
          <table className="styled-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Qnty Left</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item.itemBoughtDate.split("T")[0]}</td>
              <td>{item.name}</td>
              <td>{item.itemsBought}</td>
              <td>{item.itemsBought - 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <NewItemForm
        onSave={handleAddNewItem}
        isPurchase={true}
      />
      </>
      ):(
        <>
        <table className="styled-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Section</th>
            <th>Person</th>
            <th>Item</th>
            <th>Receipts</th>
            <th>Issues</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item.itemBoughtDate}</td>
              <td>{item.col2}</td>
              <td>{item.col3}</td>
              <td>{item.col4}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <NewItemForm
        onSave={handleDistributeItem}
        isPurchase={false}
      />
      </>
      )}
      
      
    </div>
  );
}

export default InventoryList;
