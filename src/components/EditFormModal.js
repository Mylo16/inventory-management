import React, { useState } from "react";
import Select from "react-select";
import { getInventoryItems, sections } from "../utils/localStorage";

function EditFormModal({ onSave }) {
  const [formData, setFormData] = useState({
    itemName: "",
    issues: "",
    recipient: "",
    receipts: "",
    section: "",
    itemUseDate: "",
  });
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [sectionItems, setSectionItems] = useState(sections);
  const [inventoryItems, setInventoryItems] = useState(getInventoryItems() || []);


  const handleSectionSelect = (selectedOption) => {
    setSelectedSection(selectedOption);
    setFormData((prev) => ({
      ...prev,
      section: selectedOption.value,
    }));
  };

  const handleInventorySelect = (selectedOption) => {
    setSelectedInventory(selectedOption);
    setFormData((prev) => ({
      ...prev,
      itemName: selectedOption.value,
    }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => (
      { ...prev, [name]: value, itemUseDate: new Date().toISOString() }
    ));
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData((prev) => ({
      ...prev, issues: "", recipient: ""
    }));
    setSelectedSection(null);
    setSelectedInventory(null);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Distribution Form</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="inventory-select">
            Item Name:
            <Select
              id="inventory-select"
              value={selectedInventory}
              onChange={handleInventorySelect}
              required
              options={inventoryItems}
              isSearchable
              placeholder="Search for an item..."
            />
          </label>
          <label>
            Issues:
            <input
              type="number"
              name="issues"
              value={formData.issues}
              onChange={handleChange}
              required
              min="0"
            />
          </label>
          <label htmlFor="inventory-select">
            Section or Unit:
            <Select
              id="section-select"
              value={selectedSection}
              onChange={handleSectionSelect}
              required
              options={sectionItems}
              isSearchable
              placeholder="Search for an item..."
            />
          </label>
          <label>
            Recipient Name:
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default EditFormModal;
