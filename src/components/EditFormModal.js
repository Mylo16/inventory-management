import React, { useState } from "react";

function EditFormModal({ item, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...item });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };

      // Update the remaining items automatically
      if (name === "itemsBought" || name === "itemsUsed") {
        updatedData.itemsRemaining =
          Number(updatedData.itemsBought) - Number(updatedData.itemsUsed);
      }

      // Set the date when items are bought or used
      if (name === "itemsBought") {
        updatedData.itemBoughtDate = new Date().toLocaleString();
      }
      if (name === "itemsUsed") {
        updatedData.itemUsedDate = new Date().toLocaleString();
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
        <h2>Edit Item</h2>
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
          <div className="grouped-labels">
          <label>
            Type:
            <select
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
          </div>
          <div className="grouped-labels">
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
          </div>
          <p>Items Remaining: {formData.itemsRemaining}</p>
          <button type="submit">Save</button>
        </form>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default EditFormModal;
