import React, { useState } from "react";

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
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
            Items Used:
            <input
              type="number"
              name="itemsUsed"
              value={formData.itemsUsed}
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
          <p>Items Remaining: {formData.itemsRemaining}</p>
          <button type="submit">Add Item</button>
        </form>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default NewItemForm;
