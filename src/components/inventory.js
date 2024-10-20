// src/components/InventoryList.js
import React, { useEffect, useRef, useState } from 'react';
import '../css/Inventory.css';
import EditFormModal from "./EditFormModal";
import NewItemForm from "./NewItemForm";
import images from '../utils/images';
import Header from './header';
import { useDispatch, useSelector } from 'react-redux';
import { addDistribution, addPurchase, sortPurchases, sortDistributions } from '../redux/inventorySlice';
import Modal from './modal';
import Select from 'react-select';

function InventoryList() {
  const tableHeaderRef = useRef(null);
  const tableBodyRef = useRef(null);
  const [isPurchase, setIsPurchase] = useState(false);
  const { purchases, distributions, sortPurchaseBy, sortDistributionBy } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();
  const [item, setItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [distributionItem, setDistributionItem] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [selectedDistribution, setSelectedDistribution] = useState(null);

  
  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    const audio = new Audio(images.successSound);
    audio.play();
  };
  
  const syncScroll = (source, target) => {
    target.current.scrollLeft = source.current.scrollLeft;
  };

  const handleDistributeItem = (newItem) => {
    const filteredLowStocks = purchases.filter((purchase) => purchase.name === newItem.itemName && purchase.balance - newItem.issues <= purchase.reorderLevel)
    if (filteredLowStocks.length > 0 ? filteredLowStocks[0].balance - newItem.issues <= 0 : false) {
      const audio = new Audio(images.alertSound);
      audio.play().then(() => {
        setTimeout(() => {
          alert(`There are few ${newItem.itemName} left. Can't distribute this amount`);
        }, 200);
      });

      return;
    }
    if (filteredLowStocks.length > 0) {
      setItem(filteredLowStocks);
      const audio = new Audio(images.alertSound);
      audio.play();
      setDistributionItem(newItem);

      return;
    } else {
      setItem(null);
    }
    dispatch(addDistribution({ newDistributionItem: newItem }));
    triggerSuccess();
  }

  const closeModal = () => {
    setItem(null);
    dispatch(addDistribution({ newDistributionItem: distributionItem }));
    triggerSuccess();
  }

  const handleAddNewPurchase = (newItem) => {
    dispatch(addPurchase({ newItem }));
    triggerSuccess();
  };

  const handleSortPurchase = (selectedOption) => {
    setSelectedPurchase(selectedOption);
    dispatch(sortPurchases(selectedOption));
  }

  const handleSortDistributions = (selectedOption) => {
    setSelectedDistribution(selectedOption);
    dispatch(sortDistributions(selectedOption));
  }
  
  return (
    <div className="App">
      <Header header={'Inventory Overview'}/>
      <div className={`success-message ${showSuccess ? 'display' : ''}`}>
        ✅ Created Successfully!!
      </div>
      <div className='toggle-stn-ctn'>
        <div onClick={() => setIsPurchase(true)} className={`purchase-stn ${isPurchase ? 'highlight': ''}`}>Purchase</div>
        <div onClick={() => setIsPurchase(false)} className={`distribution-stn ${!isPurchase ? 'highlight': ''}`}>Distribution</div>
      </div>
      {item && (<Modal item={item} quitModal={closeModal}/>)}
      {isPurchase ? (
        <>
          <Select
            id='sort-bar'
            placeholder= 'Sort by'
            onChange={handleSortPurchase}
            options={sortPurchaseBy}
            value={selectedPurchase}
          />
        <div className="table-container">
        <div ref={tableHeaderRef} onScroll={() => syncScroll(tableHeaderRef, tableBodyRef)} className='table-header'>

        <table>
        <thead>
          <tr>
            <th className='table-date'>Date</th>
            <th className='item'>Item</th>
            <th>Quantity</th>
            <th>Qnty Left</th>
          </tr>
        </thead>
        </table>
        </div>
        <div ref={tableBodyRef} onScroll={() => syncScroll(tableBodyRef, tableHeaderRef)} className='table-body'>
        <table>
        <tbody>
          {purchases.length > 0 ? (
            <>
              {purchases.map((item, index) => (
                <tr key={index}>
                  <td className='table-date'>{item.itemBoughtDate.split("T")[0]}</td>
                  <td className='item'>{item.name}</td>
                  <td>{Number(item.itemsBought)}</td>
                  <td>{Number(item.balance || item.itemsBought)}</td>
                </tr>
              ))}
            </>
          ):(<div className='no-items'><img src={images.addPic}/></div>)}
        </tbody>
      </table>
      </div>
      </div>

      <NewItemForm
        onSave={handleAddNewPurchase}
        isPurchase={true}
      />
      </>
      ):(
        <>
          <Select
            id='sort-bar'
            placeholder= 'Sort by'
            onChange={handleSortDistributions}
            options={sortDistributionBy}
            value={selectedDistribution}
          />
        <div className="table-container">
  <div ref={tableHeaderRef} onScroll={() => syncScroll(tableHeaderRef, tableBodyRef)} className='table-header'>
  <table>
    <thead>
      <tr>
        <th className='table-date'>Date</th>
        <th className="stn-data">Section</th>
        <th className='person'>Person</th>
        <th className='item'>Item</th>
        <th>Receipts</th>
        <th>Issues</th>
        <th>Balance</th>
      </tr>
    </thead>
  </table>
  </div>
  <div ref={tableBodyRef} onScroll={() => syncScroll(tableBodyRef, tableHeaderRef)} className='table-body'>
    <table>
    <tbody className="table-body">
      {distributions.length > 0 ? (
        <>
        {distributions.map((item, index) => (
        <tr className="table-row" key={index}>
          <td className='table-date'>{item.itemUseDate.split("T")[0]}</td>
          <td className='stn-data'>{item.section}</td>
          <td className='person'>{item.recipient}</td>
          <td className='item'>{item.itemName}</td>
          <td>{Number(item.receipts)}</td>
          <td>{Number(item.issues)}</td>
          <td>{Number(item.balance)}</td>
        </tr>
        ))}
        </>
      ):(<div className='no-items'><img src={images.addPic}/></div>)}
      
    </tbody>
    </table>
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
