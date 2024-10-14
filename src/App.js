import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import EditFormModal from "./EditFormModal";
import NewItemForm from "./NewItemForm";
import './App.css';
import images from "./utils/images";

function App() {
  const [inventory, setInventory] = useState(() => {
    // Retrieve inventory from localStorage
    const storedInventory = localStorage.getItem("inventory");
    return storedInventory ? JSON.parse(storedInventory) : [];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItemFormOpen, setIsNewItemFormOpen] = useState(false);

  // Notification threshold
  const notificationThreshold = 10;

  // Handle opening of the edit form modal
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle saving changes in the inventory (for editing items)
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

  // Handle deleting an item
  const handleDelete = (itemId) => {
    const updatedInventory = inventory.filter((item) => item.id !== itemId);
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
  };

  // Check for low remaining items
  useEffect(() => {
    inventory.forEach((item) => {
      if (item.itemsRemaining <= notificationThreshold) {
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
              onDeleteClick={handleDelete} // Pass the delete function here
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

export default App;
