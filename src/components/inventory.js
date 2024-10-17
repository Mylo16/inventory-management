// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import '../css/Inventory.css';
import EditFormModal from "./EditFormModal";
import NewItemForm from "./NewItemForm";
import images from '../utils/images';
import Header from './header';
import { addDistributionData, addNewInventory, getDistributionData, getInventory, sortDistributionData, sortInventory, updateInventory } from '../utils/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { getBalance } from '../redux/inventorySlice';

function InventoryList() {
  const [inventory, setInventory] = useState(() => getInventory() || []);
  const [distributionData, setDistributionData] = useState(() => getDistributionData() || []);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [updatedItem, setUpdatedItem] = useState('');
  const [isPurchase, setIsPurchase] = useState(false);
  const { balance } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();

  useEffect(() => {
    setInventory(sortInventory(inventory));
    setDistributionData(sortDistributionData(distributionData));
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
    const existingInventoryIndex = inventory.findIndex(item => item.name === newItem.itemName);
    const existingItemIndex = distributionData.findIndex(item => item.itemName === newItem.itemName);
    let distributionItem = {};
    if (existingItemIndex !== -1) {
      const updatedDistributionData = distributionData.map((item, index) => {
        if(index === existingItemIndex) {
          dispatch(getBalance(Number(item.balance) - Number(newItem.issues)));
          distributionItem = {
            ...item,
            receipts: item.balance,
            balance,
            issues: newItem.issues,
            itemUseDate: new Date().toISOString()
          }
          return item;
        }   
        else {
          return item;
        }
      });
      updatedDistributionData.push(distributionItem);
      const updatedInventory = inventory.map((item) => 
        item.name === newItem.itemName ? {
          ...item, balance
        }
      : item);
      console.log(updatedInventory);
      updateInventory(sortInventory(updatedInventory));
      setDistributionData(sortDistributionData(updatedDistributionData));
      addDistributionData(sortDistributionData(updatedDistributionData));
      window.location.reload();
    }
    if (existingInventoryIndex !== -1 && existingItemIndex === -1) {
      const receipts = inventory[existingInventoryIndex].itemsBought;
      
      const newDistributionData = [
        ...distributionData,
        { ...newItem, receipts, balance, id: distributionData.length + 1, itemUseDate: new Date().toISOString() },
      ];

      const updatedInventory = inventory.map((item) => 
        item.name === newItem.itemName ? {
          ...item, balance
        }
      : item);
      updateInventory(sortInventory(updatedInventory));
      setDistributionData(sortDistributionData(newDistributionData));
      addDistributionData(sortDistributionData(newDistributionData));
      window.location.reload();
    }
  }

  const handleAddNewItem = (newItem) => {
    const existingItemIndex = inventory.findIndex(item => item.name === newItem.name);
    const existingDistributionDataIndex = distributionData.findIndex(item => item.itemName === newItem.name);
    
    if (existingItemIndex !== -1) {
      const balance = distributionData[existingDistributionDataIndex].balance;
      const updatedInventory = inventory.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              itemsBought: Number(item.itemsBought) + Number(newItem.itemsBought),
              itemBoughtDate: new Date().toISOString(),
              balance
            }
          : item
      );
  
      setInventory(sortInventory(updatedInventory));
      updateInventory(sortInventory(updatedInventory));
    } else {
      const newInventory = [
        ...inventory,
        { ...newItem, id: inventory.length + 1, itemBoughtDate: new Date().toISOString() },
      ];
      
      setInventory(sortInventory(newInventory));
      updateInventory(sortInventory(newInventory));
    }
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
              <td>{item.balance || item.itemsBought}</td>
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
          {distributionData.map((item, index) => (
            <tr key={index}>
              <td>{item.itemUseDate.split("T")[0]}</td>
              <td>{item.section}</td>
              <td>{item.recipient}</td>
              <td>{item.itemName}</td>
              <td>{item.receipts}</td>
              <td>{item.issues}</td>
              <td>{item.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditFormModal
        onSave={handleDistributeItem}
        isPurchase={false}
      />
      </>
      )}
      
      
    </div>
  );
}

export default InventoryList;
