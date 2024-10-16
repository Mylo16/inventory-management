// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import '../css/Inventory.css';
import ItemCard from "./ItemCard";
import EditFormModal from "./EditFormModal";
import NewItemForm from "./NewItemForm";
import images from '../utils/images';
import Modal from './modal';
import Header from './header';

function InventoryList() {
  const [inventory, setInventory] = useState(() => {
    // Retrieve inventory from localStorage
    const storedInventory = localStorage.getItem("inventory");
    return storedInventory ? JSON.parse(storedInventory) : [];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [updatedItem, setUpdatedItem] = useState('');
  const [isPurchase, setIsPurchase] = useState(false);
  const data = [
    { col1: 'Row 1 Col 1', col2: 'Row 1 Col 2', col3: 'Row 1 Col 3', col4: 'Row 1 Col 4' },
    { col1: 'Row 2 Col 1', col2: 'Row 2 Col 2', col3: 'Row 2 Col 3', col4: 'Row 2 Col 4' },
    { col1: 'Row 3 Col 1', col2: 'Row 3 Col 2', col3: 'Row 3 Col 3', col4: 'Row 3 Col 4' },
  ];


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
    setInventory(newInventory);
    localStorage.setItem("inventory", JSON.stringify(newInventory));
  };

  return (
    <div className="App">
      <Header header={'Inventory Overview'}/>

      {/* <div className="add-item-btn" onClick={() => setIsNewItemFormOpen(true)}>
        <img src={images.add} alt="add" />
        <div>Add Inventory</div>
      </div>
       <div className="card-container">
         {showNotification && (<Modal item={updatedItem} show={true} quitModal={closeModal}/>)}

         {inventory.length === 0 ? (
          <div className="no-items">
            <img src={images.addPic} alt="add-picture"/>
            <p>Empty: No items added</p>
          </div>
        ) : (
          inventory.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onEditClick={handleEditClick}
              onDeleteClick={handleDelete}
            />
          ))
        )}
      </div> */}
      <div className='toggle-stn-ctn'>
        <div onClick={() => setIsPurchase(true)} className={`purchase-stn ${isPurchase ? 'highlight': ''}`}>Purchase</div>
        <div onClick={() => setIsPurchase(false)} className='distribution-stn'>Distribution</div>
      </div>
      {isPurchase ? (
        <>
          <table className="styled-table">
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
            <th>Column 4</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.col1}</td>
              <td>{row.col2}</td>
              <td>{row.col3}</td>
              <td>{row.col4}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <NewItemForm
        onSave={handleAddNewItem}
      />
      </>
      ):(
        <>
        <table className="styled-table">
        <thead>
          <tr>
            <th>Column A</th>
            <th>Column B</th>
            <th>Column C</th>
            <th>Column D</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.col1}</td>
              <td>{row.col2}</td>
              <td>{row.col3}</td>
              <td>{row.col4}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <NewItemForm
        onSave={handleDistributeItem}
      />
      </>
      )}
      
      
    </div>
  );
}

export default InventoryList;
