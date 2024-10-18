import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { addInventory } from "../redux/inventorySlice";

function NewItemForm({ onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "consumable",
    itemsBought: "",
    itemsUsed: "",
    balance: 0,
    itemBoughtDate: "",
    reorderLevel: 10,
  });

  const [newForm, setNewForm] = useState(false);
  const [item, setItem] = useState({ value: "", label: "" });
  const [selectedItem, setSelectedItem] = useState(null);
  const { inventories } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();

  const closeModal = () => {
    setNewForm(false);
    setItem({ value: "", label: "" });
  };

  useEffect(() => {
    // Ensure click event only activates when the form is open
    if (newForm) {
      const handleClick = (event) => {
        if (
          !event.target.closest(".new-form-ctn") &&
          !event.target.closest(".new-item-btn")
        ) {
          closeModal();
        }
      };
      document.addEventListener("click", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
      };
    }
  }, [newForm]);

  const handleInventorySelect = (selectedOption) => {
    setSelectedItem(selectedOption);
    setFormData((prev) => ({
      ...prev,
      name: selectedOption.value,
    }));
  };

  const handleItemChange = (e) => {
    const { value } = e.target;
    setItem({ value, label: value });
  };
  
  const handleNewInventory = (e) => {
    e.preventDefault();
    const itemExists = inventories.some((invItem) => invItem.value.toLowerCase() === item.value.toLowerCase());
  
    if (itemExists) {
      alert("This item already exists in the inventory.");
    } else {
      dispatch(addInventory(item));
    }
    closeModal();
  };
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      if (name === "itemsBought" || name === "itemsUsed") {
        updatedData.balance =
          Number(updatedData.itemsBought) - Number(updatedData.itemsUsed);
      }

      if (name === "itemsBought") {
        updatedData.itemBoughtDate = new Date().toISOString();
        if(value === '' || /^[0-9]*$/.test(value)) {
          setFormData((prev) => (
            {...prev, [name]: value}
          ))
        }
      }
      if (name === "itemsUsed") {
        updatedData.itemUsedDate = new Date().toISOString();
        if(value === '' || /^[0-9]*$/.test(value)) {
          setFormData((prev) => (
            {...prev, [name]: value}
          ))
        }
      }

      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData((prev) => ({
      ...prev, itemsBought: 0, reorderLevel: 10
    }));
    setSelectedItem(null);
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
              required
              options={inventories}
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
              min="0"
              placeholder="Enter a positive number"
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
              min="0"
            />
          </label>
          <button type="submit">Add Item</button>
          <button
            className="new-item-btn"
            onClick={() => setNewForm(true)}
            type="button"
          >
            Add New Inventory Item
          </button>
        </form>
        {newForm && (
          <div className="new-form-overlay">
            <form onSubmit={handleNewInventory} className="new-form-ctn">
              <label>
                Item Name:
                <input required onChange={handleItemChange} value={item.value} />
              </label>
              <button type="submit">Create</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewItemForm;
