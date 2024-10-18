// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import '../css/Inventory.css';
import EditFormModal from "./EditFormModal";
import NewItemForm from "./NewItemForm";
import images from '../utils/images';
import Header from './header';
import { useDispatch, useSelector } from 'react-redux';
import { addDistribution, addPurchase } from '../redux/inventorySlice';
import Modal from './modal';

function InventoryList() {
  const [isPurchase, setIsPurchase] = useState(false);
  const { purchases, distributions } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();
  const [item, setItem] = useState(null);

  const handleDistributeItem = (newItem) => {
    const filteredLowStocks = purchases.filter((purchase) => purchase.name === newItem.itemName && purchase.balance < purchase.reorderLevel)
    if (filteredLowStocks[0].balance < 0) {
      alert(`There are no ${newItem.itemName} left`);
      return
    }
    setItem(filteredLowStocks.length === 0 ? null : filteredLowStocks);
    dispatch(addDistribution({ newDistributionItem: newItem }));
  }

  const closeModal = () => {
    setItem(null);
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
      {item && (<Modal item={item} quitModal={closeModal}/>)}
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
              <td>{Number(item.itemsBought)}</td>
              <td>{Number(item.balance || item.itemsBought)}</td>
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
<div className="table-ctn">
  <div className='table-sub-ctn'>
  <div className="table-header">
    <div className="table-row">
      <div className="table-cell">Date</div>
      <div className="table-cell">Section</div>
      <div className="table-cell">Person</div>
      <div className="table-cell">Item</div>
      <div className="table-cell">Receipts</div>
      <div className="table-cell">Issues</div>
      <div className="table-cell">Balance</div>
    </div>
  </div>
  <div className="table-body">
    <div className='table-sub-body'>
    {distributions.map((item, index) => (
      <div className="table-row" key={index}>
        <div className="table-cell">{item.itemUseDate.split("T")[0]}</div>
        <div className="table-cell">{item.section}</div>
        <div className="table-cell">{item.recipient}</div>
        <div className="table-cell">{item.itemName}</div>
        <div className="table-cell">{Number(item.receipts)}</div>
        <div className="table-cell">{Number(item.issues)}</div>
        <div className="table-cell">{Number(item.balance)}</div>
      </div>
    ))}
    </div>
  </div>
  </div>
</div>
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
