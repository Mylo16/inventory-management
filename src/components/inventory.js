// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import '../css/Inventory.css';
import ItemCard from "./ItemCard";
import EditFormModal from "./EditFormModal";
import NewItemForm from "./NewItemForm";
import images from '../utils/images';

function InventoryList() {
  const [inventory, setInventory] = useState(() => {
    // Retrieve inventory from localStorage
    const storedInventory = localStorage.getItem("inventory");
    return storedInventory ? JSON.parse(storedInventory) : [];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItemFormOpen, setIsNewItemFormOpen] = useState(false);


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
  };

  const handleDelete = (itemId) => {
    const updatedInventory = inventory.filter((item) => item.id !== itemId);
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
  };

  useEffect(() => {
    inventory.forEach((item) => {
      if (item.itemsRemaining <= item.reorderLevel) {
        alert(`${item.name} is running low. Consider ordering more.`);
      }
    });
  }, [inventory]);

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
       <h1 className="header">Inventory</h1>
       <div className="card-container">
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
