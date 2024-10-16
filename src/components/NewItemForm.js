import React, { useState } from "react";
import Select from "react-select";

function NewItemForm({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "consumable",
    itemsBought: 0,
    itemsUsed: 0,
    itemsRemaining: 0,
    itemBoughtDate: "",
    itemUsedDate: "",
    reorderLevel: 10,
  });

  const inventoryItems = [
    { value: 'item1', label: 'Inventory Item 1' },
    { value: 'item2', label: 'Inventory Item 2' },
    { value: 'item3', label: 'Inventory Item 3' },
    { value: 'item4', label: 'Inventory Item 4' },
  ];

  const [selectedItem, setSelectedItem] = useState(null);

  const handleInventorySelect = (selectedOption) => {
    setSelectedItem(selectedOption);
    setFormData((prev) => {
      return {...prev, name: selectedOption.value}
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };

      if (name === "itemsBought" || name === "itemsUsed") {
        updatedData.itemsRemaining =
          Number(updatedData.itemsBought) - Number(updatedData.itemsUsed);
      }

      if (name === "itemsBought") {
        updatedData.itemBoughtDate = new Date().toISOString();
      }
      if (name === "itemsUsed") {
        updatedData.itemUsedDate = new Date().toISOString();
      }

      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="new-item-header">Add New Item</div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="inventory-select">
            Select Inventory Item:
            <Select
              id="inventory-select"
              value={selectedItem}
              onChange={handleInventorySelect}
              options={inventoryItems}
              isSearchable
              placeholder="Search for an item..."
            />
          </label>
          <label>
            Type:
            <select
              className="select"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="consumable">Consumable</option>
              <option value="non-consumable">Non-Consumable</option>
            </select>
          </label>
          <label>
            Items Bought:
            <input
              type="number"
              name="itemsBought"
              value={formData.itemsBought}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Reorder Level:
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Add Item</button>
        </form>
      </div>
    </div>
  );
}

export default NewItemForm;
