// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import '../css/Inventory.css';
import ItemCard from "./ItemCard";
import EditFormModal from "./EditFormModal";
import NewItemForm from "./NewItemForm";
import images from '../utils/images';
import Modal from './modal';

function InventoryList() {
  const [inventory, setInventory] = useState(() => {
    // Retrieve inventory from localStorage
    const storedInventory = localStorage.getItem("inventory");
    return storedInventory ? JSON.parse(storedInventory) : [];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItemFormOpen, setIsNewItemFormOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [updatedItem, setUpdatedItem] = useState('');
  


  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (updatedItem) => {
    const updatedInventory = inventory.map((item) =>
      item.id === updatedItem.id
        ? { ...updatedItem, lastUpdated: new Date().toLocaleString() }
        : item
    );
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    setIsModalOpen(false);
    // window.location.reload();
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

  const closeModal = () => {
    setShowNotification(false);
  }

  

  // Handle adding a new item
  const handleAddNewItem = (newItem) => {
    const newInventory = [
      ...inventory,
      { ...newItem, id: inventory.length + 1, lastUpdated: new Date().toLocaleString() },
    ];
    setInventory(newInventory);
    localStorage.setItem("inventory", JSON.stringify(newInventory));
    setIsNewItemFormOpen(false);
  };

  return (
    <div className="App">
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
      </div>

      {isModalOpen && (
        <EditFormModal
          item={selectedItem}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isNewItemFormOpen && (
        <NewItemForm
          onSave={handleAddNewItem}
          onClose={() => setIsNewItemFormOpen(false)}
        />
      )}
      <div className="add-item-btn" onClick={() => setIsNewItemFormOpen(true)}>
        <img src={images.add} alt="add" />
        <div>Add Inventory</div>
      </div>
    </div>
  );
}

export default InventoryList;
