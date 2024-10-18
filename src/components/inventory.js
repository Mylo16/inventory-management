// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import '../css/Inventory.css';
import EditFormModal from "./EditFormModal";
import NewItemForm from "./NewItemForm";
import images from '../utils/images';
import Header from './header';
import { addDistributionData, addNewInventory, getDistributionData, getInventory, sortDistributionData, sortInventory, updateInventory } from '../utils/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { addDistribution, addPurchase } from '../redux/inventorySlice';

function InventoryList() {
  const [isPurchase, setIsPurchase] = useState(false);
  const { inventories, inventoriesAtDistribution, purchases, distributions } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();

  const handleDistributeItem = (newItem) => {
    dispatch(addDistribution({ newDistributionItem: newItem }));
    window.location.reload();
  }

  const handleAddNewPurchase = (newItem) => {
    dispatch(addPurchase({ newItem }));
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
          {purchases.map((item, index) => (
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
        onSave={handleAddNewPurchase}
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
          {distributions.map((item, index) => (
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
